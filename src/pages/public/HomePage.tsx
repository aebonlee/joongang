import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { AdBanner } from '@/components/public/AdBanner';
import type { Article } from '@/types';
import './HomePage.css';

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

// 6가지 레이아웃 타입
type LayoutType = 'layout-a' | 'layout-b' | 'layout-c' | 'layout-d' | 'layout-e' | 'layout-f';

const LAYOUT_LIST: LayoutType[] = ['layout-a', 'layout-b', 'layout-c', 'layout-d', 'layout-e', 'layout-f'];

// 4시간(ms) 단위로 레이아웃 자동 교체
function getAutoLayout(): LayoutType {
  const epoch = Date.now();
  const fourHoursMs = 4 * 60 * 60 * 1000;
  const idx = Math.floor(epoch / fourHoursMs) % LAYOUT_LIST.length;
  return LAYOUT_LIST[idx];
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [photoArticles, setPhotoArticles] = useState<Article[]>([]);
  const [layout, setLayout] = useState<LayoutType>(getAutoLayout());

  useEffect(() => {
    fetchLayout();
    fetchArticles();
    fetchPhotoArticles();
  }, []);

  async function fetchLayout() {
    const { data } = await supabase
      .from('joongang_layout_settings')
      .select('layout_config')
      .eq('page_type', 'main')
      .single();
    if (data?.layout_config?.home_layout) {
      setLayout(data.layout_config.home_layout as LayoutType);
    } else {
      setLayout(getAutoLayout());
    }
  }

  async function fetchArticles() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('status', 'published')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(30);
    if (data) {
      setArticles(data);
      setFeaturedArticles(data.filter((a: Article) => a.is_featured || a.priority > 0).slice(0, 6));
    }
  }

  async function fetchPhotoArticles() {
    const { data } = await supabase
      .from('joongang_articles')
      .select('*')
      .eq('status', 'published')
      .eq('is_published', true)
      .eq('article_type', 'photo')
      .order('published_at', { ascending: false })
      .limit(4);
    if (data) setPhotoArticles(data);
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

  const hero = articles[0];
  const top4 = articles.slice(1, 5);
  const top6 = articles.slice(0, 6);
  const subList = articles.slice(5, 20);

  // ────────────────────────────────────
  // 공통 컴포넌트
  // ────────────────────────────────────

  function Sidebar() {
    return (
      <aside className="home-sidebar hide-mobile">
        <AdBanner slotCode="pc_main_side_1" className="ad-banner-sidebar" />
        {photoArticles.length > 0 && (
          <section className="home-section">
            <h3 className="section-title">포토뉴스</h3>
            <div className="photo-news-list">
              {photoArticles.map((a) => (
                <Link key={a.id} to={`/article/${a.slug}`} className="photo-news-item">
                  {a.thumbnail_url ? (
                    <img src={a.thumbnail_url} alt={a.title} onError={handleImgError} />
                  ) : (
                    <div className="news-card-placeholder photo-news-placeholder" />
                  )}
                  <span className="photo-news-title line-clamp-2">{a.title}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
        <AdBanner slotCode="pc_main_side_2" className="ad-banner-sidebar" />
        <section className="home-section">
          <h3 className="section-title">인기기사</h3>
          <ul className="popular-list">
            {(featuredArticles.length > 0 ? featuredArticles : articles).slice(0, 5).map((a, idx) => (
              <li key={a.id} className="popular-item">
                <span className="popular-rank">{idx + 1}</span>
                <Link to={`/article/${a.slug}`} className="popular-title line-clamp-2">{a.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    );
  }

  function NewsList({ items }: { items: Article[] }) {
    return (
      <ul className="news-list">
        {items.map((a) => (
          <li key={a.id} className="news-list-item">
            <Link to={`/article/${a.slug}`}>
              <span className="news-list-title">{a.title}</span>
              <span className="news-list-date">{formatDate(a.published_at)}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  function NewsCard({ article }: { article: Article }) {
    return (
      <Link to={`/article/${article.slug}`} className="news-card">
        <div className="news-card-image">
          {article.thumbnail_url ? (
            <img src={article.thumbnail_url} alt={article.title} onError={handleImgError} />
          ) : (
            <div className="news-card-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/>
                <path d="m3 16 5-5 4 4 4-4 5 5"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
              </svg>
            </div>
          )}
        </div>
        <div className="news-card-content">
          <h4 className="news-card-title line-clamp-2">{article.title}</h4>
          {article.excerpt && <p className="news-card-excerpt line-clamp-2">{article.excerpt}</p>}
          <span className="news-card-date">{formatDate(article.published_at)}</span>
        </div>
      </Link>
    );
  }

  function HeroCard({ article }: { article: Article }) {
    return (
      <Link to={`/article/${article.slug}`} className="headline-card">
        <div className="headline-image">
          {article.thumbnail_url ? (
            <img src={article.thumbnail_url} alt={article.title} onError={handleImgError} />
          ) : (
            <div className="news-card-placeholder headline-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/>
                <path d="m3 16 5-5 4 4 4-4 5 5"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
              </svg>
            </div>
          )}
        </div>
        <div className="headline-content">
          <h2 className="headline-title">{article.title}</h2>
          {article.subtitle && <p className="headline-subtitle">{article.subtitle}</p>}
          {article.excerpt && <p className="headline-excerpt">{article.excerpt}</p>}
        </div>
      </Link>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="home-page">
        <div className="container"><p>기사를 불러오는 중...</p></div>
      </div>
    );
  }

  // ────────────────────────────────────
  // 레이아웃 A: 큰 헤드라인 + 2x2 그리드 + 사이드바 (기본)
  // ────────────────────────────────────
  function LayoutA() {
    return (
      <>
        {hero && (
          <section className="home-headline">
            <HeroCard article={hero} />
          </section>
        )}
        <div className="home-grid">
          <div className="home-main">
            <section className="home-section">
              <h3 className="section-title">주요뉴스</h3>
              <div className="top-news-grid">
                {top4.map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
            </section>
            <AdBanner slotCode="pc_main_mid" className="ad-banner-mid ad-banner-pc" />
            <section className="home-section">
              <h3 className="section-title">최신뉴스</h3>
              <NewsList items={articles.slice(5, 20)} />
            </section>
            <section className="home-section">
              <h3 className="section-title">더보기</h3>
              <div className="top-news-grid">
                {articles.slice(20, 24).map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
            </section>
          </div>
          <Sidebar />
        </div>
      </>
    );
  }

  // ────────────────────────────────────
  // 레이아웃 B: 대형 이미지 + 좌우 분할 (신문 1면 스타일)
  // ────────────────────────────────────
  function LayoutB() {
    return (
      <>
        <div className="layout-b-hero">
          {hero && (
            <Link to={`/article/${hero.slug}`} className="layout-b-main-card">
              <div className="layout-b-main-image">
                {hero.thumbnail_url ? (
                  <img src={hero.thumbnail_url} alt={hero.title} onError={handleImgError} />
                ) : (
                  <div className="news-card-placeholder"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/><path d="m3 16 5-5 4 4 4-4 5 5"/><circle cx="8.5" cy="8.5" r="1.5"/></svg></div>
                )}
              </div>
              <h2 className="layout-b-main-title">{hero.title}</h2>
              {hero.excerpt && <p className="layout-b-main-excerpt">{hero.excerpt}</p>}
            </Link>
          )}
          <div className="layout-b-side-list">
            {articles.slice(1, 6).map((a) => (
              <Link key={a.id} to={`/article/${a.slug}`} className="layout-b-side-item">
                {a.thumbnail_url ? (
                  <img src={a.thumbnail_url} alt={a.title} onError={handleImgError} />
                ) : (
                  <div className="layout-b-side-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/>
                      <path d="m3 16 5-5 4 4 4-4 5 5"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                    </svg>
                  </div>
                )}
                <div>
                  <h4 className="line-clamp-2">{a.title}</h4>
                  <span className="news-card-date">{formatDate(a.published_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <AdBanner slotCode="pc_main_mid" className="ad-banner-mid ad-banner-pc" />
        <div className="home-grid">
          <div className="home-main">
            <section className="home-section">
              <h3 className="section-title">최신뉴스</h3>
              <NewsList items={articles.slice(6, 18)} />
            </section>
            <section className="home-section">
              <h3 className="section-title">더보기</h3>
              <div className="top-news-grid">
                {articles.slice(18, 22).map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
            </section>
          </div>
          <Sidebar />
        </div>
      </>
    );
  }

  // ────────────────────────────────────
  // 레이아웃 C: 3컬럼 그리드 (매거진 스타일)
  // ────────────────────────────────────
  function LayoutC() {
    return (
      <>
        <section className="home-section">
          <h3 className="section-title">오늘의 뉴스</h3>
          <div className="layout-c-grid">
            {top6.map((a) => <NewsCard key={a.id} article={a} />)}
          </div>
        </section>
        <AdBanner slotCode="pc_main_mid" className="ad-banner-mid ad-banner-pc" />
        <div className="home-grid">
          <div className="home-main">
            <section className="home-section">
              <h3 className="section-title">최신뉴스</h3>
              <NewsList items={articles.slice(6, 18)} />
            </section>
            <section className="home-section">
              <h3 className="section-title">더보기</h3>
              <div className="top-news-grid">
                {articles.slice(18, 22).map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
            </section>
          </div>
          <Sidebar />
        </div>
      </>
    );
  }

  // ────────────────────────────────────
  // 레이아웃 D: 풀폭 히어로 + 수평 스크롤 카드
  // ────────────────────────────────────
  function LayoutD() {
    return (
      <>
        {hero && (
          <Link to={`/article/${hero.slug}`} className="layout-d-hero">
            {hero.thumbnail_url ? (
              <img src={hero.thumbnail_url} alt={hero.title} onError={handleImgError} />
            ) : (
              <div className="news-card-placeholder" style={{ width: '100%', height: '100%' }} />
            )}
            <div className="layout-d-hero-overlay">
              <h2>{hero.title}</h2>
              {hero.excerpt && <p>{hero.excerpt}</p>}
            </div>
          </Link>
        )}
        <section className="home-section" style={{ marginTop: '24px' }}>
          <h3 className="section-title">주요뉴스</h3>
          <div className="layout-d-scroll">
            {articles.slice(1, 9).map((a) => (
              <Link key={a.id} to={`/article/${a.slug}`} className="layout-d-scroll-card">
                {a.thumbnail_url ? (
                  <img src={a.thumbnail_url} alt={a.title} onError={handleImgError} />
                ) : (
                  <div className="news-card-placeholder" style={{ height: '120px' }} />
                )}
                <h4 className="line-clamp-2">{a.title}</h4>
              </Link>
            ))}
          </div>
        </section>
        <AdBanner slotCode="pc_main_mid" className="ad-banner-mid ad-banner-pc" />
        <div className="home-grid">
          <div className="home-main">
            <section className="home-section">
              <h3 className="section-title">최신뉴스</h3>
              <NewsList items={articles.slice(9, 21)} />
            </section>
            <section className="home-section">
              <h3 className="section-title">더보기</h3>
              <div className="top-news-grid">
                {articles.slice(21, 25).map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
            </section>
          </div>
          <Sidebar />
        </div>
      </>
    );
  }

  // ────────────────────────────────────
  // 레이아웃 E: 좌측 대형 + 우측 목록 (뉴스포털 스타일)
  // ────────────────────────────────────
  function LayoutE() {
    return (
      <>
        <div className="layout-e-top">
          {hero && (
            <Link to={`/article/${hero.slug}`} className="layout-e-hero">
              {hero.thumbnail_url ? (
                <img src={hero.thumbnail_url} alt={hero.title} onError={handleImgError} />
              ) : (
                <div className="news-card-placeholder" style={{ flex: 1, minHeight: '200px' }} />
              )}
              <h2>{hero.title}</h2>
              {hero.subtitle && <p className="layout-e-subtitle">{hero.subtitle}</p>}
            </Link>
          )}
          <div className="layout-e-list">
            <h3 className="section-title">주요뉴스</h3>
            <ul className="news-list">
              {articles.slice(1, 8).map((a) => (
                <li key={a.id} className="news-list-item">
                  <Link to={`/article/${a.slug}`}>
                    <span className="news-list-title">{a.title}</span>
                    <span className="news-list-date">{formatDate(a.published_at)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <AdBanner slotCode="pc_main_mid" className="ad-banner-mid ad-banner-pc" />
        <div className="home-grid">
          <div className="home-main">
            <section className="home-section">
              <h3 className="section-title">최신뉴스</h3>
              <div className="top-news-grid">
                {articles.slice(8, 12).map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
            </section>
            <section className="home-section">
              <NewsList items={articles.slice(12, 24)} />
            </section>
          </div>
          <Sidebar />
        </div>
      </>
    );
  }

  // ────────────────────────────────────
  // 레이아웃 F: 타일형 (1큰 + 2중 + 3소)
  // ────────────────────────────────────
  function LayoutF() {
    return (
      <>
        <div className="layout-f-mosaic">
          {hero && (
            <Link to={`/article/${hero.slug}`} className="layout-f-big">
              {hero.thumbnail_url ? (
                <img src={hero.thumbnail_url} alt={hero.title} onError={handleImgError} />
              ) : (
                <div className="news-card-placeholder" style={{ width: '100%', height: '100%' }} />
              )}
              <div className="layout-f-overlay">
                <h2>{hero.title}</h2>
              </div>
            </Link>
          )}
          {articles.slice(1, 3).map((a) => (
            <Link key={a.id} to={`/article/${a.slug}`} className="layout-f-med">
              {a.thumbnail_url ? (
                <img src={a.thumbnail_url} alt={a.title} onError={handleImgError} />
              ) : (
                <div className="news-card-placeholder" style={{ width: '100%', height: '100%' }} />
              )}
              <div className="layout-f-overlay">
                <h3 className="line-clamp-2">{a.title}</h3>
              </div>
            </Link>
          ))}
        </div>
        <section className="home-section" style={{ marginTop: '24px' }}>
          <h3 className="section-title">주요뉴스</h3>
          <div className="layout-c-grid">
            {articles.slice(3, 6).map((a) => <NewsCard key={a.id} article={a} />)}
          </div>
        </section>
        <AdBanner slotCode="pc_main_mid" className="ad-banner-mid ad-banner-pc" />
        <div className="home-grid">
          <div className="home-main">
            <section className="home-section">
              <h3 className="section-title">최신뉴스</h3>
              <NewsList items={articles.slice(6, 18)} />
            </section>
            <section className="home-section">
              <h3 className="section-title">더보기</h3>
              <div className="top-news-grid">
                {articles.slice(18, 22).map((a) => <NewsCard key={a.id} article={a} />)}
              </div>
            </section>
          </div>
          <Sidebar />
        </div>
      </>
    );
  }

  const layouts: Record<LayoutType, () => React.ReactNode> = {
    'layout-a': LayoutA,
    'layout-b': LayoutB,
    'layout-c': LayoutC,
    'layout-d': LayoutD,
    'layout-e': LayoutE,
    'layout-f': LayoutF,
  };

  const SelectedLayout = layouts[layout] || LayoutA;

  return (
    <div className="home-page">
      <div className="container">
        <AdBanner slotCode="pc_main_top" className="ad-banner-top ad-banner-pc" />
        <AdBanner slotCode="mobile_main_top" className="ad-banner-top ad-banner-mobile" />
        <SelectedLayout />
      </div>
    </div>
  );
}
