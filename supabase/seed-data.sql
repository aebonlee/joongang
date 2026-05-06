-- ============================================
-- 중앙일보 워싱턴지사 - 더미 데이터 삽입
-- 실행 전에 schema.sql이 먼저 실행되어 있어야 함
-- ============================================

-- 섹션 데이터 업데이트 (워싱턴지사 맞춤)
DELETE FROM joongang_sections;

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

-- 하위 섹션 추가
INSERT INTO joongang_sections (section_code, name, slug, parent_id, depth, sort_order, is_active) VALUES
(101, '한미관계', 'us-korea-relations', (SELECT id FROM joongang_sections WHERE section_code = 100), 1, 1, true),
(102, '미국정치', 'us-politics', (SELECT id FROM joongang_sections WHERE section_code = 100), 1, 2, true),
(103, '한국정치', 'korea-politics', (SELECT id FROM joongang_sections WHERE section_code = 100), 1, 3, true),
(201, '부동산', 'real-estate', (SELECT id FROM joongang_sections WHERE section_code = 200), 1, 1, true),
(202, '금융·투자', 'finance', (SELECT id FROM joongang_sections WHERE section_code = 200), 1, 2, true),
(203, '한인비즈', 'korean-biz', (SELECT id FROM joongang_sections WHERE section_code = 200), 1, 3, true),
(301, 'DC·메릴랜드', 'dc-maryland', (SELECT id FROM joongang_sections WHERE section_code = 300), 1, 1, true),
(302, '버지니아', 'virginia', (SELECT id FROM joongang_sections WHERE section_code = 300), 1, 2, true),
(601, '이민·비자', 'immigration', (SELECT id FROM joongang_sections WHERE section_code = 600), 1, 1, true),
(602, '건강', 'health', (SELECT id FROM joongang_sections WHERE section_code = 600), 1, 2, true);

-- 기사 더미 데이터 삽입 (20개)
INSERT INTO joongang_articles (title, subtitle, slug, content, excerpt, thumbnail_url, article_type, source_name, author_name, status, is_published, published_at, view_count, is_featured, priority) VALUES

-- 헤드라인 기사 (priority 높음)
(
  '한미 정상회담 워싱턴서 개최... "동맹 강화·경제 협력 확대" 합의',
  '양국 정상, 첨단산업 공급망 협력 및 한반도 비핵화 공조 재확인',
  'us-korea-summit-washington-2026',
  '<p>한미 양국 정상이 워싱턴 DC에서 정상회담을 갖고 동맹 강화와 경제 협력 확대에 합의했다.</p><p>양국 정상은 이번 회담에서 첨단산업 공급망 협력, 한반도 비핵화를 위한 공조 강화, 그리고 인도태평양 지역의 안정과 번영을 위한 협력 방안을 논의했다.</p><p>특히 반도체, AI, 양자컴퓨팅 등 첨단기술 분야에서의 양국 간 협력을 한층 강화하기로 합의했으며, 이를 위한 공동 투자 기금 조성 방안도 검토하기로 했다.</p><p>한편, 양국은 북한의 비핵화를 위한 외교적 노력을 지속하고, 대북 제재의 이행을 강화하기로 했다. 또한 한반도 평화 프로세스의 진전을 위해 긴밀히 협력하기로 재확인했다.</p>',
  '한미 양국 정상이 워싱턴 DC에서 정상회담을 갖고 동맹 강화와 경제 협력 확대에 합의했다. 첨단산업 공급망 협력 및 한반도 비핵화 공조를 재확인했다.',
  'https://images.unsplash.com/photo-1501466044931-62695aada8e9?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '김워싱턴 특파원',
  'published', true, NOW() - INTERVAL '1 hour', 3542, true, 100
),

