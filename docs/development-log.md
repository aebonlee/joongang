# 중앙일보 워싱턴 - 개발 이력서

> 프로젝트: 중앙일보 워싱턴지사 인터넷신문 플랫폼
> 최종 업데이트: 2026-05-06
> 배포 URL: https://joongang.dreamitbiz.com
> GitHub: https://github.com/aebonlee/joongang

---

## 1. 프로젝트 개요

### 1.1 목적
중앙일보 워싱턴지사의 온라인 뉴스 플랫폼 구축. 미주 한인사회(DMV 지역: Washington D.C., Virginia, Maryland)를 대상으로 한국 뉴스를 전달하고, 광고 비즈니스를 운영하기 위한 CMS 기반 웹사이트.

### 1.2 기술 스택

| 항목 | 기술 | 버전 |
|------|------|------|
| 프론트엔드 | React + Vite + TypeScript | React 19, Vite 8, TS 6 |
| 백엔드 | Supabase (PostgreSQL + Auth) | - |
| 에디터 | TipTap WYSIWYG | v3.22.5 |
| 라우팅 | React Router DOM | v7.15 |
| 날짜 | date-fns | v4.1 |
| 배포 | GitHub Pages (gh-pages) | - |
| OG 이미지 | sharp (SVG → PNG) | v0.33.5 |

### 1.3 사이트 설정

```typescript
// src/config/site.ts
{
  id: 'joongang',
  name: 'JoongAng Washington',
  nameKo: '중앙일보 워싱턴',
  description: '미주 한인사회의 신뢰받는 뉴스 - 중앙일보 워싱턴지사',
  url: 'https://joongang.dreamitbiz.com',
  dbPrefix: 'joongang_',
}
```

---

## 2. 디렉토리 구조

```
joongang/
├── public/
│   ├── CNAME                    # joongang.dreamitbiz.com
│   ├── favicon.svg              # 레드 J 마크
│   ├── logo_thejoongang.png     # 중앙일보 공식 로고
│   ├── og-image.png             # OG 이미지 (1200x630)
│   └── 404.html                 # SPA 라우팅용
├── scripts/
│   └── generate-og-image.mjs    # OG 이미지 생성 스크립트
├── supabase/
│   ├── schema.sql               # 전체 DB 스키마
│   ├── seed-step1-sections.sql  # 섹션 시드 데이터
│   ├── seed-step2-subsections.sql
│   ├── seed-step3-articles.sql  # 더미 기사 20건
│   ├── seed-step4-mappings.sql  # 기사-섹션 매핑
│   └── fix-rls.sql              # RLS 비활성화 쿼리
├── src/
│   ├── config/
│   │   └── site.ts              # 사이트 설정
│   ├── contexts/
│   │   └── AuthContext.tsx       # 인증 컨텍스트 (Staff 기반)
│   ├── lib/
│   │   └── supabase.ts          # Supabase 클라이언트
│   ├── types/
│   │   └── index.ts             # 전체 타입 정의
│   ├── styles/
│   │   └── global.css           # 글로벌 CSS + 브랜드 컬러
│   ├── layouts/
│   │   ├── PublicLayout.tsx      # 공개 페이지 레이아웃
│   │   └── AdminLayout.tsx      # 관리자 레이아웃
│   ├── components/
│   │   ├── public/
│   │   │   ├── Header.tsx       # 헤더 (시간/날씨)
│   │   │   ├── Header.css
│   │   │   ├── Footer.tsx       # 푸터
│   │   │   └── Footer.css
│   │   ├── admin/
│   │   │   ├── AdminSidebar.tsx # 관리자 사이드바
│   │   │   ├── AdminSidebar.css
│   │   │   ├── AdminHeader.tsx  # 관리자 상단바
│   │   │   └── AdminHeader.css
│   │   └── ProtectedRoute.tsx   # 인증 가드
│   ├── pages/
│   │   ├── public/              # 공개 페이지 (4개)
│   │   ├── auth/                # 인증 페이지 (3개)
│   │   └── admin/               # 관리자 페이지 (18개)
│   ├── App.tsx                  # 라우팅
│   └── main.tsx                 # 진입점
├── docs/
│   └── development-log.md       # 이 파일
├── index.html                   # 폰트 + OG 메타
└── package.json
```

