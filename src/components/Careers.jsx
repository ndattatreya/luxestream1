// pages/Careers.js
import React from "react";

const Careers = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold border-b-4 border-red-500 pb-2">
          Careers at LuxeStream
        </h1> 
        <p className="mt-6 text-lg leading-relaxed">
          Join our team and be part of a fast-growing company that is changing
          the way people experience entertainment. At LuxeStream, we encourage
          innovation, creativity, and collaboration.
        </p>

        <h2 className="text-3xl font-semibold mt-8">Open Positions</h2>
        <p className="mt-4 text-lg">We are currently hiring for:</p>
        <ul className="list-disc ml-6 mt-4 text-lg space-y-2">
          <li>Frontend Developer (React, Next.js)</li>
          <li>Backend Engineer (Node.js, GraphQL)</li>
          <li>Data Scientist (AI & ML)</li>
          <li>UI/UX Designer</li>
          <li>Content Acquisition Manager</li>
        </ul>

        <p className="mt-6 text-lg">
          Send your resume to{" "}
          <span className="text-red-500 font-semibold">
            careers@luxestream.com
          </span>
        </p>
      </div>
    </div>
  );
};

export default Careers;
