-- joongang_track_pageview RPC 함수
-- Supabase SQL Editor에서 수동 실행 필요

CREATE OR REPLACE FUNCTION joongang_track_pageview(
  p_device text DEFAULT 'desktop',
  p_referrer text DEFAULT ''
)
RETURNS void AS $$
DECLARE
  v_date date := CURRENT_DATE;
  v_hour integer := EXTRACT(HOUR FROM now());
BEGIN
  -- 동일 날짜/시간/디바이스/리퍼러 조합이 있으면 page_views +1, 없으면 INSERT
  INSERT INTO joongang_visitor_stats (stat_date, stat_hour, page_views, unique_visitors, device_type, referrer_domain)
  VALUES (v_date, v_hour, 1, 1, p_device, p_referrer)
  ON CONFLICT ON CONSTRAINT joongang_visitor_stats_unique
  DO UPDATE SET
    page_views = joongang_visitor_stats.page_views + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- upsert를 위한 unique constraint 추가
ALTER TABLE joongang_visitor_stats
  ADD CONSTRAINT joongang_visitor_stats_unique
  UNIQUE (stat_date, stat_hour, device_type, referrer_domain);

-- anon 사용자도 RPC 호출 가능하도록 권한 부여
GRANT EXECUTE ON FUNCTION joongang_track_pageview(text, text) TO anon;
GRANT EXECUTE ON FUNCTION joongang_track_pageview(text, text) TO authenticated;

-- visitor_stats 테이블에 대한 INSERT/UPDATE 권한 (SECURITY DEFINER이므로 함수 소유자 권한으로 실행)
-- RLS가 활성화된 경우 정책 추가
ALTER TABLE joongang_visitor_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on visitor_stats"
  ON joongang_visitor_stats FOR SELECT
  USING (true);

CREATE POLICY "Allow RPC insert on visitor_stats"
  ON joongang_visitor_stats FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow RPC update on visitor_stats"
  ON joongang_visitor_stats FOR UPDATE
  USING (true);
