import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('zm_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('zm_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('zm_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('zm_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Session expired or invalid', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success && res.data) {
      const authData = res.data;
      setToken(authData.token);
      localStorage.setItem('zm_token', authData.token);

      const userInfo = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        mobileNumber: authData.mobileNumber,
        role: authData.role,
      };
      setUser(userInfo);
      localStorage.setItem('zm_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const authData = res.data;
      setToken(authData.token);
      localStorage.setItem('zm_token', authData.token);

      const userInfo = {
        id: authData.id,
        fullName: authData.fullName,
        email: authData.email,
        mobileNumber: authData.mobileNumber,
        role: authData.role,
      };
      setUser(userInfo);
      localStorage.setItem('zm_user', JSON.stringify(userInfo));
      return userInfo;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('zm_token');
    localStorage.removeItem('zm_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
