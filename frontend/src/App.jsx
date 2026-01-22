import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Loader from './components/common/Loader';
import APIStatus from './components/common/APIStatus';

// Page Imports
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseCatalogue from './pages/CourseCatalogue';
import CourseDetail from './pages/CourseDetail';
import CourseViewer from './pages/CourseViewer';
import HowItWorks from './pages/HowItWorks';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <Loader />;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-primary selection:text-white">
                    <Navbar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/courses" element={<CourseCatalogue />} />
                            <Route path="/courses/:id" element={<CourseDetail />} />
                            <Route path="/courses/:id/learn" element={<CourseViewer />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/how-it-works" element={<HowItWorks />} />

                            <Route element={<PrivateRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
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
