import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '@/layouts/PublicLayout';
import { AdminLayout } from '@/layouts/AdminLayout';
import { ProtectedRoute, EditorRoute } from '@/components/ProtectedRoute';

// Public Pages
import HomePage from '@/pages/public/HomePage';
import SectionPage from '@/pages/public/SectionPage';
import ArticlePage from '@/pages/public/ArticlePage';
import SearchPage from '@/pages/public/SearchPage';
import TipPage from '@/pages/public/TipPage';
import EditionPage from '@/pages/public/EditionPage';
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
import MemberManager from '@/pages/admin/members/MemberManager';
import AdBilling from '@/pages/admin/ads/AdBilling';
import VisitorStats from '@/pages/admin/VisitorStats';
import EditionManager from '@/pages/admin/editions/EditionManager';

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
        <Route path="tip" element={<TipPage />} />
        <Route path="edition" element={<EditionPage />} />
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
        <Route path="stats" element={<EditorRoute><VisitorStats /></EditorRoute>} />
        {/* 뉴스관리 — 기자 이상 접근 가능 */}
        <Route path="articles" element={<ArticleList />} />
        <Route path="articles/write" element={<ArticleEditor />} />
        <Route path="articles/:id/edit" element={<ArticleEditor />} />
        <Route path="articles/pending" element={<PendingArticles />} />
        <Route path="articles/photo" element={<PhotoArticles />} />
        <Route path="articles/video" element={<VideoArticles />} />
        {/* 뉴스레터 — 편집장 이상 */}
        <Route path="newsletter" element={<EditorRoute><NewsletterManager /></EditorRoute>} />
        {/* 콘텐츠 — 편집장 이상 */}
        <Route path="tips" element={<EditorRoute><TipManager /></EditorRoute>} />
        <Route path="comments" element={<EditorRoute><CommentManager /></EditorRoute>} />
        <Route path="press-release" element={<EditorRoute><PressRelease /></EditorRoute>} />
        <Route path="newswire" element={<EditorRoute><NewswireManager /></EditorRoute>} />
        {/* 광고관리 — 편집장 이상 */}
        <Route path="ads" element={<EditorRoute><AdManager /></EditorRoute>} />
        <Route path="ads/slots" element={<EditorRoute><AdSlotManager /></EditorRoute>} />
        <Route path="ads/advertisers" element={<EditorRoute><AdvertiserManager /></EditorRoute>} />
        <Route path="ads/templates" element={<EditorRoute><AdTemplateManager /></EditorRoute>} />
        <Route path="ads/billing" element={<AdBilling />} />
        {/* 회원관리 — 편집장 이상 */}
        <Route path="members" element={<EditorRoute><MemberManager /></EditorRoute>} />
        {/* 지면관리 — 편집장 이상 */}
        <Route path="editions" element={<EditorRoute><EditionManager /></EditorRoute>} />
        {/* 설정 — 기존 가드 유지 (superadmin 전용) */}
        <Route path="sections" element={<SectionManager />} />
        <Route path="staff" element={<StaffManager />} />
        <Route path="settings" element={<SiteSettings />} />
      </Route>
    </Routes>
  );
}
