-- ============================================
-- Joongang News Platform - Supabase Schema
-- 모든 테이블에 joongang_ 접두사 사용
-- ============================================

-- 1. 섹션 (카테고리)
CREATE TABLE joongang_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_code integer UNIQUE NOT NULL,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  parent_id uuid REFERENCES joongang_sections(id) ON DELETE SET NULL,
  depth integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  icon text,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_joongang_sections_parent ON joongang_sections(parent_id);
CREATE INDEX idx_joongang_sections_slug ON joongang_sections(slug);

-- 2. 스태프 (관리자/편집자/기자)
CREATE TABLE joongang_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  role text NOT NULL CHECK (role IN ('superadmin', 'editor', 'reporter')),
  department text,
  position text,
  bio text,
  avatar_url text,
  byline text,
  is_active boolean DEFAULT true,
  permissions jsonb DEFAULT '{}',
  last_login_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_joongang_staff_user_id ON joongang_staff(user_id);

-- 3. 기사
CREATE TABLE joongang_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_number serial,
  title text NOT NULL,
  subtitle text,
  slug text UNIQUE NOT NULL,
  content text NOT NULL DEFAULT '',
  excerpt text,
  thumbnail_url text,
  thumbnail_caption text,
  use_watermark boolean DEFAULT true,
  article_type text DEFAULT 'normal' CHECK (article_type IN ('normal', 'photo', 'video')),
  video_url text,
  source_name text,
  source_url text,
  author_id uuid REFERENCES joongang_staff(id) ON DELETE SET NULL,
  author_name text,
  author_email text,
  editor_id uuid REFERENCES joongang_staff(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'published', 'scheduled', 'archived')),
  is_published boolean DEFAULT false,
  published_at timestamptz,
  scheduled_at timestamptz,
  view_count integer DEFAULT 0,
  allow_comments boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_joongang_articles_status ON joongang_articles(status);
CREATE INDEX idx_joongang_articles_published ON joongang_articles(is_published, published_at DESC);
CREATE INDEX idx_joongang_articles_slug ON joongang_articles(slug);
CREATE INDEX idx_joongang_articles_type ON joongang_articles(article_type);
CREATE INDEX idx_joongang_articles_author ON joongang_articles(author_id);

-- 4. 기사-섹션 매핑 (M:N)
CREATE TABLE joongang_article_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES joongang_articles(id) ON DELETE CASCADE,
  section_id uuid NOT NULL REFERENCES joongang_sections(id) ON DELETE CASCADE,
  is_primary boolean DEFAULT false,
  sort_order integer DEFAULT 0
);

CREATE INDEX idx_joongang_article_sections_article ON joongang_article_sections(article_id);
CREATE INDEX idx_joongang_article_sections_section ON joongang_article_sections(section_id);

-- 5. 출력위치 매핑
CREATE TABLE joongang_article_positions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES joongang_articles(id) ON DELETE CASCADE,
  position_type text NOT NULL,
  priority integer DEFAULT 0,
  assigned_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

CREATE INDEX idx_joongang_article_positions_article ON joongang_article_positions(article_id);
CREATE INDEX idx_joongang_article_positions_type ON joongang_article_positions(position_type);

-- 6. 첨부파일
CREATE TABLE joongang_article_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES joongang_articles(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  file_name text NOT NULL,
  file_size bigint,
  mime_type text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 7. 키워드
CREATE TABLE joongang_article_keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES joongang_articles(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(article_id, keyword)
);

CREATE INDEX idx_joongang_keywords_keyword ON joongang_article_keywords(keyword);

-- 8. 관련기사
CREATE TABLE joongang_related_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES joongang_articles(id) ON DELETE CASCADE,
  related_article_id uuid NOT NULL REFERENCES joongang_articles(id) ON DELETE CASCADE,
  sort_order integer DEFAULT 0
);

