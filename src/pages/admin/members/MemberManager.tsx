import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  provider: string | null;
  signup_domain: string | null;
  created_at: string;
  updated_at: string | null;
  avatar_url: string | null;
}

const roleLabel: Record<string, string> = {
  member: '일반회원',
  user: '일반회원',
  admin: '관리자',
  superadmin: '최고관리자',
};

const PER_PAGE = 20;

export default function MemberManager() {
  const { isAdmin } = useAuth();
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    const from = (page - 1) * PER_PAGE;
    const to = from + PER_PAGE - 1;

    let query = supabase
      .from('user_profiles')
      .select('id, email, display_name, role, provider, signup_domain, created_at, updated_at, avatar_url', { count: 'exact' })
      .eq('signup_domain', 'joongang.dreamitbiz.com')
      .order('created_at', { ascending: false })
      .range(from, to);

    if (search) {
      query = query.or(`display_name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data, count } = await query;
    if (data) setMembers(data as UserProfile[]);
    if (count !== null) setTotalCount(count);
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  }

  function clearSearch() {
    setSearchInput('');
    setSearch('');
    setPage(1);
  }

  async function changeRole(member: UserProfile, newRole: string) {
    if (!confirm(`${member.display_name || member.email} 회원의 역할을 ${getRoleLabel(newRole)}(으)로 변경하시겠습니까?`)) return;
    await supabase
      .from('user_profiles')
      .update({ role: newRole })
      .eq('id', member.id);
    fetchMembers();
    if (selectedMember?.id === member.id) {
      setSelectedMember({ ...member, role: newRole });
    }
  }

  function openPanel(member: UserProfile) {
    setSelectedMember(member);
    setPanelOpen(true);
  }

  function closePanel() {
    setPanelOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
  }

  function handleExport() {
    alert('내보내기 기능은 준비 중입니다.');
  }

  function formatDate(date: string | null) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  function formatDateTime(date: string | null) {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  function getRoleLabel(role: string) {
    return roleLabel[role] || role;
  }

  function getRoleBadgeClass(role: string) {
    if (role === 'superadmin') return 'badge-red';
    if (role === 'admin') return 'badge-blue';
    return 'badge-green';
  }

  const totalPages = Math.ceil(totalCount / PER_PAGE);

  if (!isAdmin) {
    return (
      <div className="member-manager">
        <h2>회원 관리</h2>
        <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
          최고관리자만 접근할 수 있습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="member-manager">
      <div className="page-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>회원 관리</h2>
          <span style={{ color: '#6b7280', fontSize: '14px' }}>총 {totalCount.toLocaleString('ko-KR')}명</span>
        </div>
        <button className="btn btn-outline" onClick={handleExport}>
          내보내기
        </button>
      </div>

      {/* 검색 */}
      <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="이름 또는 이메일로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary btn-sm">검색</button>
          {search && (
            <button type="button" className="btn btn-outline btn-sm" onClick={clearSearch}>초기화</button>
          )}
        </form>
      </div>

      {/* 테이블 */}
      <div className="card" style={{ padding: 0, position: 'relative' }}>
        {loading && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          }}>
            <span style={{ color: '#6b7280' }}>로딩 중...</span>
          </div>
        )}
        <table className="admin-table">
          <thead>
            <tr>
              <th>이름</th>
              <th>이메일</th>
              <th style={{ width: '100px' }}>역할</th>
              <th style={{ width: '100px' }}>가입경로</th>
              <th style={{ width: '110px' }}>가입일</th>
              <th style={{ width: '80px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td style={{ fontWeight: 500 }}>{member.display_name || '-'}</td>
                <td style={{ fontSize: '13px', color: '#666' }}>{member.email}</td>
                <td>
                  <span className={`badge ${getRoleBadgeClass(member.role)}`}>
                    {getRoleLabel(member.role)}
                  </span>
                </td>
                <td style={{ fontSize: '13px' }}>{member.provider || 'email'}</td>
                <td style={{ fontSize: '13px' }}>{formatDate(member.created_at)}</td>
                <td>
                  <button className="btn btn-sm btn-outline" onClick={() => openPanel(member)}>
                    상세
                  </button>
                </td>
              </tr>
            ))}
            {!loading && members.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  {search ? '검색 결과가 없습니다.' : '등록된 회원이 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '16px', marginTop: '16px',
        }}>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            처음
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            이전
          </button>
          <span style={{ fontSize: '13px', color: '#6b7280' }}>
            {page} / {totalPages} (총 {totalCount.toLocaleString('ko-KR')}명)
          </span>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            다음
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
          >
            마지막
          </button>
        </div>
      )}

      {/* 회원 상세 슬라이드 패널 */}
      {panelOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', justifyContent: 'flex-end',
          }}
        >
          {/* 오버레이 */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0, 0, 0, 0.4)',
            }}
            onClick={closePanel}
          />
          {/* 패널 */}
          <div
            style={{
              position: 'relative',
              width: '420px',
              maxWidth: '90vw',
              background: '#fff',
              boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
              padding: '32px 24px',
              overflowY: 'auto',
              animation: 'slideIn 0.3s ease-out',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>회원 상세정보</h3>
              <button
                className="btn btn-sm btn-outline"
                onClick={closePanel}
                style={{ fontSize: '16px', padding: '4px 10px' }}
              >
                &times;
              </button>
            </div>

            {selectedMember && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 프로필 헤더 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    background: '#e5e7eb', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '24px', fontWeight: 700,
                    color: '#6b7280', overflow: 'hidden', flexShrink: 0,
                  }}>
                    {selectedMember.avatar_url ? (
                      <img
                        src={selectedMember.avatar_url}
                        alt={selectedMember.display_name || ''}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      (selectedMember.display_name || selectedMember.email)?.[0]?.toUpperCase() || '?'
                    )}
                  </div>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 600 }}>{selectedMember.display_name || '-'}</div>
                    <div style={{ fontSize: '13px', color: '#6b7280' }}>{selectedMember.email}</div>
                  </div>
                </div>

                {/* 상세 정보 */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '100px 1fr',
                  gap: '12px 8px', fontSize: '14px',
                }}>
                  <span className="form-label" style={{ margin: 0, color: '#6b7280' }}>역할</span>
                  <span>
                    <span className={`badge ${getRoleBadgeClass(selectedMember.role)}`}>
                      {getRoleLabel(selectedMember.role)}
                    </span>
                  </span>

                  <span className="form-label" style={{ margin: 0, color: '#6b7280' }}>가입경로</span>
                  <span>{selectedMember.provider || 'email'}</span>

                  <span className="form-label" style={{ margin: 0, color: '#6b7280' }}>가입도메인</span>
                  <span style={{ fontSize: '13px' }}>{selectedMember.signup_domain || '-'}</span>

                  <span className="form-label" style={{ margin: 0, color: '#6b7280' }}>가입일</span>
                  <span>{formatDateTime(selectedMember.created_at)}</span>

                  <span className="form-label" style={{ margin: 0, color: '#6b7280' }}>수정일</span>
                  <span>{formatDateTime(selectedMember.updated_at)}</span>

                  <span className="form-label" style={{ margin: 0, color: '#6b7280' }}>회원 ID</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af', wordBreak: 'break-all' }}>
                    {selectedMember.id}
                  </span>
                </div>

                {/* 역할 변경 버튼 */}
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {selectedMember.role !== 'admin' && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => changeRole(selectedMember, 'admin')}
                      style={{ flex: 1 }}
                    >
                      관리자로 변경
                    </button>
                  )}
                  {selectedMember.role === 'admin' && (
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => changeRole(selectedMember, 'member')}
                      style={{ flex: 1 }}
                    >
                      일반회원으로 변경
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 슬라이드 인 애니메이션 */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
