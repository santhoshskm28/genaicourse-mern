import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
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
        <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB] relative overflow-hidden py-20 px-4">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-100 rounded-full blur-[100px] opacity-50 pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-[20px] p-8 md:p-10 relative z-10"
            >
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black text-[#1F2937] mb-3 tracking-tight">Create Your Account</h2>
                    <p className="text-[#3B82F6] font-bold text-lg">Join us and start learning!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        {/* Full Name Input - Clean Style */}
                        <div className="relative group">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full bg-[#F3F4F6] border-none text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 block w-full p-4 pl-5 transition-all outline-none font-medium placeholder:text-gray-400"
                                placeholder="Full Name"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative group">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full bg-[#F3F4F6] border-none text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 block w-full p-4 pl-5 transition-all outline-none font-medium placeholder:text-gray-400"
                                placeholder="Email Address"
                                required
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
                                className="w-full bg-[#F3F4F6] border-none text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 block w-full p-4 pl-5 pr-12 transition-all outline-none font-medium placeholder:text-gray-400"
                                placeholder="Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="relative group">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="w-full bg-[#F3F4F6] border-none text-gray-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 block w-full p-4 pl-5 pr-12 transition-all outline-none font-medium placeholder:text-gray-400"
                                placeholder="Confirm Password"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full text-white bg-[#3B82F6] hover:bg-blue-600 font-bold rounded-xl text-lg px-5 py-4 text-center shadow-lg shadow-blue-500/30 transition-all duration-300 mt-6"
                    >
                        {loading ? 'Creating Account...' : 'Register'}
                    </motion.button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-500 font-medium">
                    Already have on account?{' '}
                    <Link to="/login" className="font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all">
                        Log In
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
