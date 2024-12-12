const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
    const { userId, items, totalAmount, paymentMethod, address, status, createdAt } = req.body;

    try {
        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            paymentMethod,
            address,
            status: 'pending', // Default status is pending
            createdAt: createdAt || Date.now()
        });

        await newOrder.save();

        res.status(201).json(newOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Process payment for an order
router.post('/:orderId/payment', async (req, res) => {
    const { paymentMethod, paymentDetails } = req.body; // Payment details would come from the frontend (e.g., credit card info, etc.)
    
    try {
        // Fetch the order
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Simulating a successful payment for now
        const paymentSuccessful = true; // Replace with actual payment processing logic

        if (paymentSuccessful) {
            // Update order status to 'paid'
            order.status = 'paid';
            order.paymentMethod = paymentMethod; // Store the payment method
            await order.save();

            res.status(200).json({
                message: 'Payment processed successfully',
                order
            });
        } else {
            res.status(400).json({ message: 'Payment failed. Please try again.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error processing payment' });
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
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order); // No need to populate since items already contain product data
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching order' });
    }
});

module.exports = router;
