const db = require('../db');

// Generic function to handle database queries
async function query(sql, params = []) {
    let connection;
    try {
        connection = await db.getConnection();
        const [results] = await connection.query(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = { query };