const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

// Get all products
router.get('/', async(req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a single product
router.get('/:id', async(req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new product
router.post('/', async(req, res) => {
    try {
        const id = await productService.createProduct(req.body);
        res.status(201).json({ id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a product
router.put('/:id', async(req, res) => {
    try {
        await productService.updateProduct(req.params.id, req.body);
        res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a product
router.delete('/:id', async(req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;