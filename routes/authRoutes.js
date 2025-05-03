const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// Debug middleware for auth routes
router.use((req, res, next) => {
    console.log('Auth route hit:', req.method, req.url);
    next();
});

// Verify token route
router.get('/verify', async(req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        const [users] = await pool.query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);
        if (!users.length) {
            return res.status(401).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: users[0].UserID,
                email: users[0].Email,
                isAdmin: users[0].IsAdmin
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Signup route
router.post('/signup', async(req, res) => {
    try {
        console.log('Signup request:', req.body);
        const { email, password } = req.body;

        // Check if user already exists
        const [existingUsers] = await pool.query('SELECT * FROM Users WHERE Email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const [result] = await pool.query(
            'INSERT INTO Users (Email, Password) VALUES (?, ?)', [email, hashedPassword]
        );

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login route
router.post('/login', async(req, res) => {
    try {
        console.log('Login request:', req.body);
        const { email, password } = req.body;

        // Find user
        const [users] = await pool.query('SELECT * FROM Users WHERE Email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Verify password
        const validPassword = await bcrypt.compare(password, user.Password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.UserID, isAdmin: user.IsAdmin },
            process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.UserID,
                email: user.Email,
                isAdmin: user.IsAdmin
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    // Since we're using JWT, the client just needs to remove the token
    res.json({ message: 'Logged out successfully' });
});

module.exports = router;