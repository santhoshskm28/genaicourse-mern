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
        <div className="min-h-screen bg-slate-900 pt-24">
            {/* Header */}
            <div className="bg-slate-800 border-b border-slate-700 sticky top-20 z-40 shadow-md">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <Link
                                to={`/courses/${id}`}
                                className="text-gray-400 hover:text-white transition-colors flex items-center absolute left-0"
                            >
                                <span className="text-lg">←</span>
                                <span className="ml-2 hidden md:inline">Back to Course</span>
                            </Link>

                            <h1 className="text-xl font-bold text-white w-full text-center">
                                My Learning Progress
                            </h1>
                        </div>

                        <div className="text-primary">
                            <FaBookOpen size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Course Info Card */}
                    <div className="lg:col-span-2">
                        <div className="card h-full">
                            <div className="p-6 border-b border-slate-700 text-center">
                                <h2 className="text-2xl font-bold text-white mb-4">
                                    {course?.title}
                                </h2>
                                <p className="text-gray-400 mb-6">
                                    {course?.description}
                                </p>

                                <div className="flex flex-wrap gap-4 text-sm justify-center">
                                    <div className="flex items-center text-gray-400">
                                        <FaClock className="mr-2" />
                                        <span>{course?.totalDuration || 60} mins total</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <FaSignal className="mr-2" />
                                        <span>{course?.level || 'All Levels'}</span>
                                    </div>
                                    <div className="flex items-center text-gray-400">
                                        <FaBookOpen className="mr-2" />
                                        <span>{totalLessons} lessons</span>
                                    </div>
                                </div>
                            </div>

                            {/* Progress Overview */}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-white mb-6 text-center">Your Progress</h3>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-400">Overall Progress</span>
                                            <span className="text-white font-bold">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                            <div
                                                className="bg-primary h-full rounded-full transition-all duration-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-primary">{completedLessons}</div>
                                            <div className="text-gray-400 text-sm">Completed Lessons</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-300">{totalLessons - completedLessons}</div>
                                            <div className="text-gray-400 text-sm">Remaining Lessons</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-700">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">
                                            {progress === 100 ? '🎉 Course Completed!' : `🎯 Keep going! ${Math.round(progress)}% complete`}
                                        </span>
                                        {progress === 100 && (
                                            <button className="btn btn-primary px-4 py-2">
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
                        <h3 className="text-xl font-bold text-white mb-6 text-center">Course Content</h3>

                        {course?.modules?.map((module, mIndex) => (
                            <div key={module._id || mIndex} className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/50">
                                <div className="bg-slate-800 p-4 border-b border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-lg font-bold text-white">
                                            Module {mIndex + 1}: {module.title}
                                        </h4>
                                        <span className="text-xs text-primary font-semibold">
                                            {module.lessons?.length || 0} Lessons
                                        </span>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-700/50">
                                    {module.lessons?.map((lesson, lIndex) => {
                                        const isCompleted = completedLessons >= lIndex + 1;
                                        const isLocked = !isAuthenticated;

                                        return (
                                            <div key={lesson._id || lesson.id} className={`p-4 flex items-center justify-between hover:bg-slate-700/30 transition-colors ${isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-slate-700/50'
                                                }`}>
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center mr-4">
                                                        {isLocked ? (
                                                            <FaLock size={16} className="text-gray-500" />
                                                        ) : isCompleted ? (
                                                            <FaCheckCircle size={16} className="text-green-500" />
                                                        ) : (
                                                            <div className="w-4 h-4 bg-primary rounded-full" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h5 className="text-white font-medium">
                                                            {lesson.title}
                                                        </h5>
                                                        <div className="flex items-center gap-4 mt-1">
                                                            <span className="text-gray-400 text-sm">
                                                                <FaClock size={12} className="mr-1" />
                                                                {lesson.duration || 5} minutes
                                                            </span>
                                                            {lesson.difficulty && (
                                                                <span className="text-xs bg-slate-700 px-2 py-1 rounded">
                                                                    {lesson.difficulty}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <button
                                                        onClick={handleContinueLearning}
                                                        disabled={isLocked}
                                                        className={`btn px-4 py-2 ${isCompleted
                                                            ? 'bg-green-600 hover:bg-green-700'
                                                            : 'btn-primary'
                                                            }`}
                                                    >
                                                        {isLocked ? 'Locked' : isCompleted ? 'Review' : 'Start'}
                                                    </button>
                                                </div>
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
    );
};

export default CourseAccess;