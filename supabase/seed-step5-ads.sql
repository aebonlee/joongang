-- ============================================
-- Step 5: 광고주 + 광고 더미 데이터
-- 실행 순서: schema.sql → step1~4 → step5 (이 파일)
-- ============================================

-- 1. 광고주 등록 (DMV 지역 한인 업체)
INSERT INTO joongang_advertisers (company_name, contact_name, contact_email, contact_phone, memo, is_active) VALUES
  ('한마음 부동산', '박영수', 'park@hanmaum-realty.com', '703-555-0101', 'VA 북부 한인타운 전문', true),
  ('DMV 한인 자동차', '김철호', 'kim@dmvkoreauto.com', '301-555-0202', '메릴랜드 소재 중고차 딜러', true),
  ('아리랑 식품', '이미영', 'lee@arirangfood.com', '703-555-0303', 'Annandale 한국식품 마트', true),
  ('워싱턴 법률사무소', '최준혁', 'choi@dckorealaw.com', '202-555-0404', '이민/비즈니스 전문', true),
  ('K-Beauty DC', '정수진', 'jung@kbeautydc.com', '571-555-0505', '한국 화장품 온라인몰', true),
  ('한인 여행사 투어코리아', '송민정', 'song@tourkorea.com', '703-555-0606', '한국행 항공권 특가', true);

-- 2. 모든 슬롯에 광고 배치
-- 슬롯 ID를 서브쿼리로 참조, 광고주 ID도 서브쿼리로 참조

-- PC 메인 상단 배너 (728x90)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_top'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '한마음 부동산'),
  '한마음 부동산 - VA/MD 한인타운 매물 특선',
  'https://placehold.co/728x90/E2231A/FFFFFF?text=한마음+부동산+%7C+VA/MD+매물특선+703-555-0101',
  'https://example.com/hanmaum-realty',
  '2026-05-01', '2026-12-31', true, true, 15420, 328
);

-- PC 메인 사이드바 상단 (300x250)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_side_1'),
  (SELECT id FROM joongang_advertisers WHERE company_name = 'DMV 한인 자동차'),
  'DMV 한인자동차 - 신차급 중고차 특가',
  'https://placehold.co/300x250/1B1B1B/FFFFFF?text=DMV+한인자동차%0A신차급+중고차+특가%0A301-555-0202',
  'https://example.com/dmv-koreauto',
  '2026-05-01', '2026-12-31', true, true, 12350, 245
);

-- PC 메인 사이드바 중간 (300x250)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_side_2'),
  (SELECT id FROM joongang_advertisers WHERE company_name = 'K-Beauty DC'),
  'K-Beauty DC - 한국 화장품 최대 50% 할인',
  'https://placehold.co/300x250/FF69B4/FFFFFF?text=K-Beauty+DC%0A한국+화장품%0A최대+50%25+할인',
  'https://example.com/kbeauty-dc',
  '2026-05-01', '2026-12-31', true, true, 9870, 412
);

-- PC 메인 중앙 배너 (728x90)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_mid'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '워싱턴 법률사무소'),
  '워싱턴 법률사무소 - 이민/비자 무료상담',
  'https://placehold.co/728x90/003366/FFFFFF?text=워싱턴+법률사무소+%7C+이민·비자+무료상담+202-555-0404',
  'https://example.com/dc-korealaw',
  '2026-05-01', '2026-12-31', true, true, 8540, 167
);

-- PC 메인 하단 배너 (728x90)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_bottom'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '한인 여행사 투어코리아'),
  '투어코리아 - 한국행 왕복 $899부터',
  'https://placehold.co/728x90/0066CC/FFFFFF?text=투어코리아+%7C+한국행+왕복+$899~+%7C+703-555-0606',
  'https://example.com/tour-korea',
  '2026-05-01', '2026-12-31', true, true, 11200, 523
);

-- PC 섹션 상단 (728x90)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_section_top'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '아리랑 식품'),
  '아리랑 식품 - Annandale 한국마트 주말특가',
  'https://placehold.co/728x90/228B22/FFFFFF?text=아리랑+식품+%7C+주말특가+신선식품+%7C+703-555-0303',
  'https://example.com/arirang-food',
  '2026-05-01', '2026-12-31', true, true, 6780, 198
);

-- PC 섹션 사이드바 상단 (300x250)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_section_side_1'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '한마음 부동산'),
  '한마음 부동산 - 이달의 추천매물',
  'https://placehold.co/300x250/E2231A/FFFFFF?text=한마음+부동산%0A이달의+추천매물%0AVienna+%7C+McLean+%7C+Fairfax',
  'https://example.com/hanmaum-monthly',
  '2026-05-01', '2026-12-31', true, true, 5430, 156
);

-- PC 기사 상단 (728x90)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_article_top'),
  (SELECT id FROM joongang_advertisers WHERE company_name = 'DMV 한인 자동차'),
  'DMV 한인자동차 - 봄맞이 차량 세일',
  'https://placehold.co/728x90/333333/FFFFFF?text=DMV+한인자동차+%7C+봄맞이+차량+세일+%7C+301-555-0202',
  'https://example.com/dmv-spring-sale',
  '2026-05-01', '2026-12-31', true, true, 7650, 210
);

-- PC 기사 중간 (468x60)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_article_mid'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '워싱턴 법률사무소'),
  '워싱턴 법률 - 비즈니스/부동산 법률 자문',
  'https://placehold.co/468x60/003366/FFFFFF?text=워싱턴+법률사무소+%7C+비즈니스·부동산+자문',
  'https://example.com/dc-law-biz',
  '2026-05-01', '2026-12-31', true, true, 4320, 89
);

