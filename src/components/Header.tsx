import React from 'react';
import { GraduationCap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-[#800000] text-white">
      <div className="container mx-auto py-4 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <GraduationCap size={28} />
          <span className="font-bold text-xl">CGU Admissions</span>
        </Link>
        
        <nav>
          <ul className="flex space-x-6 items-center">
            <li>
              <Link to="/" className="hover:text-[#FFD700] transition-colors">
                Home
              </Link>
            </li>
            
            {!user ? (
              <>
                <li>
                  <Link to="/login" className="hover:text-[#FFD700] transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="bg-[#FFD700] text-[#800000] px-4 py-2 rounded hover:bg-[#E6C200] transition-colors"
                  >
                    Apply Now
                  </Link>
                </li>
              </>
            ) : (
              <>
                {user.role === UserRole.ADMIN ? (
                  <li>
                    <Link to="/admin" className="hover:text-[#FFD700] transition-colors">
                      Admin Dashboard
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/application" className="hover:text-[#FFD700] transition-colors">
                      My Application
                    </Link>
                  </li>
                )}
                <li>
                  <button 
                    onClick={handleLogout}
                    className="border border-white px-4 py-2 rounded hover:bg-white hover:text-[#800000] transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;