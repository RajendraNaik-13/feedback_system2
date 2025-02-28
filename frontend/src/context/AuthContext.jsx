// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Set up axios defaults
  axios.defaults.baseURL = 'http://localhost:8000/api';
  
  // Add token to all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Check if user is already logged in
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('/auth/me/');
        setCurrentUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Auth verification failed:', error);
        logout();
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const register = async (username, email, password, password2, role) => {
    setError('');
    try {
      const response = await axios.post('/auth/register/', {
        username,
        email,
        password,
        password2,
        role
      });
      
      setToken(response.data.token);
      setCurrentUser(response.data.user);
      navigate('/dashboard');
      return response.data;
    } catch (error) {
      setError(error.response?.data || 'Registration failed. Please try again.');
      throw error;
    }
  };

  const login = async (username, password) => {
    setError('');
    try {
      const response = await axios.post('/auth/login/', {
        username,
        password
      });
      
      setToken(response.data.token);
      setCurrentUser(response.data.user);
      navigate('/dashboard');
      return response.data;
    } catch (error) {
      setError(error.response?.data?.error || 'Login failed. Please check your credentials.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post('/auth/logout/');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken('');
      setCurrentUser(null);
      navigate('/login');
    }
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.patch('/auth/me/', userData);
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data || 'Profile update failed');
      throw error;
    }
  };

  const value = {
    currentUser,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAdmin: currentUser?.role === 'admin',
    isModerator: currentUser?.role === 'moderator',
    isContributor: currentUser?.role === 'contributor',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;