---

## 3. Supabase 데이터베이스

### 3.1 테이블 목록 (prefix: `joongang_`)

| 테이블 | 설명 | 비고 |
|--------|------|------|
| `joongang_articles` | 기사 | 메인 콘텐츠 테이블 |
| `joongang_sections` | 섹션(카테고리) | 2단계 계층 (parent_id) |
| `joongang_article_sections` | 기사-섹션 매핑 | 다대다 관계 |
| `joongang_article_positions` | 기사 출력위치 | 메인/서브 배치 |
| `joongang_article_attachments` | 기사 첨부파일 | - |
| `joongang_comments` | 댓글 | 기사별 댓글 |
| `joongang_staff` | 스태프 | 관리자/편집장/기자 |
| `joongang_ads` | 광고 | 배너 광고 관리 |
| `joongang_ad_slots` | 광고 슬롯 | 위치/크기 정의 |
| `joongang_advertisers` | 광고주 | 업체 정보 |
| `joongang_ad_templates` | 광고 템플릿 | HTML 디자인 템플릿 |
| `joongang_subscribers` | 뉴스레터 구독자 | 이메일 구독 |
| `joongang_tips` | 기사제보 | 독자 제보 관리 |
| `joongang_menu_settings` | 메뉴 설정 | 네비게이션 구성 |
| `joongang_popups` | 팝업 | 사이트 팝업 |
| `joongang_boards` | 게시판 | 커뮤니티 |
| `joongang_board_posts` | 게시글 | 커뮤니티 글 |

### 3.2 RLS (Row Level Security)
- 모든 `joongang_*` 테이블에 대해 **RLS 비활성화** 상태
- 공개 뉴스 사이트 특성상 anon 역할의 SELECT 접근이 필요하여 비활성화
- GRANT SELECT ON ALL TABLES TO anon, authenticated 적용 완료

### 3.3 시드 데이터
- 9개 상위 섹션: 정치, 경제, 한인사회, DC/VA/MD, 문화, 오피니언, 포토/영상, 한국뉴스, 국제
- 10개 하위 섹션
- 20개 더미 기사 (워싱턴 지사 콘텐츠)

---

## 4. 공개 페이지 (Public)

### 4.1 페이지 목록

| 경로 | 컴포넌트 | 설명 |
|------|----------|------|
| `/` | HomePage | 메인 페이지 (레이아웃 엔진) |
| `/section/:slug` | SectionPage | 섹션별 기사 목록 |
| `/section/:slug/:subSlug` | SectionPage | 하위 섹션 |
| `/article/:slug` | ArticlePage | 기사 상세 |
| `/search` | SearchPage | 검색 결과 |
| `/login` | LoginPage | 로그인 |
| `/register` | RegisterPage | 회원가입 |
| `/auth/callback` | AuthCallbackPage | OAuth 콜백 |

### 4.2 헤더 기능
- **이중 시계**: 서울 시간 + 워싱턴 D.C. 시간 (1분마다 자동 갱신)
- **날씨**: Open-Meteo API로 워싱턴 D.C. 실시간 날씨 표시
- **네비게이션**: Supabase에서 섹션 목록 동적 로드
- **검색**: 키워드 검색 → /search?q= 이동
- **모바일 메뉴**: 햄버거 버튼으로 토글

### 4.3 디자인 브랜딩
- **브랜드 컬러**: `#E2231A` (중앙일보 레드)
- **다크 영역**: `#1B1B1B` (상단바, 네비게이션, 푸터)
- **로고**: `logo_thejoongang.png` (공식 로고 파일)
- **폰트**: `font.joongang.co.kr` 서버에서 Noto Sans KR 로드
- **파비콘**: 레드 배경 + 흰색 J 마크 SVG

---

## 5. 관리자 페이지 (Admin)

### 5.1 인증 체계
- Supabase Auth (이메일/비밀번호 + Google OAuth)
- `joongang_staff` 테이블에 등록된 사용자만 관리자 접근 가능
- 역할: `superadmin` (최고관리자), `editor` (편집장), `reporter` (기자)
- `ProtectedRoute` 컴포넌트로 비인증 사용자 차단

### 5.2 관리자 메뉴 구조 & 페이지 목록 (총 18개)

