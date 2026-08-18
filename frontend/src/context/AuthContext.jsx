import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on reload
  const checkUser = async () => {
    try {
      const res = await API.get('/auth/me');
      if (res.data && res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      console.log('No active session found.');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  // Register
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data && res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data && res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await API.get('/auth/logout');
    } catch (err) {
      console.error('Logout error on server:', err);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      setLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email) => {
    try {
      const res = await API.post('/auth/forgotpassword', { email });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Request failed' };
    }
  };

  // Perform password reset
  const resetPassword = async (token, password) => {
    try {
      const res = await API.put(`/auth/resetpassword/${token}`, { password });
      return { success: true, message: res.data.message };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Reset failed' };
    }
  };

  // Verify email
  const verifyEmail = async (token) => {
    try {
      const res = await API.get(`/auth/verify/${token}`);
      if (res.data && res.data.success) {
        // Refresh local user state verification flag
        if (user) {
          setUser(prev => ({ ...prev, isVerified: true }));
        }
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Verification failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        requestPasswordReset,
        resetPassword,
        verifyEmail,
        checkUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
