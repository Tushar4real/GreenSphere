import React, { useState } from 'react';
import { FiUpload, FiDownload, FiX, FiUsers, FiCheck, FiAlertCircle } from 'react-icons/fi';
import apiService from '../../services/apiService';
import './BulkUserManager.css';

const BulkUserManager = ({ onClose, onBulkAction }) => {
  const [activeTab, setActiveTab] = useState('import');
  const [csvFile, setCsvFile] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [importResults, setImportResults] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        const data = rows.slice(1).filter(row => row.length === headers.length).map(row => {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header.trim()] = row[index]?.trim();
          });
          return obj;
        });
        setCsvData(data);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  const handleImport = async () => {
    try {
      const validUsers = csvData.filter(user => 
        user.name && user.email && user.role
      );
      
      const response = await apiService.bulkUser.importUsers(validUsers);
      const results = response.data.results;
      
      setImportResults(results);
      
      // Call parent callback
      if (onBulkAction) {
        onBulkAction('import', validUsers);
      }
    } catch (error) {
      console.error('Import error:', error);
      alert(`Error importing users: ${error.response?.data?.error || error.message}`);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'name,email,role,school\nJohn Doe,john@example.com,student,Green Valley High\nJane Smith,jane@example.com,teacher,Green Valley High';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'user_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportUsers = async () => {
    try {
      const params = {
        role: document.querySelector('select[name="role"]')?.value || 'all',
        dateRange: document.querySelector('select[name="dateRange"]')?.value || 'all',
        includeFields: Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
          .map(cb => cb.value).join(',')
      };
      
      const response = await apiService.bulkUser.exportUsers(params);
      const users = response.data.data;
      
      // Convert to CSV
      const headers = Object.keys(users[0] || {});
      const csvContent = [
        headers.join(','),
        ...users.map(user => headers.map(header => user[header] || '').join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export error:', error);
      alert(`Error exporting users: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className="bulk-user-overlay">
      <div className="bulk-user-modal">
        <div className="modal-header">
          <h2>Bulk User Management</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="bulk-tabs">
          <button 
            className={`tab ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <FiUpload /> Import Users
          </button>
          <button 
            className={`tab ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <FiDownload /> Export Users
          </button>
        </div>

        <div className="modal-content">
          {activeTab === 'import' && (
            <div className="import-section">
              <div className="upload-area">
                <div className="upload-icon">
                  <FiUpload size={48} />
                </div>
                <h3>Import Users from CSV</h3>
                <p>Upload a CSV file to bulk import users into the system</p>
                
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="file-input"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="upload-btn">
                  Choose CSV File
                </label>
                
                <button className="template-btn" onClick={downloadTemplate}>
                  <FiDownload /> Download Template
                </button>
              </div>

              {csvFile && (
                <div className="file-preview">
                  <h4>File Preview: {csvFile.name}</h4>
                  <div className="preview-stats">
                    <span>Total Records: {csvData.length}</span>
                    <span>Valid Records: {csvData.filter(u => u.name && u.email).length}</span>
                  </div>
                  
                  {csvData.length > 0 && (
                    <div className="preview-table">
                      <div className="table-header">
                        <span>Name</span>
                        <span>Email</span>
                        <span>Role</span>
                        <span>School</span>
                      </div>
                      {csvData.slice(0, 5).map((user, index) => (
                        <div key={index} className="table-row">
                          <span>{user.name || 'Missing'}</span>
                          <span>{user.email || 'Missing'}</span>
                          <span>{user.role || 'Missing'}</span>
                          <span>{user.school || 'Not specified'}</span>
                        </div>
                      ))}
                      {csvData.length > 5 && (
                        <div className="more-rows">
                          +{csvData.length - 5} more rows
                        </div>
                      )}
                    </div>
                  )}
                  
                  <button className="import-btn" onClick={handleImport}>
                    <FiUsers /> Import {csvData.length} Users
                  </button>
                </div>
              )}

              {importResults && (
                <div className="import-results">
                  <h4>Import Results</h4>
                  <div className="results-stats">
                    <div className="stat success">
                      <FiCheck />
                      <span>{importResults.successful} Successful</span>
                    </div>
                    <div className="stat error">
                      <FiAlertCircle />
                      <span>{importResults.failed} Failed</span>
                    </div>
                  </div>
                  
                  {importResults.errors.length > 0 && (
                    <div className="error-details">
                      <h5>Failed Records:</h5>
                      {importResults.errors.map((error, index) => (
                        <div key={index} className="error-item">
                          Row {index + 2}: Missing required fields
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <div className="export-section">
              <div className="export-options">
                <h3>Export User Data</h3>
                <p>Download user data in CSV format for backup or analysis</p>
                
                <div className="export-filters">
                  <div className="filter-group">
                    <label>User Role:</label>
                    <select name="role">
                      <option value="all">All Users</option>
                      <option value="student">Students Only</option>
                      <option value="teacher">Teachers Only</option>
                      <option value="admin">Admins Only</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>Date Range:</label>
                    <select name="dateRange">
                      <option value="all">All Time</option>
                      <option value="30d">Last 30 Days</option>
                      <option value="90d">Last 90 Days</option>
                      <option value="1y">Last Year</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>Include Fields:</label>
                    <div className="checkbox-group">
                      <label><input type="checkbox" value="basic" defaultChecked /> Basic Info</label>
                      <label><input type="checkbox" value="points" defaultChecked /> Points & Level</label>
                      <label><input type="checkbox" value="activity" /> Activity Data</label>
                      <label><input type="checkbox" value="badges" /> Badge Information</label>
                    </div>
                  </div>
                </div>
                
                <button className="export-btn" onClick={exportUsers}>
                  <FiDownload /> Export Users CSV
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BulkUserManager;