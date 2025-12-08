// src/contexts/AuthContext.jsx - CORRECTED VERSION (fix the login function)
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedUserType = localStorage.getItem('userType');
        const token = localStorage.getItem('token');

        if (token && savedUser && savedUserType) {
          setUser(JSON.parse(savedUser));
          setUserType(savedUserType);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    setUser(null);
    setUserType(null);
  };

  const login = async (credentials, type = 'farmer') => {
    try {
      let response;

      if (type === 'admin') {
        response = await authAPI.adminLogin(credentials);
      } else {
        response = await authAPI.farmerLogin(credentials);
      }

      console.log('Login Response:', response.data);

      const {
        token,
        user: userDataFromResponse,
        farmer: farmerData,
        admin: adminData,
        message: responseMessage,
      } = response.data || {};

      const userData = userDataFromResponse || farmerData || adminData;

      // FIXED: Support farmer field and ensure user data exists
      if (token && userData) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userType', type);

        setUser(userData);
        setUserType(type);

        const welcomeName = userData.email || userData.name || 'back';
        toast.success(`Welcome ${welcomeName}!`);

        if (type === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }

        return { success: true, user: userData, message: responseMessage };
      }

      const errorMsg =
        responseMessage ||
        response?.data?.message ||
        'Login failed. Please check your credentials.';
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } catch (error) {
      console.error('Login error:', error);
      
      // Extract error message from different possible locations
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        error: error.response?.data 
      };
    }
  };

  const logout = async () => {
    try {
      if (userType === 'admin') {
        await authAPI.adminLogout();
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Always clear local storage and redirect
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.farmerSignup(userData);

      const { success, message, farmer } = response.data || {};

      if (success) {
        const successMessage =
          message || 'Account created successfully. Please log in.';
        toast.success(successMessage);
        return { success: true, user: farmer, message: successMessage };
      }

      const errorMsg = message || response.data?.message || 'Signup failed';
      toast.error(errorMsg);
      return { success: false, message: errorMsg };
    } catch (error) {
      console.error('Signup error:', error);
      
      let errorMessage = 'Signup failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        error: error.response?.data 
      };
    }
  };

  const value = {
    user,
    userType,
    loading,
    login,
    logout,
    signup,
    isAuthenticated: !!user && !!userType,
    isAdmin: userType === 'admin',
    isFarmer: userType === 'farmer'
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};