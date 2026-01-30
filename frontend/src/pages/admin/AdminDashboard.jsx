import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import AdminAssessmentManager from './AdminAssessmentManager.jsx';
import { FaUser, FaBook, FaPlus, FaTrash, FaEdit, FaChartLine, FaGraduationCap, FaClipboardList, FaUsers } from 'react-icons/fa';
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

                setStats(statsData?.data || null);
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
                await adminService.deleteCourse(id);
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

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
        { id: 'courses', label: 'Courses', icon: <FaBook /> },
        { id: 'assessments', label: 'Assessments', icon: <FaClipboardList /> },
        { id: 'users', label: 'Users', icon: <FaUser /> },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30 pt-28">
            {/* Top Navigation Bar could go here */}

            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-400 mt-1">Manage your platform, users, and content.</p>
                    </div>
                    <Link to="/dashboard" className="btn bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all shadow-sm hover:shadow-md">
                        ← Back to My Dashboard
                    </Link>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700/50 backdrop-blur-sm w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20'
                                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

                    {/* Overview Tab */}
                    {activeTab === 'overview' && stats && stats.overview && (
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title="Total Users"
                                    value={stats.overview.totalUsers || 0}
                                    icon={<FaUser />}
                                    gradient="from-blue-500 to-indigo-600"
                                />
                                <StatCard
                                    title="Total Courses"
                                    value={stats.overview.totalCourses || 0}
                                    icon={<FaBook />}
                                    gradient="from-emerald-500 to-teal-600"
                                />
                                <StatCard
                                    title="Enrollments"
                                    value={stats.overview.totalEnrollments || 0}
                                    icon={<FaGraduationCap />}
                                    gradient="from-violet-500 to-purple-600"
                                />
                                <StatCard
                                    title="Published"
                                    value={stats.overview.publishedCourses || 0}
                                    icon={<FaBook />}
                                    gradient="from-orange-500 to-amber-600"
                                />
                            </div>

                            {/* Main Content Split */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {/* Popular Courses */}
                                <div className="lg:col-span-2 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl shadow-black/20">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <FaChartLine className="text-indigo-400" />
                                        Popular Courses
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.popularCourses && stats.popularCourses.length > 0 ? (
                                            stats.popularCourses.map((course, idx) => (
                                                <div key={course._id || idx} className="group flex items-center justify-between p-4 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 hover:bg-slate-700/30 transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-lg">
                                                            #{idx + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-white group-hover:text-indigo-300 transition-colors">{course.title || 'Untitled'}</h4>
                                                            <p className="text-xs text-slate-500">{course.category || 'General'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                                                        <FaUser className="text-xs text-slate-400" />
                                                        <span className="font-mono font-bold text-indigo-400">{course.enrollmentCount || 0}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-slate-500">
                                                No course data available yet.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions / Summary */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-indigo-900/50 to-slate-900 rounded-2xl p-6 border border-indigo-500/20">
                                        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
                                        <div className="space-y-3">
                                            <button onClick={() => navigate('/admin/courses/new')} className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20">
                                                <FaPlus /> Create New Course
                                            </button>
                                            <button onClick={() => setActiveTab('assessments')} className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 border border-slate-700">
                                                <FaClipboardList /> Manage Assessments
                                            </button>
                                        </div>
                                    </div>

                                    {/* System Status or simple info */}
                                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                                        <h3 className="text-lg font-bold text-white mb-4">System Status</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400">Server Status</span>
                                                <span className="text-emerald-400 flex items-center gap-1.5">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    My Dashboard
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400">Database</span>
                                                <span className="text-emerald-400">Connected</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400">Version</span>
                                                <span className="text-slate-300 font-mono">v1.2.0</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Courses Tab */}
                    {activeTab === 'courses' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Manage Courses</h2>
                                    <p className="text-slate-400 mt-1">Create, edit, and publish your courses</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate('/admin/courses/json')}
                                        className="btn bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-2 border border-slate-600"
                                    >
                                        <FaPlus /> JSON Import
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/courses/new')}
                                        className="btn bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-lg shadow-indigo-900/20"
                                    >
                                        <FaPlus /> New Course
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-slate-400">
                                        <thead className="bg-slate-900/50 text-slate-200 uppercase text-xs font-semibold">
                                            <tr>
                                                <th className="px-6 py-4">Title</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Students</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {courses && courses.length > 0 ? (
                                                courses.map(course => (
                                                    <tr key={course._id || course.id} className="hover:bg-slate-700/30 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-white">{course.title || 'Untitled'}</td>
                                                        <td className="px-6 py-4">{course.category || 'Uncategorized'}</td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5">
                                                                <FaUser className="text-xs" />
                                                                {course.enrollmentCount || 0}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${course.isPublished
                                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                                }`}>
                                                                {course.isPublished ? 'Published' : 'Draft'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => navigate(`/admin/courses/${course._id || course.id}/enrollments`)}
                                                                    className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                                    title="View Enrollments"
                                                                >
                                                                    <FaUsers />
                                                                </button>
                                                                <button
                                                                    onClick={() => navigate(`/admin/courses/${course._id || course.id}/edit`)}
                                                                    className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteCourse(course._id || course.id)}
                                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <FaTrash />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                                        <FaBook className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                                        No courses found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Assessments Tab */}
                    {activeTab === 'assessments' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <AdminAssessmentManager />
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="space-y-6">
                            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                                <h2 className="text-2xl font-bold text-white">Manage Users</h2>
                                <p className="text-slate-400 mt-1">View and manage registered users</p>
                            </div>

                            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-slate-400">
                                        <thead className="bg-slate-900/50 text-slate-200 uppercase text-xs font-semibold">
                                            <tr>
                                                <th className="px-6 py-4">Name</th>
                                                <th className="px-6 py-4">Email</th>
                                                <th className="px-6 py-4">Role</th>
                                                <th className="px-6 py-4">Joined</th>
                                                <th className="px-6 py-4 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700">
                                            {users && users.length > 0 ? (
                                                users.map(u => (
                                                    <tr key={u._id || u.id} className="hover:bg-slate-700/30 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                                                {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                            {u.name || 'Unknown'}
                                                        </td>
                                                        <td className="px-6 py-4">{u.email || 'No email'}</td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${u.role === 'admin'
                                                                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                                                : 'bg-slate-600/30 text-slate-400 border border-slate-600'
                                                                }`}>
                                                                {u.role || 'user'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-mono">
                                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {u.role !== 'admin' && (
                                                                <div className="flex justify-end">
                                                                    <button onClick={() => handleDeleteUser(u._id || u.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                                                                        <FaTrash />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                                                        <FaUser className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                                        No users found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, gradient }) => {
    return (
        <div className="relative group overflow-hidden bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg transition-all hover:-translate-y-1 hover:shadow-2xl">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-full -mr-16 -mt-16 group-hover:opacity-20 transition-opacity blur-2xl`}></div>

            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
