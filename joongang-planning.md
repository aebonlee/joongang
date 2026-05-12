# Joongang 인터넷신문 플랫폼 — 종합 기획서

> **프로젝트명**: joongang
> **배포 URL**: https://joongang.dreamitbiz.com
> **GitHub**: https://github.com/aebonlee/joongang
> **DB Prefix**: `joongang_`
> **기술 스택**: React 19 + Vite 8 + TypeScript 5.8 + Supabase
> **작성일**: 2026-05-06

---

## 1. 프로젝트 개요

### 1.1 목적
넷프로 인터넷신문 와이드형C 템플릿의 기능을 React SPA로 완전 재구축하여, 일 100건 이상의 기사를 처리할 수 있는 대규모 뉴스 퍼블리싱 플랫폼을 구축한다.

### 1.2 핵심 목표
- **뉴스 CMS**: 기사 등록/관리/출력위치/예약/자동수신/외부 전송
- **광고 시스템**: 34+ 슬롯, 5~6가지 크기별 배치, 기간관리, 통계, 템플릿 디자인 엔진
- **레이아웃 엔진**: 메인/서브/상세 페이지의 출력 스타일을 관리자가 동적으로 설정
- **대규모 운영**: 일 100건+ 기사, 다수 기자/편집자 동시 작업

### 1.3 범위
| 구분 | 포함 |
|------|------|
| 독자 사이트 (Public) | 메인, 섹션, 기사상세, 포토/동영상, 커뮤니티, 검색 |
| 관리자 대시보드 (Admin) | 뉴스CMS, 회원관리, 광고관리, 디자인설정, 통계, 권한 |
| API/연동 | 뉴스와이어, RSS, 소셜공유, 뉴스레터, SMS |

---

## 2. DB 스키마 설계

> 모든 테이블명 앞에 `joongang_` prefix 적용
> Supabase PostgreSQL + Row Level Security (RLS)

### 2.1 뉴스 핵심 테이블

#### `joongang_articles` (기사)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK DEFAULT gen_random_uuid() | 기사 고유 ID |
| article_number | serial | 기사 일련번호 |
| title | text NOT NULL | 제목 |
| subtitle | text | 부제목 |
| slug | text UNIQUE NOT NULL | URL용 슬러그 |
| content | text NOT NULL | 본문 (HTML) |
| excerpt | text | 요약문 (200자) |
| thumbnail_url | text | 대표이미지 URL |
| thumbnail_caption | text | 이미지 캡션 |
| use_watermark | boolean DEFAULT true | 워터마크 적용 여부 |
| article_type | text DEFAULT 'normal' | 뉴스형태: normal/photo/video |
| video_url | text | 동영상 URL (youtube/vimeo/direct) |
| source_name | text | 출처 |
| source_url | text | 출처 링크 |
| author_id | uuid FK → joongang_staff.id | 작성자 (기자) |
| author_name | text | 작성자명 (표시용) |
| author_email | text | 작성자 이메일 |
| editor_id | uuid FK → joongang_staff.id | 최종 편집자 |
| status | text DEFAULT 'draft' | draft/pending/published/scheduled/archived |
| is_published | boolean DEFAULT false | 즉시공개 여부 |
| published_at | timestamptz | 공개 일시 |
| scheduled_at | timestamptz | 예약 발행 일시 |
| view_count | integer DEFAULT 0 | 조회수 |
| allow_comments | boolean DEFAULT true | 댓글 허용 |
| is_featured | boolean DEFAULT false | 주요기사 표시 |
| priority | integer DEFAULT 0 | 우선순위 (높을수록 상위) |
| created_at | timestamptz DEFAULT now() | 등록일 |
| updated_at | timestamptz DEFAULT now() | 수정일 |

#### `joongang_article_sections` (기사-섹션 매핑, M:N)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| article_id | uuid FK → articles | |
| section_id | uuid FK → sections | |
| is_primary | boolean DEFAULT false | 1차 섹션 여부 |
| sort_order | integer DEFAULT 0 | 정렬 순서 |

#### `joongang_article_positions` (출력위치 매핑)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| article_id | uuid FK → articles | |
| position_type | text NOT NULL | main_headline/main_top/main_center/main_recommend/main_photo_video/sub_headline/sub_top/sub_right |
| priority | integer DEFAULT 0 | 같은 위치 내 우선순위 |
| assigned_at | timestamptz DEFAULT now() | |
| expires_at | timestamptz | 만료 시간 (null=무기한) |

#### `joongang_sections` (뉴스 섹션/카테고리)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| section_code | integer UNIQUE NOT NULL | 섹션코드 (10, 20, 30...) |
| name | text NOT NULL | 섹션명 (뉴스, 연예, 스포츠...) |
| slug | text UNIQUE NOT NULL | URL slug |
| parent_id | uuid FK → sections (self) | 상위 섹션 (null=최상위) |
| depth | integer DEFAULT 0 | 깊이 (0=1단계, 1=2단계) |
| sort_order | integer DEFAULT 0 | 메뉴 정렬 |
| is_active | boolean DEFAULT true | 사용 여부 |
| icon | text | 아이콘 클래스/SVG |
| seo_title | text | SEO 타이틀 |
| seo_description | text | SEO 설명 |
| created_at | timestamptz DEFAULT now() | |

#### `joongang_article_attachments` (첨부파일, 최대 5개)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| article_id | uuid FK → articles | |
| file_url | text NOT NULL | Storage URL |
| file_name | text NOT NULL | 원본 파일명 |
| file_size | bigint | 파일 크기 (bytes) |
| mime_type | text | MIME 타입 |
| sort_order | integer DEFAULT 0 | |
| created_at | timestamptz DEFAULT now() | |

#### `joongang_article_keywords` (키워드/해시태그)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| article_id | uuid FK → articles | |
| keyword | text NOT NULL | 키워드 텍스트 |
| created_at | timestamptz DEFAULT now() | |

**인덱스**: `UNIQUE(article_id, keyword)`

#### `joongang_related_articles` (관련기사)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| article_id | uuid FK → articles | 원본 기사 |
| related_article_id | uuid FK → articles | 관련 기사 |
| sort_order | integer DEFAULT 0 | |

### 2.2 댓글

#### `joongang_comments`
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| article_id | uuid FK → articles | |
| user_id | uuid FK → user_profiles.id | |
| user_name | text | 표시 이름 |
| content | text NOT NULL | 댓글 내용 |
| parent_id | uuid FK → comments (self) | 대댓글 |
| is_hidden | boolean DEFAULT false | 관리자 숨김 |
| ip_address | inet | 작성 IP |
| likes | integer DEFAULT 0 | 좋아요 수 |
| created_at | timestamptz DEFAULT now() | |

### 2.3 회원/스태프

#### `joongang_staff` (내부 스태프: 관리자/편집자/기자)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| user_id | uuid FK → auth.users | Supabase Auth 연동 |
| name | text NOT NULL | 실명 |
| email | text UNIQUE NOT NULL | 이메일 |
| phone | text | 연락처 |
| role | text NOT NULL | superadmin/editor/reporter |
| department | text | 소속 부서 |
| position | text | 직위 |
| bio | text | 소개 |
| avatar_url | text | 프로필 이미지 |
| byline | text | 기사 바이라인 |
| is_active | boolean DEFAULT true | 활성 여부 |
| permissions | jsonb DEFAULT '{}' | 상세 권한 |
| last_login_at | timestamptz | 마지막 접속 |
| created_at | timestamptz DEFAULT now() | |

#### `joongang_subscribers` (뉴스레터 구독자)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| email | text UNIQUE NOT NULL | |
| name | text | |
| is_active | boolean DEFAULT true | |
| subscribed_at | timestamptz DEFAULT now() | |
| unsubscribed_at | timestamptz | |

#### `joongang_tips` (기사 제보)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| reporter_name | text | 제보자 이름 |
| reporter_email | text | 이메일 |
| reporter_phone | text | 연락처 |
| title | text NOT NULL | 제보 제목 |
| content | text NOT NULL | 제보 내용 |
| attachment_urls | text[] | 첨부 이미지/파일 |
| status | text DEFAULT 'received' | received/reviewing/adopted/rejected |
| assigned_to | uuid FK → staff | 담당 기자 |
| created_at | timestamptz DEFAULT now() | |

### 2.4 광고 시스템

#### `joongang_ad_slots` (광고 슬롯 정의)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| slot_code | text UNIQUE NOT NULL | 슬롯 코드 (pc_main_top, mobile_main_banner 등) |
| name | text NOT NULL | 표시명 |
| description | text | 슬롯 설명 |
| page_type | text NOT NULL | main/section/article/other |
| device_type | text NOT NULL | pc/mobile/both |
| width | integer NOT NULL | 너비 (px) |
| height | integer NOT NULL | 높이 (px) |
| max_ads | integer DEFAULT 1 | 최대 광고 수 (로테이션) |
| display_mode | text DEFAULT 'rotation' | rotation/sequential/random |
| is_active | boolean DEFAULT true | |
| sort_order | integer DEFAULT 0 | |
| created_at | timestamptz DEFAULT now() | |

