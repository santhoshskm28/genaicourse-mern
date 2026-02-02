import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import courseService from '../services/courseService.js';
import CourseCard from '../components/courses/CourseCard.jsx';
import Loader from '../components/common/Loader.jsx';
import { FaSearch, FaFilter, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CourseCatalogue = () => {
    const navigate = useNavigate();
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
        <div className="section pt-32 min-h-screen bg-[var(--bg-main)]">
            <div className="container overflow-visible">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center mb-16 relative"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute left-0 top-0 p-3 bg-white border border-gray-200 rounded-2xl text-brand hover:text-accent transition-all flex items-center gap-2 group shadow-sm hover:shadow-md"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back</span>
                    </button>

                    <h1 className="text-5xl md:text-7xl font-black mb-4 uppercase tracking-tighter text-center text-brand">
                        GenAi <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Course</span>
                    </h1>
                    <p className="text-gray-500 font-bold tracking-widest uppercase text-xs text-center">Explore the Infinite Possibilities of AI</p>
                </motion.div>

                {/* Filters Hub */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-6 mb-16 relative overflow-visible z-10 bg-white border border-gray-200 shadow-xl rounded-2xl"
                >
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-4">
                        </div>

                        <div className="w-full lg:w-1/3 relative group px-2">
                            <FaSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" />
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search by neural keyword..."
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pl-14 focus:outline-none focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all text-brand placeholder:text-gray-400"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Grid Results */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-accent rounded-full animate-spin"></div>
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
                    <div className="text-center py-32 glass-card border-dashed border-gray-300 bg-gray-50 rounded-2xl">
                        <h3 className="text-3xl font-black text-brand mb-2 uppercase tracking-widest">Signal Lost</h3>
                        <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">Adjust your filters to reconnect with the academy</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCatalogue;
