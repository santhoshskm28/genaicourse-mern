import React from 'react';
import { useParams, Link } from 'react-router-dom';
import courseService from '@/services/courseService.js';
import { useAuth } from '@/context/AuthContext.jsx';
import Loader from '../components/common/Loader.jsx';
import { toast } from 'react-toastify';
import { FaPlay, FaBookOpen, FaClock, FaSignal, FaCheckCircle, FaLock, FaChartLine } from 'react-icons/fa';

const CourseAccess = () => {
    const { id } = useParams();
    const { user, isAuthenticated } = useAuth();
    const [course, setCourse] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

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

    const handleContinueLearning = () => {
        if (course?.modules?.length > 0 && course.modules[0].lessons?.length > 0) {
            const firstLesson = course.modules[0].lessons[0];
            const lessonId = firstLesson._id || firstLesson.id;
            window.location.href = `/courses/${id}/lessons/${lessonId}`;
        } else {
            toast.error('No lessons available');
        }
    };

    const calculateProgress = () => {
        if (!user?.enrolledCourses) return 0;

        const enrollment = user.enrolledCourses.find(
            enrollment => enrollment.courseId?.toString() === id
        );

        return enrollment?.progress || 0;
    };

    const getCompletedLessons = () => {
        if (!user?.enrolledCourses) return 0;

        const enrollment = user.enrolledCourses.find(
            enrollment => enrollment.courseId?.toString() === id
        );

        return enrollment?.completedLessons || 0;
    };

    const getTotalLessons = () => {
        let total = 0;
        course?.modules?.forEach(module => {
            total += module.lessons?.length || 0;
        });
        return total;
    };

    if (loading) return <Loader />;

    const progress = calculateProgress();
    const completedLessons = getCompletedLessons();
    const totalLessons = getTotalLessons();

    return (
        <div className="min-h-screen bg-gray-50 pt-24 font-sans">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Link
                                to={`/courses/${id}`}
                                className="text-gray-500 hover:text-brand transition-colors flex items-center absolute left-0 font-medium"
                            >
                                <span className="text-lg">←</span>
                                <span className="ml-2 hidden md:inline">Back to Course</span>
                            </Link>

                            <h1 className="text-xl font-black text-brand w-full text-center">
                                My Learning Progress
                            </h1>
                        </div>

                        <div className="text-accent">
                            <FaBookOpen size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Course Info Card */}
                    <div className="lg:col-span-2">
                        <div className="card h-full bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                            <div className="p-8 border-b border-gray-100 text-center">
                                <h2 className="text-3xl font-black text-brand mb-4 leading-tight">
                                    {course?.title}
                                </h2>
                                <p className="text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                                    {course?.description}
                                </p>

                                <div className="flex flex-wrap gap-6 text-sm justify-center font-bold text-gray-500 uppercase tracking-wider">
                                    <div className="flex items-center">
                                        <FaClock className="mr-2 text-accent" />
                                        <span>{course?.totalDuration || 60} mins total</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaSignal className="mr-2 text-accent" />
                                        <span>{course?.level || 'All Levels'}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaBookOpen className="mr-2 text-accent" />
                                        <span>{totalLessons} lessons</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Overview */}
                            <div className="p-8 bg-gray-50/50">
                                <h3 className="text-lg font-bold text-brand mb-6 text-center">Your Progress</h3>

                                <div className="space-y-8 max-w-xl mx-auto">
                                    <div>
                                        <div className="flex justify-between items-center mb-2 font-bold text-sm">
                                            <span className="text-gray-500">Overall Progress</span>
                                            <span className="text-brand">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                                            <div
                                                className="bg-accent h-full rounded-full transition-all duration-500 shadow-md"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <div className="text-3xl font-black text-brand mb-1">{completedLessons}</div>
                                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Completed Lessons</div>
                                        </div>
                                        <div className="text-center p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                            <div className="text-3xl font-black text-gray-300">{totalLessons - completedLessons}</div>
                                            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">Remaining Lessons</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-200">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span className="text-gray-500">
                                            {progress === 100 ? '🎉 Course Completed!' : `🎯 Keep going! ${Math.round(progress)}% complete`}
                                        </span>
                                        {progress === 100 && (
                                            <button className="btn btn-primary px-4 py-2 text-sm shadow-lg shadow-brand/20">
                                                Download Certificate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Content */}
                    <div className="space-y-6">
                        <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-xl font-black text-brand mb-6 text-center">Course Content</h3>

                            {course?.modules?.map((module, mIndex) => (
                                <div key={module._id || mIndex} className="border border-gray-200 rounded-xl overflow-hidden mb-4 last:mb-0">
                                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-sm font-bold text-brand uppercase tracking-wide">
                                                Module {mIndex + 1}: {module.title}
                                            </h4>
                                            <span className="text-xs text-accent font-bold bg-white px-2 py-1 rounded border border-gray-200">
                                                {module.lessons?.length || 0} Lessons
                                            </span>
                                        </div>
                                    </div>

                                    <div className="divide-y divide-gray-100 bg-white">
                                        {module.lessons?.map((lesson, lIndex) => {
                                            const isCompleted = completedLessons >= lIndex + 1;
                                            const isLocked = !isAuthenticated;

                                            return (
                                                <div key={lesson._id || lesson.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${isCompleted ? 'border-l-4 border-green-500 bg-green-50/10' : 'border-l-4 border-transparent'
                                                    }`}>
                                                    <div className="flex items-center gap-4 overflow-hidden">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isLocked ? 'bg-gray-100 text-gray-400' : isCompleted ? 'bg-green-100 text-green-600' : 'bg-accent/10 text-accent'}`}>
                                                            {isLocked ? (
                                                                <FaLock size={12} />
                                                            ) : isCompleted ? (
                                                                <FaCheckCircle size={14} />
                                                            ) : (
                                                                <div className="w-2 h-2 bg-current rounded-full" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h5 className={`font-bold text-sm truncate ${isCompleted ? 'text-gray-500' : 'text-brand'}`}>
                                                                {lesson.title}
                                                            </h5>
                                                            <div className="flex items-center gap-3 mt-1">
                                                                <span className="text-gray-400 text-xs font-medium flex items-center">
                                                                    <FaClock size={10} className="mr-1" />
                                                                    {lesson.duration || 5}m
                                                                </span>
                                                                {lesson.difficulty && (
                                                                    <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                                                                        {lesson.difficulty}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={handleContinueLearning}
                                                        disabled={isLocked}
                                                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ml-2 whitespace-nowrap ${isCompleted
                                                            ? 'bg-white border border-green-200 text-green-600 hover:bg-green-50'
                                                            : 'bg-accent text-white hover:bg-orange-600 shadow-md shadow-orange-500/20'
                                                            }`}
                                                    >
                                                        {isLocked ? 'Locked' : isCompleted ? 'Review' : 'Start'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseAccess;