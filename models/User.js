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
    profilePic: { type: String, default: 'http://localhost:5000/images/default_placeholder.png'},
    address: { type: addressSchema, default: () => ({}) },
    phone: { type: String, default: '' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] // Add favorites array
});

module.exports = mongoose.model('User', userSchema);
