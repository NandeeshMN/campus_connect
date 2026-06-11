import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';

// Public pages
import LandingPage from './pages/Landing/LandingPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import AuthPage from './pages/Auth/AuthPage';

// Portal pages (protected)
import HomePage from './pages/Home/HomePage';
import ExplorePage from './pages/Explore/ExplorePage';
import ProfilePage from './pages/Profile/ProfilePage';
import EditProfilePage from './pages/Profile/EditProfilePage';
import EventsPage from './pages/Events/EventsPage';
import MessagesPage from './pages/Messages/MessagesPage';
import SettingsPage from './pages/Settings/SettingsPage';
import ResourcesPage from './pages/Resources/ResourcesPage';

// Admin Pages
import AdminLogin from './pages/Admin/Login';
import AdminDashboard from './pages/Admin/Dashboard';
import StubPage from './pages/Admin/StubPage';
import Users from './pages/Admin/Users';
import Posts from './pages/Admin/Posts';
import Announcements from './pages/Admin/Announcements';
import Reports from './pages/Admin/Reports';
import Resources from './pages/Admin/Resources';
import AdminEvents from './pages/Admin/Events';

function App() {
  return (
    <ThemeProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Admin Routes - Independent from Student Auth */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/users" element={<AdminProtectedRoute><Users /></AdminProtectedRoute>} />
              <Route path="/admin/posts" element={<AdminProtectedRoute><Posts /></AdminProtectedRoute>} />
              <Route path="/admin/resources" element={<AdminProtectedRoute><Resources /></AdminProtectedRoute>} />
              <Route path="/admin/events" element={<AdminProtectedRoute><AdminEvents /></AdminProtectedRoute>} />
              <Route path="/admin/reports" element={<AdminProtectedRoute><Reports /></AdminProtectedRoute>} />
              <Route path="/admin/announcements" element={<AdminProtectedRoute><Announcements /></AdminProtectedRoute>} />
              
              {/* Public Routes */}
              <Route path="/" element={<AuthPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Portal Routes */}
              <Route path="/home" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
              <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />

              {/* Placeholder stubs for future pages */}
              <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1e293b',
                  color: '#fff',
                  borderRadius: '12px',
                  fontSize: '14px',
                  padding: '12px 16px',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error:   { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
              }}
            />
          </Router>
        </AuthProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  );
}

export default App;
