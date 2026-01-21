import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import HowItWorks from './pages/HowItWorks';
import CourseCatalogue from './pages/CourseCatalogue';
import CourseDetail from './pages/CourseDetail';
import CourseViewer from './pages/CourseViewer';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Styles
import './index.css';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen bg-dark text-white">
                    <Navbar />

                    <main className="flex-grow">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/how-it-works" element={<HowItWorks />} />
                            <Route path="/courses" element={<CourseCatalogue />} />
                            <Route path="/courses/:id" element={<CourseDetail />} />

                            {/* Protected User Routes */}
                            <Route element={<PrivateRoute />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/courses/:id/learn" element={<CourseViewer />} />
                            </Route>

                            {/* Admin Routes */}
                            <Route element={<AdminRoute />}>
                                <Route path="/admin" element={<AdminDashboard />} />
                            </Route>
                        </Routes>
                    </main>

                    <Footer />

                    <ToastContainer
                        position="bottom-right"
                        theme="dark"
                        autoClose={3000}
                    />
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
