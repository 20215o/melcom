const pool = require('../config/db');

const supplierService = {
    getAllSuppliers: async() => {
        const [rows] = await pool.query('SELECT * FROM Supplier');
        return rows;
    },

    getSupplierById: async(id) => {
        const [rows] = await pool.query('SELECT * FROM Supplier WHERE SupplierID = ?', [id]);
        return rows[0];
    },

    createSupplier: async(supplier) => {
        const { SupplierName, ContactPerson, Phone, Email, Address } = supplier;
        const [result] = await pool.query(
            'INSERT INTO Supplier (SupplierName, ContactPerson, Phone, Email, Address) VALUES (?, ?, ?, ?, ?)', [SupplierName, ContactPerson, Phone, Email, Address]
        );
        return result.insertId;
    },

    updateSupplier: async(id, supplier) => {
        const { SupplierName, ContactPerson, Phone, Email, Address } = supplier;
        await pool.query(
            'UPDATE Supplier SET SupplierName = ?, ContactPerson = ?, Phone = ?, Email = ?, Address = ? WHERE SupplierID = ?', [SupplierName, ContactPerson, Phone, Email, Address, id]
        );
    },

    deleteSupplier: async(id) => {
        await pool.query('DELETE FROM Supplier WHERE SupplierID = ?', [id]);
    }
};

module.exports = supplierService;