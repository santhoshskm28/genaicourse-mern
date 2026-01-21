import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import courseService from '../services/courseService';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';
import { FaPlay, FaCheckCircle, FaLock, FaList } from 'react-icons/fa';

const CourseDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const data = await courseService.getCourse(id);
                setCourse(data.data);

                // Check if enrolled using user data from context or local check
                if (isAuthenticated && user?.enrolledCourses?.includes(id)) {
                    setIsEnrolled(true);
                }
            } catch (error) {
                toast.error('Failed to load course details');
                navigate('/courses');
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [id, isAuthenticated, user, navigate]);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            toast.info('Please login to enroll');
            navigate('/login', { state: { from: `/courses/${id}` } });
            return;
        }

        setEnrolling(true);
        try {
            await courseService.enrollCourse(id);
            setIsEnrolled(true);
            toast.success('Successfully enrolled!');
            // Update local user state if needed by refreshing or context update
            window.location.reload(); // Simple reload to sync state
        } catch (error) {
            toast.error(error.response?.data?.message || 'Enrollment failed');
        } finally {
            setEnrolling(false);
        }
    };

    const startLearning = () => {
        navigate(`/courses/${id}/learn`);
    };

    if (loading) return <Loader />;
    if (!course) return null;

    return (
        <div className="bg-dark min-h-screen">
            {/* Header */}
            <div className="bg-slate-900 py-16 border-b border-slate-800">
                <div className="container">
                    <div className="flex flex-col md:flex-row gap-10 items-start">
                        <div className="flex-1">
                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-4 border border-primary/20">
                                {course.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{course.title}</h1>
                            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-400 mb-8">
                                <div className="flex items-center">
                                    <span className="font-bold text-white mr-2">Level:</span> {course.level}
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-white mr-2">Duration:</span> {course.totalDuration || 60} mins
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-white mr-2">Lessons:</span> {course.totalLessons || 0}
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-white mr-2">Enrolled:</span> {course.enrollmentCount} students
                                </div>
                            </div>

                            {isEnrolled ? (
                                <button
                                    onClick={startLearning}
                                    className="btn btn-primary text-lg px-8 py-3 flex items-center"
                                >
                                    <FaPlay className="mr-2" /> Continue Learning
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="btn btn-primary text-lg px-8 py-3 w-full md:w-auto"
                                >
                                    {enrolling ? 'Enrolling...' : 'Enroll Now - Free'}
                                </button>
                            )}
                        </div>

                        <div className="w-full md:w-1/3 max-w-sm">
                            <div className="card p-2 bg-slate-800 border border-slate-700">
                                <img
                                    src={course.thumbnail || 'https://via.placeholder.com/400x250'}
                                    alt={course.title}
                                    className="w-full rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum */}
            <div className="container py-16">
                <h2 className="section-title text-left mb-10 flex items-center">
                    <FaList className="mr-3 text-primary" /> Course Curriculum
                </h2>

                <div className="max-w-4xl space-y-4">
                    {course.modules?.map((module, mIndex) => (
                        <div key={module._id} className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
                            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-white">
                                    Module {mIndex + 1}: {module.title}
                                </h3>
                                <span className="text-sm text-gray-400">{module.lessons?.length} Lessons</span>
                            </div>

                            <div className="divide-y divide-slate-700/50">
                                {module.lessons?.map((lesson, lIndex) => (
                                    <div key={lesson._id} className="p-4 flex items-center hover:bg-slate-700/30 transition-colors">
                                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center mr-4 text-xs font-bold text-gray-400">
                                            {lIndex + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-gray-200 font-medium">{lesson.title}</h4>
                                            <p className="text-sm text-gray-500 mt-0.5">{lesson.duration || 5} mins</p>
                                        </div>
                                        <div className="text-primary">
                                            {isEnrolled ? (
                                                <FaPlay size={14} className="opacity-70" />
                                            ) : (
                                                <FaLock size={14} className="text-gray-600" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
