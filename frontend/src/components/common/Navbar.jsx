import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUserShield, FaChevronRight } from 'react-icons/fa';
import { MagneticButton } from '../ui/MagneticButton';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
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
                ? 'py-4 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm'
                : 'py-6 bg-transparent'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center text-brand">
                <Link to="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="GenAI" className="h-16 w-auto object-contain" />
                    <div className="flex items-baseline">
                        <span className="text-2xl font-black tracking-tight text-brand leading-none">GENAICOURSE</span>
                        <span className="text-2xl font-bold text-accent tracking-widest uppercase leading-none">.IO</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden lg:flex items-center gap-8">
                    <div className="flex items-center gap-6 bg-white/80 px-8 py-2.5 rounded-full border border-gray-200/50 backdrop-blur-md shadow-sm">
                        <NavLink to="/" active={isActive('/')}>Home</NavLink>
                        <Link to="/#features" className="text-sm font-bold text-gray-500 hover:text-brand transition-colors">Features</Link>
                        <NavLink to="/courses" active={isActive('/courses')}>Courses</NavLink>
                        <NavLink to="/pricing" active={isActive('/pricing')}>Pricing</NavLink>
                    </div>

                    {isAuthenticated ? (
                        <div className="relative ml-4">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="w-10 h-10 rounded-full bg-brand text-white font-bold flex items-center justify-center hover:bg-gray-800 transition-colors border border-gray-200"
                            >
                                {user?.name?.[0]}
                            </button>

                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden z-50 origin-top-right"
                                    >
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setUserMenuOpen(false)}
                                            className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-brand"
                                        >
                                            My Dashboard
                                        </Link>
                                        {user?.role === 'admin' && (
                                            <Link
                                                to="/admin/dashboard"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="block px-4 py-2 text-sm font-medium text-accent hover:bg-gray-50"
                                            >
                                                Admin Panel
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => { logout(); setUserMenuOpen(false); }}
                                            className="w-full text-left px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
                                        >
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-brand transition-colors">
                                Sign In
                            </Link>
                            <MagneticButton>
                                <Link to="/register" className="btn-premium btn-primary !py-3 !px-6 text-sm">
                                    Create Account
                                    <FaChevronRight className="text-[10px]" />
                                </Link>
                            </MagneticButton>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="lg:hidden w-11 h-11 bg-white rounded-2xl flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors text-brand"
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
                        className="lg:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200 px-6 py-8 shadow-2xl z-40"
                    >
                        <div className="flex flex-col gap-6">
                            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                            <MobileNavLink to="/courses" onClick={() => setIsOpen(false)}>Courses</MobileNavLink>
                            <MobileNavLink to="/pricing" onClick={() => setIsOpen(false)}>Pricing</MobileNavLink>
                            <div className="h-px bg-gray-200"></div>
                            {isAuthenticated ? (
                                <>
                                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold text-brand">My Learning</Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-bold text-accent">Admin Area</Link>
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
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg text-brand">Sign In</Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)} className="btn-premium btn-primary text-center justify-center">Get Started Free</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav >
    );
};

const NavLink = ({ to, children, active }) => {
    const handleClick = () => {
        if (active) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <Link
            to={to}
            onClick={handleClick}
            className={`text-sm font-bold transition-all relative px-2 py-1 ${active ? 'text-brand' : 'text-gray-500 hover:text-brand'}`}
        >
            {children}
            {active && (
                <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
                />
            )}
        </Link>
    );
};

const MobileNavLink = ({ to, children, onClick }) => (
    <Link to={to} onClick={onClick} className="text-2xl font-black text-brand hover:text-accent transition-colors uppercase tracking-tight">
        {children}
    </Link>
);

export default Navbar;
