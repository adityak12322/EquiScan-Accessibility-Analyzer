// server/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Dummy protection middleware
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Token extract karna
            token = req.headers.authorization.split(' ')[1];

            // Token verify karna
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // User ko find karna (password exclude karke)
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Agar sab theek hai, to aage badho

        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};