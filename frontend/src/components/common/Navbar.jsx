import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUserShield, FaChevronRight } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-500 top-0 ${scrolled
                    ? 'py-4 bg-slate-950/80 backdrop-blur-xl border-b border-white/5'
                    : 'py-6 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center text-white">
                <Link to="/" className="text-2xl font-black tracking-tight group">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-fuchsia-400">genaicourse</span>
                    <span className="text-white group-hover:text-indigo-400 transition-colors">.io</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-10">
                    <div className="flex items-center gap-8 bg-white/5 px-6 py-2 rounded-2xl border border-white/5 backdrop-blur-sm">
                        <NavLink to="/" active={isActive('/')}>Home</NavLink>
                        <NavLink to="/courses" active={isActive('/courses')}>Courses</NavLink>
                        <NavLink to="/pricing" active={isActive('/pricing')}>Pricing</NavLink>
                    </div>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-end mr-2">
                                <span className="text-sm font-bold text-white leading-none">{user?.name}</span>
                                <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold mt-1">{user?.role}</span>
                            </div>

                            <div className="relative group">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-0.5 shadow-lg group-hover:rotate-6 transition-transform duration-300">
                                    <div className="bg-slate-950 w-full h-full rounded-[14px] flex items-center justify-center font-bold text-white overflow-hidden">
                                        {user?.name?.[0]}
                                    </div>
                                </div>
                                {user?.role === 'admin' && (
                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full border-2 border-slate-950 flex items-center justify-center">
                                        <FaUserShield className="text-white text-[10px]" />
                                    </div>
                                )}

                                {/* User Menu Tooltip */}
                                <div className="absolute right-0 top-full mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                    <div className="glass-card p-2 shadow-2xl">
                                        <Link to="/dashboard" className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-xl transition-colors">
                                            <span className="text-sm">My Dashboard</span>
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link to="/admin/dashboard" className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-xl transition-colors text-indigo-400">
                                                <span className="text-sm">Admin Panel</span>
                                            </Link>
                                        )}
                                        <div className="h-px bg-white/5 my-2"></div>
                                        <button
                                            onClick={logout}
                                            className="w-full text-left p-3 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors text-sm"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                                Sign In
                            </Link>
                            <Link to="/register" className="btn-premium btn-primary-gradient !py-3 !px-6 text-sm">
                                Create Account
                                <FaChevronRight className="text-[10px]" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden w-11 h-11 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors"
                >
                    {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="lg:hidden absolute top-full left-0 w-full bg-slate-950 border-b border-white/5 px-6 py-8 shadow-2xl z-40"
                    >
                        <div className="flex flex-col gap-6">
                            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                            <MobileNavLink to="/courses" onClick={() => setIsOpen(false)}>Courses</MobileNavLink>
                            <MobileNavLink to="/pricing" onClick={() => setIsOpen(false)}>Pricing</MobileNavLink>
                            <div className="h-px bg-white/5"></div>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold">My Learning</Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold text-indigo-400">Admin Area</Link>
                                    )}
                                    <button
                                        onClick={() => { logout(); setIsOpen(false); }}
                                        className="text-left text-red-500 font-bold"
                                    >
                                        Log Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg">Sign In</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="btn-premium btn-primary-gradient">Get Started Free</Link>
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
        className={`text-sm font-bold transition-all relative px-2 py-1 ${active ? 'text-white' : 'text-slate-400 hover:text-white'}`}
    >
        {children}
        {active && (
            <motion.div
                layoutId="nav-underline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full"
            />
        )}
    </Link>
);

const MobileNavLink = ({ to, children, onClick }) => (
    <Link to={to} onClick={onClick} className="text-2xl font-black text-white hover:text-indigo-400 transition-colors uppercase tracking-tight">
        {children}
    </Link>
);

export default Navbar;
