import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Comment } from '@/types';
import './CommentManager.css';

export default function CommentManager() {
  const [comments, setComments] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 30;

  useEffect(() => {
    fetchComments();
  }, [filter, page]);

  async function fetchComments() {
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    let query = supabase
      .from('joongang_comments')
      .select('*, joongang_articles!inner(title, slug)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (filter === 'visible') query = query.eq('is_hidden', false);
    if (filter === 'hidden') query = query.eq('is_hidden', true);

    const { data, count } = await query;
    if (data) setComments(data);
    if (count !== null) setTotalCount(count);
  }

  async function toggleHide(id: string, currentHidden: boolean) {
    await supabase
      .from('joongang_comments')
      .update({ is_hidden: !currentHidden })
      .eq('id', id);
    fetchComments();
  }

  async function deleteComment(id: string) {
    if (!confirm('이 댓글을 삭제하시겠습니까?')) return;
    await supabase.from('joongang_comments').delete().eq('id', id);
    fetchComments();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="comment-manager">
      <div className="page-header-row">
        <h2>뉴스댓글 관리</h2>
        <span style={{ color: '#6b7280', fontSize: '14px' }}>총 {totalCount}건</span>
      </div>

      <div className="filter-bar">
        <div className="filter-group">
          <button
            className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setFilter('all'); setPage(1); }}
          >
            전체
          </button>
          <button
            className={`btn btn-sm ${filter === 'visible' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setFilter('visible'); setPage(1); }}
          >
            공개
          </button>
          <button
            className={`btn btn-sm ${filter === 'hidden' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => { setFilter('hidden'); setPage(1); }}
          >
            숨김
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>댓글 내용</th>
              <th style={{ width: '200px' }}>기사</th>
              <th style={{ width: '100px' }}>작성자</th>
              <th style={{ width: '100px' }}>등록일</th>
              <th style={{ width: '70px' }}>상태</th>
              <th style={{ width: '120px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.id}>
                <td style={{ maxWidth: '300px' }}>
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {comment.content}
                  </div>
                </td>
                <td style={{ fontSize: '12px', color: '#666' }}>
                  {comment.joongang_articles?.title || '-'}
                </td>
                <td>{comment.user_name || '익명'}</td>
                <td>{formatDate(comment.created_at)}</td>
                <td>
                  <span className={`badge ${comment.is_hidden ? 'badge-gray' : 'badge-green'}`}>
                    {comment.is_hidden ? '숨김' : '공개'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => toggleHide(comment.id, comment.is_hidden)}
                    >
                      {comment.is_hidden ? '공개' : '숨김'}
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteComment(comment.id)}
                    >
                      삭제
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {comments.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  댓글이 없습니다.
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
