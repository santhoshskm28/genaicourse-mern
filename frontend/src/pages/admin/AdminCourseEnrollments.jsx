import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { FaUser, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AdminCourseEnrollments = () => {
    const { id } = useParams();
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseTitle, setCourseTitle] = useState('');

    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                // Get course details first for the title
                try {
                    const courseData = await adminService.getCourse(id);
                    setCourseTitle(courseData.data.title);
                } catch (err) {
                    console.error('Failed to load course details', err);
                    setCourseTitle('Course');
                }

                const data = await adminService.getCourseEnrollments(id);
                setEnrollments(data.data || []);
            } catch (error) {
                console.error('Error fetching enrollments:', error);
                toast.error('Failed to load enrollments');
            } finally {
                setLoading(false);
            }
        };

        fetchEnrollments();
    }, [id]);

    if (loading) return <Loader />;

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans p-6 pt-28">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-8 flex items-center gap-4">
                    <Link to="/admin/dashboard" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">Student Enrollments</h1>
                        <p className="text-slate-400 mt-1">
                            {courseTitle} • {enrollments.length} Students
                        </p>
                    </div>
                </div>

                <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-slate-400">
                            <thead className="bg-slate-900/50 text-slate-200 uppercase text-xs font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Enrolled Date</th>
                                    <th className="px-6 py-4">Progress</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {enrollments.length > 0 ? (
                                    enrollments.map((enrollment, index) => (
                                        <tr key={index} className="hover:bg-slate-700/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                                                    {enrollment.userId?.name ? enrollment.userId.name.charAt(0).toUpperCase() : <FaUser />}
                                                </div>
                                                {enrollment.userId?.name || 'Unknown User'}
                                            </td>
                                            <td className="px-6 py-4">{enrollment.userId?.email || 'No email'}</td>
                                            <td className="px-6 py-4 text-sm font-mono">
                                                {new Date(enrollment.enrolledAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-24 bg-slate-700 rounded-full h-2">
                                                        <div
                                                            className="bg-indigo-500 h-2 rounded-full"
                                                            style={{ width: `${enrollment.progress || 0}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs font-bold">{enrollment.progress || 0}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {enrollment.isCompleted ? (
                                                    <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit">
                                                        <FaCheckCircle /> Completed
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1.5 text-amber-400 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 w-fit">
                                                        <FaClock /> In Progress
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {enrollment.lastAccessedAt ? new Date(enrollment.lastAccessedAt).toLocaleDateString() : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                                            <FaUser className="mx-auto h-12 w-12 opacity-20 mb-3" />
                                            No students enrolled yet
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminCourseEnrollments;
