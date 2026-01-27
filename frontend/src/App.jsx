import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import APIStatus from './components/common/APIStatus';
import AdminRoute from './components/routing/AdminRoute';

// Page Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseCatalogue from './pages/CourseCatalogue';
import CourseDetail from './pages/CourseDetail';
import CourseViewer from './pages/CourseViewer';
import CourseEnrollment from './pages/CourseEnrollment';
import CourseAccess from './pages/CourseAccess';
import CourseReadingProgress from './components/courses/CourseReadingProgress';
import LessonPlayer from './components/lessons/LessonPlayer';
import HowItWorks from './pages/HowItWorks';
import Pricing from './pages/Pricing';
import AssessmentCenter from './components/assessment/AssessmentCenter';

// Admin Imports
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseForm from './pages/admin/CourseForm';
import AdminJSONUpload from './pages/admin/AdminJSONUpload';



const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader />;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-primary selection:text-white">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/courses" element={<CourseCatalogue />} />
                            <Route path="/courses/:id" element={<CourseDetail />} />
                            <Route path="/courses/:id/learn" element={<CourseViewer />} />
                            <Route path="/courses/:id/enroll" element={<CourseEnrollment />} />
                            <Route path="/courses/:id/access" element={<CourseAccess />} />
                            <Route path="/courses/:id/assessment" element={<AssessmentCenter />} />
                            {/* <Route path="/courses/:courseId/lessons/:lessonId" element={<CourseReadingProgress />} /> */}
                            <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonPlayer />} />
                            <Route path="/pricing" element={<Pricing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/how-it-works" element={<HowItWorks />} />

                            <Route element={<PrivateRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route element={<AdminRoute />}>
                                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                <Route path="/admin/courses/new" element={<CourseForm />} />
                                <Route path="/admin/courses/json" element={<AdminJSONUpload />} />
                                <Route path="/admin/courses/:id/edit" element={<CourseForm isEditing={true} />} />
                            </Route>
                        </Routes>
                    </main>
                    <Footer />

                    <ToastContainer
                        position="bottom-right"
                        theme="dark"
                        toastClassName="bg-slate-800 text-white font-sans"
                    />

                    {/* API Connection Status - Development Only */}
                    {import.meta.env.DEV && <APIStatus />}
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
