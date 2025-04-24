import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#003366] text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">CGU University</h3>
            <p className="text-sm mb-4">
              One of India's top deemed universities, dedicated to excellence in education and research.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <MapPin size={16} />
              <span>123 University Road, Chennai, India</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+91 123 456 7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>admissions@cgu.edu</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-[#FFD700] transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FFD700] transition-colors">Programs</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FFD700] transition-colors">Faculty</a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FFD700] transition-colors">Campus Life</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} CGU University. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;