const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'new_password',
    database: process.env.DB_NAME || 'Melcom',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    acquireTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the database');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to the database:', err);
        console.error('Please check:');
        console.error('1. MySQL service is running');
        console.error('2. Database credentials are correct');
        console.error('3. Database exists');
        console.error('4. Port is accessible');
        console.error('5. Environment variables are set correctly');
    });

module.exports = pool;