const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all stock transfers
router.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM stock_transfers');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching stock transfers:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get stock transfer by ID
router.get('/:id', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM stock_transfers WHERE transfer_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock transfer not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching stock transfer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new stock transfer
router.post('/', async(req, res) => {
    try {
        const { product_id, from_branch_id, to_branch_id, quantity, transfer_date, status } = req.body;
        const result = await db.query(
            'INSERT INTO stock_transfers (product_id, from_branch_id, to_branch_id, quantity, transfer_date, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [product_id, from_branch_id, to_branch_id, quantity, transfer_date, status]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating stock transfer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update stock transfer
router.put('/:id', async(req, res) => {
    try {
        const { product_id, from_branch_id, to_branch_id, quantity, transfer_date, status } = req.body;
        const result = await db.query(
            'UPDATE stock_transfers SET product_id = $1, from_branch_id = $2, to_branch_id = $3, quantity = $4, transfer_date = $5, status = $6 WHERE transfer_id = $7 RETURNING *', [product_id, from_branch_id, to_branch_id, quantity, transfer_date, status, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock transfer not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating stock transfer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete stock transfer
router.delete('/:id', async(req, res) => {
    try {
        const result = await db.query('DELETE FROM stock_transfers WHERE transfer_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Stock transfer not found' });
        }
        res.json({ message: 'Stock transfer deleted successfully' });
    } catch (err) {
        console.error('Error deleting stock transfer:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;