import React, { useState, useEffect } from 'react';
import { Download, Share2, Eye, Calendar, Award, BookOpen, User, ExternalLink } from 'lucide-react';
import certificateService from '../../services/certificateService';

const CertificateViewer = ({ certificateId, onClose }) => {
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadCertificate();
  }, [certificateId]);

  const loadCertificate = async () => {
    try {
      setLoading(true);
      const response = await certificateService.getCertificateDetails(certificateId);
      // Handle both direct object and nested data structure
      setCertificate(response.data || response);
    } catch (error) {
      console.error('Failed to load certificate:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await certificateService.downloadCertificate(certificateId);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      setSharing(true);
      const shareData = await certificateService.shareCertificate(certificateId);

      // Copy shareable link to clipboard
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.shareableLink);
        alert('Certificate link copied to clipboard!');
      }
    } catch (error) {
      console.error('Failed to share certificate:', error);
    } finally {
      setSharing(false);
    }
  };

  const handlePreview = async () => {
    try {
      setPreviewMode(true);
    } catch (error) {
      console.error('Failed to preview certificate:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!certificate) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Certificate not found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Certificate Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Certificate of Completion</h2>
            <p className="text-indigo-100">GenAiCourse.io</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePreview}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Preview"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={handleShare}
              disabled={sharing}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
              title="Share"
            >
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
              title="Download PDF"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Content */}
      <div className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mb-6">
            <Award className="h-12 w-12 text-white" />
          </div>

          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {certificate.userName}
          </h3>

          <p className="text-lg text-gray-600 mb-6">
            has successfully completed the course
          </p>

          <div className="bg-indigo-50 inline-block px-8 py-4 rounded-lg mb-6">
            <h4 className="text-2xl font-bold text-indigo-900">
              {certificate.courseTitle}
            </h4>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mx-auto mb-3">
              <Award className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Grade</p>
            <p className="text-xl font-bold text-gray-900">{certificate.grade}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Score</p>
            <p className="text-xl font-bold text-gray-900">{certificate.score}%</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mx-auto mb-3">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600 mb-1">Completed</p>
            <p className="text-xl font-bold text-gray-900">
              {new Date(certificate.completionDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Certificate Info */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>
              <p className="mb-1">
                <span className="font-medium">Certificate ID:</span> {certificate.certificateId}
              </p>
              <p>
                <span className="font-medium">Instructor:</span> {certificate.instructorName}
              </p>
            </div>
            <div className="text-right">
              <p className="mb-1">
                <span className="font-medium">Verification:</span> Available
              </p>
              <a
                href={`/verify/${certificate.certificateId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-700 flex items-center"
              >
                Verify Online
                <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 px-8 py-4 flex justify-between">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
        >
          Close
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleShare}
            disabled={sharing}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>{sharing ? 'Sharing...' : 'Share'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'Downloading...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Certificate Preview</h3>
              <button
                onClick={() => setPreviewMode(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              <iframe
                src={`/api/certificates/${certificateId}/preview`}
                className="w-full h-full border-0"
                style={{ minHeight: '600px' }}
                title="Certificate Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateViewer;