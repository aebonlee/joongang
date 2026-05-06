import { siteConfig } from '@/config/site';
import { useLanguage } from '@/contexts/LanguageContext';
import './Footer.css';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <div className="footer-logo-row">
              <img src="/logo_thejoongang.png" alt="중앙일보 워싱턴" className="footer-logo-img" />
              <span className="footer-logo-region">| 워싱턴 D.C.</span>
            </div>
            <p className="footer-desc">
              JoongAng Ilbo Washington D.C., Inc.
            </p>
            <p className="footer-desc">
              {t('footer.publisher')}: 류태호 | {t('footer.editor')}: 김옥채
            </p>
            <p className="footer-desc">
              {t('footer.newsDirector')}: 김윤미 | {t('footer.adDirector')}: 정재군
            </p>
            <p className="footer-desc">
              {t('footer.address')}: {siteConfig.contact.address}
            </p>
            <p className="footer-desc">
              {t('footer.phone')}: {siteConfig.contact.phone} | {t('footer.email')}: {siteConfig.contact.email}
            </p>
          </div>
          <div className="footer-links">
            <a href="/about">{t('footer.aboutUs')}</a>
            <a href="/privacy">{t('footer.privacy')}</a>
            <a href="/terms">{t('footer.terms')}</a>
            <a href="/tip">{t('footer.tips')}</a>
            <a href="/advertise">{t('footer.advertise')}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} JoongAng Ilbo Washington D.C., Inc. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
