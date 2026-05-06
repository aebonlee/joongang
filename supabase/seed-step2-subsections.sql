-- Step 2: 하위 섹션 추가
INSERT INTO joongang_sections (section_code, name, slug, parent_id, depth, sort_order, is_active) VALUES
(101, '한미관계', 'us-korea-relations', (SELECT id FROM joongang_sections WHERE section_code = 100), 1, 1, true),
(102, '미국정치', 'us-politics', (SELECT id FROM joongang_sections WHERE section_code = 100), 1, 2, true),
(103, '한국정치', 'korea-politics', (SELECT id FROM joongang_sections WHERE section_code = 100), 1, 3, true),
(201, '부동산', 'real-estate', (SELECT id FROM joongang_sections WHERE section_code = 200), 1, 1, true),
(202, '금융투자', 'finance', (SELECT id FROM joongang_sections WHERE section_code = 200), 1, 2, true),
(203, '한인비즈', 'korean-biz', (SELECT id FROM joongang_sections WHERE section_code = 200), 1, 3, true),
(301, 'DC메릴랜드', 'dc-maryland', (SELECT id FROM joongang_sections WHERE section_code = 300), 1, 1, true),
(302, '버지니아', 'virginia', (SELECT id FROM joongang_sections WHERE section_code = 300), 1, 2, true),
(601, '이민비자', 'immigration', (SELECT id FROM joongang_sections WHERE section_code = 600), 1, 1, true),
(602, '건강', 'health', (SELECT id FROM joongang_sections WHERE section_code = 600), 1, 2, true);
