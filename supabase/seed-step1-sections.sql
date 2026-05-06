-- Step 1: 기존 데이터 정리 및 섹션 삽입
-- 순서: 참조 테이블부터 삭제

DELETE FROM joongang_article_keywords;
DELETE FROM joongang_article_positions;
DELETE FROM joongang_article_sections;
DELETE FROM joongang_articles;
DELETE FROM joongang_sections;
DELETE FROM joongang_menu_settings;

-- 섹션 삽입 (상위 카테고리)
INSERT INTO joongang_sections (section_code, name, slug, depth, sort_order, is_active, seo_title, seo_description) VALUES
(100, '정치', 'politics', 0, 1, true, '정치 뉴스', '미국 정치, 한미관계, 워싱턴 정가 소식'),
(200, '경제', 'economy', 0, 2, true, '경제 뉴스', '미국 경제, 한인 비즈니스, 부동산, 금융 소식'),
(300, '한인사회', 'korean-community', 0, 3, true, '한인사회 뉴스', '워싱턴 DC, 버지니아, 메릴랜드 한인 커뮤니티 소식'),
(400, '국제', 'world', 0, 4, true, '국제 뉴스', '한반도, 동아시아, 글로벌 뉴스'),
(500, '문화', 'culture', 0, 5, true, '문화 뉴스', '한인 문화행사, 교육, 예술 소식'),
(600, '생활', 'life', 0, 6, true, '생활정보', '이민법, 세금, 건강, 부동산 등 생활 정보'),
(700, '오피니언', 'opinion', 0, 7, true, '오피니언', '칼럼, 사설, 독자투고'),
(800, '스포츠', 'sports', 0, 8, true, '스포츠', '미국 스포츠, 한국 스포츠 소식'),
(900, '포토', 'photo', 0, 9, true, '포토뉴스', '사진으로 보는 뉴스');
