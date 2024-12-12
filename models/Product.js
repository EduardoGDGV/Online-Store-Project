const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    producer: { type: String, required: true },
    price: { 
        type: Number, 
        required: true, 
        min: [0, 'Price must be at least 0'], // Minimum price validation
    },
    stock: { 
        type: Number, 
        default: 0, 
        min: [0, 'Stock cannot be negative'], // Minimum stock validation
    },
    verified: { 
        type: Boolean, 
        default: false, // Default value for verified
    },
    image: { type: String, default: 'http://localhost:5000/images/default_placeholder.png'},
    slug: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return this.name ? this.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now() : null;
        },
    },
    rating: {
        type: Number,
        default: 0,
        min: 0, // Optional: Minimum rating value
        max: 5, // Optional: Maximum rating value
    },
});

// Pre-save hook to generate a unique slug
productSchema.pre('save', function (next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
    }
    next();
});

module.exports = mongoose.model('Product', productSchema);
