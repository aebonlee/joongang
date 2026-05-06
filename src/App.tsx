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
import PendingArticles from '@/pages/admin/articles/PendingArticles';
import PhotoArticles from '@/pages/admin/articles/PhotoArticles';
import VideoArticles from '@/pages/admin/articles/VideoArticles';
import SectionManager from '@/pages/admin/sections/SectionManager';
import AdManager from '@/pages/admin/ads/AdManager';
import AdSlotManager from '@/pages/admin/ads/AdSlotManager';
import AdvertiserManager from '@/pages/admin/ads/AdvertiserManager';
import AdTemplateManager from '@/pages/admin/ads/AdTemplateManager';
import CommentManager from '@/pages/admin/comments/CommentManager';
import StaffManager from '@/pages/admin/staff/StaffManager';
import NewsletterManager from '@/pages/admin/newsletter/NewsletterManager';
import TipManager from '@/pages/admin/tips/TipManager';
import PressRelease from '@/pages/admin/distribution/PressRelease';
import NewswireManager from '@/pages/admin/distribution/NewswireManager';
import SiteSettings from '@/pages/admin/settings/SiteSettings';

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
        {/* 뉴스관리 */}
        <Route path="articles" element={<ArticleList />} />
        <Route path="articles/write" element={<ArticleEditor />} />
        <Route path="articles/:id/edit" element={<ArticleEditor />} />
        <Route path="articles/pending" element={<PendingArticles />} />
        <Route path="articles/photo" element={<PhotoArticles />} />
        <Route path="articles/video" element={<VideoArticles />} />
        {/* 뉴스레터 */}
        <Route path="newsletter" element={<NewsletterManager />} />
        {/* 콘텐츠 */}
        <Route path="tips" element={<TipManager />} />
        <Route path="comments" element={<CommentManager />} />
        <Route path="press-release" element={<PressRelease />} />
        <Route path="newswire" element={<NewswireManager />} />
        {/* 광고관리 */}
        <Route path="ads" element={<AdManager />} />
        <Route path="ads/slots" element={<AdSlotManager />} />
        <Route path="ads/advertisers" element={<AdvertiserManager />} />
        <Route path="ads/templates" element={<AdTemplateManager />} />
        {/* 설정 */}
        <Route path="sections" element={<SectionManager />} />
        <Route path="staff" element={<StaffManager />} />
        <Route path="settings" element={<SiteSettings />} />
      </Route>
    </Routes>
  );
}
