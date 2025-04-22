import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const VideoPlayer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { movie } = location.state || {}; 

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">{movie?.name || 'Movie Title'}</h1>
      <div className="w-full max-w-4xl">
        <video
          controls
          className="w-full rounded-lg shadow-lg"
        >
          <source src={`http://localhost:5000/stream/${movie?.id}`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-8 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default VideoPlayer;