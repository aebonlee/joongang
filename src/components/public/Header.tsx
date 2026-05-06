import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import type { Section } from '@/types';
import './Header.css';

interface WeatherData {
  temp: number;
  desc: string;
  icon: string;
}

export function Header() {
  const { user, staff, signOut } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const [sections, setSections] = useState<Section[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchSections();
    fetchWeather();
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  async function fetchSections() {
    const { data } = await supabase
      .from('joongang_sections')
      .select('*')
      .eq('is_active', true)
      .is('parent_id', null)
      .order('sort_order');
    if (data) setSections(data);
  }

  async function fetchWeather() {
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=38.9072&longitude=-77.0369&current=temperature_2m,weather_code&timezone=America/New_York'
      );
      const data = await res.json();
      if (data.current) {
        const code = data.current.weather_code;
        const temp = Math.round(data.current.temperature_2m);
        const { desc, icon } = weatherInfo(code);
        setWeather({ temp, desc, icon });
      }
    } catch {
      // ignore weather load failure
    }
  }

  function weatherInfo(code: number): { desc: string; icon: string } {
    const isKo = language === 'ko';
    if (code === 0) return { desc: isKo ? '맑음' : 'Clear', icon: '☀️' };
    if (code <= 3) return { desc: isKo ? '구름' : 'Cloudy', icon: '⛅' };
    if (code <= 49) return { desc: isKo ? '안개' : 'Fog', icon: '🌫️' };
    if (code <= 59) return { desc: isKo ? '이슬비' : 'Drizzle', icon: '🌦️' };
    if (code <= 69) return { desc: isKo ? '비' : 'Rain', icon: '🌧️' };
    if (code <= 79) return { desc: isKo ? '눈' : 'Snow', icon: '🌨️' };
    if (code <= 82) return { desc: isKo ? '소나기' : 'Showers', icon: '🌧️' };
    if (code <= 86) return { desc: isKo ? '눈' : 'Snow', icon: '🌨️' };
    if (code <= 99) return { desc: isKo ? '뇌우' : 'Thunder', icon: '⛈️' };
    return { desc: '', icon: '🌡️' };
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }

  const locale = language === 'ko' ? 'ko-KR' : 'en-US';

  const koreaDate = now.toLocaleDateString(locale, {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });
  const koreaTime = now.toLocaleTimeString(locale, {
    timeZone: 'Asia/Seoul',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  const dcDate = now.toLocaleDateString(locale, {
    timeZone: 'America/New_York',
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });
  const dcTime = now.toLocaleTimeString(locale, {
    timeZone: 'America/New_York',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  return (
    <header className="site-header">
      {/* Top bar */}
      <div className="header-topbar">
        <div className="container flex items-center justify-between">
          <div className="header-info">
            <span className="header-clock">
              <span className="clock-label">{t('header.seoul')}</span> {koreaDate} {koreaTime}
            </span>
            <span className="header-divider">|</span>
            <span className="header-clock">
              <span className="clock-label">{t('header.dc')}</span> {dcDate} {dcTime}
            </span>
            {weather && (
              <>
                <span className="header-divider">|</span>
                <span className="header-weather">
                  {weather.icon} {t('header.weather')} {weather.temp}°C {weather.desc}
                </span>
              </>
            )}
          </div>
          <div className="header-actions">
            {user ? (
              <>
                {staff && (
                  <Link to="/admin" className="header-link">{t('header.admin')}</Link>
                )}
                <button onClick={signOut} className="header-link">{t('header.logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-link">{t('header.login')}</Link>
                <Link to="/register" className="header-link">{t('header.register')}</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Logo area */}
      <div className="header-logo-area">
        <div className="container flex items-center justify-between">
          <Link to="/" className="header-logo">
            <img src="/logo_thejoongang.png" alt="중앙일보 워싱턴" className="header-logo-img" />
            <span className="header-logo-region">| 워싱턴 D.C.</span>
          </Link>
          <div className="header-right">
            <form className="header-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={t('nav.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit">{t('nav.search')}</button>
            </form>
            <button className="lang-switcher" onClick={toggleLanguage}>
              {language === 'ko' ? 'EN' : '한'}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <div className="container">
          <button
            className="mobile-menu-btn hide-desktop"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰ {t('header.menu')}
          </button>
          <ul className={`nav-list ${mobileMenuOpen ? 'open' : ''}`}>
            <li className="nav-item">
              <Link to="/">{t('nav.home')}</Link>
            </li>
            {sections.map((section) => (
              <li key={section.id} className="nav-item">
                <Link to={`/section/${section.slug}`}>{section.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
