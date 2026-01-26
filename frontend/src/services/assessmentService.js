import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const assessmentService = {
  // Get assessment details for a course
  getAssessment: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/assessments/${courseId}/quiz`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load assessment');
    }
  },

  // Submit assessment
  submitAssessment: async (courseId, assessmentData) => {
    try {
      const response = await axios.post(
        `${API_URL}/assessments/${courseId}/take`,
        assessmentData
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit assessment');
    }
  },

  // Get assessment results
  getResults: async (courseId, attemptId) => {
    try {
      const response = await axios.get(
        `${API_URL}/assessments/${courseId}/results/${attemptId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load results');
    }
  },

  // Get assessment history
  getHistory: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/assessments/${courseId}/history`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load assessment history');
    }
  },

  // Check if assessment is available for course
  checkAssessmentAvailability: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/assessments/${courseId}/check`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check assessment availability');
    }
  }
};

export default assessmentService;