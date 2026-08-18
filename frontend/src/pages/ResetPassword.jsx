import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const res = await resetPassword(token, password);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setError(res.message || 'Failed to reset password. Link may be expired.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-orange-50/20">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-orange-100 shadow-xl animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <span className="text-4xl">🔐</span>
          <h2 className="mt-4 text-3xl font-extrabold text-brand-green-dark">Set New Password</h2>
          <p className="mt-2 text-sm text-gray-500">Provide a secure new password for your account.</p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-sm animate-fade-in">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <p className="font-bold">Password Reset Successful!</p>
              <p className="text-xs text-emerald-600 mt-1">Redirecting to Login page in 3 seconds...</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!success && (
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full px-3 py-2.5 bg-gray-50 border border-orange-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                    placeholder="•••••••• (min 6 characters)"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 block w-full px-3 py-2.5 bg-gray-50 border border-orange-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-green hover:bg-brand-green-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-all shadow-md cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-4">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm font-bold text-brand-orange hover:text-brand-orange-dark">
            <ArrowLeft className="h-4 w-4" /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
