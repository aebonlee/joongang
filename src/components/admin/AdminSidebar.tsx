import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import './AdminSidebar.css';

interface MenuItem {
  path: string;
  label: string;
  icon: string;
}

interface MenuGroup {
  group: string;
  icon: string;
  items: MenuItem[];
}

const menuItems: MenuGroup[] = [
  {
    group: '대시보드',
    icon: '📊',
    items: [
      { path: '/admin', label: '대시보드', icon: '📊' },
      { path: '/admin/stats', label: '방문 통계', icon: '📈' },
    ],
  },
  {
    group: '뉴스관리',
    icon: '📰',
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
    icon: '📧',
    items: [
      { path: '/admin/newsletter', label: '뉴스레터 신청 관리', icon: '📧' },
    ],
  },
  {
    group: '콘텐츠',
    icon: '💬',
    items: [
      { path: '/admin/tips', label: '기사제보 관리', icon: '💡' },
      { path: '/admin/comments', label: '뉴스댓글 관리', icon: '💬' },
      { path: '/admin/press-release', label: '보도기사 제공', icon: '📤' },
      { path: '/admin/newswire', label: '뉴스와이어 제공', icon: '🔗' },
    ],
  },
  {
    group: '광고관리',
    icon: '📢',
    items: [
      { path: '/admin/ads', label: '광고 현황', icon: '📢' },
      { path: '/admin/ads/slots', label: '슬롯 관리', icon: '🔲' },
      { path: '/admin/ads/advertisers', label: '광고주 관리', icon: '🏢' },
      { path: '/admin/ads/templates', label: '디자인 템플릿', icon: '🎨' },
      { path: '/admin/ads/billing', label: '광고 정산', icon: '💰' },
    ],
  },
  {
    group: '회원관리',
    icon: '👤',
    items: [
      { path: '/admin/members', label: '회원 관리', icon: '👤' },
      { path: '/admin/staff', label: '스태프 관리', icon: '👥' },
    ],
  },
  {
    group: '설정',
    icon: '⚙️',
    items: [
      { path: '/admin/sections', label: '섹션 관리', icon: '📑' },
      { path: '/admin/settings', label: '환경설정', icon: '⚙️' },
    ],
  },
];

// 역할별 접근 가능 메뉴 그룹
const REPORTER_GROUPS = ['대시보드', '뉴스관리'];
const EDITOR_GROUPS = ['대시보드', '뉴스관리', '뉴스레터', '콘텐츠', '광고관리', '회원관리'];
// superadmin: 모든 그룹

// 편집장에게 숨길 개별 메뉴 항목
const ADMIN_ONLY_ITEMS = ['/admin/staff', '/admin/settings'];

export function AdminSidebar() {
  const location = useLocation();
  const { staff, isAdmin, isEditor } = useAuth();

  // 역할별 메뉴 필터링
  const filteredMenuItems = menuItems
    .filter((group) => {
      if (isAdmin) return true;
      if (isEditor) return EDITOR_GROUPS.includes(group.group);
      return REPORTER_GROUPS.includes(group.group);
    })
    .map((group) => {
      if (isAdmin) return group;
      // 편집장: 관리자 전용 항목 제외
      return {
        ...group,
        items: group.items.filter((item) => !ADMIN_ONLY_ITEMS.includes(item.path)),
      };
    })
    .filter((group) => group.items.length > 0);

  // Determine which groups should be open initially based on current path
  const getInitialOpenGroups = () => {
    const open: Record<string, boolean> = {};
    filteredMenuItems.forEach((group) => {
      const isActive = group.items.some((item) => location.pathname === item.path);
      open[group.group] = isActive;
    });
    // Always open dashboard
    open['대시보드'] = true;
    return open;
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(getInitialOpenGroups);

  function toggleGroup(groupName: string) {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  }

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <Link to="/admin" className="sidebar-logo">
          <img src="/logo_thejoongang.png" alt="중앙일보" className="sidebar-logo-img" />
          <span className="logo-sub">관리자</span>
        </Link>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">
          {staff?.name?.charAt(0) || '?'}
        </div>
        <div className="user-info">
          <span className="user-name">{staff?.name || '관리자'}</span>
          <span className="user-role">
            {staff?.role === 'superadmin' ? '최고관리자' : staff?.role === 'editor' ? '편집장' : staff?.role === 'reporter' ? '기자' : 'staff'}
          </span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {filteredMenuItems.map((group) => {
          const isOpen = openGroups[group.group] ?? false;
          const hasActiveItem = group.items.some((item) => location.pathname === item.path);

          return (
            <div key={group.group} className="nav-group">
              <button
                className={`nav-group-header ${hasActiveItem ? 'has-active' : ''}`}
                onClick={() => toggleGroup(group.group)}
              >
                <span className="nav-group-icon">{group.icon}</span>
                <span className="nav-group-title">{group.group}</span>
                <span className={`nav-group-arrow ${isOpen ? 'open' : ''}`}>▾</span>
              </button>
              <ul className={`nav-group-list ${isOpen ? 'open' : ''}`}>
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
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Link to="/" className="sidebar-back-link">← 사이트로 이동</Link>
      </div>
    </aside>
  );
}
