import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import courseService from '../services/courseService';
import CourseCard from '../components/courses/CourseCard';
import Loader from '../components/common/Loader';
import { FaSearch } from 'react-icons/fa';

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
        // Parse query params if any
        const searchParams = new URLSearchParams(location.search);
        const search = searchParams.get('search') || '';

        if (search) {
            setFilters(prev => ({ ...prev, search }));
        }
    }, [location.search]);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const data = await courseService.getAllCourses(filters);
                setCourses(data.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        // Debounce search
        const timeoutId = setTimeout(() => {
            fetchCourses();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="section min-h-screen">
            <div className="container">
                <h1 className="section-title">Course Catalogue</h1>

                {/* Filters */}
                <div className="bg-slate-800 p-6 rounded-lg mb-10 shadow-lg border border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <span className="absolute left-3 top-3.5 text-gray-400">
                                <FaSearch />
                            </span>
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Search courses..."
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleFilterChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="">All Categories</option>
                            <option value="AI/ML">AI & Machine Learning</option>
                            <option value="Web Development">Web Development</option>
                            <option value="Data Science">Data Science</option>
                            <option value="Cloud Computing">Cloud Computing</option>
                        </select>

                        {/* Level Filter */}
                        <select
                            name="level"
                            value={filters.level}
                            onChange={handleFilterChange}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:ring-2 focus:ring-primary outline-none"
                        >
                            <option value="">All Levels</option>
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <Loader />
                ) : courses.length > 0 ? (
                    <div className="grid grid-3">
                        {courses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-slate-800/50 rounded-lg border border-dashed border-slate-700">
                        <h3 className="text-xl font-bold text-gray-300">No courses found</h3>
                        <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CourseCatalogue;
