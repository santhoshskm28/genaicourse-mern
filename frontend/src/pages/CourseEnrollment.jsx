import React from 'react';
import { useParams, Link } from 'react-router-dom';
import courseService from '@/services/courseService.js';
import { useAuth } from '@/context/AuthContext.jsx';
import Loader from '../components/common/Loader.jsx';
import { toast } from 'react-toastify';
import { FaPlay, FaLock, FaBookOpen, FaClock, FaSignal, FaUsers } from 'react-icons/fa';

const CourseEnrollment = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [course, setCourse] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [enrolling, setEnrolling] = React.useState(false);

    React.useEffect(() => {
        const fetchCourse = async () => {
            try {
                const data = await courseService.getCourse(id);
                setCourse(data.data);
            } catch (error) {
                toast.error('Failed to load course details');
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    const handleEnroll = async () => {
        if (!isAuthenticated) {
            toast.info('Please login to enroll');
            return;
        }

        setEnrolling(true);
        try {
            await courseService.enrollCourse(id);
            toast.success('Successfully enrolled in course!');
            // Navigate directly to course viewer after enrollment
            window.location.href = `/courses/${id}/learn`;
        } catch (error) {
            setEnrolling(false);
            toast.error(error.response?.data?.message || 'Enrollment failed');
        }
    };

    const handleStartLearning = () => {
        if (course?.modules?.length > 0 && course.modules[0].lessons?.length > 0) {
            // Navigate to course viewer instead of specific lesson
            window.location.href = `/courses/${id}/learn`;
        } else {
            toast.error('No lessons available');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[var(--bg-main)] pt-24">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-200">
                <div className="container py-16">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <div className="mb-4">
                                <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold mb-4 border border-accent/20">
                                    {course?.category || 'Course'}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-brand mb-4 leading-tight">
                                {course?.title}
                            </h1>

                            <div className="text-xl text-gray-500 mb-6 leading-relaxed max-w-3xl font-medium">
                                {course?.description}
                            </div>

                            <div className="flex flex-wrap gap-8 text-sm text-gray-500 mb-8 font-medium">
                                <div className="flex items-center">
                                    <span className="font-bold text-brand mr-2">Level:</span>
                                    <span>{course?.level || 'All Levels'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-brand mr-2">Duration:</span>
                                    <span>{course?.totalDuration || 60} mins</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-brand mr-2">Lessons:</span>
                                    <span>{course?.totalLessons || 0}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-brand mr-2">Students:</span>
                                    <span>{course?.enrollmentCount || 0} enrolled</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleStartLearning}
                                    className="btn-premium btn-primary text-lg px-8 py-3 w-full sm:w-auto flex items-center justify-center"
                                    disabled={!course || loading}
                                >
                                    <FaPlay className="mr-2" />
                                    Start Learning
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 max-w-sm">
                            <div className="card p-2 bg-white border border-gray-200 shadow-xl rounded-2xl">
                                <img
                                    src={course?.thumbnail || 'https://placehold.co/400x250?text=Course'}
                                    alt={course?.title}
                                    className="w-full rounded-xl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Benefits */}
            <div className="py-16 bg-white border-b border-gray-200">
                <div className="container">
                    <h2 className="text-3xl font-black text-brand mb-8 text-center">Why Choose This Course?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card text-center p-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <div className="text-accent mb-4 flex justify-center">
                                <FaBookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand mb-3">Expert Instruction</h3>
                            <p className="text-gray-500 font-medium">Learn from industry experts with real-world experience and practical insights.</p>
                        </div>

                        <div className="card text-center p-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <div className="text-accent mb-4 flex justify-center">
                                <FaClock size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand mb-3">Self-Paced Learning</h3>
                            <p className="text-gray-500 font-medium">Study at your own pace with lifetime access to course materials and updates.</p>
                        </div>

                        <div className="card text-center p-8 bg-gray-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
                            <div className="text-accent mb-4 flex justify-center">
                                <FaSignal size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-brand mb-3">Career Growth</h3>
                            <p className="text-gray-500 font-medium">Gain valuable skills that employers are looking for in today's competitive market.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Curriculum Preview */}
            <div className="py-16 bg-[var(--bg-main)]">
                <div className="container">
                    <h2 className="text-3xl font-black text-brand mb-8 text-center">Course Curriculum</h2>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {course?.modules?.map((module, mIndex) => (
                            <div key={module._id || mIndex} className="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                                <div className="bg-gray-50 p-6 border-b border-gray-200">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-brand">
                                                Module {mIndex + 1}: {module.title}
                                            </h3>
                                            <p className="text-gray-500 text-sm mb-3 mt-1 font-medium">{module.description || 'Comprehensive module content'}</p>
                                        </div>
                                        <span className="text-xs text-brand font-black bg-gray-200 px-2 py-1 rounded">
                                            {module.lessons?.length || 0} LESSONS
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y divide-gray-100">
                                    {module.lessons?.slice(0, 2).map((lesson, lIndex) => (
                                        <div key={lesson._id || lesson.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center mr-4 text-accent">
                                                    <FaLock size={12} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-brand font-bold text-sm">{lesson.title}</h4>
                                                    <p className="text-gray-400 text-xs font-semibold mt-0.5">
                                                        {lesson.duration || 5} minutes
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {module.lessons?.length > 2 && (
                                    <div className="p-4 text-center border-t border-gray-100">
                                        <p className="text-gray-400 text-sm font-medium">
                                            And {module.lessons?.length - 2} more lessons in this module...
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enrollment Section */}
            <div className="py-16 bg-white border-t border-gray-200">
                <div className="container text-center">
                    <h2 className="text-3xl font-black text-brand mb-6">Ready to Start Learning?</h2>
                    <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto font-medium">
                        Join thousands of students already advancing their careers with this comprehensive course.
                    </p>

                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="btn-premium btn-primary text-xl px-12 py-4 w-full"
                        >
                            {enrolling ? 'Enrolling...' : 'Enroll Now - Start Your Journey'}
                        </button>
                    </div>

                    <div className="mt-8 text-gray-400 font-medium">
                        <p className="text-sm">
                            ✅ Lifetime Access • 🎓 Certificate on Completion • 🔄 30-Day Money Back Guarantee
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseEnrollment;