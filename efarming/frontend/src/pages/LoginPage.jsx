// src/pages/LoginPage.jsx - Complete updated file
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, User, Eye, EyeOff, LogIn } from 'lucide-react';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('farmer');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    // src/pages/LoginPage.jsx - Update handleSubmit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login({ email, password }, userType);

            console.log('Login result:', result);

            // If we get here and haven't navigated, there's an issue
            if (!result?.success) {
                setError(result?.message || 'Login failed. Please check your credentials.');
            }
            // Navigation is handled in the login function itself
        } catch (error) {
            console.error('Login page error:', error);
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-3 rounded-xl">
                            <LogIn className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to access your eFarmer account</p>
                </div>

                <div className="card p-8">
                    {/* User Type Selector */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setUserType('farmer')}
                            className={`p-4 rounded-xl text-center transition-all duration-200 ${userType === 'farmer'
                                    ? 'bg-gradient-to-r from-primary-50 to-primary-100 border-2 border-primary-200'
                                    : 'border-2 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className={`h-10 w-10 rounded-full mx-auto mb-2 flex items-center justify-center ${userType === 'farmer'
                                    ? 'bg-gradient-to-r from-primary-500 to-primary-600'
                                    : 'bg-gray-100'
                                }`}>
                                <User className={`h-5 w-5 ${userType === 'farmer' ? 'text-white' : 'text-gray-400'
                                    }`} />
                            </div>
                            <span className={`font-medium ${userType === 'farmer' ? 'text-primary-700' : 'text-gray-700'
                                }`}>
                                Farmer
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setUserType('admin')}
                            className={`p-4 rounded-xl text-center transition-all duration-200 ${userType === 'admin'
                                    ? 'bg-gradient-to-r from-secondary-50 to-secondary-100 border-2 border-secondary-200'
                                    : 'border-2 border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className={`h-10 w-10 rounded-full mx-auto mb-2 flex items-center justify-center ${userType === 'admin'
                                    ? 'bg-gradient-to-r from-secondary-500 to-secondary-600'
                                    : 'bg-gray-100'
                                }`}>
                                <User className={`h-5 w-5 ${userType === 'admin' ? 'text-white' : 'text-gray-400'
                                    }`} />
                            </div>
                            <span className={`font-medium ${userType === 'admin' ? 'text-secondary-700' : 'text-gray-700'
                                }`}>
                                Admin
                            </span>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-field pl-12"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="input-field pl-12 pr-12"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <LogIn className="h-5 w-5" />
                            )}
                            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-center text-gray-600">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                                Create account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;