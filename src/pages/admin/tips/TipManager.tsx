import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Tip } from '@/types';

export default function TipManager() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedTip, setSelectedTip] = useState<Tip | null>(null);

  useEffect(() => {
    fetchTips();
  }, [filter]);

  async function fetchTips() {
    let query = supabase
      .from('joongang_tips')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') query = query.eq('status', filter);

    const { data } = await query;
    if (data) setTips(data);
  }

  async function updateStatus(id: string, status: string) {
    await supabase
      .from('joongang_tips')
      .update({ status })
      .eq('id', id);
    fetchTips();
    if (selectedTip?.id === id) {
      setSelectedTip({ ...selectedTip, status: status as Tip['status'] });
    }
  }

  async function deleteTip(id: string) {
    if (!confirm('이 제보를 삭제하시겠습니까?')) return;
    await supabase.from('joongang_tips').delete().eq('id', id);
    if (selectedTip?.id === id) setSelectedTip(null);
    fetchTips();
  }

  const statusLabel: Record<string, string> = {
    received: '접수',
    reviewing: '검토중',
    adopted: '채택',
    rejected: '반려',
  };

  const statusColor: Record<string, string> = {
    received: 'badge-blue',
    reviewing: 'badge-orange',
    adopted: 'badge-green',
    rejected: 'badge-gray',
  };

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>기사제보 관리</h2>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>총 {tips.length}건</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '12px 16px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        {['all', 'received', 'reviewing', 'adopted', 'rejected'].map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? '전체' : statusLabel[s]}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <div className="card" style={{ padding: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>제목</th>
                  <th style={{ width: '100px' }}>제보자</th>
                  <th style={{ width: '70px' }}>상태</th>
                  <th style={{ width: '100px' }}>접수일</th>
                  <th style={{ width: '80px' }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {tips.map((tip) => (
                  <tr
                    key={tip.id}
                    style={{ cursor: 'pointer', background: selectedTip?.id === tip.id ? '#f0f5ff' : undefined }}
                    onClick={() => setSelectedTip(tip)}
                  >
                    <td className="table-link">{tip.title}</td>
                    <td>{tip.reporter_name || '익명'}</td>
                    <td>
                      <span className={`badge ${statusColor[tip.status]}`}>
                        {statusLabel[tip.status]}
                      </span>
                    </td>
                    <td>{formatDate(tip.created_at)}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={(e) => { e.stopPropagation(); deleteTip(tip.id); }}>
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {tips.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                      접수된 제보가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedTip && (
          <div className="card" style={{ width: '360px', flexShrink: 0 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>제보 상세</h3>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>{selectedTip.title}</div>
              <span className={`badge ${statusColor[selectedTip.status]}`}>
                {statusLabel[selectedTip.status]}
              </span>
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
              {selectedTip.content}
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
              <div>제보자: {selectedTip.reporter_name || '-'}</div>
              <div>이메일: {selectedTip.reporter_email || '-'}</div>
              <div>전화: {selectedTip.reporter_phone || '-'}</div>
              <div>접수일: {formatDate(selectedTip.created_at)}</div>
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button className="btn btn-sm btn-outline" onClick={() => updateStatus(selectedTip.id, 'reviewing')}>검토중</button>
              <button className="btn btn-sm btn-primary" onClick={() => updateStatus(selectedTip.id, 'adopted')}>채택</button>
              <button className="btn btn-sm btn-outline" onClick={() => updateStatus(selectedTip.id, 'rejected')}>반려</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
