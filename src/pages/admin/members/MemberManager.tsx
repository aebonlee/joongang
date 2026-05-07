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

const staffRoleLabel: Record<string, string> = {
  reporter: '기자',
  editor: '편집장',
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
  const [promoteRole, setPromoteRole] = useState<string>('reporter');
  const [actionMsg, setActionMsg] = useState('');

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

  // 기자/편집장 승급 (joongang_staff에 추가)
  async function promoteToStaff(member: UserProfile) {
    const roleName = staffRoleLabel[promoteRole] || promoteRole;
    if (!confirm(`${member.display_name || member.email}님을 ${roleName}(으)로 승급하시겠습니까?`)) return;

    // 이미 스태프인지 확인
    const { data: existing } = await supabase
      .from('joongang_staff')
      .select('id')
      .eq('email', member.email)
      .single();

    if (existing) {
      // 이미 존재 → 역할만 업데이트
      await supabase
        .from('joongang_staff')
        .update({ role: promoteRole, is_active: true })
        .eq('email', member.email);
      setActionMsg(`${member.display_name || member.email}님의 스태프 역할이 ${roleName}(으)로 변경되었습니다.`);
    } else {
      // 새로 추가
      const { error } = await supabase
        .from('joongang_staff')
        .insert({
          user_id: member.id,
          name: member.display_name || member.email.split('@')[0],
          email: member.email,
          role: promoteRole,
          is_active: true,
        });
      if (error) {
        setActionMsg(`오류: ${error.message}`);
        return;
      }
      setActionMsg(`${member.display_name || member.email}님이 ${roleName}(으)로 등록되었습니다.`);
    }
    setTimeout(() => setActionMsg(''), 4000);
  }

  // 비밀번호 초기화 메일 발송
  async function sendPasswordReset(member: UserProfile) {
    if (!confirm(`${member.email}로 비밀번호 재설정 메일을 발송하시겠습니까?\n\n구글 가입 사용자도 이 메일을 통해 비밀번호를 설정하면 이메일+비밀번호로 로그인할 수 있습니다.`)) return;

    const { error } = await supabase.auth.resetPasswordForEmail(member.email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });

    if (error) {
      setActionMsg(`오류: ${error.message}`);
    } else {
      setActionMsg(`${member.email}로 비밀번호 재설정 메일이 발송되었습니다.`);
    }
    setTimeout(() => setActionMsg(''), 4000);
  }

  function openPanel(member: UserProfile) {
    setSelectedMember(member);
    setPanelOpen(true);
    setPromoteRole('reporter');
    setActionMsg('');
  }

  function closePanel() {
    setPanelOpen(false);
    setTimeout(() => setSelectedMember(null), 300);
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
              <th style={{ width: '100px' }}>가입경로</th>
              <th style={{ width: '110px' }}>가입일</th>
              <th style={{ width: '160px' }}>관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id}>
                <td style={{ fontWeight: 500 }}>{member.display_name || '-'}</td>
                <td style={{ fontSize: '13px', color: '#666' }}>{member.email}</td>
                <td style={{ fontSize: '13px' }}>{member.provider || 'email'}</td>
                <td style={{ fontSize: '13px' }}>{formatDate(member.created_at)}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-sm btn-outline" onClick={() => openPanel(member)}>
                      상세
                    </button>
                    <button className="btn btn-sm btn-outline" onClick={() => sendPasswordReset(member)}>
                      비밀번호
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && members.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                  {search ? '검색 결과가 없습니다.' : '등록된 회원이 없습니다.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 액션 메시지 */}
      {actionMsg && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#1f2937', color: '#fff', padding: '12px 24px',
          borderRadius: '8px', fontSize: '14px', zIndex: 2000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        }}>
          {actionMsg}
        </div>
      )}

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
              width: '440px',
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
                  <span style={{ color: '#6b7280', fontWeight: 500 }}>가입경로</span>
                  <span>{selectedMember.provider || 'email'}</span>

                  <span style={{ color: '#6b7280', fontWeight: 500 }}>가입일</span>
                  <span>{formatDateTime(selectedMember.created_at)}</span>

                  <span style={{ color: '#6b7280', fontWeight: 500 }}>회원 ID</span>
                  <span style={{ fontSize: '11px', color: '#9ca3af', wordBreak: 'break-all' }}>
                    {selectedMember.id}
                  </span>
                </div>

                {/* 구분선 */}
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />

                {/* 기자/편집장 승급 */}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>스태프 승급</h4>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }}>
                    회원을 기자 또는 편집장으로 승급합니다. 승급 후 관리자 페이지 접근이 가능합니다.
                  </p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select
                      className="form-input"
                      value={promoteRole}
                      onChange={(e) => setPromoteRole(e.target.value)}
                      style={{ width: '140px' }}
                    >
                      <option value="reporter">기자</option>
                      <option value="editor">편집장</option>
                    </select>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => promoteToStaff(selectedMember)}
                    >
                      승급
                    </button>
                  </div>
                </div>

                {/* 구분선 */}
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />

                {/* 비밀번호 초기화 */}
                <div>
                  <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>비밀번호 관리</h4>
                  <p style={{ fontSize: '13px', color: '#6b7280', margin: '0 0 12px' }}>
                    비밀번호 재설정 메일을 발송합니다.
                    {selectedMember.provider === 'google' && (
                      <><br /><strong style={{ color: '#b45309' }}>구글 가입 사용자:</strong> 이 메일을 통해 비밀번호를 설정하면 이메일+비밀번호로도 로그인할 수 있습니다.</>
                    )}
                  </p>
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => sendPasswordReset(selectedMember)}
                  >
                    비밀번호 재설정 메일 발송
                  </button>
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
