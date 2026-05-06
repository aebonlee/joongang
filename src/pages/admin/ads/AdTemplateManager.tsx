import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AdTemplate } from '@/types';
import './AdManager.css';

export default function AdTemplateManager() {
  const [templates, setTemplates] = useState<AdTemplate[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdTemplate | null>(null);
  const [form, setForm] = useState({
    name: '',
    slot_size: '728x90',
    category: '',
    html_template: '',
    is_active: true,
  });

  useEffect(() => {
    fetchTemplates();
  }, []);

  async function fetchTemplates() {
    const { data } = await supabase
      .from('joongang_ad_templates')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setTemplates(data);
  }

  function resetForm() {
    setForm({ name: '', slot_size: '728x90', category: '', html_template: '', is_active: true });
    setEditing(null);
    setShowForm(false);
  }

  function editTemplate(t: AdTemplate) {
    setEditing(t);
    setForm({
      name: t.name,
      slot_size: t.slot_size,
      category: t.category || '',
      html_template: t.html_template,
      is_active: t.is_active,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.html_template) { alert('이름과 HTML 템플릿은 필수입니다.'); return; }
    const data = {
      name: form.name,
      slot_size: form.slot_size,
      category: form.category || null,
      html_template: form.html_template,
      variables: [],
      is_active: form.is_active,
    };
    if (editing) {
      await supabase.from('joongang_ad_templates').update(data).eq('id', editing.id);
    } else {
      await supabase.from('joongang_ad_templates').insert(data);
    }
    resetForm();
    fetchTemplates();
  }

  async function deleteTemplate(id: string) {
    if (!confirm('이 템플릿을 삭제하시겠습니까?')) return;
    await supabase.from('joongang_ad_templates').delete().eq('id', id);
    fetchTemplates();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' });
  }

  return (
    <div className="ad-manager">
      <div className="page-header-row">
        <h2>디자인 템플릿</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ 템플릿 추가</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>{editing ? '템플릿 수정' : '템플릿 추가'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">템플릿명 *</label>
              <input type="text" className="form-input" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="기본 배너 템플릿" />
            </div>
            <div className="form-group">
              <label className="form-label">슬롯 크기</label>
              <select className="form-select" value={form.slot_size}
                onChange={(e) => setForm({ ...form, slot_size: e.target.value })}>
                <option value="728x90">728x90 (리더보드)</option>
                <option value="300x250">300x250 (미디엄)</option>
                <option value="160x600">160x600 (와이드 스카이)</option>
                <option value="970x250">970x250 (빌보드)</option>
                <option value="320x100">320x100 (모바일)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">카테고리</label>
              <input type="text" className="form-input" value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="배너, 팝업 등" />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label">HTML 템플릿 *</label>
            <textarea className="form-input" value={form.html_template} rows={8}
              onChange={(e) => setForm({ ...form, html_template: e.target.value })}
              placeholder="<div>광고 HTML 코드...</div>" style={{ fontFamily: 'monospace', fontSize: '13px' }} />
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
              <th>템플릿명</th>
              <th style={{ width: '100px' }}>크기</th>
              <th style={{ width: '100px' }}>카테고리</th>
              <th style={{ width: '70px' }}>상태</th>
              <th style={{ width: '100px' }}>등록일</th>
              <th style={{ width: '120px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((t) => (
              <tr key={t.id}>
                <td style={{ fontWeight: 500 }}>{t.name}</td>
                <td><span className="badge badge-blue">{t.slot_size}</span></td>
                <td>{t.category || '-'}</td>
                <td>
                  <span className={`badge ${t.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {t.is_active ? '활성' : '비활성'}
                  </span>
                </td>
                <td>{formatDate(t.created_at)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => editTemplate(t)}>수정</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteTemplate(t.id)}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {templates.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  등록된 템플릿이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
