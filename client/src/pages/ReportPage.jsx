import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Score color helper
const getScoreColor = (score) => {
    if (score >= 70) return 'bg-green-600';
    if (score >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
};

// --- Report Page Component ---
const ReportPage = () => {
    const { id } = useParams(); // URL se ID li
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const token = userInfo ? userInfo.token : null;

    useEffect(() => {
        const fetchReport = async () => {
            if (!token) {
                navigate('/login');
                return;
            }
            
            setLoading(true);
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                // Backend route: /api/analysis/report/:id
                const { data } = await axios.get(`http://localhost:5000/api/analysis/report/${id}`, config);
                setReport(data);
                setError('');
            } catch (err) {
                console.error('Report Fetch Error:', err);
                setError(err.response?.data?.message || 'Failed to load report. Invalid ID or not ready.');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id, token, navigate]);


    // --- Loading and Error States ---
    if (!token) return null; // Already redirect ho chuka hoga ProtectedRoute se

    if (loading) {
        return (
            <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
                <p className="text-xl text-secondary-blue animate-pulse">Loading Report...</p>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="min-h-screen bg-dark-bg text-white p-10">
                <div className="max-w-4xl mx-auto bg-card-bg p-8 rounded-xl shadow-2xl border border-red-500/50">
                    <h1 className="text-3xl font-bold text-red-500 mb-4">Report Error</h1>
                    <p className="text-gray-300">{error || "Report details could not be found."}</p>
                    <Link to="/dashboard" className="mt-6 inline-block text-secondary-blue hover:underline">
                        ← Go back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // --- Main Report Content ---
    const scoreColor = getScoreColor(report.accessibilityScore);
    const isATSApplicable = report.fileType === 'pdf' || report.fileType === 'docx';
    const errorList = report.reportData || [];

    return (
        <div className="min-h-screen bg-dark-bg text-white p-4">
            <div className="max-w-6xl mx-auto py-8">
                <Link to="/dashboard" className="text-secondary-blue hover:text-blue-300 transition duration-150 flex items-center mb-6">
                    <span className="mr-2">←</span> Go back to Dashboard
                </Link>

                <div className="bg-card-bg p-8 rounded-2xl shadow-2xl border border-secondary-blue/50">
                    <h1 className="text-4xl font-extrabold text-white mb-2">
                        📋 Analysis Report: <span className="text-secondary-blue">{report.fileName}</span>
                    </h1>
                    <p className="text-gray-400 text-sm mb-8">
                        Analyzed on: {new Date(report.createdAt).toLocaleString()} | Type: <span className="uppercase font-semibold">{report.fileType}</span>
                    </p>

                    {/* --- Score Overview Section --- */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                        {/* WCAG Score Card */}
                        <div className={`p-6 rounded-xl shadow-lg border-t-4 ${scoreColor} bg-gray-700/50`}>
                            <p className="text-gray-300 font-semibold mb-2">WCAG Accessibility Score</p>
                            <div className="text-5xl font-extrabold flex items-end">
                                <span className="text-white">{report.accessibilityScore}</span>
                                <span className="text-2xl text-gray-400 ml-2">/ 100</span>
                            </div>
                        </div>

                        {/* Error Count Card */}
                        <div className="p-6 rounded-xl shadow-lg border-t-4 border-red-500 bg-gray-700/50">
                            <p className="text-gray-300 font-semibold mb-2">Total Issues Found</p>
                            <span className="text-5xl font-extrabold text-red-400">{report.errorCount}</span>
                        </div>

                        {/* ATS Score Card */}
                        <div className={`p-6 rounded-xl shadow-lg border-t-4 ${isATSApplicable ? 'border-indigo-500' : 'border-gray-500'} bg-gray-700/50`}>
                            <p className="text-gray-300 font-semibold mb-2">ATS Score (Resume Match)</p>
                            <span className={`text-5xl font-extrabold ${isATSApplicable ? 'text-indigo-400' : 'text-gray-500'}`}>
                                {isATSApplicable ? (report.atsScore || '--') : 'N/A'}
                            </span>
                        </div>
                    </div>

                    {/* --- Detailed Issues Section --- */}
                    <h2 className="text-3xl font-bold text-gray-100 mb-6 border-b border-gray-700 pb-2">
                        🚧 Detailed Issues ({errorList.length})
                    </h2>

                    <div className="space-y-6">
                        {errorList.length === 0 ? (
                            <p className="text-lg text-green-400">🎉 Congratulations! No major accessibility issues were detected.</p>
                        ) : (
                            errorList.map((issue, index) => (
                                <div key={index} className="bg-gray-800 p-5 rounded-xl shadow-md border-l-4 border-red-500 transition duration-200 hover:border-red-400">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-xl font-semibold text-red-300">{issue.message}</p>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${issue.priority === 'High' ? 'bg-red-800 text-red-200' : 'bg-yellow-800 text-yellow-200'}`}>
                                            {issue.priority}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mb-2">
                                        **Code:** {issue.code}
                                    </p>
                                    <p className="text-sm text-gray-300 border-l-2 border-primary-blue pl-3 italic">
                                        **Suggestion:** {issue.suggestion || 'Review the affected section in your document/website and apply WCAG best practices.'}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;