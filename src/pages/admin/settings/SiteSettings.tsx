import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SiteSettings() {
  const { isAdmin } = useAuth();
  const [form, setForm] = useState({
    siteName: '중앙일보 워싱턴',
    siteUrl: 'https://joongang.dreamitbiz.com',
    description: '미주 한인사회의 신뢰받는 뉴스 - 중앙일보 워싱턴지사',
    contactEmail: 'washington@joongang.dreamitbiz.com',
    contactPhone: '202-000-0000',
    address: 'Washington, D.C., USA',
    articlesPerPage: 20,
    allowComments: true,
    requireCommentApproval: false,
    maintenanceMode: false,
  });

  function handleSave() {
    alert('설정이 저장되었습니다.');
  }

  if (!isAdmin) {
    return (
      <div style={{ maxWidth: '800px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>환경설정</h2>
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
          최고관리자만 접근할 수 있습니다.
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>환경설정</h2>

      {/* 사이트 기본 정보 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>사이트 기본 정보</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">사이트명</label>
            <input type="text" className="form-input" value={form.siteName}
              onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">사이트 URL</label>
            <input type="text" className="form-input" value={form.siteUrl}
              onChange={(e) => setForm({ ...form, siteUrl: e.target.value })} />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '12px' }}>
          <label className="form-label">사이트 설명</label>
          <textarea className="form-input" value={form.description} rows={2}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
      </div>

      {/* 연락처 정보 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>연락처 정보</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group">
            <label className="form-label">대표 이메일</label>
            <input type="email" className="form-input" value={form.contactEmail}
              onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">대표 전화</label>
            <input type="text" className="form-input" value={form.contactPhone}
              onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: '12px' }}>
          <label className="form-label">주소</label>
          <input type="text" className="form-input" value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })} />
        </div>
      </div>

      {/* 뉴스 설정 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>뉴스 설정</h3>
        <div className="form-group">
          <label className="form-label">페이지당 기사 수</label>
          <input type="number" className="form-input" value={form.articlesPerPage}
            onChange={(e) => setForm({ ...form, articlesPerPage: Number(e.target.value) })}
            style={{ width: '120px' }} />
        </div>
        <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
          <label className="checkbox-item">
            <input type="checkbox" checked={form.allowComments}
              onChange={(e) => setForm({ ...form, allowComments: e.target.checked })} />
            댓글 허용
          </label>
          <label className="checkbox-item">
            <input type="checkbox" checked={form.requireCommentApproval}
              onChange={(e) => setForm({ ...form, requireCommentApproval: e.target.checked })} />
            댓글 승인제
          </label>
        </div>
      </div>

      {/* 유지보수 */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>시스템</h3>
        <label className="checkbox-item">
          <input type="checkbox" checked={form.maintenanceMode}
            onChange={(e) => setForm({ ...form, maintenanceMode: e.target.checked })} />
          유지보수 모드 (사이트 일시 중단)
        </label>
      </div>

      <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%' }}>
        설정 저장
      </button>
    </div>
  );
}