-- 9. 댓글
CREATE TABLE joongang_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid NOT NULL REFERENCES joongang_articles(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name text,
  content text NOT NULL,
  parent_id uuid REFERENCES joongang_comments(id) ON DELETE CASCADE,
  is_hidden boolean DEFAULT false,
  ip_address inet,
  likes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_joongang_comments_article ON joongang_comments(article_id);

-- 10. 광고 슬롯
CREATE TABLE joongang_ad_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  page_type text NOT NULL CHECK (page_type IN ('main', 'section', 'article', 'other')),
  device_type text NOT NULL CHECK (device_type IN ('pc', 'mobile', 'both')),
  width integer NOT NULL,
  height integer NOT NULL,
  max_ads integer DEFAULT 1,
  display_mode text DEFAULT 'rotation' CHECK (display_mode IN ('rotation', 'sequential', 'random')),
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 11. 광고주
CREATE TABLE joongang_advertisers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text,
  contact_email text,
  contact_phone text,
  memo text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 12. 광고 템플릿
CREATE TABLE joongang_ad_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slot_size text NOT NULL,
  thumbnail_url text,
  html_template text NOT NULL,
  variables jsonb NOT NULL DEFAULT '[]',
  category text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 13. 광고
CREATE TABLE joongang_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id uuid NOT NULL REFERENCES joongang_ad_slots(id) ON DELETE CASCADE,
  advertiser_id uuid REFERENCES joongang_advertisers(id) ON DELETE SET NULL,
  title text NOT NULL,
  image_url text,
  link_url text,
  html_content text,
  template_id uuid REFERENCES joongang_ad_templates(id) ON DELETE SET NULL,
  template_data jsonb,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  open_new_tab boolean DEFAULT true,
  group_order integer DEFAULT 0,
  impression_count bigint DEFAULT 0,
  click_count bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_joongang_ads_slot ON joongang_ads(slot_id);
CREATE INDEX idx_joongang_ads_active ON joongang_ads(is_active, start_date, end_date);

-- 14. 광고 통계
CREATE TABLE joongang_ad_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ad_id uuid NOT NULL REFERENCES joongang_ads(id) ON DELETE CASCADE,
  stat_date date NOT NULL,
  stat_hour integer,
  impressions integer DEFAULT 0,
  clicks integer DEFAULT 0,
  unique_impressions integer DEFAULT 0,
  unique_clicks integer DEFAULT 0,
  UNIQUE(ad_id, stat_date, stat_hour)
);

-- 15. 게시판
CREATE TABLE joongang_boards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  board_type text DEFAULT 'list' CHECK (board_type IN ('list', 'gallery')),
  allow_anonymous boolean DEFAULT false,
  allow_comments boolean DEFAULT true,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0
);

-- 16. 게시판 글
CREATE TABLE joongang_board_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL REFERENCES joongang_boards(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name text,
  title text NOT NULL,
  content text NOT NULL,
  thumbnail_url text,
  attachment_urls text[],
  view_count integer DEFAULT 0,
  is_notice boolean DEFAULT false,
  is_hidden boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 17. 뉴스레터 구독자
CREATE TABLE joongang_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  is_active boolean DEFAULT true,
  subscribed_at timestamptz DEFAULT now(),
  unsubscribed_at timestamptz
);

-- 18. 기사 제보
CREATE TABLE joongang_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_name text,
  reporter_email text,
  reporter_phone text,
  title text NOT NULL,
  content text NOT NULL,
  attachment_urls text[],
  status text DEFAULT 'received' CHECK (status IN ('received', 'reviewing', 'adopted', 'rejected')),
  assigned_to uuid REFERENCES joongang_staff(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- 19. 팝업
CREATE TABLE joongang_popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content_html text NOT NULL,
  image_url text,
  link_url text,
  position_x integer DEFAULT 100,
  position_y integer DEFAULT 100,
  width integer DEFAULT 500,
  height integer DEFAULT 400,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  is_active boolean DEFAULT true,
  show_close_today boolean DEFAULT true,
  device_type text DEFAULT 'both' CHECK (device_type IN ('pc', 'mobile', 'both')),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 20. 사이트 설정
CREATE TABLE joongang_site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_group text NOT NULL,
  setting_key text NOT NULL,
  setting_value jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(setting_group, setting_key)
);

