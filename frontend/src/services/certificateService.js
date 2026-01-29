import axios from 'axios';
import api from './api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const certificateService = {
  // Get user's certificates (uses auth)
  getUserCertificates: async () => {
    try {
      const response = await api.get('/certificates/');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to load certificates');
    }
  },

  // Download certificate PDF (uses auth – required by backend)
  downloadCertificate: async (certificateId) => {
    try {
      if (!certificateId) {
        throw new Error('Certificate ID is required');
      }

      console.log(`Attempting to download certificate: ${certificateId}`);

      const response = await api.get(`/certificates/${certificateId}/download`, {
        responseType: 'blob',
        timeout: 60000 // 60 second timeout for PDF generation
      });

      console.log('Download response status:', response.status);
      console.log('Download response headers:', response.headers);

      // Check if response is actually a PDF
      const contentType = response.headers['content-type'];
      if (!contentType || !contentType.includes('application/pdf')) {
        console.error('Invalid content type:', contentType);
        throw new Error('Server did not return a PDF file');
      }

      // Create blob and download
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certificateId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Clean up URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      return response.data;
    } catch (error) {
      console.error('Certificate download error:', error);

      if (error.code === 'ECONNABORTED') {
        throw new Error('Download timeout. Please try again.');
      } else if (error.response?.status === 404) {
        throw new Error('Certificate not found or you do not have permission to download it');
      } else if (error.response?.status === 403) {
        throw new Error('You are not authorized to download this certificate');
      } else if (error.response?.status === 400) {
        throw new Error(error.response?.data?.message || 'Certificate may be revoked or invalid');
      } else if (error.response?.status === 500) {
        throw new Error('Server error occurred. Please try again in a few moments.');
      }

      const errorMessage = error.response?.data?.message || error.message || 'Failed to download certificate';
      throw new Error(errorMessage);
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
      const response = await api.get(`/certificates/${certificateId}/preview`, {
        headers: { 'Accept': 'text/html' }
      });
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