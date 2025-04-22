// pages/AboutUs.js
import React from "react";

const AboutUs = () => {
  return ( 
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold border-b-4 border-red-500 pb-2">
          About LuxeStream
        </h1>
        <p className="mt-6 text-lg leading-relaxed">
          LuxeStream is the premier destination for high-quality movie
          streaming, offering an extensive collection of films and TV shows.
          Our platform is designed to provide an immersive, ad-free experience
          with exclusive content, advanced recommendations, and seamless
          streaming.
        </p>

        <h2 className="text-3xl font-semibold mt-8">Our Mission</h2>
        <p className="mt-4 text-lg">
          We aim to revolutionize digital entertainment by providing users with
          a premium, personalized, and convenient streaming service.
        </p>

        <h2 className="text-3xl font-semibold mt-8">Why Choose Us?</h2>
        <ul className="list-disc ml-6 mt-4 text-lg space-y-2">
          <li>Ultra-HD streaming with Dolby Atmos support</li>
          <li>Exclusive movies & TV shows</li>
          <li>Cross-platform accessibility</li>
          <li>AI-driven content recommendations</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
