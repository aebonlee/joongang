import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { containsProfanity } from '@/utils/profanityFilter';

interface Comment {
  id: string;
  article_id: string;
  user_id: string;
  user_name: string;
  content: string;
  parent_id: string | null;
  is_hidden: boolean;
  ip_address: string | null;
  likes: number;
  created_at: string;
}

function getRelativeTime(dateStr: string, lang: 'ko' | 'en'): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);

  if (lang === 'ko') {
    if (diffSec < 60) return '방금 전';
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    if (diffDay < 7) return `${diffDay}일 전`;
    if (diffWeek < 5) return `${diffWeek}주 전`;
    if (diffMonth < 12) return `${diffMonth}개월 전`;
    return `${diffYear}년 전`;
  }

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  if (diffWeek < 5) return `${diffWeek}w ago`;
  if (diffMonth < 12) return `${diffMonth}mo ago`;
  return `${diffYear}y ago`;
}

export function CommentSection({ articleId }: { articleId: string }) {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const isKo = language === 'ko';

  const fetchComments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('joongang_comments')
      .select('*')
      .eq('article_id', articleId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });

    if (data) {
      setComments(data as Comment[]);
    }
    setLoading(false);
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || !user) return;

    const result = containsProfanity(trimmed);
    if (!result.isClean) {
      alert(result.reason || (isKo ? '부적절한 내용이 포함되어 있습니다.' : 'Inappropriate content detected.'));
      return;
    }

    setSubmitting(true);

    const userName =
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split('@')[0] ||
      (isKo ? '익명' : 'Anonymous');

    const { error } = await supabase
      .from('joongang_comments')
      .insert({
        article_id: articleId,
        user_id: user.id,
        user_name: userName,
        content: trimmed,
        is_hidden: false,
      });

    if (error) {
      alert(isKo ? '댓글 등록에 실패했습니다.' : 'Failed to post comment.');
    } else {
      setContent('');
      fetchComments();
    }

    setSubmitting(false);
  }

  // -- Labels (use t() with fallback for keys that may not exist in translations) --
  const labels = {
    comments: t('comment.comments') !== 'comment.comments' ? t('comment.comments') : (isKo ? '댓글' : 'Comments'),
    writeComment: t('comment.write') !== 'comment.write' ? t('comment.write') : (isKo ? '댓글 작성' : 'Write a comment'),
    placeholder: t('comment.placeholder') !== 'comment.placeholder' ? t('comment.placeholder') : (isKo ? '댓글을 입력하세요...' : 'Write a comment...'),
    submit: t('comment.submit') !== 'comment.submit' ? t('comment.submit') : (isKo ? '등록' : 'Submit'),
    submitting: t('comment.submitting') !== 'comment.submitting' ? t('comment.submitting') : (isKo ? '등록 중...' : 'Submitting...'),
    loginRequired: t('comment.loginRequired') !== 'comment.loginRequired' ? t('comment.loginRequired') : (isKo ? '로그인 후 댓글을 작성할 수 있습니다.' : 'Please log in to comment.'),
    noComments: t('comment.noComments') !== 'comment.noComments' ? t('comment.noComments') : (isKo ? '첫 번째 댓글을 남겨보세요.' : 'Be the first to comment.'),
    loading: t('comment.loading') !== 'comment.loading' ? t('comment.loading') : (isKo ? '댓글 로딩 중...' : 'Loading comments...'),
  };

  // -- Styles --
  const styles = {
    container: {
      marginTop: '40px',
      borderTop: '2px solid #e5e7eb',
      paddingTop: '24px',
    } as React.CSSProperties,
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '20px',
    } as React.CSSProperties,
    title: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#111827',
      margin: 0,
    } as React.CSSProperties,
    count: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#fff',
      background: '#3b82f6',
      borderRadius: '12px',
      padding: '2px 10px',
      lineHeight: '20px',
    } as React.CSSProperties,
    form: {
      marginBottom: '24px',
    } as React.CSSProperties,
    formLabel: {
      display: 'block',
      fontSize: '14px',
      fontWeight: 600,
      color: '#374151',
      marginBottom: '8px',
    } as React.CSSProperties,
    textarea: {
      width: '100%',
      minHeight: '80px',
      padding: '12px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      lineHeight: '1.5',
      resize: 'vertical' as const,
      outline: 'none',
      fontFamily: 'inherit',
      boxSizing: 'border-box' as const,
    } as React.CSSProperties,
    submitRow: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: '8px',
    } as React.CSSProperties,
    submitBtn: {
      padding: '8px 20px',
      fontSize: '14px',
      fontWeight: 600,
      color: '#fff',
      background: '#3b82f6',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      opacity: submitting ? 0.6 : 1,
    } as React.CSSProperties,
    loginMessage: {
      padding: '16px',
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      textAlign: 'center' as const,
      color: '#6b7280',
      fontSize: '14px',
      marginBottom: '24px',
    } as React.CSSProperties,
    list: {
      listStyle: 'none',
      margin: 0,
      padding: 0,
    } as React.CSSProperties,
    commentItem: {
      padding: '16px 0',
      borderBottom: '1px solid #f3f4f6',
    } as React.CSSProperties,
    commentHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '6px',
    } as React.CSSProperties,
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      background: '#e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: 600,
      color: '#6b7280',
      flexShrink: 0,
    } as React.CSSProperties,
    userName: {
      fontSize: '14px',
      fontWeight: 600,
      color: '#111827',
    } as React.CSSProperties,
    time: {
      fontSize: '12px',
      color: '#9ca3af',
    } as React.CSSProperties,
    commentContent: {
      fontSize: '14px',
      lineHeight: '1.6',
      color: '#374151',
      margin: 0,
      paddingLeft: '40px',
      whiteSpace: 'pre-wrap' as const,
      wordBreak: 'break-word' as const,
    } as React.CSSProperties,
    noComments: {
      textAlign: 'center' as const,
      padding: '32px 0',
      color: '#9ca3af',
      fontSize: '14px',
    } as React.CSSProperties,
    loadingText: {
      textAlign: 'center' as const,
      padding: '24px 0',
      color: '#9ca3af',
      fontSize: '14px',
    } as React.CSSProperties,
  };

  return (
    <section style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{labels.comments}</h3>
        <span style={styles.count}>{comments.length}</span>
      </div>

      {/* Comment Form or Login Message */}
      {user ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.formLabel}>{labels.writeComment}</label>
          <textarea
            style={styles.textarea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={labels.placeholder}
            maxLength={2000}
            disabled={submitting}
          />
          <div style={styles.submitRow}>
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={submitting || !content.trim()}
            >
              {submitting ? labels.submitting : labels.submit}
            </button>
          </div>
        </form>
      ) : (
        <div style={styles.loginMessage}>
          {labels.loginRequired}
        </div>
      )}

      {/* Comment List */}
      {loading ? (
        <p style={styles.loadingText}>{labels.loading}</p>
      ) : comments.length === 0 ? (
        <p style={styles.noComments}>{labels.noComments}</p>
      ) : (
        <ul style={styles.list}>
          {comments.map((comment) => (
            <li key={comment.id} style={styles.commentItem}>
              <div style={styles.commentHeader}>
                <div style={styles.avatar}>
                  {comment.user_name.charAt(0).toUpperCase()}
                </div>
                <span style={styles.userName}>{comment.user_name}</span>
                <span style={styles.time}>
                  {getRelativeTime(comment.created_at, language)}
                </span>
              </div>
              <p style={styles.commentContent}>{comment.content}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
