import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import './VisitorStats.css';

interface DailyStat {
  date: string;
  views: number;
}

interface DeviceStat {
  device: string;
  views: number;
}

interface ReferrerStat {
  domain: string;
  views: number;
}

interface PopularArticle {
  id: string;
  title: string;
  view_count: number;
  published_at: string | null;
}

export default function VisitorStats() {
  const [loading, setLoading] = useState(true);
  const [todayViews, setTodayViews] = useState(0);
  const [yesterdayViews, setYesterdayViews] = useState(0);
  const [weekViews, setWeekViews] = useState(0);
  const [monthViews, setMonthViews] = useState(0);
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([]);
  const [deviceStats, setDeviceStats] = useState<DeviceStat[]>([]);
  const [referrerStats, setReferrerStats] = useState<ReferrerStat[]>([]);
  const [popularArticles, setPopularArticles] = useState<PopularArticle[]>([]);

  useEffect(() => {
    fetchAllStats();
  }, []);

  async function fetchAllStats() {
    setLoading(true);
    await Promise.all([
      fetchSummary(),
      fetchDailyChart(),
      fetchDeviceStats(),
      fetchReferrerStats(),
      fetchPopularArticles(),
    ]);
    setLoading(false);
  }

  async function fetchSummary() {
    const today = new Date();
    const todayStr = formatDateISO(today);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatDateISO(yesterday);

    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    const weekAgoStr = formatDateISO(weekAgo);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthStartStr = formatDateISO(monthStart);

    const [todayRes, yesterdayRes, weekRes, monthRes] = await Promise.all([
      supabase.from('joongang_visitor_stats').select('page_views').eq('stat_date', todayStr),
      supabase.from('joongang_visitor_stats').select('page_views').eq('stat_date', yesterdayStr),
      supabase.from('joongang_visitor_stats').select('page_views').gte('stat_date', weekAgoStr).lte('stat_date', todayStr),
      supabase.from('joongang_visitor_stats').select('page_views').gte('stat_date', monthStartStr).lte('stat_date', todayStr),
    ]);

    setTodayViews(sumViews(todayRes.data));
    setYesterdayViews(sumViews(yesterdayRes.data));
    setWeekViews(sumViews(weekRes.data));
    setMonthViews(sumViews(monthRes.data));
  }

  async function fetchDailyChart() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const { data } = await supabase
      .from('joongang_visitor_stats')
      .select('stat_date, page_views')
      .gte('stat_date', formatDateISO(weekAgo))
      .lte('stat_date', formatDateISO(today));

    // 날짜별 합산
    const map: Record<string, number> = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekAgo);
      d.setDate(d.getDate() + i);
      map[formatDateISO(d)] = 0;
    }
    data?.forEach((row) => {
      const key = row.stat_date;
      map[key] = (map[key] || 0) + (row.page_views || 0);
    });

    setDailyStats(
      Object.entries(map).map(([date, views]) => ({ date, views }))
    );
  }

  async function fetchDeviceStats() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const { data } = await supabase
      .from('joongang_visitor_stats')
      .select('device_type, page_views')
      .gte('stat_date', formatDateISO(weekAgo))
      .lte('stat_date', formatDateISO(today));

    const map: Record<string, number> = { desktop: 0, mobile: 0 };
    data?.forEach((row) => {
      const key = row.device_type || 'desktop';
      map[key] = (map[key] || 0) + (row.page_views || 0);
    });

    setDeviceStats(
      Object.entries(map).map(([device, views]) => ({ device, views }))
    );
  }

  async function fetchReferrerStats() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);

    const { data } = await supabase
      .from('joongang_visitor_stats')
      .select('referrer_domain, page_views')
      .gte('stat_date', formatDateISO(weekAgo))
      .lte('stat_date', formatDateISO(today))
      .neq('referrer_domain', '');

    const map: Record<string, number> = {};
    data?.forEach((row) => {
      if (!row.referrer_domain) return;
      map[row.referrer_domain] = (map[row.referrer_domain] || 0) + (row.page_views || 0);
    });

    const sorted = Object.entries(map)
      .map(([domain, views]) => ({ domain, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    setReferrerStats(sorted);
  }

  async function fetchPopularArticles() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('id, title, view_count, published_at')
      .eq('status', 'published')
      .order('view_count', { ascending: false })
      .limit(10);

    if (data) setPopularArticles(data);
  }

  function sumViews(rows: { page_views: number }[] | null): number {
    if (!rows) return 0;
    return rows.reduce((sum, r) => sum + (r.page_views || 0), 0);
  }

  function formatDateISO(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  function formatShortDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  function formatPublishedDate(dateStr: string | null): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  if (loading) {
    return (
      <div className="visitor-stats">
        <h2 className="page-title">방문 통계</h2>
        <div className="vs-loading">통계 데이터를 불러오는 중...</div>
      </div>
    );
  }

  const maxDaily = Math.max(...dailyStats.map((d) => d.views), 1);
  const totalDevice = deviceStats.reduce((s, d) => s + d.views, 0) || 1;

  return (
    <div className="visitor-stats">
      <h2 className="page-title">방문 통계</h2>

      {/* Summary cards */}
      <div className="vs-summary-grid">
        <div className="vs-summary-card">
          <div className="vs-number">{todayViews.toLocaleString()}</div>
          <div className="vs-label">오늘 방문</div>
        </div>
        <div className="vs-summary-card">
          <div className="vs-number">{yesterdayViews.toLocaleString()}</div>
          <div className="vs-label">어제 방문</div>
        </div>
        <div className="vs-summary-card">
          <div className="vs-number">{weekViews.toLocaleString()}</div>
          <div className="vs-label">이번 주</div>
        </div>
        <div className="vs-summary-card">
          <div className="vs-number">{monthViews.toLocaleString()}</div>
          <div className="vs-label">이번 달</div>
        </div>
      </div>

      {/* Daily bar chart */}
      <div className="vs-chart-section">
        <h3 className="vs-section-title">최근 7일 방문 추이</h3>
        <div className="vs-bar-chart">
          {dailyStats.map((d) => (
            <div key={d.date} className="vs-bar-col">
              <span className="vs-bar-value">{d.views}</span>
              <div
                className="vs-bar"
                style={{ height: `${(d.views / maxDaily) * 160}px` }}
              />
              <span className="vs-bar-label">{formatShortDate(d.date)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Device + Referrer */}
      <div className="vs-two-col">
        <div className="vs-panel">
          <h3 className="vs-section-title">디바이스 분포</h3>
          <div className="vs-device-bars">
            {deviceStats.map((d) => {
              const pct = Math.round((d.views / totalDevice) * 100);
              return (
                <div key={d.device} className="vs-device-row">
                  <span className="vs-device-label">
                    {d.device === 'mobile' ? '모바일' : '데스크톱'}
                  </span>
                  <div className="vs-device-bar-wrap">
                    <div
                      className={`vs-device-bar-fill ${d.device}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="vs-device-pct">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="vs-panel">
          <h3 className="vs-section-title">유입 경로 TOP 5</h3>
          {referrerStats.length === 0 ? (
            <div className="vs-empty">유입 경로 데이터가 없습니다</div>
          ) : (
            <ul className="vs-referrer-list">
              {referrerStats.map((r) => (
                <li key={r.domain} className="vs-referrer-item">
                  <span className="vs-referrer-domain">{r.domain}</span>
                  <span className="vs-referrer-count">{r.views.toLocaleString()} views</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Popular articles */}
      <div className="vs-articles-section">
        <h3 className="vs-section-title">인기 기사 TOP 10</h3>
        {popularArticles.length === 0 ? (
          <div className="vs-empty">기사 데이터가 없습니다</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>제목</th>
                <th>조회수</th>
                <th>발행일</th>
              </tr>
            </thead>
            <tbody>
              {popularArticles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>{article.view_count.toLocaleString()}</td>
                  <td>{formatPublishedDate(article.published_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
