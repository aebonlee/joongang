import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const supabase = createClient(
  'https://hcmgdztsgjvzcyxyayaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWdkenRzZ2p2emN5eHlheWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU4ODcsImV4cCI6MjA4NzAxMTg4N30.gznaPzY1l8qDAPsEyYNR9KS7f7VqS3xaw-_2HTSwSZw'
);

// 에디션 설정
const EDITIONS = [
  { code: 'AW', label: 'Washington Edition', pages: 8 },
  { code: 'AE', label: 'East Coast Edition', pages: 6 },
];

// 날짜 범위: 2026-05-01 ~ 2026-05-09
const START = new Date('2026-05-01');
const END = new Date('2026-05-09');

// 샘플 헤드라인
const HEADLINES = [
  'Korean Community Spring Festival in DC',
  'Federal Immigration Policy Changes Ahead',
  'Small Business Support Program Expanded',
  'DMV Real Estate Market Trends Report',
  'Youth Leadership Camp Now Recruiting',
  'Clear Skies Expected Through the Week',
  'Korea-US Economic Forum Concludes',
  'Maryland Korean Community Center Opens',
  'Virginia Korean School Expands Classes',
];

const SUB_HEADLINES = [
  'Local News', 'Economy', 'Society', 'Culture', 'Education', 'Living', 'Opinion', 'Sports',
];

async function createPdf(date, editionCode, editionLabel, pageNum, totalPages) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4 size
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  // 배경
  page.drawRectangle({ x: 0, y: 0, width, height, color: rgb(1, 1, 1) });

  // 상단 빨간 바
  page.drawRectangle({
    x: 0, y: height - 50, width, height: 50,
    color: rgb(0.78, 0.06, 0.18),
  });

  // 신문 제목
  page.drawText('JoongAng Daily Washington', {
    x: 30, y: height - 37, size: 22, font: fontBold, color: rgb(1, 1, 1),
  });

  // 날짜 & 판
  const dateStr = date.toISOString().split('T')[0];
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayName = weekdays[date.getDay()];

  page.drawText(`${dateStr} (${dayName})  |  ${editionLabel}  |  Page ${pageNum}/${totalPages}`, {
    x: 30, y: height - 70, size: 11, font, color: rgb(0.3, 0.3, 0.3),
  });

  // 구분선
  page.drawLine({
    start: { x: 30, y: height - 80 }, end: { x: width - 30, y: height - 80 },
    thickness: 2, color: rgb(0, 0, 0),
  });

  if (pageNum === 1) {
    // 1면: 메인 헤드라인
    const headlineIdx = (date.getDate() - 1) % HEADLINES.length;
    page.drawText(HEADLINES[headlineIdx], {
      x: 30, y: height - 130, size: 28, font: fontBold, color: rgb(0, 0, 0),
    });

    // 이미지 자리
    page.drawRectangle({
      x: 30, y: height - 380, width: width - 60, height: 230,
      color: rgb(0.92, 0.92, 0.92), borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 1,
    });
    page.drawText('PHOTO', {
      x: width / 2 - 30, y: height - 280, size: 20, font, color: rgb(0.6, 0.6, 0.6),
    });

    // 본문 모사
    for (let i = 0; i < 12; i++) {
      page.drawRectangle({
        x: 30, y: height - 410 - i * 16,
        width: 300 + Math.random() * (width - 360), height: 8,
        color: rgb(0.85, 0.85, 0.85),
      });
    }

    // 우측 사이드바
    page.drawLine({
      start: { x: width - 200, y: height - 80 }, end: { x: width - 200, y: 100 },
      thickness: 1, color: rgb(0.7, 0.7, 0.7),
    });
    const sideY = height - 120;
    for (let i = 0; i < 4; i++) {
      page.drawRectangle({ x: width - 185, y: sideY - i * 160, width: 155, height: 10, color: rgb(0, 0, 0) });
      for (let j = 0; j < 5; j++) {
        page.drawRectangle({
          x: width - 185, y: sideY - i * 160 - 20 - j * 14,
          width: 120 + Math.random() * 35, height: 7, color: rgb(0.85, 0.85, 0.85),
        });
      }
    }
  } else {
    // 내부 페이지: 섹션
    const sectionName = SUB_HEADLINES[(pageNum - 2) % SUB_HEADLINES.length];
    page.drawText(sectionName, {
      x: 30, y: height - 110, size: 16, font: fontBold, color: rgb(0.78, 0.06, 0.18),
    });

    const colWidth = (width - 80) / 2;
    for (let col = 0; col < 2; col++) {
      const cx = 30 + col * (colWidth + 20);
      page.drawRectangle({ x: cx, y: height - 150, width: colWidth * 0.8, height: 12, color: rgb(0, 0, 0) });
      page.drawRectangle({
        x: cx, y: height - 310, width: colWidth, height: 140,
        color: rgb(0.92, 0.92, 0.92), borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 1,
      });
      for (let i = 0; i < 20; i++) {
        page.drawRectangle({
          x: cx, y: height - 340 - i * 14,
          width: colWidth * (0.6 + Math.random() * 0.4), height: 7, color: rgb(0.85, 0.85, 0.85),
        });
      }
    }

    // 하단 광고
    page.drawRectangle({
      x: 30, y: 60, width: width - 60, height: 100,
      color: rgb(0.95, 0.95, 0.95), borderColor: rgb(0.8, 0.8, 0.8), borderWidth: 1,
    });
    page.drawText('ADVERTISEMENT', {
      x: width / 2 - 55, y: 100, size: 14, font, color: rgb(0.7, 0.7, 0.7),
    });
  }

  // 하단 페이지 번호
  page.drawText(`- ${pageNum} -`, {
    x: width / 2 - 15, y: 30, size: 10, font, color: rgb(0.5, 0.5, 0.5),
  });

  return await doc.save();
}

async function main() {
  console.log('=== Storage PDF 업로드 전용 ===');
  console.log('(DB INSERT는 seed-editions.sql을 Dashboard에서 실행)\n');

  let uploaded = 0;
  let errors = 0;

  for (let d = new Date(START); d <= END; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const editionsForDay = dayOfWeek === 0 ? [EDITIONS[0]] : EDITIONS;

    for (const edition of editionsForDay) {
      const pageCount = edition.pages - (d.getDate() % 3 === 0 ? 2 : 0);
      console.log(`[${dateStr}] ${edition.label} (${edition.code}) - ${pageCount} pages`);

      for (let p = 1; p <= pageCount; p++) {
        const pdfBytes = await createPdf(d, edition.code, edition.label, p, pageCount);
        const fileName = `${edition.code}-${dateStr}-${String(p).padStart(2, '0')}.pdf`;
        const storagePath = `editions/${dateStr}/${edition.code}/${fileName}`;

        const { error } = await supabase.storage
          .from('joongang-editions')
          .upload(storagePath, pdfBytes, { contentType: 'application/pdf', upsert: true });

        if (error) {
          console.log(`  [ERROR] ${fileName}: ${error.message}`);
          errors++;
        } else {
          uploaded++;
        }
      }
    }
  }

  console.log(`\n=== 완료: ${uploaded} uploaded, ${errors} errors ===`);
}

main().catch(console.error);
