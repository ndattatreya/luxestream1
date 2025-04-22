// pages/CorporateInformation.js
import React from "react";

const CorporateInformation = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold border-b-4 border-red-500 pb-2">Corporate Information</h1>
        <p className="mt-6 text-lg leading-relaxed">
          LuxeStream is a global entertainment company revolutionizing the streaming industry.
        </p>
 
        <h2 className="text-3xl font-semibold mt-8">Company Details</h2>
        <ul className="list-disc ml-6 mt-4 text-lg space-y-2">
          <li>Headquarters: Los Angeles, CA</li>
          <li>Founded: 2020</li>
          <li>CEO: John Doe</li>
          <li>Stock Market: NASDAQ (LXST)</li>
        </ul>

        <h2 className="text-3xl font-semibold mt-8">Contact Corporate Office</h2>
        <p className="mt-4 text-lg">
          Reach our corporate team at{" "}
          <span className="text-red-500 font-semibold">corporate@luxestream.com</span>
        </p>
      </div>
    </div>
  );
};

export default CorporateInformation;
