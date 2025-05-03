const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'mysql-349059be-claudetomo20-12fe.d.aivencloud.com',
        user: process.env.DB_USER || 'avnadmin',
        password: process.env.DB_PASSWORD || 'AVNS_S3N89cYemtIUynpCMq4',
        database: process.env.DB_NAME || 'defaultdb',
        ssl: {
            ca: fs.readFileSync(path.join(__dirname, 'melcom-ssl-public-cert.cert')),
            rejectUnauthorized: true
        }
    });

    try {
        // Read and execute the schema file
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const statements = schema.split(';').filter(statement => statement.trim());

        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
                console.log('Executed:', statement.split('\n')[0]);
            }
        }

        console.log('Database setup completed successfully!');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await connection.end();
    }
}

setupDatabase();