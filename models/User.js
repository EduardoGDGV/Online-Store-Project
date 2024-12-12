const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    profilePic: { type: String, default: '' },
    address: { type: String, default: '' },
    phone: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);