-- 주요뉴스 (is_featured = true)
(
  '페어팩스 카운티 한인 타운 개발 프로젝트 본격화',
  '센터빌 인근 3만평 부지에 한인 상업·문화 복합단지 조성',
  'fairfax-korean-town-development-2026',
  '<p>버지니아주 페어팩스 카운티에 대규모 한인 타운 개발 프로젝트가 본격적으로 추진된다.</p><p>페어팩스 카운티 감독위원회는 지난 3일 센터빌 인근 약 3만평 부지에 한인 상업·문화 복합단지를 조성하는 계획을 승인했다. 이 프로젝트는 한인 투자자 컨소시엄이 주도하며, 총 투자 규모는 약 2억 달러에 달한다.</p><p>복합단지에는 한식 레스토랑, 한국 식료품점, 한의원, 태권도장, 한글학교 등 한인 커뮤니티를 위한 다양한 시설이 입주할 예정이다.</p>',
  '버지니아주 페어팩스 카운티에 대규모 한인 타운 개발 프로젝트가 본격 추진된다. 총 2억 달러 규모 투자.',
  'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '박버지니아 기자',
  'published', true, NOW() - INTERVAL '3 hours', 2187, true, 80
),

(
  'Fed 금리 동결 결정... "인플레이션 안정세 확인 후 인하 검토"',
  '연준 의장 "경제 연착륙 자신감" 시사',
  'fed-rate-hold-may-2026',
  '<p>미국 연방준비제도(Fed)가 기준금리를 현행 수준으로 동결하기로 결정했다.</p><p>제롬 파월 연준 의장은 기자회견에서 "인플레이션이 안정세를 보이고 있으나, 2% 목표치로의 확실한 복귀를 확인한 후 금리 인하를 검토하겠다"고 밝혔다.</p><p>파월 의장은 "미국 경제는 여전히 견조한 성장세를 유지하고 있으며, 노동시장도 건강한 상태"라며 경제 연착륙에 대한 자신감을 내비쳤다.</p><p>이번 결정으로 한인 사회에서 관심이 높은 모기지 금리도 당분간 현 수준을 유지할 것으로 전망된다.</p>',
  '미 연준이 기준금리를 동결했다. 파월 의장은 인플레이션 안정세 확인 후 인하를 검토하겠다고 밝혔다.',
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '이경제 기자',
  'published', true, NOW() - INTERVAL '5 hours', 1876, true, 70
),

(
  'DMV 한인회 연합 "한글학교 지원 확대" 결의',
  '워싱턴·버지니아·메릴랜드 한인회장단 합동회의',
  'dmv-korean-association-hangul-school-2026',
  '<p>워싱턴 DC, 버지니아, 메릴랜드(DMV) 지역 한인회 연합이 한글학교 지원 확대를 결의했다.</p><p>DMV 한인회장단 12명은 지난 주말 합동회의를 개최하고, 차세대 한인들의 한국어·한국문화 교육을 위한 예산을 전년 대비 30% 증액하기로 합의했다.</p><p>특히 평일 방과후 한국어 교육 프로그램을 신설하고, 한글학교 교사들의 처우 개선을 위한 방안도 마련하기로 했다.</p>',
  'DMV 지역 한인회 연합이 한글학교 지원 예산을 30% 증액하기로 합의했다.',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '최한인 기자',
  'published', true, NOW() - INTERVAL '6 hours', 1432, true, 60
),

(
  '워싱턴 벚꽃축제 한국관 역대 최대 규모 운영',
  '한국 전통문화 체험·K-푸드·K-팝 공연으로 현지인 사로잡아',
  'cherry-blossom-festival-korea-pavilion-2026',
  '<p>올해 워싱턴 DC 벚꽃축제에서 한국관이 역대 최대 규모로 운영되며 큰 인기를 끌었다.</p><p>타이들베이슨 인근에 설치된 한국관에서는 한복 체험, 전통 다도, 한국 음식 시식, K-팝 공연 등 다양한 프로그램이 진행됐다. 이번 한국관은 주미한국대사관과 한국관광공사 워싱턴지사가 공동 주관했다.</p><p>한국관을 방문한 현지인들은 "한국 문화의 다양성에 놀랐다"며 높은 만족도를 보였다.</p>',
  '워싱턴 DC 벚꽃축제 한국관이 역대 최대 규모로 운영되며 현지인들의 큰 호응을 받았다.',
  'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800&h=450&fit=crop',
  'photo',
  '중앙일보 워싱턴',
  '정문화 기자',
  'published', true, NOW() - INTERVAL '8 hours', 2891, true, 50
),