#### `joongang_ads` (광고 등록)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| slot_id | uuid FK → ad_slots | 배치 슬롯 |
| advertiser_id | uuid FK → advertisers | 광고주 |
| title | text NOT NULL | 광고명 |
| image_url | text | 배너 이미지 URL |
| link_url | text | 클릭 시 이동 URL |
| html_content | text | HTML 광고 (이미지 대신) |
| template_id | uuid FK → ad_templates | 템플릿 기반 생성 시 |
| template_data | jsonb | 템플릿 변수 데이터 |
| start_date | timestamptz NOT NULL | 노출 시작 (분 단위) |
| end_date | timestamptz NOT NULL | 노출 종료 (분 단위) |
| is_active | boolean DEFAULT true | 사용 여부 |
| open_new_tab | boolean DEFAULT true | 새 창 열기 |
| group_order | integer DEFAULT 0 | 그룹 내 순서 |
| impression_count | bigint DEFAULT 0 | 노출 수 |
| click_count | bigint DEFAULT 0 | 클릭 수 |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

#### `joongang_advertisers` (광고주)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| company_name | text NOT NULL | 업체명 |
| contact_name | text | 담당자 |
| contact_email | text | 이메일 |
| contact_phone | text | 연락처 |
| memo | text | 비고 |
| is_active | boolean DEFAULT true | |
| created_at | timestamptz DEFAULT now() | |

#### `joongang_ad_templates` (광고 디자인 템플릿)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| name | text NOT NULL | 템플릿명 |
| slot_size | text NOT NULL | 적용 크기 (728x90, 300x250 등) |
| thumbnail_url | text | 미리보기 이미지 |
| html_template | text NOT NULL | HTML/CSS 템플릿 ({{변수}} 포함) |
| variables | jsonb NOT NULL | 필요 변수 정의 [{name, type, label, default}] |
| category | text | 업종 카테고리 |
| is_active | boolean DEFAULT true | |
| created_at | timestamptz DEFAULT now() | |

#### `joongang_ad_stats` (광고 통계 - 시간별 집계)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| ad_id | uuid FK → ads | |
| stat_date | date NOT NULL | 날짜 |
| stat_hour | integer | 시간 (0~23, null=일별) |
| impressions | integer DEFAULT 0 | 노출 수 |
| clicks | integer DEFAULT 0 | 클릭 수 |
| unique_impressions | integer DEFAULT 0 | 순 노출 |
| unique_clicks | integer DEFAULT 0 | 순 클릭 |

**인덱스**: `UNIQUE(ad_id, stat_date, stat_hour)`

### 2.5 레이아웃 설정

#### `joongang_layout_settings` (페이지별 레이아웃 설정)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| page_type | text UNIQUE NOT NULL | main/section/article |
| layout_config | jsonb NOT NULL | 레이아웃 구성 JSON |
| header_style | text DEFAULT 'style_a' | 상단 메뉴 스타일 (5종) |
| updated_at | timestamptz DEFAULT now() | |
| updated_by | uuid FK → staff | |

#### `joongang_design_settings` (디자인 전역 설정)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| setting_key | text UNIQUE NOT NULL | 설정 키 |
| setting_value | jsonb NOT NULL | 설정 값 |
| updated_at | timestamptz DEFAULT now() | |

### 2.6 게시판

#### `joongang_boards` (게시판 정의)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| board_code | text UNIQUE NOT NULL | notice/free/data/photo |
| name | text NOT NULL | 게시판명 |
| description | text | 설명 |
| board_type | text DEFAULT 'list' | list/gallery |
| allow_anonymous | boolean DEFAULT false | 비회원 글쓰기 |
| allow_comments | boolean DEFAULT true | 댓글 허용 |
| is_active | boolean DEFAULT true | |
| sort_order | integer DEFAULT 0 | |

#### `joongang_board_posts` (게시판 글)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| board_id | uuid FK → boards | |
| user_id | uuid FK → user_profiles | 작성자 |
| author_name | text | 표시 이름 |
| title | text NOT NULL | 제목 |
| content | text NOT NULL | 내용 (HTML) |
| thumbnail_url | text | 썸네일 (포토게시판) |
| attachment_urls | text[] | 첨부파일 |
| view_count | integer DEFAULT 0 | 조회수 |
| is_notice | boolean DEFAULT false | 공지 여부 |
| is_hidden | boolean DEFAULT false | 숨김 |
| created_at | timestamptz DEFAULT now() | |
| updated_at | timestamptz DEFAULT now() | |

### 2.7 팝업/배너

#### `joongang_popups` (팝업 레이어)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| title | text NOT NULL | 관리용 제목 |
| content_html | text NOT NULL | 팝업 내용 (HTML) |
| image_url | text | 이미지 URL |
| link_url | text | 클릭 링크 |
| position_x | integer DEFAULT 100 | 좌측 위치 (px) |
| position_y | integer DEFAULT 100 | 상단 위치 (px) |
| width | integer DEFAULT 500 | 너비 |
| height | integer DEFAULT 400 | 높이 |
| start_date | timestamptz NOT NULL | 시작일 |
| end_date | timestamptz NOT NULL | 종료일 |
| is_active | boolean DEFAULT true | |
| show_close_today | boolean DEFAULT true | "오늘 하루 안보기" |
| device_type | text DEFAULT 'both' | pc/mobile/both |
| sort_order | integer DEFAULT 0 | |
| created_at | timestamptz DEFAULT now() | |

### 2.8 시스템/통계

#### `joongang_site_settings` (사이트 환경설정)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| setting_group | text NOT NULL | basic/logo/api/member/sns/watermark/copyright |
| setting_key | text NOT NULL | 설정 키 |
| setting_value | jsonb | 설정 값 |
| updated_at | timestamptz DEFAULT now() | |

**인덱스**: `UNIQUE(setting_group, setting_key)`

#### `joongang_visitor_stats` (방문자 통계)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| stat_date | date NOT NULL | 날짜 |
| stat_hour | integer | 시간 (0~23) |
| page_views | integer DEFAULT 0 | 페이지뷰 |
| unique_visitors | integer DEFAULT 0 | 순방문자 |
| device_type | text | pc/mobile/tablet |
| referrer_domain | text | 유입 도메인 |

#### `joongang_visitor_logs` (접속 로그)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| session_id | text | 세션 ID |
| user_id | uuid | 회원 ID (비회원=null) |
| ip_address | inet | IP 주소 |
| user_agent | text | 브라우저 정보 |
| page_url | text | 방문 페이지 |
| referrer_url | text | 유입 URL |
| device_type | text | pc/mobile/tablet |
| created_at | timestamptz DEFAULT now() | |

#### `joongang_news_api_config` (뉴스 전송/수신 API 설정)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| provider | text NOT NULL | newswire/custom |
| api_type | text NOT NULL | send/receive |
| endpoint_url | text NOT NULL | API 엔드포인트 |
| api_key | text | 인증 키 (암호화 저장) |
| config | jsonb DEFAULT '{}' | 추가 설정 |
| is_active | boolean DEFAULT true | |
| last_sync_at | timestamptz | 마지막 동기화 |
| created_at | timestamptz DEFAULT now() | |

#### `joongang_menu_settings` (메뉴 설정)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| menu_type | text NOT NULL | header/footer/mobile |
| menu_items | jsonb NOT NULL | [{id, label, path, children, sort_order}] |
| updated_at | timestamptz DEFAULT now() | |

### 2.9 ERD 관계 요약

```
articles ─┬─< article_sections >─── sections (M:N)
           ├─< article_positions
           ├─< article_attachments
           ├─< article_keywords
           ├─< related_articles
           ├─< comments
           └── staff (author_id, editor_id)

ads ─── ad_slots
    ─── advertisers
    ─── ad_templates
    ─< ad_stats

boards ─< board_posts ─< comments

staff ──── auth.users (user_id FK)
```

---

## 3. 페이지/라우트 구조

### 3.1 독자 사이트 (Public Routes)

```
/                           → 메인 페이지 (홈)
/section/:slug              → 섹션(카테고리) 목록
/section/:slug/:subSlug     → 하위 섹션 목록
/article/:slug              → 기사 상세
/photo                      → 포토뉴스 갤러리
/video                      → 동영상뉴스
/search?q=                  → 검색 결과
/community                  → 커뮤니티 인덱스
/community/:boardCode       → 게시판 목록
/community/:boardCode/:id   → 게시판 글 상세
/community/:boardCode/write → 글쓰기
/tip                        → 기사 제보
/subscribe                  → 뉴스레터 구독
/login                      → 로그인
/register                   → 회원가입
/mypage                     → 마이페이지 (스크랩/댓글/설정)
/reporter/:id               → 기자 프로필/기사 목록
```

### 3.2 관리자 대시보드 (Admin Routes)

```
/admin                              → 대시보드 (오늘 통계 요약)
/admin/articles                     → 기사 목록/관리
/admin/articles/write               → 기사 등록
/admin/articles/:id/edit            → 기사 수정
/admin/articles/pending             → 출력대기 기사
/admin/articles/photo               → 포토뉴스 관리
/admin/articles/video               → 동영상뉴스 관리
/admin/articles/comments            → 댓글 관리
/admin/newsletter                   → 뉴스레터 관리
/admin/tips                         → 기사 제보 관리
/admin/news-api                     → 뉴스 전송/수신 API
/admin/members                      → 회원 관리
/admin/members/mail                 → 회원 메일 발송
/admin/stats/visitors               → 접속자 통계
/admin/stats/articles               → 기사 통계
/admin/points                       → 포인트 관리
/admin/boards                       → 게시판 관리
/admin/boards/:boardCode            → 개별 게시판 관리
/admin/ads                          → 광고 관리 (개요)
/admin/ads/slots                    → 슬롯 관리
/admin/ads/:slotId                  → 슬롯별 광고 목록
/admin/ads/create                   → 광고 등록
/admin/ads/:id/edit                 → 광고 수정
/admin/ads/templates                → 광고 템플릿 관리
/admin/ads/templates/:id/editor     → 템플릿 에디터
/admin/ads/advertisers              → 광고주 관리
/admin/ads/stats                    → 광고 통계
/admin/popups                       → 팝업 레이어 관리
/admin/design                       → 디자인 설정
/admin/design/colors                → 기본 색상
/admin/design/header                → 상단 메뉴 스타일
/admin/design/layout/main           → 메인 출력 스타일
/admin/design/layout/section        → 서브 출력 스타일
/admin/design/layout/article        → 기사보기 설정
/admin/settings                     → 환경설정
/admin/settings/basic               → 기본환경
/admin/settings/logo                → 로고 설정
/admin/settings/seo                 → SEO/OG 설정
/admin/settings/member              → 회원가입 설정
/admin/settings/sns                 → SNS 연동
/admin/settings/watermark           → 워터마크 설정
/admin/settings/images              → 기본 이미지
/admin/settings/copyright           → 카피라이트
/admin/settings/donation            → 후원 안내
/admin/menu                         → 메뉴 설정
/admin/sections                     → 섹션(카테고리) 관리
/admin/staff                        → 스태프 관리
/admin/permissions                  → 권한 설정
```

