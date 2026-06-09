import React, { createContext, useState, useEffect, useContext } from 'react';
import adminApi from '../services/adminApi';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      // If no token in storage, skip the network call entirely
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await adminApi.get('/admin/me');
        if (response.data.success) {
          setAdmin(response.data.admin);
        }
      } catch (error) {
        // Token invalid or expired — clean up silently
        setAdmin(null);
        localStorage.removeItem('adminToken');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await adminApi.post('/admin/login', { email, password });
      if (response.data.success) {
        // Store admin token separately from student token
        if (response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
        }
        setAdmin(response.data.admin);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Admin login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await adminApi.post('/admin/logout');
    } catch (error) {
      // ignore errors on logout
    } finally {
      localStorage.removeItem('adminToken');
      setAdmin(null);
    }
  };

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
