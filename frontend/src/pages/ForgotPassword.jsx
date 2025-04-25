import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import API from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await API.post('/request-reset-password/', { email });
      console.log(res)
      setMessage('If the email exists, a password reset link has been sent. Check Spam Folder');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    }finally{
        setLoading(false)
    }
  };

  return (
    <>
        <Helmet>
            <title>Forget Password | KUETx</title>
        </Helmet>
    
        <div className="flex flex-col items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
            <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded mb-4"
            />
            <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
            {loading ? (
              <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              "Send Reset Link"
            )}
            </button>
            {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}
        </form>
        </div>
    </>
  );
};

export default ForgotPassword;
