# Joongang 인터넷신문 플랫폼 — 개발 이력서

> **작성일**: 2026-05-06 (업데이트: 2026-05-09)
> **프로젝트명**: joongang
> **경로**: `D:\dreamit-web\joongang\`
> **배포 URL**: https://joongang.dreamitbiz.com
> **GitHub**: https://github.com/aebonlee/joongang
> **DB Prefix**: `joongang_`

---

## 1. 프로젝트 개요

넷프로 인터넷신문 와이드형C 템플릿을 참고하여, React 19 + Vite 8 + TypeScript + Supabase 기반으로 처음부터 새로 구축한 온라인 뉴스 플랫폼.

### 기술 스택
| 항목 | 기술 |
|------|------|
| 프론트엔드 | React 19.2 + Vite 8 + TypeScript 6 |
| 백엔드 | Supabase (PostgreSQL + Auth) |
| 인증 | Supabase Auth (Email + Google OAuth) |
| 에디터 | TipTap 3.x (WYSIWYG) |
| 날짜 | date-fns 4 |
| 라우팅 | react-router-dom 7 |
| OG 이미지 | sharp (Node.js) |
| 배포 | GitHub Pages (gh-pages) |

### DreamIT 템플릿 미사용
- templete-ref 패턴을 사용하지 않고 완전히 새로 구축
- 신문사 전용 디자인/레이아웃 적용
- 뉴스 CMS 특화 기능 개발

---

## 2. 디렉토리 구조

```
D:\dreamit-web\joongang\
├── index.html                          # OG/SEO 메타태그 포함
├── package.json                        # 의존성 정의
├── vite.config.ts                      # Vite 설정 (@ alias)
├── tsconfig.json / tsconfig.app.json   # TypeScript 설정
├── .env.example                        # 환경변수 템플릿
├── .gitignore
├── public/
│   ├── CNAME                           # joongang.dreamitbiz.com
│   ├── favicon.svg
│   └── og-image.png                    # OG 이미지 (생성 필요)
├── scripts/
│   └── generate-og-image.mjs           # sharp 기반 OG 이미지 생성기
├── supabase/
│   └── schema.sql                      # 전체 DB 스키마 (24 테이블)
└── src/
    ├── vite-env.d.ts                   # Vite 환경변수 타입
    ├── main.tsx                         # 앱 엔트리포인트
    ├── App.tsx                          # 라우팅 정의
    ├── config/
    │   └── site.ts                     # 사이트 설정
    ├── lib/
    │   └── supabase.ts                 # Supabase 클라이언트
    ├── types/
    │   └── index.ts                    # 전체 타입 정의
    ├── contexts/
    │   └── AuthContext.tsx             # 인증 컨텍스트
    ├── styles/
    │   └── global.css                  # 전역 스타일
    ├── layouts/
    │   ├── PublicLayout.tsx            # 독자 사이트 레이아웃
    │   ├── AdminLayout.tsx            # 관리자 레이아웃
    │   └── AdminLayout.css
    ├── components/
    │   ├── ProtectedRoute.tsx         # 인증 보호 라우트
    │   ├── public/
    │   │   ├── Header.tsx             # 신문 헤더 (탑바+로고+네비게이션)
    │   │   ├── Header.css
    │   │   ├── Footer.tsx             # 신문 푸터
    │   │   └── Footer.css
    │   └── admin/
    │       ├── AdminSidebar.tsx        # 관리자 사이드바 메뉴
    │       ├── AdminSidebar.css
    │       ├── AdminHeader.tsx         # 관리자 상단바
    │       └── AdminHeader.css
    └── pages/
        ├── auth/
        │   ├── LoginPage.tsx           # 로그인 (이메일 + Google)
        │   ├── RegisterPage.tsx        # 회원가입 (이메일 + Google)
        │   ├── AuthCallbackPage.tsx    # OAuth 콜백
        │   └── AuthPages.css
        ├── public/
        │   ├── HomePage.tsx            # 메인 (헤드라인+주요+최신+사이드바)
        │   ├── HomePage.css
        │   ├── SectionPage.tsx         # 섹션별 기사 목록
        │   ├── SectionPage.css
        │   ├── ArticlePage.tsx         # 기사 상세 (공유+관련기사)
        │   ├── ArticlePage.css
        │   └── SearchPage.tsx          # 검색 결과
        └── admin/
            ├── AdminDashboard.tsx       # 대시보드 (통계+최근기사)
            ├── AdminDashboard.css
            ├── articles/
            │   ├── ArticleList.tsx      # 기사 목록 (필터+벌크액션)
            │   ├── ArticleList.css
            │   ├── ArticleEditor.tsx    # 기사 등록/수정 (TipTap)
            │   └── ArticleEditor.css
            ├── sections/
            │   ├── SectionManager.tsx   # 섹션 CRUD
            │   └── SectionManager.css
            └── ads/
                ├── AdManager.tsx        # 광고 관리
                └── AdManager.css
