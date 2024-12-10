const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Import Models
const User = require('./models/User');
const Product = require('./models/Product');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose
    .connect('mongodb://127.0.0.1:27017/online_store', {})
    .then(async () => {
        console.log('Connected to MongoDB');
        await createDefaultAdmin(); // Create default admin if it doesn't exist
        await updateMissingProductSlugs(); // Ensure all products have slugs
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });

// Function to create a default admin user if it doesn't exist
async function createDefaultAdmin() {
    try {
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin', 10); // Hash the password

            const admin = new User({
                name: 'Admin',
                email: 'admin@example.com',
                password: hashedPassword, // Store the hashed password
                role: 'admin'
            });

            await admin.save();
            console.log('Default admin created');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    }
}

// Function to update missing product slugs
async function updateMissingProductSlugs() {
    try {
        const products = await Product.find({ slug: null }); // Find products with missing slugs

        for (const product of products) {
            product.slug = product.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
            await product.save();
            console.log(`Slug updated for product: ${product.name}`);
        }

        if (products.length > 0) {
            console.log('Missing product slugs have been updated.');
        } else {
            console.log('All products already have slugs.');
        }
    } catch (error) {
        console.error('Error updating product slugs:', error);
    }
}

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save files to 'images' folder
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        // Save files with original file name (you can change it to a unique name if needed)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Endpoint for handling image uploads
app.post('/upload-image', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Generate the URL for the uploaded image
    const imageUrl = `http://localhost:5000/images/${req.file.filename}`;

    // Send back the image URL
    res.json({ imageUrl });
});

// Serve images from the 'images' folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// Routes
app.use('/api/users', userRoutes);    // User-related routes
app.use('/api/products', productRoutes); // Product-related routes
app.use('/api/orders', orderRoutes);  // Order-related routes
app.use('/api/cart', cartRoutes);  // Cart-related routes

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
