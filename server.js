const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Debug middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Headers:', req.headers);
    if (req.body) console.log('Body:', req.body);
    next();
});

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for development
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const apiRoutes = require('./routes/apiRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes); // This will be protected by auth middleware

// Debug route to check if auth routes are working
app.get('/api/auth/test', (req, res) => {
    console.log('Test route hit');
    res.json({ message: 'Auth routes are working' });
});

// Serve the main page with authentication check
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Something went wrong!',
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    console.log('404 - Route not found:', req.method, req.url);
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
});