```

---

## 3. 라우팅 구조

### 3.1 독자 사이트 (Public)
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/` | HomePage | 메인 (헤드라인+주요뉴스+최신+포토+인기) |
| `/section/:slug` | SectionPage | 1차 섹션 기사 목록 |
| `/section/:slug/:subSlug` | SectionPage | 2차 섹션 기사 목록 |
| `/article/:slug` | ArticlePage | 기사 상세 (조회수+SNS공유+관련기사) |
| `/search?q=` | SearchPage | 검색 결과 |
| `/login` | LoginPage | 로그인 |
| `/register` | RegisterPage | 회원가입 |
| `/auth/callback` | AuthCallbackPage | OAuth 콜백 처리 |

### 3.2 관리자 (Admin, 인증 필수)
| 경로 | 페이지 | 설명 |
|------|--------|------|
| `/admin` | AdminDashboard | 통계 대시보드 |
| `/admin/articles` | ArticleList | 기사 목록/필터/일괄작업 |
| `/admin/articles/write` | ArticleEditor | 기사 등록 |
| `/admin/articles/:id/edit` | ArticleEditor | 기사 수정 |
| `/admin/sections` | SectionManager | 섹션(카테고리) 관리 |
| `/admin/ads` | AdManager | 광고 관리 |

---

## 4. 인증 시스템

### 4.1 지원 방식
- **이메일/비밀번호**: Supabase Auth `signUp`, `signInWithPassword`
- **Google OAuth**: Supabase Auth `signInWithOAuth({ provider: 'google' })`

### 4.2 권한 구조
| 역할 | 설명 | 권한 |
|------|------|------|
| `superadmin` | 최고 관리자 | 모든 기능 |
| `editor` | 편집자 | 기사 발행/관리, 광고 관리 |
| `reporter` | 기자 | 기사 작성/수정 |

### 4.3 AuthContext 제공 값
```typescript
interface AuthContextType {
  user: User | null;
  session: Session | null;
  staff: Staff | null;           // joongang_staff 테이블에서 조회
  loading: boolean;
  signInWithEmail(email, password): Promise<{ error }>;
  signUpWithEmail(email, password, name): Promise<{ error }>;
  signInWithGoogle(): Promise<{ error }>;
  signOut(): Promise<void>;
  isAdmin: boolean;              // superadmin
  isEditor: boolean;             // editor + superadmin
  isReporter: boolean;           // reporter + editor + superadmin
}
```

---

## 5. 뉴스 CMS 기능 (ArticleEditor)

### 5.1 기사 등록 폼 필드
넷프로 매뉴얼을 참고하여 구현한 필드:

| 필드 | 설명 | 구현 |
|------|------|------|
| 뉴스형태 | 일반/포토/동영상 라디오 선택 | ✅ |
| 1차 섹션 | 최상위 섹션 select | ✅ |
| 2차 섹션 | 하위 섹션 select (동적) | ✅ |
| 출력위치 | 8가지 위치 체크박스 | ✅ |
| 제목/부제목 | text input | ✅ |
| 대표이미지 | 파일업로드 + URL 입력 + 미리보기 | ✅ |
| 워터마크 | 체크박스 | ✅ |
| 이미지 캡션 | text input | ✅ |
| 동영상 URL | textarea (유튜브 embed 코드) | ✅ (video 선택 시) |
| 본문 에디터 | TipTap WYSIWYG | ✅ |
| 출처/출처링크 | text input | ✅ |
| 요약문 | textarea (200자) | ✅ |
| 키워드 | 태그 입력 (Enter로 추가) | ✅ |
| 발행 상태 | 임시저장/발행 버튼 | ✅ |

### 5.2 출력위치 시스템
```
main_headline    → 메인 헤드라인 (1건)
main_top         → 메인 탑뉴스 (4건)
main_center      → 메인 중앙뉴스
main_recommend   → 추천기사
main_photo_video → 포토/영상
sub_headline     → 서브 헤드라인
sub_top          → 서브 탑뉴스
sub_right        → 서브 우측
```

