import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaGoogle, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialLogin = (provider) => {
        // Redirection to the backend OAuth root
        window.location.href = `http://localhost:5000/api/auth/${provider}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login(formData);
            toast.success('Welcome back!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden py-10 px-4">
            {/* Animated background elements for premium feel */}
            <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400 rounded-full blur-[140px] opacity-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-400 rounded-full blur-[140px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[440px] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] overflow-hidden relative z-10"
            >
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ y: -10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Welcome Back</h2>
                            <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
                        </motion.div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-[15px] rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-4 transition-all outline-none font-medium placeholder:text-slate-400"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                <Link to="/forgot-password" size="sm" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="relative group">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-[15px] rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-4 pr-12 transition-all outline-none font-medium placeholder:text-slate-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-2xl text-[16px] shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                'Log In'
                            )}
                        </motion.button>
                    </form>

                    <div className="my-10 flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-slate-200"></div>
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest text-[10px]">or sign in with</p>
                        <div className="h-[1px] flex-1 bg-slate-200"></div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <SocialButton
                            icon={<FaGoogle className="text-red-500" />}
                            onClick={() => handleSocialLogin('google')}
                        />
                        <SocialButton
                            icon={<FaGithub className="text-slate-900" />}
                            onClick={() => handleSocialLogin('github')}
                        />
                        <SocialButton
                            icon={<FaLinkedinIn className="text-blue-600" />}
                            onClick={() => handleSocialLogin('linkedin')}
                        />
                    </div>

                    <p className="mt-10 text-center text-[15px] text-slate-500 font-medium">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-blue-600 hover:text-blue-700 transition-all underline underline-offset-4">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

const SocialButton = ({ icon, onClick }) => (
    <motion.button
        whileHover={{ scale: 1.05, translateY: -4, boxShadow: "0 10px 20px rgba(0,0,0,0.05)" }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className="w-[72px] h-[60px] rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-xl transition-all duration-300 hover:border-slate-300"
    >
        {icon}
    </motion.button>
);

export default Login;
