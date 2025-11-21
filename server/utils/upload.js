// server/utils/upload.js
import multer from 'multer';
import path from 'path';

// Destination aur filename define karte hain
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Files ko 'uploads' folder mein store karna
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Filename: fieldname-timestamp.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// File filters: Sirf PDF, DOCX, PPTX allow karna
const fileFilter = (req, file, cb) => {
    const allowedTypes = /pdf|docx|pptx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only PDF, DOCX, PPTX, and image files are allowed!'));
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    // ✅ FIX: File size limit badhao (5MB se 50MB)
    limits: { fileSize: 1024 * 1024 * 50 } // 50MB limit
});

export default upload;