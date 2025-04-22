import React, { useState } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
 
  const handleSendOtp = async () => {
    const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (res.ok) {
      setStep(2);
      setMessage('OTP sent to your email.');
    } else {
      setMessage(data.message || 'Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    if (res.ok) {
      setStep(3);
      setMessage('OTP verified. Enter your new password.');
    } else {
      setMessage(data.message || 'Invalid OTP');
    }
  };

  const handleResetPassword = async () => {
    const res = await fetch('http://localhost:5000/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, newPassword }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage('Password reset successful! You can now log in.');
      setStep(1);
    } else {
      setMessage(data.message || 'Failed to reset password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
        {message && <div className="mb-4 text-yellow-400">{message}</div>}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;