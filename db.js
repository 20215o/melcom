const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'SG-melcom-12426-mysql-master.servers.mongodirector.com',
    user: process.env.DB_USER || 'sgroot',
    password: process.env.DB_PASSWORD || '6jDSGisNpA2u9-uv',
    database: 'Melcom',
    waitForConnections: true,
    port: 3306,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // ADD THIS!
    ssl: {
        ca: fs.readFileSync(path.join(__dirname, 'melcom-ssl-public-cert.cert')), // USE SAFE PATH
    },
});

pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to ScaleGrid MySQL database');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to ScaleGrid MySQL database:', err.message);
        process.exit(1); // <-- EXIT if DB is broken, don't let server stay pending
    });

module.exports = pool;