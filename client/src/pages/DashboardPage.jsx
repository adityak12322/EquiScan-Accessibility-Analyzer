import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadComponent from '../components/UploadComponent';
import Footer from '../components/Footer'; 
import Chatbot from '../components/Chatbot'; // ✅ Chatbot Import kiya
import axios from 'axios';

// Score color helper function (Used by HistoryItem)
const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-green-400 border-green-500';
    if (score >= 50) return 'text-yellow-400 border-yellow-500';
    return 'text-red-400 border-red-500';
};

// --- History Item Component (Updated with Delete Logic) ---
const HistoryItem = ({ analysis, token, fetchHistory }) => {
    const navigate = useNavigate(); 
    
    // Status ke hisaab se badge color
    const statusBadge = analysis.status === 'Completed' ? 'bg-green-600/50 text-white'
        : analysis.status === 'Processing' ? 'bg-yellow-600/50 text-white animate-pulse'
        : 'bg-red-600/50 text-white';
    
    const isResume = analysis.fileType === 'docx' || analysis.fileType === 'pdf';
    const scoreClass = getScoreColorClass(analysis.accessibilityScore);

    const handleViewReport = () => { navigate(`/report/${analysis._id}`); };

    // ✅ Delete Logic
    const handleDelete = async () => {
        if (!window.confirm(`Are you sure you want to delete analysis for: ${analysis.fileName}?`)) { return; }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/analysis/record/${analysis._id}`, config);
            fetchHistory(); // History ko refresh karna
        } catch (error) {
            console.error('Deletion failed:', error);
            alert('Failed to delete record. See console.');
        }
    };


    return (
        <tr className="border-b border-gray-700 hover:bg-gray-700/70 transition duration-200">
            <td className="px-6 py-4 font-medium text-gray-200 truncate max-w-xs">{analysis.fileName}</td>
            <td className="px-6 py-4 text-gray-300 uppercase">{analysis.fileType}</td>
            <td className="px-6 py-4">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusBadge}`}>
                    {analysis.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <div className={`p-1 w-12 h-12 flex items-center justify-center rounded-full border-2 ${scoreClass}`}>
                    <span className={`text-sm font-bold`}>{analysis.accessibilityScore || '--'}</span>
                </div>
            </td>
            <td className="px-6 py-4 text-center">
                <span className={`text-sm font-bold ${isResume ? 'text-indigo-400' : 'text-gray-500'}`}>
                    {isResume ? (analysis.atsScore || '--') : 'N/A'}
                </span>
            </td>
            <td className="px-6 py-4 text-gray-400 text-sm">{new Date(analysis.createdAt).toLocaleDateString()}</td>
            <td className="px-6 py-4 flex flex-col space-y-1">
                <button 
                    onClick={handleViewReport} 
                    disabled={analysis.status !== 'Completed'}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition duration-300
                                ${analysis.status === 'Completed' ? 'bg-secondary-blue text-white hover:bg-primary-blue' : 'bg-gray-500 text-gray-200 cursor-not-allowed'}`}
                >
                    View Report
                </button>
                 <button
                    onClick={handleDelete}
                    className="px-3 py-2 rounded-lg text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition duration-150"
                >
                    Delete
                </button>
            </td>
        </tr>
    );
};
// -------------------------------------------------------------------

// --- DashboardPage Component ---
const DashboardPage = () => {
    const navigate = useNavigate();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); 
    
    // Fallback and Protection
    if (!userInfo || !userInfo.token) { navigate('/login'); return null; }

    const token = userInfo.token;
    const userName = userInfo.name.split(' ')[0] || 'User';

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get('http://localhost:5000/api/analysis/history', config);
            setHistory(data);
        } catch (error) {
            console.error('Error fetching history:', error);
            if (error.response && error.response.status === 401) { localStorage.removeItem('userInfo'); navigate('/login'); }
        } finally { setLoading(false); }
    };
    
    useEffect(() => {
        fetchHistory();
        const intervalId = setInterval(() => { if (history.some(item => item.status === 'Processing')) { fetchHistory(); } }, 10000); 
        return () => clearInterval(intervalId); 
    }, [token, history.length, navigate]); 

    const handleLogout = () => { localStorage.removeItem('userInfo'); navigate('/login'); };
    
    return (
        // ✅ Outer container: flex-col ensures footer sticks to the bottom
        <div className="min-h-screen bg-dark-bg text-white flex flex-col">
            {/* Header / Navbar */}
            <header className="bg-card-bg shadow-lg border-b border-primary-blue/50">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-extrabold text-secondary-blue">
                        EquiScan <span className="text-gray-200">Dashboard</span>
                    </h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300 font-semibold text-lg animate-pulseGreeting">Welcome, {userName}!</span>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition duration-150 transform hover:scale-105 shadow-md">Logout</button>
                    </div>
                </div>
            </header>

            {/* Main Content Area - Use flex-grow to push footer down */}
            <main className="flex-grow max-w-7xl mx-auto py-10 sm:px-6 lg:px-8 space-y-10 w-full">
                <UploadComponent />

                <div className="mt-10 animate-slideInFromBottom">
                    <h2 className="text-3xl font-extrabold mb-4 text-gray-100 flex items-center border-b border-gray-700 pb-2">
                        <span className='mr-3'>⏱️</span> Analysis History
                    </h2>
                    <div className="bg-card-bg rounded-2xl shadow-xl border border-primary-blue/30 overflow-x-auto">
                        {/* Table View */}
                        {!loading && history.length > 0 && (
                            <table className="min-w-full divide-y divide-gray-700">
                                <thead className="bg-gray-700">
                                    <tr>
                                        {['File Name', 'Type', 'Status', 'WCAG Score', 'ATS Score', 'Date', 'Actions'].map((header) => (
                                            <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {history.map((analysis) => (
                                        <HistoryItem key={analysis._id} analysis={analysis} token={token} fetchHistory={fetchHistory} />
                                    ))}
                                </tbody>
                            </table>
                        )}
                        
                        {/* Loading/Empty State */}
                        {loading && (<p className="p-6 text-gray-400 text-center">Loading history...</p>)}
                        {!loading && history.length === 0 && (<p className="p-6 text-gray-400 text-center">No analysis reports found. Upload a file or analyze a website to start!</p>)}
                    </div>
                </div>
            </main>
            
            {/* ✅ Footer Component Add kiya */}
            <Footer /> 
            
            {/* ✅ Chatbot Component Add kiya */}
            <Chatbot />

        </div>
    );
};

export default DashboardPage;