import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaApple } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] relative overflow-hidden py-20 px-4">
            {/* Background Orbs to match request */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[20px] p-8 md:p-10 relative z-10"
            >
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-[#1F2937] mb-2 tracking-tight">Welcome Back</h2>
                    <p className="text-gray-500 font-medium">We are really happy to see you again!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        {/* Email Input - No Label, just Placeholder style */}
                        <div className="relative group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#F3F4F6] border-none text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 block w-full p-4 pl-5 hover:bg-white transition-all outline-none font-medium placeholder:text-gray-500"
                                placeholder="Email Address"
                                required
                                data-testid="email-input"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-[#F3F4F6] border-none text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 block w-full p-4 pl-5 pr-12 hover:bg-white transition-all outline-none font-medium placeholder:text-gray-500"
                                placeholder="Password"
                                required
                                data-testid="password-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                        <div className="flex justify-start pt-1">
                            <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors transform hover:translate-x-1 duration-200 inline-block">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-[#3B82F6] hover:bg-blue-600 font-bold rounded-xl text-lg px-5 py-4 text-center shadow-lg shadow-blue-500/30 transition-all duration-300"
                        data-testid="login-button"
                    >
                        {loading ? 'Signing in...' : 'Log In'}
                    </motion.button>
                </form>

                <div className="my-8 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-200 after:mt-0.5 after:flex-1 after:border-t after:border-gray-200">
                    <p className="mx-4 mb-0 text-center text-sm font-medium text-gray-400">or sign in with</p>
                </div>

                <div className="flex gap-4 justify-center">
                    <SocialButton icon={<FaGoogle />} label="Google" />
                    <SocialButton icon={<FaFacebook />} label="Facebook" />
                    <SocialButton icon={<FaApple />} label="Apple" />
                </div>

                <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                    Need an account?{' '}
                    <Link to="/register" className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all">
                        Sign Up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

const SocialButton = ({ icon }) => (
    <motion.button
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        className="w-16 h-12 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-white hover:text-blue-600 hover:shadow-md transition-all duration-300"
    >
        <span className="text-xl">{icon}</span>
    </motion.button>
);

export default Login;