---

## 4. 관리자 대시보드 전체 메뉴/기능 설계

### 4.1 사이드바 메뉴 구조

```
📊 대시보드
├── 오늘의 통계 (기사수, 방문자, 댓글, 광고수익)
├── 최근 기사 목록
└── 빠른 액션 (기사등록, 댓글확인)

📰 뉴스관리
├── 기사 목록
├── 기사 등록
├── 출력대기 기사
├── 포토뉴스 관리
├── 동영상뉴스 관리
├── 뉴스레터 관리
├── 기사 제보 관리
├── 댓글 관리
└── 뉴스 API (전송/수신)

👥 회원관리
├── 회원 목록
├── 회원 메일 발송
├── 접속자 통계
├── 접속자 검색
└── 포인트 관리

📋 게시판관리
├── 게시판 설정
├── 공지사항
├── 자유게시판
├── 자료실
└── 포토게시판

📢 광고관리
├── 광고 현황 (개요)
├── 슬롯 관리
├── 광고 등록/관리
├── 광고주 관리
├── 디자인 템플릿
├── 광고 통계
└── 일괄 관리

🎨 디자인설정
├── 기본 색상
├── 상단 메뉴 스타일 (5종)
├── 메인 출력 스타일
├── 서브 출력 스타일
└── 기사보기 설정

🖼️ 팝업관리
└── 팝업 레이어 관리

⚙️ 환경설정
├── 기본환경
├── 로고 설정
├── 뉴스 전송 API
├── 뉴스 자동 수신
├── 게시판 설정
├── 회원가입 설정
├── SNS 설정
├── 스타일 추가설정
├── 워터마크
├── 기본 이미지
├── 카피라이트
└── 후원 안내

🔐 권한관리
├── 스태프 관리
├── 역할/권한 설정
└── 접근 로그

📑 메뉴설정
├── PC 메뉴
├── 모바일 메뉴
└── 섹션(카테고리) 관리
```

### 4.2 대시보드 메인 기능

| 위젯 | 내용 |
|------|------|
| 오늘의 기사 | 등록/발행/대기 건수 |
| 방문자 현황 | 실시간 접속자, 오늘 PV/UV |
| 인기 기사 TOP 10 | 오늘 조회수 기준 |
| 최신 댓글 | 최근 10건 + 신고 현황 |
| 광고 현황 | 활성 광고 수, 오늘 노출/클릭 |
| 예약 기사 | 오늘 발행 예정 기사 |
| 기사 제보 | 미처리 제보 건수 |

---

## 5. 광고 시스템 상세 설계

### 5.1 광고 크기 규격 (6종)

| 규격명 | 크기 (px) | 용도 |
|--------|-----------|------|
| Leaderboard | 728 x 90 | PC 상단/하단 배너 |
| Medium Rectangle | 300 x 250 | PC 사이드바/기사내 |
| Wide Skyscraper | 160 x 600 | PC 사이드바 세로 |
| Full Banner | 468 x 60 | PC 기사 내 중간 |
| Mobile Banner | 320 x 100 | 모바일 상단/하단 |
| Mobile Large | 320 x 250 | 모바일 기사 내 |

### 5.2 광고 슬롯 정의 (34개+)

#### PC 메인 (5개)
| 슬롯코드 | 위치 | 크기 |
|----------|------|------|
| pc_main_top | 헤더 하단 배너 | 728x90 |
| pc_main_side_1 | 우측 사이드바 상단 | 300x250 |
| pc_main_side_2 | 우측 사이드바 중간 | 300x250 |
| pc_main_mid | 메인 중앙 | 728x90 |
| pc_main_bottom | 메인 하단 | 728x90 |

#### PC 섹션별 (8개)
| 슬롯코드 | 위치 | 크기 |
|----------|------|------|
| pc_section_top | 섹션 상단 | 728x90 |
| pc_section_side_1 | 우측 상단 | 300x250 |
| pc_section_side_2 | 우측 중간 | 300x250 |
| pc_section_side_3 | 우측 하단 | 160x600 |
| pc_section_mid_1 | 기사 목록 중간 1 | 468x60 |
| pc_section_mid_2 | 기사 목록 중간 2 | 468x60 |
| pc_section_bottom_1 | 하단 좌 | 300x250 |
| pc_section_bottom_2 | 하단 우 | 300x250 |

#### PC 뉴스상세 (3개)
| 슬롯코드 | 위치 | 크기 |
|----------|------|------|
| pc_article_top | 기사 제목 상단 | 728x90 |
| pc_article_mid | 기사 본문 중간 | 468x60 |
| pc_article_bottom | 기사 하단 | 728x90 |

#### PC 기타 (3개)
| 슬롯코드 | 위치 | 크기 |
|----------|------|------|
| pc_header_bar | 최상단 띠배너 | 980x40 |
| pc_footer_bar | 최하단 배너 | 728x90 |
| pc_floating_right | 우측 플로팅 | 160x600 |

#### Mobile 메인 (4개)
| 슬롯코드 | 위치 | 크기 |
|----------|------|------|
| mobile_main_top | 상단 배너 | 320x100 |
| mobile_main_mid_1 | 중간 1 | 320x250 |
| mobile_main_mid_2 | 중간 2 | 320x100 |
| mobile_main_bottom | 하단 | 320x100 |

#### Mobile 서브 (9개)
| 슬롯코드 | 위치 | 크기 |
|----------|------|------|
| mobile_section_top | 상단 | 320x100 |
| mobile_section_mid_1~3 | 기사 목록 사이 | 320x100 |
| mobile_section_bottom | 하단 | 320x250 |
| mobile_list_between_1~4 | 기사 리스트 삽입형 | 320x100 |

#### Mobile 뉴스상세 (2개)
| 슬롯코드 | 위치 | 크기 |
|----------|------|------|
| mobile_article_top | 기사 상단 | 320x100 |
| mobile_article_bottom | 기사 하단 | 320x250 |

### 5.3 기간 관리

```typescript
interface AdSchedule {
  start_date: Date;        // 시작 (분 단위 설정 가능)
  end_date: Date;          // 종료 (분 단위 설정 가능)
  weekday_filter?: number[];  // 요일 필터 (0=일, 6=토)
  hour_filter?: [number, number];  // 시간대 필터 (예: [9, 18])
}
```

- 광고별 시작/종료 일시를 분 단위로 설정
- 만료 시 자동 비활성화 (Supabase cron 또는 클라이언트 체크)
- 남은 기간 알림 (3일, 1일, 만료)
- 캘린더 뷰에서 광고 일정 한눈에 확인

### 5.4 통계 수집

```typescript
// 노출 추적
async function trackImpression(adId: string, slotId: string) {
  await supabase.rpc('joongang_increment_impression', { p_ad_id: adId });
  // 시간별 stats 테이블 upsert
}

// 클릭 추적
async function trackClick(adId: string, slotId: string) {
  await supabase.rpc('joongang_increment_click', { p_ad_id: adId });
  // 리다이렉트 URL로 이동
}
```

통계 대시보드:
- CTR (클릭률) = clicks / impressions
- 일별/주별/월별 트렌드 차트
- 슬롯별 성과 비교
- 광고주별 종합 리포트
- CSV/PDF 내보내기

### 5.5 템플릿 디자인 엔진

#### 개념
광고주가 디자인 능력 없이도, 관리자가 제공하는 템플릿을 선택하고 변수(로고, 텍스트, 색상 등)만 입력하면 광고 이미지/HTML을 자동 생성.

#### 템플릿 구조
```typescript
interface AdTemplate {
  id: string;
  name: string;                    // "프로모션 배너 A"
  slot_size: string;               // "728x90"
  thumbnail_url: string;           // 미리보기
  html_template: string;           // HTML/CSS (Mustache 문법)
  variables: TemplateVariable[];   // 입력 필드 정의
  category: string;                // "식음료" / "IT" / "교육"
}

interface TemplateVariable {
  name: string;          // "company_name"
  type: 'text' | 'image' | 'color' | 'url' | 'number';
  label: string;         // "회사명"
  placeholder?: string;
  default_value?: string;
  required: boolean;
  max_length?: number;
}
```

#### 에디터 UI 흐름
1. 크기 선택 (728x90, 300x250 등)
2. 카테고리별 템플릿 목록 표시
3. 템플릿 선택 → 실시간 미리보기
4. 변수 입력 폼 (텍스트, 이미지 업로드, 색상 피커)
5. 실시간 미리보기 업데이트
6. "완성" 클릭 → HTML 저장 + 스크린샷 생성 (선택)

