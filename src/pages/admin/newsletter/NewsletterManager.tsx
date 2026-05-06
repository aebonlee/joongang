import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Subscriber } from '@/types';

export default function NewsletterManager() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 30;

  useEffect(() => {
    fetchSubscribers();
  }, [filter, page]);

  async function fetchSubscribers() {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('joongang_subscribers')
      .select('*', { count: 'exact' })
      .order('subscribed_at', { ascending: false })
      .range(from, to);

    if (filter === 'active') query = query.eq('is_active', true);
    if (filter === 'inactive') query = query.eq('is_active', false);

    const { data, count } = await query;
    if (data) setSubscribers(data);
    if (count !== null) setTotalCount(count);
  }

  async function toggleActive(sub: Subscriber) {
    await supabase
      .from('joongang_subscribers')
      .update({
        is_active: !sub.is_active,
        unsubscribed_at: sub.is_active ? new Date().toISOString() : null,
      })
      .eq('id', sub.id);
    fetchSubscribers();
  }

  async function deleteSubscriber(id: string) {
    if (!confirm('이 구독자를 삭제하시겠습니까?')) return;
    await supabase.from('joongang_subscribers').delete().eq('id', id);
    fetchSubscribers();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const activeCount = subscribers.filter((s) => s.is_active).length;
  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>뉴스레터 신청 관리</h2>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>총 {totalCount}명</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div className="stat-card">
          <div className="stat-number">{totalCount}</div>
          <div className="stat-label">전체 구독자</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeCount}</div>
          <div className="stat-label">활성 구독</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalCount - activeCount}</div>
          <div className="stat-label">해지</div>
        </div>
      </div>

      <div className="filter-bar" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '12px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setFilter('all'); setPage(1); }}>전체</button>
          <button className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setFilter('active'); setPage(1); }}>활성</button>
          <button className={`btn btn-sm ${filter === 'inactive' ? 'btn-primary' : 'btn-outline'}`} onClick={() => { setFilter('inactive'); setPage(1); }}>해지</button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>이메일</th>
              <th style={{ width: '100px' }}>이름</th>
              <th style={{ width: '70px' }}>상태</th>
              <th style={{ width: '120px' }}>신청일</th>
              <th style={{ width: '120px' }}>해지일</th>
              <th style={{ width: '120px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((sub) => (
              <tr key={sub.id}>
                <td style={{ fontWeight: 500 }}>{sub.email}</td>
                <td>{sub.name || '-'}</td>
                <td>
                  <span className={`badge ${sub.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {sub.is_active ? '구독중' : '해지'}
                  </span>
                </td>
                <td>{formatDate(sub.subscribed_at)}</td>
                <td>{sub.unsubscribed_at ? formatDate(sub.unsubscribed_at) : '-'}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => toggleActive(sub)}>
                      {sub.is_active ? '해지' : '복원'}
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteSubscriber(sub.id)}>
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  뉴스레터 구독자가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
          {page > 1 && (
            <button className="btn btn-outline btn-sm" onClick={() => setPage(page - 1)}>이전</button>
          )}
          <span style={{ fontSize: '13px', color: '#6b7280' }}>{page} / {totalPages} (총 {totalCount}건)</span>
          {page < totalPages && (
            <button className="btn btn-outline btn-sm" onClick={() => setPage(page + 1)}>다음</button>
          )}
        </div>
      )}
    </div>
  );
}
