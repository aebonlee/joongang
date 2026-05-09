import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hcmgdztsgjvzcyxyayaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWdkenRzZ2p2emN5eHlheWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU4ODcsImV4cCI6MjA4NzAxMTg4N30.gznaPzY1l8qDAPsEyYNR9KS7f7VqS3xaw-_2HTSwSZw'
);

// 키워드별 맞춤 이미지
const imageMap = [
  ['CKA', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=450&fit=crop'],
  ['건강보험', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=450&fit=crop'],
  ['H-1B', 'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=800&h=450&fit=crop'],
  ['말하기 대회', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=450&fit=crop'],
  ['한국어 수업', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=450&fit=crop'],
  ['애난데일', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=450&fit=crop'],
  ['상속세', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop'],
];

const defaultImage = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&h=450&fit=crop';

async function fix() {
  const { data, error } = await supabase
    .from('joongang_articles')
    .select('id, title')
    .is('thumbnail_url', null)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Fetch error:', error.message);
    return;
  }

  if (!data || data.length === 0) {
    console.log('No articles to fix');
    return;
  }

  console.log(`Found ${data.length} articles without thumbnails\n`);

  let updated = 0;
  for (const article of data) {
    let imageUrl = defaultImage;
    for (const [keyword, url] of imageMap) {
      if (article.title.includes(keyword)) {
        imageUrl = url;
        break;
      }
    }

    const { error: updateErr } = await supabase
      .from('joongang_articles')
      .update({ thumbnail_url: imageUrl })
      .eq('id', article.id);

    if (updateErr) {
      console.log(`[ERROR] ${article.title.substring(0, 45)} → ${updateErr.message}`);
    } else {
      console.log(`[OK] ${article.title.substring(0, 45)}`);
      updated++;
    }
  }
  console.log(`\nUpdated: ${updated}/${data.length}`);
}

fix();
