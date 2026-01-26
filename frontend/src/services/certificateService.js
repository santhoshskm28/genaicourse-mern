import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const certificateService = {
  // Get user's certificates
  getUserCertificates: async () => {
    try {
      const response = await axios.get(`${API_URL}/certificates/`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load certificates');
    }
  },

  // Download certificate PDF
  downloadCertificate: async (certificateId) => {
    try {
      const response = await axios.get(
        `${API_URL}/certificates/${certificateId}/download`,
        { 
          responseType: 'blob' 
        }
      );
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to download certificate');
    }
  },

  // Get certificate details
  getCertificateDetails: async (certificateId) => {
    try {
      const response = await axios.get(`${API_URL}/certificates/${certificateId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load certificate details');
    }
  },

  // Verify certificate (public endpoint)
  verifyCertificate: async (certificateId) => {
    try {
      const response = await axios.get(`${API_URL}/certificates/verify/${certificateId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify certificate');
    }
  },

  // Preview certificate (returns HTML or image)
  previewCertificate: async (certificateId) => {
    try {
      const response = await axios.get(`${API_URL}/certificates/${certificateId}/preview`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to preview certificate');
    }
  },

  // Share certificate (get shareable link)
  shareCertificate: async (certificateId) => {
    try {
      const response = await axios.post(`${API_URL}/certificates/${certificateId}/share`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to share certificate');
    }
  }
};

export default certificateService;