const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
    const { userId, items, totalAmount, paymentMethod, status, createdAt } = req.body;

    try {
        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            paymentMethod,
            status,
            createdAt
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Get all orders for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Update order status
router.put('/:orderId', async (req, res) => {
    const { status } = req.body;

    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating order' });
    }
});

// Get an individual order by its ID
router.get('/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('items.productId');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching order' });
    }
});

module.exports = router;
