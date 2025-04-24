import { Application, ApplicationStatus } from '../types';
import { AuthService } from './AuthService';

// Mock storage for applications
const APPLICATIONS_KEY = 'cgu_applications';

// Get all applications
const getApplications = (): Application[] => {
  const applications = localStorage.getItem(APPLICATIONS_KEY);
  return applications ? JSON.parse(applications) : [];
};

// Save applications
const saveApplications = (applications: Application[]): void => {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
};

// Submit a new application
const submitApplication = (application: Omit<Application, 'id' | 'status' | 'createdAt'>): Application => {
  const applications = getApplications();
  
  const newApplication: Application = {
    ...application,
    id: `app-${Date.now()}`,
    status: ApplicationStatus.UNDER_REVIEW,
    createdAt: new Date().toISOString(),
  };
  
  applications.push(newApplication);
  saveApplications(applications);
  return newApplication;
};

// Get application by user id
const getApplicationByUserId = (userId: string): Application | null => {
  const applications = getApplications();
  return applications.find(app => app.userId === userId) || null;
};

// Get all applications (admin only)
const getAllApplications = (): Application[] => {
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return [];
  }
  
  return getApplications();
};

// Update application status (admin only)
const updateApplicationStatus = (applicationId: string, status: ApplicationStatus): Application | null => {
  const currentUser = AuthService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return null;
  }
  
  const applications = getApplications();
  const applicationIndex = applications.findIndex(app => app.id === applicationId);
  
  if (applicationIndex === -1) {
    return null;
  }
  
  applications[applicationIndex].status = status;
  saveApplications(applications);
  
  return applications[applicationIndex];
};

export const ApplicationService = {
  submitApplication,
  getApplicationByUserId,
  getAllApplications,
  updateApplicationStatus,
};