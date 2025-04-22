import React from 'react';

const SocialLogin = () => (
  <div className="flex flex-col gap-2 my-4">
    <a
      href="http://localhost:5000/auth/google"
      className="bg-white text-black border border-gray-300 py-2 rounded flex items-center justify-center hover:bg-gray-100"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5 mr-2" />
      Continue with Google
    </a>
  </div>
);

export default SocialLogin; 