import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      style={{
        padding: '8px 16px',
        borderRadius: '6px',
        border: 'none',
        background: theme === 'dark' ? '#222' : '#eee',
        color: theme === 'dark' ? '#fff' : '#222',
        cursor: 'pointer',
        margin: '8px'
      }}
      aria-label="Toggle dark/light mode"
    >
      {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white text-black dark:bg-gray-900 dark:text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0">
            <h1 className="text-3xl font-bold text-red-600">LuxeStream</h1>
          </div> 
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
            
            {/* Company Section */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Company</h2>
              <ul>
                <li><Link to="/aboutus" className="hover:underline">About Us</Link></li>
                <li><Link to="/careers" className="hover:underline">Careers</Link></li>
                <li><Link to="/press" className="hover:underline">Press</Link></li>
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Support</h2>
              <ul>
                <li><Link to="/helpcenter" className="hover:underline">Help Center</Link></li>
                <li><Link to="/contactus" className="hover:underline">Contact Us</Link></li>
                <li><Link to="/privacypolicy" className="hover:underline">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div>
              <h2 className="text-lg font-semibold mb-2">Legal</h2>
              <ul>
                <li><Link to="/termsofuse" className="hover:underline">Terms of Use</Link></li>
                <li><Link to="/cookiepreferences" className="hover:underline">Cookie Preferences</Link></li>
                <li><Link to="/corporateinformation" className="hover:underline">Corporate Information</Link></li>
              </ul>
            </div>

          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2025 LuxeStream. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
