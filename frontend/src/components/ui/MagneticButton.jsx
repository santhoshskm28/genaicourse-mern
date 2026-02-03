import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const MagneticButton = ({ children }) => {
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
