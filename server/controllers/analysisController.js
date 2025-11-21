// server/controllers/analysisController.js

import Analysis from '../models/Analysis.js';
import AnalysisUtils from '../utils/analysisUtils.cjs'; 
import puppeteer from 'puppeteer'; 
import fs from 'fs'; 
import path from 'path'; 
import { generateAISuggestions } from '../controllers/aiController.js'; // ✅ AI Suggestions Import

// CJS object se functions ko extract karna
const { extractTextFromFile, runAccessibilityAnalysis } = AnalysisUtils;


// --- Helper Functions ---

const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) return 'pdf';
    if (['docx'].includes(ext)) return 'docx';
    if (['pptx'].includes(ext)) return 'pptx';
    if (['jpg', 'jpeg', 'png'].includes(ext)) return 'image';
    return 'document'; 
};

// Simple WCAG Checks for Website (Same as before)
const runWCAGChecks = (domSnapshot) => {
    let score = 100;
    let errors = [];
    
    // Check 1: Title Tag Missing
    if (!domSnapshot.title || domSnapshot.title.length < 5) { score -= 10; errors.push({ code: 'W1', message: 'Missing or very short page title.', priority: 'High', suggestion: 'Add a descriptive <title> tag.' }); }

    // Check 2: Missing Alt Attributes
    const imageCount = domSnapshot.images; 
    const altCount = domSnapshot.altAttributes;

    if (imageCount > 0 && altCount < imageCount) {
        const missingAlt = imageCount - altCount;
        score -= (missingAlt * 3);
        errors.push({ code: 'W3', message: `Total ${missingAlt} image tags are missing alt attributes.`, priority: 'High', suggestion: 'Provide descriptive alt text for all images.' });
    }
    
    // Check 3: H1 Count
    const h1Count = domSnapshot.h1Count;
    if (h1Count !== 1) { score -= 5; errors.push({ code: 'W4', message: `Incorrect H1 count (${h1Count}). Use only one H1 per page.`, priority: 'Medium', suggestion: 'Ensure a single, descriptive H1 tag exists.' }); }
    
    return {
        accessibilityScore: Math.max(0, Math.round(score)),
        errorCount: errors.length,
        errors: errors,
        atsScore: null,
    };
};

// --- API Functions ---

// **1. Document Upload and Analysis (File, PPTX, Image)**
export const analyzeDocument = async (req, res) => {
    if (!req.file) { return res.status(400).json({ message: 'No file uploaded' }); }

    let analysisEntry;
    const filePath = req.file.path;
    const fileType = getFileType(req.file.originalname);

    try {
        analysisEntry = await Analysis.create({ user: req.user._id, fileName: req.file.originalname, filePath: filePath, fileType: fileType, status: 'Processing' });

        const extracted = await extractTextFromFile(filePath, fileType); 
        let results = runAccessibilityAnalysis(extracted, fileType); 

        // ✅ AI INTEGRATION: Errors ko AI ko bhejo
        const finalErrors = await generateAISuggestions(results.errors, req.file.originalname);

        // Finalize entry
        analysisEntry.accessibilityScore = results.accessibilityScore;
        analysisEntry.errorCount = results.errorCount;
        analysisEntry.atsScore = results.atsScore;
        analysisEntry.reportData = finalErrors; // ✅ AI suggestions saved here
        analysisEntry.status = 'Completed';
        
        await analysisEntry.save();

        fs.unlink(filePath, (err) => { if (err) console.error('Failed to delete file after analysis:', err); });
        res.status(201).json({ message: 'Analysis completed successfully!', analysisId: analysisEntry._id });

    } catch (error) {
        console.error('Full Document Analysis Error:', error);
        if (analysisEntry) { analysisEntry.status = 'Failed'; analysisEntry.reportData = { message: error.message }; await analysisEntry.save(); }
        if (filePath && fs.existsSync(filePath)) { fs.unlink(filePath, (err) => { if (err) console.error('Failed to delete file on error:', err); }); }
        res.status(500).json({ message: error.message || 'Analysis failed due to an unknown server error.' });
    }
};


