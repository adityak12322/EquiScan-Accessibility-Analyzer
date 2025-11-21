// server/routes/analysisRoutes.js

import express from 'express';
import upload from '../utils/upload.js';
import { protect } from '../middleware/authMiddleware.js';
// ✅ FINAL IMPORT FIX: Saare Controller functions ko ek saath import kiya
import { 
    analyzeDocument, 
    getAnalysisHistory, 
    analyzeWebsite, 
    getAnalysisReport, 
    deleteAnalysisRecord 
} from '../controllers/analysisController.js'; 

const router = express.Router();

// 1. POST /api/analysis/upload (Document/Resume/PPTX/Image Analysis)
router.post(
    '/upload', 
    protect, 
    upload.single('document'), // Multer middleware
    analyzeDocument 
);

// 2. POST /api/analysis/website (Website URL Analysis)
router.post(
    '/website', 
    protect, 
    analyzeWebsite 
);

// 3. GET /api/analysis/history (Dashboard History List)
router.get(
    '/history',
    protect, 
    getAnalysisHistory
);

// 4. GET /api/analysis/report/:id (Detailed Report View)
router.get(
    '/report/:id',
    protect, 
    getAnalysisReport 
);

// 5. ✅ NEW: DELETE /api/analysis/record/:id (History Delete)
router.delete(
    '/record/:id',
    protect,
    deleteAnalysisRecord
);

export default router;