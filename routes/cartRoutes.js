const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Add Item to Cart
router.post('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

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
router.delete('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { productId } = req.body;

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

// Remove all items from Cart
router.delete('/:userId/all', async (req, res) => {
    const { userId } = req.params;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        // Remove all items from the cart
        cart.items = [];

        // Recalculate the total cost (which will now be 0)
        cart.totalCost = 0;

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing all items from cart:', error);
        res.status(500).json({ message: 'Error removing all items from cart' });
    }
});

// Update Item Quantity in Cart (backend route)
router.patch('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { productId, change } = req.body;

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product.toString() === productId);

        if (item) {
            // Update quantity
            item.quantity += change;

            // If quantity becomes 0 or less, remove the item from the cart
            if (item.quantity <= 0) {
                cart.items = cart.items.filter(item => item.product.toString() !== productId);
            }
        } else {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        // Recalculate total cost
        const product = await Product.findById(productId);
        cart.totalCost = cart.items.reduce((total, item) => {
            const productPrice = product ? product.price : 0;
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
        // Attempt to find the user's cart
        let cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');

        if (!cart) {
            // Create an empty cart for the user if one doesn't exist
            cart = new Cart({
                user: req.params.userId,
                items: [],
                totalCost: 0,
            });

            await cart.save(); // Save the newly created empty cart
        }

        res.status(200).json(cart); // Return the cart
    } catch (error) {
        console.error('Error fetching or creating cart:', error);
        res.status(500).json({ message: 'Error fetching or creating cart' });
    }
});

module.exports = router;