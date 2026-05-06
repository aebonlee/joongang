import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/types';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      searchArticles(query);
    }
  }, [query]);

  async function searchArticles(q: string) {
    setLoading(true);
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('status', 'published')
      .eq('is_published', true)
      .or(`title.ilike.%${q}%,content.ilike.%${q}%,excerpt.ilike.%${q}%`)
      .order('published_at', { ascending: false })
      .limit(30);
    if (data) setResults(data);
    setLoading(false);
  }

  function formatDate(date: string | null) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  return (
    <div className="section-page">
      <div className="container">
        <div className="section-header">
          <h2 className="section-page-title">
            검색결과 {query && `"${query}"`}
          </h2>
          <p style={{ fontSize: '14px', color: '#888', marginTop: '4px' }}>
            {loading ? '검색 중...' : `${results.length}건의 결과`}
          </p>
        </div>

        <div className="article-list">
          {results.map((article) => (
            <article key={article.id} className="article-list-item">
              {article.thumbnail_url && (
                <Link to={`/article/${article.slug}`} className="article-thumb">
                  <img src={article.thumbnail_url} alt={article.title} />
                </Link>
              )}
              <div className="article-info">
                <Link to={`/article/${article.slug}`}>
                  <h3 className="article-title">{article.title}</h3>
                </Link>
                {article.excerpt && (
                  <p className="article-excerpt line-clamp-2">{article.excerpt}</p>
                )}
                <div className="article-meta">
                  {article.author_name && (
                    <span className="article-author">{article.author_name}</span>
                  )}
                  <span className="article-date">{formatDate(article.published_at)}</span>
                </div>
              </div>
            </article>
          ))}
          {!loading && results.length === 0 && query && (
            <p style={{ padding: '40px 0', textAlign: 'center', color: '#888' }}>
              검색 결과가 없습니다.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
