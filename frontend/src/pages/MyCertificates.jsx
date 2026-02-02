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
    if (grade.includes('A')) return 'bg-emerald-100 text-emerald-700';
    if (grade.includes('B')) return 'bg-blue-100 text-blue-700';
    if (grade.includes('C')) return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading certificates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-12 section-pt">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-black text-brand mb-2">My Certificates</h1>
          <p className="text-gray-500 font-medium">View and download your course completion certificates</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search certificates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none text-brand placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-accent focus:border-accent outline-none text-brand"
              >
                <option value="all">All Certificates</option>
                <option value="recent">Recent (30 days)</option>
                <option value="excellent">Excellent (A+ or A)</option>
              </select>

              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-brand' : 'text-gray-500'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-brand' : 'text-gray-500'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates */}
        {filteredCertificates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand mb-2">No certificates found</h3>
            <p className="text-gray-500">
              {certificates.length === 0
                ? "Complete courses to earn certificates"
                : "Try adjusting your search or filters"}
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCertificates.map((certificate) => (
                  <div key={certificate._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                      <div className="flex justify-between items-start relative z-10">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Award className="h-6 w-6 text-white" />
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${getGradeColor(certificate.grade)}`}>
                          {certificate.grade || 'Pass'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-bold text-brand text-lg mb-3 line-clamp-2">
                        {certificate.courseTitle}
                      </h3>

                      <div className="space-y-3 text-sm text-gray-500 mb-6 font-medium">
                        <div className="flex justify-between border-b border-gray-50 pb-2">
                          <span>Score:</span>
                          <span className="font-bold text-brand">{certificate.score}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Completed:</span>
                          <span className="font-bold text-brand">
                            {new Date(certificate.completionDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => setSelectedCertificate(certificate._id)}
                          className="flex-1 px-4 py-2.5 bg-brand text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-slate-900/10"
                        >
                          <Eye className="h-4 w-4" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => handleDownload(certificate._id)}
                          className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Completed
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {filteredCertificates.map((certificate) => (
                        <tr key={certificate._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-bold text-brand">
                                {certificate.courseTitle}
                              </div>
                              <div className="text-xs text-gray-400 font-medium mt-0.5">
                                ID: {certificate.certificateId}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${getGradeColor(certificate.grade)}`}>
                              {certificate.grade || 'Pass'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-600">
                            {certificate.score}%
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-600">
                            {new Date(certificate.completionDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedCertificate(certificate._id)}
                                className="p-2 text-indigo-600 hover:text-indigo-800 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDownload(certificate._id)}
                                className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">
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