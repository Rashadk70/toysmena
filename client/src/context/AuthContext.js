import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../store/slices/authSlice';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (!token && storedToken) {
      // If we have a token but no user, we should fetch the user data
      // This would be a good place to add a fetchUserProfile action
    }
    setLoading(false);
  }, [token]);

  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, isAuthenticated: !!token }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
