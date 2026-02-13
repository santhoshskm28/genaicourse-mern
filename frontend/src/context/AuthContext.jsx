import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = authService.getStoredUser();
        const token = authService.getToken();

        if (storedUser && token) {
            setUser(storedUser);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            throw error;
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            const data = await authService.register(userData);
            setUser(data.data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            throw error;
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    const handleOAuthSuccess = useCallback(async (token) => {
        try {
            localStorage.setItem('token', token);
            const data = await authService.getCurrentUser();
            setUser(data.data);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(data.data));
            return data.data;
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            throw error;
        }
    }, []);

    const updateUser = useCallback((userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    }, []);

    const value = {
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        handleOAuthSuccess,
        updateUser,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
