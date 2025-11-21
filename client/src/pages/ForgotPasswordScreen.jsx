import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordScreen = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            // Backend API call to send reset link
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/forgot-password',
                { email },
                config
            );
            
            setMessage(data.message); // Server se aaya hua message dikhao
            
        } catch (err) {
            setError(err.response?.data?.message || 'Error processing request. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg p-4 animate-fadeIn">
            <div className="bg-card-bg p-10 rounded-2xl shadow-3xl w-full max-w-sm border border-secondary-blue/30">
                
                <div className="text-center mb-8">
                    <span className="text-red-400 text-4xl mb-2 block">🔒</span>
                    <h2 className="text-3xl font-bold text-white">Forgot Password?</h2>
                    <p className="text-gray-400 text-sm mt-2">Enter your email to receive a password reset link.</p>
                </div>

                {error && <div className="bg-red-600/30 border border-red-500 text-white p-3 rounded-xl mb-4 text-sm animate-shake">{error}</div>}
                {message && <div className="bg-green-600/30 border border-green-500 text-white p-3 rounded-xl mb-4 text-sm animate-pulse">{message}</div>}


                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-secondary-blue focus:border-secondary-blue transition duration-150 shadow-inner"
                            placeholder="name@example.com"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-primary-blue hover:bg-secondary-blue transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <Link to="/login" className="text-sm font-medium text-secondary-blue hover:text-blue-300">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordScreen;