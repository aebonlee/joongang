import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Staff } from '@/types';
import './StaffManager.css';

export default function StaffManager() {
  const { isAdmin } = useAuth();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'reporter' as Staff['role'],
    department: '',
    position: '',
    byline: '',
    is_active: true,
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    const { data } = await supabase
      .from('joongang_staff')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setStaffList(data as Staff[]);
  }

  function resetForm() {
    setForm({
      name: '',
      email: '',
      phone: '',
      role: 'reporter',
      department: '',
      position: '',
      byline: '',
      is_active: true,
    });
    setEditingStaff(null);
    setShowForm(false);
  }

  function editStaff(s: Staff) {
    setEditingStaff(s);
    setForm({
      name: s.name,
      email: s.email,
      phone: s.phone || '',
      role: s.role,
      department: s.department || '',
      position: s.position || '',
      byline: s.byline || '',
      is_active: s.is_active,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name || !form.email) {
      alert('이름과 이메일은 필수입니다.');
      return;
    }

    const data = {
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      role: form.role,
      department: form.department || null,
      position: form.position || null,
      byline: form.byline || null,
      is_active: form.is_active,
    };

    if (editingStaff) {
      await supabase.from('joongang_staff').update(data).eq('id', editingStaff.id);
    } else {
      await supabase.from('joongang_staff').insert(data);
    }

    resetForm();
    fetchStaff();
  }

  async function deleteStaff(id: string) {
    if (!confirm('이 스태프를 삭제하시겠습니까?')) return;
    await supabase.from('joongang_staff').delete().eq('id', id);
    fetchStaff();
  }

  async function toggleActive(s: Staff) {
    await supabase
      .from('joongang_staff')
      .update({ is_active: !s.is_active })
      .eq('id', s.id);
    fetchStaff();
  }

  const roleLabel: Record<string, string> = {
    superadmin: '최고관리자',
    editor: '편집장',
    reporter: '기자',
  };

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
    });
  }

  if (!isAdmin) {
    return (
      <div className="staff-manager">
        <h2>스태프 관리</h2>
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
          최고관리자만 접근할 수 있습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="staff-manager">
      <div className="page-header-row">
        <h2>스태프 관리</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + 스태프 추가
        </button>
      </div>

      {showForm && (
        <div className="card staff-form">
          <h3>{editingStaff ? '스태프 수정' : '스태프 추가'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">이름 *</label>
              <input
                type="text"
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="홍길동"
              />
            </div>
            <div className="form-group">
              <label className="form-label">이메일 *</label>
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">전화번호</label>
              <input
                type="text"
                className="form-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="010-0000-0000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">역할</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Staff['role'] })}
              >
                <option value="reporter">기자</option>
                <option value="editor">편집장</option>
                <option value="superadmin">최고관리자</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">부서</label>
              <input
                type="text"
                className="form-input"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="편집부"
              />
            </div>
            <div className="form-group">
              <label className="form-label">직책</label>
              <input
                type="text"
                className="form-input"
                value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
                placeholder="차장"
              />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label">바이라인</label>
            <input
              type="text"
              className="form-input"
              value={form.byline}
              onChange={(e) => setForm({ ...form, byline: e.target.value })}
              placeholder="중앙일보 워싱턴 특파원"
            />
          </div>
          <label className="checkbox-item" style={{ marginTop: '12px' }}>
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
            />
            활성화
          </label>
          <div className="form-actions" style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleSave}>
              {editingStaff ? '수정' : '추가'}
            </button>
            <button className="btn btn-outline" onClick={resetForm}>취소</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th style={{ width: '100px' }}>역할</th>
              <th style={{ width: '100px' }}>부서</th>
              <th style={{ width: '70px' }}>상태</th>
              <th style={{ width: '100px' }}>등록일</th>
              <th style={{ width: '120px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500 }}>{s.name}</td>
                <td style={{ fontSize: '13px', color: '#666' }}>{s.email}</td>
                <td>
                  <span className={`badge ${s.role === 'superadmin' ? 'badge-red' : s.role === 'editor' ? 'badge-blue' : 'badge-green'}`}>
                    {roleLabel[s.role] || s.role}
                  </span>
                </td>
                <td>{s.department || '-'}</td>
                <td>
                  <span className={`badge ${s.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {s.is_active ? '활성' : '비활성'}
                  </span>
                </td>
                <td>{formatDate(s.created_at)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => editStaff(s)}>
                      수정
                    </button>
                    <button className="btn btn-sm btn-outline" onClick={() => toggleActive(s)}>
                      {s.is_active ? '중지' : '활성'}
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteStaff(s.id)}>
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  등록된 스태프가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
