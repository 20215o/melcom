const jwt = require('jsonwebtoken');
const pool = require('../db');

const isAuthenticated = async(req, res, next) => {
    try {
        console.log('Auth middleware - Checking authentication...');
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader);
        const token = authHeader && authHeader.split(' ')[1];
        console.log('Token:', token ? 'Present' : 'Missing');

        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        console.log('Decoded token:', decoded);

        const [users] = await pool.query('SELECT * FROM Users WHERE UserID = ?', [decoded.userId]);
        console.log('User found:', users.length > 0);

        if (!users.length) {
            console.log('User not found in database');
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = users[0];
        console.log('Authentication successful');
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ message: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    console.log('Checking admin status...');
    if (!req.user || !req.user.IsAdmin) {
        console.log('User is not admin');
        return res.status(403).json({ message: 'Admin access required' });
    }
    console.log('User is admin');
    next();
};

module.exports = { isAuthenticated, isAdmin };