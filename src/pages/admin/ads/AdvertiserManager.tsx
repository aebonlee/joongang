import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Advertiser } from '@/types';
import './AdManager.css';

export default function AdvertiserManager() {
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Advertiser | null>(null);
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    memo: '',
    is_active: true,
  });

  useEffect(() => {
    fetchAdvertisers();
  }, []);

  async function fetchAdvertisers() {
    const { data } = await supabase
      .from('joongang_advertisers')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAdvertisers(data);
  }

  function resetForm() {
    setForm({ company_name: '', contact_name: '', contact_email: '', contact_phone: '', memo: '', is_active: true });
    setEditing(null);
    setShowForm(false);
  }

  function editAdvertiser(a: Advertiser) {
    setEditing(a);
    setForm({
      company_name: a.company_name,
      contact_name: a.contact_name || '',
      contact_email: a.contact_email || '',
      contact_phone: a.contact_phone || '',
      memo: a.memo || '',
      is_active: a.is_active,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.company_name) { alert('업체명은 필수입니다.'); return; }
    const data = {
      company_name: form.company_name,
      contact_name: form.contact_name || null,
      contact_email: form.contact_email || null,
      contact_phone: form.contact_phone || null,
      memo: form.memo || null,
      is_active: form.is_active,
    };
    if (editing) {
      await supabase.from('joongang_advertisers').update(data).eq('id', editing.id);
    } else {
      await supabase.from('joongang_advertisers').insert(data);
    }
    resetForm();
    fetchAdvertisers();
  }

  async function deleteAdvertiser(id: string) {
    if (!confirm('이 광고주를 삭제하시겠습니까?')) return;
    await supabase.from('joongang_advertisers').delete().eq('id', id);
    fetchAdvertisers();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
  }

  return (
    <div className="ad-manager">
      <div className="page-header-row">
        <h2>광고주 관리</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ 광고주 추가</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>{editing ? '광고주 수정' : '광고주 추가'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">업체명 *</label>
              <input type="text" className="form-input" value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })} placeholder="광고주 업체명" />
            </div>
            <div className="form-group">
              <label className="form-label">담당자명</label>
              <input type="text" className="form-input" value={form.contact_name}
                onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">이메일</label>
              <input type="email" className="form-input" value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">전화번호</label>
              <input type="text" className="form-input" value={form.contact_phone}
                onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label">메모</label>
            <textarea className="form-input" value={form.memo} rows={3}
              onChange={(e) => setForm({ ...form, memo: e.target.value })} />
          </div>
          <label className="checkbox-item" style={{ marginTop: '12px' }}>
            <input type="checkbox" checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> 활성화
          </label>
          <div className="form-actions" style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleSave}>{editing ? '수정' : '추가'}</button>
            <button className="btn btn-outline" onClick={resetForm}>취소</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>업체명</th>
              <th style={{ width: '100px' }}>담당자</th>
              <th style={{ width: '150px' }}>연락처</th>
              <th style={{ width: '70px' }}>상태</th>
              <th style={{ width: '100px' }}>등록일</th>
              <th style={{ width: '120px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {advertisers.map((a) => (
              <tr key={a.id}>
                <td style={{ fontWeight: 500 }}>{a.company_name}</td>
                <td>{a.contact_name || '-'}</td>
                <td style={{ fontSize: '13px' }}>
                  {a.contact_email && <div>{a.contact_email}</div>}
                  {a.contact_phone && <div>{a.contact_phone}</div>}
                </td>
                <td>
                  <span className={`badge ${a.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {a.is_active ? '활성' : '비활성'}
                  </span>
                </td>
                <td>{formatDate(a.created_at)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => editAdvertiser(a)}>수정</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteAdvertiser(a.id)}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {advertisers.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  등록된 광고주가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
