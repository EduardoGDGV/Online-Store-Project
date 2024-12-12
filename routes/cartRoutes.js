const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');

const router = express.Router();

// Helper function to recalculate the total cost
const recalculateTotalCost = async (cart) => {
    let totalCost = 0;
    for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) {
            totalCost += product.price * item.quantity;
        }
    }
    return totalCost;
};

// Add Item to Cart
router.post('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    console.log(`Add item to cart: userId=${userId}, productId=${productId}, quantity=${quantity}`);

    try {
        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            console.log(`Cart not found for user ${userId}, creating a new one.`);
            cart = new Cart({ user: userId, items: [], totalCost: 0 });
        }

        const product = await Product.findById(productId);

        if (!product) {
            console.warn(`Product not found: productId=${productId}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            console.warn(`Insufficient stock for product ${product.name}. Requested: ${quantity}, Available: ${product.stock}`);
            return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            console.log(`Updating quantity for existing item in cart: ${product.name}`);
            existingItem.quantity += quantity;
        } else {
            console.log(`Adding new item to cart: ${product.name}`);
            cart.items.push({ product: productId, quantity });
        }

        // Recalculate total cost
        cart.totalCost = await recalculateTotalCost(cart);

        await cart.save();
        console.log('Cart updated successfully:', cart);
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

    console.log(`Remove item from cart: userId=${userId}, productId=${productId}`);

    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart) {
            console.warn(`Cart not found for user ${userId}`);
            return res.status(404).json({ message: 'Cart not found' });
        }

        const itemToRemove = cart.items.find(item => item.product._id.toString() === productId);

        if (!itemToRemove) {
            console.warn(`Item not found in cart: productId=${productId}`);
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        cart.items = cart.items.filter(item => item.product._id.toString() !== productId);

        // Recalculate total cost
        cart.totalCost = await recalculateTotalCost(cart);

        await cart.save();
        console.log('Item removed and cart updated successfully:', cart);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Error removing item from cart' });
    }
});

// Remove All Items from Cart
router.delete('/:userId/all', async (req, res) => {
    const { userId } = req.params;

    console.log(`Remove all items from cart: userId=${userId}`);

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            console.warn(`Cart not found for user ${userId}`);
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        cart.totalCost = 0;

        await cart.save();
        console.log('All items removed from cart successfully.');
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing all items from cart:', error);
        res.status(500).json({ message: 'Error removing all items from cart' });
    }
});

// Update Item Quantity in Cart
router.patch('/:userId', async (req, res) => {
    const { userId } = req.params;
    const { productId, change } = req.body;

    console.log(`Update item quantity in cart: userId=${userId}, productId=${productId}, change=${change}`);

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            console.warn(`Cart not found for user ${userId}`);
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product.toString() === productId);

        if (!item) {
            console.warn(`Item not found in cart: productId=${productId}`);
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const product = await Product.findById(productId);

        if (!product) {
            console.warn(`Product not found: productId=${productId}`);
            return res.status(404).json({ message: 'Product not found' });
        }

        if (change > 0 && product.stock < item.quantity + change) {
            console.warn(`Insufficient stock to increase quantity for product ${product.name}`);
            return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
        }

        item.quantity += change;

        if (item.quantity <= 0) {
            console.log(`Removing item from cart: productId=${productId}`);
            cart.items = cart.items.filter(i => i.product.toString() !== productId);
        }

        // Recalculate total cost
        cart.totalCost = await recalculateTotalCost(cart);

        await cart.save();
        console.log('Cart updated successfully:', cart);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error updating item quantity in cart:', error);
        res.status(500).json({ message: 'Error updating item quantity' });
    }
});

// View Cart
router.get('/:userId', async (req, res) => {
    console.log(`View cart: userId=${req.params.userId}`);

    try {
        let cart = await Cart.findOne({ user: req.params.userId }).populate('items.product');

        if (!cart) {
            console.log(`Cart not found for user ${req.params.userId}, creating a new empty cart.`);
            cart = new Cart({ user: req.params.userId, items: [], totalCost: 0 });
            await cart.save();
        }

        console.log('Cart fetched successfully:', cart);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Error fetching cart' });
    }
});

module.exports = router;
