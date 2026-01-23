import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUserShield } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="fixed w-full z-50 glass-header top-0">
            <div className="container mx-auto px-6 h-20 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black tracking-tighter">
                    genaicourse<span className="text-primary">.io</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <NavLink to="/" active={isActive('/')}>Home</NavLink>
                    <NavLink to="/courses" active={isActive('/courses')}>Courses</NavLink>
                    <NavLink to="/pricing" active={isActive('/pricing')}>Pricing</NavLink>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            {user?.role === 'admin' ? (
                                <div className="flex items-center gap-4">
                                    <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                                        My Dashboard
                                    </Link>
                                    <Link to="/admin/dashboard" className="text-sm font-medium hover:text-primary transition-colors bg-primary/10 px-3 py-1 rounded">
                                        Admin Dashboard
                                    </Link>
                                </div>
                            ) : (
                                <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                                    Dashboard
                                </Link>
                            )}
                            <button
                                onClick={logout}
                                className="btn btn-secondary py-2 px-5 text-sm"
                            >
                                Logout
                            </button>
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-white shadow-lg">
                                    {user?.name?.[0]}
                                </div>
                                {user?.role === 'admin' && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                        <FaUserShield className="text-white text-xs" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn-primary py-2 px-5 text-sm">
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300">
                    {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            <Link to="/" className="text-lg">Home</Link>
                            <Link to="/courses" className="text-lg">Courses</Link>
                            <Link to="/pricing" className="text-lg">Pricing</Link>
                            {isAuthenticated ? (
                                <>
                                    {user?.role === 'admin' ? (
                                        <>
                                            <Link to="/dashboard" className="text-lg">My Dashboard</Link>
                                            <Link to="/admin/dashboard" className="text-lg text-primary">Admin Dashboard</Link>
                                        </>
                                    ) : (
                                        <Link to="/dashboard" className="text-lg">Dashboard</Link>
                                    )}
                                    <button onClick={logout} className="text-left text-gray-400">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="text-lg">Login</Link>
                                    <Link to="/register" className="text-primary text-lg">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

const NavLink = ({ to, children, active }) => (
    <Link
        to={to}
        className={`text-sm font-medium transition-colors relative ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
    >
        {children}
        {active && (
            <motion.div
                layoutId="nav-underline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
            />
        )}
    </Link>
);

export default Navbar;
