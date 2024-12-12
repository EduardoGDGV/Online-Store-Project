const mongoose = require('mongoose');

// Define the Order Schema
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        product: {  // Store the entire product object
            type: mongoose.Schema.Types.Mixed,  // Use Mixed type to allow storing any structure of product data
            required: true
        },
        quantity: { 
            type: Number, 
            required: true,
            min: [1, 'Quantity must be at least 1'] // Ensure quantity is greater than 0
        },
        price: { 
            type: Number, 
            required: true, 
            min: [0, 'Price must be a positive value'] // Ensure price is non-negative
        }
    }],
    totalAmount: { 
        type: Number, 
        required: true,  // The total amount is now directly passed from the cart data
    },
    paymentMethod: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    address: {
        street: { type: String, required: true },
        number: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
        zip: { type: String, required: true },
        comments: { type: String, default: '' }  // Optional field for comments on the address
    }
});

// Model export
module.exports = mongoose.model('Order', orderSchema);