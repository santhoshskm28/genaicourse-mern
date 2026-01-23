import React from 'react';
import { useParams } from 'react-router-dom';
import courseService from '../../services/courseService';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaArrowRight, FaBookOpen, FaClock, FaCheckCircle, FaHome } from 'react-icons/fa';

const CourseReadingProgress = () => {
    const { courseId, lessonId } = useParams();
    const [course, setCourse] = React.useState(null);
    const [currentLesson, setCurrentLesson] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [currentModuleIndex, setCurrentModuleIndex] = React.useState(0);
    const [currentLessonIndex, setCurrentLessonIndex] = React.useState(0);

    React.useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const data = await courseService.getCourse(courseId);
                setCourse(data.data);
                
                // Find the current lesson
                const allLessons = [];
                data.data.modules.forEach(module => {
                    module.lessons.forEach(lesson => {
                        allLessons.push({
                            ...lesson,
                            moduleId: module._id,
                            moduleTitle: module.title
                        });
                    });
                });
                
                const lesson = allLessons.find(l => 
                    l._id === lessonId || l.id === lessonId
                );
                
                if (lesson) {
                    setCurrentLesson(lesson);
                    
                    // Find module and lesson indices
                    for (let i = 0; i < data.data.modules.length; i++) {
                        const module = data.data.modules[i];
                        for (let j = 0; j < module.lessons.length; j++) {
                            if (module.lessons[j]._id === lessonId || module.lessons[j].id === lessonId) {
                                setCurrentModuleIndex(i);
                                setCurrentLessonIndex(j);
                                break;
                            }
                        }
                    }
                }
            } catch (error) {
                toast.error('Failed to load course content');
                console.error('Error fetching course:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId, lessonId]);

    const getAllLessons = () => {
        if (!course) return [];
        
        const allLessons = [];
        course.modules.forEach(module => {
            module.lessons.forEach(lesson => {
                allLessons.push({
                    ...lesson,
                    moduleId: module._id,
                    moduleTitle: module.title,
                    moduleIndex: course.modules.indexOf(module),
                    lessonIndex: module.lessons.indexOf(lesson)
                });
            });
        });
        return allLessons;
    };

    const navigateToLesson = (direction) => {
        const allLessons = getAllLessons();
        const currentIndex = allLessons.findIndex(lesson => 
            lesson._id === currentLesson._id || lesson.id === currentLesson.id
        );
        
        let nextIndex;
        if (direction === 'next') {
            nextIndex = currentIndex + 1;
        } else {
            nextIndex = currentIndex - 1;
        }

        if (nextIndex >= 0 && nextIndex < allLessons.length) {
            const nextLesson = allLessons[nextIndex];
            window.location.href = `/courses/${courseId}/lessons/${nextLesson._id || nextLesson.id}`;
        } else {
            toast.info(direction === 'next' ? 'You\'re at the last lesson!' : 'You\'re at the first lesson!');
        }
    };

    const calculateOverallProgress = () => {
        if (!course) return 0;
        
        const totalLessons = getAllLessons();
        // For demo purposes, assume completed lessons count
        // In real app, this would come from user progress data
        const completedCount = Math.max(0, totalLessons.indexOf(currentLesson));
        return Math.round((completedCount / totalLessons.length) * 100);
    };

    if (loading) return <Loader />;

    if (!course || !currentLesson) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Content Not Found</h1>
                    <p className="text-gray-400 mb-6">The requested lesson or course could not be found.</p>
                    <button 
                        onClick={() => window.history.back()}
                        className="btn btn-primary px-6 py-3"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const overallProgress = calculateOverallProgress();
    const totalLessons = getAllLessons();
    const currentLessonNumber = totalLessons.findIndex(lesson => 
        lesson._id === currentLesson._id || lesson.id === currentLesson.id
    ) + 1;

    return (
        <div className="min-h-screen bg-slate-900 flex">
            {/* Top Navigation Bar */}
            <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-40">
                <div className="container py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => window.location.href = `/courses/${courseId}`}
                                className="flex items-center text-gray-400 hover:text-white transition-colors"
                            >
                                <FaArrowLeft className="mr-2" />
                                <span>Back to Course</span>
                            </button>
                            
                            <div className="h-px bg-slate-700 w-px"></div>
                            
                            <h1 className="text-lg font-bold text-white max-w-md truncate">
                                {course.title}
                            </h1>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                            <div className="text-center">
                                <span className="text-2xl font-bold text-primary">{currentLessonNumber}</span>
                                <span className="text-gray-400 ml-2">/ {totalLessons.length}</span>
                            </div>
                            
                            <div className="bg-slate-700 rounded-lg px-4 py-2">
                                <div className="flex items-center text-sm">
                                    <FaBookOpen className="mr-2 text-primary" />
                                    <span>{currentModuleIndex + 1}. {currentLesson.title}</span>
                                </div>
                            </div>
                            
                            <button
                                onClick={() => window.location.href = '/'}
                                className="text-gray-400 hover:text-white transition-colors p-2"
                                title="Exit to Dashboard"
                            >
                                <FaHome size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-4xl mx-auto py-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-gray-400">Reading Progress</span>
                            <span className="text-white font-bold">{overallProgress}% Complete</span>
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div 
                                className="bg-primary h-full rounded-full transition-all duration-500"
                                style={{ width: `${overallProgress}%` }}
                            />
                        </div>
                    </div>

                    {/* Lesson Content */}
                    <div className="card">
                        <div className="p-8">
                            {/* Lesson Header */}
                            <div className="mb-8 pb-6 border-b border-slate-700">
                                <h1 className="text-3xl font-bold text-white mb-4">
                                    {currentLesson.title}
                                </h1>
                                
                                <div className="flex items-center gap-6 text-gray-400">
                                    <div className="flex items-center">
                                        <FaClock className="mr-2" />
                                        <span>{currentLesson.duration || 5} minutes</span>
                                    </div>
                                    {currentLesson.difficulty && (
                                        <div className="flex items-center">
                                            <span className="mr-2">Level:</span>
                                            <span className="bg-slate-700 px-2 py-1 rounded text-xs">
                                                {currentLesson.difficulty}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
                                {/* Key Points */}
                                {currentLesson.keyPoints && currentLesson.keyPoints.length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                            <FaCheckCircle className="mr-2 text-green-500" />
                                            Key Points
                                        </h3>
                                        <ul className="space-y-2">
                                            {currentLesson.keyPoints.map((point, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="text-primary mr-2">•</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Main Text Content */}
                                <div className="whitespace-pre-wrap text-lg leading-relaxed">
                                    {currentLesson.content ? (
                                        <div>{currentLesson.content}</div>
                                    ) : (
                                        <p className="text-gray-400 italic">No content available for this lesson.</p>
                                    )}
                                </div>

                                {/* Learning Objectives */}
                                {currentLesson.learningObjectives && currentLesson.learningObjectives.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-slate-700">
                                        <h3 className="text-xl font-bold text-white mb-4">Learning Objectives</h3>
                                        <ul className="space-y-2">
                                            {currentLesson.learningObjectives.map((objective, index) => (
                                                <li key={index} className="flex items-start">
                                                    <FaCheckCircle className="mr-2 text-green-500 text-sm" />
                                                    <span>{objective}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Resources */}
                                {currentLesson.resources && currentLesson.resources.length > 0 && (
                                    <div className="mt-8 pt-6 border-t border-slate-700">
                                        <h3 className="text-xl font-bold text-white mb-4">Additional Resources</h3>
                                        <div className="space-y-2">
                                            {currentLesson.resources.map((resource, index) => (
                                                <a
                                                    key={index}
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-primary hover:text-primary-light transition-colors p-3 bg-slate-800 rounded-lg"
                                                >
                                                    <span className="mr-2">📎</span>
                                                    <span>{resource.title || resource.url}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 pb-8">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => navigateToLesson('previous')}
                                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                                    currentLessonNumber === 1
                                        ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-slate-700 text-white hover:bg-slate-600'
                                }`}
                                disabled={currentLessonNumber === 1}
                            >
                                <FaArrowLeft className="mr-2" />
                                Previous Lesson
                            </button>
                            
                            <div className="text-center text-gray-400 text-sm">
                                Lesson {currentLessonNumber} of {totalLessons.length}
                            </div>
                            
                            <button
                                onClick={() => navigateToLesson('next')}
                                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                                    currentLessonNumber === totalLessons.length
                                        ? 'bg-slate-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-white hover:bg-primary-dark'
                                }`}
                                disabled={currentLessonNumber === totalLessons.length}
                            >
                                Next Lesson
                                <FaArrowRight className="ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseReadingProgress;