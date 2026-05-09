import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import './AdminDashboard.css';

interface Stats {
  todayArticles: number;
  totalArticles: number;
  pendingArticles: number;
  totalComments: number;
  todayVisitors: number;
  totalViews: number;
}

type LayoutType = 'auto' | 'layout-a' | 'layout-b' | 'layout-c' | 'layout-d' | 'layout-e' | 'layout-f';

const LAYOUT_OPTIONS: { value: LayoutType; label: string; desc: string }[] = [
  { value: 'auto', label: '자동 (4시간 교체)', desc: '4시간마다 A~F를 순환합니다' },
  { value: 'layout-a', label: 'A: 헤드라인 + 그리드', desc: '큰 헤드라인 카드 + 2x2 주요뉴스 그리드' },
  { value: 'layout-b', label: 'B: 신문 1면', desc: '좌측 대형 기사 + 우측 5개 기사 목록' },
  { value: 'layout-c', label: 'C: 매거진 3컬럼', desc: '3열 카드 그리드 매거진 스타일' },
  { value: 'layout-d', label: 'D: 풀폭 히어로', desc: '전면 이미지 히어로 + 수평 스크롤 카드' },
  { value: 'layout-e', label: 'E: 뉴스포털', desc: '좌측 대형 이미지 + 우측 기사 목록' },
  { value: 'layout-f', label: 'F: 모자이크 타일', desc: '1대형 + 2중형 타일 조합' },
];

export default function AdminDashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<Stats>({
    todayArticles: 0,
    totalArticles: 0,
    pendingArticles: 0,
    totalComments: 0,
    todayVisitors: 0,
    totalViews: 0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('auto');
  const [layoutSaving, setLayoutSaving] = useState(false);
  const [layoutMsg, setLayoutMsg] = useState('');

  useEffect(() => {
    fetchStats();
    fetchRecentArticles();
    fetchCurrentLayout();
  }, []);

  async function fetchStats() {
    const today = new Date().toISOString().split('T')[0];

    const [totalRes, todayRes, pendingRes, commentsRes, todayVisitorRes, totalViewsRes] = await Promise.all([
      supabase.from('joongang_articles').select('id', { count: 'exact', head: true }),
      supabase.from('joongang_articles').select('id', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('joongang_articles').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('joongang_comments').select('id', { count: 'exact', head: true }),
      supabase.from('joongang_visitor_stats').select('page_views').eq('stat_date', today),
      supabase.from('joongang_articles').select('view_count').eq('status', 'published'),
    ]);

    const todayVisitors = todayVisitorRes.data
      ? todayVisitorRes.data.reduce((sum: number, r: { page_views: number }) => sum + (r.page_views || 0), 0)
      : 0;
    const totalViews = totalViewsRes.data
      ? totalViewsRes.data.reduce((sum: number, r: { view_count: number }) => sum + (r.view_count || 0), 0)
      : 0;

    setStats({
      totalArticles: totalRes.count || 0,
      todayArticles: todayRes.count || 0,
      pendingArticles: pendingRes.count || 0,
      totalComments: commentsRes.count || 0,
      todayVisitors,
      totalViews,
    });
  }

  async function fetchRecentArticles() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('id, title, status, author_name, created_at')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setRecentArticles(data);
  }

  async function fetchCurrentLayout() {
    const { data } = await supabase
      .from('joongang_layout_settings')
      .select('layout_config')
      .eq('page_type', 'main')
      .single();
    if (data?.layout_config?.home_layout) {
      setSelectedLayout(data.layout_config.home_layout as LayoutType);
    } else {
      setSelectedLayout('auto');
    }
  }

  async function saveLayout(layout: LayoutType) {
    setLayoutSaving(true);
    setSelectedLayout(layout);

    const configValue = layout === 'auto' ? {} : { home_layout: layout };

    // Try update first
    const { data: existing } = await supabase
      .from('joongang_layout_settings')
      .select('id, layout_config')
      .eq('page_type', 'main')
      .single();

    if (existing) {
      const merged = { ...existing.layout_config, ...configValue };
      if (layout === 'auto') delete merged.home_layout;
      await supabase
        .from('joongang_layout_settings')
        .update({ layout_config: merged })
        .eq('id', existing.id);
    } else {
      await supabase
        .from('joongang_layout_settings')
        .insert({ page_type: 'main', layout_config: configValue, header_style: 'style_b' });
    }

    setLayoutSaving(false);
    setLayoutMsg('레이아웃이 변경되었습니다.');
    setTimeout(() => setLayoutMsg(''), 3000);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const statusLabel: Record<string, string> = {
    draft: '작성중',
    pending: '대기',
    published: '발행',
    scheduled: '예약',
    archived: '보관',
  };

  return (
    <div className="admin-dashboard">
      <h2 className="dashboard-title">대시보드</h2>

      {/* Stats cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.todayArticles}</div>
          <div className="stat-label">오늘 등록</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalArticles}</div>
          <div className="stat-label">전체 기사</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.pendingArticles}</div>
          <div className="stat-label">출력 대기</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalComments}</div>
          <div className="stat-label">총 댓글</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.todayVisitors.toLocaleString()}</div>
          <div className="stat-label">오늘 방문자</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalViews.toLocaleString()}</div>
          <div className="stat-label">총 조회수</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        <Link to="/admin/articles/write" className="btn btn-primary">
          + 기사 등록
        </Link>
        <Link to="/admin/articles" className="btn btn-outline">
          기사 목록
        </Link>
        <Link to="/admin/ads" className="btn btn-outline">
          광고 관리
        </Link>
      </div>

      {/* Layout selector */}
      {isAdmin && (
        <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 600 }}>메인 페이지 레이아웃</h3>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px' }}>
            홈페이지 디자인을 선택합니다. "자동"은 4시간마다 A~F를 순환합니다.
          </p>
          <div className="layout-selector-grid">
            {LAYOUT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`layout-option ${selectedLayout === opt.value ? 'layout-option-active' : ''}`}
                onClick={() => saveLayout(opt.value)}
                disabled={layoutSaving}
              >
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </button>
            ))}
          </div>
          {layoutMsg && (
            <div style={{ marginTop: '12px', padding: '8px 12px', background: '#ecfdf5', color: '#059669', borderRadius: '6px', fontSize: '13px' }}>
              {layoutMsg}
            </div>
          )}
        </div>
      )}

      {/* Recent articles */}
      <div className="card">
        <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>최근 기사</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>상태</th>
              <th>등록일</th>
            </tr>
          </thead>
          <tbody>
            {recentArticles.map((article) => (
              <tr key={article.id}>
                <td>
                  <Link to={`/admin/articles/${article.id}/edit`} className="table-link">
                    {article.title}
                  </Link>
                </td>
                <td>{article.author_name || '-'}</td>
                <td>
                  <span className={`badge badge-${article.status === 'published' ? 'green' : article.status === 'pending' ? 'orange' : 'gray'}`}>
                    {statusLabel[article.status] || article.status}
                  </span>
                </td>
                <td>{formatDate(article.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
