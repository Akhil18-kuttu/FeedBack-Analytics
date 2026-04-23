import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layouts
import UserLayout from './components/layout/UserLayout';
import AdminLayout from './components/layout/AdminLayout';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import FeedbackForm from './pages/user/FeedbackForm';
import MyFeedbacks from './pages/user/MyFeedbacks';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import ProductAnalysisPage from './pages/admin/ProductAnalysisPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminFeedbacksPage from './pages/admin/AdminFeedbacksPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '14px',
              boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* User Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="user">
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/feedback/:productId" element={<FeedbackForm />} />
            <Route path="/my-feedbacks" element={<MyFeedbacks />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/products/:productId/analysis" element={<ProductAnalysisPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/feedbacks" element={<AdminFeedbacksPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
