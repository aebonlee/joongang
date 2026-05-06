import { siteConfig } from '@/config/site';
import './Footer.css';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <h3 className="footer-logo">{siteConfig.nameKo}</h3>
            <p className="footer-desc">
              인터넷신문 등록번호: 서울 아 00000 | 등록일: 2026.01.01
            </p>
            <p className="footer-desc">
              발행인/편집인: 홍길동 | 대표전화: {siteConfig.contact.phone}
            </p>
            <p className="footer-desc">
              주소: {siteConfig.contact.address}
            </p>
            <p className="footer-desc">
              이메일: {siteConfig.contact.email}
            </p>
          </div>
          <div className="footer-links">
            <a href="/about">신문사 소개</a>
            <a href="/privacy">개인정보처리방침</a>
            <a href="/terms">이용약관</a>
            <a href="/tip">기사제보</a>
            <a href="/subscribe">뉴스레터</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {siteConfig.nameKo}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
