import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/login',
                { email, password },
                config
            );
            
            // Success: Token saving and redirect
            localStorage.setItem('userInfo', JSON.stringify(data));
            
            setTimeout(() => {
                navigate('/dashboard'); 
            }, 1000);

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // ✅ Outer Container: Full screen grid
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-dark-bg text-white">
            
            {/* ⬅️ Left Column: Visual Accent (Brand Display) */}
            <div className="hidden lg:flex items-center justify-center bg-primary-blue/10 p-12">
                <div className="text-center">
                    <h1 className="text-6xl font-extrabold text-secondary-blue mb-4 animate-fadeIn">EquiScan</h1>
                    <p className="text-xl text-gray-300 max-w-sm mx-auto">
                        Your Accessibility & Quality Hub. Ensure compliance with WCAG standards.
                    </p>
                    <div className="mt-8 text-sm text-gray-500">MERN Stack | Major Project</div>
                </div>
            </div>

            {/* ➡️ Right Column: Login Form */}
            <div className="flex items-center justify-center p-4">
                <div className="bg-card-bg p-10 rounded-2xl shadow-3xl w-full max-w-md border border-secondary-blue/30 
                            transform transition duration-500 hover:shadow-secondary-blue/20 animate-fadeIn">
                    
                    <div className="text-center mb-8">
                        <span className="text-secondary-blue text-4xl mb-2 block">🔒</span>
                        <h2 className="text-3xl font-bold text-white">Access Dashboard</h2>
                        <p className="text-gray-400 text-sm">Sign in to continue analysis.</p>
                    </div>

                    {error && <div className="bg-red-600/30 border border-red-500 text-white p-3 rounded-xl mb-4 text-sm animate-shake">{error}</div>}

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-secondary-blue focus:border-secondary-blue transition duration-150 shadow-inner"
                                placeholder="name@example.com"
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                className="mt-1 block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-secondary-blue focus:border-secondary-blue transition duration-150 shadow-inner"
                                placeholder="Enter password"
                            />
                        </div>

                        {/* ✅ NEW: Forgot Password Link */}
                        <div className="text-right pt-0 mt-0">
                            <Link 
                                to="/forgot-password" 
                                className="text-xs font-medium text-gray-500 hover:text-secondary-blue transition duration-150"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                        
                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 rounded-xl shadow-lg text-lg font-bold text-white bg-primary-blue hover:bg-secondary-blue transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                        >
                            {loading ? 'Logging In...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-bold text-secondary-blue hover:text-blue-300 transition duration-150">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoginPage;