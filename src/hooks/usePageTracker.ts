import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

function getDeviceType(): string {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop';
}

function getReferrerDomain(): string {
  try {
    if (!document.referrer) return '';
    const url = new URL(document.referrer);
    // 자사 도메인이면 빈 문자열
    if (url.hostname === window.location.hostname) return '';
    return url.hostname;
  } catch {
    return '';
  }
}

export function usePageTracker() {
  const location = useLocation();
  const lastPath = useRef('');

  useEffect(() => {
    // 같은 경로 중복 호출 방지
    if (location.pathname === lastPath.current) return;
    lastPath.current = location.pathname;

    const device = getDeviceType();
    const referrer = getReferrerDomain();

    supabase.rpc('joongang_track_pageview', {
      p_device: device,
      p_referrer: referrer,
    }).then(({ error }) => {
      if (error) console.warn('pageview tracking failed:', error.message);
    });
  }, [location.pathname]);
}
