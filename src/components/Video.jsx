import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

const Video = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No movie selected</h1>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with Toggle Button */}
      <header className="fixed top-0 left-0 right-0 bg-gray-900 z-30">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white hover:text-gray-300 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/" className="text-xl font-bold">
            LuxeStream
          </Link>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </div>
      </header>

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">{movie.title}</h1>
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <video
              className="w-full h-full rounded-lg"
              controls
              autoPlay
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Movie Details</h2>
            <p className="text-gray-300">{movie.overview}</p> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video; 