const express = require('express');
const router = express.Router();
const { query } = require('../utils/dbUtils');

// Get all orders with related data
router.get('/', async(req, res) => {
    try {
        const orders = await query(`
            SELECT o.*, 
                   c.Name as CustomerName,
                   e.Name as EmployeeName,
                   p.ProductName
            FROM \`Order\` o
            LEFT JOIN Customer c ON o.CustomerID = c.CustomerID
            LEFT JOIN Employee e ON o.EmployeeID = e.EmployeeID
            LEFT JOIN Product p ON o.ProductID = p.ProductID
        `);
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get order by ID
router.get('/:id', async(req, res) => {
    try {
        const order = await query(`
            SELECT o.*, 
                   c.Name as CustomerName,
                   e.Name as EmployeeName,
                   p.ProductName
            FROM \`Order\` o
            LEFT JOIN Customer c ON o.CustomerID = c.CustomerID
            LEFT JOIN Employee e ON o.EmployeeID = e.EmployeeID
            LEFT JOIN Product p ON o.ProductID = p.ProductID
            WHERE o.OrderID = ?
        `, [req.params.id]);

        if (!order || order.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(order[0]);
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create new order
router.post('/', async(req, res) => {
    try {
        const { CustomerID, EmployeeID, OrderDate, DeliveryDate, Status, ProductID, Quantity } = req.body;
        const result = await query(`
            INSERT INTO \`Order\` (CustomerID, EmployeeID, OrderDate, DeliveryDate, Status, ProductID, Quantity)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [CustomerID, EmployeeID, OrderDate, DeliveryDate, Status, ProductID, Quantity]);

        res.status(201).json(result);
    } catch (err) {
        console.error('Error creating order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update order
router.put('/:id', async(req, res) => {
    try {
        const { CustomerID, EmployeeID, OrderDate, DeliveryDate, Status, ProductID, Quantity } = req.body;
        const result = await query(`
            UPDATE \`Order\`
            SET CustomerID = ?, EmployeeID = ?, OrderDate = ?, DeliveryDate = ?, Status = ?, ProductID = ?, Quantity = ?
            WHERE OrderID = ?
        `, [CustomerID, EmployeeID, OrderDate, DeliveryDate, Status, ProductID, Quantity, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(result);
    } catch (err) {
        console.error('Error updating order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete order
router.delete('/:id', async(req, res) => {
    try {
        const result = await query('DELETE FROM \`Order\` WHERE OrderID = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error('Error deleting order:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;