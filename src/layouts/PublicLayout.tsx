import { Outlet } from 'react-router-dom';
import { Header } from '@/components/public/Header';
import { Footer } from '@/components/public/Footer';
import { usePageTracker } from '@/hooks/usePageTracker';
const About = lazy(() => import('../pages/About'));

export function PublicLayout() {
  usePageTracker();

  return (
    <div className="public-layout">
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
