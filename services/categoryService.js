const pool = require('../config/db');

const categoryService = {
    getAllCategories: async() => {
        const [rows] = await pool.query('SELECT * FROM ProductCategory');
        return rows;
    },

    getCategoryById: async(id) => {
        const [rows] = await pool.query('SELECT * FROM ProductCategory WHERE CategoryID = ?', [id]);
        return rows[0];
    },

    createCategory: async(category) => {
        const { CategoryName } = category;
        const [result] = await pool.query('INSERT INTO ProductCategory (CategoryName) VALUES (?)', [CategoryName]);
        return result.insertId;
    },

    updateCategory: async(id, category) => {
        const { CategoryName } = category;
        await pool.query('UPDATE ProductCategory SET CategoryName = ? WHERE CategoryID = ?', [CategoryName, id]);
    },

    deleteCategory: async(id) => {
        await pool.query('DELETE FROM ProductCategory WHERE CategoryID = ?', [id]);
    }
};

module.exports = categoryService;