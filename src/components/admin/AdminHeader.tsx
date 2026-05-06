import { useAuth } from '@/contexts/AuthContext';
import './AdminHeader.css';

export function AdminHeader() {
  const { staff, signOut } = useAuth();

  return (
    <header className="admin-header">
      <div className="admin-header-left">
        <h2 className="admin-page-title">관리자 대시보드</h2>
      </div>
      <div className="admin-header-right">
        <span className="admin-user-name">{staff?.name}</span>
        <button className="btn btn-sm btn-outline" onClick={signOut}>
          로그아웃
        </button>
      </div>
    </header>
  );
}
