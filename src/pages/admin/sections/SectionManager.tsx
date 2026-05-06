import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Section } from '@/types';
import './SectionManager.css';

export default function SectionManager() {
  const [sections, setSections] = useState<Section[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    slug: '',
    section_code: 0,
    parent_id: '',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchSections();
  }, []);

  async function fetchSections() {
    const { data } = await supabase
      .from('joongang_sections')
      .select('*')
      .order('sort_order');
    if (data) setSections(data);
  }

  function resetForm() {
    setForm({
      name: '',
      slug: '',
      section_code: 0,
      parent_id: '',
      sort_order: 0,
      is_active: true,
    });
    setEditingId(null);
  }

  function editSection(section: Section) {
    setEditingId(section.id);
    setForm({
      name: section.name,
      slug: section.slug,
      section_code: section.section_code,
      parent_id: section.parent_id || '',
      sort_order: section.sort_order,
      is_active: section.is_active,
    });
  }

  async function handleSave() {
    if (!form.name || !form.slug) {
      alert('섹션명과 슬러그는 필수입니다.');
      return;
    }

    const data = {
      name: form.name,
      slug: form.slug,
      section_code: form.section_code,
      parent_id: form.parent_id || null,
      depth: form.parent_id ? 1 : 0,
      sort_order: form.sort_order,
      is_active: form.is_active,
    };

    if (editingId) {
      await supabase.from('joongang_sections').update(data).eq('id', editingId);
    } else {
      await supabase.from('joongang_sections').insert(data);
    }

    resetForm();
    fetchSections();
  }

  async function deleteSection(id: string) {
    if (!confirm('이 섹션을 삭제하시겠습니까?')) return;
    await supabase.from('joongang_sections').delete().eq('id', id);
    fetchSections();
  }

  const parentSections = sections.filter((s) => !s.parent_id);

  return (
    <div className="section-manager">
      <h2 className="page-title">섹션(카테고리) 관리</h2>

      {/* Form */}
      <div className="card section-form">
        <h3>{editingId ? '섹션 수정' : '새 섹션 추가'}</h3>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">섹션명</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="예: 정치"
            />
          </div>
          <div className="form-group">
            <label className="form-label">슬러그 (URL)</label>
            <input
              type="text"
              className="form-input"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              placeholder="예: politics"
            />
          </div>
          <div className="form-group">
            <label className="form-label">섹션코드</label>
            <input
              type="number"
              className="form-input"
              value={form.section_code}
              onChange={(e) => setForm({ ...form, section_code: Number(e.target.value) })}
              placeholder="10, 20, 30..."
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">상위 섹션</label>
            <select
              className="form-select"
              value={form.parent_id}
              onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
            >
              <option value="">없음 (최상위)</option>
              {parentSections.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">정렬 순서</label>
            <input
              type="number"
              className="form-input"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">상태</label>
            <label className="checkbox-item" style={{ marginTop: '8px' }}>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              활성화
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            {editingId ? '수정' : '추가'}
          </button>
          {editingId && (
            <button className="btn btn-outline" onClick={resetForm}>취소</button>
          )}
        </div>
      </div>

      {/* Section List */}
      <div className="card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>코드</th>
              <th>섹션명</th>
              <th>슬러그</th>
              <th>상위</th>
              <th>순서</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {sections.map((section) => (
              <tr key={section.id} style={{ paddingLeft: section.parent_id ? '20px' : '0' }}>
                <td>{section.section_code}</td>
                <td style={{ paddingLeft: section.parent_id ? '24px' : '12px' }}>
                  {section.parent_id && '└ '}
                  {section.name}
                </td>
                <td>{section.slug}</td>
                <td>{sections.find((s) => s.id === section.parent_id)?.name || '-'}</td>
                <td>{section.sort_order}</td>
                <td>
                  <span className={`badge ${section.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {section.is_active ? '활성' : '비활성'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => editSection(section)}>
                      수정
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteSection(section.id)}>
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
