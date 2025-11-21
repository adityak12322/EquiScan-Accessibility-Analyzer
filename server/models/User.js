import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    
    // ✅ NEW FIELDS FOR PASSWORD RESET
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    
    createdAt: { type: Date, default: Date.now },
});

// Password ko hash karna (Registration se pehle)
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) { return next(); }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Password ko compare karna (Login ke time)
UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// JWT Token generate karna
UserSchema.methods.generateAuthToken = function () {
    // Ensure JWT_SECRET is available in .env
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token 30 din mein expire ho jayega
    });
};

// FIX: OverwriteModelError ke liye check. Agar 'User' model pehle se bana hai 
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;