import React from 'react';

const HeroCarousel = () => {
  return (
    <div className="relative h-96 bg-cover bg-center" style={{ backgroundImage: "url('/path/to/featured-image.jpg')" }}>
      <div className="absolute bottom-0 left-0 p-4 bg-gradient-to-t from-black to-transparent">
        <h1 className="text-3xl font-bold text-white">Featured Title</h1>
        <p className="text-white">Some description about the featured content.</p>
        <button className="mt-2 px-4 py-2 bg-red-600 text-white rounded">Watch Now</button>
      </div>
    </div>
  ); 
};

export default HeroCarousel; 