### 5.3 TipTap 에디터 기능
- Bold, Italic, Underline
- H2, H3 제목
- 좌/중/우 정렬
- 인용(blockquote)
- 목록(bullet list)
- 이미지 삽입 (Supabase Storage 업로드)
- 링크 삽입

### 5.4 기사 목록 관리 (ArticleList)
- 상태별 필터 (전체/작성중/대기/발행/예약/보관)
- 형태별 필터 (전체/일반/포토/동영상)
- 제목 검색
- 체크박스 선택 → 일괄 발행/보관/삭제
- 페이지네이션 (20건 단위)

---

## 6. 광고 시스템

### 6.1 기본 슬롯 (14개 seed data)
| 코드 | 위치 | 크기 | 디바이스 |
|------|------|------|----------|
| pc_main_top | PC 메인 상단 | 728x90 | PC |
| pc_main_side_1 | PC 메인 사이드바 상단 | 300x250 | PC |
| pc_main_side_2 | PC 메인 사이드바 중간 | 300x250 | PC |
| pc_main_mid | PC 메인 중앙 | 728x90 | PC |
| pc_main_bottom | PC 메인 하단 | 728x90 | PC |
| pc_section_top | PC 섹션 상단 | 728x90 | PC |
| pc_section_side_1 | PC 섹션 사이드바 | 300x250 | PC |
| pc_article_top | PC 기사 상단 | 728x90 | PC |
| pc_article_mid | PC 기사 중간 | 468x60 | PC |
| pc_article_bottom | PC 기사 하단 | 728x90 | PC |
| mobile_main_top | 모바일 메인 상단 | 320x100 | Mobile |
| mobile_main_mid | 모바일 메인 중간 | 320x250 | Mobile |
| mobile_article_top | 모바일 기사 상단 | 320x100 | Mobile |
| mobile_article_bottom | 모바일 기사 하단 | 320x250 | Mobile |

### 6.2 광고 관리 기능
- 광고 등록 (슬롯 선택, 이미지 URL, 링크, 기간 설정)
- 분 단위 시작/종료 일시 설정
- 활성/비활성 토글
- 만료 자동 감지 표시
- 노출/클릭 통계 표시
- 이미지 미리보기

### 6.3 통계 함수
- `joongang_increment_impression(p_ad_id)`: 노출 수 증가 + 시간별 집계
- `joongang_increment_click(p_ad_id)`: 클릭 수 증가 + 시간별 집계

---

## 7. DB 스키마 요약

### 테이블 목록 (24개, 모두 `joongang_` 접두사)

| # | 테이블 | 설명 |
|---|--------|------|
| 1 | joongang_sections | 섹션(카테고리) - 2단계 계층 |
| 2 | joongang_staff | 스태프 (관리자/편집자/기자) |
| 3 | joongang_articles | 기사 (핵심 테이블) |
| 4 | joongang_article_sections | 기사-섹션 M:N 매핑 |
| 5 | joongang_article_positions | 기사 출력위치 매핑 |
| 6 | joongang_article_attachments | 첨부파일 |
| 7 | joongang_article_keywords | 키워드/해시태그 |
| 8 | joongang_related_articles | 관련기사 |
| 9 | joongang_comments | 댓글 (대댓글 지원) |
| 10 | joongang_ad_slots | 광고 슬롯 정의 |
| 11 | joongang_advertisers | 광고주 |
| 12 | joongang_ad_templates | 광고 디자인 템플릿 |
| 13 | joongang_ads | 광고 등록 |
| 14 | joongang_ad_stats | 광고 시간별 통계 |
| 15 | joongang_boards | 게시판 정의 |
| 16 | joongang_board_posts | 게시판 글 |
| 17 | joongang_subscribers | 뉴스레터 구독자 |
| 18 | joongang_tips | 기사 제보 |
| 19 | joongang_popups | 팝업 레이어 |
| 20 | joongang_site_settings | 사이트 환경설정 |
| 21 | joongang_layout_settings | 페이지별 레이아웃 설정 |
| 22 | joongang_design_settings | 디자인 전역 설정 |
| 23 | joongang_visitor_stats | 방문자 통계 |
| 24 | joongang_menu_settings | 메뉴 설정 |

### RLS 정책
- 발행된 기사: 전체 공개 읽기
- 스태프: 모든 기사 CRUD
- 섹션: 활성 섹션만 공개 읽기
- 댓글: 숨겨지지 않은 댓글 공개 읽기, 인증 사용자 작성 가능
- 광고: 활성+기간내 광고만 공개 읽기

### Trigger & Functions
- `joongang_update_timestamp()`: articles, ads 수정 시 `updated_at` 자동 갱신
- `joongang_increment_impression(uuid)`: 광고 노출 집계
- `joongang_increment_click(uuid)`: 광고 클릭 집계

---

## 8. OG 이미지 생성

### 스크립트: `scripts/generate-og-image.mjs`
- **도구**: sharp (devDependency)
- **출력**: `public/og-image.png` (1200x630px)
- **디자인**: 다크 그라데이션 배경 + "중앙뉴스" 타이틀 + URL
- **실행**: `npm run og-image`

### OG 메타태그 (index.html)
```html
<meta property="og:type" content="website" />
<meta property="og:url" content="https://joongang.dreamitbiz.com" />
<meta property="og:title" content="중앙뉴스 - 종합 인터넷신문" />
<meta property="og:description" content="신뢰할 수 있는 종합 인터넷신문..." />
<meta property="og:image" content="https://joongang.dreamitbiz.com/og-image.png" />
<meta property="og:site_name" content="중앙뉴스" />
<meta property="og:locale" content="ko_KR" />
```

카카오 디버거: https://developers.kakao.com/tool/debugger/sharing

---

## 9. 독자 프론트엔드 디자인

### 9.1 메인 페이지 레이아웃
```
┌──────────────────────────────────────────────┐
│ [탑바: 날짜 | 로그인/회원가입]                  │
├──────────────────────────────────────────────┤
│ [로고: 중앙뉴스]              [검색바]         │
├──────────────────────────────────────────────┤
│ [네비게이션: 홈|정치|경제|사회|문화|스포츠|...]  │
├──────────────────────────────────────────────┤
│                                              │
│ ┌─── 헤드라인 ────────────────────────────┐  │
│ │ [이미지 500px] │ 제목 (30px bold)         │  │
│ │                │ 부제목                   │  │
│ │                │ 요약문                   │  │
│ └─────────────────────────────────────────┘  │
│                                              │
│ ┌─── 메인 ──────────┐ ┌── 사이드바 ──────┐  │
│ │ [주요뉴스 2x2 그리드]│ │ [포토뉴스]      │  │
│ │                    │ │ [인기기사 TOP5]  │  │
│ │ [최신뉴스 리스트]    │ │                 │  │
│ └────────────────────┘ └─────────────────┘  │
│                                              │
├──────────────────────────────────────────────┤
│ [푸터: 신문사정보 | 링크]                      │
└──────────────────────────────────────────────┘
```

### 9.2 색상 체계
```css
--primary: #1a1a2e       /* 다크 네이비 */
--news-blue: #2c3e50     /* 뉴스 블루 (네비게이션) */
--news-red: #c0392b      /* 속보/강조 레드 */
--section-divider: #c0392b
```

### 9.3 반응형 대응
- Desktop: 1200px max-width, 2컬럼 (메인+사이드바)
- Mobile (≤768px): 1컬럼, 사이드바 숨김, 햄버거 메뉴

---

## 10. 관리자 대시보드

### 사이드바 메뉴 구조
```
대시보드
  └── 대시보드 (통계 요약)

뉴스관리
  ├── 기사 목록
  ├── 기사 등록
  ├── 출력대기
  └── 댓글 관리

광고관리
  ├── 광고 현황
  ├── 슬롯 관리
  ├── 광고주 관리
  └── 디자인 템플릿

설정
  ├── 섹션 관리
  ├── 스태프 관리
  └── 환경설정
```

### 대시보드 위젯
- 오늘 등록 기사 수
- 전체 기사 수
- 출력 대기 기사 수
- 총 댓글 수
- 최근 기사 목록 (10건)

---

## 11. Seed Data (초기 데이터)

### 섹션 (9개)
| 코드 | 이름 | 슬러그 |
|------|------|--------|
| 10 | 정치 | politics |
| 20 | 경제 | economy |
| 30 | 사회 | society |
| 40 | 문화 | culture |
| 50 | 스포츠 | sports |
| 60 | 연예 | entertainment |
| 70 | IT/과학 | tech |
| 80 | 국제 | world |
| 90 | 오피니언 | opinion |

