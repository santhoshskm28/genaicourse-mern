import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Calendar, Award, Filter, Grid, List } from 'lucide-react';
import certificateService from '../../services/certificateService';
import CertificateViewer from './CertificateViewer';

const MyCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await certificateService.getUserCertificates();
      // Handle both direct array and nested data structure
      setCertificates(response.certificates || response.data?.certificates || response);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certificateId) => {
    try {
      await certificateService.downloadCertificate(certificateId);
    } catch (error) {
      console.error('Failed to download certificate:', error);
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.userName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'recent' && isRecent(cert.completionDate)) ||
                         (filter === 'excellent' && cert.grade && ['A+', 'A'].includes(cert.grade));
    
    return matchesSearch && matchesFilter;
  });

  const isRecent = (date) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return new Date(date) > thirtyDaysAgo;
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-700';
    if (grade.includes('A')) return 'bg-green-100 text-green-700';
    if (grade.includes('B')) return 'bg-blue-100 text-blue-700';
    if (grade.includes('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
          <p className="text-gray-600">View and download your course completion certificates</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">All Certificates</option>
                <option value="recent">Recent (30 days)</option>
                <option value="excellent">Excellent (A+ or A)</option>
              </select>
              
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates */}
        {filteredCertificates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
            <p className="text-gray-600">
              {certificates.length === 0 
                ? "Complete courses to earn certificates" 
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCertificates.map((certificate) => (
                  <div key={certificate._id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                      <div className="flex justify-between items-start">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getGradeColor(certificate.grade)}`}>
                          {certificate.grade || 'Pass'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {certificate.courseTitle}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex justify-between">
                          <span>Score:</span>
                          <span className="font-medium">{certificate.score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completed:</span>
                          <span className="font-medium">
                            {new Date(certificate.completionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedCertificate(certificate._id)}
                          className="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 flex items-center justify-center space-x-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(certificate._id)}
                          className="px-3 py-2 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 flex items-center justify-center"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Completed
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCertificates.map((certificate) => (
                        <tr key={certificate._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {certificate.courseTitle}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {certificate.certificateId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getGradeColor(certificate.grade)}`}>
                              {certificate.grade || 'Pass'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {certificate.score}%
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {new Date(certificate.completionDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedCertificate(certificate._id)}
                                className="p-1 text-indigo-600 hover:text-indigo-700"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDownload(certificate._id)}
                                className="p-1 text-gray-600 hover:text-gray-700"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* Certificate Viewer Modal */}
        {selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CertificateViewer
                certificateId={selectedCertificate}
                onClose={() => setSelectedCertificate(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCertificates;