/*
-- SQL: joongang_ad_billing 테이블 생성
CREATE TABLE joongang_ad_billing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advertiser_id UUID NOT NULL REFERENCES joongang_advertisers(id) ON DELETE CASCADE,
  ad_id UUID REFERENCES joongang_ads(id) ON DELETE SET NULL,
  billing_type TEXT NOT NULL CHECK (billing_type IN ('invoice', 'payment', 'refund')),
  amount INTEGER NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  billing_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  paid_date DATE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT CHECK (payment_method IN ('cash', 'card', 'wire', 'check')),
  memo TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_joongang_ad_billing_advertiser ON joongang_ad_billing(advertiser_id);
CREATE INDEX idx_joongang_ad_billing_status ON joongang_ad_billing(status);
CREATE INDEX idx_joongang_ad_billing_date ON joongang_ad_billing(billing_date);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_joongang_ad_billing_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_joongang_ad_billing_updated
  BEFORE UPDATE ON joongang_ad_billing
  FOR EACH ROW EXECUTE FUNCTION update_joongang_ad_billing_updated_at();
*/

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import './AdManager.css';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Advertiser {
  id: string;
  company_name: string;
}

interface Ad {
  id: string;
  title: string;
}

interface BillingRecord {
  id: string;
  advertiser_id: string;
  ad_id: string | null;
  billing_type: 'invoice' | 'payment' | 'refund';
  amount: number;
  currency: string;
  billing_date: string;
  due_date: string | null;
  paid_date: string | null;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_method: string | null;
  memo: string | null;
  created_at: string;
  updated_at: string;
}

type SummaryMode = 'monthly' | 'yearly';

/* ------------------------------------------------------------------ */
/*  Label maps                                                         */
/* ------------------------------------------------------------------ */

const STATUS_LABEL: Record<string, string> = {
  pending: '미결제',
  paid: '완료',
  overdue: '연체',
  cancelled: '취소',
};

const STATUS_BADGE: Record<string, string> = {
  pending: 'badge-yellow',
  paid: 'badge-green',
  overdue: 'badge-red',
  cancelled: 'badge-gray',
};

const BILLING_TYPE_LABEL: Record<string, string> = {
  invoice: '청구',
  payment: '입금',
  refund: '환불',
};

const BILLING_TYPE_BADGE: Record<string, string> = {
  invoice: 'badge-blue',
  payment: 'badge-green',
  refund: 'badge-red',
};

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  cash: '현금',
  card: '카드',
  wire: '계좌이체',
  check: '수표',
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCurrency(amount: number, currency: string = 'USD'): string {
  if (currency === 'KRW') {
    return `${amount.toLocaleString('ko-KR')}원`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

function formatMonth(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });
}

function toInputDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return dateStr.slice(0, 10);
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getMonthKey(dateStr: string): string {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

function getYearKey(dateStr: string): string {
  return dateStr.slice(0, 4); // "YYYY"
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdBilling() {
  const { isAdmin } = useAuth();

  // Data
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [advertisers, setAdvertisers] = useState<Advertiser[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);

  // Filters
  const [filterAdvertiser, setFilterAdvertiser] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  // Summary mode
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('monthly');

  // Advertiser detail view
  const [selectedAdvertiserId, setSelectedAdvertiserId] = useState<string | null>(null);

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<BillingRecord | null>(null);
  const [form, setForm] = useState({
    advertiser_id: '',
    ad_id: '',
    billing_type: 'invoice' as 'invoice' | 'payment' | 'refund',
    amount: '',
    currency: 'USD',
    billing_date: todayStr(),
    due_date: '',
    paid_date: '',
    status: 'pending' as 'pending' | 'paid' | 'overdue' | 'cancelled',
    payment_method: '',
    memo: '',
  });

  /* ---- Access guard ---- */
  if (!isAdmin) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
        접근 권한이 없습니다. 관리자만 이용할 수 있습니다.
      </div>
    );
  }

  /* ---- Data fetching ---- */
  useEffect(() => {
    fetchRecords();
    fetchAdvertisers();
    fetchAds();
  }, []);

  async function fetchRecords() {
    const { data } = await supabase
      .from('joongang_ad_billing')
      .select('*')
      .order('billing_date', { ascending: false });
    if (data) setRecords(data as BillingRecord[]);
  }

  async function fetchAdvertisers() {
    const { data } = await supabase
      .from('joongang_advertisers')
      .select('id, company_name')
      .order('company_name');
    if (data) setAdvertisers(data);
  }

  async function fetchAds() {
    const { data } = await supabase
      .from('joongang_ads')
      .select('id, title')
      .order('title');
    if (data) setAds(data);
  }

  /* ---- Advertiser / Ad name lookup ---- */
  function getAdvertiserName(id: string): string {
    return advertisers.find((a) => a.id === id)?.company_name || id;
  }

  function getAdTitle(id: string | null): string {
    if (!id) return '-';
    return ads.find((a) => a.id === id)?.title || id;
  }

  /* ---- Filtered records ---- */
  const filtered = useMemo(() => {
    let list = records;
    if (filterAdvertiser) {
      list = list.filter((r) => r.advertiser_id === filterAdvertiser);
    }
    if (filterStatus) {
      list = list.filter((r) => r.status === filterStatus);
    }
    if (filterType) {
      list = list.filter((r) => r.billing_type === filterType);
    }
    if (filterDateFrom) {
      list = list.filter((r) => r.billing_date >= filterDateFrom);
    }
    if (filterDateTo) {
      list = list.filter((r) => r.billing_date <= filterDateTo);
    }
    return list;
  }, [records, filterAdvertiser, filterStatus, filterType, filterDateFrom, filterDateTo]);

  /* ---- Summary statistics ---- */
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

    // Total revenue: paid invoices + payments (excluding refunds)
    const totalRevenue = records
      .filter((r) => r.status === 'paid' && r.billing_type !== 'refund')
      .reduce((sum, r) => sum + r.amount, 0);

    // Total refunds
    const totalRefunds = records
      .filter((r) => r.billing_type === 'refund')
      .reduce((sum, r) => sum + r.amount, 0);

    // Outstanding (pending or overdue invoices)
    const outstanding = records
      .filter((r) => (r.status === 'pending' || r.status === 'overdue') && r.billing_type === 'invoice')
      .reduce((sum, r) => sum + r.amount, 0);

    // This month revenue
    const thisMonthRevenue = records
      .filter((r) => getMonthKey(r.billing_date) === thisMonth && r.status === 'paid' && r.billing_type !== 'refund')
      .reduce((sum, r) => sum + r.amount, 0);

    // Previous month revenue
    const prevMonthRevenue = records
      .filter((r) => getMonthKey(r.billing_date) === prevMonth && r.status === 'paid' && r.billing_type !== 'refund')
      .reduce((sum, r) => sum + r.amount, 0);

    const change = prevMonthRevenue > 0
      ? ((thisMonthRevenue - prevMonthRevenue) / prevMonthRevenue * 100).toFixed(1)
      : thisMonthRevenue > 0 ? '+100' : '0';

    return { totalRevenue, totalRefunds, outstanding, thisMonthRevenue, prevMonthRevenue, change };
  }, [records]);

  /* ---- Period summary (monthly / yearly) ---- */
  const periodSummary = useMemo(() => {
    const keyFn = summaryMode === 'monthly' ? getMonthKey : getYearKey;
    const map = new Map<string, { revenue: number; refunds: number; outstanding: number; count: number }>();

    for (const r of records) {
      const key = keyFn(r.billing_date);
      if (!map.has(key)) map.set(key, { revenue: 0, refunds: 0, outstanding: 0, count: 0 });
      const entry = map.get(key)!;
      entry.count++;
      if (r.billing_type === 'refund') {
        entry.refunds += r.amount;
      } else if (r.status === 'paid') {
        entry.revenue += r.amount;
      } else if (r.status === 'pending' || r.status === 'overdue') {
        entry.outstanding += r.amount;
      }
    }

    return Array.from(map.entries())
      .sort(([a], [b]) => b.localeCompare(a));
  }, [records, summaryMode]);

  /* ---- Advertiser detail records ---- */
  const advertiserRecords = useMemo(() => {
    if (!selectedAdvertiserId) return [];
    return records.filter((r) => r.advertiser_id === selectedAdvertiserId);
  }, [records, selectedAdvertiserId]);

  const advertiserTotals = useMemo(() => {
    const list = advertiserRecords;
    const invoiced = list
      .filter((r) => r.billing_type === 'invoice')
      .reduce((s, r) => s + r.amount, 0);
    const paid = list
      .filter((r) => r.status === 'paid' && r.billing_type !== 'refund')
      .reduce((s, r) => s + r.amount, 0);
    const refunded = list
      .filter((r) => r.billing_type === 'refund')
      .reduce((s, r) => s + r.amount, 0);
    const outstanding = list
      .filter((r) => (r.status === 'pending' || r.status === 'overdue') && r.billing_type === 'invoice')
      .reduce((s, r) => s + r.amount, 0);
    return { invoiced, paid, refunded, outstanding };
  }, [advertiserRecords]);

  /* ---- Form ---- */
  function resetForm() {
    setForm({
      advertiser_id: '',
      ad_id: '',
      billing_type: 'invoice',
      amount: '',
      currency: 'USD',
      billing_date: todayStr(),
      due_date: '',
      paid_date: '',
      status: 'pending',
      payment_method: '',
      memo: '',
    });
    setEditing(null);
    setShowForm(false);
  }

  function startEdit(record: BillingRecord) {
    setEditing(record);
    setForm({
      advertiser_id: record.advertiser_id,
      ad_id: record.ad_id || '',
      billing_type: record.billing_type,
      amount: String(record.amount),
      currency: record.currency,
      billing_date: toInputDate(record.billing_date),
      due_date: toInputDate(record.due_date),
      paid_date: toInputDate(record.paid_date),
      status: record.status,
      payment_method: record.payment_method || '',
      memo: record.memo || '',
    });
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.advertiser_id) {
      alert('광고주를 선택하세요.');
      return;
    }
    if (!form.amount || Number(form.amount) <= 0) {
      alert('금액을 올바르게 입력하세요.');
      return;
    }
    if (!form.billing_date) {
      alert('청구일을 입력하세요.');
      return;
    }

    const data = {
      advertiser_id: form.advertiser_id,
      ad_id: form.ad_id || null,
      billing_type: form.billing_type,
      amount: Number(form.amount),
      currency: form.currency,
      billing_date: form.billing_date,
      due_date: form.due_date || null,
      paid_date: form.paid_date || null,
      status: form.status,
      payment_method: form.payment_method || null,
      memo: form.memo || null,
    };

    if (editing) {
      const { error } = await supabase
        .from('joongang_ad_billing')
        .update(data)
        .eq('id', editing.id);
      if (error) {
        alert('수정 실패: ' + error.message);
        return;
      }
    } else {
      const { error } = await supabase
        .from('joongang_ad_billing')
        .insert(data);
      if (error) {
        alert('등록 실패: ' + error.message);
        return;
      }
    }

    resetForm();
    fetchRecords();
  }

  async function handleDelete(id: string) {
    if (!confirm('이 청구 기록을 삭제하시겠습니까?')) return;
    const { error } = await supabase
      .from('joongang_ad_billing')
      .delete()
      .eq('id', id);
    if (error) {
      alert('삭제 실패: ' + error.message);
      return;
    }
    fetchRecords();
  }

  function clearFilters() {
    setFilterAdvertiser('');
    setFilterStatus('');
    setFilterType('');
    setFilterDateFrom('');
    setFilterDateTo('');
  }

  /* ---- Render ---- */
  return (
    <div className="ad-manager">
      <div className="page-header-row">
        <h2>광고 정산 관리</h2>
        <button className="btn btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + 정산 등록
        </button>
      </div>

      {/* ===== Summary cards ===== */}
      <div className="ad-stats">
        <div className="stat-card">
          <div className="stat-number">{formatCurrency(stats.totalRevenue)}</div>
          <div className="stat-label">총 매출</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: stats.outstanding > 0 ? '#e74a5a' : undefined }}>
            {formatCurrency(stats.outstanding)}
          </div>
          <div className="stat-label">미수금</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{formatCurrency(stats.thisMonthRevenue)}</div>
          <div className="stat-label">이번달 매출</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: Number(stats.change) >= 0 ? '#00855a' : '#e74a5a' }}>
            {Number(stats.change) >= 0 ? '+' : ''}{stats.change}%
          </div>
          <div className="stat-label">전월대비 증감</div>
        </div>
      </div>

      {/* ===== Advertiser detail modal ===== */}
      {selectedAdvertiserId && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600 }}>
              {getAdvertiserName(selectedAdvertiserId)} - 정산 내역
            </h3>
            <button className="btn btn-sm btn-outline" onClick={() => setSelectedAdvertiserId(null)}>
              닫기
            </button>
          </div>

          <div className="ad-stats" style={{ marginBottom: '16px' }}>
            <div className="stat-card">
              <div className="stat-number">{formatCurrency(advertiserTotals.invoiced)}</div>
              <div className="stat-label">총 청구</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{formatCurrency(advertiserTotals.paid)}</div>
              <div className="stat-label">수금 완료</div>
            </div>
            <div className="stat-card">
              <div className="stat-number" style={{ color: advertiserTotals.outstanding > 0 ? '#e74a5a' : undefined }}>
                {formatCurrency(advertiserTotals.outstanding)}
              </div>
              <div className="stat-label">미수금</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{formatCurrency(advertiserTotals.refunded)}</div>
              <div className="stat-label">환불</div>
            </div>
          </div>

          <div style={{ padding: 0 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>일자</th>
                  <th>유형</th>
                  <th>광고</th>
                  <th style={{ textAlign: 'right' }}>금액</th>
                  <th>상태</th>
                  <th>결제방법</th>
                  <th>메모</th>
                </tr>
              </thead>
              <tbody>
                {advertiserRecords.map((r) => (
                  <tr key={r.id}>
                    <td>{formatDate(r.billing_date)}</td>
                    <td>
                      <span className={`badge ${BILLING_TYPE_BADGE[r.billing_type]}`}>
                        {BILLING_TYPE_LABEL[r.billing_type]}
                      </span>
                    </td>
                    <td>{getAdTitle(r.ad_id)}</td>
                    <td style={{ textAlign: 'right', fontWeight: 500 }}>
                      {r.billing_type === 'refund' ? '-' : ''}{formatCurrency(r.amount, r.currency)}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[r.status]}`}>
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td>{r.payment_method ? PAYMENT_METHOD_LABEL[r.payment_method] || r.payment_method : '-'}</td>
                    <td style={{ fontSize: '13px', color: '#666', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.memo || '-'}
                    </td>
                  </tr>
                ))}
                {advertiserRecords.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                      해당 광고주의 정산 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===== Period summary toggle ===== */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>기간별 요약</h3>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className={`btn btn-sm ${summaryMode === 'monthly' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSummaryMode('monthly')}
            >
              월별
            </button>
            <button
              className={`btn btn-sm ${summaryMode === 'yearly' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSummaryMode('yearly')}
            >
              연도별
            </button>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>{summaryMode === 'monthly' ? '월' : '연도'}</th>
              <th style={{ textAlign: 'right' }}>매출</th>
              <th style={{ textAlign: 'right' }}>환불</th>
              <th style={{ textAlign: 'right' }}>미수금</th>
              <th style={{ textAlign: 'right' }}>건수</th>
            </tr>
          </thead>
          <tbody>
            {periodSummary.map(([key, data]) => (
              <tr key={key}>
                <td style={{ fontWeight: 500 }}>
                  {summaryMode === 'monthly'
                    ? formatMonth(key + '-01')
                    : `${key}년`
                  }
                </td>
                <td style={{ textAlign: 'right' }}>{formatCurrency(data.revenue)}</td>
                <td style={{ textAlign: 'right', color: data.refunds > 0 ? '#e74a5a' : undefined }}>
                  {data.refunds > 0 ? `-${formatCurrency(data.refunds)}` : '-'}
                </td>
                <td style={{ textAlign: 'right', color: data.outstanding > 0 ? '#e74a5a' : undefined }}>
                  {data.outstanding > 0 ? formatCurrency(data.outstanding) : '-'}
                </td>
                <td style={{ textAlign: 'right' }}>{data.count}</td>
              </tr>
            ))}
            {periodSummary.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Form ===== */}
      {showForm && (
        <div className="card ad-form">
          <h3>{editing ? '정산 수정' : '정산 등록'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">광고주 *</label>
              <select
                className="form-select"
                value={form.advertiser_id}
                onChange={(e) => setForm({ ...form, advertiser_id: e.target.value })}
              >
                <option value="">광고주 선택</option>
                {advertisers.map((a) => (
                  <option key={a.id} value={a.id}>{a.company_name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">관련 광고</label>
              <select
                className="form-select"
                value={form.ad_id}
                onChange={(e) => setForm({ ...form, ad_id: e.target.value })}
              >
                <option value="">선택 안함</option>
                {ads.map((a) => (
                  <option key={a.id} value={a.id}>{a.title}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">유형 *</label>
              <select
                className="form-select"
                value={form.billing_type}
                onChange={(e) => setForm({ ...form, billing_type: e.target.value as 'invoice' | 'payment' | 'refund' })}
              >
                <option value="invoice">청구</option>
                <option value="payment">입금</option>
                <option value="refund">환불</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">금액 *</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  className="form-select"
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  style={{ width: '90px', flex: 'none' }}
                >
                  <option value="USD">USD ($)</option>
                  <option value="KRW">KRW (원)</option>
                </select>
                <input
                  type="number"
                  className="form-input"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">청구일 *</label>
              <input
                type="date"
                className="form-input"
                value={form.billing_date}
                onChange={(e) => setForm({ ...form, billing_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">결제 기한</label>
              <input
                type="date"
                className="form-input"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">결제일</label>
              <input
                type="date"
                className="form-input"
                value={form.paid_date}
                onChange={(e) => setForm({ ...form, paid_date: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">결제 상태</label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as BillingRecord['status'] })}
              >
                <option value="pending">미결제</option>
                <option value="paid">완료</option>
                <option value="overdue">연체</option>
                <option value="cancelled">취소</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">결제 방법</label>
              <select
                className="form-select"
                value={form.payment_method}
                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
              >
                <option value="">선택 안함</option>
                <option value="cash">현금</option>
                <option value="card">카드</option>
                <option value="wire">계좌이체</option>
                <option value="check">수표</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '12px' }}>
            <label className="form-label">메모</label>
            <textarea
              className="form-input"
              value={form.memo}
              rows={3}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
              placeholder="비고 사항 입력"
            />
          </div>
          <div className="form-actions" style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleSave}>
              {editing ? '수정' : '등록'}
            </button>
            <button className="btn btn-outline" onClick={resetForm}>취소</button>
          </div>
        </div>
      )}

      {/* ===== Filters ===== */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ minWidth: '160px' }}>
            <label className="form-label">광고주</label>
            <select
              className="form-select"
              value={filterAdvertiser}
              onChange={(e) => setFilterAdvertiser(e.target.value)}
            >
              <option value="">전체</option>
              {advertisers.map((a) => (
                <option key={a.id} value={a.id}>{a.company_name}</option>
              ))}
            </select>
          </div>
          <div className="form-group" style={{ minWidth: '120px' }}>
            <label className="form-label">상태</label>
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">전체</option>
              <option value="pending">미결제</option>
              <option value="paid">완료</option>
              <option value="overdue">연체</option>
              <option value="cancelled">취소</option>
            </select>
          </div>
          <div className="form-group" style={{ minWidth: '120px' }}>
            <label className="form-label">유형</label>
            <select
              className="form-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">전체</option>
              <option value="invoice">청구</option>
              <option value="payment">입금</option>
              <option value="refund">환불</option>
            </select>
          </div>
          <div className="form-group" style={{ minWidth: '140px' }}>
            <label className="form-label">시작일</label>
            <input
              type="date"
              className="form-input"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ minWidth: '140px' }}>
            <label className="form-label">종료일</label>
            <input
              type="date"
              className="form-input"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-sm btn-outline" onClick={clearFilters}>
              초기화
            </button>
          </div>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '100px' }}>일자</th>
              <th>광고주</th>
              <th style={{ width: '70px' }}>유형</th>
              <th style={{ width: '120px', textAlign: 'right' }}>금액</th>
              <th style={{ width: '80px' }}>결제상태</th>
              <th style={{ width: '80px' }}>결제방법</th>
              <th>메모</th>
              <th style={{ width: '120px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>{formatDate(r.billing_date)}</td>
                <td>
                  <span
                    className="table-link"
                    style={{ cursor: 'pointer', fontWeight: 500 }}
                    onClick={() => setSelectedAdvertiserId(r.advertiser_id)}
                  >
                    {getAdvertiserName(r.advertiser_id)}
                  </span>
                </td>
                <td>
                  <span className={`badge ${BILLING_TYPE_BADGE[r.billing_type]}`}>
                    {BILLING_TYPE_LABEL[r.billing_type]}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 500 }}>
                  {r.billing_type === 'refund' ? '-' : ''}{formatCurrency(r.amount, r.currency)}
                </td>
                <td>
                  <span className={`badge ${STATUS_BADGE[r.status]}`}>
                    {STATUS_LABEL[r.status]}
                  </span>
                </td>
                <td>
                  {r.payment_method ? PAYMENT_METHOD_LABEL[r.payment_method] || r.payment_method : '-'}
                </td>
                <td style={{ fontSize: '13px', color: '#666', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {r.memo || '-'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => startEdit(r)}>
                      수정
                    </button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(r.id)}>
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  정산 기록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
          {filtered.length > 0 && (
            <tfoot>
              <tr style={{ fontWeight: 600, backgroundColor: 'var(--bg-secondary, #f9fafb)' }}>
                <td colSpan={3} style={{ textAlign: 'right' }}>합계</td>
                <td style={{ textAlign: 'right' }}>
                  {formatCurrency(
                    filtered.reduce((sum, r) => {
                      if (r.billing_type === 'refund') return sum - r.amount;
                      return sum + r.amount;
                    }, 0)
                  )}
                </td>
                <td colSpan={4}>
                  <span style={{ fontSize: '13px', color: '#888' }}>
                    {filtered.length}건
                  </span>
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
