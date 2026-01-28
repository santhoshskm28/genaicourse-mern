import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import courseService from '../services/courseService.js';
import CourseCard from '../components/courses/CourseCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { FaSearch, FaFilter, FaLayerGroup, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CourseCatalogue = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        level: ''
    });

    const location = useLocation();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search') || '';
        if (search) setFilters(prev => ({ ...prev, search }));
    }, [location.search]);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const data = await courseService.getAllCourses(filters);
                setCourses(data.data?.courses || []);
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchCourses, 500);
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="section pt-32 min-h-screen">
            <div className="container overflow-visible">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter">
                        Nexus <span className="text-gradient">Academy</span>
                    </h1>
                    <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Explore the Infinite Possibilities of AI</p>
                </motion.div>

                {/* Filters Hub */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 mb-16 relative overflow-visible z-10"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        <div className="lg:col-span-5 relative group">
                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search by neural keyword..."
                                className="input-premium pl-14"
                            />
                        </div>

                        <div className="lg:col-span-3 relative">
                            <FaLayerGroup className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <select
                                name="category"
                                value={filters.category}
                                onChange={handleFilterChange}
                                className="input-premium pl-14 appearance-none"
                            >
                                <option value="">All Streams</option>
                                <option value="AI/ML">Neural Networks</option>
                                <option value="Web Development">Interface Design</option>
                                <option value="Data Science">Quantum Data</option>
                                <option value="Cloud Computing">Cloud Layers</option>
                            </select>
                        </div>

                        <div className="lg:col-span-3 relative">
                            <FaGraduationCap className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                            <select
                                name="level"
                                value={filters.level}
                                onChange={handleFilterChange}
                                className="input-premium pl-14 appearance-none"
                            >
                                <option value="">All Clearance</option>
                                <option value="Beginner">Initiate</option>
                                <option value="Intermediate">specialist</option>
                                <option value="Advanced">Grandmaster</option>
                            </select>
                        </div>

                        <div className="lg:col-span-1 flex justify-center">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                                <FaFilter size={18} />
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Grid Results */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {courses.map((course, idx) => (
                            <motion.div
                                key={course._id || course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * idx }}
                            >
                                <CourseCard course={course} />
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 glass-card border-dashed">
                        <h3 className="text-3xl font-black text-slate-700 mb-2 uppercase tracking-widest">Signal Lost</h3>
                        <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Adjust your filters to reconnect with the academy</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCatalogue;