```
대시보드
  └ 대시보드 (/admin)

뉴스관리
  ├ 뉴스관리 (/admin/articles)          - ArticleList
  ├ 뉴스등록 (/admin/articles/write)    - ArticleEditor (TipTap)
  ├ 출력대기 뉴스 (/admin/articles/pending) - PendingArticles
  ├ 포토 뉴스관리 (/admin/articles/photo)   - PhotoArticles
  └ 동영상 뉴스관리 (/admin/articles/video) - VideoArticles

뉴스레터
  └ 뉴스레터 신청 관리 (/admin/newsletter)  - NewsletterManager

콘텐츠
  ├ 기사제보 관리 (/admin/tips)         - TipManager
  ├ 뉴스댓글 관리 (/admin/comments)     - CommentManager
  ├ 보도기사 제공 (/admin/press-release) - PressRelease
  └ 뉴스와이어 제공 (/admin/newswire)    - NewswireManager

광고관리
  ├ 광고 현황 (/admin/ads)              - AdManager
  ├ 슬롯 관리 (/admin/ads/slots)        - AdSlotManager
  ├ 광고주 관리 (/admin/ads/advertisers) - AdvertiserManager
  └ 디자인 템플릿 (/admin/ads/templates) - AdTemplateManager

설정
  ├ 섹션 관리 (/admin/sections)         - SectionManager
  ├ 스태프 관리 (/admin/staff)          - StaffManager
  └ 환경설정 (/admin/settings)          - SiteSettings
```

### 5.3 주요 관리자 기능

#### 기사 관리 (ArticleList / ArticleEditor)
- 기사 CRUD + TipTap WYSIWYG 에디터
- 상태 필터 (작성중/대기/발행/예약/보관)
- 형태 필터 (일반/포토/동영상)
- 제목 검색 + 페이지네이션 (20건/페이지)
- 일괄 선택 → 상태 변경/삭제
- 출력위치 시스템 (메인 헤드라인, 상단, 중앙 등)
- 섹션 매핑 (다중 섹션 할당)

#### 출력대기 (PendingArticles)
- status='pending' 기사만 필터링
- 일괄 발행 / 일괄 반려
- 개별 발행 버튼

#### 포토/동영상 뉴스 (PhotoArticles / VideoArticles)
- article_type별 필터링된 기사 목록
- 썸네일 미리보기 컬럼
- 동영상 URL 표시

#### 댓글 관리 (CommentManager)
- 전체/공개/숨김 필터
- 기사 제목 연동 (JOIN)
- 공개↔숨김 토글 + 삭제

#### 기사제보 (TipManager)
- 상태별 필터 (접수/검토중/채택/반려)
- 목록 + 상세 패널 레이아웃
- 상태 변경 버튼

#### 뉴스레터 (NewsletterManager)
- 구독자 통계 (전체/활성/해지)
- 구독 상태 토글 + 삭제
- 페이지네이션

#### 보도기사/뉴스와이어 (PressRelease / NewswireManager)
- 발행된 기사 선택 → 외부 배포
- 일괄 선택 + 검색 필터

#### 광고 관리 (AdManager + AdSlotManager + AdvertiserManager + AdTemplateManager)
- 광고 CRUD (배너 이미지/링크/기간)
- 슬롯 관리 (위치/크기/디바이스)
- 광고주 CRUD (업체정보/연락처)
- HTML 디자인 템플릿 관리
- 노출수/클릭수 통계
- 활성/만료 상태 관리

#### 섹션 관리 (SectionManager)
- 2단계 카테고리 CRUD
- 상위/하위 섹션 구분
- 정렬 순서 + 활성화 토글

#### 스태프 관리 (StaffManager)
- superadmin만 접근 가능
- 스태프 CRUD (이름/이메일/역할/부서/직책)
- 바이라인 설정
- 활성화 토글

#### 환경설정 (SiteSettings)
- 사이트 기본 정보 (이름/URL/설명)
- 연락처 정보
- 뉴스 설정 (페이지당 기사 수, 댓글 허용/승인제)
- 유지보수 모드

---

## 6. 타입 정의 (TypeScript)

### 6.1 핵심 타입

