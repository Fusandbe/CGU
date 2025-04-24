export enum UserRole {
  ADMIN = 'ADMIN',
  APPLICANT = 'APPLICANT',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
}

export enum ApplicationStatus {
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface Application {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  program: string;
  previousEducation: {
    institution: string;
    degree: string;
    gradYear: string;
    percentage: string;
  }[];
  documentUrls: {
    name: string;
    url: string;
  }[];
  statement: string;
  status: ApplicationStatus;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (userData: Omit<User, 'id' | 'role'>) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
}