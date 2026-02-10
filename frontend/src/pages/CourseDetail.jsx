import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import courseService from '../services/courseService.js';
import Loader from '../components/common/Loader.jsx';
import { toast } from 'react-toastify';
import { FaPlay, FaCheckCircle, FaLock, FaList, FaArrowLeft } from 'react-icons/fa';

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

                // Check enrollment by checking user's enrolledCourses array of objects
                if (isAuthenticated && user?.enrolledCourses) {
                    const enrolled = user.enrolledCourses.some(enrollment =>
                        enrollment.courseId?.toString() === id || enrollment._id?.toString() === id
                    );
                    setIsEnrolled(enrolled);
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
        // Navigate to the appropriate page based on enrollment status
        if (isEnrolled) {
            // User is enrolled - go to course access/reading progress
            navigate(`/courses/${id}/access`);
        } else {
            // User is not enrolled - go to enrollment page
            navigate(`/courses/${id}/enroll`);
        }
    };

    if (loading) return <Loader />;
    if (!course) return null;

    return (
        <div className="bg-[var(--bg-main)] min-h-screen pt-24">
            {/* Header */}
            <div className="bg-white py-16 border-b border-gray-200 shadow-sm">
                <div className="container">
                    <button
                        onClick={() => navigate('/courses')}
                        className="mb-8 p-3 bg-white border border-gray-200 rounded-2xl text-gray-500 hover:text-brand transition-all flex items-center gap-2 group w-fit shadow-sm hover:shadow-md"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Library</span>
                    </button>
                    <div className="flex flex-col md:flex-row gap-10 items-start">
                        <div className="flex-1">
                            <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold mb-4 border border-accent/20">
                                {course.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-brand" data-testid="course-title">{course.title}</h1>
                            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-3xl font-medium" data-testid="course-description">
                                {course.description}
                            </p>

                            <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-8 font-medium">
                                <div className="flex items-center">
                                    <span className="font-bold text-brand mr-2">Level:</span> {course.level}
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-brand mr-2">Duration:</span> {course.totalDuration || 60} mins
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-brand mr-2">Lessons:</span> {course.totalLessons || 0}
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-brand mr-2">Enrolled:</span> {course.enrollmentCount} students
                                </div>
                            </div>

                            <button
                                onClick={startLearning}
                                className="btn-premium btn-primary text-lg px-8 py-3 flex items-center"
                                data-testid={isEnrolled ? "start-learning-button" : "enroll-button"}
                            >
                                <FaPlay className="mr-2" />
                                {isEnrolled ? 'Continue Learning' : 'Enroll Now - Free'}
                            </button>
                        </div>

                        <div className="w-full md:w-1/3 max-w-sm">
                            <div className="card p-2 bg-white border border-gray-200 shadow-xl rounded-2xl">
                                <img
                                    src={course.thumbnail || 'https://placehold.co/400x250?text=Course'}
                                    alt={course.title}
                                    className="w-full rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Curriculum */}
            <div className="container py-16">
                <h2 className="section-title text-left mb-10 flex items-center text-brand font-black text-3xl">
                    <FaList className="mr-3 text-accent" /> Course Curriculum
                </h2>

                <div className="max-w-4xl space-y-4">
                    {course.modules?.map((module, mIndex) => (
                        <div key={module._id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                            <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-brand">
                                    Module {mIndex + 1}: {module.title}
                                </h3>
                                <span className="text-sm text-gray-500 font-bold">{module.lessons?.length} Lessons</span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {module.lessons?.map((lesson, lIndex) => {
                                    const lessonId = lesson._id || lesson.id;
                                    return (
                                        <Link
                                            key={lessonId}
                                            to={`/courses/${id}/lessons/${lessonId}`}
                                            className={`p-4 flex items-center hover:bg-gray-50 transition-colors ${!isEnrolled ? 'cursor-not-allowed opacity-60' : ''
                                                }`}
                                            onClick={(e) => {
                                                if (!isEnrolled) {
                                                    e.preventDefault();
                                                    toast.info('Please enroll to access this lesson');
                                                }
                                            }}
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-4 text-xs font-bold text-gray-500 border border-gray-200">
                                                {lIndex + 1}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-brand font-bold text-sm">{lesson.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5 font-medium">{lesson.duration || 5} mins</p>
                                            </div>
                                            <div className={`${isEnrolled ? 'text-accent' : 'text-gray-300'}`}>
                                                {isEnrolled ? (
                                                    <FaPlay size={14} className="opacity-70" />
                                                ) : (
                                                    <FaLock size={14} />
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {course.quizId && (
                        <div className="border border-green-200 rounded-xl overflow-hidden bg-green-50/30">
                            <div className="bg-green-50 p-4 border-b border-green-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-green-800">
                                    Final Assessment
                                </h3>
                                <span className="text-sm text-green-700 font-bold">1 Assessment</span>
                            </div>
                            <div className="p-4">
                                <Link
                                    to={`/courses/${id}/assessment`}
                                    className={`flex items-center hover:bg-green-50 transition-colors rounded p-2 ${!isEnrolled ? 'cursor-not-allowed opacity-60' : ''}`}
                                    onClick={(e) => {
                                        if (!isEnrolled) {
                                            e.preventDefault();
                                            toast.info('Please enroll to access success assessment');
                                        }
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-4 text-green-600 border border-green-200">
                                        <FaCheckCircle size={14} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-green-900 font-bold text-sm">Course Final Exam</h4>
                                        <p className="text-xs text-green-700/80 mt-0.5 font-medium">Test your knowledge to earn certificate</p>
                                    </div>
                                    <div className={`${isEnrolled ? 'text-green-600' : 'text-gray-300'}`}>
                                        {isEnrolled ? <FaPlay size={14} className="opacity-70" /> : <FaLock size={14} />}
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
