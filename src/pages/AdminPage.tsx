import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApplicationService } from '../services/ApplicationService';
import { Application, ApplicationStatus, UserRole } from '../types';
import { Search, CheckCircle, XCircle, Clock, Filter, FileText, User, ChevronRight, ChevronDown } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<ApplicationStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!user || user.role !== UserRole.ADMIN) {
      navigate('/login');
      return;
    }
    
    // Load applications
    const loadApplications = () => {
      const allApplications = ApplicationService.getAllApplications();
      setApplications(allApplications);
      setLoading(false);
    };
    
    loadApplications();
  }, [user, navigate]);

  const handleStatusChange = (applicationId: string, newStatus: ApplicationStatus) => {
    const updatedApp = ApplicationService.updateApplicationStatus(applicationId, newStatus);
    if (updatedApp) {
      setApplications(applications.map(app => app.id === applicationId ? updatedApp : app));
      
      if (selectedApp && selectedApp.id === applicationId) {
        setSelectedApp(updatedApp);
      }
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'ALL' || app.status === filter;
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.includes(searchTerm);
    
    return matchesFilter && matchesSearch;
  });

  const statusCount = {
    ALL: applications.length,
    [ApplicationStatus.UNDER_REVIEW]: applications.filter(app => app.status === ApplicationStatus.UNDER_REVIEW).length,
    [ApplicationStatus.ACCEPTED]: applications.filter(app => app.status === ApplicationStatus.ACCEPTED).length,
    [ApplicationStatus.REJECTED]: applications.filter(app => app.status === ApplicationStatus.REJECTED).length,
  };

  const getStatusBadgeClass = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.UNDER_REVIEW:
        return 'bg-yellow-100 text-yellow-800';
      case ApplicationStatus.ACCEPTED:
        return 'bg-green-100 text-green-800';
      case ApplicationStatus.REJECTED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.UNDER_REVIEW:
        return <Clock className="mr-1" size={16} />;
      case ApplicationStatus.ACCEPTED:
        return <CheckCircle className="mr-1" size={16} />;
      case ApplicationStatus.REJECTED:
        return <XCircle className="mr-1" size={16} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#800000] mx-auto mb-4"></div>
          <p className="text-lg">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#003366] text-white py-4 px-6">
            <h2 className="text-2xl font-bold">Admissions Dashboard</h2>
          </div>
          
          {/* Status Filters */}
          <div className="grid grid-cols-4 divide-x">
            <button
              onClick={() => setFilter('ALL')}
              className={`py-4 flex flex-col items-center ${filter === 'ALL' ? 'bg-blue-50 border-b-2 border-[#003366]' : 'bg-white hover:bg-gray-50'}`}
            >
              <span className="text-2xl font-bold text-gray-700">{statusCount.ALL}</span>
              <span className="text-sm text-gray-500">All Applications</span>
            </button>
            
            <button
              onClick={() => setFilter(ApplicationStatus.UNDER_REVIEW)}
              className={`py-4 flex flex-col items-center ${filter === ApplicationStatus.UNDER_REVIEW ? 'bg-yellow-50 border-b-2 border-yellow-500' : 'bg-white hover:bg-gray-50'}`}
            >
              <span className="text-2xl font-bold text-yellow-600">{statusCount[ApplicationStatus.UNDER_REVIEW]}</span>
              <span className="text-sm text-gray-500">Under Review</span>
            </button>
            
            <button
              onClick={() => setFilter(ApplicationStatus.ACCEPTED)}
              className={`py-4 flex flex-col items-center ${filter === ApplicationStatus.ACCEPTED ? 'bg-green-50 border-b-2 border-green-500' : 'bg-white hover:bg-gray-50'}`}
            >
              <span className="text-2xl font-bold text-green-600">{statusCount[ApplicationStatus.ACCEPTED]}</span>
              <span className="text-sm text-gray-500">Accepted</span>
            </button>
            
            <button
              onClick={() => setFilter(ApplicationStatus.REJECTED)}
              className={`py-4 flex flex-col items-center ${filter === ApplicationStatus.REJECTED ? 'bg-red-50 border-b-2 border-red-500' : 'bg-white hover:bg-gray-50'}`}
            >
              <span className="text-2xl font-bold text-red-600">{statusCount[ApplicationStatus.REJECTED]}</span>
              <span className="text-sm text-gray-500">Rejected</span>
            </button>
          </div>
          
          {/* Search and Filter */}
          <div className="p-4 bg-gray-50 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                />
              </div>
              
              <div className="flex items-center">
                <Filter className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600 mr-2">Filter:</span>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as ApplicationStatus | 'ALL')}
                  className="border border-gray-300 rounded-md leading-5 bg-white py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000]"
                >
                  <option value="ALL">All Applications</option>
                  <option value={ApplicationStatus.UNDER_REVIEW}>Under Review</option>
                  <option value={ApplicationStatus.ACCEPTED}>Accepted</option>
                  <option value={ApplicationStatus.REJECTED}>Rejected</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Applications List */}
          <div className="overflow-hidden">
            {filteredApplications.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No applications found matching your criteria</p>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row">
                {/* Applications List */}
                <div className={`w-full ${showDetails && selectedApp ? 'md:w-1/2 border-r' : 'md:w-full'}`}>
                  <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Applicant
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Program
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date Applied
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredApplications.map((app) => (
                          <tr 
                            key={app.id}
                            className={`hover:bg-gray-50 cursor-pointer ${selectedApp && selectedApp.id === app.id ? 'bg-blue-50' : ''}`}
                            onClick={() => {
                              setSelectedApp(app);
                              setShowDetails(true);
                            }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-500" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{app.fullName}</div>
                                  <div className="text-sm text-gray-500">{app.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{app.program}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(app.status)}`}>
                                {getStatusIcon(app.status)}
                                {app.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <button 
                                className="text-[#003366] hover:text-[#001a33]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedApp(app);
                                  setShowDetails(true);
                                }}
                              >
                                <ChevronRight className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Application Details */}
                {showDetails && selectedApp && (
                  <div className={`w-full md:w-1/2 bg-white overflow-y-auto max-h-[calc(100vh-250px)]`}>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold">Application Details</h3>
                        <button 
                          className="text-gray-500 hover:text-gray-700 md:hidden"
                          onClick={() => setShowDetails(false)}
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <div className="mb-6">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedApp.status)}`}>
                          {getStatusIcon(selectedApp.status)}
                          {selectedApp.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="space-y-6">
                        {/* Applicant Information */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Applicant Information
                          </h4>
                          <div className="bg-gray-50 rounded-md p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500">Full Name</p>
                                <p className="font-medium">{selectedApp.fullName}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-medium">{selectedApp.email}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Phone</p>
                                <p className="font-medium">{selectedApp.phone}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Date of Birth</p>
                                <p className="font-medium">{selectedApp.dateOfBirth}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-xs text-gray-500">Address</p>
                                <p className="font-medium">{selectedApp.address}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Program Details */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Program Details
                          </h4>
                          <div className="bg-gray-50 rounded-md p-4">
                            <div>
                              <p className="text-xs text-gray-500">Applied Program</p>
                              <p className="font-medium">{selectedApp.program}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Educational Background */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Educational Background
                          </h4>
                          <div className="bg-gray-50 rounded-md p-4">
                            {selectedApp.previousEducation.map((edu, index) => (
                              <div key={index} className={index > 0 ? 'mt-4 pt-4 border-t border-gray-200' : ''}>
                                <p className="text-sm font-medium mb-2">Education {index + 1}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div>
                                    <p className="text-xs text-gray-500">Institution</p>
                                    <p className="font-medium">{edu.institution}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Degree</p>
                                    <p className="font-medium">{edu.degree}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">Graduation Year</p>
                                    <p className="font-medium">{edu.gradYear}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">CGPA/Percentage</p>
                                    <p className="font-medium">{edu.percentage}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Statement of Purpose */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Statement of Purpose
                          </h4>
                          <div className="bg-gray-50 rounded-md p-4">
                            <p className="text-sm">{selectedApp.statement}</p>
                          </div>
                        </div>
                        
                        {/* Documents */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Documents ({selectedApp.documentUrls.length})
                          </h4>
                          <div className="bg-gray-50 rounded-md p-4">
                            {selectedApp.documentUrls.length === 0 ? (
                              <p className="text-sm text-gray-500">No documents uploaded</p>
                            ) : (
                              <ul className="space-y-2">
                                {selectedApp.documentUrls.map((doc, index) => (
                                  <li key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                      <span>{doc.name}</span>
                                    </div>
                                    <a 
                                      href={doc.url} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-[#800000] hover:text-[#600000]"
                                    >
                                      View
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                        
                        {/* Application Status Management */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                            Application Status
                          </h4>
                          <div className="bg-gray-50 rounded-md p-4">
                            <div className="flex flex-col space-y-3">
                              <p className="text-sm">Change application status:</p>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <button
                                  onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.UNDER_REVIEW)}
                                  disabled={selectedApp.status === ApplicationStatus.UNDER_REVIEW}
                                  className={`py-2 px-3 rounded-md text-sm font-medium ${
                                    selectedApp.status === ApplicationStatus.UNDER_REVIEW
                                      ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                                      : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                  }`}
                                >
                                  <Clock className="inline-block h-4 w-4 mr-1" /> Under Review
                                </button>
                                
                                <button
                                  onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.ACCEPTED)}
                                  disabled={selectedApp.status === ApplicationStatus.ACCEPTED}
                                  className={`py-2 px-3 rounded-md text-sm font-medium ${
                                    selectedApp.status === ApplicationStatus.ACCEPTED
                                      ? 'bg-green-100 text-green-800 cursor-not-allowed'
                                      : 'bg-green-500 text-white hover:bg-green-600'
                                  }`}
                                >
                                  <CheckCircle className="inline-block h-4 w-4 mr-1" /> Accept
                                </button>
                                
                                <button
                                  onClick={() => handleStatusChange(selectedApp.id, ApplicationStatus.REJECTED)}
                                  disabled={selectedApp.status === ApplicationStatus.REJECTED}
                                  className={`py-2 px-3 rounded-md text-sm font-medium ${
                                    selectedApp.status === ApplicationStatus.REJECTED
                                      ? 'bg-red-100 text-red-800 cursor-not-allowed'
                                      : 'bg-red-500 text-white hover:bg-red-600'
                                  }`}
                                >
                                  <XCircle className="inline-block h-4 w-4 mr-1" /> Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;