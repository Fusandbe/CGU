import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, Book, Award, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#003366] to-[#800000] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Shape Your Future at CGU University</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Start your journey towards academic excellence and professional success with our world-class programs.
          </p>
          
          {!user ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="bg-[#FFD700] text-[#800000] px-6 py-3 rounded-md font-semibold hover:bg-[#E6C200] transition-colors"
              >
                Apply Now
              </Link>
              <Link 
                to="/login" 
                className="bg-transparent border border-white text-white px-6 py-3 rounded-md font-semibold hover:bg-white hover:text-[#800000] transition-colors"
              >
                Log In
              </Link>
            </div>
          ) : (
            <Link 
              to={user.role === 'ADMIN' ? '/admin' : '/application'} 
              className="bg-[#FFD700] text-[#800000] px-6 py-3 rounded-md font-semibold hover:bg-[#E6C200] transition-colors"
            >
              {user.role === 'ADMIN' ? 'Go to Admin Dashboard' : 'Check Application Status'}
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#003366]">Why Choose CGU University?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <Award className="text-[#800000] mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Academic Excellence</h3>
              <p className="text-gray-600">Ranked among top 10 universities in India with internationally recognized programs.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <Users className="text-[#800000] mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Distinguished Faculty</h3>
              <p className="text-gray-600">Learn from world-renowned professors and industry experts with decades of experience.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <Book className="text-[#800000] mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">Modern Curriculum</h3>
              <p className="text-gray-600">Industry-aligned courses that prepare you for the challenges of tomorrow.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md transition-transform hover:translate-y-[-5px]">
              <CheckCircle className="text-[#800000] mb-4" size={48} />
              <h3 className="text-xl font-bold mb-2">High Placement Rate</h3>
              <p className="text-gray-600">Over 95% placement rate with top companies and competitive packages.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#003366]">Our Programs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-[#003366] flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Undergraduate</span>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#800000] rounded-full mr-2"></span>
                    B.Tech Computer Science
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#800000] rounded-full mr-2"></span>
                    B.Tech Electronics
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#800000] rounded-full mr-2"></span>
                    B.Sc Mathematics
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#800000] rounded-full mr-2"></span>
                    BBA Business Administration
                  </li>
                </ul>
                <a href="#" className="text-[#800000] font-semibold hover:underline">View All Programs →</a>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-[#800000] flex items-center justify-center">
                <span className="text-white text-2xl font-bold">Graduate</span>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#003366] rounded-full mr-2"></span>
                    M.Tech Computer Science
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#003366] rounded-full mr-2"></span>
                    MBA Business Administration
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#003366] rounded-full mr-2"></span>
                    M.Sc Data Science
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#003366] rounded-full mr-2"></span>
                    MA Economics
                  </li>
                </ul>
                <a href="#" className="text-[#800000] font-semibold hover:underline">View All Programs →</a>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="h-48 bg-[#FFD700] flex items-center justify-center">
                <span className="text-[#800000] text-2xl font-bold">Doctoral</span>
              </div>
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#800000] rounded-full mr-2"></span>
                    Ph.D. Computer Science
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#800000] rounded-full mr-2"></span>
                    Ph.D. Engineering
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#800000] rounded-full mr-2"></span>
                    Ph.D. Business Management
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-[#800000] rounded-full mr-2"></span>
                    Ph.D. Mathematics
                  </li>
                </ul>
                <a href="#" className="text-[#800000] font-semibold hover:underline">View All Programs →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-16 bg-[#003366] text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Admission Process</h2>
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex-1 mb-8 md:mb-0 md:mr-8">
              <div className="space-y-8">
                <div className="flex">
                  <div className="mr-4 bg-[#FFD700] text-[#800000] w-10 h-10 rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Register Online</h3>
                    <p className="text-gray-300">Create an account and fill in your basic information.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 bg-[#FFD700] text-[#800000] w-10 h-10 rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Complete Application</h3>
                    <p className="text-gray-300">Submit your academic details and personal statement.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 bg-[#FFD700] text-[#800000] w-10 h-10 rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Application Review</h3>
                    <p className="text-gray-300">Our admissions team reviews your application.</p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="mr-4 bg-[#FFD700] text-[#800000] w-10 h-10 rounded-full flex items-center justify-center font-bold">4</div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Admission Decision</h3>
                    <p className="text-gray-300">Check your application status online.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 bg-white text-[#003366] p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4">Ready to Apply?</h3>
              <p className="mb-6">Take the first step towards your academic journey at CGU University.</p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  <span>Simple online application process</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  <span>Track your application status 24/7</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="text-green-600 mr-2" size={20} />
                  <span>Quick response within two weeks</span>
                </div>
              </div>
              <div className="mt-8">
                <Link 
                  to="/register" 
                  className="bg-[#800000] text-white px-6 py-3 rounded-md font-semibold inline-block hover:bg-[#600000] transition-colors"
                >
                  Start Your Application
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;