import React, { useState } from 'react';

const SetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSetPassword = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/set-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ newPassword })
    });
    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Set Your Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        /> 
        <button
          onClick={handleSetPassword}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
        >
          Set Password
        </button>
        {message && <div className="mt-4 text-yellow-400">{message}</div>}
      </div>
    </div>
  );
};

export default SetPassword;