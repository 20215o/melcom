const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all suppliers
router.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM suppliers');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching suppliers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get supplier by ID
router.get('/:id', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM suppliers WHERE supplier_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching supplier:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new supplier
router.post('/', async(req, res) => {
    try {
        const { name, contact_person, email, phone, address } = req.body;
        const result = await db.query(
            'INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *', [name, contact_person, email, phone, address]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating supplier:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update supplier
router.put('/:id', async(req, res) => {
    try {
        const { name, contact_person, email, phone, address } = req.body;
        const result = await db.query(
            'UPDATE suppliers SET name = $1, contact_person = $2, email = $3, phone = $4, address = $5 WHERE supplier_id = $6 RETURNING *', [name, contact_person, email, phone, address, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating supplier:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete supplier
router.delete('/:id', async(req, res) => {
    try {
        const result = await db.query('DELETE FROM suppliers WHERE supplier_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }
        res.json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        console.error('Error deleting supplier:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;