-- PC 기사 하단 (728x90)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_article_bottom'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '한인 여행사 투어코리아'),
  '투어코리아 - 여름 패키지 얼리버드 특가',
  'https://placehold.co/728x90/0066CC/FFFFFF?text=투어코리아+%7C+여름+패키지+얼리버드+특가+%7C+예약접수중',
  'https://example.com/tour-summer',
  '2026-05-01', '2026-12-31', true, true, 6890, 301
);

-- 모바일 메인 상단 (320x100)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_main_top'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '아리랑 식품'),
  '아리랑 식품 모바일 - 배달 주문',
  'https://placehold.co/320x100/228B22/FFFFFF?text=아리랑식품+%7C+모바일+주문배달',
  'https://example.com/arirang-mobile',
  '2026-05-01', '2026-12-31', true, true, 18900, 876
);

-- 모바일 메인 중간 (320x250)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_main_mid'),
  (SELECT id FROM joongang_advertisers WHERE company_name = 'K-Beauty DC'),
  'K-Beauty DC 모바일 앱 다운로드',
  'https://placehold.co/320x250/FF69B4/FFFFFF?text=K-Beauty+DC%0A앱+다운로드%0A첫+주문+30%25+할인',
  'https://example.com/kbeauty-app',
  '2026-05-01', '2026-12-31', true, true, 14560, 634
);

-- 모바일 기사 상단 (320x100)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_article_top'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '한마음 부동산'),
  '한마음 부동산 - 모바일 매물검색',
  'https://placehold.co/320x100/E2231A/FFFFFF?text=한마음부동산+%7C+모바일+매물검색',
  'https://example.com/hanmaum-mobile',
  '2026-05-01', '2026-12-31', true, true, 16780, 723
);

-- 모바일 기사 하단 (320x250)
INSERT INTO joongang_ads (slot_id, advertiser_id, title, image_url, link_url, start_date, end_date, is_active, open_new_tab, impression_count, click_count) VALUES
(
  (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_article_bottom'),
  (SELECT id FROM joongang_advertisers WHERE company_name = '한인 여행사 투어코리아'),
  '투어코리아 - 모바일 예약 할인',
  'https://placehold.co/320x250/0066CC/FFFFFF?text=투어코리아%0A모바일+예약시%0A추가+5%25+할인',
  'https://example.com/tour-mobile',
  '2026-05-01', '2026-12-31', true, true, 13450, 589
);

-- 3. 광고 템플릿 샘플
INSERT INTO joongang_ad_templates (name, slot_size, html_template, variables, category, is_active) VALUES
(
  '기본 배너 (728x90)',
  '728x90',
  '<div style="width:728px;height:90px;background:{{bg_color}};display:flex;align-items:center;justify-content:center;border-radius:4px;">
  <img src="{{logo_url}}" style="height:60px;margin-right:20px;" alt="" />
  <div style="color:{{text_color}};text-align:left;">
    <div style="font-size:18px;font-weight:700;">{{headline}}</div>
    <div style="font-size:13px;margin-top:4px;">{{subtext}}</div>
  </div>
</div>',
  '[{"name":"bg_color","type":"color","label":"배경색","default_value":"#E2231A","required":true},{"name":"text_color","type":"color","label":"글자색","default_value":"#FFFFFF","required":true},{"name":"logo_url","type":"image","label":"로고 이미지","required":false},{"name":"headline","type":"text","label":"제목","placeholder":"광고 제목 입력","required":true,"max_length":30},{"name":"subtext","type":"text","label":"부제","placeholder":"부가 설명","required":false,"max_length":50}]',
  '배너',
  true
),
(
  '사이드바 카드 (300x250)',
  '300x250',
  '<div style="width:300px;height:250px;background:{{bg_color}};border-radius:8px;overflow:hidden;text-align:center;">
  <img src="{{main_image}}" style="width:100%;height:160px;object-fit:cover;" alt="" />
  <div style="padding:12px;color:{{text_color}};">
    <div style="font-size:16px;font-weight:700;">{{headline}}</div>
    <div style="font-size:12px;margin-top:4px;">{{phone}}</div>
  </div>
</div>',
  '[{"name":"bg_color","type":"color","label":"배경색","default_value":"#FFFFFF","required":true},{"name":"text_color","type":"color","label":"글자색","default_value":"#333333","required":true},{"name":"main_image","type":"image","label":"메인 이미지","required":true},{"name":"headline","type":"text","label":"제목","required":true,"max_length":20},{"name":"phone","type":"text","label":"전화번호","required":false}]',
  '카드',
  true
),
(
  '모바일 배너 (320x100)',
  '320x100',
  '<div style="width:320px;height:100px;background:{{bg_color}};display:flex;align-items:center;padding:0 16px;border-radius:4px;">
  <div style="color:{{text_color}};flex:1;">
    <div style="font-size:15px;font-weight:700;">{{headline}}</div>
    <div style="font-size:11px;margin-top:4px;">{{subtext}}</div>
  </div>
  <div style="background:{{btn_color}};color:#fff;padding:8px 16px;border-radius:20px;font-size:12px;font-weight:600;">{{btn_text}}</div>
</div>',
  '[{"name":"bg_color","type":"color","label":"배경색","default_value":"#1B1B1B","required":true},{"name":"text_color","type":"color","label":"글자색","default_value":"#FFFFFF","required":true},{"name":"headline","type":"text","label":"제목","required":true,"max_length":20},{"name":"subtext","type":"text","label":"부제","required":false,"max_length":30},{"name":"btn_color","type":"color","label":"버튼색","default_value":"#E2231A","required":true},{"name":"btn_text","type":"text","label":"버튼 텍스트","default_value":"자세히","required":true,"max_length":6}]',
  '모바일',
  true
);
