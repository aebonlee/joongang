import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AdBanner } from '@/components/public/AdBanner';
import { CommentSection } from '@/components/public/CommentSection';
import type { Article } from '@/types';
import './ArticlePage.css';

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  async function fetchArticle(slug: string) {
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (data) {
      setArticle(data);
      // Increment view count
      await supabase
        .from('joongang_articles')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id);
      // Fetch related
      fetchRelatedArticles(data.id);
    }
  }

  async function fetchRelatedArticles(articleId: string) {
    const { data } = await supabase
      .from('joongang_related_articles')
      .select(`
        related_article_id,
        joongang_articles!joongang_related_articles_related_article_id_fkey(id, title, slug, thumbnail_url, published_at)
      `)
      .eq('article_id', articleId)
      .limit(5);

    if (data && data.length > 0) {
      setRelatedArticles(data.map((d: any) => d.joongang_articles));
    } else {
      // fallback: latest articles
      const { data: latest } = await supabase
        .from('joongang_articles')
        .select('id, title, slug, thumbnail_url, published_at')
        .eq('status', 'published')
        .eq('is_published', true)
        .neq('id', articleId)
        .order('published_at', { ascending: false })
        .limit(5);
      if (latest) setRelatedArticles(latest as Article[]);
    }
  }

  function formatDate(date: string | null) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function handleShare(platform: string) {
    const url = window.location.href;
    const title = article?.title || '';
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('링크가 복사되었습니다.');
        break;
    }
  }

  if (!article) {
    return (
      <div className="article-page">
        <div className="container">
          <p>기사를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="article-page">
      <div className="container">
        {/* 기사 상단 배너 */}
        <AdBanner slotCode="pc_article_top" className="ad-banner-top ad-banner-pc" />
        <AdBanner slotCode="mobile_article_top" className="ad-banner-top ad-banner-mobile" />

        <article className="article-detail">
          {/* Article Header */}
          <header className="article-header">
            <h1 className="article-detail-title">{article.title}</h1>
            {article.subtitle && (
              <p className="article-detail-subtitle">{article.subtitle}</p>
            )}
            <div className="article-detail-meta">
              <div className="meta-left">
                {article.author_name && (
                  <span className="meta-author">{article.author_name}{article.author_name.endsWith('기자') ? '' : ' 기자'}</span>
                )}
                {article.author_email && (
                  <span className="meta-email">{article.author_email}</span>
                )}
              </div>
              <div className="meta-right">
                <span className="meta-date">입력 {formatDate(article.published_at)}</span>
                <span className="meta-views">조회 {article.view_count.toLocaleString()}</span>
              </div>
            </div>
          </header>

          {/* Share buttons */}
          <div className="article-share">
            <button onClick={() => handleShare('facebook')} className="share-btn">Facebook</button>
            <button onClick={() => handleShare('twitter')} className="share-btn">Twitter</button>
            <button onClick={() => handleShare('copy')} className="share-btn">링크복사</button>
          </div>

          {/* Thumbnail */}
          {article.thumbnail_url && (
            <figure className="article-thumbnail">
              <img src={article.thumbnail_url} alt={article.title} />
              {article.thumbnail_caption && (
                <figcaption>{article.thumbnail_caption}</figcaption>
              )}
            </figure>
          )}

          {/* Video */}
          {article.article_type === 'video' && article.video_url && (
            <div className="article-video">
              <div
                className="video-embed"
                dangerouslySetInnerHTML={{ __html: article.video_url }}
              />
            </div>
          )}

          {/* 기사 중간 배너 */}
          <AdBanner slotCode="pc_article_mid" className="ad-banner-mid ad-banner-pc" />

          {/* Content */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Source */}
          {article.source_name && (
            <div className="article-source">
              출처: {article.source_url ? (
                <a href={article.source_url} target="_blank" rel="noopener noreferrer">
                  {article.source_name}
                </a>
              ) : article.source_name}
            </div>
          )}

          {/* Author box */}
          {article.author_name && (
            <div className="author-box">
              <div className="author-info">
                <strong>{article.author_name}{article.author_name.endsWith('기자') ? '' : ' 기자'}</strong>
                {article.author_email && <span>{article.author_email}</span>}
              </div>
            </div>
          )}

          {/* 기사 하단 배너 */}
          <AdBanner slotCode="pc_article_bottom" className="ad-banner-bottom ad-banner-pc" />
          <AdBanner slotCode="mobile_article_bottom" className="ad-banner-bottom ad-banner-mobile" />

          {/* Comments */}
          {article.allow_comments && (
            <CommentSection articleId={article.id} />
          )}

          {/* Related articles */}
          {relatedArticles.length > 0 && (
            <section className="related-articles">
              <h3 className="section-title">관련기사</h3>
              <ul className="related-list">
                {relatedArticles.map((related) => (
                  <li key={related.id}>
                    <Link to={`/article/${related.slug}`}>
                      {related.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
