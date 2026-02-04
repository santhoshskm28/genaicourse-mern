"use client";
import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from 'react-router-dom';
import { FaChevronRight, FaPlay } from 'react-icons/fa';
import { MagneticButton } from './MagneticButton';

export const HeroParallax = ({
    products
}) => {
    const firstRow = products.slice(0, 5);
    const secondRow = products.slice(5, 10);
    const thirdRow = products.slice(10, 15);
    const ref = React.useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const springConfig = { stiffness: 300, damping: 30, bounce: 100 };

    const translateX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1000]), springConfig);
    const translateXReverse = useSpring(useTransform(scrollYProgress, [0, 1], [0, -1000]), springConfig);
    const rotateX = useSpring(useTransform(scrollYProgress, [0, 0.2], [15, 0]), springConfig);
    const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [0.2, 1]), springConfig);
    const rotateZ = useSpring(useTransform(scrollYProgress, [0, 0.2], [20, 0]), springConfig);
    const translateY = useSpring(useTransform(scrollYProgress, [0, 0.2], [-700, 500]), springConfig);

    return (
        (<div
            ref={ref}
            className="h-[300vh] py-40 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]">
            <Header />
            <motion.div
                style={{
                    rotateX,
                    rotateZ,
                    translateY,
                    opacity,
                }}
                className="">
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
                    {firstRow.map((product) => (
                        <ProductCard product={product} translate={translateX} key={product.title} />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row mb-20 space-x-20 ">
                    {secondRow.map((product) => (
                        <ProductCard product={product} translate={translateXReverse} key={product.title} />
                    ))}
                </motion.div>
                <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
                    {thirdRow.map((product) => (
                        <ProductCard product={product} translate={translateX} key={product.title} />
                    ))}
                </motion.div>
            </motion.div>
        </div>)
    );
};

export const Header = () => {
    return (
        (<div
            className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
            <h1 className="text-2xl md:text-7xl font-bold text-brand">
                AI <span className="bg-gradient-to-r from-violet-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-text">MASTERY</span> <br />
                The Evolution of Intelligent Learning
            </h1>
            <p className="max-w-2xl text-base md:text-xl mt-8 text-gray-600">
                Architect the future with the world's most immersive Generative AI platform.
                From AI course foundations to advanced prompt engineering.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-12 z-20 relative">
                <MagneticButton>
                    <Link to="/courses" className="btn-premium btn-primary !px-10 !py-4 !rounded-full text-lg shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                        Start Journey
                        <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </MagneticButton>

                <MagneticButton>
                    <Link to="/register" className="btn-premium btn-outline !px-10 !py-4 !rounded-full bg-white text-brand border-brand/20 text-lg hover:bg-gray-50">
                        <FaPlay className="mr-2 text-xs" />
                        AI Course Demo
                    </Link>
                </MagneticButton>
            </div>
        </div>)
    );
};

export const ProductCard = ({
    product,
    translate
}) => {
    return (
        (<motion.div
            style={{
                x: translate,
            }}
            whileHover={{
                y: -20,
            }}
            key={product.title}
            className="group/product h-96 w-[30rem] relative flex-shrink-0">
            <a href={product.link} className="block group-hover/product:shadow-2xl ">
                <img
                    src={product.thumbnail}
                    height="600"
                    width="600"
                    className="object-cover object-left-top absolute h-full w-full inset-0"
                    alt={product.title} />
            </a>
            <div
                className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div>
            <h2
                className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
                {product.title}
            </h2>
        </motion.div>)
    );
};
