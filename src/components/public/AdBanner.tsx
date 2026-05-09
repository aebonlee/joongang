import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Ad } from '@/types';
import './AdBanner.css';

interface AdBannerProps {
  slotCode: string;
  className?: string;
}

export function AdBanner({ slotCode, className = '' }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetchAd();
  }, [slotCode]);

  async function fetchAd() {
    const now = new Date().toISOString();

    const { data: slot } = await supabase
      .from('joongang_ad_slots')
      .select('id')
      .eq('slot_code', slotCode)
      .eq('is_active', true)
      .single();

    if (!slot) return;

    const { data } = await supabase
      .from('joongang_ads')
      .select('*')
      .eq('slot_id', slot.id)
      .eq('is_active', true)
      .lte('start_date', now)
      .gte('end_date', now)
      .order('group_order')
      .limit(1);

    if (data && data.length > 0) {
      setAd(data[0]);
      supabase.rpc('joongang_increment_impression', { p_ad_id: data[0].id }).then(() => {});
    }
  }

  function handleClick() {
    if (!ad) return;
    supabase.rpc('joongang_increment_click', { p_ad_id: ad.id }).then(() => {});
    const url = ad.link_url || '#';
    if (url !== '#') {
      if (ad.open_new_tab) {
        window.open(url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = url;
      }
    }
  }

  if (!ad) return null;
  if (!ad.image_url && !ad.html_content) return null;

  // HTML 광고
  if (ad.html_content) {
    return (
      <div
        className={`ad-banner ${className}`}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: ad.html_content }}
      />
    );
  }

  // 이미지 광고
  return (
    <div className={`ad-banner ${className}`}>
      <a
        href={ad.link_url || '#'}
        target={ad.open_new_tab ? '_blank' : '_self'}
        rel="noopener noreferrer"
        onClick={() => {
          if (ad) supabase.rpc('joongang_increment_click', { p_ad_id: ad.id }).then(() => {});
        }}
      >
        <img src={ad.image_url!} alt={ad.title} className="ad-banner-img" />
      </a>
    </div>
  );
}
