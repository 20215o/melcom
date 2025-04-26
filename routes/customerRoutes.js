const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all customers
router.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM customers');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get customer by ID
router.get('/:id', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM customers WHERE customer_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching customer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new customer
router.post('/', async(req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const result = await db.query(
            'INSERT INTO customers (name, email, phone, address) VALUES ($1, $2, $3, $4) RETURNING *', [name, email, phone, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating customer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update customer
router.put('/:id', async(req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        const result = await db.query(
            'UPDATE customers SET name = $1, email = $2, phone = $3, address = $4 WHERE customer_id = $5 RETURNING *', [name, email, phone, address, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating customer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete customer
router.delete('/:id', async(req, res) => {
    try {
        const result = await db.query('DELETE FROM customers WHERE customer_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        res.json({ message: 'Customer deleted successfully' });
    } catch (err) {
        console.error('Error deleting customer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;