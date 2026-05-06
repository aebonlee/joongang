import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import SectionPage from '@/pages/public/SectionPage';
import ArticlePage from '@/pages/public/ArticlePage';
import SearchPage from '@/pages/public/SearchPage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import AuthCallbackPage from '@/pages/auth/AuthCallbackPage';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ArticleList from '@/pages/admin/articles/ArticleList';
import ArticleEditor from '@/pages/admin/articles/ArticleEditor';
import SectionManager from '@/pages/admin/sections/SectionManager';
import AdManager from '@/pages/admin/ads/AdManager';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="section/:slug" element={<SectionPage />} />
        <Route path="section/:slug/:subSlug" element={<SectionPage />} />
        <Route path="article/:slug" element={<ArticlePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="auth/callback" element={<AuthCallbackPage />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="articles" element={<ArticleList />} />
        <Route path="articles/write" element={<ArticleEditor />} />
        <Route path="articles/:id/edit" element={<ArticleEditor />} />
        <Route path="sections" element={<SectionManager />} />
        <Route path="ads" element={<AdManager />} />
      </Route>
    </Routes>
  );
}
