const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Reference to Product
            quantity: { type: Number, required: true, default: 1 }, // Quantity of the product
        }
    ],
    totalCost: { type: Number, default: 0 }, // Total price of items in the cart
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
