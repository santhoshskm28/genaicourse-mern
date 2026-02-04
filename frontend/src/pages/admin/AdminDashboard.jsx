import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService.js';
import Loader from '../../components/common/Loader.jsx';
import AdminAssessmentManager from './AdminAssessmentManager.jsx';
import { FaUser, FaBook, FaPlus, FaTrash, FaEdit, FaChartLine, FaGraduationCap, FaClipboardList, FaUsers, FaEye } from 'react-icons/fa';
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
        <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500/10 pt-28">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-500 mt-1 font-medium">Manage your platform, users, and content.</p>
                    </div>
                    <Link to="/dashboard" className="btn bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md font-bold">
                        ← Back to My Dashboard
                    </Link>
                </div>

                {/* Navigation Tabs */}
                <div className="flex flex-wrap gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-sm w-fit">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'
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
                                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
                                    <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <FaChartLine />
                                        </div>
                                        Popular Courses
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.popularCourses && stats.popularCourses.length > 0 ? (
                                            stats.popularCourses.map((course, idx) => (
                                                <div key={course._id || idx} className="group flex items-center justify-between p-5 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-white transition-all duration-300">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-black text-xl border border-slate-100 shadow-sm">
                                                            {idx + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-lg">{course.title || 'Untitled'}</h4>
                                                            <p className="text-sm text-slate-500 font-medium">{course.category || 'General'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                                                        <FaUser className="text-xs text-slate-400" />
                                                        <span className="font-black text-indigo-600">{course.enrollmentCount || 0}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 text-slate-400 font-medium">
                                                No course data available yet.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions / Summary */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
                                        <h3 className="text-xl font-black text-slate-900 mb-6">Quick Actions</h3>
                                        <div className="space-y-3">
                                            <button onClick={() => navigate('/admin/courses/new')} className="w-full py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100">
                                                <FaPlus /> Create New Course
                                            </button>
                                            <button onClick={() => setActiveTab('assessments')} className="w-full py-4 px-4 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-slate-200">
                                                <FaClipboardList /> Manage Assessments
                                            </button>
                                        </div>
                                    </div>

                                    {/* System Status or simple info */}
                                    <div className="bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm">
                                        <h3 className="text-xl font-black text-slate-900 mb-6">Platform Pulse</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-bold">Node Status</span>
                                                <span className="text-emerald-500 flex items-center gap-1.5 font-black uppercase text-xs tracking-widest">
                                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                                    Operational
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-bold">Database Nexus</span>
                                                <span className="text-emerald-500 font-black uppercase text-xs tracking-widest">Connected</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-500 font-bold">Core Version</span>
                                                <span className="text-slate-900 font-black text-xs font-mono">v1.2.0</span>
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
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900">Course Matrix</h2>
                                    <p className="text-slate-500 mt-1 font-medium">Architect your learning experiences</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate('/admin/courses/json')}
                                        className="btn bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-2 border border-slate-200 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm"
                                    >
                                        <FaPlus /> JSON Import
                                    </button>
                                    <button
                                        onClick={() => navigate('/admin/courses/new')}
                                        className="btn bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-100"
                                    >
                                        <FaPlus /> New Course
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                                            <tr>
                                                <th className="px-8 py-5">Course Structure</th>
                                                <th className="px-8 py-5">Category</th>
                                                <th className="px-8 py-5">Cohort Size</th>
                                                <th className="px-8 py-5">Clearance</th>
                                                <th className="px-8 py-5 text-right">Directives</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {courses && courses.length > 0 ? (
                                                courses.map(course => (
                                                    <tr key={course._id || course.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-8 py-6 font-bold text-slate-900 text-lg group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{course.title || 'Untitled'}</td>
                                                        <td className="px-8 py-6 text-slate-500 font-bold text-sm uppercase">{course.category || 'Uncategorized'}</td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center gap-2 font-black text-slate-900">
                                                                <FaUser className="text-xs text-indigo-400" />
                                                                {course.enrollmentCount || 0}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${course.isPublished
                                                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                                : 'bg-amber-50 text-amber-600 border border-amber-100'
                                                                }`}>
                                                                {course.isPublished ? 'Published' : 'Draft'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <div className="flex justify-end gap-3">
                                                                <AdminActionButton
                                                                    onClick={() => navigate(`/courses/${course._id || course.id}/learn?preview=true`)}
                                                                    icon={<FaEye />}
                                                                    color="blue"
                                                                    title="Sync Preview"
                                                                />
                                                                <AdminActionButton
                                                                    onClick={() => navigate(`/admin/courses/${course._id || course.id}/enrollments`)}
                                                                    icon={<FaUsers />}
                                                                    color="emerald"
                                                                    title="View Nodes"
                                                                />
                                                                <AdminActionButton
                                                                    onClick={() => navigate(`/admin/courses/${course._id || course.id}/edit`)}
                                                                    icon={<FaEdit />}
                                                                    color="indigo"
                                                                    title="Modify Matrix"
                                                                />
                                                                <AdminActionButton
                                                                    onClick={() => handleDeleteCourse(course._id || course.id)}
                                                                    icon={<FaTrash />}
                                                                    color="red"
                                                                    title="Terminate"
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                                        <FaBook className="mx-auto h-16 w-16 opacity-10 mb-6" />
                                                        Zero Matrices Detected
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
                            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
                                <h2 className="text-3xl font-black text-slate-900">Entity Registry</h2>
                                <p className="text-slate-500 mt-1 font-medium">Monitor all synchronized bio-nodes</p>
                            </div>

                            <div className="bg-white rounded-3xl border border-slate-200/60 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50/80 text-slate-500 uppercase text-[10px] font-black tracking-[0.2em]">
                                            <tr>
                                                <th className="px-8 py-5">Identify</th>
                                                <th className="px-8 py-5">Neural ID</th>
                                                <th className="px-8 py-5">Security Role</th>
                                                <th className="px-8 py-5">Initial Sync</th>
                                                <th className="px-8 py-5 text-right">Directives</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {users && users.length > 0 ? (
                                                users.map(u => (
                                                    <tr key={u._id || u.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="px-8 py-6 font-bold text-slate-900 flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                                                {u.name ? u.name.charAt(0).toUpperCase() : '?'}
                                                            </div>
                                                            {u.name || 'Unknown'}
                                                        </td>
                                                        <td className="px-8 py-6 text-slate-500 font-bold text-sm">{u.email || 'No email'}</td>
                                                        <td className="px-8 py-6">
                                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin'
                                                                ? 'bg-purple-50 text-purple-600 border border-purple-100'
                                                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                                                                }`}>
                                                                {u.role || 'user'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-xs font-black text-slate-400 font-mono">
                                                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            {u.role !== 'admin' && (
                                                                <div className="flex justify-end">
                                                                    <AdminActionButton
                                                                        onClick={() => handleDeleteUser(u._id || u.id)}
                                                                        icon={<FaTrash />}
                                                                        color="red"
                                                                        title="Purge"
                                                                    />
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-8 py-16 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                                        <FaUser className="mx-auto h-16 w-16 opacity-10 mb-6" />
                                                        Registry Empty
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
        <div className="relative group overflow-hidden bg-white rounded-3xl p-8 border border-slate-200/60 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-indigo-100 text-slate-900">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:opacity-10 transition-opacity blur-2xl`}></div>

            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-3">{title}</p>
                    <h3 className="text-5xl font-black tracking-tighter">{value}</h3>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-2xl shadow-lg ring-4 ring-white`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const AdminActionButton = ({ onClick, icon, color, title }) => {
    const colorClasses = {
        blue: 'text-blue-500 hover:bg-blue-50 hover:border-blue-200',
        emerald: 'text-emerald-500 hover:bg-emerald-50 hover:border-emerald-200',
        indigo: 'text-indigo-500 hover:bg-indigo-50 hover:border-indigo-200',
        red: 'text-red-500 hover:bg-red-50 hover:border-red-200',
    };

    return (
        <button
            onClick={onClick}
            className={`p-2.5 rounded-xl border border-transparent transition-all duration-300 transform hover:scale-110 ${colorClasses[color]}`}
            title={title}
        >
            {React.cloneElement(icon, { size: 18 })}
        </button>
    );
};

export default AdminDashboard;
