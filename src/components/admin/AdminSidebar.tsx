import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import './AdminSidebar.css';

const menuItems = [
  {
    group: '대시보드',
    items: [
      { path: '/admin', label: '대시보드', icon: '📊' },
    ],
  },
  {
    group: '뉴스관리',
    items: [
      { path: '/admin/articles', label: '뉴스관리', icon: '📰' },
      { path: '/admin/articles/write', label: '뉴스등록', icon: '✏️' },
      { path: '/admin/articles/pending', label: '출력대기 뉴스', icon: '⏳' },
      { path: '/admin/articles/photo', label: '포토 뉴스관리', icon: '📷' },
      { path: '/admin/articles/video', label: '동영상 뉴스관리', icon: '🎬' },
    ],
  },
  {
    group: '뉴스레터',
    items: [
      { path: '/admin/newsletter', label: '뉴스레터 신청 관리', icon: '📧' },
    ],
  },
  {
    group: '콘텐츠',
    items: [
      { path: '/admin/tips', label: '기사제보 관리', icon: '💡' },
      { path: '/admin/comments', label: '뉴스댓글 관리', icon: '💬' },
      { path: '/admin/press-release', label: '보도기사 제공', icon: '📤' },
      { path: '/admin/newswire', label: '뉴스와이어 제공', icon: '🔗' },
    ],
  },
  {
    group: '광고관리',
    items: [
      { path: '/admin/ads', label: '광고 현황', icon: '📢' },
      { path: '/admin/ads/slots', label: '슬롯 관리', icon: '🔲' },
      { path: '/admin/ads/advertisers', label: '광고주 관리', icon: '🏢' },
      { path: '/admin/ads/templates', label: '디자인 템플릿', icon: '🎨' },
    ],
  },
  {
    group: '설정',
    items: [
      { path: '/admin/sections', label: '섹션 관리', icon: '📑' },
      { path: '/admin/staff', label: '스태프 관리', icon: '👥' },
      { path: '/admin/settings', label: '환경설정', icon: '⚙️' },
    ],
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { staff } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <Link to="/admin" className="sidebar-logo">
          <span className="logo-text">중앙뉴스</span>
          <span className="logo-sub">관리자</span>
        </Link>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {staff?.name?.charAt(0) || '?'}
        </div>
        <div className="user-info">
          <span className="user-name">{staff?.name || '관리자'}</span>
          <span className="user-role">{staff?.role || 'staff'}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((group) => (
          <div key={group.group} className="nav-group">
            <h4 className="nav-group-title">{group.group}</h4>
            <ul className="nav-group-list">
              {group.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-label">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="sidebar-back-link">← 사이트로 이동</Link>
      </div>
    </aside>
  );
}
