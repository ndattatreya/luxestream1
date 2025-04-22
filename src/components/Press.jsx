// pages/Press.js
import React from "react";

const Press = () => { 
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold border-b-4 border-red-500 pb-2">
          LuxeStream Press & Media
        </h1>
        <p className="mt-6 text-lg leading-relaxed">
          Stay updated with the latest LuxeStream announcements, industry news,
          and media coverage.
        </p>

        <h2 className="text-3xl font-semibold mt-8">Media Contacts</h2>
        <p className="mt-4 text-lg">
          For press inquiries, contact our media team at{" "}
          <span className="text-red-500 font-semibold">
            press@luxestream.com
          </span>
        </p>

        <h2 className="text-3xl font-semibold mt-8">Latest News</h2>
        <ul className="list-disc ml-6 mt-4 text-lg space-y-2">
          <li>LuxeStream secures $50M in Series B funding</li>
          <li>New AI-powered recommendation system launched</li>
          <li>Exclusive deal with top Hollywood studios</li>
        </ul>
      </div>
    </div>
  );
};

export default Press;
