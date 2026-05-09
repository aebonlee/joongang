import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import type { Edition } from '@/types';

const EDITION_CODES: { code: string; label: string }[] = [
  { code: 'AA', label: 'LA판 (일간)' },
  { code: 'AE', label: '동부판' },
  { code: 'AL', label: 'LA 지역' },
  { code: 'AW', label: '워싱턴판' },
  { code: 'AY', label: '일요판' },
  { code: 'BT', label: '본지' },
  { code: 'B', label: 'B섹션' },
  { code: 'G', label: 'G섹션' },
];

export default function EditionManager() {
  const { isEditor } = useAuth();
  const [editions, setEditions] = useState<Edition[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Upload form
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().split('T')[0]);
  const [uploadCode, setUploadCode] = useState('AW');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    if (selectedDate) fetchEditions(selectedDate);
  }, [selectedDate]);

  async function fetchDates() {
    const { data } = await supabase
      .from('joongang_editions')
      .select('edition_date')
      .order('edition_date', { ascending: false });

    if (data) {
      const unique = [...new Set(data.map((d) => d.edition_date))];
      setDates(unique);
      if (unique.length > 0) setSelectedDate(unique[0]);
    }
    setLoading(false);
  }

  async function fetchEditions(date: string) {
    const { data } = await supabase
      .from('joongang_editions')
      .select('*')
      .eq('edition_date', date)
      .order('edition_code')
      .order('page_number');

    if (data) setEditions(data as Edition[]);
  }

  async function handleUpload() {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      setUploadMsg('PDF 파일을 선택하세요.');
      return;
    }

    setUploading(true);
    setUploadMsg(`${files.length}개 파일 업로드 중...`);
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const pageNum = i + 1;
      const fileName = `${uploadCode}-${uploadDate}-${String(pageNum).padStart(2, '0')}.pdf`;
      const storagePath = `editions/${uploadDate}/${uploadCode}/${fileName}`;

      setUploadMsg(`업로드 중... (${i + 1}/${files.length}) ${file.name}`);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('joongang-editions')
        .upload(storagePath, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        errorCount++;
        continue;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('joongang-editions')
        .getPublicUrl(storagePath);

      // Insert metadata
      const { error: dbError } = await supabase
        .from('joongang_editions')
        .insert({
          edition_date: uploadDate,
          edition_code: uploadCode,
          edition_label: EDITION_CODES.find((c) => c.code === uploadCode)?.label || uploadCode,
          page_number: pageNum,
          pdf_url: urlData.publicUrl,
          file_size: file.size,
        });

      if (dbError) {
        console.error('DB error:', dbError);
        errorCount++;
      } else {
        successCount++;
      }
    }

    setUploading(false);
    setUploadMsg(`완료: ${successCount}개 성공, ${errorCount}개 실패`);

    // Refresh
    fetchDates();
    if (selectedDate === uploadDate) fetchEditions(uploadDate);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDelete(edition: Edition) {
    if (!confirm(`${edition.page_number}면을 삭제하시겠습니까?`)) return;

    // Delete from storage
    const path = new URL(edition.pdf_url).pathname.split('/joongang-editions/')[1];
    if (path) {
      await supabase.storage.from('joongang-editions').remove([decodeURIComponent(path)]);
    }

    // Delete from DB
    await supabase.from('joongang_editions').delete().eq('id', edition.id);
    fetchEditions(selectedDate);
  }

  async function handleDeleteDate() {
    if (!selectedDate) return;
    if (!confirm(`${selectedDate} 날짜의 모든 지면을 삭제하시겠습니까?`)) return;

    // Get all editions for this date
    const { data } = await supabase
      .from('joongang_editions')
      .select('id, pdf_url')
      .eq('edition_date', selectedDate);

    if (data && data.length > 0) {
      // Delete from storage
      const paths = data
        .map((e) => {
          const match = new URL(e.pdf_url).pathname.split('/joongang-editions/')[1];
          return match ? decodeURIComponent(match) : null;
        })
        .filter(Boolean) as string[];

      if (paths.length > 0) {
        await supabase.storage.from('joongang-editions').remove(paths);
      }

      // Delete from DB
      await supabase.from('joongang_editions').delete().eq('edition_date', selectedDate);
    }

    fetchDates();
    setEditions([]);
    setSelectedDate('');
  }

  if (!isEditor) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
        <h2 style={{ marginBottom: '8px' }}>접근 권한이 없습니다</h2>
        <p>편집장 이상만 이용할 수 있습니다.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '20px' }}>지면 관리</h2>

      {/* 업로드 폼 */}
      <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>지면 업로드</h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>날짜</label>
            <input
              type="date"
              value={uploadDate}
              onChange={(e) => setUploadDate(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>판</label>
            <select
              value={uploadCode}
              onChange={(e) => setUploadCode(e.target.value)}
              style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '6px' }}
            >
              {EDITION_CODES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>
              PDF 파일 (페이지 순서대로 선택)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              style={{ fontSize: '13px' }}
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? '업로드 중...' : '업로드'}
          </button>
        </div>
        {uploadMsg && (
          <p style={{ marginTop: '12px', fontSize: '13px', color: uploadMsg.includes('실패') ? '#dc2626' : '#059669' }}>
            {uploadMsg}
          </p>
        )}
      </div>

      {/* 기존 지면 목록 */}
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>등록된 지면</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
            >
              <option value="">날짜 선택</option>
              {dates.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {selectedDate && (
              <button
                className="btn btn-sm"
                style={{ background: '#dc2626', color: '#fff', border: 'none' }}
                onClick={handleDeleteDate}
              >
                이 날짜 전체 삭제
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>로딩 중...</p>
        ) : editions.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>등록된 지면이 없습니다.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>판</th>
                <th>면</th>
                <th>파일 크기</th>
                <th>등록일</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {editions.map((edition) => (
                <tr key={edition.id}>
                  <td>{edition.edition_label}</td>
                  <td>{edition.page_number}면</td>
                  <td>{edition.file_size ? `${(edition.file_size / 1024).toFixed(0)} KB` : '-'}</td>
                  <td>{new Date(edition.created_at).toLocaleDateString('ko-KR')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <a
                        href={edition.pdf_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline"
                      >
                        보기
                      </a>
                      <button
                        className="btn btn-sm"
                        style={{ background: '#dc2626', color: '#fff', border: 'none' }}
                        onClick={() => handleDelete(edition)}
                      >
                        삭제
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
