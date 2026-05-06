import { siteConfig } from '@/config/site';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <img src="/logo_thejoongang.png" alt="중앙일보 워싱턴" className="footer-logo-img" />
            <p className="footer-desc">
              JoongAng Ilbo Washington Bureau
            </p>
            <p className="footer-desc">
              발행인: 이드림 | 편집국장: 김워싱턴
            </p>
            <p className="footer-desc">
              주소: {siteConfig.contact.address}
            </p>
            <p className="footer-desc">
              전화: {siteConfig.contact.phone} | 이메일: {siteConfig.contact.email}
            </p>
          </div>
          <div className="footer-links">
            <a href="/about">지사 소개</a>
            <a href="/privacy">개인정보처리방침</a>
            <a href="/terms">이용약관</a>
            <a href="/tip">기사제보</a>
            <a href="/advertise">광고문의</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {siteConfig.nameKo} (JoongAng Washington). All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
