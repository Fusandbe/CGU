import { User, UserRole } from '../types';

// Mock storage for users
const USERS_KEY = 'cgu_users';

// Initialize with default admin user if none exists
const initializeUsers = (): void => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  if (!existingUsers) {
    const defaultUsers: User[] = [
      {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@cgu.edu',
        password: 'admin123', // In a real app, this would be hashed
        role: UserRole.ADMIN,
        phone: '1234567890',
      }
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  }
};

// Get all users
const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users
const saveUsers = (users: User[]): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Register a new user
const register = (user: Omit<User, 'id' | 'role'>): User | null => {
  const users = getUsers();
  
  // Check if email already exists
  if (users.some(u => u.email === user.email)) {
    return null;
  }
  
  const newUser: User = {
    ...user,
    id: `user-${Date.now()}`,
    role: UserRole.APPLICANT,
  };
  
  users.push(newUser);
  saveUsers(users);
  return newUser;
};

// Login
const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

// Get current user from session
const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Set current user in session
const setCurrentUser = (user: User | null): void => {
  if (user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    sessionStorage.removeItem('currentUser');
  }
};

// Logout
const logout = (): void => {
  sessionStorage.removeItem('currentUser');
};

// Initialize users on service load
initializeUsers();

export const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  setCurrentUser,
  getUsers,
};