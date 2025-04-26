const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all returns
router.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM returns');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching returns:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get return by ID
router.get('/:id', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM returns WHERE return_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Return not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching return:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new return
router.post('/', async(req, res) => {
    try {
        const { order_id, return_reason, return_status, return_date } = req.body;
        const result = await db.query(
            'INSERT INTO returns (order_id, return_reason, return_status, return_date) VALUES ($1, $2, $3, $4) RETURNING *', [order_id, return_reason, return_status, return_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating return:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update return
router.put('/:id', async(req, res) => {
    try {
        const { order_id, return_reason, return_status, return_date } = req.body;
        const result = await db.query(
            'UPDATE returns SET order_id = $1, return_reason = $2, return_status = $3, return_date = $4 WHERE return_id = $5 RETURNING *', [order_id, return_reason, return_status, return_date, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Return not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating return:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete return
router.delete('/:id', async(req, res) => {
    try {
        const result = await db.query('DELETE FROM returns WHERE return_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Return not found' });
        }
        res.json({ message: 'Return deleted successfully' });
    } catch (err) {
        console.error('Error deleting return:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;