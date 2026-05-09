-- ============================================
-- 광고 이미지 → HTML 전환 (텍스트 중앙정렬 보장)
-- placehold.co 이미지의 텍스트 정렬 문제 해결
-- Supabase SQL Editor에서 실행하세요
-- ============================================

-- pc_main_top (728x90, 빨강)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:728px;max-width:100%;height:90px;background:#E2231A;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:18px;font-weight:700;font-family:sans-serif;text-align:center;margin:0 auto">Hanmaum Realty | VA/MD 703-555-0101</div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_top');

-- pc_main_side_1 (300x250, 검정)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:300px;max-width:100%;height:250px;background:#1B1B1B;color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;border-radius:4px;font-family:sans-serif;text-align:center;margin:0 auto"><div style="font-size:20px;font-weight:700">DMV Korea Auto</div><div style="font-size:15px">Pre-Owned Cars</div><div style="font-size:14px;opacity:0.8">301-555-0202</div></div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_side_1');

-- pc_main_side_2 (300x250, 핑크)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:300px;max-width:100%;height:250px;background:#FF69B4;color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;border-radius:4px;font-family:sans-serif;text-align:center;margin:0 auto"><div style="font-size:20px;font-weight:700">K-Beauty DC</div><div style="font-size:15px">Korean Cosmetics</div><div style="font-size:14px;opacity:0.8">Up to 50% OFF</div></div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_side_2');

-- pc_main_mid (728x90, 남색)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:728px;max-width:100%;height:90px;background:#003366;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:18px;font-weight:700;font-family:sans-serif;text-align:center;margin:0 auto">DC Korea Law | Immigration Consultation 202-555-0404</div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_mid');

-- pc_main_bottom (728x90, 파랑)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:728px;max-width:100%;height:90px;background:#0066CC;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:18px;font-weight:700;font-family:sans-serif;text-align:center;margin:0 auto">Tour Korea | Round Trip from $899 | 703-555-0606</div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_main_bottom');

-- pc_section_top (728x90, 녹색)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:728px;max-width:100%;height:90px;background:#228B22;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:18px;font-weight:700;font-family:sans-serif;text-align:center;margin:0 auto">Arirang Food | Weekend Sale | 703-555-0303</div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_section_top');

-- pc_section_side_1 (300x250, 빨강)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:300px;max-width:100%;height:250px;background:#E2231A;color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;border-radius:4px;font-family:sans-serif;text-align:center;margin:0 auto"><div style="font-size:20px;font-weight:700">Hanmaum Realty</div><div style="font-size:15px">Monthly Picks</div><div style="font-size:14px;opacity:0.8">Vienna | McLean | Fairfax</div></div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_section_side_1');

-- pc_article_top (728x90, 회색)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:728px;max-width:100%;height:90px;background:#333333;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:18px;font-weight:700;font-family:sans-serif;text-align:center;margin:0 auto">DMV Korea Auto | Spring Sale | 301-555-0202</div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_article_top');

-- pc_article_mid (468x60, 남색)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:468px;max-width:100%;height:60px;background:#003366;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:16px;font-weight:700;font-family:sans-serif;text-align:center;margin:0 auto">DC Korea Law | Business Consulting</div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_article_mid');

-- pc_article_bottom (728x90, 파랑)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:728px;max-width:100%;height:90px;background:#0066CC;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:18px;font-weight:700;font-family:sans-serif;text-align:center;margin:0 auto">Tour Korea | Summer Package Early Bird Special</div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'pc_article_bottom');

-- mobile_main_top (320x100, 녹색)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:320px;max-width:100%;height:100px;background:#228B22;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:16px;font-weight:700;font-family:sans-serif;text-align:center;margin:0 auto">Arirang Food | Mobile Order</div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_main_top');

-- mobile_main_mid (320x250, 핑크)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:320px;max-width:100%;height:250px;background:#FF69B4;color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;border-radius:4px;font-family:sans-serif;text-align:center;margin:0 auto"><div style="font-size:18px;font-weight:700">K-Beauty DC</div><div style="font-size:14px">Download App</div><div style="font-size:14px;opacity:0.8">30% OFF First Order</div></div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_main_mid');

-- mobile_article_top (320x100, 빨강)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:320px;max-width:100%;height:100px;background:#E2231A;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px;font-size:16px;font-weight:700;font-family:sans-serif;text-align:center;margin:0 auto">Hanmaum Realty | Mobile Search</div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_article_top');

-- mobile_article_bottom (320x250, 파랑)
UPDATE joongang_ads SET
  image_url = NULL,
  html_content = '<div style="width:320px;max-width:100%;height:250px;background:#0066CC;color:#fff;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;border-radius:4px;font-family:sans-serif;text-align:center;margin:0 auto"><div style="font-size:18px;font-weight:700">Tour Korea</div><div style="font-size:14px">Mobile Booking</div><div style="font-size:14px;opacity:0.8">Extra 5% OFF</div></div>'
WHERE slot_id = (SELECT id FROM joongang_ad_slots WHERE slot_code = 'mobile_article_bottom');
