import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { user, staff, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!user || !staff) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/** 편집장 이상만 접근 가능 (editor, superadmin) */
export function EditorRoute({ children }: Props) {
  const { isEditor } = useAuth();

  if (!isEditor) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
        <h2 style={{ marginBottom: '8px' }}>접근 권한이 없습니다</h2>
        <p>편집장 이상만 이용할 수 있습니다.</p>
      </div>
    );
  }

  return <>{children}</>;
}