-- 최신뉴스 (일반 기사)
(
  'H-1B 비자 추첨 결과 발표... 한인 IT 종사자 희비 엇갈려',
  NULL,
  'h1b-visa-lottery-results-2026',
  '<p>올해 H-1B 비자 추첨 결과가 발표되면서 한인 IT 종사자들 사이에서 희비가 엇갈리고 있다.</p><p>이민국(USCIS)에 따르면 올해 H-1B 비자 신청 건수는 약 78만 건으로 전년 대비 15% 증가했으며, 당첨률은 약 11%에 그쳤다.</p><p>DMV 지역 한인 이민변호사 김모 씨는 "올해는 경쟁이 더 치열했다"며 "탈락한 분들은 다른 비자 옵션을 검토해볼 필요가 있다"고 조언했다.</p>',
  'H-1B 비자 추첨 결과 발표. 올해 당첨률 약 11%로 한인 IT 종사자들 희비 엇갈려.',
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '한이민 기자',
  'published', true, NOW() - INTERVAL '10 hours', 3201, false, 0
),

(
  '메릴랜드 한인 식당 "미쉐린 빕 구르망" 선정 쾌거',
  NULL,
  'maryland-korean-restaurant-michelin-2026',
  '<p>메릴랜드주 록빌에 위치한 한인 식당 ''맛나(Matna)''가 미쉐린 빕 구르망에 선정되는 쾌거를 이뤘다.</p><p>미쉐린 가이드 DC 2026 에디션에서 빕 구르망(가성비 좋은 맛집)에 선정된 이 식당은 전통 한식을 현대적으로 재해석한 메뉴로 현지인과 한인 모두에게 인기를 끌어왔다.</p><p>식당 대표 이모 씨는 "한식의 우수성을 알릴 수 있어 기쁘다"며 "앞으로도 정성을 다하겠다"고 소감을 밝혔다.</p>',
  '메릴랜드 록빌 한인 식당이 미쉐린 빕 구르망에 선정됐다.',
  'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '정문화 기자',
  'published', true, NOW() - INTERVAL '12 hours', 4521, false, 0
),

(
  '버지니아 한인 학부모회, 교육청에 "한국어 AP 과목 개설" 청원',
  NULL,
  'virginia-korean-ap-course-petition-2026',
  '<p>버지니아주 페어팩스 카운티 한인 학부모회가 교육청에 한국어 AP(대학 선이수) 과목 개설을 공식 청원했다.</p><p>청원서에는 2,300여 명의 학부모 서명이 담겼다. 학부모회 측은 "페어팩스 카운티에 한인 학생이 8,000명 이상인데, 한국어 AP 과목이 없는 것은 불합리하다"고 주장했다.</p><p>교육청 관계자는 "청원을 검토하겠다"며 "내년 교과과정 편성 시 반영 여부를 결정하겠다"고 밝혔다.</p>',
  '페어팩스 카운티 한인 학부모 2,300명이 한국어 AP 과목 개설을 청원했다.',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '최한인 기자',
  'published', true, NOW() - INTERVAL '14 hours', 1876, false, 0
),

(
  '미 하원 "한미 FTA 업그레이드" 법안 발의... 디지털 통상 강화',
  NULL,
  'us-house-korea-fta-upgrade-bill-2026',
  '<p>미국 하원에서 한미 자유무역협정(FTA) 업그레이드를 위한 법안이 발의됐다.</p><p>초당적 의원 그룹이 공동 발의한 이 법안은 기존 한미 FTA에 디지털 통상, 친환경 에너지, 공급망 안보 등 새로운 분야를 추가하는 내용을 담고 있다.</p><p>법안 발의를 주도한 한국계 의원 A 씨는 "한미 경제 관계를 21세기에 맞게 업그레이드해야 한다"며 "양국 모두에게 이익이 될 것"이라고 강조했다.</p>',
  '미 하원에서 한미 FTA 업그레이드 법안이 발의됐다. 디지털 통상, 친환경 에너지 분야 추가.',
  'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '김워싱턴 특파원',
  'published', true, NOW() - INTERVAL '16 hours', 987, false, 0
),

