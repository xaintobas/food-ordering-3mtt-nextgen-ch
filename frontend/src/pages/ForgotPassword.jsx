import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, ArrowLeft, Send, CheckCircle2, AlertCircle } from 'lucide-react';

const ForgotPassword = () => {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!email) {
      setErrorMsg('Please enter your email');
      setLoading(false);
      return;
    }

    const res = await requestPasswordReset(email);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message || 'Password reset link sent to your email.');
    } else {
      setErrorMsg(res.message || 'Failed to send reset link.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-orange-50/20">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-orange-100 shadow-xl animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <span className="text-4xl">🔐</span>
          <h2 className="mt-4 text-3xl font-extrabold text-brand-green-dark">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-500">Enter your email and we'll send a link to restore access.</p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl border border-emerald-200 flex items-start gap-2.5 text-sm">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 mt-0.5" />
            <div>
              <p className="font-bold">Recovery Link Sent!</p>
              <p className="text-xs text-emerald-600 mt-1">{successMsg}</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {!successMsg && (
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase text-gray-600 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 bg-gray-50 border border-orange-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder="e.g. hungry@naija.com"
                />
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
                  <span className="flex items-center gap-1.5">
                    <Send className="h-4 w-4" /> Send Recovery Link
                  </span>
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

export default ForgotPassword;
