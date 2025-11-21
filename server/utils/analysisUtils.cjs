// server/utils/analysisUtils.cjs

// CJS Environment mein sabse zaruri modules
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse'); 
const mammoth = require('mammoth');   
const pptx2json = require('pptx2json'); // PPTX Library

// 1. Text Extractor Function
const extractTextFromFile = async (filePath, fileType) => {
    try {
        // CRITICAL: File existence check
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found at path: ${filePath}`);
        }
        const dataBuffer = fs.readFileSync(filePath);

        if (fileType === 'pdf') {
            if (typeof pdfParse !== 'function') {
                throw new Error("PDF parser failed to load or is not a function."); 
            }
            const data = await pdfParse(dataBuffer); 
            return { fullText: data.text, metadata: data.numpages > 0 ? { pages: data.numpages } : {} };
        } 
        
        else if (fileType === 'docx') {
            const absolutePath = path.resolve(filePath);
            const result = await mammoth.extractRawText({ path: absolutePath }); 
            return { fullText: result.value, metadata: {} };
        } 
        
        // ✅ PPTX Logic
        else if (fileType === 'pptx') {
            const presentation = pptx2json(dataBuffer);
            let fullText = '';
            presentation.slides.forEach(slide => {
                if (slide.elements) {
                    slide.elements.forEach(element => {
                        if (element.text && typeof element.text === 'string') {
                            fullText += element.text + ' ';
                        }
                    });
                }
            });
            return { fullText: fullText.trim(), metadata: { slides: presentation.slides.length } };
        } 
        
        // ✅ Image/OCR Placeholder Logic
        else if (fileType === 'image') {
            // CRITICAL FIX: Image processing skip karke sirf placeholder data return karna
            const fileSizeMB = dataBuffer.length / (1024 * 1024);
            return { fullText: `Image file detected for OCR. Size: ${fileSizeMB.toFixed(2)} MB. OCR analysis requires external AI integration (Future Scope).`, metadata: {} };
        }

        throw new Error("Unsupported file type.");
    } catch (error) {
        console.error(`Error processing file (${fileType}):`, error);
        throw new Error(`Failed to extract text from file: ${error.message}`); 
    }
};

// 2. Simple Accessibility and ATS Scoring Logic
const runAccessibilityAnalysis = (extractedText, fileType) => { 
    let score = 100;
    let errors = [];
    let atsScore = null;
    const text = extractedText.fullText.toLowerCase();
    
    // ATS Score Check: PPTX, DOCX, PDF
    if (['docx', 'pdf', 'pptx'].includes(fileType)) {
        const requiredKeywords = ['experience', 'skills', 'education', 'contact'];
        let matchedKeywords = 0;
        requiredKeywords.forEach(kw => { if (text.includes(kw)) { matchedKeywords++; } });
        atsScore = Math.round((matchedKeywords / requiredKeywords.length) * 100);
        score = Math.max(0, score - 5) + (atsScore * 0.1); 
    }

    // Image/OCR analysis (Placeholder check)
    if (fileType === 'image') {
        score = 85; 
        errors.push({ code: 'I01', message: 'OCR analysis was simulated.', priority: 'Low', suggestion: 'Real-time OCR requires external service integration (Future Scope).' });
    }
    
    // Basic Syntax/Alt Text Checks
    if (text.includes("image") && !text.includes("alt text")) {
        score -= 5;
        errors.push({ code: 'A1', message: 'Possible missing Alt Text.', priority: 'High', suggestion: 'Ensure all images have Alt Text.' });
    }

    return {
        accessibilityScore: Math.min(100, Math.round(score)), 
        errorCount: errors.length,
        errors: errors, 
        atsScore: atsScore,
    };
};

// CJS Export: Final export using module.exports
module.exports = {
    extractTextFromFile,
    runAccessibilityAnalysis,
};