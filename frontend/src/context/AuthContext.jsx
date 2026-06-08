import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('accessToken') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If we have a token, simulate fetching current session user info
    if (token) {
      // In production, invoke api.get('/users/me')
      // For boilerplate setup, let's mock it
      setUser({
        id: 'mock-uuid-nandi',
        full_name: 'Nandeesh M N',
        username: 'nandeesh',
        email: 'nandi@gmail.com',
        role: 'student',
        department: 'Computer Science',
        academic_year: 'Sophomore',
      });
      localStorage.setItem('accessToken', token);
    } else {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
    setIsLoading(false);
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);

    // Trim whitespace to prevent invisible character issues
    const normalizedEmail = (email || '').trim().toLowerCase();
    const normalizedPassword = (password || '').trim();

    // Mock credentials check (MVP phase — replace with real API call later)
    if (normalizedEmail === 'nandi@gmail.com' && normalizedPassword === 'nandi123') {
      const mockAccessToken = 'mock-jwt-token-string';
      setToken(mockAccessToken);
      setIsLoading(false);
      toast.success('Welcome back, Nandeesh!');
      return { success: true };
    }

    setIsLoading(false);
    toast.error('Invalid email or password. Try: nandi@gmail.com / nandi123');
    return { success: false, error: 'Invalid credentials' };
  };

  const register = async (formData) => {
    setIsLoading(true);
    try {
      // Simulate registering
      const mockAccessToken = 'mock-jwt-token-registered';
      setToken(mockAccessToken);
      setUser({
        id: `mock-uuid-${Date.now()}`,
        full_name: formData.full_name,
        username: formData.username,
        email: formData.email,
        role: 'student',
        department: formData.department,
        academic_year: formData.academic_year,
      });
      toast.success('Registration complete! Welcome to CampusConnect.');
      return { success: true };
    } catch (error) {
      toast.error(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    toast.success('Logged out successfully.');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, isAuthenticated: !!token }}>
      {children}
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