#### 렌더링 방식
```typescript
function renderTemplate(template: AdTemplate, data: Record<string, any>): string {
  let html = template.html_template;
  for (const variable of template.variables) {
    const value = data[variable.name] || variable.default_value || '';
    html = html.replace(new RegExp(`{{${variable.name}}}`, 'g'), value);
  }
  return html;
}
```

---

## 6. 레이아웃 엔진 설계

### 6.1 개념

관리자가 코드 수정 없이 메인/서브/상세 페이지의 기사 배치 방식을 GUI로 설정할 수 있는 시스템.

### 6.2 메인 페이지 레이아웃 설정

```typescript
interface MainLayoutConfig {
  // 상단 메뉴 스타일 (5종 중 택 1)
  header_style: 'style_a' | 'style_b' | 'style_c' | 'style_d' | 'style_e';

  // 메인 영역 구성
  zones: MainZone[];
}

interface MainZone {
  zone_id: string;           // 'headline' | 'top_news' | 'center' | 'recommend' | 'photo_video'
  zone_name: string;         // 표시명
  layout_type: string;       // 'hero_single' | 'grid_2x2' | 'list' | 'carousel' | 'side_by_side'
  article_count: number;     // 표시 기사 수
  show_thumbnail: boolean;   // 썸네일 표시
  show_excerpt: boolean;     // 요약 표시
  show_date: boolean;        // 날짜 표시
  show_author: boolean;      // 기자명 표시
  auto_fill: boolean;        // 수동배치 외 자동 채움
  auto_fill_section?: string; // 자동 채움 섹션
  sort_order: number;        // 영역 순서
}
```

### 6.3 상단 메뉴 스타일 (5종)

| 스타일 | 설명 |
|--------|------|
| style_a | 로고 중앙 + 메뉴 하단 가로 배치 |
| style_b | 로고 좌측 + 메뉴 우측 가로 (기본) |
| style_c | 풀 위드 상단 바 + 드롭다운 메가메뉴 |
| style_d | 좌측 사이드바 고정 네비게이션 |
| style_e | 슬림 탑바 + 햄버거 메뉴 |

### 6.4 서브(섹션) 페이지 레이아웃

```typescript
interface SectionLayoutConfig {
  layout_type: 'list' | 'grid' | 'card' | 'magazine';
  columns: 1 | 2 | 3 | 4;              // 그리드 컬럼 수
  articles_per_page: number;             // 페이지당 기사 수 (20/30/50)
  show_sidebar: boolean;                 // 우측 사이드바
  sidebar_widgets: SidebarWidget[];      // 사이드바 위젯
  headline_count: number;                // 상단 주요기사 수 (0~3)
  show_section_banner: boolean;          // 섹션 배너 표시
}

interface SidebarWidget {
  type: 'popular' | 'recent' | 'ad' | 'newsletter' | 'tags';
  config: Record<string, any>;
  sort_order: number;
}
```

### 6.5 기사 상세 레이아웃

```typescript
interface ArticleLayoutConfig {
  show_byline: boolean;          // 기자명/이메일
  show_date: boolean;            // 등록/수정일
  show_share_buttons: boolean;   // SNS 공유 버튼
  show_font_size_control: boolean; // 폰트 크기 조절
  show_related_articles: boolean;  // 관련 기사
  related_count: number;          // 관련 기사 수
  show_keywords: boolean;         // 키워드 태그
  show_reporter_info: boolean;    // 기자 프로필 박스
  show_comments: boolean;         // 댓글 영역
  ad_positions: ('top' | 'mid' | 'bottom')[]; // 광고 위치
  image_viewer: 'inline' | 'lightbox' | 'gallery'; // 이미지 뷰어
}
```

### 6.6 레이아웃 설정 UI

관리자 `디자인설정 > 출력 스타일` 에서:
1. 드래그 앤 드롭으로 영역(zone) 순서 변경
2. 각 영역별 레이아웃 타입 선택 (시각적 미리보기)
3. 실시간 프리뷰 패널
4. "적용" 클릭 시 `joongang_layout_settings` 업데이트

---

## 7. 뉴스 CMS 설계

### 7.1 기사 등록 폼 구성

```
┌─────────────────────────────────────────────────┐
│ [기사 등록]                                        │
├─────────────────────────────────────────────────┤
│ 뉴스형태: ○ 일반  ○ 포토  ○ 동영상              │
│                                                   │
│ 1차 섹션: [뉴스 ▼]  → 2차 섹션: [정치 ▼]       │
│ 2차 분류: [연예 ▼]  → [방송 ▼] (다중 선택)     │
│ 3차 분류: [스포츠 ▼] → [야구 ▼]                │
│                                                   │
│ 출력위치:                                         │
│ ☑ 메인 헤드라인  ☐ 메인 탑뉴스  ☐ 중앙뉴스     │
│ ☐ 추천기사  ☐ 포토영상                           │
│ ☐ 서브 헤드라인  ☐ 서브 탑뉴스  ☐ 서브 우측    │
│                                                   │
│ 제목: [________________________________]         │
│ 부제목: [________________________________]       │
│                                                   │
│ 대표이미지: [파일선택] [URL입력]                  │
│ ☑ 워터마크 적용  캡션: [__________]              │
│                                                   │
│ 동영상URL: [________________________________]    │
│                                                   │
│ ┌─── WYSIWYG 에디터 ──────────────┐            │
│ │ (TipTap 또는 Quill)              │            │
│ │                                   │            │
│ │ [B] [I] [U] [H1] [H2] [H3]      │            │
│ │ [이미지] [영상] [링크] [표]       │            │
│ │ [인용] [코드] [정렬]             │            │
│ │                                   │            │
│ └───────────────────────────────────┘            │
│                                                   │
│ 출처: [________]  링크: [________________]       │
│                                                   │
│ 첨부파일: [+추가] (최대 5개)                     │
│  1. document.pdf (2.3MB) [삭제]                  │
│                                                   │
│ 키워드: [정치] [국회] [+추가]                    │
│                                                   │
│ 관련기사: [검색하여 추가]                         │
│  - "관련기사 제목 1" [삭제]                      │
│                                                   │
│ 작성자: [기자명 ▼]  이메일: [auto-fill]          │
│                                                   │
│ ── 발행 설정 ──                                  │
│ 등록: ○ 즉시발행  ○ 출력대기                    │
│ 예약발행: [2026-05-07] [09:00]                   │
│ 조회수 초기값: [0]                               │
│ ☑ 댓글 허용                                     │
│                                                   │
│ [임시저장]  [미리보기]  [등록]                    │
└─────────────────────────────────────────────────┘
```

### 7.2 기사 목록 관리

| 기능 | 설명 |
|------|------|
| 필터 | 상태(전체/발행/대기/예약/임시), 섹션, 기간, 작성자 |
| 정렬 | 등록일/수정일/조회수/댓글수 |
| 벌크 액션 | 선택 기사 일괄 발행/대기/삭제/섹션변경 |
| 검색 | 제목/내용/키워드/작성자 |
| 출력위치 배치 | 드래그로 메인 위치 배정 |
| 상태 표시 | 발행(초록)/대기(노랑)/예약(파랑)/삭제(빨강) 뱃지 |

### 7.3 출력위치 관리 UI

```
┌─── 메인면 배치 관리 ─────────────────────────┐
│                                                 │
│ [헤드라인] (최대 1건)                          │
│ ┌─────────────────────────────────────┐       │
│ │ "정부, 내년 예산안 600조 확정"        │ [×]  │
│ └─────────────────────────────────────┘       │
│ [+ 기사 검색/추가]                             │
│                                                 │
│ [탑뉴스] (최대 4건)                            │
│ ┌─────────────────────────────────────┐       │
│ │ 1. "경제성장률 전망 하향..."    ↑↓ [×]│      │
│ │ 2. "코스피 사상 최고치..."     ↑↓ [×]│      │
│ └─────────────────────────────────────┘       │
│ [+ 기사 검색/추가]                             │
│                                                 │
│ [중앙뉴스] (최대 6건) ...                      │
│ [추천기사] (최대 4건) ...                      │
│ [포토영상] (최대 5건) ...                      │
└─────────────────────────────────────────────────┘
```

### 7.4 예약 발행

- 기사 등록 시 `scheduled_at` 설정
- Supabase Edge Function (cron) 또는 pg_cron:
  ```sql
  -- 매 분 실행
  UPDATE joongang_articles
  SET status = 'published', is_published = true, published_at = now()
  WHERE status = 'scheduled'
    AND scheduled_at <= now();
  ```
- 발행 시 자동 알림 (기자에게 발행 완료 통보)

### 7.5 뉴스 자동 수신 (뉴스와이어 연동)

```typescript
interface NewsWireArticle {
  title: string;
  content: string;
  source: string;
  source_url: string;
  published_at: string;
  category: string;
  images: string[];
}

// Edge Function: 주기적으로 뉴스와이어 API 폴링
async function fetchNewsWire() {
  const config = await getApiConfig('newswire', 'receive');
  const articles = await fetch(config.endpoint_url, {
    headers: { 'Authorization': `Bearer ${config.api_key}` }
  }).then(r => r.json());

  for (const article of articles) {
    await insertArticle({
      ...mapToLocalFormat(article),
      status: 'pending',  // 관리자 검토 필요
      source_name: 'NewsWire',
    });
  }
}
```

