import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheck, FaBolt } from 'react-icons/fa';

const Pricing = () => {
    return (
        <section id="pricing" className="py-32 bg-[#F8FAFC] min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-indigo-100/50 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-100/50 blur-[120px] rounded-full" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-black uppercase tracking-[0.2em]"
                    >
                        Our Pricing
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight"
                    >
                        Simple <span className="text-indigo-600">and Transparent </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 max-w-2xl mx-auto font-medium text-lg"
                    >
                        Choose the path that fits your learning journey. From individual mastery to all-access professional growth.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto items-stretch">

                    {/* Single Course Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col group hover:border-indigo-200 transition-all duration-500"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">One-Course plan</h3>
                            <p className="text-slate-500 font-bold text-sm tracking-wide">Standard Learning Access</p>
                        </div>

                        <div className="flex items-baseline gap-2 mb-10">
                            <span className="text-7xl font-black text-slate-900 tracking-tighter">$29</span>
                            <span className="text-slate-400 font-black text-sm uppercase tracking-widest">/course</span>
                        </div>

                        <div className="space-y-5 mb-12 flex-1">
                            <FeatureItem text="Lifetime access to 1 course" />
                            <FeatureItem text="Course Completion Certificate" />
                            <FeatureItem text="Regular Email Support" />
                            <FeatureItem text="Unlimited Quiz Attempts" />
                        </div>

                        <Link to="/courses" className="w-full py-5 px-8 rounded-2xl bg-white border-2 border-slate-100 text-slate-900 font-black text-center hover:bg-slate-50 hover:border-slate-200 transition-all text-lg shadow-sm">
                            Browse Courses
                        </Link>
                    </motion.div>

                    {/* Pro Bundle Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-[#0B0E14] rounded-[2.5rem] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] relative flex flex-col transform hover:scale-[1.02] transition-all duration-500"
                    >
                        <div className="absolute top-0 right-10 -translate-y-1/2">
                            <span className="bg-red-600 text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl ring-4 ring-white/10">
                                Recommended
                            </span>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                                    <FaBolt size={18} />
                                </div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">All Courses pack</h3>
                            </div>
                            <p className="text-slate-400 font-bold text-sm tracking-wide">Uninterrupted Access</p>
                        </div>

                        <div className="flex items-baseline gap-2 mb-10 text-white">
                            <span className="text-7xl font-black tracking-tighter">$159</span>
                            <span className="text-slate-500 font-black text-sm uppercase tracking-widest">one-time</span>
                        </div>

                        <div className="space-y-5 mb-12 flex-1">
                            <FeatureItem text="Access to ALL our Courses" dark />
                            <FeatureItem text="Course Completion Certificate" dark />
                            <FeatureItem text="Priority Support" dark />
                            <FeatureItem text="Unlimited Quiz Attempts" dark />
                            <FeatureItem text="Future Course Updates (Free)" dark />
                        </div>

                        <Link to="/register?plan=pro" className="w-full py-5 px-8 rounded-2xl bg-indigo-600 text-white font-black text-center shadow-[0_20px_40px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition-all text-lg">
                            Get All-Access Pass
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const FeatureItem = ({ text, dark }) => (
    <div className="flex items-center gap-4 group">
        <div className={`w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0 ${dark ? 'bg-indigo-500' : 'bg-indigo-100'}`}>
            <FaCheck size={8} className={dark ? 'text-white' : 'text-indigo-600'} />
        </div>
        <span className={`font-bold transition-colors text-sm uppercase tracking-wide ${dark ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{text}</span>
    </div>
);

export default Pricing;