```typescript
Article         // 기사 (title, slug, content, status, article_type, ...)
Section         // 섹션 (name, slug, parent_id, depth, sort_order, ...)
Staff           // 스태프 (name, email, role, department, position, ...)
Comment         // 댓글 (article_id, user_name, content, is_hidden, ...)
Ad              // 광고 (slot_id, title, image_url, start/end_date, ...)
AdSlot          // 광고 슬롯 (slot_code, page_type, device_type, width, height, ...)
Advertiser      // 광고주 (company_name, contact_name, contact_email, ...)
AdTemplate      // 광고 템플릿 (name, slot_size, html_template, variables, ...)
Subscriber      // 구독자 (email, name, is_active, subscribed_at, ...)
Tip             // 기사제보 (title, content, status, reporter_name, ...)
ArticlePosition // 출력위치 (position_type, priority, ...)
```

### 6.2 출력위치 타입

```typescript
type PositionType =
  | 'main_headline'     // 메인 헤드라인
  | 'main_top'          // 메인 상단
  | 'main_center'       // 메인 중앙
  | 'main_recommend'    // 추천 기사
  | 'main_photo_video'  // 포토/영상
  | 'sub_headline'      // 서브 헤드라인
  | 'sub_top'           // 서브 상단
  | 'sub_right';        // 서브 우측
```

---

## 7. 외부 API 연동

### 7.1 날씨 (Open-Meteo)
```
GET https://api.open-meteo.com/v1/forecast
  ?latitude=38.9072
  &longitude=-77.0369
  &current=temperature_2m,weather_code
  &timezone=America/New_York
```
- API 키 불필요 (무료)
- 헤더 상단바에 워싱턴 D.C. 날씨 표시
- 날씨 코드 → 한국어 설명 + 이모지 변환

### 7.2 폰트 (중앙일보 자체 서버)
```css
@font-face {
  font-family: 'Noto Sans KR';
  src: url(//font.joongang.co.kr/v25/NotoSansKR-{weight}.woff2);
}
```
- Thin(100), Light(300), Regular(400), Medium(500), Bold(700), Black(900)

---

## 8. 빌드 & 배포

### 8.1 명령어
```bash
npm run dev          # 개발 서버 (vite)
npm run build        # tsc -b && vite build
npm run deploy       # gh-pages -d dist
npm run og-image     # OG 이미지 생성 (sharp)
```

### 8.2 배포 환경
- **호스팅**: GitHub Pages
- **도메인**: joongang.dreamitbiz.com (CNAME)
- **SPA 라우팅**: 404.html로 리다이렉트 처리

---

## 9. 커밋 이력

