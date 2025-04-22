// pages/PrivacyPolicy.js
import React from "react";

const PrivacyPolicy = () => {
  return ( 
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold border-b-4 border-red-500 pb-2">Privacy Policy</h1>
        <p className="mt-6 text-lg leading-relaxed">
          Your privacy is important to us. LuxeStream is committed to protecting your personal data and ensuring a secure streaming experience.
        </p>

        <h2 className="text-3xl font-semibold mt-8">Information We Collect</h2>
        <ul className="list-disc ml-6 mt-4 text-lg space-y-2">
          <li>Personal details (name, email, etc.)</li>
          <li>Streaming preferences and history</li>
          <li>Payment and billing details (secured via encryption)</li>
        </ul>

        <h2 className="text-3xl font-semibold mt-8">How We Use Your Information</h2>
        <p className="mt-4 text-lg">
          We use your data to personalize content, improve recommendations, and ensure a seamless viewing experience.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
