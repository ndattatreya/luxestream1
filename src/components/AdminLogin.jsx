import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { useAuth } from '../authContext';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const recaptchaRef = useRef(null);
  const [captchaValue, setCaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password, recaptchaToken: captchaValue }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Save token & update auth state
      localStorage.setItem('token', data.token);
      login({ email, role: 'admin', token: data.token });

      navigate('/admindashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      recaptchaRef.current?.reset();
      setCaptchaValue(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-black bg-opacity-50 pt-20"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?auto=format&fit=crop&q=80&w=1920')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="z-10 p-8 bg-black bg-opacity-80 rounded-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-8">Admin Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full p-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-4 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />

          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
              onChange={(value) => {
                setCaptchaValue(value);
                setError('');
              }}
              onExpired={() => {
                setCaptchaValue(null);
                setError('reCAPTCHA expired, please verify again');
              }}
              onError={() => {
                setCaptchaValue(null);
                setError('Error loading reCAPTCHA');
              }}
              theme="dark"
              size="normal"
              hl="en"
            />
          </div>

          <button
            type="submit"
            className={`w-full ${isLoading ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'} 
              text-white py-4 rounded font-semibold transition duration-300`}
            disabled={isLoading || !captchaValue}
          >
            {isLoading ? 'Logging in...' : 'Admin Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
