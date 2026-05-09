# 중앙일보 워싱턴 - 지면보기 FTP 동기화

> 날짜: 2026-05-10
> 프로젝트: joongang (joongang.dreamitbiz.com)

---

## 작업 내용

### 1. FTP → Supabase 동기화 스크립트 생성

FTP 서버에 있는 실제 신문 PDF 파일을 Supabase Storage로 자동 동기화하는 스크립트 개발.

- **스크립트**: `scripts/sync-ftp-editions.mjs`
- **FTP 서버**: `ftp.koreadailyusa.com` (Serv-U FTP Server v15.0)
- **FTP 경로**: `/LA_PDF_for_NEWMEDIA/{MMDD}/`
- **Storage 버킷**: `joongang-editions`
- **DB 테이블**: `joongang_editions`

#### 사용법

```bash
node scripts/sync-ftp-editions.mjs              # 전체 날짜 동기화
node scripts/sync-ftp-editions.mjs 0511          # 특정 날짜만
node scripts/sync-ftp-editions.mjs 0508 0511     # 여러 날짜
```

#### FTP 파일 네이밍 규칙

```
{섹션코드}{MMDD}1{페이지번호:3자리}{버전:2자리}.pdf
예: A0511100501.pdf → A섹션, 5월 11일, 5면, 버전 01
예: A0511102501_1.pdf → A섹션, 5월 11일, 25면, 수정본
```

- 섹션 코드: A(종합), B, E, G, N
- `_1` 접미사가 있으면 수정본 → 원본 대체

#### 주요 기술 이슈 및 해결

| 이슈 | 원인 | 해결 |
|------|------|------|
| MLSD 디렉토리 인식 실패 | Serv-U FTP MLSD가 type/size 미반환 | `ftp.availableListCommands = ['LIST -a']` 강제 |
| Storage 업로드 RLS 차단 | anon key로 업로드 시 RLS 정책 위반 | service_role key 사용 |
| FTP 패시브 모드 타임아웃 | `ETIMEDOUT 76.232.70.7:50001` 간헐적 발생 | 재실행 시 이미 등록된 파일 건너뛰고 실패분만 재시도 |
| 50MB 초과 파일 | Supabase Storage 기본 제한 | 2개 파일 미등록 (0505 A14면 64.2MB, 0507 G7면 61.6MB) |

### 2. EditionPage 수정

- 섹션 탭(A/B/G/E/N) 제거 → 통합 표시
- A섹션 우선 로직: 같은 page_number가 여러 섹션에 있으면 A섹션 PDF 사용
- A섹션에 없는 페이지만 다른 섹션에서 채움
- 히어로 영역 `--nav-height` 오프셋 적용
- 히어로-콘텐츠 상하 여백 60px 통일
- PDF 뷰어 높이 100vh (모바일 80vh)

### 3. 더미 데이터 정리

- AE/AW 코드의 임의 테스트 레코드 110개 삭제
- 중복 레코드 15개 삭제
- 05-04 이전 날짜 데이터 전부 제거

---

## 동기화 결과 (최종)

| 날짜 | 총 | A | B | G | E | N |
|------|---|---|---|---|---|---|
| 05-04 | 12 | 7 | 5 | - | - | - |
| 05-05 | 58 | 26 | 16 | 16 | - | - |
| 05-06 | 59 | 27 | 16 | 16 | - | - |
| 05-07 | 92 | 27 | 15 | 14 | 20 | 16 |
| 05-08 | 59 | 27 | 16 | 16 | - | - |
| 05-11 | 50 | 23 | 11 | 16 | - | - |
| **합계** | **330** | | | | | |

---

## 수정 파일

| 파일 | 작업 |
|------|------|
| `scripts/sync-ftp-editions.mjs` | 신규 생성 - FTP 동기화 스크립트 |
| `scripts/ftp-debug.mjs` | 신규 생성 - FTP 디버그 유틸리티 |
| `src/pages/public/EditionPage.tsx` | 수정 - 섹션 통합, A섹션 우선 로직 |
| `src/pages/public/EditionPage.css` | 수정 - 히어로 패딩, 여백 통일, PDF 높이 |

---

## 향후 참고

- FTP 서버에 새 날짜 폴더가 추가되면 `node scripts/sync-ftp-editions.mjs` 재실행
- 이미 등록된 페이지는 자동 건너뜀 (중복 방지)
- 50MB 초과 파일은 Supabase Storage `file_size_limit` 증가 필요
