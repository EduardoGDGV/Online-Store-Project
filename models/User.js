const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Address Schema for detailed address fields
const addressSchema = new mongoose.Schema({
    street: { type: String, default: '' },
    number: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    zip: { type: String, default: '' },
    comments: { type: String, default: '' } // Optional comments or complements
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    profilePic: { type: String, default: 'images/default_placeholder.png'}, // Default product image
    address: { type: addressSchema, default: () => ({}) }, // Use the address schema
    phone: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);