### 게시판 (3개)
- notice (공지사항)
- free (자유게시판)
- photo (포토게시판)

### 레이아웃 설정 (3개)
- main: hero_single + grid_2x2 + list
- section: list 20건 + sidebar
- article: byline + share + related 5건

---

## 12. 배포/운영 가이드

### 초기 설정
```bash
# 1. 패키지 설치
cd D:\dreamit-web\joongang
npm install

# 2. 환경변수
cp .env.example .env
# VITE_SUPABASE_URL=https://hcmgdztsgjvzcyxyayaj.supabase.co
# VITE_SUPABASE_ANON_KEY=실제키

# 3. Supabase SQL 실행
# Dashboard > SQL Editor에서 supabase/schema.sql 전체 실행

# 4. Storage 버킷
# Dashboard > Storage > New Bucket: 'joongang-images' (public)

# 5. OG 이미지 생성
npm run og-image

# 6. 개발 서버
npm run dev
```

### 빌드 & 배포
```bash
npm run build    # tsc -b && vite build → dist/
npm run deploy   # gh-pages -d dist
```

### 사용자 수동 처리 목록
| 항목 | 위치 | 설명 |
|------|------|------|
| SQL 스키마 실행 | Supabase SQL Editor | supabase/schema.sql |
| Storage 버킷 | Supabase Dashboard | 'joongang-images' (public) |
| Google OAuth | Supabase Auth > Providers | Google 활성화 + redirect URL 설정 |
| GitHub 리포 | github.com/aebonlee | 'joongang' 리포 생성 |
| DNS CNAME | 도메인 설정 | joongang → aebonlee.github.io |
| 첫 Superadmin | joongang_staff 직접 INSERT | user_id + role='superadmin' |
| pg_cron (선택) | Supabase Extensions | 예약발행 자동 처리 |

---

## 13. 넷프로 매뉴얼 참고 사항

넷프로 인터넷신문 관리자 매뉴얼에서 참고한 핵심 기능:

### 기사 등록 (news_insert)
- 출력위치: 메인면/서브면 위치 시각적 선택
- 뉴스형태: 일반/포토/동영상 3종
- 1차 섹션: 필수 선택 (기사 분류)
- 기자명/이메일: 이전 입력값 자동 저장/재사용
- 대표이미지: 메인 노출 시 썸네일
- 워터마크: 사용 여부 토글
- 본문: MS Word/한글 복사 시 태그 제거 필요
- 출처/출처링크: 원본 출처 표기
- 키워드: 검색 노출용

### 동영상 등록 (video_insert)
- 유튜브 소스코드 복사 → textarea에 붙여넣기
- 일반뉴스/동영상뉴스 모두 유튜브 embed 지원
- 별도 영상 서버 불필요 (유튜브 활용)

### 포토뉴스 (photo_insert)
- 본문 에디터 내 이미지 삽입
- 캡션 추가 가능
- 이미지 크기/정렬 조정

### 메뉴 추가 (menu_insert)
- 뉴스/게시판/내용관리/직접입력 4종 선택
- 게시판명 직접 입력

### 회원관리 (member)
- 숫자 기반 등급 시스템 (높을수록 상위)
- 아이디 변경 불가
- 퇴사 직원 권한 수시 점검 필요

### 배너 광고 (banner_insert)
- 이미지 업로드 방식
- jpg, gif, png 지원
- 원래 크기/사용자 지정 크기 선택
- 클릭 링크 설정

### 팝업 관리 (popup_insert)
- PC/모바일/전체 디바이스 선택
- "다시 보지 않음" 시간 설정
- 시작/종료 일시 (기간 관리)
- 좌측/상단 위치 (px)
- 팝업 크기 (배너보다 크게)

### 보도기사 제공 (rss_news)
- 카테고리별 외부 기사 조회
- "가져오기"로 시스템에 수입
- 중복검사 미지원 → 수동 확인 필요

---

## 14. 2026-05-09 업데이트 — 관리자 권한, 지면보기, 이미지 수정

### 14.1 관리자 권한 3단계 분리

| 역할 | 대시보드 | 메뉴 접근 | 비고 |
|------|----------|-----------|------|
| 기자 (reporter) | 기사 통계 3개만 | 대시보드, 뉴스관리만 | |
| 편집장 (editor) | 전체 통계 6개 | 뉴스/콘텐츠/지면/광고/회원 | 스태프/설정 제외 |
| 최고관리자 (superadmin) | 전체 | 전체 | |