(
  '워싱턴 한인 청년 네트워크 "커리어 멘토링 프로그램" 성황',
  NULL,
  'dc-korean-youth-mentoring-2026',
  '<p>워싱턴 DC 한인 청년 네트워크(DCKY)가 주최한 커리어 멘토링 프로그램이 성황리에 개최됐다.</p><p>이번 행사에는 미 정부, 세계은행, IMF, 주요 로펌 등에서 활동하는 한인 전문가 30명이 멘토로 참여했으며, 취업 준비 중인 한인 청년 150명이 멘티로 등록했다.</p><p>참석자 이모 씨(28)는 "세계은행에서 일하는 선배의 이야기를 들으며 구체적인 진로 방향을 잡을 수 있었다"고 말했다.</p>',
  '워싱턴 한인 청년 멘토링 프로그램에 전문가 30명, 청년 150명 참여.',
  'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '최한인 기자',
  'published', true, NOW() - INTERVAL '18 hours', 1234, false, 0
),

(
  '북한 미사일 발사에 한미 "강력 대응" 공동성명',
  NULL,
  'north-korea-missile-us-korea-response-2026',
  '<p>북한이 동해상으로 탄도미사일을 발사한 것에 대해 한미 양국이 "강력 대응"을 천명하는 공동성명을 발표했다.</p><p>워싱턴 DC에서 발표된 공동성명에서 양국은 "북한의 도발을 강력히 규탄하며, 한미 연합 방위태세를 더욱 강화할 것"이라고 밝혔다.</p><p>미 국무부 대변인은 정례 브리핑에서 "한반도의 완전한 비핵화는 변함없는 목표"라며 "외교적 해결을 위한 문은 여전히 열려 있다"고 강조했다.</p>',
  '북한 미사일 도발에 한미 양국이 강력 대응 공동성명을 발표했다.',
  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '김워싱턴 특파원',
  'published', true, NOW() - INTERVAL '20 hours', 2567, false, 0
),

(
  '메릴랜드주 한인 인구 10만 돌파... "정치적 영향력 확대해야"',
  NULL,
  'maryland-korean-population-100k-2026',
  '<p>메릴랜드주 한인 인구가 10만 명을 돌파한 것으로 나타났다.</p><p>미 인구조사국의 최신 추계에 따르면 메릴랜드주 거주 한인은 약 10만 2천 명으로, 10년 전 대비 35% 증가했다. 특히 하워드 카운티와 몽고메리 카운티에 한인 인구가 집중되어 있다.</p><p>메릴랜드 한인회 회장은 "인구 증가에 걸맞은 정치적 영향력을 확보해야 한다"며 "유권자 등록과 투표 참여를 독려하겠다"고 밝혔다.</p>',
  '메릴랜드주 한인 인구가 10만 명을 돌파했다. 정치적 영향력 확대 필요성 대두.',
  'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '박버지니아 기자',
  'published', true, NOW() - INTERVAL '22 hours', 1890, false, 0
),

(
  '한인 2세 변호사, 연방 판사 지명... "역사적 순간"',
  NULL,
  'korean-american-federal-judge-nomination-2026',
  '<p>한인 2세 변호사가 연방 지방법원 판사에 지명되어 한인 사회에 큰 기쁨을 안겼다.</p><p>지명된 제니퍼 김(Jennifer Kim) 변호사는 하버드 로스쿨 출신으로, 15년간 연방 검사와 민간 로펌에서 활동해왔다. 상원 인준이 확정되면 한인 여성으로서는 두 번째 연방 판사가 된다.</p><p>한인 법조인 협회(KABA)는 성명을 통해 "한인 사회의 위상을 높이는 역사적 순간"이라며 축하의 뜻을 전했다.</p>',
  '한인 2세 변호사 제니퍼 김이 연방 판사에 지명됐다.',
  'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '김워싱턴 특파원',
  'published', true, NOW() - INTERVAL '24 hours', 3456, false, 0
),

