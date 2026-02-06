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
                            Join Us
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
