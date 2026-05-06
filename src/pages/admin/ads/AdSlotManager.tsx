import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { AdSlot } from '@/types';
import './AdManager.css';

export default function AdSlotManager() {
  const [slots, setSlots] = useState<AdSlot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState<AdSlot | null>(null);
  const [form, setForm] = useState({
    slot_code: '',
    name: '',
    description: '',
    page_type: 'main' as AdSlot['page_type'],
    device_type: 'both' as AdSlot['device_type'],
    width: 728,
    height: 90,
    max_ads: 1,
    display_mode: 'rotation' as AdSlot['display_mode'],
    is_active: true,
    sort_order: 0,
  });

  useEffect(() => {
    fetchSlots();
  }, []);

  async function fetchSlots() {
    const { data } = await supabase
      .from('joongang_ad_slots')
      .select('*')
      .order('sort_order');
    if (data) setSlots(data);
  }

  function resetForm() {
    setForm({
      slot_code: '', name: '', description: '',
      page_type: 'main', device_type: 'both',
      width: 728, height: 90, max_ads: 1,
      display_mode: 'rotation', is_active: true, sort_order: 0,
    });
    setEditingSlot(null);
    setShowForm(false);
  }

  function editSlot(slot: AdSlot) {
    setEditingSlot(slot);
    setForm({
      slot_code: slot.slot_code,
      name: slot.name,
      description: slot.description || '',
      page_type: slot.page_type,
      device_type: slot.device_type,
      width: slot.width,
      height: slot.height,
      max_ads: slot.max_ads,
      display_mode: slot.display_mode,
      is_active: slot.is_active,
      sort_order: slot.sort_order,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.slot_code || !form.name) {
      alert('슬롯 코드와 이름은 필수입니다.');
      return;
    }
    const data = {
      slot_code: form.slot_code,
      name: form.name,
      description: form.description || null,
      page_type: form.page_type,
      device_type: form.device_type,
      width: form.width,
      height: form.height,
      max_ads: form.max_ads,
      display_mode: form.display_mode,
      is_active: form.is_active,
      sort_order: form.sort_order,
    };

    if (editingSlot) {
      await supabase.from('joongang_ad_slots').update(data).eq('id', editingSlot.id);
    } else {
      await supabase.from('joongang_ad_slots').insert(data);
    }
    resetForm();
    fetchSlots();
  }

  async function deleteSlot(id: string) {
    if (!confirm('이 슬롯을 삭제하시겠습니까?')) return;
    await supabase.from('joongang_ad_slots').delete().eq('id', id);
    fetchSlots();
  }

  const pageTypeLabel: Record<string, string> = {
    main: '메인', section: '섹션', article: '기사', other: '기타',
  };

  return (
    <div className="ad-manager">
      <div className="page-header-row">
        <h2>슬롯 관리</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ 슬롯 추가</button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>
            {editingSlot ? '슬롯 수정' : '슬롯 추가'}
          </h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">슬롯 코드 *</label>
              <input type="text" className="form-input" value={form.slot_code}
                onChange={(e) => setForm({ ...form, slot_code: e.target.value })} placeholder="main_top_banner" />
            </div>
            <div className="form-group">
              <label className="form-label">이름 *</label>
              <input type="text" className="form-input" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="메인 상단 배너" />
            </div>
            <div className="form-group">
              <label className="form-label">페이지</label>
              <select className="form-select" value={form.page_type}
                onChange={(e) => setForm({ ...form, page_type: e.target.value as AdSlot['page_type'] })}>
                <option value="main">메인</option>
                <option value="section">섹션</option>
                <option value="article">기사</option>
                <option value="other">기타</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">디바이스</label>
              <select className="form-select" value={form.device_type}
                onChange={(e) => setForm({ ...form, device_type: e.target.value as AdSlot['device_type'] })}>
                <option value="both">PC+모바일</option>
                <option value="pc">PC</option>
                <option value="mobile">모바일</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">가로 (px)</label>
              <input type="number" className="form-input" value={form.width}
                onChange={(e) => setForm({ ...form, width: Number(e.target.value) })} />
            </div>
            <div className="form-group">
              <label className="form-label">세로 (px)</label>
              <input type="number" className="form-input" value={form.height}
                onChange={(e) => setForm({ ...form, height: Number(e.target.value) })} />
            </div>
          </div>
          <div className="form-actions" style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleSave}>{editingSlot ? '수정' : '추가'}</button>
            <button className="btn btn-outline" onClick={resetForm}>취소</button>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>코드</th>
              <th>이름</th>
              <th style={{ width: '80px' }}>크기</th>
              <th style={{ width: '80px' }}>페이지</th>
              <th style={{ width: '80px' }}>디바이스</th>
              <th style={{ width: '70px' }}>상태</th>
              <th style={{ width: '120px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{slot.slot_code}</td>
                <td style={{ fontWeight: 500 }}>{slot.name}</td>
                <td>{slot.width}x{slot.height}</td>
                <td><span className="badge badge-blue">{pageTypeLabel[slot.page_type]}</span></td>
                <td>{slot.device_type === 'both' ? 'PC+M' : slot.device_type.toUpperCase()}</td>
                <td>
                  <span className={`badge ${slot.is_active ? 'badge-green' : 'badge-gray'}`}>
                    {slot.is_active ? '활성' : '비활성'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => editSlot(slot)}>수정</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteSlot(slot.id)}>삭제</button>
                  </div>
                </td>
              </tr>
            ))}
            {slots.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  등록된 슬롯이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
