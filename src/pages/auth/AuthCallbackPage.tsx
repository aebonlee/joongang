import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase handles the OAuth callback automatically
    // Just redirect to home after a brief moment
    const timer = setTimeout(() => {
      navigate('/', { replace: true });
    }, 1000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <p>로그인 처리 중...</p>
      </div>
    </div>
  );
}
