// pages/CookiePreferences.js
import React, { useState } from "react";

const CookiePreferences = () => {
  const [preferences, setPreferences] = useState({ analytics: true, marketing: false });

  const togglePreference = (type) => {
    setPreferences((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  return ( 
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold border-b-4 border-red-500 pb-2">Cookie Preferences</h1>
        <p className="mt-6 text-lg leading-relaxed">
          Manage your cookie preferences to control how LuxeStream uses data to enhance your experience.
        </p>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-lg">Analytics Cookies</span>
            <button onClick={() => togglePreference("analytics")} className={`px-4 py-2 rounded ${preferences.analytics ? "bg-green-500" : "bg-gray-700"}`}>
              {preferences.analytics ? "Enabled" : "Disabled"}
            </button>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg">Marketing Cookies</span>
            <button onClick={() => togglePreference("marketing")} className={`px-4 py-2 rounded ${preferences.marketing ? "bg-green-500" : "bg-gray-700"}`}>
              {preferences.marketing ? "Enabled" : "Disabled"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePreferences;
