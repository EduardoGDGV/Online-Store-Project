const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const User = require('../models/User');
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

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch users.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const isPasswordValid = await bcrypt.compare(String(password), user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Passwords do not match.' });
        }

        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role || 'user',
            profilePic: user.profilePic,
            address: user.address, // Return detailed address
            phone: user.phone,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Signup Route
router.post('/signup', upload.single('profilePic'), async (req, res) => {
    const { name, email, password, confirmPassword, role = 'user', address, phone } = req.body;

    try {
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match.' });
        }

        const hashedPassword = await bcrypt.hash(String(password), 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            role: role,
            profilePic: req.file ? req.file.path : 'http://localhost:5000/images/default_placeholder.png', // Save file path if uploaded
            address: address ? JSON.parse(address) : {}, // Parse address JSON
            phone: phone || '',
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully!',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                profilePic: newUser.profilePic,
                address: newUser.address,
                phone: newUser.phone,
            }
        });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Error creating user.' });
    }
});

// Email check endpoint (to check if an email already exists)
router.post('/check-email', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        res.json({ exists: !!user }); // Return true if user exists, false otherwise
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({ exists: false });
    }
});

// Get all customers (role 'user')
router.get('/customers', async (req, res) => {
    try {
        // Find users with role 'user' (customers)
        const customers = await User.find({ role: 'user' });
        res.json(customers); // Return customers as JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get all admins (role 'admin')
router.get('/admins', async (req, res) => {
    try {
        // Find users with role 'admin' (admins)
        const admins = await User.find({ role: 'admin' });
        res.json(admins); // Return admins as JSON
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Get user's favorites or create an empty array if non-existent
router.get('/favorites/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Ensure the favorites array exists, if not, create an empty array
        if (!user.favorites) {
            user.favorites = [];
            await user.save(); // Save the newly created empty favorites array
        }

        // Remove null values from the favorites array
        user.favorites = user.favorites.filter(favorite => favorite !== null);

        res.status(200).json(user.favorites);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching favorites');
    }
});

// Add product to favorites
router.post('/favorites/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const { productId } = req.body;

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Ensure the favorites array exists
        if (!user.favorites) {
            user.favorites = [];  // Initialize favorites as an empty array if it doesn't exist
            await user.save(); // Save the newly created empty favorites array
        }

        if (!user.favorites.includes(productId)) {
            user.favorites.push(productId);
            user.favorites = user.favorites.filter(favorite => favorite !== null); // Remove null values
            await user.save();
            return res.status(200).send('Product added to favorites');
        }
        res.status(400).send('Product already in favorites');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding to favorites');
    }
});

// Remove product from favorites
router.delete('/favorites/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const { productId } = req.body;

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (!user.favorites) {
            return res.status(400).send('No favorites found for user');
        }

        // Remove null values from the favorites array
        user.favorites = user.favorites.filter(favorite => favorite !== null);

        // Remove product from favorites
        user.favorites = user.favorites.filter(id => id.toString() !== productId);

        await user.save();
        res.status(200).send('Product removed from favorites');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error removing from favorites');
    }
});

// Get user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Update user
router.put('/:id', upload.single('profilePic'), async (req, res) => {
    const { name, email, password, address, phone } = req.body;
    const profilePic = req.file ? req.file.path : ''; // Optional new profile picture

    try {
        const updateData = {
            ...(name && { name }),
            ...(email && { email }),
            ...(phone && { phone }),
            ...(password && { password: await bcrypt.hash(String(password), 10) }), // Hash new password if provided
            ...(profilePic && { profilePic }), // Update profilePic if new image is uploaded
            ...(address && { address: typeof address === 'string' ? JSON.parse(address) : address }) // Parse and update address only if it's a string
        };

        const updatedUser = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error.' });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        // Find the user by ID to get the profile picture path
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Delete the profile picture file associated with the user, if it exists
        if (user.profilePic) {
            fs.unlink(user.profilePic, (err) => {
                if (err) {
                    console.error('Failed to delete profile picture:', err);
                }
            });
        }

        // Delete the user from the database
        await User.findByIdAndDelete(userId);

        res.json({ message: 'User and associated profile picture deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete user.' });
    }
});

module.exports = router;