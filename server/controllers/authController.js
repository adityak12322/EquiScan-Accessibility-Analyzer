import User from '../models/User.js';
import crypto from 'crypto'; // Token generation ke liye
import { sendEmail } from '../utils/emailUtils.js'; // Email utility import kiya

// **1. Register User**
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: user.generateAuthToken(), // JWT token generate hua
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// **2. Login User**
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: user.generateAuthToken(), // JWT token generate hua
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
};


// ------------------------------------------------------------------
// ✅ NEW: PASSWORD RESET FUNCTIONALITY
// ------------------------------------------------------------------

// **3. Forgot Password - Token Generation and Email Send**
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // Security ke liye, hamesha success message bhejo, bhale hi user na mile
            return res.status(200).json({ message: 'If a user exists with that email, a password reset link has been sent.' });
        }

        // Token aur Expiry generate karna
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Database mein store karne ke liye token ko hash karna
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        // Token 1 hour (60 minutes) mein expire hoga
        user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; 

        await user.save();

        // Frontend ka URL jahan user reset karega
        const resetURL = `http://localhost:5173/reset-password/${resetToken}`;
        
        const htmlMessage = `
            <h2>Password Reset for EquiScan</h2>
            <p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <a href="${resetURL}" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
        `;

        try {
            await sendEmail({
                to: user.email,
                subject: 'EquiScan Password Reset Request',
                html: htmlMessage,
            });

            res.status(200).json({ message: 'Password reset link sent successfully.' });

        } catch (emailError) {
            // Agar email bhejne mein fail ho, to token hatana zaroori hai
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();
            
            console.error("Email send failed:", emailError);
            res.status(500).json({ message: 'Password reset email could not be sent.' });
        }

    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: 'Server error during password reset process.' });
    }
};


// **4. Reset Password - Token Validation and Password Update**
export const resetPassword = async (req, res) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    try {
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() } // Token expired nahi hona chahiye
        });

        if (!user) {
            return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
        }
        
        // New password length check
        if (!req.body.password || req.body.password.length < 6) {
             return res.status(400).json({ message: 'New password must be at least 6 characters long.' });
        }

        // Password update karna (password hashing UserSchema.pre('save') hook se ho jayegi)
        user.password = req.body.password;
        user.resetPasswordToken = undefined; // Token ko invalidate karna
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset.' });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: 'Server error during password reset.' });
    }
};