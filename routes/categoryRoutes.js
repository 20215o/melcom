const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all categories
router.get('/', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM categories');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching categories:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get category by ID
router.get('/:id', async(req, res) => {
    try {
        const result = await db.query('SELECT * FROM categories WHERE category_id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new category
router.post('/', async(req, res) => {
    try {
        const { name, description } = req.body;
        const result = await db.query(
            'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *', [name, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error creating category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update category
router.put('/:id', async(req, res) => {
    try {
        const { name, description } = req.body;
        const result = await db.query(
            'UPDATE categories SET name = $1, description = $2 WHERE category_id = $3 RETURNING *', [name, description, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error updating category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete category
router.delete('/:id', async(req, res) => {
    try {
        const result = await db.query('DELETE FROM categories WHERE category_id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;