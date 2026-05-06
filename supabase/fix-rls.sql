-- RLS 정책 확인 및 수정
-- 문제: anon 유저가 published 기사/섹션을 읽지 못하는 상태

-- 기존 정책 삭제 후 재생성
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON joongang_articles;
DROP POLICY IF EXISTS "Staff can manage articles" ON joongang_articles;
DROP POLICY IF EXISTS "Sections are viewable by everyone" ON joongang_sections;
DROP POLICY IF EXISTS "Staff can manage sections" ON joongang_sections;
DROP POLICY IF EXISTS "Staff profiles viewable by self" ON joongang_staff;
DROP POLICY IF EXISTS "Admin can manage staff" ON joongang_staff;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON joongang_comments;
DROP POLICY IF EXISTS "Authenticated users can comment" ON joongang_comments;
DROP POLICY IF EXISTS "Active ads are viewable" ON joongang_ads;
DROP POLICY IF EXISTS "Ad slots are viewable" ON joongang_ad_slots;

-- 기사: 누구나 published 기사 읽기 가능
CREATE POLICY "Anyone can read published articles"
  ON joongang_articles FOR SELECT TO anon, authenticated
  USING (is_published = true AND status = 'published');

-- 기사: 스태프는 모든 기사 관리 가능
CREATE POLICY "Staff can manage all articles"
  ON joongang_articles FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM joongang_staff WHERE user_id = auth.uid() AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM joongang_staff WHERE user_id = auth.uid() AND is_active = true)
  );

-- 섹션: 누구나 활성 섹션 읽기 가능
CREATE POLICY "Anyone can read active sections"
  ON joongang_sections FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- 섹션: 스태프 관리
CREATE POLICY "Staff can manage sections"
  ON joongang_sections FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM joongang_staff WHERE user_id = auth.uid() AND is_active = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM joongang_staff WHERE user_id = auth.uid() AND is_active = true)
  );

-- 스태프: 본인 프로필 조회
CREATE POLICY "Staff can view own profile"
  ON joongang_staff FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 스태프: 관리자 관리
CREATE POLICY "Admin can manage staff"
  ON joongang_staff FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM joongang_staff WHERE user_id = auth.uid() AND role = 'superadmin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM joongang_staff WHERE user_id = auth.uid() AND role = 'superadmin')
  );

-- 댓글: 누구나 읽기
CREATE POLICY "Anyone can read comments"
  ON joongang_comments FOR SELECT TO anon, authenticated
  USING (is_hidden = false);

-- 댓글: 로그인 사용자 작성
CREATE POLICY "Authenticated users can comment"
  ON joongang_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- 광고: 누구나 활성 광고 읽기
CREATE POLICY "Anyone can read active ads"
  ON joongang_ads FOR SELECT TO anon, authenticated
  USING (is_active = true AND start_date <= now() AND end_date >= now());

-- 광고 슬롯: 누구나 읽기
CREATE POLICY "Anyone can read ad slots"
  ON joongang_ad_slots FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- article_sections, article_positions에도 RLS 설정
ALTER TABLE joongang_article_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read article sections"
  ON joongang_article_sections FOR SELECT TO anon, authenticated
  USING (true);

ALTER TABLE joongang_article_positions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read article positions"
  ON joongang_article_positions FOR SELECT TO anon, authenticated
  USING (true);

ALTER TABLE joongang_article_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read keywords"
  ON joongang_article_keywords FOR SELECT TO anon, authenticated
  USING (true);

ALTER TABLE joongang_menu_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read menu settings"
  ON joongang_menu_settings FOR SELECT TO anon, authenticated
  USING (true);
