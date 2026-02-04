import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import courseService from '../services/courseService.js';
import Loader from '../components/common/Loader.jsx';
import { FaChevronLeft, FaChevronRight, FaCheck, FaBars, FaTimes, FaClipboardCheck, FaPlayCircle, FaClock, FaSignal, FaBookOpen } from 'react-icons/fa';
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

    const queryParams = new URLSearchParams(window.location.search);
    const isPreview = queryParams.get('preview') === 'true';

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                if (isPreview) {
                    const courseData = await courseService.getCourse(id);
                    setCourse(courseData.data);
                } else {
                    const [courseData, progressData] = await Promise.all([
                        courseService.getCourse(id),
                        courseService.getCourseProgress(id).catch(() => null)
                    ]);
                    setCourse(courseData.data);

                    if (progressData?.data) {
                        const completed = new Set();
                        progressData.data.completedLessons?.forEach(lesson => {
                            completed.add(String(lesson.lessonId));
                        });
                        setCompletedLessons(completed);
                    }
                }
            } catch (error) {
                toast.error("Failed to load course");
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
    }, [id, isPreview]);

    if (loading) return <Loader />;
    if (!course) return <div className="text-center mt-20 text-brand">Course not found</div>;

    const currentModule = course.modules[currentModuleIndex];
    const currentLesson = currentModule?.lessons[currentLessonIndex];
    const isLastLesson = currentModuleIndex === course.modules.length - 1 &&
        currentLessonIndex === currentModule.lessons.length - 1;

    const markCurrentLessonComplete = async () => {
        if (isPreview) return;
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
        if (!isPreview && !completedLessons.has(String(lessonId))) {
            await markCurrentLessonComplete();
        }

        if (currentLessonIndex < currentModule.lessons.length - 1) {
            setCurrentLessonIndex(prev => prev + 1);
        } else if (currentModuleIndex < course.modules.length - 1) {
            setCurrentModuleIndex(prev => prev + 1);
            setCurrentLessonIndex(0);
        } else {
            if (isPreview) {
                toast.success("End of course preview.");
                return;
            }
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
        <div className="min-h-screen bg-gray-50 text-brand font-sans pt-20">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Course Info & Progress */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-brand mb-6 transition-colors font-medium">
                                <FaChevronLeft className="mr-2 text-xs" /> Back to My Learning
                            </Link>

                            <h1 className="text-3xl md:text-4xl font-black text-brand mb-4 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                {course.description}
                            </p>

                            <div className="flex items-center gap-6 text-sm font-bold text-gray-500 mb-8 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <FaClock className="text-accent" />
                                    <span>{course.totalDuration || 60} Mins Total</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaSignal className="text-accent" />
                                    <span>{course.level || 'Intermediate'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FaBookOpen className="text-accent" />
                                    <span>{course.totalLessons || 15} Lessons</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Section */}
                        {!isPreview && (
                            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                                <h3 className="text-xl font-bold mb-6">Your Progress</h3>

                                <div className="mb-2 flex justify-between text-sm font-bold text-gray-500">
                                    <span>Overall Progress</span>
                                    <span>{Math.round((completedLessons.size / (course.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1)) * 100)}%</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-6">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.round((completedLessons.size / (course.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 1)) * 100)}%` }}
                                        className="h-full bg-accent rounded-full"
                                    />
                                </div>

                                <div className="flex justify-between text-center">
                                    <div>
                                        <div className="text-3xl font-black text-brand mb-1">{completedLessons.size}</div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Completed Lessons</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-black text-brand mb-1">
                                            {(course.modules.reduce((acc, m) => acc + m.lessons.length, 0) || 0) - completedLessons.size}
                                        </div>
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Remaining Lessons</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Current Lesson View (If selected) */}
                        <div id="lesson-content" className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[500px]">
                            {/* Content rendering logic from previous implementation... */}
                            <AnimatePresence mode='wait'>
                                <motion.div
                                    key={showAssessment ? 'assessment' : currentLesson._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-8"
                                >
                                    {!showAssessment ? (
                                        <>
                                            <span className="text-accent font-bold uppercase tracking-widest text-xs mb-2 block">
                                                Module {currentModuleIndex + 1}: {currentModule.title}
                                            </span>
                                            <h2 className="text-2xl font-black mb-6 text-brand">
                                                {currentLesson.title}
                                            </h2>
                                            <div className="prose prose-lg max-w-none text-gray-600 leading-relaxed">
                                                {currentLesson.content.split('\n').map((p, i) => (
                                                    <p key={i} className="mb-4">{p}</p>
                                                ))}
                                            </div>
                                            {/* Navigation Buttons */}
                                            <div className="flex justify-between mt-12 pt-8 border-t border-gray-100">
                                                <button
                                                    onClick={handlePrev}
                                                    disabled={currentModuleIndex === 0 && currentLessonIndex === 0}
                                                    className="btn-premium bg-white border border-gray-200 text-brand hover:bg-gray-50 disabled:opacity-50 text-sm px-6 py-3"
                                                >
                                                    Previous
                                                </button>
                                                <button
                                                    onClick={handleNext}
                                                    className="btn-premium btn-primary text-sm px-6 py-3"
                                                >
                                                    {isLastLesson ? 'Finish' : 'Next Lesson'}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <AssessmentCenter isEmbedded={true} courseId={id} />
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Right Column: Course Content List */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl sticky top-24">
                            <div className="p-6 border-b border-gray-800">
                                <h3 className="text-xl font-bold text-white">Course Content</h3>
                            </div>
                            <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto no-scrollbar">
                                {course.modules.map((mod, mIdx) => (
                                    <div key={mod._id} className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50">
                                        <div className="px-5 py-4 bg-slate-800 flex justify-between items-center">
                                            <h4 className="font-bold text-white text-sm">
                                                Module {mIdx + 1}: <span className="text-gray-400 font-medium ml-1">{mod.title}</span>
                                            </h4>
                                            <span className="text-xs font-bold text-slate-500">{mod.lessons.length} Lessons</span>
                                        </div>
                                        <div className="divide-y divide-slate-700/50">
                                            {mod.lessons.map((less, lIdx) => {
                                                const lessonId = less._id || less.id;
                                                const isCompleted = completedLessons.has(String(lessonId));
                                                const isCurrent = mIdx === currentModuleIndex && lIdx === currentLessonIndex;

                                                return (
                                                    <div key={lessonId} className="p-4 flex items-center justify-between group hover:bg-slate-800/80 transition-colors">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-700 text-slate-400'}`}>
                                                                {isCompleted ? <FaCheck size={10} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-300 truncate group-hover:text-white transition-colors">{less.title}</p>
                                                                <p className="text-[10px] text-gray-500 font-bold uppercase">{less.duration || 5} mins</p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => {
                                                                setShowAssessment(false);
                                                                setCurrentModuleIndex(mIdx);
                                                                setCurrentLessonIndex(lIdx);
                                                                // Scroll to content
                                                                document.getElementById('lesson-content')?.scrollIntoView({ behavior: 'smooth' });
                                                            }}
                                                            className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${isCurrent
                                                                ? 'bg-accent text-white shadow-lg shadow-orange-900/20'
                                                                : 'bg-accent/10 text-accent hover:bg-accent hover:text-white'}`}
                                                        >
                                                            {isCurrent ? 'Play' : 'Start'}
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}

                                {course.quizId && (
                                    <div className="mt-4 pt-4 border-t border-slate-700">
                                        <button
                                            onClick={() => setShowAssessment(true)}
                                            className="w-full btn-premium bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700"
                                        >
                                            <FaClipboardCheck className="mr-2" /> Final Assessment
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseViewer;
