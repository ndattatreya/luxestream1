import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="text-xl font-bold">
              LuxeStream
            </Link>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg> 
            </button>
          </div>

          <nav className="space-y-4">
            <Link
              to="/"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Home
            </Link>
            <Link
              to="/userdashboard"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/subscription"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Subscription
            </Link>
            <Link
              to="/aboutus"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              About Us
            </Link>
            <Link
              to="/contactus"
              className="block px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              Contact Us
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar; 