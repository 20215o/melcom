const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all payments
router.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM payments');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching payments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get payment by ID
router.get('/:id', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM payments WHERE payment_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching payment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new payment
router.post('/', async(req, res) => {
    try {
        const { order_id, amount, payment_method, payment_status, payment_date } = req.body;
        const result = await db.query(
            'INSERT INTO payments (order_id, amount, payment_method, payment_status, payment_date) VALUES ($1, $2, $3, $4, $5) RETURNING *', [order_id, amount, payment_method, payment_status, payment_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating payment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update payment
router.put('/:id', async(req, res) => {
    try {
        const { order_id, amount, payment_method, payment_status, payment_date } = req.body;
        const result = await db.query(
            'UPDATE payments SET order_id = $1, amount = $2, payment_method = $3, payment_status = $4, payment_date = $5 WHERE payment_id = $6 RETURNING *', [order_id, amount, payment_method, payment_status, payment_date, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating payment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete payment
router.delete('/:id', async(req, res) => {
    try {
        const result = await db.query('DELETE FROM payments WHERE payment_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Payment not found' });
        }
        res.json({ message: 'Payment deleted successfully' });
    } catch (err) {
        console.error('Error deleting payment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;