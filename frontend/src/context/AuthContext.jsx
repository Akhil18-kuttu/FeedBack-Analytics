import { createContext, useState, useEffect } from 'react';
import API from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');

    if (accessToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user: userData } = res.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const adminLogin = async (email, password) => {
    const res = await API.post('/auth/admin-login', { email, password });
    const { accessToken, refreshToken, user: userData } = res.data.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    return userData;
  };

  const register = async (name, email, password, confirmPassword) => {
    const res = await API.post('/auth/register', { name, email, password, confirmPassword });
    return res.data;
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const res = await API.get('/auth/me');
      const userData = res.data.data;
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      adminLogin,
      register,
      logout,
      refreshProfile,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};
