const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all employees
router.get('/', async(req, res) => {
    try {
        const results = await db.query('SELECT * FROM employees');
        res.json(results);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get employee by ID
router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const results = await db.query('SELECT * FROM employees WHERE id = ?', [id]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json(results[0]);
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new employee
router.post('/', async(req, res) => {
    try {
        const { name, email, phone, position, department } = req.body;

        if (!name || !email || !position) {
            return res.status(400).json({ error: 'Name, email, and position are required' });
        }

        const result = await db.query(
            'INSERT INTO employees (name, email, phone, position, department) VALUES (?, ?, ?, ?, ?)', [name, email, phone, position, department]
        );

        res.status(201).json({
            id: result.insertId,
            name,
            email,
            phone,
            position,
            department
        });
    } catch (err) {
        console.error('Error creating employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update employee
router.put('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, position, department } = req.body;

        const result = await db.query(
            'UPDATE employees SET name = ?, email = ?, phone = ?, position = ?, department = ? WHERE id = ?', [name, email, phone, position, department, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({
            id,
            name,
            email,
            phone,
            position,
            department
        });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete employee
router.delete('/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM employees WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;