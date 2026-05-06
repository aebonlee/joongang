/**
 * OG Image Generator for 중앙일보 워싱턴
 * Usage: npm run og-image
 * Requires: npm i -D sharp
 */

import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputPath = path.join(__dirname, '..', 'public', 'og-image.png');

// OG Image: 1200 x 630px
const WIDTH = 1200;
const HEIGHT = 630;

const svgImage = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a2e"/>
      <stop offset="50%" style="stop-color:#16213e"/>
      <stop offset="100%" style="stop-color:#0f3460"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- Decorative elements -->
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="#c0392b"/>
  <rect x="60" y="580" width="1080" height="2" fill="rgba(255,255,255,0.1)"/>

  <!-- Grid pattern -->
  <line x1="400" y1="100" x2="400" y2="530" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>
  <line x1="800" y1="100" x2="800" y2="530" stroke="rgba(255,255,255,0.03)" stroke-width="1"/>

  <!-- Main Title -->
  <text x="600" y="240" font-family="sans-serif" font-size="68" font-weight="900"
    fill="#ffffff" text-anchor="middle" letter-spacing="-2">
    중앙일보
  </text>

  <!-- Sub Title -->
  <text x="600" y="310" font-family="sans-serif" font-size="36" font-weight="700"
    fill="#e74c3c" text-anchor="middle">
    워싱턴지사
  </text>

  <!-- Description -->
  <text x="600" y="380" font-family="sans-serif" font-size="20" font-weight="400"
    fill="rgba(255,255,255,0.7)" text-anchor="middle">
    JoongAng Ilbo Washington Bureau
  </text>

  <!-- Tagline -->
  <text x="600" y="430" font-family="sans-serif" font-size="16" font-weight="300"
    fill="rgba(255,255,255,0.5)" text-anchor="middle">
    미주 한인사회의 신뢰받는 뉴스
  </text>

  <!-- URL -->
  <text x="600" y="600" font-family="monospace" font-size="14"
    fill="rgba(255,255,255,0.4)" text-anchor="middle">
    joongang.dreamitbiz.com
  </text>

  <!-- Corner accent -->
  <rect x="50" y="200" width="4" height="60" fill="#c0392b"/>
  <rect x="1146" y="200" width="4" height="60" fill="#c0392b"/>
</svg>
`;

async function generateOgImage() {
  try {
    await sharp(Buffer.from(svgImage))
      .png()
      .toFile(outputPath);

    console.log(`OG image generated: ${outputPath}`);
    console.log(`  Size: ${WIDTH}x${HEIGHT}px`);
    console.log(`  URL: https://joongang.dreamitbiz.com/og-image.png`);
  } catch (error) {
    console.error('Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOgImage();