### 7.6 뉴스 전송 API

외부 포털/뉴스 어그리게이터로 기사 전송:
- RSS 2.0 피드 자동 생성 (`/rss.xml`)
- Atom 피드 (`/atom.xml`)
- 네이버 뉴스 검색 등록용 사이트맵
- 뉴스와이어 전송 API 연동

---

## 8. 권한/역할 체계

### 8.1 역할 정의 (5단계)

| 역할 | 코드 | 권한 범위 |
|------|------|-----------|
| 최고관리자 | `superadmin` | 모든 권한 (시스템 설정, 스태프 관리 포함) |
| 편집국장 | `editor_chief` | 모든 기사 편집/발행, 출력위치 배정, 광고 관리 |
| 편집자 | `editor` | 담당 섹션 기사 편집/발행, 댓글 관리 |
| 기자 | `reporter` | 본인 기사 등록/수정, 출력대기 요청 |
| 회원 | `member` | 댓글, 제보, 마이페이지 |
| 비회원 | `guest` | 기사 열람만 |

### 8.2 세부 권한 매트릭스

| 기능 | superadmin | editor_chief | editor | reporter | member |
|------|:---:|:---:|:---:|:---:|:---:|
| 기사 등록 | O | O | O | O | - |
| 기사 발행 (즉시) | O | O | O | - | - |
| 기사 삭제 | O | O | 본인 섹션 | 본인만 | - |
| 출력위치 배정 | O | O | 본인 섹션 | - | - |
| 댓글 관리 (숨김/삭제) | O | O | O | - | - |
| 회원 관리 | O | O | - | - | - |
| 광고 관리 | O | O | - | - | - |
| 디자인 설정 | O | O | - | - | - |
| 환경설정 | O | - | - | - | - |
| 스태프/권한 관리 | O | - | - | - | - |
| 통계 열람 | O | O | O | 본인만 | - |
| 게시판 관리 | O | O | - | - | - |
| 팝업 관리 | O | O | - | - | - |

### 8.3 구현 방식

```typescript
// joongang_staff.permissions (JSONB)
interface StaffPermissions {
  sections?: string[];      // 담당 섹션 ID 목록 (editor)
  can_publish?: boolean;    // 즉시 발행 권한
  can_delete?: boolean;     // 삭제 권한
  can_manage_ads?: boolean; // 광고 관리
  can_manage_members?: boolean; // 회원 관리
  custom?: Record<string, boolean>; // 확장 권한
}

// RLS 정책 예시
CREATE POLICY "reporters_own_articles" ON joongang_articles
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM joongang_staff WHERE role = 'reporter'
    )
    AND author_id = (
      SELECT id FROM joongang_staff WHERE user_id = auth.uid()
    )
  );
```

### 8.4 관리자 접근 제어

```typescript
// AdminGuard 컴포넌트
function AdminGuard({ requiredRole, requiredPermission, children }) {
  const { staff } = useStaffAuth();

  if (!staff) return <Navigate to="/login" />;

  const roleHierarchy = ['superadmin', 'editor_chief', 'editor', 'reporter'];
  const userRoleIndex = roleHierarchy.indexOf(staff.role);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);

  if (userRoleIndex > requiredRoleIndex) return <Forbidden />;
  if (requiredPermission && !staff.permissions[requiredPermission]) return <Forbidden />;

  return children;
}
```

---

## 9. 컴포넌트 구조

### 9.1 디렉토리 구조

```
src/
├── main.tsx
├── App.tsx
├── vite-env.d.ts
│
├── config/
│   ├── site.ts              # 사이트 설정
│   ├── admin.ts             # 관리자 설정
│   └── sections.ts          # 기본 섹션 데이터
│
├── types/
│   ├── index.ts             # 공통 타입
│   ├── article.ts           # 기사 관련 타입
│   ├── ad.ts                # 광고 관련 타입
│   ├── layout.ts            # 레이아웃 설정 타입
│   └── staff.ts             # 스태프/권한 타입
│
├── contexts/
│   ├── AuthContext.tsx       # 인증 (Supabase Auth)
│   ├── StaffContext.tsx      # 스태프 역할/권한
│   ├── ThemeContext.tsx      # 다크/라이트/컬러 테마
│   ├── LanguageContext.tsx   # 한/영 전환
│   └── ToastContext.tsx      # 알림 토스트
│
├── hooks/
│   ├── useArticles.ts       # 기사 CRUD
│   ├── useArticleEditor.ts  # 에디터 상태 관리
│   ├── useSections.ts       # 섹션 데이터
│   ├── useAds.ts            # 광고 로드/추적
│   ├── useAdAdmin.ts        # 광고 관리
│   ├── useLayout.ts         # 레이아웃 설정
│   ├── useComments.ts       # 댓글
│   ├── useSearch.ts         # 검색
│   ├── useVisitorStats.ts   # 통계
│   ├── useInfiniteScroll.ts # 무한 스크롤
│   ├── useDebounce.ts       # 디바운스
│   └── useMediaQuery.ts     # 반응형
│
├── utils/
│   ├── supabase.ts          # Supabase 클라이언트
│   ├── auth.ts              # 인증 헬퍼
│   ├── notifications.ts     # 이메일/SMS
│   ├── dateFormat.ts        # 날짜 포맷
│   ├── slug.ts              # 슬러그 생성
│   ├── imageUtils.ts        # 이미지 리사이즈/워터마크
│   ├── adRenderer.ts        # 광고 렌더링/추적
│   ├── templateEngine.ts    # 광고 템플릿 엔진
│   ├── rss.ts               # RSS 생성
│   └── translations.ts      # 다국어 번역
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # 메인 네비게이션
│   │   ├── Footer.tsx             # 푸터
│   │   ├── Sidebar.tsx            # 사이드바 (위젯 포함)
│   │   ├── MobileNav.tsx          # 모바일 네비게이션
│   │   └── Breadcrumb.tsx         # 경로 표시
│   │
│   ├── article/
│   │   ├── ArticleCard.tsx        # 기사 카드 (목록용)
│   │   ├── ArticleHero.tsx        # 헤드라인 기사 (대형)
│   │   ├── ArticleList.tsx        # 기사 리스트 뷰
│   │   ├── ArticleGrid.tsx        # 기사 그리드 뷰
│   │   ├── ArticleCarousel.tsx    # 기사 캐러셀
│   │   ├── ArticleDetail.tsx      # 기사 상세 본문
│   │   ├── ArticleMeta.tsx        # 기자/날짜/조회수
│   │   ├── RelatedArticles.tsx    # 관련 기사
│   │   ├── ArticleShare.tsx       # SNS 공유 버튼
│   │   └── ArticleKeywords.tsx    # 키워드 태그
│   │
│   ├── ad/
│   │   ├── AdBanner.tsx           # 일반 배너 광고
│   │   ├── AdSlot.tsx             # 슬롯 기반 광고 렌더러
│   │   ├── AdFloat.tsx            # 플로팅 광고
│   │   └── AdInArticle.tsx        # 기사 내 삽입 광고
│   │
│   ├── section/
│   │   ├── SectionHeader.tsx      # 섹션 헤더
│   │   ├── SectionGrid.tsx        # 섹션 기사 그리드
│   │   └── SectionNav.tsx         # 섹션 탭 네비
│   │
│   ├── comment/
│   │   ├── CommentSection.tsx     # 댓글 영역 전체
│   │   ├── CommentItem.tsx        # 개별 댓글
│   │   └── CommentForm.tsx        # 댓글 입력 폼
│   │
│   ├── common/
│   │   ├── Pagination.tsx         # 페이지네이션
│   │   ├── SearchModal.tsx        # 검색 모달
│   │   ├── ImageUpload.tsx        # 이미지 업로드
│   │   ├── SEOHead.tsx            # SEO 메타
│   │   ├── Loading.tsx            # 로딩 스피너
│   │   ├── ErrorBoundary.tsx      # 에러 바운더리
│   │   ├── Modal.tsx              # 공통 모달
│   │   ├── ConfirmDialog.tsx      # 확인 대화상자
│   │   └── PopupLayer.tsx         # 팝업 레이어
│   │
│   ├── widget/
│   │   ├── PopularArticles.tsx    # 인기기사 위젯
│   │   ├── RecentArticles.tsx     # 최신기사 위젯
│   │   ├── NewsletterWidget.tsx   # 뉴스레터 구독
│   │   ├── WeatherWidget.tsx      # 날씨 위젯
│   │   └── TagCloud.tsx           # 태그 클라우드
│   │
│   └── admin/
│       ├── AdminSidebar.tsx       # 관리자 사이드바
│       ├── AdminHeader.tsx        # 관리자 헤더
│       ├── AdminGuard.tsx         # 권한 체크 가드
│       ├── DataTable.tsx          # 범용 데이터 테이블
│       ├── StatsCard.tsx          # 통계 카드
│       ├── ChartWidget.tsx        # 차트 위젯
│       ├── RichEditor.tsx         # WYSIWYG 에디터 래퍼
│       ├── SlotPreview.tsx        # 광고 슬롯 미리보기
│       ├── TemplateEditor.tsx     # 광고 템플릿 에디터
│       └── LayoutBuilder.tsx      # 레이아웃 빌더 (DnD)
│
├── pages/
│   ├── public/
│   │   ├── Home.tsx               # 메인 페이지
│   │   ├── Section.tsx            # 섹션 목록
│   │   ├── ArticlePage.tsx        # 기사 상세
│   │   ├── PhotoNews.tsx          # 포토뉴스
│   │   ├── VideoNews.tsx          # 동영상뉴스
│   │   ├── Search.tsx             # 검색 결과
│   │   ├── Community.tsx          # 커뮤니티
│   │   ├── BoardList.tsx          # 게시판 목록
│   │   ├── BoardDetail.tsx        # 게시판 상세
│   │   ├── BoardWrite.tsx         # 게시판 글쓰기
│   │   ├── Tip.tsx                # 기사 제보
│   │   ├── Subscribe.tsx          # 뉴스레터 구독
│   │   ├── Reporter.tsx           # 기자 프로필
│   │   ├── Login.tsx              # 로그인
│   │   ├── Register.tsx           # 회원가입
│   │   ├── MyPage.tsx             # 마이페이지
│   │   └── NotFound.tsx           # 404
│   │
│   └── admin/
│       ├── Dashboard.tsx          # 관리자 대시보드
│       ├── ArticleManage.tsx      # 기사 목록/관리
│       ├── ArticleWrite.tsx       # 기사 등록/수정
│       ├── ArticlePending.tsx     # 출력대기 기사
│       ├── ArticlePositions.tsx   # 출력위치 배치
│       ├── PhotoManage.tsx        # 포토뉴스 관리
│       ├── VideoManage.tsx        # 동영상 관리
│       ├── CommentManage.tsx      # 댓글 관리
│       ├── NewsletterManage.tsx   # 뉴스레터 관리
│       ├── TipManage.tsx          # 제보 관리
│       ├── NewsApiConfig.tsx      # 뉴스 API 설정
│       ├── MemberManage.tsx       # 회원 관리
│       ├── MemberMail.tsx         # 회원 메일 발송
│       ├── VisitorStats.tsx       # 접속 통계
│       ├── BoardManage.tsx        # 게시판 관리
│       ├── AdOverview.tsx         # 광고 현황
│       ├── AdSlotManage.tsx       # 슬롯 관리
│       ├── AdManage.tsx           # 광고 등록/관리
│       ├── AdTemplateManage.tsx   # 템플릿 관리
│       ├── AdTemplateEditor.tsx   # 템플릿 에디터
│       ├── AdAdvertiserManage.tsx # 광고주 관리
│       ├── AdStats.tsx            # 광고 통계
│       ├── PopupManage.tsx        # 팝업 관리
│       ├── DesignColors.tsx       # 기본 색상
│       ├── DesignHeader.tsx       # 상단 메뉴 스타일
│       ├── DesignLayoutMain.tsx   # 메인 출력 스타일
│       ├── DesignLayoutSection.tsx # 서브 출력 스타일
│       ├── DesignLayoutArticle.tsx # 기사보기 설정
│       ├── Settings.tsx           # 환경설정 (탭)
│       ├── MenuSettings.tsx       # 메뉴 설정
│       ├── SectionManage.tsx      # 섹션 관리
│       ├── StaffManage.tsx        # 스태프 관리
│       └── PermissionManage.tsx   # 권한 설정
│
├── layouts/
│   ├── PublicLayout.tsx           # 독자 사이트 레이아웃
│   ├── AdminLayout.tsx            # 관리자 레이아웃
│   └── AuthLayout.tsx             # 인증 페이지 레이아웃
│
├── styles/
│   ├── base.css                   # 기본 스타일 + CSS 변수
│   ├── site.css                   # 사이트 전용 (뉴스 테마)
│   ├── admin.css                  # 관리자 전용
│   ├── article.css                # 기사 본문 스타일
│   ├── responsive.css             # 반응형 브레이크포인트
│   └── print.css                  # 인쇄 스타일
│
└── public/
    ├── CNAME                      # joongang.dreamitbiz.com
    ├── favicon.ico
    ├── og-image.png
    └── robots.txt
```