-- 21. 레이아웃 설정
CREATE TABLE joongang_layout_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text UNIQUE NOT NULL,
  layout_config jsonb NOT NULL DEFAULT '{}',
  header_style text DEFAULT 'style_b',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES joongang_staff(id) ON DELETE SET NULL
);

-- 22. 디자인 설정
CREATE TABLE joongang_design_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- 23. 방문자 통계
CREATE TABLE joongang_visitor_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stat_date date NOT NULL,
  stat_hour integer,
  page_views integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  device_type text,
  referrer_domain text
);

-- 24. 메뉴 설정
CREATE TABLE joongang_menu_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_type text NOT NULL CHECK (menu_type IN ('header', 'footer', 'mobile')),
  menu_items jsonb NOT NULL DEFAULT '[]',
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- RLS (Row Level Security) Policies
-- ============================================

-- Enable RLS
ALTER TABLE joongang_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE joongang_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE joongang_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE joongang_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE joongang_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE joongang_ad_slots ENABLE ROW LEVEL SECURITY;

-- Public read for published articles
CREATE POLICY "Published articles are viewable by everyone"
  ON joongang_articles FOR SELECT
  USING (is_published = true AND status = 'published');

-- Staff can see all articles
CREATE POLICY "Staff can manage articles"
  ON joongang_articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM joongang_staff
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Sections public read
CREATE POLICY "Sections are viewable by everyone"
  ON joongang_sections FOR SELECT
  USING (is_active = true);

-- Staff can manage sections
CREATE POLICY "Staff can manage sections"
  ON joongang_sections FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM joongang_staff
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- Staff profile visible to authenticated
CREATE POLICY "Staff profiles viewable by self"
  ON joongang_staff FOR SELECT
  USING (user_id = auth.uid());

-- Admin can manage staff
CREATE POLICY "Admin can manage staff"
  ON joongang_staff FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM joongang_staff
      WHERE user_id = auth.uid() AND role = 'superadmin'
    )
  );

-- Comments readable by all
CREATE POLICY "Comments are viewable by everyone"
  ON joongang_comments FOR SELECT
  USING (is_hidden = false);

-- Users can insert comments
CREATE POLICY "Authenticated users can comment"
  ON joongang_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Active ads readable by all
CREATE POLICY "Active ads are viewable"
  ON joongang_ads FOR SELECT
  USING (is_active = true AND start_date <= now() AND end_date >= now());

-- Ad slots readable by all
CREATE POLICY "Ad slots are viewable"
  ON joongang_ad_slots FOR SELECT
  USING (is_active = true);

-- ============================================
-- Functions
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION joongang_update_timestamp()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER joongang_articles_updated
  BEFORE UPDATE ON joongang_articles
  FOR EACH ROW EXECUTE FUNCTION joongang_update_timestamp();

CREATE TRIGGER joongang_ads_updated
  BEFORE UPDATE ON joongang_ads
  FOR EACH ROW EXECUTE FUNCTION joongang_update_timestamp();

