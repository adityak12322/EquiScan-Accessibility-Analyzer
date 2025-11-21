import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

// NOTE: formatBytes function assumed to be present above

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [url, setUrl] = useState('');
    const [activeTab, setActiveTab] = useState('doc'); 
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const token = JSON.parse(localStorage.getItem('userInfo'))?.token;

    // --- Helper for Dropzone File Filtering ---
    const getAcceptedFiles = (tab) => {
        switch (tab) {
            case 'doc':
                return { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] };
            case 'ppt':
                return { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] };
            case 'img':
                return { 'image/*': ['.jpg', '.jpeg', '.png'] };
            default:
                return {};
        }
    };
    
    // --- File Dropzone Logic ---
    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            const acceptedFile = acceptedFiles[0];
            const fileType = acceptedFile.type;
            const fileName = acceptedFile.name;

            // Check file type based on active tab
            let isAccepted = false;
            if (activeTab === 'doc' && (fileType.includes('pdf') || fileName.endsWith('.docx'))) {
                isAccepted = true;
            } else if (activeTab === 'ppt' && fileName.endsWith('.pptx')) {
                isAccepted = true;
            } else if (activeTab === 'img' && fileType.startsWith('image/')) {
                isAccepted = true;
            }

            if (isAccepted) {
                setFile(acceptedFile);
                setError('');
                setMessage(`File selected: ${acceptedFile.name}`);
            } else {
                setError(`File type not supported in ${activeTab} section.`);
                setFile(null);
            }
        }
    }, [activeTab]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: getAcceptedFiles(activeTab),
    });

    // --- Upload/Analyze Handlers (Final Robust Logic) ---
    const handleUpload = async () => {
        if (!token) { setError('Authentication error. Please log in again.'); return; }
        
        let endpoint = '';
        let postData = null;

        if (activeTab !== 'web') {
            if (!file) { setError('Please select a file first.'); return; }
            endpoint = 'upload';
            postData = new FormData();
            postData.append('document', file); 
        } else if (activeTab === 'web') {
            if (!url || !url.startsWith('http')) { setError('Please enter a valid URL (with http/https).'); return; }
            endpoint = 'website';
            postData = { url: url };
        }

        setLoading(true);
        setMessage('Uploading and analyzing...');
        setError('');

        try {
            await axios.post(
                `http://localhost:5000/api/analysis/${endpoint}`,
                postData,
                { headers: { 'Content-Type': activeTab !== 'web' ? 'multipart/form-data' : 'application/json', Authorization: `Bearer ${token}` } }
            );

            setMessage(`Analysis Request Sent! Check history.`);
            
            // ✅ FIX: File state ko clear karo aur reload karo
            setFile(null); setUrl('');
            setTimeout(() => window.location.reload(), 1500); 

        } catch (err) {
            // ✅ CRITICAL FIX: Error ko theek se parse karna
            const errorMessage = err.response?.data?.message || err.message || 'An unexpected server error occurred.';
            setError(`Analysis failed. ${errorMessage}`);
            
            // File state ko clear karna takki next upload se pehle UI clean ho
            setFile(null); 
            setUrl('');
        } finally {
            setLoading(false);
        }
    };

    // --- UI Structure (Same as before) ---
    const tabs = [
        { id: 'doc', name: 'Document / Resume', supported: 'PDF, DOCX' },
        { id: 'ppt', name: 'Presentation', supported: 'PPTX' },
        { id: 'img', name: 'Image (OCR)', supported: 'JPG, PNG' },
        { id: 'web', name: 'Website URL', supported: 'Full URL Check' },
    ];

    const currentTab = tabs.find(t => t.id === activeTab);

    return (
        <div className="bg-card-bg p-8 rounded-2xl shadow-2xl border border-primary-blue/30 space-y-6 animate-fadeIn">
            <h2 className="text-3xl font-bold text-secondary-blue flex items-center">
                <span className="mr-3">📤</span> New Accessibility Analysis
            </h2>

            {/* Tab Navigation - 4 Sections */}
            <div className="flex border-b border-gray-700 overflow-x-auto">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setError(''); setMessage(''); setFile(null); setUrl(''); }}
                        className={`py-2 px-3 text-sm font-bold capitalize transition-all duration-300 
                            ${activeTab === tab.id 
                                ? 'text-white border-b-4 border-secondary-blue bg-primary-blue/20' 
                                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* --- Tab Content --- */}
            {activeTab !== 'web' ? (
                // --- File Upload UI (DOC/PPT/IMG) ---
                <>
                    <p className="text-gray-400 text-sm">
                        Supported formats: <span className='text-white font-medium'>{currentTab?.supported}</span>. 
                        Max size: <span className='text-white font-medium'>50MB</span>.
                    </p>
                    <div 
                        {...getRootProps()} 
                        className={`p-10 border-4 border-dashed rounded-xl transition-all duration-300 transform min-h-[150px] flex items-center justify-center
                        ${isDragActive ? 'border-secondary-blue bg-primary-blue/30 scale-[1.01]' : 'border-gray-600 hover:border-secondary-blue/70 bg-gray-800/70 cursor-pointer hover:shadow-lg'}`}
                    >
                        <input {...getInputProps()} />
                        <div className="text-center text-gray-400">
                            <svg className="mx-auto h-12 w-12 text-secondary-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <p className="mt-2 text-lg font-medium text-white">{isDragActive ? `Drop your ${currentTab?.id} file here!` : `Drag & Drop your ${currentTab?.id} file, or click to select.`}</p>
                        </div>
                    </div>
                </>
            ) : (
                // --- Website URL UI (Same as before) ---
                <div className="space-y-4 pt-4 animate-slideInFromTop">
                    <p className="text-gray-400 text-sm">
                        Enter the full URL (e.g., https://example.com) to check its web accessibility compliance.
                    </p>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.your-website.com"
                        required
                        className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-secondary-blue focus:border-secondary-blue transition duration-150 shadow-inner"
                    />
                </div>
            )}
            
            {/* File Info / Action Button */}
            {((activeTab !== 'web' && file) || (activeTab === 'web' && url)) && (
                <div className="flex justify-between items-center bg-gray-700 p-4 rounded-lg border border-secondary-blue/50 shadow-md">
                    <div className="text-white">
                        <p className="font-semibold text-lg">{activeTab !== 'web' ? file.name : `URL: ${url}`}</p>
                        {activeTab !== 'web' && <p className="text-xs text-gray-400">{formatBytes(file.size)}</p>}
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={loading}
                        className="px-6 py-2 bg-secondary-blue text-white font-bold rounded-xl hover:bg-primary-blue transition duration-300 disabled:opacity-50 transform hover:scale-105"
                    >
                        {loading ? 'Analyzing...' : 'Analyze Now'}
                    </button>
                </div>
            )}
            
            {/* Messages */}
            {error && <div className="bg-red-600/30 border border-red-500 text-white p-3 rounded-xl shadow-inner animate-shake">{error}</div>}
            {message && !error && <div className="bg-green-600/30 border border-green-500 text-white p-3 rounded-xl shadow-inner animate-pulse">{message}</div>}
        </div>
    );
};

export default UploadComponent;