**수정 파일**:
- `src/components/ProtectedRoute.tsx` — `EditorRoute` 가드 컴포넌트
- `src/components/admin/AdminSidebar.tsx` — `REPORTER_GROUPS`, `EDITOR_GROUPS`, `ADMIN_ONLY_ITEMS`
- `src/pages/admin/AdminDashboard.tsx` — `isEditor` 분기
- `src/App.tsx` — `EditorRoute` 래퍼

### 14.2 지면보기 기능

신문 PDF 지면을 날짜/판별로 조회.

**공개 페이지** (`/edition`): 날짜 → 판 선택 → 페이지 그리드 → PDF iframe 뷰어
**관리자 페이지** (`/admin/editions`): PDF 다중 업로드, 개별/날짜별 삭제

**Supabase**:
- 테이블: `joongang_editions` (RLS: SELECT 공개, CUD 인증만)
- Storage: `joongang-editions` 버킷 (Public, PDF, 50MB)

**수정 파일**:
- `src/pages/public/EditionPage.tsx`, `EditionPage.css`
- `src/pages/admin/editions/EditionManager.tsx`
- `src/types/index.ts` — `Edition` 인터페이스
- `supabase-editions-setup.sql` — 테이블+스토리지+RLS SQL

### 14.3 공개 네비게이션 메뉴

헤더에 지면보기(`/edition`) + 기사제보(`/tip`) 메뉴 추가.
- `src/components/public/Header.tsx` — nav 항목
- `src/components/public/Header.css` — `.nav-divider`
- `src/utils/translations.ts` — `nav.edition`, `nav.tip` (한/영)

### 14.4 기사 썸네일 이미지 수정

- **null 썸네일 7건**: `scripts/fix-thumbnails.mjs` — 키워드 기반 Unsplash 매칭
- **깨진 URL 10건**: `scripts/check-broken-images.mjs` — HEAD 체크 + 교체

### 14.5 지면보기 샘플 데이터 (5/1~5/9)

- 워싱턴판(AW) + 동부판(AE), 총 110개 PDF
- `scripts/seed-editions.mjs` — PDF 생성 + Storage 업로드
- `scripts/seed-editions.sql` — DB INSERT (Dashboard 실행)

### 14.6 커밋 이력 (2026-05-09)

| 해시 | 메시지 |
|------|--------|
| `955c20d` | 역할별 관리자 권한 분리 |
| `f111c42` | 지면보기 기능 추가 |
| `25b71b0` | 썸네일 누락 기사 일괄 수정 스크립트 |
| `e00d4fc` | 공개 네비게이션에 지면보기·기사제보 메뉴 |
| `ffef1ef` | 깨진 썸네일 URL 검사·수정 스크립트 |
| `96952c5` | 지면보기 샘플 데이터 시드 스크립트 |

---

## 15. 향후 개발 예정 (Phase 2+)

| 기능 | 설명 | 우선순위 |
|------|------|----------|
| 레이아웃 엔진 GUI | 드래그앤드롭 영역 배치 | 높음 |
| 광고 템플릿 에디터 | 변수 기반 배너 자동 생성 | 높음 |
| 댓글 시스템 | 기사 하단 댓글/대댓글 | 중간 |
| 커뮤니티 게시판 | 공지/자유/포토 게시판 | 중간 |
| 뉴스레터 발송 | Resend 연동 구독자 메일 | 중간 |
| 기사 제보 페이지 | 독자 제보 접수/관리 | 중간 |
| 방문자 통계 | PV/UV 시간대별 차트 | 낮음 |
| 뉴스와이어 연동 | 외부 기사 자동 수신 | 낮음 |
| RSS/Atom 피드 | 기사 자동 피드 생성 | 낮음 |
| 예약발행 cron | pg_cron 기반 자동 발행 | 낮음 |
| 팝업 관리 UI | 팝업 등록/기간관리 | 낮음 |
| 스태프 관리 UI | 기자/편집자 등록/권한 | 낮음 |

---

## 15. 참고 문서

- 기획서: `D:\dreamit-web\knc\joongang-planning.md`
- CLAUDE.md: `D:\dreamit-web\CLAUDE.md`
- 넷프로 매뉴얼: https://news.netpro.co.kr/adm/manual/

---

**Copyright (c) 2025-2026 DreamIT Biz (Ph.D Aebon Lee). All Rights Reserved.**
