import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
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
import AdminCourseEnrollments from './pages/admin/AdminCourseEnrollments';



const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader />;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AppContent />
            </Router>
        </AuthProvider>
    );
};

import ScrollToTop from './components/common/ScrollToTop';

const AppContent = () => {
    const location = useLocation();

    // Pages that should not show the standard navbar
    const hideNavbarPaths = [
        '/learn',
        '/lessons/',
        '/assessment'
    ];

    const shouldHideNavbar = hideNavbarPaths.some(path => location.pathname.includes(path));

    return (
        <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans selection:bg-indigo-600 selection:text-white transition-colors duration-500">
            <ScrollToTop />
            {!shouldHideNavbar && <Navbar />}
            <main className="relative">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<PageContainer><Home /></PageContainer>} />
                        <Route path="/courses" element={<PageContainer><CourseCatalogue /></PageContainer>} />
                        <Route path="/courses/:id" element={<PageContainer><CourseDetail /></PageContainer>} />
                        <Route path="/courses/:id/learn" element={<PageContainer><CourseViewer /></PageContainer>} />
                        <Route path="/courses/:id/enroll" element={<PageContainer><CourseEnrollment /></PageContainer>} />
                        <Route path="/courses/:id/access" element={<PageContainer><CourseAccess /></PageContainer>} />
                        <Route path="/courses/:id/assessment" element={<PageContainer><AssessmentCenter /></PageContainer>} />
                        <Route path="/courses/:courseId/lessons/:lessonId" element={<PageContainer><LessonPlayer /></PageContainer>} />
                        <Route path="/pricing" element={<PageContainer><Pricing /></PageContainer>} />
                        <Route path="/login" element={<PageContainer><Login /></PageContainer>} />
                        <Route path="/register" element={<PageContainer><Register /></PageContainer>} />
                        <Route path="/how-it-works" element={<PageContainer><HowItWorks /></PageContainer>} />

                        <Route element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<PageContainer><Dashboard /></PageContainer>} />
                        </Route>

                        {/* Admin Routes */}
                        <Route element={<AdminRoute />}>
                            <Route path="/admin/dashboard" element={<PageContainer><AdminDashboard /></PageContainer>} />
                            <Route path="/admin/courses/new" element={<PageContainer><CourseForm /></PageContainer>} />
                            <Route path="/admin/courses/json" element={<PageContainer><AdminJSONUpload /></PageContainer>} />
                            <Route path="/admin/courses/:id/edit" element={<PageContainer><CourseForm isEditing={true} /></PageContainer>} />
                            <Route path="/admin/courses/:id/enrollments" element={<PageContainer><AdminCourseEnrollments /></PageContainer>} />
                        </Route>
                    </Routes>
                </AnimatePresence>
            </main>
            <Footer />

            <ToastContainer
                position="bottom-right"
                theme="light"
                toastClassName="bg-white text-slate-900 border border-slate-100 shadow-2xl rounded-2xl"
            />
        </div>
    );
};

const PageContainer = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
        {children}
    </motion.div>
);

export default App;
