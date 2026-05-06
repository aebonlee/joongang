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
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#FFFFFF"/>
      <stop offset="100%" style="stop-color:#F5F5F5"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>

  <!-- Top red bar -->
  <rect x="0" y="0" width="${WIDTH}" height="8" fill="#E2231A"/>

  <!-- Left red accent bar -->
  <rect x="80" y="180" width="5" height="120" fill="#E2231A" rx="2"/>

  <!-- Main Title -->
  <text x="600" y="260" font-family="sans-serif" font-size="72" font-weight="900"
    fill="#E2231A" text-anchor="middle" letter-spacing="-2">
    중앙일보
  </text>

  <!-- Divider line -->
  <line x1="440" y1="290" x2="760" y2="290" stroke="#E2231A" stroke-width="2" opacity="0.4"/>

  <!-- Sub Title -->
  <text x="600" y="340" font-family="sans-serif" font-size="32" font-weight="600"
    fill="#333333" text-anchor="middle" letter-spacing="8">
    워싱턴지사
  </text>

  <!-- English name -->
  <text x="600" y="400" font-family="sans-serif" font-size="18" font-weight="400"
    fill="#888888" text-anchor="middle" letter-spacing="3">
    JoongAng Ilbo Washington Bureau
  </text>

  <!-- Tagline box -->
  <rect x="390" y="440" width="420" height="36" rx="18" fill="#E2231A" opacity="0.08"/>
  <text x="600" y="464" font-family="sans-serif" font-size="15" font-weight="500"
    fill="#E2231A" text-anchor="middle">
    미주 한인사회의 신뢰받는 뉴스
  </text>

  <!-- Bottom bar -->
  <rect x="0" y="580" width="${WIDTH}" height="50" fill="#1B1B1B"/>
  <text x="600" y="612" font-family="sans-serif" font-size="14" font-weight="400"
    fill="rgba(255,255,255,0.6)" text-anchor="middle" letter-spacing="1">
    joongang.dreamitbiz.com
  </text>

  <!-- Right accent -->
  <rect x="1115" y="180" width="5" height="120" fill="#E2231A" rx="2"/>
</svg>
`;

async function generateOgImage() {
  try {
    await sharp(Buffer.from(svgImage))
      .png()
      .toFile(outputPath);

    console.log(`OG image generated: ${outputPath}`);
    console.log(`  Size: ${WIDTH}x${HEIGHT}px`);
  } catch (error) {
    console.error('Error generating OG image:', error.message);
    process.exit(1);
  }
}

generateOgImage();
