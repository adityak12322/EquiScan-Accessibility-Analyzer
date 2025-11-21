// server/models/Analysis.js

import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
    // Kis user ne analysis kiya
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // User model se link
    },
    // Uploaded file ki details
    fileName: {
        type: String,
        required: true,
    },
    filePath: {
        type: String, // Server par file ka path (uploads/folder mein)
        required: true,
    },
    fileType: {
        type: String,
        enum: ['pdf', 'docx', 'pptx', 'website', 'image'],
        required: true,
    },
    // Analysis ka status
    status: {
        type: String,
        enum: ['Processing', 'Completed', 'Failed'],
        default: 'Processing',
    },
    // Main results
    accessibilityScore: {
        type: Number,
        default: 0, // Score / 100
    },
    errorCount: {
        type: Number,
        default: 0,
    },
    // Detailed analysis report (JSON format mein store hoga)
    reportData: {
        type: mongoose.Schema.Types.Mixed,
    },
    // ATS Score (Resume analysis ke liye)
    atsScore: {
        type: Number,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

const Analysis = mongoose.model('Analysis', AnalysisSchema);

export default Analysis;