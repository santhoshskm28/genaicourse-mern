import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaClock, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CourseCard = ({ course }) => {
    return (
        <div className="glass-card group flex flex-col h-full !pb-0 active:scale-[0.98] transition-transform">
            {/* Thumbnail Box */}
            <div className="relative h-60 overflow-hidden">
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'}
                    alt={course.title}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>

                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-white border border-white/20">
                        {course.level}
                    </span>
                    <span className="px-3 py-1 bg-indigo-500 rounded-lg text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-500/30">
                        {course.category}
                    </span>
                </div>
            </div>

            {/* Content Box */}
            <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-black text-white mb-4 line-clamp-2 leading-tight tracking-tight group-hover:text-indigo-400 transition-colors">
                    {course.title}
                </h3>

                <p className="text-slate-400 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">
                    {course.description}
                </p>

                <div className="mt-auto space-y-6">
                    <div className="flex items-center gap-6 py-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                            <FaBookOpen className="text-indigo-500/60" size={14} />
                            <span>{course.totalLessons || 0} Layers</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                            <FaClock className="text-indigo-500/60" size={14} />
                            <span>{course.totalDuration || 60} Nodes</span>
                        </div>
                    </div>

                    <Link
                        to={`/courses/${course._id || course.id}`}
                        className="btn-premium btn-primary-gradient w-full group/btn !py-3 mb-2"
                    >
                        Initialize Module
                        <FaChevronRight className="text-[10px] group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
