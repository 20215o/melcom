const db = require('../db');

// Generic function to handle database queries
async function query(sql, params = []) {
    try {
        const [results] = await db.query(sql, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}

module.exports = { query };