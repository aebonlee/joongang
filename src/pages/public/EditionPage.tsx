import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Edition } from '@/types';
import './EditionPage.css';

// 판별 코드 → 한글 라벨
const EDITION_LABELS: Record<string, string> = {
  AA: 'LA판 (일간)',
  AE: '동부판',
  AL: 'LA 지역',
  AW: '워싱턴판',
  AY: '일요판',
  BT: '본지',
  B: 'B섹션',
  G: 'G섹션',
};

export default function EditionPage() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCode, setSelectedCode] = useState('');
  const [availableCodes, setAvailableCodes] = useState<string[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchEditionsForDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectedDate && selectedCode) {
      fetchPages(selectedDate, selectedCode);
    }
  }, [selectedDate, selectedCode]);

  async function fetchAvailableDates() {
    const { data } = await supabase
      .from('joongang_editions')
      .select('edition_date')
      .order('edition_date', { ascending: false });

    if (data) {
      const uniqueDates = [...new Set(data.map((d) => d.edition_date))];
      setDates(uniqueDates);
      if (uniqueDates.length > 0) {
        setSelectedDate(uniqueDates[0]);
      }
    }
    setLoading(false);
  }

  async function fetchEditionsForDate(date: string) {
    const { data } = await supabase
      .from('joongang_editions')
      .select('edition_code')
      .eq('edition_date', date);

    if (data) {
      const codes = [...new Set(data.map((d) => d.edition_code))].sort();
      setAvailableCodes(codes);
      if (codes.length > 0) {
        setSelectedCode(codes[0]);
      }
    }
  }

  async function fetchPages(date: string, code: string) {
    const { data } = await supabase
      .from('joongang_editions')
      .select('*')
      .eq('edition_date', date)
      .eq('edition_code', code)
      .order('page_number', { ascending: true });

    if (data) {
      setEditions(data as Edition[]);
    }
  }

  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${weekdays[d.getDay()]})`;
  }

  if (loading) {
    return (
      <div className="edition-page">
        <div className="page-header">
          <div className="container">
            <h1>지면보기</h1>
            <p>중앙일보 워싱턴 신문 지면을 확인하세요</p>
          </div>
        </div>
        <div className="container" style={{ padding: '40px', textAlign: 'center' }}>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edition-page">
      <div className="page-header">
        <div className="container">
          <h1>지면보기</h1>
          <p>중앙일보 워싱턴 신문 지면을 확인하세요</p>
        </div>
      </div>

      <div className="container edition-container">
        {/* 날짜/판 선택 */}
        <div className="edition-controls">
          <div className="control-group">
            <label>날짜 선택</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            >
              {dates.map((date) => (
                <option key={date} value={date}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label>판 선택</label>
            <div className="edition-tabs">
              {availableCodes.map((code) => (
                <button
                  key={code}
                  className={`edition-tab ${selectedCode === code ? 'active' : ''}`}
                  onClick={() => setSelectedCode(code)}
                >
                  {EDITION_LABELS[code] || code}
                </button>
              ))}
            </div>
          </div>
        </div>

        {editions.length === 0 ? (
          <div className="edition-empty">
            <p>해당 날짜의 지면이 아직 등록되지 않았습니다.</p>
          </div>
        ) : (
          <>
            {/* 페이지 목록 */}
            <div className="edition-grid">
              {editions.map((edition) => (
                <button
                  key={edition.id}
                  className={`edition-card ${selectedPdf === edition.pdf_url ? 'selected' : ''}`}
                  onClick={() => setSelectedPdf(edition.pdf_url)}
                >
                  <div className="edition-card-thumb">
                    {edition.thumbnail_url ? (
                      <img src={edition.thumbnail_url} alt={`${edition.page_number}면`} />
                    ) : (
                      <div className="edition-card-placeholder">
                        <span>{edition.page_number}</span>
                      </div>
                    )}
                  </div>
                  <div className="edition-card-label">{edition.page_number}면</div>
                </button>
              ))}
            </div>

            {/* PDF 뷰어 */}
            {selectedPdf && (
              <div className="edition-viewer">
                <div className="viewer-header">
                  <h3>
                    {formatDate(selectedDate)} — {EDITION_LABELS[selectedCode] || selectedCode}
                  </h3>
                  <a
                    href={selectedPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    새 탭에서 보기
                  </a>
                </div>
                <iframe
                  src={selectedPdf}
                  className="pdf-viewer"
                  title="지면 PDF"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
