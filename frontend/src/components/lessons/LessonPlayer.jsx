import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import courseService from '../../services/courseService.js';
import { FaArrowLeft, FaArrowRight, FaBars, FaTimes, FaClipboardCheck, FaCheck } from 'react-icons/fa';
import AssessmentCenter from '../assessment/AssessmentCenter.jsx';

const LessonPlayer = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [showAssessment, setShowAssessment] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const courseData = await courseService.getCourse(courseId);
                const course = courseData.data;
                setCourse(course);

                // Find the lesson by ID
                const lesson = findLessonById(course, lessonId);
                if (lesson) {
                    setCurrentLesson(lesson);
                } else {
                    // If lesson not found, navigate to first lesson
                    const firstLesson = getFirstLesson(course);
                    if (firstLesson) {
                        navigate(`/courses/${courseId}/lessons/${firstLesson.id}`, { replace: true });
                    }
                }
            } catch (error) {
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, lessonId, navigate]);

    const findLessonById = (course, targetLessonId) => {
        for (let i = 0; i < course.modules.length; i++) {
            const lesson = course.modules[i].lessons.find(l => l.id === targetLessonId || l._id === targetLessonId);
            if (lesson) {
                setCurrentModuleIndex(i);
                return lesson;
            }
        }
        return null;
    };

    const getFirstLesson = (course) => {
        for (const module of course.modules) {
            if (module.lessons && module.lessons.length > 0) {
                return module.lessons[0];
            }
        }
        return null;
    };

    const getAllLessons = () => {
        if (!course) return [];

        const allLessons = [];
        course.modules.forEach((module, moduleIndex) => {
            module.lessons.forEach((lesson, lessonIndex) => {
                allLessons.push({
                    ...lesson,
                    moduleTitle: module.title,
                    moduleIndex,
                    lessonIndex
                });
            });
        });
        return allLessons;
    };

    const getCurrentLessonIndex = () => {
        const allLessons = getAllLessons();
        return allLessons.findIndex(lesson =>
            lesson.id === currentLesson?.id || lesson._id === currentLesson?._id
        );
    };

    const navigateToLesson = (direction) => {
        const allLessons = getAllLessons();
        const currentIndex = getCurrentLessonIndex();

        let nextIndex;
        if (direction === 'next') {
            nextIndex = currentIndex + 1;
        } else {
            nextIndex = currentIndex - 1;
        }

        if (nextIndex >= 0 && nextIndex < allLessons.length) {
            const nextLesson = allLessons[nextIndex];
            navigate(`/courses/${courseId}/lessons/${nextLesson.id || nextLesson._id}`);
        }
    };

    const handleLessonClick = (lesson) => {
        setShowAssessment(false);
        navigate(`/courses/${courseId}/lessons/${lesson.id || lesson._id}`);
        setSidebarOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-brand font-medium">Loading lesson...</div>
            </div>
        );
    }

    if (!course || !currentLesson) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-brand mb-4">Lesson not found</h1>
                    <Link to={`/courses/${courseId}`} className="btn btn-primary">
                        Back to Course
                    </Link>
                </div>
            </div>
        );
    }

    const allLessons = getAllLessons();
    const currentIndex = getCurrentLessonIndex();
    const hasNext = currentIndex < allLessons.length - 1;
    const hasPrevious = currentIndex > 0;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white shadow-md rounded-lg text-brand border border-gray-200"
            >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar - Table of Contents */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                overflow-y-auto
            `}>
                <div className="p-6">
                    <div className="mb-6">
                        <Link
                            to={`/courses/${courseId}`}
                            className="flex items-center text-gray-500 hover:text-brand transition-colors font-medium"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Course
                        </Link>
                    </div>

                    <h2 className="text-xl font-black text-brand mb-6">Course Content</h2>
                    <h3 className="text-sm font-bold text-accent mb-4 uppercase tracking-wider">{course.title}</h3>

                    <div className="space-y-6">
                        {course.modules.map((module, moduleIndex) => (
                            <div key={module.id || moduleIndex} className="border-l-2 border-gray-100">
                                <div className="pl-4">
                                    <h4 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">
                                        {module.title}
                                    </h4>
                                    <div className="space-y-1">
                                        {module.lessons.map((lesson, lessonIndex) => {
                                            const isCurrent = lesson.id === currentLesson.id || lesson._id === currentLesson._id;
                                            const lessonGlobalIndex = allLessons.findIndex(l =>
                                                l.id === lesson.id || l._id === lesson._id
                                            );

                                            return (
                                                <button
                                                    key={lesson.id || lesson._id || lessonIndex}
                                                    onClick={() => handleLessonClick(lesson)}
                                                    className={`
                                                        w-full text-left p-3 rounded-lg transition-all duration-200
                                                        ${isCurrent
                                                            ? 'bg-accent/10 text-accent font-bold border border-accent/20'
                                                            : 'text-gray-500 hover:bg-gray-50 hover:text-brand'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">
                                                            {lesson.title}
                                                        </span>
                                                        <span className="text-xs opacity-75">
                                                            {lessonGlobalIndex + 1}
                                                        </span>
                                                    </div>
                                                    {lesson.duration && (
                                                        <div className="text-xs mt-1 opacity-75 font-medium">
                                                            {lesson.duration}m
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <main className="max-w-4xl mx-auto px-6 py-8">
                    {showAssessment ? (
                        <div className="py-10">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <FaClipboardCheck size={24} />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-brand">Final Assessment</h2>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Neural Pattern Verification in Progress</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[2rem] border border-gray-200 overflow-hidden shadow-xl">
                                <AssessmentCenter isEmbedded={true} courseId={courseId} />
                            </div>

                            <div className="mt-12 flex justify-center">
                                <button
                                    onClick={() => setShowAssessment(false)}
                                    className="px-8 py-3 bg-white text-gray-500 hover:text-brand rounded-xl border border-gray-200 transition-all font-medium"
                                >
                                    Back to Final Lesson
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Lesson Header */}
                            <div className="mb-8">
                                <div className="text-sm text-accent font-bold mb-2 uppercase tracking-wide">
                                    {course.modules[currentModuleIndex]?.title}
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black text-brand mb-4">
                                    {currentLesson.title}
                                </h1>

                                {currentLesson.duration && (
                                    <div className="flex items-center text-gray-500 text-sm font-medium">
                                        <span>Duration: {currentLesson.duration} minutes</span>
                                        {currentLesson.difficulty && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <span>Level: {currentLesson.difficulty}</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Lesson Content */}
                            <div className="bg-white rounded-2xl p-8 mb-8 border border-gray-200 shadow-sm">
                                <div className="prose prose-lg max-w-none text-gray-600">
                                    {/* Key Points */}
                                    {currentLesson.keyPoints && currentLesson.keyPoints.length > 0 && (
                                        <div className="mb-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                            <h3 className="text-lg font-bold text-brand mb-4 flex items-center">
                                                <span className="w-1 h-5 bg-accent rounded mr-2"></span>
                                                Key Points
                                            </h3>
                                            <ul className="space-y-3">
                                                {currentLesson.keyPoints.map((point, index) => (
                                                    <li key={index} className="text-gray-600 flex items-start">
                                                        <FaCheck className="text-emerald-500 mt-1 mr-3 flex-shrink-0 text-xs" />
                                                        <span>{point}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Main Content */}
                                    <div className="text-gray-600 leading-relaxed">
                                        {currentLesson.content ? (
                                            <div className="whitespace-pre-wrap">{currentLesson.content}</div>
                                        ) : (
                                            <p className="text-gray-400 italic">No content available for this lesson.</p>
                                        )}
                                    </div>

                                    {/* Learning Objectives */}
                                    {currentLesson.learningObjectives && currentLesson.learningObjectives.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-gray-100">
                                            <h3 className="text-xl font-bold text-brand mb-4">Learning Objectives</h3>
                                            <ul className="space-y-2">
                                                {currentLesson.learningObjectives.map((objective, index) => (
                                                    <li key={index} className="text-gray-600 flex items-start">
                                                        <span className="text-accent mr-2 font-bold">✓</span>
                                                        <span>{objective}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Resources */}
                                    {currentLesson.resources && currentLesson.resources.length > 0 && (
                                        <div className="mt-8 pt-6 border-t border-gray-100">
                                            <h3 className="text-xl font-bold text-brand mb-4">Resources</h3>
                                            <div className="space-y-2">
                                                {currentLesson.resources.map((resource, index) => (
                                                    <a
                                                        key={index}
                                                        href={resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center text-accent hover:text-orange-700 transition-colors font-medium"
                                                    >
                                                        <span>{resource.title || resource.url}</span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                                <button
                                    onClick={() => {
                                        if (showAssessment) {
                                            setShowAssessment(false);
                                        } else {
                                            navigateToLesson('previous');
                                        }
                                    }}
                                    disabled={!showAssessment && !hasPrevious}
                                    className={`
                                flex items-center px-6 py-3 rounded-xl font-bold transition-colors
                                ${(!showAssessment && !hasPrevious)
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-white border border-gray-200 text-brand hover:bg-gray-50 shadow-sm'
                                        }
                            `}
                                >
                                    <FaArrowLeft className="mr-2" />
                                    {showAssessment ? 'Review Lesson' : 'Previous Lesson'}
                                </button>

                                {!showAssessment && (
                                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest hidden sm:block">
                                        Lesson {currentIndex + 1} of {allLessons.length}
                                    </div>
                                )}

                                {!showAssessment ? (
                                    hasNext ? (
                                        <button
                                            onClick={() => navigateToLesson('next')}
                                            className="flex items-center px-6 py-3 bg-brand text-white rounded-xl font-bold hover:bg-gray-900 transition-colors shadow-lg shadow-brand/20"
                                        >
                                            Next Lesson
                                            <FaArrowRight className="ml-2" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowAssessment(true)}
                                            className="flex items-center px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
                                        >
                                            Take Assessment
                                            <FaClipboardCheck className="ml-2" />
                                        </button>
                                    )
                                ) : (
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center px-6 py-3 bg-white border border-gray-200 text-brand rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                    >
                                        Finish Later
                                        <FaCheck className="ml-2" />
                                    </Link>
                                )}
                            </div>
                        </>
                    )}
                </main>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default LessonPlayer;