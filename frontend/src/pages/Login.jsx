import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, user, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'vendor') {
        navigate('/vendor-dashboard');
      } else {
        navigate('/menu');
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    const res = await login(email, password);
    setLoading(false);
    
    if (!res.success) {
      setError(res.message || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-orange-50/20">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-orange-100 shadow-xl animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <span className="text-4xl">🍛</span>
          <h2 className="mt-4 text-3xl font-extrabold text-brand-green-dark">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-500">Sign in to place orders or manage your local kitchen.</p>
        </div>

        {/* Errors */}
        {(error || authError) && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error || authError}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase text-gray-600 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full px-3 py-2.5 bg-gray-50 border border-orange-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder="e.g. delicious@naija.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label htmlFor="password" className="block text-xs font-bold uppercase text-gray-600">Password</label>
                <Link to="/forgot-password" className="text-xs font-semibold text-brand-orange hover:text-brand-orange-dark">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                <span className="flex items-center gap-1.5">
                  <LogIn className="h-4 w-4" /> Sign In
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-brand-orange hover:text-brand-orange-dark">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