(
  '워싱턴 한인 교회 연합, 노숙자 돕기 "사랑의 밥차" 운영',
  NULL,
  'dc-korean-church-food-truck-2026',
  '<p>워싱턴 DC 한인 교회 연합이 노숙자들을 위한 무료 급식 프로그램 "사랑의 밥차"를 본격 운영하기 시작했다.</p><p>매주 토요일 DC 다운타운에서 운영되는 이 프로그램은 한인 교회 15곳이 돌아가며 음식을 준비하고 봉사한다. 한식 비빔밥, 불고기 등이 현지 노숙자들에게 큰 인기를 끌고 있다.</p><p>프로그램 대표 목사는 "이웃 사랑을 실천하며 한인 사회의 긍정적 이미지를 높이고 싶다"고 말했다.</p>',
  '워싱턴 한인 교회 연합이 매주 토요일 노숙자 무료 급식 프로그램을 운영한다.',
  'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '최한인 기자',
  'published', true, NOW() - INTERVAL '26 hours', 876, false, 0
),

(
  '버지니아 애난데일 한인타운 주차난 해소 대책 마련',
  NULL,
  'annandale-koreatown-parking-solution-2026',
  '<p>버지니아주 애난데일 한인타운의 만성적인 주차난 해소를 위한 대책이 마련됐다.</p><p>페어팩스 카운티는 애난데일 한인 상권 인근에 350면 규모의 공영주차장을 건설하기로 결정했다. 2027년 완공 예정인 이 주차장은 주말과 저녁 시간 무료 주차를 제공할 계획이다.</p><p>애난데일 한인상인회 회장은 "오래된 숙원이 해결돼 기쁘다"며 "주차 문제로 발길을 돌렸던 고객들이 돌아올 것"이라고 기대감을 표했다.</p>',
  '페어팩스 카운티가 애난데일 한인타운에 350면 규모 공영주차장 건설을 결정했다.',
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '박버지니아 기자',
  'published', true, NOW() - INTERVAL '28 hours', 1543, false, 0
),

(
  '미 국무부 "한국 여행경보 1단계 유지"... 안전한 여행국 재확인',
  NULL,
  'state-dept-korea-travel-advisory-2026',
  '<p>미 국무부가 한국에 대한 여행경보를 1단계(일반 주의)로 유지한다고 밝혔다.</p><p>이는 전 세계 약 200개국 중 가장 안전한 수준으로, 일본, 영국, 프랑스 등과 동일한 등급이다.</p><p>국무부 영사국은 "한국은 미국 시민에게 매우 안전한 여행지"라며 "다만 일반적인 여행 주의사항은 항상 숙지하라"고 당부했다.</p>',
  '미 국무부가 한국 여행경보를 가장 안전한 1단계로 유지했다.',
  'https://images.unsplash.com/photo-1583266913928-f6e8e7cbb41e?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '김워싱턴 특파원',
  'published', true, NOW() - INTERVAL '30 hours', 2134, false, 0
),

-- 포토뉴스
(
  '[포토] 워싱턴 내셔널몰에서 열린 한국전 참전용사 기념행사',
  NULL,
  'korean-war-veterans-memorial-event-2026',
  '<p>워싱턴 DC 내셔널몰 한국전 참전용사 기념비 앞에서 기념행사가 열렸다.</p><p>주미한국대사관 주최로 열린 이번 행사에는 한국전 참전용사 20여 명과 유족, 한인 커뮤니티 대표 200여 명이 참석했다.</p><p>행사에서는 헌화, 묵념, 참전용사 감사패 전달 등이 진행됐다. 최고령 참전용사인 제임스 윌슨(97세) 씨는 "한국의 발전을 보며 우리의 희생이 헛되지 않았음을 느낀다"고 소감을 밝혔다.</p>',
  '워싱턴 한국전 참전용사 기념비에서 기념행사가 열렸다.',
  'https://images.unsplash.com/photo-1569317002804-ab77bcf1bce4?w=800&h=450&fit=crop',
  'photo',
  '중앙일보 워싱턴',
  '정문화 기자',
  'published', true, NOW() - INTERVAL '32 hours', 1678, false, 0
),

