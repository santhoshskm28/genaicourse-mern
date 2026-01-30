import React from 'react';
import { FaBookReader, FaLaptopCode, FaCertificate, FaArrowRight } from 'react-icons/fa';

const HowItWorks = () => {
    return (
        <div className="section section-pt">
            <div className="container max-w-4xl mx-auto">
                <h1 className="section-title">How It Works</h1>
                <p className="text-xl text-center text-gray-400 mb-16 max-w-2xl mx-auto">
                    Our platform is designed to make learning complex AI topics simple, interactive, and effective.
                </p>

                <div className="space-y-12">
                    {/* Step 1 */}
                    <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="w-20 h-20 flex-shrink-0 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-400">
                            <FaBookReader size={32} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-3 text-white">1. Choose Your Path</h3>
                            <p className="text-gray-400">
                                Browse our extensive catalog of AI and development courses. Whether you're a beginner or an expert,
                                we have a structured path for you. Filter by level, category, or topic.
                            </p>
                        </div>
                        <div className="hidden md:block text-slate-600">
                            <FaArrowRight size={24} />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="w-20 h-20 flex-shrink-0 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-400">
                            <FaLaptopCode size={32} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-3 text-white">2. Interactive Learning</h3>
                            <p className="text-gray-400">
                                Our slide-based learning system breaks down complex concepts into digestible chunks.
                                Read lessons, view code snippets, and track your progress in real-time.
                            </p>
                        </div>
                        <div className="hidden md:block text-slate-600">
                            <FaArrowRight size={24} />
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col md:flex-row gap-8 items-center bg-slate-800/50 p-8 rounded-2xl border border-slate-700">
                        <div className="w-20 h-20 flex-shrink-0 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400">
                            <FaCertificate size={32} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-2xl font-bold mb-3 text-white">3. Track & Certify</h3>
                            <p className="text-gray-400">
                                Monitor your module completion and quiz scores. Upon finishing a course 100%,
                                receive a certificate of completion to share on your professional profile.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
