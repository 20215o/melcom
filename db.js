const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

// Create the pool directly
// melcom-ssl-public-cert.cert
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'SG-melcom-12426-mysql-master.servers.mongodirector.com',
    user: process.env.DB_USER || 'sgroot',
    password: process.env.DB_PASSWORD || '6jDSGisNpA2u9-uv',
    database: 'melcom',
    waitForConnections: true,
    port: 3306,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
        ca: fs.readFileSync("melcom-ssl-public-cert.cert"),
    },
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