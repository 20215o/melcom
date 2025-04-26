const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all refunds
router.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM refunds');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching refunds:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get refund by ID
router.get('/:id', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM refunds WHERE refund_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Refund not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching refund:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new refund
router.post('/', async(req, res) => {
    try {
        const { order_id, amount, reason, refund_status, refund_date } = req.body;
        const result = await db.query(
            'INSERT INTO refunds (order_id, amount, reason, refund_status, refund_date) VALUES ($1, $2, $3, $4, $5) RETURNING *', [order_id, amount, reason, refund_status, refund_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating refund:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update refund
router.put('/:id', async(req, res) => {
    try {
        const { order_id, amount, reason, refund_status, refund_date } = req.body;
        const result = await db.query(
            'UPDATE refunds SET order_id = $1, amount = $2, reason = $3, refund_status = $4, refund_date = $5 WHERE refund_id = $6 RETURNING *', [order_id, amount, reason, refund_status, refund_date, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Refund not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating refund:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete refund
router.delete('/:id', async(req, res) => {
    try {
        const result = await db.query('DELETE FROM refunds WHERE refund_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Refund not found' });
        }
        res.json({ message: 'Refund deleted successfully' });
    } catch (err) {
        console.error('Error deleting refund:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;