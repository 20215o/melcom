const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'mysql-349059be-claudetomo20-12fe.d.aivencloud.com',
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD || 'AVNS_S3N89cYemtIUynpCMq4',
    database: process.env.DB_NAME || 'defaultdb',
    waitForConnections: true,
    port: process.env.DB_PORT || 22991,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000,
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, 'ca.pem')),
        rejectUnauthorized: true
    }
});

pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to Aiven MySQL database');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to Aiven MySQL database:', err.message);
        process.exit(1);
    });

module.exports = pool;