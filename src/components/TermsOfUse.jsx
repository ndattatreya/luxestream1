// pages/TermsOfUse.js
import React from "react";

const TermsOfUse = () => {
  return ( 
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold border-b-4 border-red-500 pb-2">Terms of Use</h1>
        <p className="mt-6 text-lg leading-relaxed">
          By using LuxeStream, you agree to our terms and conditions. Please read them carefully before accessing our services.
        </p>

        <h2 className="text-3xl font-semibold mt-8">Key Terms</h2>
        <ul className="list-disc ml-6 mt-4 text-lg space-y-2">
          <li>Users must be 18+ or have parental consent.</li>
          <li>Accounts cannot be shared beyond household members.</li>
          <li>Unauthorized distribution of content is prohibited.</li>
        </ul>
      </div>
    </div>
  );
};

export default TermsOfUse;
