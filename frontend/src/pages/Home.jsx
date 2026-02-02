import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { FaRocket, FaCode, FaBrain, FaChevronRight, FaPlay, FaShieldAlt, FaGlobeAsia, FaCheckCircle, FaStar, FaBezierCurve, FaLayerGroup } from 'react-icons/fa';
import { SiFigma, SiSketch, SiAdobexd, SiFramer, SiGoogle, SiAmazon, SiMicrosoft, SiUber, SiSpotify, SiIntel } from 'react-icons/si';

const Home = () => {
    return (
        <div className="min-h-screen relative overflow-hidden bg-[var(--bg-main)] text-[var(--text-main)]">

            {/* Background Orbs (Subtle on Light Mode) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-200/30 blur-[120px] rounded-full mix-blend-multiply"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-200/30 blur-[120px] rounded-full mix-blend-multiply"
                />
            </div>

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 lg:pt-64 lg:pb-48">
                <div className="container relative z-10">
                    <div className="max-w-5xl mx-auto text-center">
                        {/* Status Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-brand text-xs font-bold uppercase tracking-[0.2em] mb-12 shadow-sm"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                            </span>
                            v2.0: The Evolution of Intelligent Learning
                        </motion.div>

                        {/* Main Heading */}
                        <div className="overflow-hidden mb-8">
                            <motion.h1
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-tighter leading-[0.9] text-brand"
                            >
                                AI <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">MASTERY</span> <br />
                                <span className="italic font-serif font-light text-gray-400"></span>
                            </motion.h1>
                        </div>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-lg md:text-2xl text-gray-600 mb-14 max-w-3xl mx-auto font-medium leading-relaxed px-4"
                        >
                            Architect the future with the world's most immersive Generative AI platform.
                            From AI course foundations to advanced prompt engineering.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row justify-center gap-6"
                        >
                            <MagneticButton>
                                <Link to="/courses" className="btn-premium btn-primary !px-12 !py-5 text-lg group shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                                    Start Journey
                                    <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </MagneticButton>

                            <MagneticButton>
                                <Link to="/register" className="btn-premium btn-outline !px-12 !py-5 text-lg group bg-white">
                                    <FaPlay className="text-[10px] text-accent relative z-10" />
                                    <span className="relative z-10">AI Course Demo</span>
                                </Link>
                            </MagneticButton>
                        </motion.div>

                        {/* Social Proof */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="mt-20 flex items-center justify-center gap-8 text-gray-500"
                        >
                            <div className="h-8 w-px bg-gray-300" />
                            <div className="text-left">
                                <div className="flex text-amber-500 gap-1 mb-0.5">
                                    {[1, 2, 3, 4, 5].map(i => <FaStar key={i} size={14} />)}
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest leading-none text-gray-400">Trust by world's best</div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Decorative Elements */}
                {/* <FloatingElements /> removed as per previous request */}
            </section>



            {/* Feature Bento Grid */}
            <section id="features" className="py-40 relative">
                <div className="container relative z-10 text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 inline-block tracking-[0.4em] uppercase text-accent font-black text-xs"
                    >
                        Core Intelligence
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-brand"
                    >
                        Engineered for the <span className="text-accent">Fastest</span> Minds
                    </motion.h2>
                </div>

                <div className="container grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
                    {/* Bento Box 1 */}
                    <BentoCard
                        span="lg:col-span-8"
                        icon={<FaBrain size={32} />}
                        title="Neural Learning Paths"
                        desc="Advanced algorithms analyze your progress to dynamically restructure course content for 3x faster mastery."
                        color="brand"
                    />
                    {/* Bento Box 2 */}
                    <BentoCard
                        span="lg:col-span-4"
                        icon={<FaCode size={32} />}
                        title="Interactive IDE"
                        desc="Browser-integrated neural playground for real-time AI development."
                        color="accent"
                    />
                    {/* Bento Box 3 */}
                    <BentoCard
                        span="lg:col-span-4"
                        icon={<FaRocket size={32} />}
                        title="Hyper-Speed Lab"
                        desc="Deploy GenAI models in seconds using our global edge infrastructure."
                        color="blue"
                    />
                    {/* Bento Box 4 */}
                    <BentoCard
                        span="lg:col-span-8"
                        icon={<FaShieldAlt size={32} />}
                        title="Enterprise Security Grade"
                        desc="Learn prompting and model development within a secure, sandboxed environment that protects your neural data and creative IP."
                        color="green"
                    />
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-64 relative text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gray-100 blur-[150px] rounded-full -z-10" />
                <div className="container relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-6xl md:text-8xl font-black text-brand mb-12 tracking-tighter"
                    >
                        Ready to <br /><span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">Evolve?</span>
                    </motion.h2>
                    <div className="flex justify-center gap-6">
                        <Link to="/courses" className="btn-premium btn-primary !px-16 !py-6 text-xl shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                            Join the Academy
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

/* --- SUB-COMPONENTS --- */

const MagneticButton = ({ children }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { height, width, left, top } = ref.current.getBoundingClientRect();
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        x.set(middleX * 0.2);
        y.set(middleY * 0.2);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const springConfig = { damping: 15, stiffness: 150 };
    const dx = useSpring(x, springConfig);
    const dy = useSpring(y, springConfig);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: dx, y: dy }}
        >
            {children}
        </motion.div>
    );
};

const BentoCard = ({ span, icon, title, desc, color }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className={`${span} glass-card p-10 group relative transition-all duration-500 bg-white border border-gray-200 shadow-sm hover:shadow-xl`}
        >
            <div className={`w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-8 transition-all duration-500 text-brand`}>
                {icon}
            </div>
            <h3 className="text-2xl font-black text-brand mb-4">{title}</h3>
            <p className="text-gray-500 text-lg font-medium leading-relaxed">{desc}</p>
        </motion.div>
    );
};



const FloatingElements = () => {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            {/* Connecting Lines Animation - kept as subtle background without logos */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
                <motion.path
                    d="M100,200 Q400,100 800,300 T1200,200"
                    fill="none"
                    stroke="url(#gradient-line)"
                    strokeWidth="2"
                    strokeDasharray="10,10"
                    animate={{ strokeDashoffset: [0, 1000] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
                <defs>
                    <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8B5CF6" />
                        <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};



export default Home;
