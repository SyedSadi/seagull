import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../services/api';

export default function VerifyEmail() {
  const { uid, token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await API.get(`/verify-email/${uid}/${token}/`);
        console.log(res)
        setMessage("🎉 Email verified successfully");
        setSuccess(true);
      } catch (err) {
        setMessage("❌ Verification link is invalid or expired.");
        setSuccess(false);
      }
    };
    verifyEmail();
  }, [uid, token]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white shadow-md rounded-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        <p className={`text-lg ${success ? 'text-green-600' : 'text-red-600'}`}>{message}</p>
        {success && <Link className='btn btn-primary btn-sm mx-auto mt-4' to={'/login'}>Login</Link>}
      </div>
    </div>
  );
}
