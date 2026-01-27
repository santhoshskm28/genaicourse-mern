import api from './api';

const assessmentService = {
  // Get assessment details for a course
  getAssessment: async (courseId) => {
    try {
      const response = await api.get(`/assessments/${courseId}/quiz`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load assessment');
    }
  },

  // Submit assessment
  submitAssessment: async (courseId, assessmentData) => {
    try {
      const response = await api.post(
        `/assessments/${courseId}/take`,
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
      const response = await api.get(
        `/assessments/${courseId}/results/${attemptId}`
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load results');
    }
  },

  // Get assessment history
  getHistory: async (courseId) => {
    try {
      const response = await api.get(`/assessments/${courseId}/history`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load assessment history');
    }
  },

  // Check if assessment is available for course
  checkAssessmentAvailability: async (courseId) => {
    try {
      const response = await api.get(`/assessments/${courseId}/check`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to check assessment availability');
    }
  }
};

export default assessmentService;