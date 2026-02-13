import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMailBulk, FaArrowLeft } from 'react-icons/fa';

/**
 * Forgot Password Page
 * 
 * Allows users to request a password reset link.
 * Implements security best practices by not revealing if an email exists.
 */
const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/forgot-password`, { email });

            if (response.data.success) {
                setIsSubmitted(true);
                toast.success('Reset link sent if account exists');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full glass-card p-8 rounded-2xl shadow-2xl"
            >
                {!isSubmitted ? (
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaMailBulk size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900">Forgot Password?</h2>
                            <p className="text-slate-500 mt-2">Enter your email and we'll send you a link to reset your password.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full btn-premium py-4 rounded-xl flex items-center justify-center space-x-2"
                            >
                                {isLoading ? (
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <span>Send Reset Link</span>
                                )}
                            </button>

                            <Link to="/login" className="flex items-center justify-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors">
                                <FaArrowLeft className="mr-2" size={12} />
                                Back to Login
                            </Link>
                        </form>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaMailBulk size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Check Your Inbox</h2>
                        <p className="text-slate-600 mb-8">
                            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                        </p>
                        <div className="space-y-4">
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-indigo-600 font-semibold hover:underline"
                            >
                                Didn't receive the email? Try again
                            </button>
                            <Link to="/login" className="block w-full btn-outline py-3 rounded-xl">
                                Return to Login
                            </Link>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
