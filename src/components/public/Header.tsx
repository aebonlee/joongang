import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Section } from '@/types';
import './Header.css';

export function Header() {
  const { user, staff, signOut } = useAuth();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    const { data } = await supabase
      .from('joongang_sections')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)
      .order('sort_order');
    if (data) setSections(data);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });

  return (
    <header className="site-header">
      {/* Top bar */}
      <div className="header-topbar">
        <div className="container flex items-center justify-between">
          <span className="header-date">{dateStr}</span>
          <div className="header-actions">
            {user ? (
              <>
                {staff && (
                  <Link to="/admin" className="header-link">관리자</Link>
                )}
                <button onClick={signOut} className="header-link">로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-link">로그인</Link>
                <Link to="/register" className="header-link">회원가입</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logo area */}
      <div className="header-logo-area">
        <div className="container flex items-center justify-between">
          <Link to="/" className="header-logo">
            <img src="/logo.svg" alt="중앙일보 워싱턴" className="header-logo-img" />
          </Link>
          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">검색</button>
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <div className="container">
          <button
            className="mobile-menu-btn hide-desktop"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰ 메뉴
          </button>
          <ul className={`nav-list ${mobileMenuOpen ? 'open' : ''}`}>
            <li className="nav-item">
              <Link to="/">홈</Link>
            </li>
            {sections.map((section) => (
              <li key={section.id} className="nav-item">
                <Link to={`/section/${section.slug}`}>{section.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
