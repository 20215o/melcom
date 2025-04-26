const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all order items
router.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM order_items');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching order items:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get order item by ID
router.get('/:id', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM order_items WHERE order_item_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching order item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new order item
router.post('/', async(req, res) => {
    try {
        const { order_id, product_id, quantity, unit_price } = req.body;
        const result = await db.query(
            'INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES ($1, $2, $3, $4) RETURNING *', [order_id, product_id, quantity, unit_price]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating order item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update order item
router.put('/:id', async(req, res) => {
    try {
        const { order_id, product_id, quantity, unit_price } = req.body;
        const result = await db.query(
            'UPDATE order_items SET order_id = $1, product_id = $2, quantity = $3, unit_price = $4 WHERE order_item_id = $5 RETURNING *', [order_id, product_id, quantity, unit_price, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order item not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating order item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete order item
router.delete('/:id', async(req, res) => {
    try {
        const result = await db.query('DELETE FROM order_items WHERE order_item_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order item not found' });
        }
        res.json({ message: 'Order item deleted successfully' });
    } catch (err) {
        console.error('Error deleting order item:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;