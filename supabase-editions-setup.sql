-- =============================================
-- joongang_editions 테이블 생성
-- Supabase SQL Editor에서 실행
-- =============================================

-- 1. 테이블 생성
CREATE TABLE IF NOT EXISTS joongang_editions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  edition_date DATE NOT NULL,
  edition_code TEXT NOT NULL,        -- AA, AE, AW, BT, AY, AL, G, B
  edition_label TEXT NOT NULL,       -- "LA판", "워싱턴판" 등
  page_number INT NOT NULL,
  pdf_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 인덱스
CREATE INDEX IF NOT EXISTS idx_editions_date ON joongang_editions(edition_date DESC);
CREATE INDEX IF NOT EXISTS idx_editions_date_code ON joongang_editions(edition_date, edition_code);

-- 3. RLS 활성화
ALTER TABLE joongang_editions ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책: 누구나 읽기 가능
CREATE POLICY "joongang_editions_select_public"
  ON joongang_editions FOR SELECT
  USING (true);

-- 5. RLS 정책: 인증된 사용자만 INSERT/UPDATE/DELETE
CREATE POLICY "joongang_editions_insert_auth"
  ON joongang_editions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "joongang_editions_update_auth"
  ON joongang_editions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "joongang_editions_delete_auth"
  ON joongang_editions FOR DELETE
  TO authenticated
  USING (true);

-- =============================================
-- Storage 버킷 생성 (Supabase Dashboard에서 수동 생성 권장)
-- Dashboard > Storage > New Bucket
-- Name: joongang-editions
-- Public: ON
-- File size limit: 50MB
-- Allowed MIME types: application/pdf
-- =============================================

-- Storage RLS (버킷 생성 후 실행)
-- INSERT joongang-editions.objects (인증된 사용자만 업로드)
CREATE POLICY "editions_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'joongang-editions');

-- SELECT joongang-editions.objects (공개 읽기)
CREATE POLICY "editions_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'joongang-editions');

-- DELETE joongang-editions.objects (인증된 사용자만 삭제)
CREATE POLICY "editions_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'joongang-editions');
