import React from 'react';
import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="flex justify-center items-center h-screen w-full bg-slate-900">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-slate-700 border-t-primary rounded-full"
            />
        </div>
    );
};

export default Loader;
