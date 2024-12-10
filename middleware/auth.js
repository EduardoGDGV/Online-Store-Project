const jwt = require('jsonwebtoken'); // Assuming we use JWT tokens for authentication

const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied.' });

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.userId = decoded.id; // Add user ID to request object
        next();
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: 'Token is not valid.' });
    }
};

module.exports = auth;
