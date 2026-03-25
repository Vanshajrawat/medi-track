import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user on app mount
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data.data);
      setError(null);
    } catch (err) {
      console.log('User not authenticated');
      setUser(null);
      setError(null); // It's okay if user is not logged in
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      setUser(response.data.data.user);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, role = 'patient') => {
    try {
      setLoading(true);
      const response = await axiosInstance.post('/auth/register', {
        name,
        email,
        password,
        role,
      });
      setUser(response.data.data.user);
      setError(null);
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await axiosInstance.post('/auth/logout');
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    fetchCurrentUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
