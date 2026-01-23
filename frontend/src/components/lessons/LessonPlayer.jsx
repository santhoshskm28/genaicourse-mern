import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import courseService from '../../services/courseService';
import { FaArrowLeft, FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';

const LessonPlayer = () => {
    const { courseId, lessonId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);

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
        navigate(`/courses/${courseId}/lessons/${lesson.id || lesson._id}`);
        setSidebarOpen(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-white">Loading lesson...</div>
            </div>
        );
    }

    if (!course || !currentLesson) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Lesson not found</h1>
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
        <div className="min-h-screen bg-slate-900 flex">
            {/* Mobile Menu Toggle */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
            >
                {sidebarOpen ? <FaTimes /> : <FaBars />}
            </button>

            {/* Sidebar - Table of Contents */}
            <div className={`
                fixed lg:static inset-y-0 left-0 z-40 w-80 bg-slate-800 border-r border-slate-700 
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                overflow-y-auto
            `}>
                <div className="p-6">
                    <div className="mb-6">
                        <Link 
                            to={`/courses/${courseId}`}
                            className="flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Course
                        </Link>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-6">Course Content</h2>
                    <h3 className="text-lg font-semibold text-primary mb-4">{course.title}</h3>

                    <div className="space-y-6">
                        {course.modules.map((module, moduleIndex) => (
                            <div key={module.id || moduleIndex} className="border-l-2 border-slate-600">
                                <div className="pl-4">
                                    <h4 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
                                        {module.title}
                                    </h4>
                                    <div className="space-y-2">
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
                                                            ? 'bg-primary text-white' 
                                                            : 'text-gray-400 hover:bg-slate-700 hover:text-white'
                                                        }
                                                    `}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium">
                                                            {lesson.title}
                                                        </span>
                                                        <span className="text-xs opacity-75">
                                                            {lessonGlobalIndex + 1}
                                                        </span>
                                                    </div>
                                                    {lesson.duration && (
                                                        <div className="text-xs mt-1 opacity-75">
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
                    {/* Lesson Header */}
                    <div className="mb-8">
                        <div className="text-sm text-primary font-semibold mb-2">
                            {course.modules[currentModuleIndex]?.title}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {currentLesson.title}
                        </h1>
                        
                        {currentLesson.duration && (
                            <div className="flex items-center text-gray-400 text-sm">
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
                    <div className="bg-slate-800 rounded-lg p-8 mb-8">
                        <div className="prose prose-invert max-w-none">
                            {/* Key Points */}
                            {currentLesson.keyPoints && currentLesson.keyPoints.length > 0 && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold text-white mb-4">Key Points</h3>
                                    <ul className="space-y-2">
                                        {currentLesson.keyPoints.map((point, index) => (
                                            <li key={index} className="text-gray-300 flex items-start">
                                                <span className="text-primary mr-2">•</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Main Content */}
                            <div className="text-gray-300 leading-relaxed">
                                {currentLesson.content ? (
                                    <div className="whitespace-pre-wrap">{currentLesson.content}</div>
                                ) : (
                                    <p className="text-gray-400 italic">No content available for this lesson.</p>
                                )}
                            </div>

                            {/* Learning Objectives */}
                            {currentLesson.learningObjectives && currentLesson.learningObjectives.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-slate-700">
                                    <h3 className="text-xl font-semibold text-white mb-4">Learning Objectives</h3>
                                    <ul className="space-y-2">
                                        {currentLesson.learningObjectives.map((objective, index) => (
                                            <li key={index} className="text-gray-300 flex items-start">
                                                <span className="text-primary mr-2">✓</span>
                                                <span>{objective}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Resources */}
                            {currentLesson.resources && currentLesson.resources.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-slate-700">
                                    <h3 className="text-xl font-semibold text-white mb-4">Resources</h3>
                                    <div className="space-y-2">
                                        {currentLesson.resources.map((resource, index) => (
                                            <a
                                                key={index}
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center text-primary hover:text-primary-light transition-colors"
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
                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigateToLesson('previous')}
                            disabled={!hasPrevious}
                            className={`
                                flex items-center px-6 py-3 rounded-lg font-medium transition-colors
                                ${hasPrevious 
                                    ? 'bg-slate-700 text-white hover:bg-slate-600' 
                                    : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                }
                            `}
                        >
                            <FaArrowLeft className="mr-2" />
                            Previous Lesson
                        </button>

                        <div className="text-gray-400 text-sm">
                            Lesson {currentIndex + 1} of {allLessons.length}
                        </div>

                        <button
                            onClick={() => navigateToLesson('next')}
                            disabled={!hasNext}
                            className={`
                                flex items-center px-6 py-3 rounded-lg font-medium transition-colors
                                ${hasNext 
                                    ? 'bg-primary text-white hover:bg-primary-dark' 
                                    : 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                }
                            `}
                        >
                            Next Lesson
                            <FaArrowRight className="ml-2" />
                        </button>
                    </div>
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