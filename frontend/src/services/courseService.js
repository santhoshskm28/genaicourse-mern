import api from './api';

const courseService = {
    getAllCourses: async (params = {}) => {
        const response = await api.get('/api/courses', { params });
        return response.data;
    },
    getCourse: async (id) => {
        const response = await api.get(`/api/courses/${id}`);
        return response.data;
    },
    enrollCourse: async (id) => {
        const response = await api.post(`/api/courses/${id}/enroll`);
        return response.data;
    },
    getCourseProgress: async (id) => {
        const response = await api.get(`/api/courses/${id}/progress`);
        return response.data;
    },
    updateCourseProgress: async (id, progressData) => {
        const response = await api.put(`/api/courses/${id}/progress`, progressData);
        return response.data;
    }
};

export default courseService;
