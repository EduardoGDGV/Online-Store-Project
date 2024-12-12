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
        await createDefaultUsers(); // Create default users
        await createDefaultAdmin(); // Create default admin if it doesn't exist
        await createDefaultProducts(); // Create default products
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
            console.log('Default admin created.');
        }else{
            console.log('Default admin already exists.');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    }
}

// Function to create default users
async function createDefaultUsers() {
    try {
        const existingUsers = await User.find({});

        if (existingUsers.length === 0) {
            // Example users
            const users = [
                { 
                    name: 'John Doe', 
                    email: 'john@example.com', 
                    password: 'password123', 
                    role: 'user',
                    address: {
                        street: '123 Main St',
                        city: 'New York',
                        state: 'NY',
                        country: 'USA',
                        zip: '10001'
                    },
                    phone: '123-456-7890'
                },
                { 
                    name: 'Jane Smith', 
                    email: 'jane@example.com', 
                    password: 'password123', 
                    role: 'user',
                    address: {
                        street: '456 Oak Rd',
                        city: 'Los Angeles',
                        state: 'CA',
                        country: 'USA',
                        zip: '90001'
                    },
                    phone: '987-654-3210'
                },
                { 
                    name: 'Alice Brown', 
                    email: 'alice@example.com', 
                    password: 'password123', 
                    role: 'user',
                    address: {
                        street: '789 Pine Ln',
                        city: 'Chicago',
                        state: 'IL',
                        country: 'USA',
                        zip: '60601'
                    },
                    phone: '555-123-4567'
                }
            ];

            for (let user of users) {
                const hashedPassword = await bcrypt.hash(user.password, 10); // Hash the password
                const newUser = new User({
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    role: user.role,
                    address: user.address,
                    phone: user.phone
                });

                await newUser.save();
                console.log(`User created: ${user.name}`);
            }
        } else {
            console.log('Users already exist.');
        }
    } catch (error) {
        console.error('Error creating users:', error);
    }
}

async function createDefaultProducts() {
    try {
        const existingProducts = await Product.find({});

        if (existingProducts.length === 0) {
            // Example clothing items
            const products = [
                { 
                    name: 'Men\'s T-Shirt', 
                    description: 'Comfortable cotton t-shirt', 
                    producer: 'FashionBrand', 
                    price: 20.0, 
                    stock: 100, 
                    image: 'images/tshirt.jpg', 
                    verified: true 
                },
                { 
                    name: 'Women\'s Jeans', 
                    description: 'Stylish skinny jeans', 
                    producer: 'DenimCo', 
                    price: 50.0, 
                    stock: 75, 
                    image: 'images/jeans.jpg', 
                    verified: true 
                },
                { 
                    name: 'Men\'s Jacket', 
                    description: 'Warm winter jacket', 
                    producer: 'Outerwear Inc.', 
                    price: 120.0, 
                    stock: 30, 
                    image: 'images/jacket.jpg', 
                    verified: false 
                },
                { 
                    name: 'Women\'s Dress', 
                    description: 'Elegant evening dress', 
                    producer: 'GlamourWear', 
                    price: 80.0, 
                    stock: 50, 
                    image: 'images/dress.jpg', 
                    verified: true 
                },
                { 
                    name: 'Unisex Sneakers', 
                    description: 'Trendy and comfortable sneakers', 
                    producer: 'ShoeStyle', 
                    price: 60.0, 
                    stock: 150, 
                    image: 'images/sneakers.jpg', 
                    verified: true 
                }
            ];

            for (let product of products) {
                const newProduct = new Product({
                    name: product.name,
                    description: product.description,
                    producer: product.producer,
                    price: product.price,
                    stock: product.stock,
                    image: product.image,
                    verified: product.verified,
                    slug: product.name.toLowerCase().replace(/ /g, '-') + '-' + Date.now(),
                    rating: 4 // Default rating for testing purposes
                });

                await newProduct.save();
                console.log(`Product created: ${product.name}`);
            }
        } else {
            console.log('Products already exist.');
        }
    } catch (error) {
        console.error('Error creating products:', error);
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