(
  '[포토] K-팝 커버댄스 대회 DC 예선... "한류의 힘"',
  NULL,
  'kpop-cover-dance-dc-2026',
  '<p>워싱턴 DC에서 K-팝 커버댄스 대회 미동부 예선이 열려 현지 청소년들의 열띤 참여가 이어졌다.</p><p>주미한국문화원 주최로 열린 이번 대회에는 미동부 지역에서 총 48팀이 참가했다. 참가자의 70%가 비한인으로, K-팝의 글로벌 영향력을 실감케 했다.</p><p>대상을 수상한 팀 "DC Stars"의 리더 사만다(16)는 "BTS와 뉴진스를 보며 춤을 시작했다"며 "한국에 가서 춤을 더 배우고 싶다"고 말했다.</p>',
  'DC에서 열린 K-팝 커버댄스 대회에 48팀 참가. 비한인 참가자 70%.',
  'https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&h=450&fit=crop',
  'photo',
  '중앙일보 워싱턴',
  '정문화 기자',
  'published', true, NOW() - INTERVAL '34 hours', 2345, false, 0
),

(
  '[포토] 버지니아 한인 골프대회 성황리 개최',
  NULL,
  'virginia-korean-golf-tournament-2026',
  '<p>버지니아 한인회 주최 제15회 한인 골프대회가 성황리에 개최됐다.</p><p>레스턴 내셔널 골프코스에서 열린 이번 대회에는 DMV 지역 한인 120명이 참가했다. 대회 수익금 전액은 한인 장학재단에 기부된다.</p><p>우승자 최모 씨(52)는 "좋은 취지의 대회에서 우승해 기쁘다"며 "내년에도 꼭 참가하겠다"고 말했다.</p>',
  '버지니아 한인 골프대회에 120명 참가. 수익금 전액 장학재단 기부.',
  'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&h=450&fit=crop',
  'photo',
  '중앙일보 워싱턴',
  '박버지니아 기자',
  'published', true, NOW() - INTERVAL '36 hours', 876, false, 0
),

(
  '[포토] DC 한인 미술가 그룹전 "고향의 봄" 개최',
  NULL,
  'dc-korean-art-exhibition-spring-2026',
  '<p>워싱턴 DC 한인 미술가 협회가 그룹전 "고향의 봄"을 개최했다.</p><p>듀폰서클 인근 갤러리에서 2주간 열리는 이번 전시에는 한인 작가 12명의 회화·조각·설치 작품 40여 점이 전시된다. "고향"과 "이민"을 주제로 한 작품들이 관람객들의 공감을 자아내고 있다.</p><p>참여 작가 이모 씨는 "타향에서 느끼는 고향에 대한 그리움을 작품에 담았다"고 설명했다.</p>',
  '워싱턴 한인 미술가 12명이 참여하는 그룹전이 듀폰서클에서 열린다.',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=450&fit=crop',
  'photo',
  '중앙일보 워싱턴',
  '정문화 기자',
  'published', true, NOW() - INTERVAL '38 hours', 654, false, 0
),

-- 추가 일반 기사
(
  '한인 부동산 시장 "봄 시즌 강세"... 페어팩스·하워드 인기',
  NULL,
  'korean-real-estate-spring-market-2026',
  '<p>DMV 지역 한인 부동산 시장이 봄 시즌을 맞아 활기를 보이고 있다.</p><p>한인 부동산 에이전트들에 따르면 올 봄 한인 주택 거래량은 전년 동기 대비 20% 증가했다. 특히 버지니아주 페어팩스 카운티와 메릴랜드주 하워드 카운티가 한인 가정에 가장 인기 있는 지역으로 꼽힌다.</p><p>한인 부동산 협회 회장은 "좋은 학군과 한인 인프라가 갖춰진 지역 위주로 수요가 몰리고 있다"고 분석했다.</p>',
  'DMV 한인 부동산 봄 시즌 거래량 전년 대비 20% 증가.',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop',
  'normal',
  '중앙일보 워싱턴',
  '이경제 기자',
  'published', true, NOW() - INTERVAL '40 hours', 1432, false, 0
);

-- 기사-섹션 매핑
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

