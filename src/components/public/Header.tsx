import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
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
      // 날씨 로드 실패 시 무시
    }
  }

  function weatherInfo(code: number): { desc: string; icon: string } {
    if (code === 0) return { desc: '맑음', icon: '☀️' };
    if (code <= 3) return { desc: '구름', icon: '⛅' };
    if (code <= 49) return { desc: '안개', icon: '🌫️' };
    if (code <= 59) return { desc: '이슬비', icon: '🌦️' };
    if (code <= 69) return { desc: '비', icon: '🌧️' };
    if (code <= 79) return { desc: '눈', icon: '🌨️' };
    if (code <= 82) return { desc: '소나기', icon: '🌧️' };
    if (code <= 86) return { desc: '눈', icon: '🌨️' };
    if (code <= 99) return { desc: '뇌우', icon: '⛈️' };
    return { desc: '', icon: '🌡️' };
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  }

  // 한국 시간
  const koreaDate = now.toLocaleDateString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });
  const koreaTime = now.toLocaleTimeString('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit', minute: '2-digit', hour12: false,
  });

  // 워싱턴 D.C. 시간
  const dcDate = now.toLocaleDateString('ko-KR', {
    timeZone: 'America/New_York',
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  });
  const dcTime = now.toLocaleTimeString('ko-KR', {
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
              <span className="clock-label">서울</span> {koreaDate} {koreaTime}
            </span>
            <span className="header-divider">|</span>
            <span className="header-clock">
              <span className="clock-label">D.C.</span> {dcDate} {dcTime}
            </span>
            {weather && (
              <>
                <span className="header-divider">|</span>
                <span className="header-weather">
                  {weather.icon} 워싱턴 {weather.temp}°C {weather.desc}
                </span>
              </>
            )}
          </div>
          <div className="header-actions">
            {user ? (
              <>
                {staff && (
                  <Link to="/admin" className="header-link">관리자</Link>
                )}
                <button onClick={signOut} className="header-link">로그아웃</button>
              </>
            ) : (
              <>
                <Link to="/login" className="header-link">로그인</Link>
                <Link to="/register" className="header-link">회원가입</Link>
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
            <span className="header-logo-region">| 워싱턴 D.C</span>
          </Link>
          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">검색</button>
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className="header-nav">
        <div className="container">
          <button
            className="mobile-menu-btn hide-desktop"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰ 메뉴
          </button>
          <ul className={`nav-list ${mobileMenuOpen ? 'open' : ''}`}>
            <li className="nav-item">
              <Link to="/">홈</Link>
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
