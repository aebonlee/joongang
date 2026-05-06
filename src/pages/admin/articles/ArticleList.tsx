import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/types';
import './ArticleList.css';

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const perPage = 20;

  useEffect(() => {
    fetchArticles();
  }, [statusFilter, typeFilter, page]);

  async function fetchArticles() {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('joongang_articles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (statusFilter !== 'all') {
      query = query.eq('status', statusFilter);
    }
    if (typeFilter !== 'all') {
      query = query.eq('article_type', typeFilter);
    }
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data, count } = await query;
    if (data) setArticles(data);
    if (count !== null) setTotalCount(count);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchArticles();
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

  async function bulkUpdateStatus(status: string) {
    if (selectedIds.length === 0) return;
    const isPublished = status === 'published';
    await supabase
      .from('joongang_articles')
      .update({
        status,
        is_published: isPublished,
        published_at: isPublished ? new Date().toISOString() : null,
      })
      .in('id', selectedIds);
    setSelectedIds([]);
    fetchArticles();
  }

  async function bulkDelete() {
    if (selectedIds.length === 0) return;
    if (!confirm(`${selectedIds.length}건의 기사를 삭제하시겠습니까?`)) return;
    await supabase
      .from('joongang_articles')
      .delete()
      .in('id', selectedIds);
    setSelectedIds([]);
    fetchArticles();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const statusLabel: Record<string, string> = {
    draft: '작성중',
    pending: '대기',
    published: '발행',
    scheduled: '예약',
    archived: '보관',
  };

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="article-list-page">
      <div className="page-header-row">
        <h2>기사 목록</h2>
        <Link to="/admin/articles/write" className="btn btn-primary">
          + 기사 등록
        </Link>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ width: '120px' }}
          >
            <option value="all">전체 상태</option>
            <option value="draft">작성중</option>
            <option value="pending">대기</option>
            <option value="published">발행</option>
            <option value="scheduled">예약</option>
            <option value="archived">보관</option>
          </select>
          <select
            className="form-select"
            value={typeFilter}
            onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
            style={{ width: '120px' }}
          >
            <option value="all">전체 형태</option>
            <option value="normal">일반</option>
            <option value="photo">포토</option>
            <option value="video">동영상</option>
          </select>
        </div>
        <form className="filter-search" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-input"
            placeholder="제목 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '200px' }}
          />
          <button type="submit" className="btn btn-outline btn-sm">검색</button>
        </form>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedIds.length}건 선택</span>
          <button className="btn btn-sm btn-outline" onClick={() => bulkUpdateStatus('published')}>
            발행
          </button>
          <button className="btn btn-sm btn-outline" onClick={() => bulkUpdateStatus('archived')}>
            보관
          </button>
          <button className="btn btn-sm btn-danger" onClick={bulkDelete}>
            삭제
          </button>
        </div>
      )}

      {/* Table */}
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
              <th style={{ width: '80px' }}>작성자</th>
              <th style={{ width: '70px' }}>상태</th>
              <th style={{ width: '60px' }}>조회</th>
              <th style={{ width: '100px' }}>등록일</th>
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
                <td>
                  <span className={`badge badge-${article.status === 'published' ? 'green' : article.status === 'pending' ? 'orange' : 'gray'}`}>
                    {statusLabel[article.status] || article.status}
                  </span>
                </td>
                <td>{article.view_count}</td>
                <td>{formatDate(article.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination" style={{ marginTop: '16px' }}>
          {page > 1 && (
            <button className="btn btn-outline btn-sm" onClick={() => setPage(page - 1)}>이전</button>
          )}
          <span className="page-info">{page} / {totalPages} (총 {totalCount}건)</span>
          {page < totalPages && (
            <button className="btn btn-outline btn-sm" onClick={() => setPage(page + 1)}>다음</button>
          )}
        </div>
      )}
    </div>
  );
}
