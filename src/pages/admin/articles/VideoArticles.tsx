import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/types';
import './ArticleList.css';

export default function VideoArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 20;

  useEffect(() => {
    fetchArticles();
  }, [page]);

  async function fetchArticles() {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    const { data, count } = await supabase
      .from('joongang_articles')
      .select('*', { count: 'exact' })
      .eq('article_type', 'video')
      .order('created_at', { ascending: false })
      .range(from, to);
    if (data) setArticles(data);
    if (count !== null) setTotalCount(count);
  }

  async function deleteArticle(id: string) {
    if (!confirm('이 동영상 기사를 삭제하시겠습니까?')) return;
    await supabase.from('joongang_articles').delete().eq('id', id);
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
        <h2>동영상 뉴스관리</h2>
        <Link to="/admin/articles/write" className="btn btn-primary">
          + 동영상 등록
        </Link>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>썸네일</th>
              <th>제목</th>
              <th style={{ width: '100px' }}>작성자</th>
              <th style={{ width: '70px' }}>상태</th>
              <th style={{ width: '60px' }}>조회</th>
              <th style={{ width: '100px' }}>등록일</th>
              <th style={{ width: '80px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>
                  {article.thumbnail_url ? (
                    <img
                      src={article.thumbnail_url}
                      alt=""
                      style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <span style={{ color: '#ccc', fontSize: '12px' }}>없음</span>
                  )}
                </td>
                <td>
                  <Link to={`/admin/articles/${article.id}/edit`} className="table-link">
                    {article.title}
                  </Link>
                  {article.video_url && (
                    <div style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>
                      {article.video_url}
                    </div>
                  )}
                </td>
                <td>{article.author_name || '-'}</td>
                <td>
                  <span className={`badge badge-${article.status === 'published' ? 'green' : article.status === 'pending' ? 'orange' : 'gray'}`}>
                    {statusLabel[article.status] || article.status}
                  </span>
                </td>
                <td>{article.view_count}</td>
                <td>{formatDate(article.created_at)}</td>
                <td>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteArticle(article.id)}>
                    삭제
                  </button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  등록된 동영상 기사가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
