import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AdBanner } from '@/components/public/AdBanner';
import type { Article, Section } from '@/types';
import './SectionPage.css';

const PLACEHOLDER_SRC = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect fill="#f3f4f6" width="400" height="300"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="14" font-family="sans-serif">이미지 없음</text></svg>'
);

function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.src !== PLACEHOLDER_SRC) {
    img.src = PLACEHOLDER_SRC;
    img.style.objectFit = 'contain';
  }
}

export default function SectionPage() {
  const { slug, subSlug } = useParams();
  const [section, setSection] = useState<Section | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [childSections, setChildSections] = useState<Section[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 20;

  useEffect(() => {
    fetchSection();
  }, [slug, subSlug]);

  useEffect(() => {
    if (section) {
      fetchArticles();
    }
  }, [section, page]);

  async function fetchSection() {
    const targetSlug = subSlug || slug;
    const { data } = await supabase
      .from('joongang_sections')
      .select('*')
      .eq('slug', targetSlug)
      .single();
    if (data) {
      setSection(data);
      // Fetch child sections
      const { data: children } = await supabase
        .from('joongang_sections')
        .select('*')
        .eq('parent_id', data.id)
        .eq('is_active', true)
        .order('sort_order');
      if (children) setChildSections(children);
    }
  }

  async function fetchArticles() {
    if (!section) return;
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    const { data, count } = await supabase
      .from('joongang_article_sections')
      .select(`
        article_id,
        joongang_articles!inner(*)
      `, { count: 'exact' })
      .eq('section_id', section.id)
      .eq('joongang_articles.status', 'published')
      .eq('joongang_articles.is_published', true)
      .order('sort_order', { ascending: true })
      .range(from, to);

    if (data) {
      const mapped = data.map((d: any) => d.joongang_articles) as Article[];
      setArticles(mapped);
    }
    if (count !== null) setTotalCount(count);
  }

  function formatDate(date: string | null) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="section-page">
      <div className="container">
        <div className="section-header">
          <h2 className="section-page-title">{section?.name || '섹션'}</h2>
          {childSections.length > 0 && (
            <nav className="section-tabs">
              {childSections.map((child) => (
                <Link
                  key={child.id}
                  to={`/section/${slug}/${child.slug}`}
                  className={`section-tab ${child.slug === subSlug ? 'active' : ''}`}
                >
                  {child.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* 섹션 상단 배너 */}
        <AdBanner slotCode="pc_section_top" className="ad-banner-top ad-banner-pc" />

        <div className="section-content">
          <div className="article-list">
            {articles.map((article) => (
              <article key={article.id} className="article-list-item">
                {article.thumbnail_url && (
                  <Link to={`/article/${article.slug}`} className="article-thumb">
                    <img src={article.thumbnail_url} alt={article.title} onError={handleImgError} />
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
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {page > 1 && (
                <button className="btn btn-outline btn-sm" onClick={() => setPage(page - 1)}>
                  이전
                </button>
              )}
              <span className="page-info">{page} / {totalPages}</span>
              {page < totalPages && (
                <button className="btn btn-outline btn-sm" onClick={() => setPage(page + 1)}>
                  다음
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