### 9.2 핵심 컴포넌트 상세

#### AdSlot (광고 렌더러)
```typescript
interface AdSlotProps {
  slotCode: string;         // 슬롯 코드
  className?: string;       // 추가 스타일
  fallback?: ReactNode;     // 광고 없을 때 대체 콘텐츠
}

function AdSlot({ slotCode, className, fallback }: AdSlotProps) {
  const { ads, loading } = useAdsBySlot(slotCode);
  const [currentAd, setCurrentAd] = useState<Ad | null>(null);

  useEffect(() => {
    if (ads.length === 0) return;
    // 로테이션 로직 (고정 배너: 새로고침 시 변경)
    const index = Math.floor(Math.random() * ads.length);
    setCurrentAd(ads[index]);
    trackImpression(ads[index].id);
  }, [ads]);

  if (!currentAd) return fallback || null;

  return (
    <div className={`ad-slot ad-slot--${slotCode} ${className}`}>
      <a href={currentAd.link_url}
         target={currentAd.open_new_tab ? '_blank' : '_self'}
         onClick={() => trackClick(currentAd.id)}>
        {currentAd.html_content ? (
          <div dangerouslySetInnerHTML={{ __html: currentAd.html_content }} />
        ) : (
          <img src={currentAd.image_url} alt={currentAd.title} />
        )}
      </a>
      <span className="ad-label">광고</span>
    </div>
  );
}
```

#### RichEditor (WYSIWYG)
```typescript
// TipTap 기반 에디터
interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  features?: ('image' | 'video' | 'table' | 'code')[];
}
```

#### LayoutBuilder (드래그 앤 드롭 레이아웃 빌더)
```typescript
interface LayoutBuilderProps {
  pageType: 'main' | 'section' | 'article';
  config: LayoutConfig;
  onSave: (config: LayoutConfig) => void;
}
```

---

## 10. 개발 우선순위 (Phase별 로드맵)

### Phase 1: 기반 구축 (2주)
**목표**: 프로젝트 초기 설정 및 핵심 인프라

| # | 작업 | 예상 |
|---|------|------|
| 1.1 | 프로젝트 초기화 (Vite + React 19 + TS) | 0.5일 |
| 1.2 | site.ts / admin.ts 설정 | 0.5일 |
| 1.3 | Supabase DB 스키마 생성 (전체 테이블) | 1일 |
| 1.4 | RLS 정책 설정 | 1일 |
| 1.5 | AuthContext + StaffContext | 1일 |
| 1.6 | ThemeContext + LanguageContext | 0.5일 |
| 1.7 | PublicLayout + AdminLayout (프레임) | 1일 |
| 1.8 | Navbar + Footer + AdminSidebar | 1.5일 |
| 1.9 | 라우터 설정 (React Router v6) | 0.5일 |
| 1.10 | supabase.ts + 공통 유틸 | 1일 |
| 1.11 | 기본 CSS 시스템 (base.css + site.css) | 1일 |
| 1.12 | Login / Register / MyPage | 1일 |

### Phase 2: 뉴스 CMS 핵심 (3주)
**목표**: 기사 등록/관리/표시

| # | 작업 | 예상 |
|---|------|------|
| 2.1 | 섹션(카테고리) CRUD + 관리 페이지 | 1일 |
| 2.2 | WYSIWYG 에디터 (TipTap) 통합 | 2일 |
| 2.3 | 기사 등록 폼 (전체 필드) | 2일 |
| 2.4 | 이미지 업로드 (Supabase Storage + 워터마크) | 1.5일 |
| 2.5 | 기사 목록 관리 (필터/정렬/벌크액션) | 2일 |
| 2.6 | 기사 상세 페이지 (독자 사이트) | 1.5일 |
| 2.7 | 섹션 목록 페이지 | 1일 |
| 2.8 | 출력위치 배치 UI | 2일 |
| 2.9 | 메인 페이지 (영역별 기사 표시) | 2일 |
| 2.10 | 키워드/태그 시스템 | 0.5일 |
| 2.11 | 관련기사 연결 | 0.5일 |
| 2.12 | 첨부파일 관리 | 0.5일 |
| 2.13 | 예약 발행 (cron) | 1일 |
| 2.14 | 포토뉴스 갤러리 | 1일 |
| 2.15 | 동영상뉴스 페이지 | 0.5일 |
| 2.16 | 검색 기능 (Full-text search) | 1일 |

### Phase 3: 광고 시스템 (2주)
**목표**: 전체 광고 인프라

| # | 작업 | 예상 |
|---|------|------|
| 3.1 | 광고 슬롯 시드 데이터 + 관리 UI | 1일 |
| 3.2 | 광고 등록/수정 폼 | 1.5일 |
| 3.3 | 광고주 관리 | 0.5일 |
| 3.4 | AdSlot 렌더링 컴포넌트 (로테이션) | 1.5일 |
| 3.5 | 기간 관리 (시작/종료/자동 비활성화) | 1일 |
| 3.6 | 노출/클릭 추적 시스템 | 1일 |
| 3.7 | 광고 통계 대시보드 (차트) | 1.5일 |
| 3.8 | 광고 템플릿 엔진 + 에디터 UI | 3일 |
| 3.9 | 모든 페이지에 광고 슬롯 배치 | 1일|
| 3.10 | 모바일 광고 대응 | 1일 |

### Phase 4: 레이아웃 엔진 + 디자인 설정 (2주)
**목표**: 동적 레이아웃 시스템

| # | 작업 | 예상 |
|---|------|------|
| 4.1 | 상단 메뉴 5종 스타일 구현 | 2일 |
| 4.2 | 메인 레이아웃 빌더 UI | 2일 |
| 4.3 | 메인 페이지 동적 렌더링 | 1.5일 |
| 4.4 | 서브(섹션) 레이아웃 설정 | 1.5일 |
| 4.5 | 기사 상세 레이아웃 설정 | 1일 |
| 4.6 | 사이드바 위젯 시스템 | 1.5일 |
| 4.7 | 디자인 설정 (색상/로고) | 1일 |
| 4.8 | 실시간 미리보기 | 1.5일 |

