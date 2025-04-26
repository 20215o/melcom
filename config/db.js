const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'new_password',
    database: 'Melcom',
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
        console.error('3. Database "Melcom" exists');
        console.error('4. Port 3306 is accessible');
    });

module.exports = pool;