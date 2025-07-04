import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setCurrentUser(response.data);
        } catch (error) {
          console.error('Auth validation error:', error);
          localStorage.removeItem('token');
          setCurrentUser(null);
        }
      }
      
      setLoading(false);
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email, password, role = null) => {
    try {
      const endpoint = role === 'admin' 
        ? `${API_URL}/api/auth/admin/login`
        : `${API_URL}/api/auth/login`;
      
      const response = await axios.post(endpoint, { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        setCurrentUser(response.data.user);
        return response.data;
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}