### Phase 5: 커뮤니티 + 소통 (1주)
**목표**: 게시판, 댓글, 제보

| # | 작업 | 예상 |
|---|------|------|
| 5.1 | 게시판 시스템 (목록/상세/작성) | 2일 |
| 5.2 | 댓글 시스템 (대댓글 포함) | 1.5일 |
| 5.3 | 기사 제보 기능 | 0.5일 |
| 5.4 | 뉴스레터 구독/관리 | 1일 |
| 5.5 | SNS 공유 기능 | 0.5일 |

### Phase 6: 회원/통계/시스템 (1.5주)
**목표**: 운영 도구 완성

| # | 작업 | 예상 |
|---|------|------|
| 6.1 | 회원 관리 (검색/차단/레벨) | 1일 |
| 6.2 | 스태프 관리 + 권한 설정 | 1.5일 |
| 6.3 | 방문자 통계 수집/대시보드 | 1.5일 |
| 6.4 | 팝업 레이어 관리 | 1일 |
| 6.5 | 환경설정 (기본/로고/SEO/워터마크) | 1.5일 |
| 6.6 | 메뉴 설정 (동적) | 1일 |
| 6.7 | 회원 메일 발송 | 0.5일 |
| 6.8 | SMS 알림 연동 | 0.5일 |

### Phase 7: 외부 연동 + 최적화 (1주)
**목표**: API 연동 및 성능 최적화

| # | 작업 | 예상 |
|---|------|------|
| 7.1 | 뉴스와이어 연동 (수신/전송) | 1.5일 |
| 7.2 | RSS/Atom 피드 생성 | 0.5일 |
| 7.3 | 사이트맵 자동 생성 | 0.5일 |
| 7.4 | SEO 최적화 (OG/Schema.org) | 0.5일 |
| 7.5 | 성능 최적화 (lazy load/code split) | 1일 |
| 7.6 | 이미지 최적화 (WebP/리사이즈) | 0.5일 |
| 7.7 | PWA 설정 (오프라인/푸시 알림) | 0.5일 |
| 7.8 | 인쇄 스타일 | 0.5일 |

### Phase 8: 테스트 + 배포 (1주)
**목표**: 안정화 및 프로덕션 배포

| # | 작업 | 예상 |
|---|------|------|
| 8.1 | E2E 테스트 (주요 플로우) | 2일 |
| 8.2 | 반응형 QA (PC/Tablet/Mobile) | 1일 |
| 8.3 | 크로스 브라우저 테스트 | 0.5일 |
| 8.4 | 보안 점검 (XSS/CSRF/RLS) | 0.5일 |
| 8.5 | 성능 테스트 (Lighthouse 90+) | 0.5일 |
| 8.6 | GitHub Pages 배포 + CNAME | 0.5일 |
| 8.7 | 운영 문서 작성 | 0.5일 |
| 8.8 | 초기 데이터 세팅 (섹션/슬롯/설정) | 0.5일 |

---

## 부록 A: 초기 섹션 시드 데이터

```sql
INSERT INTO joongang_sections (section_code, name, slug, parent_id, depth, sort_order) VALUES
-- 1단계
(10, '뉴스', 'news', NULL, 0, 1),
(20, '연예', 'entertainment', NULL, 0, 2),
(30, '스포츠', 'sports', NULL, 0, 3),
(40, '지역뉴스', 'regional', NULL, 0, 4),
(50, '포토뉴스', 'photo', NULL, 0, 5),
(60, '동영상뉴스', 'video', NULL, 0, 6),
(70, '건강과학', 'health-science', NULL, 0, 7),
(80, '미디어', 'media', NULL, 0, 8),
(90, '교육', 'education', NULL, 0, 9),
(100, '커뮤니티', 'community', NULL, 0, 10);

-- 2단계 (뉴스)
INSERT INTO joongang_sections (section_code, name, slug, parent_id, depth, sort_order) VALUES
(11, '정치', 'politics', (SELECT id FROM joongang_sections WHERE section_code = 10), 1, 1),
(12, '경제', 'economy', (SELECT id FROM joongang_sections WHERE section_code = 10), 1, 2),
(13, '사회', 'society', (SELECT id FROM joongang_sections WHERE section_code = 10), 1, 3),
(14, '문화', 'culture', (SELECT id FROM joongang_sections WHERE section_code = 10), 1, 4);

-- 2단계 (연예)
INSERT INTO joongang_sections (section_code, name, slug, parent_id, depth, sort_order) VALUES
(21, '방송', 'broadcast', (SELECT id FROM joongang_sections WHERE section_code = 20), 1, 1),
(22, '영화', 'movie', (SELECT id FROM joongang_sections WHERE section_code = 20), 1, 2),
(23, '음악', 'music', (SELECT id FROM joongang_sections WHERE section_code = 20), 1, 3),
(24, '연예가화제', 'celebrity', (SELECT id FROM joongang_sections WHERE section_code = 20), 1, 4);

-- 2단계 (스포츠)
INSERT INTO joongang_sections (section_code, name, slug, parent_id, depth, sort_order) VALUES
(31, '스포츠종합', 'general', (SELECT id FROM joongang_sections WHERE section_code = 30), 1, 1),
(32, '야구', 'baseball', (SELECT id FROM joongang_sections WHERE section_code = 30), 1, 2),
(33, '축구', 'soccer', (SELECT id FROM joongang_sections WHERE section_code = 30), 1, 3),
(34, '배구', 'volleyball', (SELECT id FROM joongang_sections WHERE section_code = 30), 1, 4);

-- 2단계 (지역뉴스)
INSERT INTO joongang_sections (section_code, name, slug, parent_id, depth, sort_order) VALUES
(41, '서울', 'seoul', (SELECT id FROM joongang_sections WHERE section_code = 40), 1, 1),
(42, '경기', 'gyeonggi', (SELECT id FROM joongang_sections WHERE section_code = 40), 1, 2),
(43, '강원', 'gangwon', (SELECT id FROM joongang_sections WHERE section_code = 40), 1, 3),
(44, '충청', 'chungcheong', (SELECT id FROM joongang_sections WHERE section_code = 40), 1, 4),
(45, '호남', 'honam', (SELECT id FROM joongang_sections WHERE section_code = 40), 1, 5),
(46, '영남', 'yeongnam', (SELECT id FROM joongang_sections WHERE section_code = 40), 1, 6);

-- 2단계 (미디어)
INSERT INTO joongang_sections (section_code, name, slug, parent_id, depth, sort_order) VALUES
(81, '인터넷', 'internet', (SELECT id FROM joongang_sections WHERE section_code = 80), 1, 1),
(82, '방송', 'broadcast-media', (SELECT id FROM joongang_sections WHERE section_code = 80), 1, 2);
```

---

## 부록 B: 광고 슬롯 시드 데이터

```sql
INSERT INTO joongang_ad_slots (slot_code, name, page_type, device_type, width, height, max_ads, sort_order) VALUES
-- PC 메인
('pc_main_top', 'PC 메인 상단 배너', 'main', 'pc', 728, 90, 3, 1),
('pc_main_side_1', 'PC 메인 우측 상단', 'main', 'pc', 300, 250, 2, 2),
('pc_main_side_2', 'PC 메인 우측 중간', 'main', 'pc', 300, 250, 2, 3),
('pc_main_mid', 'PC 메인 중앙 배너', 'main', 'pc', 728, 90, 2, 4),
('pc_main_bottom', 'PC 메인 하단 배너', 'main', 'pc', 728, 90, 3, 5),
-- PC 섹션
('pc_section_top', 'PC 섹션 상단', 'section', 'pc', 728, 90, 2, 6),
('pc_section_side_1', 'PC 섹션 우측 상단', 'section', 'pc', 300, 250, 2, 7),
('pc_section_side_2', 'PC 섹션 우측 중간', 'section', 'pc', 300, 250, 2, 8),
('pc_section_side_3', 'PC 섹션 우측 하단', 'section', 'pc', 160, 600, 1, 9),
('pc_section_mid_1', 'PC 섹션 목록 중간1', 'section', 'pc', 468, 60, 2, 10),
('pc_section_mid_2', 'PC 섹션 목록 중간2', 'section', 'pc', 468, 60, 2, 11),
('pc_section_bottom_1', 'PC 섹션 하단 좌', 'section', 'pc', 300, 250, 2, 12),
('pc_section_bottom_2', 'PC 섹션 하단 우', 'section', 'pc', 300, 250, 2, 13),
-- PC 기사상세
('pc_article_top', 'PC 기사 상단', 'article', 'pc', 728, 90, 2, 14),
('pc_article_mid', 'PC 기사 본문중간', 'article', 'pc', 468, 60, 2, 15),
('pc_article_bottom', 'PC 기사 하단', 'article', 'pc', 728, 90, 2, 16),
-- PC 기타
('pc_header_bar', 'PC 최상단 띠배너', 'other', 'pc', 980, 40, 1, 17),
('pc_footer_bar', 'PC 최하단 배너', 'other', 'pc', 728, 90, 2, 18),
('pc_floating_right', 'PC 우측 플로팅', 'other', 'pc', 160, 600, 1, 19),
-- Mobile 메인
('mobile_main_top', '모바일 메인 상단', 'main', 'mobile', 320, 100, 2, 20),
('mobile_main_mid_1', '모바일 메인 중간1', 'main', 'mobile', 320, 250, 2, 21),
('mobile_main_mid_2', '모바일 메인 중간2', 'main', 'mobile', 320, 100, 2, 22),
('mobile_main_bottom', '모바일 메인 하단', 'main', 'mobile', 320, 100, 2, 23),
-- Mobile 서브
('mobile_section_top', '모바일 섹션 상단', 'section', 'mobile', 320, 100, 2, 24),
('mobile_section_mid_1', '모바일 섹션 중간1', 'section', 'mobile', 320, 100, 2, 25),
('mobile_section_mid_2', '모바일 섹션 중간2', 'section', 'mobile', 320, 100, 2, 26),
('mobile_section_mid_3', '모바일 섹션 중간3', 'section', 'mobile', 320, 100, 2, 27),
('mobile_section_bottom', '모바일 섹션 하단', 'section', 'mobile', 320, 250, 2, 28),
('mobile_list_between_1', '모바일 리스트 삽입1', 'section', 'mobile', 320, 100, 1, 29),
('mobile_list_between_2', '모바일 리스트 삽입2', 'section', 'mobile', 320, 100, 1, 30),
('mobile_list_between_3', '모바일 리스트 삽입3', 'section', 'mobile', 320, 100, 1, 31),
('mobile_list_between_4', '모바일 리스트 삽입4', 'section', 'mobile', 320, 100, 1, 32),
-- Mobile 기사상세
('mobile_article_top', '모바일 기사 상단', 'article', 'mobile', 320, 100, 2, 33),
('mobile_article_bottom', '모바일 기사 하단', 'article', 'mobile', 320, 250, 2, 34);
```

