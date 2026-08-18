import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, Menu, X, User, ShieldAlert } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) => `
    px-3 py-2 rounded-md text-sm font-semibold transition-all duration-300
    ${isActive(path) 
      ? 'bg-brand-green text-white shadow-md' 
      : 'text-brand-green-dark hover:bg-orange-100/50 hover:text-brand-green'}
  `;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-orange-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer group">
              <span className="text-2xl animate-pulse-subtle">🍛</span>
              <span className="text-2xl font-extrabold font-sans tracking-tight bg-gradient-to-r from-brand-green to-brand-orange bg-clip-text text-transparent group-hover:from-brand-orange group-hover:to-brand-green transition-all duration-500">
                Naija Bite
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className={linkClass('/')}>Home</Link>
            <Link to="/menu" className={linkClass('/menu')}>Browse Menu</Link>

            {user ? (
              <>
                {user.role === 'vendor' ? (
                  <Link to="/vendor-dashboard" className={linkClass('/vendor-dashboard')}>
                    Vendor Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/orders" className={linkClass('/orders')}>My Orders</Link>
                    <Link to="/cart" className="relative p-2 text-brand-green-dark hover:text-brand-orange transition-colors">
                      <ShoppingCart className="h-6 w-6" />
                      {getCartCount() > 0 && (
                        <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white animate-bounce">
                          {getCartCount()}
                        </span>
                      )}
                    </Link>
                  </>
                )}

                <div className="h-6 w-[1px] bg-orange-100" />

                <div className="flex items-center gap-2">
                  <div className="flex flex-col text-right">
                    <span className="text-sm font-bold text-gray-800 leading-tight">{user.name}</span>
                    <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider">{user.role}</span>
                  </div>
                  <div className="bg-orange-100 p-2 rounded-full border border-orange-200">
                    <User className="h-4 w-4 text-brand-green" />
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="ml-2 flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="h-6 w-[1px] bg-orange-100" />
                <Link to="/login" className="text-sm font-bold text-brand-green hover:text-brand-green-light px-3 py-2">
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-brand-orange hover:bg-brand-orange-dark text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            {user && user.role === 'customer' && (
              <Link to="/cart" className="relative p-2 text-brand-green-dark hover:text-brand-orange transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                    {getCartCount()}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-green-dark hover:bg-orange-50 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-orange-100 bg-white py-4 px-6 space-y-3 animate-fade-in">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-orange-50"
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-orange-50"
          >
            Browse Menu
          </Link>

          {user ? (
            <>
              {user.role === 'vendor' ? (
                <Link
                  to="/vendor-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-orange-50"
                >
                  Vendor Dashboard
                </Link>
              ) : (
                <Link
                  to="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-bold text-gray-800 hover:bg-orange-50"
                >
                  My Orders
                </Link>
              )}

              <hr className="border-orange-100" />
              
              <div className="px-3 py-2 flex items-center gap-3">
                <div className="bg-orange-100 p-2 rounded-full">
                  <User className="h-5 w-5 text-brand-green" />
                </div>
                <div>
                  <div className="font-bold text-gray-800">{user.name}</div>
                  <div className="text-xs text-brand-orange uppercase font-bold tracking-wider">{user.role}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-bold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <hr className="border-orange-100" />
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-bold text-brand-green hover:bg-orange-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2.5 px-4 rounded-lg shadow"
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}

      {/* Verification Notice Banner */}
      {user && !user.isVerified && (
        <div className="bg-amber-500 text-white text-xs font-semibold py-2 px-4 flex items-center justify-center gap-2">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>Your account is unverified. Check your email for a verification link to unlock all ordering actions.</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
