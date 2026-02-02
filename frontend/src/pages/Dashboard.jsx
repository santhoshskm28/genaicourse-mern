import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';
import courseService from '@/services/courseService.js';
import Loader from '../components/common/Loader.jsx';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaClock, FaTrophy, FaPlay } from 'react-icons/fa';

const Dashboard = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrolledCourses = async () => {
            try {
                // We need to fetch details for courses in user.enrolledCourses
                // A better approach in a real app would be an API endpoint like /api/courses/enrolled
                // For now, let's fetch individual course progress which includes course info
                if (user.enrolledCourses && user.enrolledCourses.length > 0) {
                    const promises = user.enrolledCourses.map(course => {
                        const courseId = typeof course === 'object' && course !== null ? course._id : course;
                        return courseService.getCourseProgress(courseId).catch(() => null);
                    });

                    const results = await Promise.all(promises);
                    // Filter out failed requests or nulls
                    setEnrolledCourses(results.filter(r => r && r.success).map(r => r.data));
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledCourses();
    }, [user]);

    if (loading) return <Loader />;

    return (
        <div className="section section-pt min-h-screen bg-[var(--bg-main)]">
            <div className="container">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-black mb-2 text-brand">My Dashboard</h1>
                        <p className="text-gray-500">Welcome back, {user.name}!</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-3 mb-12">
                    <div className="card p-6 border border-gray-200 bg-white flex items-center shadow-sm rounded-2xl">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-4">
                            <FaGraduationCap size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-brand">{enrolledCourses.length}</div>
                            <div className="text-sm text-gray-500">Enrolled Courses</div>
                        </div>
                    </div>
                    <div className="card p-6 border border-gray-200 bg-white flex items-center shadow-sm rounded-2xl">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-4">
                            <FaTrophy size={24} />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-brand">
                                {enrolledCourses.filter(c => c && c.progressPercentage === 100).length}
                            </div>
                            <div className="text-sm text-gray-500">Certificates Earned</div>
                        </div>
                    </div>
                </div>

                <h2 className="section-title text-left mb-6 text-brand">Continue Learning</h2>

                {enrolledCourses.length > 0 ? (
                    <div className="grid grid-2">
                        {enrolledCourses.filter(progress => progress).map(progress => (
                            <div key={progress._id} className="card p-6 flex flex-col md:flex-row gap-6 items-center bg-white border border-gray-200 shadow-sm rounded-2xl">
                                <div className="w-full md:w-48 h-32 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                    <img
                                        src={progress.courseId.thumbnail || 'https://placehold.co/400x250?text=Course'}
                                        alt={progress.courseId.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 w-full">
                                    <h3 className="text-xl font-bold mb-2 text-brand">{progress.courseId.title}</h3>

                                    <div className="flex justify-between text-sm text-gray-500 mb-2">
                                        <span>{progress.progressPercentage}% Completed</span>
                                        <span>{progress.completedLessons.length} Lessons Done</span>
                                    </div>

                                    <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                        <div
                                            className="bg-accent h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${progress.progressPercentage}%` }}
                                        ></div>
                                    </div>

                                    <Link
                                        to={`/courses/${progress.courseId._id}/learn`}
                                        className="btn-premium btn-primary inline-flex items-center text-sm px-6"
                                    >
                                        <FaPlay className="mr-2" /> Resume
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
                        <h3 className="text-xl font-bold text-brand">You haven't enrolled in any courses yet.</h3>
                        <p className="text-gray-500 mt-2 mb-6">Start your learning journey today!</p>
                        <Link to="/courses" className="btn-premium btn-primary">Browse Courses</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
