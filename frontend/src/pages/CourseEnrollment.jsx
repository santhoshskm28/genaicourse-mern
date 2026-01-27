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
            window.location.reload(); // Reload to update enrollment status
        } catch (error) {
            setEnrolling(false);
            toast.error(error.response?.data?.message || 'Enrollment failed');
        }
    };

    const handleStartLearning = () => {
        if (course?.modules?.length > 0 && course.modules[0].lessons?.length > 0) {
            const firstLesson = course.modules[0].lessons[0];
            const lessonId = firstLesson._id || firstLesson.id;
            window.location.href = `/courses/${id}/lessons/${lessonId}`;
        } else {
            toast.error('No lessons available');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <div className="bg-slate-800 border-b border-slate-700">
                <div className="container py-16">
                    <div className="flex flex-col lg:flex-row gap-12 items-center">
                        <div className="flex-1">
                            <div className="mb-4">
                                <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold mb-4 border border-primary/20">
                                    {course?.category || 'Course'}
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                                {course?.title}
                            </h1>

                            <div className="text-xl text-gray-300 mb-6 leading-relaxed max-w-3xl">
                                {course?.description}
                            </div>

                            <div className="flex flex-wrap gap-8 text-sm text-gray-400 mb-8">
                                <div className="flex items-center">
                                    <span className="font-bold text-white mr-2">Level:</span>
                                    <span>{course?.level || 'All Levels'}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-white mr-2">Duration:</span>
                                    <span>{course?.totalDuration || 60} mins</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-white mr-2">Lessons:</span>
                                    <span>{course?.totalLessons || 0}</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="font-bold text-white mr-2">Students:</span>
                                    <span>{course?.enrollmentCount || 0} enrolled</span>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={handleStartLearning}
                                    className="btn btn-primary text-lg px-8 py-3 w-full sm:w-auto flex items-center justify-center"
                                    disabled={!course || loading}
                                >
                                    <FaPlay className="mr-2" />
                                    Start Learning
                                </button>
                            </div>
                        </div>

                        <div className="w-full lg:w-1/3 max-w-sm">
                            <div className="card p-2 bg-slate-800 border border-slate-700">
                                <img
                                    src={course?.thumbnail || 'https://placehold.co/400x250?text=Course'}
                                    alt={course?.title}
                                    className="w-full rounded-lg shadow-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Benefits */}
            <div className="py-16 bg-slate-800/50">
                <div className="container">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Choose This Course?</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card text-center p-6">
                            <div className="text-primary mb-4">
                                <FaBookOpen size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Expert Instruction</h3>
                            <p className="text-gray-400">Learn from industry experts with real-world experience and practical insights.</p>
                        </div>

                        <div className="card text-center p-6">
                            <div className="text-primary mb-4">
                                <FaClock size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Self-Paced Learning</h3>
                            <p className="text-gray-400">Study at your own pace with lifetime access to course materials and updates.</p>
                        </div>

                        <div className="card text-center p-6">
                            <div className="text-primary mb-4">
                                <FaSignal size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">Career Growth</h3>
                            <p className="text-gray-400">Gain valuable skills that employers are looking for in today's competitive market.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Curriculum Preview */}
            <div className="py-16 bg-slate-900">
                <div className="container">
                    <h2 className="text-3xl font-bold text-white mb-8 text-center">Course Curriculum</h2>

                    <div className="max-w-4xl mx-auto space-y-4">
                        {course?.modules?.map((module, mIndex) => (
                            <div key={module._id || mIndex} className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
                                <div className="bg-slate-800 p-4 border-b border-slate-700">
                                    <h3 className="text-lg font-bold text-white">
                                        Module {mIndex + 1}: {module.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-3">{module.description || 'Comprehensive module content'}</p>
                                    <span className="text-xs text-primary font-semibold">
                                        {module.lessons?.length || 0} Lessons
                                    </span>
                                </div>

                                <div className="divide-y divide-slate-700/50">
                                    {module.lessons?.slice(0, 2).map((lesson, lIndex) => (
                                        <div key={lesson._id || lesson.id} className="p-4 flex items-center justify-between border-slate-700/50">
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                                                    <FaLock size={16} className="text-primary/60" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-white font-medium">{lesson.title}</h4>
                                                    <p className="text-gray-400 text-sm">
                                                        {lesson.duration || 5} minutes
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {module.lessons?.length > 2 && (
                                    <div className="p-4 text-center border-t border-slate-700/50">
                                        <p className="text-gray-400 text-sm">
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
            <div className="py-16 bg-primary">
                <div className="container text-center">
                    <h2 className="text-3xl font-bold text-white mb-8">Ready to Start Learning?</h2>
                    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Join thousands of students already advancing their careers with this comprehensive course.
                    </p>

                    <div className="max-w-md mx-auto">
                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="btn btn-secondary text-xl px-12 py-4 w-full"
                        >
                            {enrolling ? 'Enrolling...' : 'Enroll Now - Start Your Journey'}
                        </button>
                    </div>

                    <div className="mt-6 text-gray-200">
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