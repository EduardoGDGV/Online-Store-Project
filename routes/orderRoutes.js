const express = require('express');
const Order = require('../models/Order');
const Product = require('../models/Product'); // Required for stock adjustments
const router = express.Router();

// Create a new order
router.post('/', async (req, res) => {
    const { userId, items, totalAmount, paymentMethod, address, createdAt } = req.body;

    console.log('Received request to create order:', { userId, items, totalAmount, paymentMethod, address, createdAt });

    try {
        if (!userId || !items || items.length === 0 || !totalAmount || !paymentMethod || !address) {
            console.warn('Missing required fields in order creation:', req.body);
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            paymentMethod,
            address,
            status: 'pending', // Default status
            createdAt: createdAt || Date.now()
        });

        await newOrder.save();

        console.log('Order created successfully:', newOrder);
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Process payment for an order
router.post('/:orderId/payment', async (req, res) => {
    const { paymentMethod } = req.body;
    const orderId = req.params.orderId;

    console.log(`Processing payment for order ${orderId} with payment method: ${paymentMethod}`);

    try {
        const order = await Order.findById(orderId).populate('items.product');
        if (!order) {
            console.warn(`Order not found: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Fetched order:', order);

        let adjustedTotal = 0; // Adjust total based on stock availability

        for (const item of order.items) {
            const product = await Product.findById(item.product._id);
            if (!product) {
                console.warn(`Product not found: ${item.product._id}`);
                return res.status(404).json({ message: `Product with ID ${item.product._id} not found.` });
            }

            console.log(`Processing item: ${product.name}, Requested quantity: ${item.quantity}, Available stock: ${product.stock}`);

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity; // Deduct stock normally
                adjustedTotal += item.quantity * product.price; // Calculate item total
                console.log(`Updated stock for product ${product.name}: New stock: ${product.stock}`);
            } else {
                console.warn(`Insufficient stock for product ${product.name}`);
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}` });
            }

            await product.save(); // Save stock changes without session
        }

        const shippingCost = 5.00; // Default shipping cost
        const discount = 0.00; // Default discount
        const total = adjustedTotal + shippingCost - discount; // Correct total calculation
        order.totalAmount = total; // Update order total to reflect stock changes
        order.status = 'paid'; // Update order status
        order.paymentMethod = paymentMethod;

        await order.save(); // Save the order without session

        console.log('Payment processed successfully and stock updated:', { orderId, adjustedTotal });
        res.status(200).json({
            message: 'Payment processed successfully and stock updated',
            order
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ message: 'Error processing payment' });
    }
});

// Update order status
router.put('/:orderId', async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.orderId;

    console.log(`Updating status for order ${orderId} to: ${status}`);

    try {
        if (!status) {
            console.warn('Missing status in request body:', req.body);
            return res.status(400).json({ message: 'Status is required' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            console.warn(`Order not found: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        console.log('Order status updated successfully:', { orderId, status });
        res.status(200).json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order' });
    }
});

// Get an individual order by its ID
router.get('/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    console.log(`Fetching order details for order ID: ${orderId}`);

    try {
        const order = await Order.findById(orderId).populate('items.product', 'name price');
        if (!order) {
            console.warn(`Order not found: ${orderId}`);
            return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Fetched order details:', order);
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
});

module.exports = router;
