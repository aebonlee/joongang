import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Ad, AdSlot } from '@/types';
import './AdManager.css';

export default function AdManager() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [slots, setSlots] = useState<AdSlot[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  // Form state
  const [form, setForm] = useState({
    slot_id: '',
    title: '',
    image_url: '',
    link_url: '',
    start_date: '',
    end_date: '',
    is_active: true,
    open_new_tab: true,
  });

  useEffect(() => {
    fetchAds();
    fetchSlots();
  }, []);

  async function fetchAds() {
    const { data } = await supabase
      .from('joongang_ads')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setAds(data);
  }

  async function fetchSlots() {
    const { data } = await supabase
      .from('joongang_ad_slots')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (data) setSlots(data);
  }

  function resetForm() {
    setForm({
      slot_id: '',
      title: '',
      image_url: '',
      link_url: '',
      start_date: '',
      end_date: '',
      is_active: true,
      open_new_tab: true,
    });
    setEditingAd(null);
    setShowForm(false);
  }

  function editAd(ad: Ad) {
    setEditingAd(ad);
    setForm({
      slot_id: ad.slot_id,
      title: ad.title,
      image_url: ad.image_url || '',
      link_url: ad.link_url || '',
      start_date: ad.start_date ? ad.start_date.slice(0, 16) : '',
      end_date: ad.end_date ? ad.end_date.slice(0, 16) : '',
      is_active: ad.is_active,
      open_new_tab: ad.open_new_tab,
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.title || !form.slot_id || !form.start_date || !form.end_date) {
      alert('필수 항목을 모두 입력하세요.');
      return;
    }

    const data = {
      slot_id: form.slot_id,
      title: form.title,
      image_url: form.image_url || null,
      link_url: form.link_url || null,
      start_date: new Date(form.start_date).toISOString(),
      end_date: new Date(form.end_date).toISOString(),
      is_active: form.is_active,
      open_new_tab: form.open_new_tab,
    };

    if (editingAd) {
      await supabase.from('joongang_ads').update(data).eq('id', editingAd.id);
    } else {
      await supabase.from('joongang_ads').insert(data);
    }

    resetForm();
    fetchAds();
  }

  async function deleteAd(id: string) {
    if (!confirm('이 광고를 삭제하시겠습니까?')) return;
    await supabase.from('joongang_ads').delete().eq('id', id);
    fetchAds();
  }

  async function toggleActive(ad: Ad) {
    await supabase
      .from('joongang_ads')
      .update({ is_active: !ad.is_active })
      .eq('id', ad.id);
    fetchAds();
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

  function isExpired(endDate: string) {
    return new Date(endDate) < new Date();
  }

  function getSlotName(slotId: string) {
    return slots.find((s) => s.id === slotId)?.name || slotId;
  }

  const activeAds = ads.filter((a) => a.is_active && !isExpired(a.end_date));
  const expiredAds = ads.filter((a) => isExpired(a.end_date));

  return (
    <div className="ad-manager">
      <div className="page-header-row">
        <h2>광고 관리</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + 광고 등록
        </button>
      </div>

      {/* Stats */}
      <div className="ad-stats">
        <div className="stat-card">
          <div className="stat-number">{ads.length}</div>
          <div className="stat-label">전체 광고</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{activeAds.length}</div>
          <div className="stat-label">활성 광고</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{expiredAds.length}</div>
          <div className="stat-label">만료 광고</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{slots.length}</div>
          <div className="stat-label">광고 슬롯</div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card ad-form">
          <h3>{editingAd ? '광고 수정' : '광고 등록'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">광고명 *</label>
              <input
                type="text"
                className="form-input"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="광고 제목"
              />
            </div>
            <div className="form-group">
              <label className="form-label">슬롯 *</label>
              <select
                className="form-select"
                value={form.slot_id}
                onChange={(e) => setForm({ ...form, slot_id: e.target.value })}
              >
                <option value="">슬롯 선택</option>
                {slots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {slot.name} ({slot.width}x{slot.height})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">배너 이미지 URL</label>
              <input
                type="text"
                className="form-input"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">클릭 링크</label>
              <input
                type="text"
                className="form-input"
                value={form.link_url}
                onChange={(e) => setForm({ ...form, link_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">시작 일시 *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">종료 일시 *</label>
              <input
                type="datetime-local"
                className="form-input"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              활성화
            </label>
            <label className="checkbox-item">
              <input
                type="checkbox"
                checked={form.open_new_tab}
                onChange={(e) => setForm({ ...form, open_new_tab: e.target.checked })}
              />
              새 창으로 열기
            </label>
          </div>
          {form.image_url && (
            <div className="ad-preview">
              <p className="form-label">미리보기</p>
              <img src={form.image_url} alt="배너 미리보기" />
            </div>
          )}
          <div className="form-actions" style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleSave}>
              {editingAd ? '수정' : '등록'}
            </button>
            <button className="btn btn-outline" onClick={resetForm}>취소</button>
          </div>
        </div>
      )}

      {/* Ad List */}
      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>광고명</th>
              <th>슬롯</th>
              <th>기간</th>
              <th>노출/클릭</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {ad.image_url && (
                      <img
                        src={ad.image_url}
                        alt=""
                        style={{ width: '60px', height: '30px', objectFit: 'cover', borderRadius: '3px' }}
                      />
                    )}
                    <span className="table-link" onClick={() => editAd(ad)} style={{ cursor: 'pointer' }}>
                      {ad.title}
                    </span>
                  </div>
                </td>
                <td>{getSlotName(ad.slot_id)}</td>
                <td style={{ fontSize: '12px' }}>
                  {formatDate(ad.start_date)}<br />~ {formatDate(ad.end_date)}
                </td>
                <td>
                  {ad.impression_count.toLocaleString()} / {ad.click_count.toLocaleString()}
                </td>
                <td>
                  {isExpired(ad.end_date) ? (
                    <span className="badge badge-gray">만료</span>
                  ) : ad.is_active ? (
                    <span className="badge badge-green">활성</span>
                  ) : (
                    <span className="badge badge-orange">비활성</span>
                  )}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => toggleActive(ad)}>
                      {ad.is_active ? '중지' : '활성'}
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteAd(ad.id)}>
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {ads.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  등록된 광고가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
