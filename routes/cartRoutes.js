const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Add Item to Cart
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalCost: 0 });
        }

        // Check if the item already exists in the cart
        const existingItem = cart.items.find(item => item.product.toString() === productId);
        
        if (existingItem) {
            // If item exists, update the quantity
            existingItem.quantity += quantity;
        } else {
            // If item doesn't exist, add it to the cart
            cart.items.push({ product: productId, quantity });
        }

        // Update total cost
        const product = await Product.findById(productId);
        cart.totalCost = cart.items.reduce((total, item) => {
            const productPrice = product ? product.price : 0;
            return total + productPrice * item.quantity;
        }, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Error adding item to cart' });
    }
});

// Remove Item from Cart
router.delete('/remove', async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove the item from the cart
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        // Recalculate total cost
        cart.totalCost = cart.items.reduce((total, item) => {
            const productPrice = item.product.price;
            return total + productPrice * item.quantity;
        }, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});

// Update Item Quantity
router.put('/update', async (req, res) => {
    const { userId, productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product.toString() === productId);

        if (item) {
            item.quantity = quantity;
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Recalculate total cost
        cart.totalCost = cart.items.reduce((total, item) => {
            const productPrice = item.product.price;
            return total + productPrice * item.quantity;
        }, 0);

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating item quantity in cart:', error);
        res.status(500).json({ message: 'Error updating item quantity' });
    }
});

// View Cart
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

module.exports = router;