import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, PlayCircle, FileCheck, Award } from 'lucide-react';

const steps = [
    {
        icon: <UserPlus className="w-6 h-6 text-white" />,
        title: "Purchase Course",
        description: "Invest in your future by purchasing a specialized AI learning path designed to fast-track your career."
    },
    {
        icon: <PlayCircle className="w-6 h-6 text-white" />,
        title: "Learn",
        description: "Master complex topics through interactive slides and hands-on labs."
    },
    {
        icon: <FileCheck className="w-6 h-6 text-white" />,
        title: "Assess",
        description: "Validate your knowledge with challenging quizzes and projects."
    },
    {
        icon: <Award className="w-6 h-6 text-white" />,
        title: "Certify",
        description: "Earn your verified certificate and showcase your expertise."
    }
];

export const CertificationSteps = () => {
    return (
        <section className="py-32 relative overflow-hidden">
            <div className="container relative z-10 px-4 mx-auto">
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-4 inline-block tracking-[0.2em] uppercase text-accent font-bold text-sm"
                    >
                        Path to Mastery
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-brand mb-6"
                    >
                        How You Get Certified
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-500 font-medium"
                    >
                        From beginner to pro in 4 simple steps.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative max-w-7xl mx-auto">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-[2px] bg-gray-100 z-0 overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            whileInView={{ width: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                            className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                        />
                    </div>

                    {steps.map((step, index) => (
                        <StepCard key={index} step={step} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

const StepCard = ({ step, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + index * 0.2 }}
            className="relative z-10 flex flex-col items-center text-center group"
        >
            <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center mb-8 shadow-lg shadow-violet-200 transition-all duration-300 relative"
            >
                {step.icon}
                {/* Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-violet-100 flex items-center justify-center text-sm font-bold text-brand shadow-sm">
                    {index + 1}
                </div>
            </motion.div>

            <h3 className="text-xl font-bold text-brand mb-3 group-hover:text-accent transition-colors duration-300">
                {step.title}
            </h3>
            <p className="text-gray-500 leading-relaxed px-2">
                {step.description}
            </p>
        </motion.div>
    );
};
