import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Signing you in...');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Fetch user info to check if password is set
      fetch('http://localhost:5000/api/user', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(user => {
          if (!user || typeof user !== 'object' || !user.password) {
            setStatus('Please set your password for future logins.');
            setTimeout(() => navigate('/set-password'), 1500);
          } else {
            setStatus('Sign in successful! Redirecting to your dashboard...');
            setTimeout(() => navigate('/userdashboard'), 1500);
          } 
        });
    } else {
      setStatus('Sign in failed. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    }
  }, [navigate]);

  return <div className="text-center text-lg mt-20">{status}</div>;
};

export default OAuthSuccess;