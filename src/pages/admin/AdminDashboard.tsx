import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import './AdminDashboard.css';

interface Stats {
  todayArticles: number;
  totalArticles: number;
  pendingArticles: number;
  totalComments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    todayArticles: 0,
    totalArticles: 0,
    pendingArticles: 0,
    totalComments: 0,
  });
  const [recentArticles, setRecentArticles] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
    fetchRecentArticles();
  }, []);

  async function fetchStats() {
    const today = new Date().toISOString().split('T')[0];

    const [totalRes, todayRes, pendingRes, commentsRes] = await Promise.all([
      supabase.from('joongang_articles').select('id', { count: 'exact', head: true }),
      supabase.from('joongang_articles').select('id', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('joongang_articles').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('joongang_comments').select('id', { count: 'exact', head: true }),
    ]);

    setStats({
      totalArticles: totalRes.count || 0,
      todayArticles: todayRes.count || 0,
      pendingArticles: pendingRes.count || 0,
      totalComments: commentsRes.count || 0,
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
