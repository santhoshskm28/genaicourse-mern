import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full -z-10">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-primary opacity-20 blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-secondary opacity-10 blur-[120px]" />
                </div>

                <div className="container text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl font-black mb-6 tracking-tight"
                    >
                        Master <span className="text-gradient">GenAI</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto font-light"
                    >
                        The ultimate platform to learn Large Language Models, Prompt Engineering, and AI Development.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex justify-center gap-6"
                    >
                        <Link to="/courses" className="btn btn-primary text-lg px-8 py-4">
                            Start Learning
                        </Link>
                        <Link to="/register" className="btn btn-secondary text-lg px-8 py-4">
                            Get Started Free
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 border-y border-slate-800 bg-slate-900/50">
                <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <StatItem number="10+" label="Premium Courses" delay={0} />
                    <StatItem number="5k+" label="Active Students" delay={0.2} />
                    <StatItem number="100%" label="Completion Rate" delay={0.4} />
                </div>
            </section>
        </div>
    );
};

const StatItem = ({ number, label, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
    >
        <div className="text-5xl font-bold text-white mb-2">{number}</div>
        <div className="text-gray-400 uppercase tracking-widest text-sm">{label}</div>
    </motion.div>
);

export default Home;
