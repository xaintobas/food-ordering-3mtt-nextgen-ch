import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, XCircle, Loader2, ArrowRight } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const performVerification = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Missing verification token');
        return;
      }

      const res = await verifyEmail(token);
      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'Email verified successfully!');
      } else {
        setStatus('error');
        setMessage(res.message || 'Verification link expired or invalid.');
      }
    };
    performVerification();
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-orange-50/20">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-orange-100 shadow-xl text-center animate-fade-in">
        {status === 'verifying' && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <Loader2 className="h-12 w-12 text-brand-green animate-spin" />
            <h3 className="text-xl font-bold text-gray-800">Verifying Email</h3>
            <p className="text-sm text-gray-500">Connecting to server to verify account details...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-8 space-y-6">
            <CheckCircle2 className="h-16 w-16 text-emerald-600 animate-bounce" />
            <div>
              <h3 className="text-2xl font-extrabold text-brand-green-dark">Email Verified!</h3>
              <p className="mt-2 text-sm text-gray-600">{message}</p>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1.5 bg-brand-green hover:bg-brand-green-light text-white font-bold px-6 py-2.5 rounded-xl shadow transition-colors"
            >
              Start Ordering <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-8 space-y-6">
            <XCircle className="h-16 w-16 text-red-600 animate-pulse" />
            <div>
              <h3 className="text-2xl font-extrabold text-red-900">Verification Failed</h3>
              <p className="mt-2 text-sm text-red-600">{message}</p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 bg-brand-orange hover:bg-brand-orange-dark text-white font-bold px-6 py-2.5 rounded-xl shadow transition-colors"
            >
              Go to Homepage
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
