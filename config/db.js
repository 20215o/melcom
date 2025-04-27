const mysql = require('mysql2/promise');
require('dotenv').config();

// Log environment variables (for debugging, remove in production)
console.log('Database Configuration:', {
    host: 'SG-melcom-12426-mysql-master.servers.mongodirector.com',
    user: 'sgroot',
    database: 'melcom',
    port: 3306
});

const pool = mysql.createPool({
    host: 'SG-melcom-12426-mysql-master.servers.mongodirector.com',
    user: 'sgroot',
    password: process.env.DB_PASSWORD,
    database: 'melcom',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        rejectUnauthorized: true
    }
});

// Test the connection
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to ScaleGrid MySQL database');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to ScaleGrid MySQL database:', err);
        console.error('Please check:');
        console.error('1. Your ScaleGrid credentials');
        console.error('2. Network connectivity');
        console.error('3. SSL configuration');
    });

module.exports = pool;