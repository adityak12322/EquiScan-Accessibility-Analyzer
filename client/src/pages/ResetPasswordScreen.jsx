import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordScreen = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    
    const { token } = useParams(); // URL se token extract kiya
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            // Backend API call to reset password
            const { data } = await axios.put(
                `http://localhost:5000/api/auth/reset-password/${token}`, // Token URL mein bheja
                { password: password },
                config
            );
            
            setMessage(data.message + " Redirecting to login..."); 
            
            // Redirect to login after successful reset
            setTimeout(() => {
                navigate('/login');
            }, 3000);
            
        } catch (err) {
            setError(err.response?.data?.message || 'Error resetting password. Token may be invalid or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 animate-fadeIn">
            <div className="bg-card-bg p-10 rounded-2xl shadow-3xl w-full max-w-sm border border-secondary-blue/30">
                
                <div className="text-center mb-8">
                    <span className="text-red-400 text-4xl mb-2 block">🔑</span>
                    <h2 className="text-3xl font-bold text-white">Set New Password</h2>
                    <p className="text-gray-400 text-sm mt-2">Enter your new secure password.</p>
                </div>

                {error && <div className="bg-red-600/30 border border-red-500 text-white p-3 rounded-xl mb-4 text-sm animate-shake">{error}</div>}
                {message && <div className="bg-green-600/30 border border-green-500 text-white p-3 rounded-xl mb-4 text-sm animate-pulse">{message}</div>}


                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">New Password (Min 6 chars)</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength="6"
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-secondary-blue focus:border-secondary-blue transition duration-150 shadow-inner"
                            placeholder="Enter new password"
                        />
                    </div>
                    
                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-secondary-blue focus:border-secondary-blue transition duration-150 shadow-inner"
                            placeholder="Confirm new password"
                        />
                    </div>


                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-primary-blue hover:bg-secondary-blue transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordScreen;