import api from './api';

/**
 * Admin Service
 * Handles all admin-related API calls
 */

const adminService = {
    // Get dashboard stats
    getDashboardStats: async () => {
        const response = await api.get('/admin/stats');
        return response.data;
    },

    // Get all users
    getAllUsers: async () => {
        const response = await api.get('/admin/users');
        return response.data;
    },

    // Get user by ID
    getUserById: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },

    // Update user role
    updateUserRole: async (id, role) => {
        const response = await api.put(`/admin/users/${id}/role`, { role });
        return response.data;
    },

    // Delete user
    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    // Get all courses (including unpublished)
    getAllCourses: async () => {
        const response = await api.get('/admin/courses');
        return response.data;
    }
};

export default adminService;