// **2. Website Analysis (URL)**
export const analyzeWebsite = async (req, res) => {
    let analysisEntry;
    let domSnapshot = null;
    
    try {
        const { url } = req.body;
        if (!url || !url.startsWith('http')) { return res.status(400).json({ message: 'Invalid or missing website URL (must start with http/https).' }); }

        analysisEntry = await Analysis.create({ user: req.user._id, fileName: url, filePath: url, fileType: 'website', status: 'Processing' });

        const browser = await puppeteer.launch({ 
            headless: true, 
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--single-process' // Stability fix
            ] 
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });

        domSnapshot = await page.evaluate(() => { 
            const getAltAttributes = (doc) => {
                const images = doc.querySelectorAll('img');
                let count = 0;
                images.forEach(img => { if (img.alt && img.alt.trim() !== "") { count++; } });
                return count;
            };
            return { title: document.title, images: document.querySelectorAll('img').length,
                altAttributes: getAltAttributes(document), h1Count: document.querySelectorAll('h1').length };
        });

        await browser.close();
        let results = runWCAGChecks(domSnapshot); 

        // ✅ AI INTEGRATION: Errors ko AI ko bhejo
        const finalErrors = await generateAISuggestions(results.errors, url);

        // Finalize entry
        analysisEntry.accessibilityScore = results.accessibilityScore;
        analysisEntry.errorCount = results.errorCount;
        analysisEntry.reportData = finalErrors; // ✅ AI suggestions saved here
        analysisEntry.status = 'Completed';
        await analysisEntry.save();

        res.status(201).json({ message: 'Website analysis completed successfully!', analysisId: analysisEntry._id });

    } catch (error) {
        console.error('Website Analysis Error:', error);
        if (analysisEntry) { analysisEntry.status = 'Failed'; analysisEntry.reportData = { message: error.message }; await analysisEntry.save(); }
        res.status(500).json({ message: `Website analysis failed: ${error.message.includes('timeout') ? 'Timeout or URL not reachable.' : 'Internal error.'}` });
    }
};


// **3. Analysis History Fetch (Dashboard)**
export const getAnalysisHistory = async (req, res) => {
    try {
        const history = await Analysis.find({ user: req.user._id }).select('-reportData -__v').sort({ createdAt: -1 });
        res.status(200).json(history);
    } catch (error) {
        console.error('History fetch error:', error);
        res.status(500).json({ message: 'Failed to fetch analysis history.' });
    }
};


// **4. Get Single Analysis Report Details**
export const getAnalysisReport = async (req, res) => {
    try {
        const report = await Analysis.findOne({ _id: req.params.id, user: req.user._id });
        if (!report) { return res.status(404).json({ message: 'Report not found or not authorized.' }); }
        if (report.status !== 'Completed') { return res.status(400).json({ message: `Analysis status is ${report.status}. Report not ready.` }); }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch analysis report.' });
    }
};


// **5. Delete Single Analysis Record (NEW FUNCTION)**
export const deleteAnalysisRecord = async (req, res) => {
    const { id } = req.params;

    try {
        const record = await Analysis.findOneAndDelete({ _id: id, user: req.user._id });

        if (!record) { return res.status(404).json({ message: 'Record not found or not authorized to delete.' }); }

        // Cleanup: Associated local file ko delete karna
        if (record.filePath && !record.filePath.startsWith('http')) {
            fs.unlink(record.filePath, (err) => {
                if (err) console.error('Error deleting physical file:', err);
            });
        }

        res.status(200).json({ message: 'Analysis record deleted successfully.' });

    } catch (error) {
        console.error('Error deleting record:', error);
        res.status(500).json({ message: 'Server error during deletion.' });
    }
};