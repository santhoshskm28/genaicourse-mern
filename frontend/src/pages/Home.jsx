import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { HeroParallaxDemo } from '../components/HeroParallaxDemo';
import { CertificationSteps } from '../components/CertificationSteps';
import { motion, useScroll, useTransform, useSpring, useMotionValue, AnimatePresence } from 'framer-motion';
import { FaRocket, FaCode, FaBrain, FaChevronRight, FaPlay, FaShieldAlt, FaGlobeAsia, FaCheckCircle, FaStar, FaBezierCurve, FaLayerGroup } from 'react-icons/fa';
import { SiFigma, SiSketch, SiAdobexd, SiFramer, SiGoogle, SiAmazon, SiMicrosoft, SiUber, SiSpotify, SiIntel } from 'react-icons/si';
import Pricing from './Pricing';

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

            {/* Hero Section with Parallax */}
            <HeroParallaxDemo />

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

            {/* Certification Steps */}
            <CertificationSteps />

            {/* Pricing Section */}
            <Pricing />

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

export default Home;
