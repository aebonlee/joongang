import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { Article } from '@/types';
import './HomePage.css';

export default function HomePage() {
  const [headline, setHeadline] = useState<Article[]>([]);
  const [topNews, setTopNews] = useState<Article[]>([]);
  const [latestNews, setLatestNews] = useState<Article[]>([]);
  const [photoNews, setPhotoNews] = useState<Article[]>([]);

  useEffect(() => {
    fetchHeadline();
    fetchTopNews();
    fetchLatestNews();
    fetchPhotoNews();
  }, []);

  async function fetchHeadline() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('status', 'published')
      .eq('is_published', true)
      .order('priority', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(1);
    if (data) setHeadline(data);
  }

  async function fetchTopNews() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('status', 'published')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('published_at', { ascending: false })
      .limit(4);
    if (data) setTopNews(data);
  }

  async function fetchLatestNews() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('status', 'published')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(10);
    if (data) setLatestNews(data);
  }

  async function fetchPhotoNews() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('status', 'published')
      .eq('is_published', true)
      .eq('article_type', 'photo')
      .order('published_at', { ascending: false })
      .limit(4);
    if (data) setPhotoNews(data);
  }

  function formatDate(date: string | null) {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="home-page">
      <div className="container">
        {/* Headline */}
        {headline[0] && (
          <section className="home-headline">
            <Link to={`/article/${headline[0].slug}`} className="headline-card">
              {headline[0].thumbnail_url && (
                <div className="headline-image">
                  <img src={headline[0].thumbnail_url} alt={headline[0].title} />
                </div>
              )}
              <div className="headline-content">
                <h2 className="headline-title">{headline[0].title}</h2>
                {headline[0].subtitle && (
                  <p className="headline-subtitle">{headline[0].subtitle}</p>
                )}
                {headline[0].excerpt && (
                  <p className="headline-excerpt">{headline[0].excerpt}</p>
                )}
              </div>
            </Link>
          </section>
        )}

        <div className="home-grid">
          {/* Main content area */}
          <div className="home-main">
            {/* Top News */}
            <section className="home-section">
              <h3 className="section-title">주요뉴스</h3>
              <div className="top-news-grid">
                {topNews.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="news-card"
                  >
                    {article.thumbnail_url && (
                      <div className="news-card-image">
                        <img src={article.thumbnail_url} alt={article.title} />
                      </div>
                    )}
                    <div className="news-card-content">
                      <h4 className="news-card-title line-clamp-2">{article.title}</h4>
                      <span className="news-card-date">{formatDate(article.published_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Latest News */}
            <section className="home-section">
              <h3 className="section-title">최신뉴스</h3>
              <ul className="news-list">
                {latestNews.map((article) => (
                  <li key={article.id} className="news-list-item">
                    <Link to={`/article/${article.slug}`}>
                      <span className="news-list-title">{article.title}</span>
                      <span className="news-list-date">{formatDate(article.published_at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="home-sidebar hide-mobile">
            {/* Photo News */}
            <section className="home-section">
              <h3 className="section-title">포토뉴스</h3>
              <div className="photo-news-list">
                {photoNews.map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.slug}`}
                    className="photo-news-item"
                  >
                    {article.thumbnail_url && (
                      <img src={article.thumbnail_url} alt={article.title} />
                    )}
                    <span className="photo-news-title line-clamp-2">{article.title}</span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Popular articles placeholder */}
            <section className="home-section">
              <h3 className="section-title">인기기사</h3>
              <ul className="popular-list">
                {latestNews.slice(0, 5).map((article, idx) => (
                  <li key={article.id} className="popular-item">
                    <span className="popular-rank">{idx + 1}</span>
                    <Link to={`/article/${article.slug}`} className="popular-title line-clamp-2">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
