import fs from 'fs';

// 에디션 설정
const EDITIONS = [
  { code: 'AW', label: '워싱턴판', pages: 8 },
  { code: 'AE', label: '동부판', pages: 6 },
];

const START = new Date('2026-05-01');
const END = new Date('2026-05-09');

const STORAGE_BASE = 'https://hcmgdztsgjvzcyxyayaj.supabase.co/storage/v1/object/public/joongang-editions';

let sql = `-- 지면보기 샘플 데이터 INSERT (5/1 ~ 5/9)\n`;
sql += `-- Supabase Dashboard > SQL Editor에서 실행\n\n`;

let count = 0;

for (let d = new Date(START); d <= END; d.setDate(d.getDate() + 1)) {
  const dateStr = d.toISOString().split('T')[0];
  const dayOfWeek = d.getDay();

  // 일요일(0)은 AW만, 나머지는 AW + AE
  const editionsForDay = dayOfWeek === 0 ? [EDITIONS[0]] : EDITIONS;

  for (const edition of editionsForDay) {
    const pageCount = edition.pages - (d.getDate() % 3 === 0 ? 2 : 0);

    for (let page = 1; page <= pageCount; page++) {
      const fileName = `${edition.code}-${dateStr}-${String(page).padStart(2, '0')}.pdf`;
      const storagePath = `editions/${dateStr}/${edition.code}/${fileName}`;
      const pdfUrl = `${STORAGE_BASE}/${storagePath}`;

      sql += `INSERT INTO joongang_editions (edition_date, edition_code, edition_label, page_number, pdf_url, file_size)\n`;
      sql += `VALUES ('${dateStr}', '${edition.code}', '${edition.label}', ${page}, '${pdfUrl}', 15000);\n`;
      count++;
    }
  }
  sql += `\n`;
}

sql += `-- Total: ${count} records\n`;

fs.writeFileSync('scripts/seed-editions.sql', sql, 'utf-8');
console.log(`Generated ${count} INSERT statements → scripts/seed-editions.sql`);
