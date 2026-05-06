-- Step 4: 기사-섹션 매핑
INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'us-korea-summit-washington-2026' AND s.section_code = 100;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'fairfax-korean-town-development-2026' AND s.section_code = 300;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'fed-rate-hold-may-2026' AND s.section_code = 200;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'dmv-korean-association-hangul-school-2026' AND s.section_code = 300;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'cherry-blossom-festival-korea-pavilion-2026' AND s.section_code = 500;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'h1b-visa-lottery-results-2026' AND s.section_code = 600;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'maryland-korean-restaurant-michelin-2026' AND s.section_code = 500;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'virginia-korean-ap-course-petition-2026' AND s.section_code = 300;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'us-house-korea-fta-upgrade-bill-2026' AND s.section_code = 100;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'dc-korean-youth-mentoring-2026' AND s.section_code = 300;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'north-korea-missile-us-korea-response-2026' AND s.section_code = 400;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'maryland-korean-population-100k-2026' AND s.section_code = 300;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'korean-american-federal-judge-nomination-2026' AND s.section_code = 100;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'dc-korean-church-food-truck-2026' AND s.section_code = 300;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'annandale-koreatown-parking-solution-2026' AND s.section_code = 300;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'state-dept-korea-travel-advisory-2026' AND s.section_code = 400;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'korean-war-veterans-memorial-event-2026' AND s.section_code = 900;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'kpop-cover-dance-dc-2026' AND s.section_code = 900;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'virginia-korean-golf-tournament-2026' AND s.section_code = 900;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'dc-korean-art-exhibition-spring-2026' AND s.section_code = 900;

INSERT INTO joongang_article_sections (article_id, section_id, is_primary, sort_order)
SELECT a.id, s.id, true, 0
FROM joongang_articles a, joongang_sections s
WHERE a.slug = 'korean-real-estate-spring-market-2026' AND s.section_code = 200;

-- 출력위치 매핑
INSERT INTO joongang_article_positions (article_id, position_type, priority)
SELECT id, 'headline', 100 FROM joongang_articles WHERE slug = 'us-korea-summit-washington-2026';

INSERT INTO joongang_article_positions (article_id, position_type, priority)
SELECT id, 'top_news', 80 FROM joongang_articles WHERE slug = 'fairfax-korean-town-development-2026';

INSERT INTO joongang_article_positions (article_id, position_type, priority)
SELECT id, 'top_news', 70 FROM joongang_articles WHERE slug = 'fed-rate-hold-may-2026';

INSERT INTO joongang_article_positions (article_id, position_type, priority)
SELECT id, 'top_news', 60 FROM joongang_articles WHERE slug = 'dmv-korean-association-hangul-school-2026';

INSERT INTO joongang_article_positions (article_id, position_type, priority)
SELECT id, 'top_news', 50 FROM joongang_articles WHERE slug = 'cherry-blossom-festival-korea-pavilion-2026';

-- 메뉴 설정
INSERT INTO joongang_menu_settings (menu_type, menu_items) VALUES
('header', '[{"label":"정치","href":"/section/politics"},{"label":"경제","href":"/section/economy"},{"label":"한인사회","href":"/section/korean-community"},{"label":"국제","href":"/section/world"},{"label":"문화","href":"/section/culture"},{"label":"생활","href":"/section/life"},{"label":"오피니언","href":"/section/opinion"},{"label":"스포츠","href":"/section/sports"},{"label":"포토","href":"/section/photo"}]'),
('footer', '[{"label":"지사소개","href":"/about"},{"label":"광고문의","href":"/advertise"},{"label":"기사제보","href":"/tip"},{"label":"이용약관","href":"/terms"},{"label":"개인정보처리방침","href":"/privacy"}]'),
('mobile', '[{"label":"정치","href":"/section/politics"},{"label":"경제","href":"/section/economy"},{"label":"한인사회","href":"/section/korean-community"},{"label":"국제","href":"/section/world"},{"label":"문화","href":"/section/culture"},{"label":"생활","href":"/section/life"},{"label":"오피니언","href":"/section/opinion"},{"label":"스포츠","href":"/section/sports"},{"label":"포토","href":"/section/photo"}]');
