// filepath: c:\Users\NAMMINA JAHNAVI\OneDrive\Desktop\OTT\project\src\components\PaymentSuccess.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return ( 
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg mb-8">Thank you for your payment. Your booking is confirmed.</p>
      <Link
        to="/"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default PaymentSuccess;