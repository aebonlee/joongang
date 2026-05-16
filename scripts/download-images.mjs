import fs from 'fs';
import path from 'path';

const imgDir = path.join(import.meta.dirname, 'images');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

const images = [
  ['festival.jpg', 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=280&fit=crop'],
  ['immigration.jpg', 'https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=500&h=280&fit=crop'],
  ['business.jpg', 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=500&h=280&fit=crop'],
  ['realestate.jpg', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=280&fit=crop'],
  ['youth.jpg', 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=500&h=280&fit=crop'],
  ['weather.jpg', 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=500&h=280&fit=crop'],
  ['economy.jpg', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&h=280&fit=crop'],
  ['community.jpg', 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b7?w=500&h=280&fit=crop'],
  ['education.jpg', 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=500&h=280&fit=crop'],
];

for (const [filename, url] of images) {
  const dest = path.join(imgDir, filename);
  process.stdout.write(`${filename}...`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(dest, buf);
    console.log(` OK (${(buf.length / 1024).toFixed(0)} KB)`);
  } catch (e) {
    console.log(` FAILED: ${e.message}`);
  }
}
