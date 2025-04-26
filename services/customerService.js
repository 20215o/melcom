const pool = require('../config/db');

const customerService = {
    getAllCustomers: async() => {
        const [rows] = await pool.query('SELECT * FROM Customer');
        return rows;
    },

    getCustomerById: async(id) => {
        const [rows] = await pool.query('SELECT * FROM Customer WHERE CustomerID = ?', [id]);
        return rows[0];
    },

    createCustomer: async(customer) => {
        const { CustomerName, Phone, Email, Address, LoyaltyPoints } = customer;
        const [result] = await pool.query(
            'INSERT INTO Customer (CustomerName, Phone, Email, Address, LoyaltyPoints) VALUES (?, ?, ?, ?, ?)', [CustomerName, Phone, Email, Address, LoyaltyPoints]
        );
        return result.insertId;
    },

    updateCustomer: async(id, customer) => {
        const { CustomerName, Phone, Email, Address, LoyaltyPoints } = customer;
        await pool.query(
            'UPDATE Customer SET CustomerName = ?, Phone = ?, Email = ?, Address = ?, LoyaltyPoints = ? WHERE CustomerID = ?', [CustomerName, Phone, Email, Address, LoyaltyPoints, id]
        );
    },

    deleteCustomer: async(id) => {
        await pool.query('DELETE FROM Customer WHERE CustomerID = ?', [id]);
    }
};

module.exports = customerService;