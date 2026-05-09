import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://hcmgdztsgjvzcyxyayaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWdkenRzZ2p2emN5eHlheWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU4ODcsImV4cCI6MjA4NzAxMTg4N30.gznaPzY1l8qDAPsEyYNR9KS7f7VqS3xaw-_2HTSwSZw'
);

// 키워드별 대체 이미지 (검증된 URL)
const replacements = [
  ['정체성', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&h=450&fit=crop'],
  ['건강', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=450&fit=crop'],
  ['비자', 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&h=450&fit=crop'],
  ['교육', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&h=450&fit=crop'],
  ['경제', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop'],
  ['한인', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=450&fit=crop'],
];

const defaultImage = 'https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&h=450&fit=crop';

async function main() {
  const { data: articles } = await supabase
    .from('joongang_articles')
    .select('id, title, thumbnail_url')
    .eq('status', 'published')
    .not('thumbnail_url', 'is', null);

  if (!articles) return;

  console.log(`Checking ${articles.length} articles for broken images...\n`);

  let brokenCount = 0;
  let fixedCount = 0;

  for (const article of articles) {
    try {
      const res = await fetch(article.thumbnail_url, { method: 'HEAD' });
      if (res.status >= 400) {
        brokenCount++;
        console.log(`[BROKEN ${res.status}] ${article.title.substring(0, 50)}`);
        console.log(`  URL: ${article.thumbnail_url}`);

        // 대체 이미지 찾기
        let newUrl = defaultImage;
        for (const [keyword, url] of replacements) {
          if (article.title.includes(keyword)) {
            newUrl = url;
            break;
          }
        }

        const { error } = await supabase
          .from('joongang_articles')
          .update({ thumbnail_url: newUrl })
          .eq('id', article.id);

        if (!error) {
          console.log(`  -> Fixed: ${newUrl.substring(0, 60)}...`);
          fixedCount++;
        } else {
          console.log(`  -> Fix failed: ${error.message}`);
        }
      }
    } catch (err) {
      console.log(`[ERROR] ${article.title.substring(0, 50)}: ${err.message}`);
    }
  }

  console.log(`\nTotal: ${articles.length} checked, ${brokenCount} broken, ${fixedCount} fixed`);
}

main();
