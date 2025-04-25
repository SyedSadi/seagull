import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import API from '../services/api';

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await API.post(`/reset-password/${uid}/${token}/`, {
        password: password,
      });
      console.log(res)
      setMessage('Password reset successful! Redirecting...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage('Invalid or expired link.');
    } finally{
        setLoading(false)
    }
  };

  return (
    <>
    <Helmet>
        <title>Reset Password | KUETx</title>
    </Helmet>
    
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleReset} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Set New Password</h2>
        <input
          type="password"
          required
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Reset Password"
            )}
        </button>
        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
      </form>
    </div>
    </>
  );
};

export default ResetPassword;
