import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js'; 
import { fileURLToPath } from 'url';
import path from 'path';
import chatbotRoutes from './routes/chatbotRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); 
app.use(express.json()); 

// UPLOADS FOLDER STATICALLY SERVE KARNA
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // ✅ Yahan Login/Register chalta hai
app.use('/api/analysis', analysisRoutes); 
app.use('/api/chatbot', chatbotRoutes);
app.get('/', (req, res) => {
    res.send('EquiScan API is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});