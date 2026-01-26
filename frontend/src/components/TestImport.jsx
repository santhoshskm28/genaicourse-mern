import React from 'react';
import assessmentUploadService from '../../services/assessmentUploadService';

console.log('assessmentUploadService:', assessmentUploadService);

const TestImport = () => {
  return (
    <div className="p-4">
      <h2>Import Test Component</h2>
      <p>Check console for service details</p>
    </div>
  );
};

export default TestImport;