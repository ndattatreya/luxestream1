// pages/HelpCenter.js
import React from "react";

const HelpCenter = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold border-b-4 border-red-500 pb-2">
          Help Center
        </h1> 
        <p className="mt-6 text-lg leading-relaxed">
          Need assistance? Find answers to common questions and troubleshooting
          guides below.
        </p>

        <h2 className="text-3xl font-semibold mt-8">Frequently Asked Questions</h2>
        <ul className="list-disc ml-6 mt-4 text-lg space-y-2">
          <li>How do I create an account?</li>
          <li>How can I cancel my subscription?</li>
          <li>What devices are supported?</li>
          <li>How do I contact customer support?</li>
        </ul>

        <p className="mt-6 text-lg">
          If you need further assistance, email us at{" "}
          <span className="text-red-500 font-semibold">
            support@luxestream.com
          </span>
        </p>
      </div>
    </div>
  );
};

export default HelpCenter;
