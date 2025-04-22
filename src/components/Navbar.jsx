import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from './ThemeContext'

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white">
      <nav className="bg-black text-white px-6 py-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
        {/* Logo on the Left */}
        <Link to="/" className="text-3xl font-bold text-red-600">
          LuxeStream
        </Link>

        {/* Navigation Links */}
        <div className="flex space-x-6">
          <Link to="/aboutus" className="hover:underline">About Us</Link>
          <Link to="/careers" className="hover:underline">Careers</Link>
          <Link to="/helpcenter" className="hover:underline">Help Center</Link>
          <Link to="/contactus" className="hover:underline">Contact Us</Link>
        </div>

        {/* Theme Toggle Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
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
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>

      </nav>
    </div>
  );
};

export default Navbar; 