const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all stock adjustments
router.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM stock_adjustments');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching stock adjustments:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get stock adjustment by ID
router.get('/:id', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM stock_adjustments WHERE adjustment_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock adjustment not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching stock adjustment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new stock adjustment
router.post('/', async(req, res) => {
    try {
        const { product_id, adjustment_type, quantity, reason, adjustment_date } = req.body;
        const result = await db.query(
            'INSERT INTO stock_adjustments (product_id, adjustment_type, quantity, reason, adjustment_date) VALUES ($1, $2, $3, $4, $5) RETURNING *', [product_id, adjustment_type, quantity, reason, adjustment_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating stock adjustment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update stock adjustment
router.put('/:id', async(req, res) => {
    try {
        const { product_id, adjustment_type, quantity, reason, adjustment_date } = req.body;
        const result = await db.query(
            'UPDATE stock_adjustments SET product_id = $1, adjustment_type = $2, quantity = $3, reason = $4, adjustment_date = $5 WHERE adjustment_id = $6 RETURNING *', [product_id, adjustment_type, quantity, reason, adjustment_date, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock adjustment not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating stock adjustment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete stock adjustment
router.delete('/:id', async(req, res) => {
    try {
        const result = await db.query('DELETE FROM stock_adjustments WHERE adjustment_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock adjustment not found' });
        }
        res.json({ message: 'Stock adjustment deleted successfully' });
    } catch (err) {
        console.error('Error deleting stock adjustment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;