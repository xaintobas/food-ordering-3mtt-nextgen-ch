import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Phone, MapPin, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register, user, error: authError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Determine initial role from query param
  const initialRole = searchParams.get('role') === 'vendor' ? 'vendor' : 'customer';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: initialRole,
    phone: '',
    address: '',
  });

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const setRole = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { name, email, password, phone, address } = formData;

    if (!name || !email || !password || !phone || !address) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const res = await register(formData);
    setLoading(false);

    if (!res.success) {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-orange-50/20">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl border border-orange-100 shadow-xl animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <span className="text-4xl">🍛</span>
          <h2 className="mt-4 text-3xl font-extrabold text-brand-green-dark">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">Sign up to buy local delicacies or list your menu items.</p>
        </div>

        {/* Role Toggle Tabs */}
        <div className="flex bg-orange-50 p-1.5 rounded-xl border border-orange-100">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              formData.role === 'customer'
                ? 'bg-brand-green text-white shadow-md'
                : 'text-brand-green-dark hover:bg-orange-100/50'
            }`}
          >
            Hungry Customer
          </button>
          <button
            type="button"
            onClick={() => setRole('vendor')}
            className={`flex-1 text-center py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
              formData.role === 'vendor'
                ? 'bg-brand-green text-white shadow-md'
                : 'text-brand-green-dark hover:bg-orange-100/50'
            }`}
          >
            Local Food Vendor
          </button>
        </div>

        {/* Errors */}
        {(error || authError) && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error || authError}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-2.5 bg-gray-50 border border-orange-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder="e.g. Tunde Alabi"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-2.5 bg-gray-50 border border-orange-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder="e.g. tunde@gmail.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-2.5 bg-gray-50 border border-orange-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder="•••••••• (min 6 characters)"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-2.5 bg-gray-50 border border-orange-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder="e.g. 08123456789"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase text-gray-600 mb-1">
                {formData.role === 'vendor' ? 'Kitchen / Shop Address' : 'Delivery Address'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none text-gray-400">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <textarea
                  name="address"
                  required
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                  className="pl-10 block w-full px-3 py-2 bg-gray-50 border border-orange-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green transition-all"
                  placeholder={
                    formData.role === 'vendor'
                      ? 'e.g. Shop 24, Balogun Market, Lagos Island'
                      : 'e.g. Apartment 4B, 12 Broad Street, Marina, Lagos'
                  }
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
                  <UserPlus className="h-4 w-4" /> Sign Up
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-orange hover:text-brand-orange-dark">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