-- 출력위치 매핑 (헤드라인 + 주요뉴스)
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

-- 키워드 추가
INSERT INTO joongang_article_keywords (article_id, keyword)
SELECT id, '한미정상회담' FROM joongang_articles WHERE slug = 'us-korea-summit-washington-2026'
UNION ALL
SELECT id, '동맹' FROM joongang_articles WHERE slug = 'us-korea-summit-washington-2026'
UNION ALL
SELECT id, '워싱턴' FROM joongang_articles WHERE slug = 'us-korea-summit-washington-2026';

INSERT INTO joongang_article_keywords (article_id, keyword)
SELECT id, '한인타운' FROM joongang_articles WHERE slug = 'fairfax-korean-town-development-2026'
UNION ALL
SELECT id, '페어팩스' FROM joongang_articles WHERE slug = 'fairfax-korean-town-development-2026'
UNION ALL
SELECT id, '부동산개발' FROM joongang_articles WHERE slug = 'fairfax-korean-town-development-2026';

INSERT INTO joongang_article_keywords (article_id, keyword)
SELECT id, '금리' FROM joongang_articles WHERE slug = 'fed-rate-hold-may-2026'
UNION ALL
SELECT id, '연준' FROM joongang_articles WHERE slug = 'fed-rate-hold-may-2026'
UNION ALL
SELECT id, '인플레이션' FROM joongang_articles WHERE slug = 'fed-rate-hold-may-2026';

INSERT INTO joongang_article_keywords (article_id, keyword)
SELECT id, 'H1B' FROM joongang_articles WHERE slug = 'h1b-visa-lottery-results-2026'
UNION ALL
SELECT id, '비자' FROM joongang_articles WHERE slug = 'h1b-visa-lottery-results-2026'
UNION ALL
SELECT id, '이민' FROM joongang_articles WHERE slug = 'h1b-visa-lottery-results-2026';

-- 메뉴 설정 업데이트
DELETE FROM joongang_menu_settings;

INSERT INTO joongang_menu_settings (menu_type, menu_items) VALUES
('header', '[
  {"label": "정치", "href": "/section/politics", "children": [
    {"label": "한미관계", "href": "/section/us-korea-relations"},
    {"label": "미국정치", "href": "/section/us-politics"},
    {"label": "한국정치", "href": "/section/korea-politics"}
  ]},
  {"label": "경제", "href": "/section/economy", "children": [
    {"label": "부동산", "href": "/section/real-estate"},
    {"label": "금융·투자", "href": "/section/finance"},
    {"label": "한인비즈", "href": "/section/korean-biz"}
  ]},
  {"label": "한인사회", "href": "/section/korean-community", "children": [
    {"label": "DC·메릴랜드", "href": "/section/dc-maryland"},
    {"label": "버지니아", "href": "/section/virginia"}
  ]},
  {"label": "국제", "href": "/section/world"},
  {"label": "문화", "href": "/section/culture"},
  {"label": "생활", "href": "/section/life", "children": [
    {"label": "이민·비자", "href": "/section/immigration"},
    {"label": "건강", "href": "/section/health"}
  ]},
  {"label": "오피니언", "href": "/section/opinion"},
  {"label": "스포츠", "href": "/section/sports"},
  {"label": "포토", "href": "/section/photo"}
]'),
('footer', '[
  {"label": "회사소개", "href": "/about"},
  {"label": "광고문의", "href": "/advertise"},
  {"label": "기사제보", "href": "/tip"},
  {"label": "이용약관", "href": "/terms"},
  {"label": "개인정보처리방침", "href": "/privacy"}
]'),
('mobile', '[
  {"label": "정치", "href": "/section/politics"},
  {"label": "경제", "href": "/section/economy"},
  {"label": "한인사회", "href": "/section/korean-community"},
  {"label": "국제", "href": "/section/world"},
  {"label": "문화", "href": "/section/culture"},
  {"label": "생활", "href": "/section/life"},
  {"label": "오피니언", "href": "/section/opinion"},
  {"label": "스포츠", "href": "/section/sports"},
  {"label": "포토", "href": "/section/photo"}
]');
