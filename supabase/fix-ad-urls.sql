-- ============================================
-- 광고 이미지 URL (한글→영문) + 링크 URL 수정
-- 기존 DB에 삽입된 데이터 업데이트용
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- pc_main_top
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/728x90/E2231A/FFFFFF?text=Hanmaum+Realty+|+VA/MD+703-555-0101',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_top');

-- pc_main_side_1
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/300x250/1B1B1B/FFFFFF?text=DMV+Korea+Auto%0APre-Owned+Cars%0A301-555-0202',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_side_1');

-- pc_main_side_2
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/300x250/FF69B4/FFFFFF?text=K-Beauty+DC%0AKorean+Cosmetics%0AUp+to+50%25+OFF',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_side_2');

-- pc_main_mid
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/728x90/003366/FFFFFF?text=DC+Korea+Law+|+Immigration+Consultation+202-555-0404',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_mid');

-- pc_main_bottom
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/728x90/0066CC/FFFFFF?text=Tour+Korea+|+Round+Trip+from+$899+|+703-555-0606',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_bottom');

-- pc_section_top
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/728x90/228B22/FFFFFF?text=Arirang+Food+|+Weekend+Sale+|+703-555-0303',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_section_top');

-- pc_section_side_1
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/300x250/E2231A/FFFFFF?text=Hanmaum+Realty%0AMonthly+Picks%0AVienna+|+McLean+|+Fairfax',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_section_side_1');

-- pc_article_top
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/728x90/333333/FFFFFF?text=DMV+Korea+Auto+|+Spring+Sale+|+301-555-0202',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_article_top');

-- pc_article_mid
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/468x60/003366/FFFFFF?text=DC+Korea+Law+|+Business+Consulting',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_article_mid');

-- pc_article_bottom
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/728x90/0066CC/FFFFFF?text=Tour+Korea+|+Summer+Package+Early+Bird+Special',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_article_bottom');

-- mobile_main_top
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/320x100/228B22/FFFFFF?text=Arirang+Food+|+Mobile+Order',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_main_top');

-- mobile_main_mid
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/320x250/FF69B4/FFFFFF?text=K-Beauty+DC%0ADownload+App%0A30%25+OFF+First+Order',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_main_mid');

-- mobile_article_top
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/320x100/E2231A/FFFFFF?text=Hanmaum+Realty+|+Mobile+Search',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_article_top');

-- mobile_article_bottom
UPDATE joongang_ads SET
  image_url = 'https://placehold.co/320x250/0066CC/FFFFFF?text=Tour+Korea%0AMobile+Booking%0AExtra+5%25+OFF',
  link_url = 'https://joongang.dreamitbiz.com/'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_article_bottom');
