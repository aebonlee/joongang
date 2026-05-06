import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/types';
import './ArticleList.css';

export default function PendingArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    if (data) setArticles(data);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function toggleSelectAll() {
    if (selectedIds.length === articles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(articles.map((a) => a.id));
    }
  }

  async function approveSelected() {
    if (selectedIds.length === 0) return;
    if (!confirm(`${selectedIds.length}건의 기사를 발행하시겠습니까?`)) return;
    await supabase
      .from('joongang_articles')
      .update({
        status: 'published',
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .in('id', selectedIds);
    setSelectedIds([]);
    fetchPending();
  }

  async function rejectSelected() {
    if (selectedIds.length === 0) return;
    if (!confirm(`${selectedIds.length}건의 기사를 반려하시겠습니까?`)) return;
    await supabase
      .from('joongang_articles')
      .update({ status: 'draft' })
      .in('id', selectedIds);
    setSelectedIds([]);
    fetchPending();
  }

  async function approveOne(id: string) {
    await supabase
      .from('joongang_articles')
      .update({
        status: 'published',
        is_published: true,
        published_at: new Date().toISOString(),
      })
      .eq('id', id);
    fetchPending();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="article-list-page">
      <div className="page-header-row">
        <h2>출력대기 뉴스</h2>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>
          {articles.length}건 대기 중
        </span>
      </div>

      {selectedIds.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedIds.length}건 선택</span>
          <button className="btn btn-sm btn-primary" onClick={approveSelected}>
            일괄 발행
          </button>
          <button className="btn btn-sm btn-outline" onClick={rejectSelected}>
            일괄 반려
          </button>
        </div>
      )}

      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === articles.length && articles.length > 0}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>제목</th>
              <th style={{ width: '80px' }}>형태</th>
              <th style={{ width: '100px' }}>작성자</th>
              <th style={{ width: '120px' }}>등록일</th>
              <th style={{ width: '100px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(article.id)}
                    onChange={() => toggleSelect(article.id)}
                  />
                </td>
                <td>
                  <Link to={`/admin/articles/${article.id}/edit`} className="table-link">
                    {article.title}
                  </Link>
                </td>
                <td>
                  <span className="badge badge-blue">
                    {article.article_type === 'normal' ? '일반' : article.article_type === 'photo' ? '포토' : '영상'}
                  </span>
                </td>
                <td>{article.author_name || '-'}</td>
                <td>{formatDate(article.created_at)}</td>
                <td>
                  <button className="btn btn-sm btn-primary" onClick={() => approveOne(article.id)}>
                    발행
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  출력 대기 중인 기사가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
