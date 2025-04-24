import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      const user = await login(email, password);
      if (user) {
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/application');
        }
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    }
  };

  // Demo login handler
  const handleDemoLogin = async (type: 'admin' | 'applicant') => {
    try {
      let email, password;
      if (type === 'admin') {
        email = 'admin@cgu.edu';
        password = 'admin123';
      } else {
        email = 'demo@example.com';
        password = 'demo123';
      }
      
      const user = await login(email, password);
      if (user) {
        if (user.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/application');
        }
      } else {
        // Create demo account for applicant if it doesn't exist
        if (type === 'applicant') {
          navigate('/register');
        } else {
          setError('Demo account not found. Please use the default admin credentials.');
        }
      }
    } catch (err) {
      setError('Failed to log in. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-[#800000]" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-[#800000] hover:text-[#600000]">
              create a new account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#800000] focus:border-[#800000] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-[#800000] focus:border-[#800000] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#800000] hover:bg-[#600000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#800000]"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Quick Demo Access:</p>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="flex-1 py-2 px-4 border border-[#003366] text-sm font-medium rounded-md text-[#003366] bg-white hover:bg-gray-50"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('applicant')}
                className="flex-1 py-2 px-4 border border-[#003366] text-sm font-medium rounded-md text-[#003366] bg-white hover:bg-gray-50"
              >
                Applicant Demo
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;