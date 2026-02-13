import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSocialLogin = (provider) => {
        window.location.href = `http://localhost:5000/api/auth/${provider}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            await register(registerData);
            toast.success('Account created successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] relative overflow-hidden py-20 px-4">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400 rounded-full blur-[140px] opacity-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-400 rounded-full blur-[140px] opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full max-w-[460px] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[32px] overflow-hidden relative z-10"
            >
                <div className="p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Create Account</h2>
                        <p className="text-slate-500 font-medium font-medium">Join us and start your learning journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-[15px] rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-4 transition-all outline-none font-medium placeholder:text-slate-400"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-[15px] rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-4 pr-10 transition-all outline-none font-medium placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700 ml-1">Confirm</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-[15px] rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 block p-4 pr-10 transition-all outline-none font-medium placeholder:text-slate-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.01, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 text-white bg-blue-600 hover:bg-blue-700 font-bold rounded-2xl text-[16px] shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all duration-300 mt-6 flex items-center justify-center"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                'Register Now'
                            )}
                        </motion.button>
                    </form>

                    <div className="my-10 flex items-center gap-4">
                        <div className="h-[1px] flex-1 bg-slate-200"></div>
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest text-[10px]">or register with</p>
                        <div className="h-[1px] flex-1 bg-slate-200"></div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <SocialButton icon={<FaGoogle className="text-red-500" />} onClick={() => handleSocialLogin('google')} />
                        <SocialButton icon={<FaGithub className="text-slate-900" />} onClick={() => handleSocialLogin('github')} />
                        <SocialButton icon={<FaLinkedinIn className="text-blue-600" />} onClick={() => handleSocialLogin('linkedin')} />
                    </div>

                    <p className="mt-10 text-center text-[15px] text-slate-500 font-medium">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-all underline underline-offset-4">
                            Log In
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

export default Register;
