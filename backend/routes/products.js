const express = require('express');
const router = express.Router();

// Temporary in-memory store
let products = [];

// Get all products
router.get('/', (req, res) => {
    res.json(products);
});

// Add a product
router.post('/', (req, res) => {
    const { name, quantity, price, certificate } = req.body;
    if (!name || !quantity || !price) {
        return res.status(400).json({ error: 'Name, quantity, and price are required' });
    }
    const newProduct = { id: products.length + 1, name, quantity, price, certificate };
    products.push(newProduct);
    res.status(201).json(newProduct);
});

module.exports = router;
