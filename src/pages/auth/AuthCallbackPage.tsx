import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [isRecovery, setIsRecovery] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      } else if (event === 'SIGNED_IN' && !isRecovery) {
        // OAuth 로그인 성공 → 홈으로 이동
        setTimeout(() => navigate('/', { replace: true }), 500);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, isRecovery]);

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError('비밀번호 변경에 실패했습니다. 다시 시도해 주세요.');
    } else {
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    }
  }

  // 비밀번호 재설정 폼
  if (isRecovery) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
            비밀번호 재설정
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px', textAlign: 'center' }}>
            새 비밀번호를 입력하세요. 설정 후 이메일과 비밀번호로 로그인할 수 있습니다.
          </p>

          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: '#059669', fontWeight: 500 }}>비밀번호가 변경되었습니다.</p>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>로그인 페이지로 이동합니다...</p>
            </div>
          ) : (
            <form onSubmit={handlePasswordUpdate}>
              {error && (
                <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 12px', borderRadius: '6px', fontSize: '13px', marginBottom: '16px' }}>
                  {error}
                </div>
              )}
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label">새 비밀번호</label>
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상 입력"
                  required
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label className="form-label">비밀번호 확인</label>
                <input
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="비밀번호를 다시 입력"
                  required
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? '변경 중...' : '비밀번호 변경'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // 일반 OAuth 콜백
  return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <p>로그인 처리 중...</p>
      </div>
    </div>
  );
}
