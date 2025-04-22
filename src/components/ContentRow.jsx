import React from 'react';

const ContentRow = ({ title }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
      <div className="flex space-x-4 overflow-x-scroll">
        {/* Map through content items and display them here */}
        <div className="w-48 h-64 bg-gray-800 flex-shrink-0"></div>
        <div className="w-48 h-64 bg-gray-800 flex-shrink-0"></div>
        <div className="w-48 h-64 bg-gray-800 flex-shrink-0"></div>
        {/* Add more items as needed */} 
      </div>
    </div>
  );
};

export default ContentRow; 