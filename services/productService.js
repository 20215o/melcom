const pool = require('../config/db');

const productService = {
    getAllProducts: async() => {
        const [rows] = await pool.query(`
            SELECT p.*, pc.CategoryName, s.SupplierName 
            FROM Product p
            LEFT JOIN ProductCategory pc ON p.CategoryID = pc.CategoryID
            LEFT JOIN Supplier s ON p.SupplierID = s.SupplierID
        `);
        return rows;
    },

    getProductById: async(id) => {
        const [rows] = await pool.query(`
            SELECT p.*, pc.CategoryName, s.SupplierName 
            FROM Product p
            LEFT JOIN ProductCategory pc ON p.CategoryID = pc.CategoryID
            LEFT JOIN Supplier s ON p.SupplierID = s.SupplierID
            WHERE p.ProductID = ?
        `, [id]);
        return rows[0];
    },

    createProduct: async(product) => {
        const { ProductName, CategoryID, Price, QuantityInStock, SupplierID } = product;
        const [result] = await pool.query(`
            INSERT INTO Product (ProductName, CategoryID, Price, QuantityInStock, SupplierID)
            VALUES (?, ?, ?, ?, ?)
        `, [ProductName, CategoryID, Price, QuantityInStock, SupplierID]);
        return result.insertId;
    },

    updateProduct: async(id, product) => {
        const { ProductName, CategoryID, Price, QuantityInStock, SupplierID } = product;
        await pool.query(`
            UPDATE Product 
            SET ProductName = ?, CategoryID = ?, Price = ?, QuantityInStock = ?, SupplierID = ?
            WHERE ProductID = ?
        `, [ProductName, CategoryID, Price, QuantityInStock, SupplierID, id]);
    },

    deleteProduct: async(id) => {
        await pool.query('DELETE FROM Product WHERE ProductID = ?', [id]);
    }
};

module.exports = productService;