---

## 부록 C: Supabase Storage 버킷 구조

```
joongang-articles/          # 기사 이미지
  ├── thumbnails/           # 대표 이미지
  ├── content/              # 본문 내 이미지
  └── attachments/          # 첨부파일

joongang-ads/               # 광고 이미지
  ├── banners/              # 배너 이미지
  └── templates/            # 템플릿 썸네일

joongang-system/            # 시스템 이미지
  ├── logo/                 # 로고
  ├── watermark/            # 워터마크 원본
  ├── og/                   # OG 이미지
  └── default/              # 기본 이미지

joongang-community/         # 커뮤니티 첨부
  └── boards/

joongang-tips/              # 기사 제보 첨부
```

---

## 부록 D: Edge Functions (Supabase)

| 함수명 | 용도 | 트리거 |
|--------|------|--------|
| `joongang-publish-scheduled` | 예약 기사 자동 발행 | pg_cron (매 분) |
| `joongang-deactivate-expired-ads` | 만료 광고 비활성화 | pg_cron (매 5분) |
| `joongang-aggregate-stats` | 시간별 통계 집계 | pg_cron (매 시간) |
| `joongang-newswire-sync` | 뉴스와이어 동기화 | pg_cron (매 30분) |
| `joongang-send-newsletter` | 뉴스레터 발송 | 수동 호출 |
| `joongang-watermark` | 이미지 워터마크 적용 | Storage webhook |
| `joongang-resize-image` | 이미지 리사이즈 | Storage webhook |
| `joongang-generate-rss` | RSS 피드 생성 | 기사 발행 시 |

---

## 부록 E: site.ts 설정 (예상)

```typescript
const site: SiteConfig = {
  id: 'joongang',
  name: 'Joongang News',
  nameKo: '중앙뉴스',
  description: '중앙뉴스 - 빠르고 정확한 뉴스의 중심',
  url: 'https://joongang.dreamitbiz.com',
  dbPrefix: 'joongang_',
  parentSite: {
    name: 'DreamIT Biz',
    url: 'https://www.dreamitbiz.com'
  },
  brand: {
    parts: [
      { text: '중앙', className: 'brand-dream' },
      { text: '뉴스', className: 'brand-it' },
    ]
  },
  themeColor: '#1a1a2e',
  company: { /* DreamIT Biz 공통 */ },
  features: {
    shop: false,         // 쇼핑 불필요
    community: true,     // 커뮤니티 사용
    search: true,        // 검색 사용
    auth: true,          // 회원 인증
    license: false,
  },
  colors: [
    { name: 'blue', color: '#0046C8' },
    { name: 'red', color: '#C8102E' },
    { name: 'green', color: '#00855A' },
    { name: 'purple', color: '#8B1AC8' },
    { name: 'orange', color: '#C87200' },
  ],
  menuItems: [
    { path: '/', labelKey: 'nav.home' },
    {
      labelKey: 'site.nav.news',
      path: '/section/news',
      activePath: '/section/news',
      dropdown: [
        { path: '/section/news/politics', labelKey: 'site.nav.politics' },
        { path: '/section/news/economy', labelKey: 'site.nav.economy' },
        { path: '/section/news/society', labelKey: 'site.nav.society' },
        { path: '/section/news/culture', labelKey: 'site.nav.culture' },
      ]
    },
    {
      labelKey: 'site.nav.entertainment',
      path: '/section/entertainment',
      activePath: '/section/entertainment',
      dropdown: [
        { path: '/section/entertainment/broadcast', labelKey: 'site.nav.broadcast' },
        { path: '/section/entertainment/movie', labelKey: 'site.nav.movie' },
        { path: '/section/entertainment/music', labelKey: 'site.nav.music' },
        { path: '/section/entertainment/celebrity', labelKey: 'site.nav.celebrity' },
      ]
    },
    {
      labelKey: 'site.nav.sports',
      path: '/section/sports',
      activePath: '/section/sports',
      dropdown: [
        { path: '/section/sports/general', labelKey: 'site.nav.sportsGeneral' },
        { path: '/section/sports/baseball', labelKey: 'site.nav.baseball' },
        { path: '/section/sports/soccer', labelKey: 'site.nav.soccer' },
        { path: '/section/sports/volleyball', labelKey: 'site.nav.volleyball' },
      ]
    },
    {
      labelKey: 'site.nav.regional',
      path: '/section/regional',
      activePath: '/section/regional',
      dropdown: [
        { path: '/section/regional/seoul', labelKey: 'site.nav.seoul' },
        { path: '/section/regional/gyeonggi', labelKey: 'site.nav.gyeonggi' },
        { path: '/section/regional/gangwon', labelKey: 'site.nav.gangwon' },
        { path: '/section/regional/chungcheong', labelKey: 'site.nav.chungcheong' },
        { path: '/section/regional/honam', labelKey: 'site.nav.honam' },
        { path: '/section/regional/yeongnam', labelKey: 'site.nav.yeongnam' },
      ]
    },
    { path: '/photo', labelKey: 'site.nav.photo' },
    { path: '/video', labelKey: 'site.nav.video' },
    { path: '/section/health-science', labelKey: 'site.nav.healthScience' },
    {
      labelKey: 'site.nav.media',
      path: '/section/media',
      activePath: '/section/media',
      dropdown: [
        { path: '/section/media/internet', labelKey: 'site.nav.internet' },
        { path: '/section/media/broadcast-media', labelKey: 'site.nav.broadcastMedia' },
      ]
    },
    { path: '/section/education', labelKey: 'site.nav.education' },
    {
      labelKey: 'site.nav.community',
      path: '/community',
      activePath: '/community',
      dropdown: [
        { path: '/community/notice', labelKey: 'site.nav.notice' },
        { path: '/community/free', labelKey: 'site.nav.free' },
        { path: '/community/data', labelKey: 'site.nav.data' },
        { path: '/community/photo', labelKey: 'site.nav.photoBoard' },
      ]
    },
  ],
  footerLinks: [
    { path: '/', labelKey: 'nav.home' },
    { path: '/section/news', labelKey: 'site.nav.news' },
    { path: '/community/notice', labelKey: 'site.nav.notice' },
  ],
  familySites: [
    { name: 'DreamIT Biz (본사이트)', url: 'https://www.dreamitbiz.com' },
  ]
};
```

---

## 부록 F: 주요 의존성 패키지

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "@tiptap/react": "^2.6.0",
    "@tiptap/starter-kit": "^2.6.0",
    "@tiptap/extension-image": "^2.6.0",
    "@tiptap/extension-youtube": "^2.6.0",
    "@tiptap/extension-table": "^2.6.0",
    "@tiptap/extension-link": "^2.6.0",
    "@tiptap/extension-placeholder": "^2.6.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "recharts": "^2.12.0",
    "date-fns": "^3.6.0",
    "react-helmet-async": "^2.0.0",
    "react-hot-toast": "^2.4.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "vite": "^8.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "gh-pages": "^6.1.0",
    "sharp": "^0.33.0"
  }
}
```

---

## 부록 G: 총 개발 기간 요약

| Phase | 내용 | 기간 |
|-------|------|------|
| Phase 1 | 기반 구축 | 2주 |
| Phase 2 | 뉴스 CMS 핵심 | 3주 |
| Phase 3 | 광고 시스템 | 2주 |
| Phase 4 | 레이아웃 엔진 | 2주 |
| Phase 5 | 커뮤니티/소통 | 1주 |
| Phase 6 | 회원/통계/시스템 | 1.5주 |
| Phase 7 | 외부 연동/최적화 | 1주 |
| Phase 8 | 테스트/배포 | 1주 |
| **합계** | | **약 13.5주 (3.4개월)** |

> **참고**: 1인 개발 기준. 풀타임 투입 시 약 3.5개월, 파트타임(50%) 시 약 7개월 소요 예상.

---

**Copyright (c) 2025-2026 DreamIT Biz (Ph.D Aebon Lee). All Rights Reserved.**
