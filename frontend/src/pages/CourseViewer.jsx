import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import courseService from '../services/courseService.js';
import Loader from '../components/common/Loader.jsx';
import { FaChevronLeft, FaChevronRight, FaCheck, FaBars, FaTimes, FaClipboardCheck, FaPlayCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AssessmentCenter from '../components/assessment/AssessmentCenter.jsx';

const CourseViewer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [course, setCourse] = useState(null);
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [completedLessons, setCompletedLessons] = useState(new Set());
    const [showAssessment, setShowAssessment] = useState(false);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                const [courseData, progressData] = await Promise.all([
                    courseService.getCourse(id),
                    courseService.getCourseProgress(id).catch(() => null)
                ]);
                setCourse(courseData.data);

                if (progressData?.data) {
                    setProgress(progressData.data);
                    const completed = new Set();
                    progressData.data.completedLessons?.forEach(lesson => {
                        completed.add(String(lesson.lessonId));
                    });
                    setCompletedLessons(completed);
                }
            } catch (error) {
                toast.error("Failed to load course");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id]);

    if (loading) return <Loader />;
    if (!course) return <div className="text-center mt-20">Course not found</div>;

    const currentModule = course.modules[currentModuleIndex];
    const currentLesson = currentModule?.lessons[currentLessonIndex];
    const isLastLesson = currentModuleIndex === course.modules.length - 1 &&
        currentLessonIndex === currentModule.lessons.length - 1;

    const markCurrentLessonComplete = async () => {
        try {
            const lessonId = currentLesson._id || currentLesson.id;
            const moduleId = currentModule._id || currentModule.id;
            await courseService.markLessonComplete(id, moduleId, lessonId);

            setCompletedLessons(prev => new Set([...prev, String(lessonId)]));
            toast.success("Lesson completed!");
        } catch (error) {
            console.error('Failed to mark lesson complete:', error);
            toast.error('Could not save progress. Make sure you are enrolled.');
        }
    };

    const handleNext = async () => {
        // Mark current lesson as complete
        const lessonId = currentLesson._id || currentLesson.id;
        if (!completedLessons.has(String(lessonId))) {
            await markCurrentLessonComplete();
        }

        if (currentLessonIndex < currentModule.lessons.length - 1) {
            setCurrentLessonIndex(prev => prev + 1);
        } else if (currentModuleIndex < course.modules.length - 1) {
            setCurrentModuleIndex(prev => prev + 1);
            setCurrentLessonIndex(0);
        } else {
            // End of course - check if all lessons are completed
            const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);

            // Add the current lesson to the completed set if it's not already there
            const updatedCompleted = new Set([...completedLessons, String(lessonId)]);

            if (updatedCompleted.size >= totalLessons) {
                if (course.quizId) {
                    toast.success("Congratulations! Course completed. Redirecting to assessment...");
                    navigate(`/courses/${id}/assessment`);
                } else {
                    toast.success("Course Completed!");
                    navigate('/dashboard');
                }
            } else {
                toast.info("Please complete all lessons before taking the assessment.");
                // Still try to redirect if they are on the last lesson, but maybe they skipped some
                if (course.quizId && window.confirm("You haven't completed all lessons. Take the assessment anyway?")) {
                    navigate(`/courses/${id}/assessment`);
                }
            }
        }
    };

    const handlePrev = () => {
        if (currentLessonIndex > 0) {
            setCurrentLessonIndex(prev => prev - 1);
        } else if (currentModuleIndex > 0) {
            setCurrentModuleIndex(prev => prev - 1);
            setCurrentLessonIndex(course.modules[currentModuleIndex - 1].lessons.length - 1);
        }
    };

    return (
        <div className="flex h-screen bg-slate-900 text-white overflow-hidden font-sans">
            {/* Sidebar with Glassmorphism */}
            <motion.div
                initial={{ x: -300 }}
                animate={{ x: sidebarOpen ? 0 : -300 }}
                className="fixed md:relative z-20 h-full w-80 glass-panel border-r border-slate-700 flex flex-col"
            >
                <div className="p-5 border-b border-slate-700 flex justify-between items-center">
                    <h2 className="font-bold truncate">{course.title}</h2>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden"><FaTimes /></button>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {course.modules.map((mod, mIdx) => (
                        <div key={mod._id}>
                            <div className="px-4 py-2 bg-slate-800/50 text-xs uppercase tracking-wider text-gray-400 font-semibold">
                                Module {mIdx + 1}
                            </div>
                            {mod.lessons.map((less, lIdx) => {
                                const lessonId = less._id || less.id;
                                const isCompleted = completedLessons.has(String(lessonId));
                                const isCurrent = mIdx === currentModuleIndex && lIdx === currentLessonIndex;

                                return (
                                    <button
                                        key={lessonId}
                                        onClick={() => {
                                            setShowAssessment(false);
                                            setCurrentModuleIndex(mIdx);
                                            setCurrentLessonIndex(lIdx);
                                        }}
                                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 border-l-4 flex items-center justify-between group ${!showAssessment && isCurrent
                                            ? 'bg-primary/10 border-primary text-white'
                                            : 'border-transparent text-gray-400 hover:bg-slate-800 hover:text-white'
                                            }`}
                                    >
                                        <span className="flex-1 truncate">{less.title}</span>
                                        {isCompleted ? (
                                            <FaCheck className="text-emerald-400 text-xs" />
                                        ) : (
                                            <FaPlayCircle className="text-gray-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                    {course.quizId && (
                        <div className="mt-4 border-t border-slate-700 pt-4">
                            <div className="px-4 py-2 bg-indigo-900/40 text-xs uppercase tracking-wider text-indigo-400 font-semibold">
                                Final Assessment
                            </div>
                            <button
                                onClick={() => setShowAssessment(true)}
                                className={`w-full text-left px-4 py-3 text-sm transition-all duration-200 border-l-4 flex items-center gap-2 group ${showAssessment
                                    ? 'bg-indigo-500/10 border-indigo-500 text-white'
                                    : 'border-transparent text-gray-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <FaClipboardCheck className={showAssessment ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'} />
                                <span className="flex-1 truncate">Final Assessment</span>
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative z-10">
                {/* Top Navigation */}
                <div className="glass-header h-16 flex items-center justify-between px-6">
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white">
                        <FaBars size={20} />
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-400">
                            {currentLessonIndex + 1} / {currentModule.lessons.length}
                        </div>
                        {progress && (
                            <div className="text-sm text-gray-400">
                                Progress: {Math.round((completedLessons.size / course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0)) * 100)}%
                            </div>
                        )}
                    </div>
                </div>

                {/* Dynamic Content with Animation */}
                <div className="flex-1 overflow-y-auto p-6 md:p-12 flex justify-center">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={showAssessment ? 'assessment' : currentLesson._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}
                            className="max-w-4xl w-full"
                        >
                            {!showAssessment ? (
                                <>
                                    <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 block">
                                        Module {currentModuleIndex + 1}: {currentModule.title}
                                    </span>
                                    <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
                                        {currentLesson.title}
                                    </h1>

                                    <div className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed mb-12">
                                        {currentLesson.content.split('\n').map((p, i) => (
                                            <p key={i} className="mb-4">{p}</p>
                                        ))}
                                    </div>

                                    {currentLesson.keyPoints?.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="glass-panel rounded-xl p-8 mb-12"
                                        >
                                            <h3 className="text-xl font-bold mb-4 flex items-center">
                                                <span className="w-1.5 h-6 bg-secondary rounded mr-3"></span>
                                                Key Takeaways
                                            </h3>
                                            <ul className="grid gap-3">
                                                {currentLesson.keyPoints.map((point, idx) => (
                                                    <li key={idx} className="flex items-start text-gray-300">
                                                        <FaCheck className="text-emerald-400 mt-1 mr-3 flex-shrink-0" />
                                                        {point}
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    )}

                                    {isLastLesson && course.quizId && (
                                        <div className="mt-20 pt-20 border-t border-slate-800 text-center">
                                            <h2 className="text-3xl font-black text-white mb-4">Neural Synchronization Complete</h2>
                                            <p className="text-slate-500 mb-10 max-w-xl mx-auto">You've mastered all the modules. It's time to validate your knowledge and secure your certification.</p>
                                            <button
                                                onClick={() => setShowAssessment(true)}
                                                className="btn-premium btn-primary-gradient !px-12 !py-4 text-lg shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                                            >
                                                Start Final Assessment
                                                <FaClipboardCheck />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="mt-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                            <FaClipboardCheck size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black text-white">Final Assessment</h2>
                                            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Neural Pattern Verification in Progress</p>
                                        </div>
                                    </div>

                                    <div className="bg-[#020617]/50 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
                                        <AssessmentCenter isEmbedded={true} courseId={id} />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom Bar */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/90 backdrop-blur">
                    <div className="max-w-4xl mx-auto flex justify-between">
                        <button
                            onClick={() => {
                                if (showAssessment) {
                                    setShowAssessment(false);
                                } else {
                                    handlePrev();
                                }
                            }}
                            disabled={!showAssessment && currentModuleIndex === 0 && currentLessonIndex === 0}
                            className="btn btn-secondary disabled:opacity-50"
                        >
                            <FaChevronLeft className="mr-2" /> Previous
                        </button>
                        {!showAssessment && !isLastLesson && (
                            <button
                                onClick={handleNext}
                                className="btn btn-primary"
                            >
                                Next <FaChevronRight className="ml-2" />
                            </button>
                        )}
                        {!showAssessment && isLastLesson && course.quizId && (
                            <button
                                onClick={() => setShowAssessment(true)}
                                className="btn btn-primary-gradient shadow-lg shadow-indigo-500/20"
                            >
                                Proceed to Assessment <FaClipboardCheck className="ml-2" />
                            </button>
                        )}
                        {!showAssessment && isLastLesson && !course.quizId && (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="btn btn-primary-gradient"
                            >
                                Finish Course <FaCheck className="ml-2" />
                            </button>
                        )}
                        {showAssessment && (
                            <button
                                onClick={() => setShowAssessment(false)}
                                className="btn btn-outline-glass"
                            >
                                Review Lessons
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseViewer;