| 커밋 | 날짜 | 내용 |
|------|------|------|
| `b76c4c3` | 2026-05-06 | Initial commit |
| `ec43efa` | 2026-05-06 | Create CNAME |
| `799e2bf` | 2026-05-06 | feat: 중앙뉴스 인터넷신문 플랫폼 초기 구축 |
| `633c84b` | 2026-05-06 | fix: TypeScript 6 빌드 오류 수정 |
| `eaa7b04` | 2026-05-06 | fix: 빈 페이지 문제 해결 - Supabase fallback + SPA routing |
| `b106dee` | 2026-05-06 | feat: 중앙일보 워싱턴지사 브랜딩 + 더미 데이터 SQL 추가 |
| `b52c603` | 2026-05-06 | fix: supabase anon key를 하드코딩 폴백으로 추가 |
| `d7f6f0f` | 2026-05-06 | style: 중앙일보 브랜드 컬러(#E2231A) 적용 + 로고 SVG |
| `7237547` | 2026-05-06 | style: 로고 SVG 이미지로 교체 + Noto Serif KR 폰트 추가 |
| `dc59921` | 2026-05-06 | style: 중앙일보 자체 폰트 서버 사용으로 변경 |
| `c5be00f` | 2026-05-06 | Add files via upload (logo_thejoongang.png) |
| `ff8fbb6` | 2026-05-06 | style: 중앙일보 공식 로고 적용 |
| `d18f546` | 2026-05-06 | style: 푸터 로고를 중앙일보 공식 로고로 교체 |
| `8c4c14c` | 2026-05-06 | style: 파비콘 중앙일보 레드 J 마크 + OG 이미지 재생성 |
| `0066752` | 2026-05-06 | style: OG 이미지 밝은 디자인으로 변경 |
| `71dbcbd` | 2026-05-06 | chore: sharp devDependency 추가 |
| `2c5b492` | 2026-05-06 | feat: 상단바 한국/워싱턴 시간 + 날씨 표시 |
| `a5b469f` | 2026-05-06 | feat: 관리자 페이지 13개 추가 + 사이드바 메뉴 재구성 |

---

## 10. 해결된 이슈

### 10.1 Supabase RLS 문제
- **증상**: 기사가 전혀 표시되지 않음 (anon 역할에서 0건 반환)
- **시도 1**: RLS 정책 생성 (TO anon, authenticated) → 실패
- **시도 2**: GRANT SELECT 추가 → 실패
- **해결**: 모든 `joongang_*` 테이블에 대해 RLS 비활성화 (`ALTER TABLE ... DISABLE ROW LEVEL SECURITY`)

### 10.2 빈 페이지 문제
- **증상**: 배포 후 빈 화면
- **원인**: `.env` 환경변수가 빌드 시 임베드되지 않음
- **해결**: `supabase.ts`에 anon key 하드코딩 폴백 추가

### 10.3 SQL 시드 데이터 오류
- **증상**: 합쳐진 SQL 파일에서 구문 오류
- **원인**: 특수문자(·) 및 긴 SQL 파일
- **해결**: 4단계(sections → subsections → articles → mappings)로 분리 실행

### 10.4 관리자 접속 불가
- **증상**: `/admin` 접속 시 로그인 리다이렉트
- **원인**: `joongang_staff` 테이블에 RLS + GRANT 미설정
- **해결**: RLS 비활성화 + GRANT SELECT 적용

---

## 11. 파일 통계

| 구분 | 파일 수 |
|------|---------|
| TypeScript (.tsx) | 35 |
| TypeScript (.ts) | 4 |
| CSS (.css) | 19 |
| SQL (.sql) | 7 |
| JavaScript (.mjs) | 1 |
| **총 소스 파일** | **66** |

### 관리자 페이지 상세 (18개)

| 카테고리 | 페이지 | 파일 |
|----------|--------|------|
| 대시보드 | 대시보드 | AdminDashboard.tsx |
| 뉴스관리 | 뉴스관리 (기사 목록) | ArticleList.tsx |
| 뉴스관리 | 뉴스등록 (기사 에디터) | ArticleEditor.tsx |
| 뉴스관리 | 출력대기 뉴스 | PendingArticles.tsx |
| 뉴스관리 | 포토 뉴스관리 | PhotoArticles.tsx |
| 뉴스관리 | 동영상 뉴스관리 | VideoArticles.tsx |
| 뉴스레터 | 뉴스레터 신청 관리 | NewsletterManager.tsx |
| 콘텐츠 | 기사제보 관리 | TipManager.tsx |
| 콘텐츠 | 뉴스댓글 관리 | CommentManager.tsx |
| 콘텐츠 | 보도기사 제공 | PressRelease.tsx |
| 콘텐츠 | 뉴스와이어 제공 | NewswireManager.tsx |
| 광고관리 | 광고 현황 | AdManager.tsx |
| 광고관리 | 슬롯 관리 | AdSlotManager.tsx |
| 광고관리 | 광고주 관리 | AdvertiserManager.tsx |
| 광고관리 | 디자인 템플릿 | AdTemplateManager.tsx |
| 설정 | 섹션 관리 | SectionManager.tsx |
| 설정 | 스태프 관리 | StaffManager.tsx |
| 설정 | 환경설정 | SiteSettings.tsx |

---

## 12. 향후 개발 계획

- [ ] 실시간 기사 크롤링 (중앙일보 본사 연동)
- [ ] 광고 노출/클릭 추적 시스템
- [ ] 뉴스레터 자동 발송 (Resend 연동)
- [ ] 기사 예약 발행 (pg_cron)
- [ ] 이미지 최적화 (Supabase Storage + CDN)
- [ ] 모바일 앱 (React Native 또는 PWA)
- [ ] 댓글 알림 시스템
- [ ] 광고 리포트 대시보드
- [ ] SEO 최적화 (sitemap.xml, robots.txt)
- [ ] 다국어 지원 (한국어/영어)

---

**Copyright (c) 2025-2026 DreamIT Biz (Ph.D Aebon Lee). All Rights Reserved.**
