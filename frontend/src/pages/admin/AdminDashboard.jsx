import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
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
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [statsData, coursesData, usersData] = await Promise.all([
                adminService.getDashboardStats(),
                adminService.getAllCourses(),
                adminService.getAllUsers()
            ]);

            setStats(statsData.data);
            setCourses(coursesData.data);
            setUsers(usersData.data);
        } catch (error) {
            toast.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

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
                <h1 className="text-3xl font-bold mb-8 text-white">Admin Dashboard</h1>

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
                {activeTab === 'overview' && stats && (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            <StatCard title="Total Users" value={stats.overview.totalUsers} icon={<FaUser />} color="indigo" />
                            <StatCard title="Total Courses" value={stats.overview.totalCourses} icon={<FaBook />} color="emerald" />
                            <StatCard title="Total Enrollments" value={stats.overview.totalEnrollments} icon={<FaBook />} color="pink" />
                            <StatCard title="Published" value={stats.overview.publishedCourses} icon={<FaBook />} color="blue" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="card p-6 bg-slate-800 border-none">
                                <h3 className="text-xl font-bold mb-4">Popular Courses</h3>
                                <ul className="space-y-4">
                                    {stats.popularCourses.map((course, idx) => (
                                        <li key={idx} className="flex justify-between items-center border-b border-slate-700 pb-2">
                                            <span>{course.title}</span>
                                            <span className="bg-slate-700 px-2 py-1 rounded text-sm">{course.enrollmentCount} students</span>
                                        </li>
                                    ))}
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
                            <button
                                onClick={() => navigate('/admin/courses/new')}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <FaPlus /> New Course
                            </button>
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
                                    {courses.map(course => (
                                        <tr key={course._id} className="hover:bg-slate-800 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{course.title}</td>
                                            <td className="px-6 py-4">{course.category}</td>
                                            <td className="px-6 py-4">{course.enrollmentCount}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs ${course.isPublished ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                    {course.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                             <td className="px-6 py-4 flex space-x-3">
                                                 <button
                                                     onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                                                     className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                                 >
                                                     <FaEdit /> Edit
                                                 </button>
                                                 <button
                                                     onClick={() => handleDeleteCourse(course._id)}
                                                     className="text-red-400 hover:text-red-300 flex items-center gap-1"
                                                 >
                                                     <FaTrash /> Delete
                                                 </button>
                                             </td>
                                        </tr>
                                    ))}
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
                                    {users.map(u => (
                                        <tr key={u._id} className="hover:bg-slate-800 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                                            <td className="px-6 py-4">{u.email}</td>
                                            <td className="px-6 py-4 capitalize">{u.role}</td>
                                            <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                {u.role !== 'admin' && (
                                                    <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-300">
                                                        <FaTrash />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => (
    <div className="card p-6 bg-slate-800 border-none flex items-center">
        <div className={`w-12 h-12 rounded-lg bg-${color}-500/10 flex items-center justify-center text-${color}-500 mr-4 text-2xl`}>
            {icon}
        </div>
        <div>
            <div className="text-gray-400 text-sm">{title}</div>
            <div className="text-2xl font-bold text-white">{value}</div>
        </div>
    </div>
);

export default AdminDashboard;
