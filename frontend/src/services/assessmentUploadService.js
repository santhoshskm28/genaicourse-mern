import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const assessmentUploadService = {
  // Upload assessment from JSON data
  uploadAssessment: async (assessmentData, courseId = null) => {
    try {
      const response = await axios.post(
        `${API_URL}/assessments/upload`,
        { assessmentData, courseId }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload assessment');
    }
  },

  // Import assessment from file
  importFromFile: async (file, courseId = null) => {
    try {
      const formData = new FormData();
      formData.append('assessmentFile', file);
      if (courseId) {
        formData.append('courseId', courseId);
      }

      const response = await axios.post(
        `${API_URL}/assessments/import-file`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to import assessment');
    }
  },

  // Get assessment template
  getTemplate: async () => {
    try {
      const response = await axios.get(`${API_URL}/assessments/template`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get template');
    }
  },

  // Get instructor's assessments
  getInstructorAssessments: async () => {
    try {
      const response = await axios.get(`${API_URL}/assessments/instructor`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get assessments');
    }
  },

  // Update assessment
  updateAssessment: async (assessmentId, updates) => {
    try {
      const response = await axios.put(
        `${API_URL}/assessments/${assessmentId}`,
        updates
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update assessment');
    }
  },

  // Delete assessment
  deleteAssessment: async (assessmentId) => {
    try {
      const response = await axios.delete(`${API_URL}/assessments/${assessmentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete assessment');
    }
  }
};

export default assessmentUploadService;