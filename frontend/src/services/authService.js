import api from './api';

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.success && response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },
    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        if (response.data.success) {
            localStorage.setItem('user', JSON.stringify(response.data.data));
        }
        return response.data;
    },
    getStoredUser: () => {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error("Error parsing stored user:", error);
            localStorage.removeItem('user'); // Clean up corrupt data
            return null;
        }
    },
    getToken: () => localStorage.getItem('token')
};

export default authService;
