import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApplicationService } from '../services/ApplicationService';
import { Application, ApplicationStatus } from '../types';
import { FileCheck, AlertCircle, CheckCircle, Clock, XCircle, Upload } from 'lucide-react';

const ApplicationPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    program: '',
    previousEducation: [{ institution: '', degree: '', gradYear: '', percentage: '' }],
    documentUrls: [] as { name: string, url: string }[],
    statement: '',
  });
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Load existing application if any
    const loadApplication = () => {
      if (user) {
        const existingApplication = ApplicationService.getApplicationByUserId(user.id);
        if (existingApplication) {
          setApplication(existingApplication);
          // Pre-fill form data with existing application
          setFormData({
            fullName: existingApplication.fullName,
            email: existingApplication.email,
            phone: existingApplication.phone,
            address: existingApplication.address,
            dateOfBirth: existingApplication.dateOfBirth,
            program: existingApplication.program,
            previousEducation: existingApplication.previousEducation,
            documentUrls: existingApplication.documentUrls,
            statement: existingApplication.statement,
          });
        } else {
          // Pre-fill with user data if available
          setFormData(prev => ({
            ...prev,
            fullName: user.name,
            email: user.email,
            phone: user.phone,
          }));
        }
      }
      setLoading(false);
    };
    
    loadApplication();
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newEducation = [...formData.previousEducation];
    newEducation[index] = { ...newEducation[index], [name]: value };
    setFormData(prev => ({ ...prev, previousEducation: newEducation }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      previousEducation: [...prev.previousEducation, { institution: '', degree: '', gradYear: '', percentage: '' }]
    }));
  };

  const removeEducation = (index: number) => {
    const newEducation = [...formData.previousEducation];
    newEducation.splice(index, 1);
    setFormData(prev => ({ ...prev, previousEducation: newEducation }));
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, we would upload the file to a server and get a URL back
      // Here we'll simulate this by creating an object URL
      const documentName = file.name;
      const documentUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        documentUrls: [...prev.documentUrls, { name: documentName, url: documentUrl }]
      }));
    }
  };

  const removeDocument = (index: number) => {
    const newDocs = [...formData.documentUrls];
    newDocs.splice(index, 1);
    setFormData(prev => ({ ...prev, documentUrls: newDocs }));
  };

  const nextStep = () => {
    setActiveStep(prev => prev + 1);
  };

  const prevStep = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    // Submit new application
    const newApplication = ApplicationService.submitApplication({
      userId: user.id,
      ...formData,
    });
    
    setApplication(newApplication);
    // Go to confirmation
    setActiveStep(4);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#800000] mx-auto mb-4"></div>
          <p className="text-lg">Loading your application...</p>
        </div>
      </div>
    );
  }

  // If application already exists and has been reviewed
  if (application && (application.status === ApplicationStatus.ACCEPTED || application.status === ApplicationStatus.REJECTED)) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              {application.status === ApplicationStatus.ACCEPTED ? (
                <>
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                  <h2 className="mt-4 text-3xl font-bold text-gray-900">Application Accepted!</h2>
                  <p className="mt-2 text-lg text-gray-600">
                    Congratulations! Your application to CGU University has been accepted.
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="mx-auto h-16 w-16 text-red-500" />
                  <h2 className="mt-4 text-3xl font-bold text-gray-900">Application Rejected</h2>
                  <p className="mt-2 text-lg text-gray-600">
                    We regret to inform you that your application has not been accepted at this time.
                  </p>
                </>
              )}
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-bold mb-4">Application Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Application ID</p>
                  <p className="font-medium">{application.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted On</p>
                  <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{application.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium">{application.program}</p>
                </div>
              </div>
            </div>
            
            {application.status === ApplicationStatus.ACCEPTED && (
              <div className="bg-green-50 p-6 rounded-lg border border-green-200 mb-6">
                <h3 className="text-xl font-bold text-green-700 mb-4">Next Steps</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Download your acceptance letter from your profile</li>
                  <li>Complete your enrollment by paying the admission fee</li>
                  <li>Attend the online orientation session on [Date]</li>
                  <li>Submit original documents for verification</li>
                </ol>
                <div className="mt-6">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition-colors">
                    Proceed to Enrollment
                  </button>
                </div>
              </div>
            )}
            
            {application.status === ApplicationStatus.REJECTED && (
              <div className="bg-red-50 p-6 rounded-lg border border-red-200 mb-6">
                <h3 className="text-xl font-bold text-red-700 mb-4">Why was my application rejected?</h3>
                <p className="mb-4">Applications may be rejected for various reasons including:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Not meeting the required academic criteria</li>
                  <li>Incomplete application or missing documents</li>
                  <li>Limited seats in the chosen program</li>
                  <li>Insufficient experience for specialized programs</li>
                </ul>
                <div className="mt-6">
                  <p className="mb-2">For specific feedback on your application, please contact:</p>
                  <p className="font-semibold">admissions@cgu.edu</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-center mt-8">
              <Link 
                to="/" 
                className="text-[#800000] font-semibold hover:underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If application exists but is under review
  if (application && application.status === ApplicationStatus.UNDER_REVIEW) {
    return (
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <Clock className="mx-auto h-16 w-16 text-[#FFD700]" />
              <h2 className="mt-4 text-3xl font-bold text-gray-900">Application Under Review</h2>
              <p className="mt-2 text-lg text-gray-600">
                Your application has been submitted and is currently being reviewed by our admissions team.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-xl font-bold mb-4">Application Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Application ID</p>
                  <p className="font-medium">{application.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Submitted On</p>
                  <p className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{application.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Program</p>
                  <p className="font-medium">{application.program}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 mb-6">
              <h3 className="text-xl font-bold text-blue-700 mb-4">What happens next?</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Our admissions team will review your application thoroughly</li>
                <li>You may be contacted for additional information or an interview</li>
                <li>The review process typically takes 1-2 weeks</li>
                <li>You'll be notified via email once a decision has been made</li>
              </ol>
              <div className="mt-6 flex items-center">
                <AlertCircle className="text-blue-700 mr-2" size={20} />
                <p className="text-blue-700">You can check this page anytime to see your application status.</p>
              </div>
            </div>
            
            <div className="flex justify-center mt-8">
              <Link 
                to="/" 
                className="text-[#800000] font-semibold hover:underline"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // New application form
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#003366] text-white py-6 px-8">
          <h2 className="text-2xl font-bold">CGU University Application Form</h2>
          <p className="mt-1">Please complete all sections carefully</p>
        </div>
        
        {/* Application Progress */}
        <div className="px-8 py-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <div className={`flex flex-col items-center ${activeStep >= 1 ? 'text-[#800000]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeStep >= 1 ? 'bg-[#800000] text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="text-xs font-medium">Personal Info</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 2 ? 'bg-[#800000]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 2 ? 'text-[#800000]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeStep >= 2 ? 'bg-[#800000] text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="text-xs font-medium">Education</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 3 ? 'bg-[#800000]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 3 ? 'text-[#800000]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeStep >= 3 ? 'bg-[#800000] text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="text-xs font-medium">Documents</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${activeStep >= 4 ? 'bg-[#800000]' : 'bg-gray-200'}`}></div>
            <div className={`flex flex-col items-center ${activeStep >= 4 ? 'text-[#800000]' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${activeStep >= 4 ? 'bg-[#800000] text-white' : 'bg-gray-200'}`}>
                4
              </div>
              <span className="text-xs font-medium">Review</span>
            </div>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8">
          {/* Step 1: Personal Information */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                  placeholder="Street, City, State, Country, Postal Code"
                />
              </div>
              
              <div>
                <label htmlFor="program" className="block text-sm font-medium text-gray-700 mb-1">
                  Program Applying For*
                </label>
                <select
                  id="program"
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                >
                  <option value="">Select a program</option>
                  <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                  <option value="B.Tech Electronics">B.Tech Electronics</option>
                  <option value="B.Sc Mathematics">B.Sc Mathematics</option>
                  <option value="BBA Business Administration">BBA Business Administration</option>
                  <option value="M.Tech Computer Science">M.Tech Computer Science</option>
                  <option value="MBA Business Administration">MBA Business Administration</option>
                  <option value="M.Sc Data Science">M.Sc Data Science</option>
                  <option value="MA Economics">MA Economics</option>
                  <option value="Ph.D. Computer Science">Ph.D. Computer Science</option>
                  <option value="Ph.D. Engineering">Ph.D. Engineering</option>
                  <option value="Ph.D. Business Management">Ph.D. Business Management</option>
                  <option value="Ph.D. Mathematics">Ph.D. Mathematics</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Step 2: Educational Background */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold mb-4">Educational Background</h3>
              
              {formData.previousEducation.map((education, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Previous Education {index + 1}</h4>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={`institution-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Institution Name*
                      </label>
                      <input
                        type="text"
                        id={`institution-${index}`}
                        name="institution"
                        value={education.institution}
                        onChange={(e) => handleEducationChange(index, e)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`degree-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Degree/Certificate*
                      </label>
                      <input
                        type="text"
                        id={`degree-${index}`}
                        name="degree"
                        value={education.degree}
                        onChange={(e) => handleEducationChange(index, e)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`gradYear-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Graduation Year*
                      </label>
                      <input
                        type="text"
                        id={`gradYear-${index}`}
                        name="gradYear"
                        value={education.gradYear}
                        onChange={(e) => handleEducationChange(index, e)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor={`percentage-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Percentage/CGPA*
                      </label>
                      <input
                        type="text"
                        id={`percentage-${index}`}
                        name="percentage"
                        value={education.percentage}
                        onChange={(e) => handleEducationChange(index, e)}
                        required
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <div>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center text-[#800000] font-medium hover:text-[#600000]"
                >
                  + Add Another Education
                </button>
              </div>
              
              <div className="mt-6">
                <label htmlFor="statement" className="block text-sm font-medium text-gray-700 mb-1">
                  Statement of Purpose*
                </label>
                <textarea
                  id="statement"
                  name="statement"
                  rows={5}
                  value={formData.statement}
                  onChange={handleChange}
                  required
                  placeholder="Describe why you are interested in this program and your future goals..."
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#800000] focus:border-[#800000] sm:text-sm"
                />
              </div>
            </div>
          )}
          
          {/* Step 3: Documents Upload */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-bold mb-4">Documents Upload</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-4">
                  Upload your academic transcripts, ID proof, and any other required documents.
                </p>
                <label className="bg-[#800000] text-white px-4 py-2 rounded-md font-semibold hover:bg-[#600000] transition-colors cursor-pointer">
                  Select File
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleDocumentUpload}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported formats: PDF, JPG, PNG (max. 5MB)
                </p>
              </div>
              
              {formData.documentUrls.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-2">Uploaded Documents</h4>
                  <ul className="space-y-2">
                    {formData.documentUrls.map((doc, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                        <div className="flex items-center">
                          <FileCheck className="text-green-500 mr-2" size={20} />
                          <span>{doc.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="bg-blue-50 p-4 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="text-blue-600 mr-2 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-medium text-blue-700">Required Documents</h4>
                    <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                      <li>Previous academic transcripts</li>
                      <li>Government-issued ID proof</li>
                      <li>Recent passport-sized photograph</li>
                      <li>Any certificates of achievements (optional)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Step 4: Review and Submit */}
          {activeStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-center mb-6">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h2 className="mt-4 text-3xl font-bold text-gray-900">Application Submitted!</h2>
                <p className="mt-2 text-lg text-gray-600">
                  Your application has been successfully submitted for review.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-4">What happens next?</h3>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Our admissions team will review your application thoroughly</li>
                  <li>You may be contacted for additional information or an interview</li>
                  <li>You'll be notified via email once a decision has been made</li>
                  <li>You can check your application status anytime by logging into your account</li>
                </ol>
              </div>
              
              <div className="flex justify-center mt-8">
                <Link 
                  to="/" 
                  className="bg-[#800000] text-white px-6 py-2 rounded-md font-semibold hover:bg-[#600000] transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          {activeStep < 4 && (
            <div className="flex justify-between mt-8">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
              
              {activeStep < 3 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto bg-[#800000] text-white px-6 py-2 rounded-md font-medium hover:bg-[#600000] transition-colors"
                >
                  Next
                </button>
              )}
              
              {activeStep === 3 && (
                <button
                  type="submit"
                  className="ml-auto bg-[#800000] text-white px-6 py-2 rounded-md font-medium hover:bg-[#600000] transition-colors"
                >
                  Submit Application
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ApplicationPage;