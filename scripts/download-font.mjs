import fs from 'fs';
import path from 'path';

const fontDir = path.join(import.meta.dirname, 'fonts');
if (!fs.existsSync(fontDir)) fs.mkdirSync(fontDir, { recursive: true });

// Noto Sans KR Regular from Google Fonts GitHub
const urls = [
  ['NotoSansKR-Regular.ttf', 'https://fonts.gstatic.com/s/notosanskr/v39/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzuoyeLQ.ttf'],
  ['NotoSansKR-Bold.ttf', 'https://fonts.gstatic.com/s/notosanskr/v39/PbyxFmXiEBPT4ITbgNA5Cgms3VYcOA-vvnIzzg01eLQ.ttf'],
];

for (const [filename, url] of urls) {
  const dest = path.join(fontDir, filename);
  console.log(`Downloading ${filename}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(`  OK (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    console.log(`  FAILED: ${e.message}`);
  }
}