-- Increment impression
CREATE OR REPLACE FUNCTION joongang_increment_impression(p_ad_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE joongang_ads SET impression_count = impression_count + 1 WHERE id = p_ad_id;
  INSERT INTO joongang_ad_stats (ad_id, stat_date, stat_hour, impressions)
  VALUES (p_ad_id, CURRENT_DATE, EXTRACT(HOUR FROM now())::integer, 1)
  ON CONFLICT (ad_id, stat_date, stat_hour)
  DO UPDATE SET impressions = joongang_ad_stats.impressions + 1;
END;
$$ LANGUAGE plpgsql;

-- Increment click
CREATE OR REPLACE FUNCTION joongang_increment_click(p_ad_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE joongang_ads SET click_count = click_count + 1 WHERE id = p_ad_id;
  INSERT INTO joongang_ad_stats (ad_id, stat_date, stat_hour, clicks)
  VALUES (p_ad_id, CURRENT_DATE, EXTRACT(HOUR FROM now())::integer, 1)
  ON CONFLICT (ad_id, stat_date, stat_hour)
  DO UPDATE SET clicks = joongang_ad_stats.clicks + 1;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Seed Data: Default Sections
-- ============================================
INSERT INTO joongang_sections (section_code, name, slug, sort_order) VALUES
  (10, '정치', 'politics', 1),
  (20, '경제', 'economy', 2),
  (30, '사회', 'society', 3),
  (40, '문화', 'culture', 4),
  (50, '스포츠', 'sports', 5),
  (60, '연예', 'entertainment', 6),
  (70, 'IT/과학', 'tech', 7),
  (80, '국제', 'world', 8),
  (90, '오피니언', 'opinion', 9);

-- Default ad slots (PC Main)
INSERT INTO joongang_ad_slots (slot_code, name, page_type, device_type, width, height, sort_order) VALUES
  ('pc_main_top', 'PC 메인 상단 배너', 'main', 'pc', 728, 90, 1),
  ('pc_main_side_1', 'PC 메인 사이드바 상단', 'main', 'pc', 300, 250, 2),
  ('pc_main_side_2', 'PC 메인 사이드바 중간', 'main', 'pc', 300, 250, 3),
  ('pc_main_mid', 'PC 메인 중앙 배너', 'main', 'pc', 728, 90, 4),
  ('pc_main_bottom', 'PC 메인 하단 배너', 'main', 'pc', 728, 90, 5),
  ('pc_section_top', 'PC 섹션 상단', 'section', 'pc', 728, 90, 10),
  ('pc_section_side_1', 'PC 섹션 사이드바 상단', 'section', 'pc', 300, 250, 11),
  ('pc_article_top', 'PC 기사 상단', 'article', 'pc', 728, 90, 20),
  ('pc_article_mid', 'PC 기사 중간', 'article', 'pc', 468, 60, 21),
  ('pc_article_bottom', 'PC 기사 하단', 'article', 'pc', 728, 90, 22),
  ('mobile_main_top', '모바일 메인 상단', 'main', 'mobile', 320, 100, 30),
  ('mobile_main_mid', '모바일 메인 중간', 'main', 'mobile', 320, 250, 31),
  ('mobile_article_top', '모바일 기사 상단', 'article', 'mobile', 320, 100, 40),
  ('mobile_article_bottom', '모바일 기사 하단', 'article', 'mobile', 320, 250, 41);

-- Default layout settings
INSERT INTO joongang_layout_settings (page_type, layout_config, header_style) VALUES
  ('main', '{"zones":[{"zone_id":"headline","layout_type":"hero_single","article_count":1},{"zone_id":"top_news","layout_type":"grid_2x2","article_count":4},{"zone_id":"latest","layout_type":"list","article_count":10}]}', 'style_b'),
  ('section', '{"layout_type":"list","articles_per_page":20,"show_sidebar":true}', 'style_b'),
  ('article', '{"show_byline":true,"show_share_buttons":true,"show_related_articles":true,"related_count":5}', 'style_b');

-- Default boards
INSERT INTO joongang_boards (board_code, name, sort_order) VALUES
  ('notice', '공지사항', 1),
  ('free', '자유게시판', 2),
  ('photo', '포토게시판', 3);

-- Default menu
INSERT INTO joongang_menu_settings (menu_type, menu_items) VALUES
  ('header', '[{"id":"1","label":"정치","path":"/section/politics"},{"id":"2","label":"경제","path":"/section/economy"},{"id":"3","label":"사회","path":"/section/society"},{"id":"4","label":"문화","path":"/section/culture"},{"id":"5","label":"스포츠","path":"/section/sports"},{"id":"6","label":"연예","path":"/section/entertainment"},{"id":"7","label":"IT/과학","path":"/section/tech"},{"id":"8","label":"국제","path":"/section/world"}]'),
  ('footer', '[{"id":"1","label":"회사소개","path":"/about"},{"id":"2","label":"개인정보처리방침","path":"/privacy"},{"id":"3","label":"이용약관","path":"/terms"}]');
