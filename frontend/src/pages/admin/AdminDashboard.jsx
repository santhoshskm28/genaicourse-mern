import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import { FaUser, FaBook, FaPlus, FaTrash, FaEdit } from 'react-icons/fa';


import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        
        const fetchData = async () => {
            try {
                // Sequential requests to avoid rate limiting
                const statsData = await adminService.getDashboardStats();
                
                if (!isMounted) return;
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const coursesData = await adminService.getAllCourses();
                
                if (!isMounted) return;
                await new Promise(resolve => setTimeout(resolve, 300));
                
                const usersData = await adminService.getAllUsers();

                if (!isMounted) return;
                
                setStats(statsData || null);
                setCourses(coursesData.data || []);
                setUsers(usersData.data || []);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                if (error.response?.status === 429) {
                    toast.error('Too many requests. Please wait a moment...');
                } else {
                    toast.error('Failed to load dashboard data');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        
        return () => {
            isMounted = false;
        };
    }, []);



    const handleDeleteCourse = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            try {
                await adminService.deleteCourse(id); // Use courseService for delete usually, but we have admin rights
                setCourses(courses.filter(c => c._id !== id));
                toast.success('Course deleted');
            } catch (error) {
                toast.error('Failed to delete course');
            }
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure? This will delete the user and their progress.')) {
            try {
                await adminService.deleteUser(id);
                setUsers(users.filter(u => u._id !== id));
                toast.success('User deleted');
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="section min-h-screen bg-slate-900">
            <div className="container">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
                    <Link to="/dashboard" className="btn btn-secondary">
                        ← Back to My Dashboard
                    </Link>
                </div>

                {/* Tabs */}
                <div className="flex space-x-4 mb-8 border-b border-slate-700">
                    {['overview', 'courses', 'users'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-4 px-4 font-medium capitalize ${activeTab === tab
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && stats && stats.overview && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            <StatCard title="Total Users" value={stats.overview.totalUsers || 0} icon={<FaUser />} color="indigo" />
                            <StatCard title="Total Courses" value={stats.overview.totalCourses || 0} icon={<FaBook />} color="emerald" />
                            <StatCard title="Total Enrollments" value={stats.overview.totalEnrollments || 0} icon={<FaBook />} color="pink" />
                            <StatCard title="Published" value={stats.overview.publishedCourses || 0} icon={<FaBook />} color="blue" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="card p-6 bg-slate-800 border-none">
                                <h3 className="text-xl font-bold mb-4">Popular Courses</h3>
                                <ul className="space-y-4">
                                    {stats.popularCourses && stats.popularCourses.length > 0 ? (
                                        stats.popularCourses.map((course, idx) => (
                                            <li key={course._id || idx} className="flex justify-between items-center border-b border-slate-700 pb-2">
                                                <span>{course.title || 'Untitled Course'}</span>
                                                <span className="bg-slate-700 px-2 py-1 rounded text-sm">{course.enrollmentCount || 0} students</span>
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-gray-400">No courses available</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {/* Courses Tab */}
                {activeTab === 'courses' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Manage Courses</h2>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate('/admin/courses/json')}
                                    className="btn bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                                >
                                    <FaPlus /> JSON Upload
                                </button>
                                <button
                                    onClick={() => navigate('/admin/courses/new')}
                                    className="btn btn-primary flex items-center gap-2"
                                >
                                    <FaPlus /> New Course
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-slate-700">
                            <table className="w-full text-left text-gray-400">
                                <thead className="bg-slate-800 text-white uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Title</th>
                                        <th className="px-6 py-3">Category</th>
                                        <th className="px-6 py-3">Students</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-900">
                                    {courses && courses.length > 0 ? (
                                        courses.map(course => (
                                            <tr key={course._id || course.id} className="hover:bg-slate-800 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">{course.title || 'Untitled'}</td>
                                                <td className="px-6 py-4">{course.category || 'Uncategorized'}</td>
                                                <td className="px-6 py-4">{course.enrollmentCount || 0}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${course.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                        {course.isPublished ? 'Published' : 'Draft'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 flex space-x-3">
                                                    <button
                                                        onClick={() => navigate(`/admin/courses/${course._id || course.id}/edit`)}
                                                        className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                    >
                                                        <FaEdit /> Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCourse(course._id || course.id)}
                                                        className="text-red-400 hover:text-red-300 flex items-center gap-1"
                                                    >
                                                        <FaTrash /> Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                                No courses found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
                        <div className="overflow-x-auto rounded-lg border border-slate-700">
                            <table className="w-full text-left text-gray-400">
                                <thead className="bg-slate-800 text-white uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Email</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3">Joined</th>
                                        <th className="px-6 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700 bg-slate-900">
                                    {users && users.length > 0 ? (
                                        users.map(u => (
                                            <tr key={u._id || u.id} className="hover:bg-slate-800 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">{u.name || 'Unknown'}</td>
                                                <td className="px-6 py-4">{u.email || 'No email'}</td>
                                                <td className="px-6 py-4 capitalize">{u.role || 'user'}</td>
                                                <td className="px-6 py-4">
                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Unknown'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {u.role !== 'admin' && (
                                                        <button onClick={() => handleDeleteUser(u._id || u.id)} className="text-red-400 hover:text-red-300">
                                                            <FaTrash />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-400">
                                                No users found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => {
    const getColorClasses = (color) => {
        switch (color) {
            case 'indigo':
                return 'bg-indigo-500/10 text-indigo-500';
            case 'emerald':
                return 'bg-emerald-500/10 text-emerald-500';
            case 'pink':
                return 'bg-pink-500/10 text-pink-500';
            case 'blue':
                return 'bg-blue-500/10 text-blue-500';
            default:
                return 'bg-slate-500/10 text-slate-500';
        }
    };

    return (
        <div className="card p-6 bg-slate-800 border-none flex items-center">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 text-2xl ${getColorClasses(color)}`}>
                {icon}
            </div>
            <div>
                <div className="text-gray-400 text-sm">{title}</div>
                <div className="text-2xl font-bold text-white">{value}</div>
            </div>
        </div>
    );
};

export default AdminDashboard;
