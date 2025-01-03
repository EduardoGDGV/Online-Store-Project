const express = require('express');
const multer = require('multer');
const Product = require('../models/Product');
const fs = require('fs'); // Import the file system module

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Allow only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Get All Products
router.get('/', async (req, res) => {
    console.log('Fetching all products...');
    try {
        const products = await Product.find();
        console.log(`Found ${products.length} products.`);
        res.json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ message: 'Failed to fetch products.' });
    }
});

// Add New Product with Image (Admin Only)
router.post('/', upload.single('image'), async (req, res) => {
    const { name, description, producer, price, stock, verified } = req.body;
    const image = req.file ? req.file.path : ''; // Use file path if uploaded

    console.log('Adding new product:', { name, producer, price, stock, verified });

    try {
        const slug = name.toLowerCase().replace(/ /g, '-') + '-' + Date.now(); // Generate slug
        const product = new Product({
            name,
            description,
            producer,
            price,
            stock: parseInt(stock), // Ensure stock is stored as a number
            verified: verified === 'true', // Convert string to boolean
            image,
            slug
        });
        await product.save();

        console.log('Product added successfully:', product);
        res.status(201).json({ message: 'Product added successfully.', product });
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(500).json({ message: 'Failed to add product.', error: err.message });
    }
});

// Get product by ID
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    console.log(`Fetching product with ID: ${productId}`);

    try {
        const product = await Product.findById(productId);
        if (!product) {
            console.log('Product not found.');
            return res.status(404).json({ message: 'Product not found.' });
        }
        console.log('Product found:', product);
        res.json(product);
    } catch (err) {
        console.error('Error fetching product:', err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Update Product (Admin Only)
router.put('/:id', upload.single('image'), async (req, res) => {
    const productId = req.params.id;
    const { name, description, producer, price, stock, verified } = req.body;
    const image = req.file ? req.file.path : undefined; // Optional new image

    console.log(`Updating product with ID: ${productId}`);

    try {
        const updateData = {
            name,
            description,
            producer,
            price,
            stock: stock ? parseInt(stock) : undefined, // Optional update for stock
            verified: verified === 'true', // Convert string to boolean
            ...(image && { image }), // Only update image if a new one is uploaded
            ...(name && { slug: name.toLowerCase().replace(/ /g, '-') + '-' + Date.now() }) // Update slug if name changes
        };

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });

        if (!updatedProduct) {
            console.log('Product not found for update.');
            return res.status(404).json({ message: 'Product not found.' });
        }

        console.log('Product updated successfully:', updatedProduct);
        res.json({ message: 'Product updated successfully.', product: updatedProduct });
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(500).json({ message: 'Failed to update product.', error: err.message });
    }
});

// Delete Product by ID (Admin Only)
router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    console.log(`Deleting product with ID: ${productId}`);

    try {
        const product = await Product.findById(productId);

        if (!product) {
            console.log('Product not found for deletion.');
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Delete the image file associated with the product, if it exists
        if (product.image) {
            fs.unlink(product.image, (err) => {
                if (err) {
                    console.error('Failed to delete image:', err);
                } else {
                    console.log(`Image deleted: ${product.image}`);
                }
            });
        }

        await Product.findByIdAndDelete(productId);
        console.log('Product and associated image deleted successfully.');
        res.json({ message: 'Product and associated image deleted successfully.' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(500).json({ message: 'Failed to delete product.' });
    }
});

module.exports = router;
