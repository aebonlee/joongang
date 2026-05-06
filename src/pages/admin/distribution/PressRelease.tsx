import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/types';

export default function PressRelease() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(50);
    if (data) setArticles(data);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function handleDistribute() {
    if (selectedIds.length === 0) {
      alert('배포할 기사를 선택하세요.');
      return;
    }
    alert(`${selectedIds.length}건의 보도기사가 제공 대기열에 등록되었습니다.`);
    setSelectedIds([]);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const filteredArticles = searchQuery
    ? articles.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : articles;

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700 }}>보도기사 제공</h2>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
          발행된 기사를 선택하여 외부 매체에 보도기사로 제공할 수 있습니다.
        </p>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            className="form-input"
            placeholder="기사 제목 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '300px' }}
          />
          {selectedIds.length > 0 && (
            <button className="btn btn-primary" onClick={handleDistribute}>
              {selectedIds.length}건 배포
            </button>
          )}
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === filteredArticles.length && filteredArticles.length > 0}
                  onChange={() => {
                    if (selectedIds.length === filteredArticles.length) {
                      setSelectedIds([]);
                    } else {
                      setSelectedIds(filteredArticles.map((a) => a.id));
                    }
                  }}
                />
              </th>
              <th>제목</th>
              <th style={{ width: '100px' }}>작성자</th>
              <th style={{ width: '80px' }}>형태</th>
              <th style={{ width: '120px' }}>발행일</th>
              <th style={{ width: '60px' }}>조회</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.map((article) => (
              <tr key={article.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(article.id)}
                    onChange={() => toggleSelect(article.id)}
                  />
                </td>
                <td>
                  <span className="table-link" style={{ cursor: 'default' }}>
                    {article.title}
                  </span>
                </td>
                <td>{article.author_name || '-'}</td>
                <td>
                  <span className="badge badge-blue">
                    {article.article_type === 'normal' ? '일반' : article.article_type === 'photo' ? '포토' : '영상'}
                  </span>
                </td>
                <td>{article.published_at ? formatDate(article.published_at) : '-'}</td>
                <td>{article.view_count}</td>
              </tr>
            ))}
            {filteredArticles.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  발행된 기사가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
