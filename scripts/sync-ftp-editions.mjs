/**
 * FTP → Supabase 지면 동기화 스크립트
 *
 * 사용법:
 *   node scripts/sync-ftp-editions.mjs              # 전체 날짜 동기화
 *   node scripts/sync-ftp-editions.mjs 0511          # 특정 날짜만
 *   node scripts/sync-ftp-editions.mjs 0508 0511     # 여러 날짜
 */

import { Client } from 'basic-ftp';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import os from 'os';

// ── FTP 설정 ──
const FTP_HOST = 'ftp.koreadailyusa.com';
const FTP_USER = 'dckoreadaily';
const FTP_PASS = '@dcjoongang!';
const FTP_DIR = '/LA_PDF_for_NEWMEDIA';

// ── Supabase 설정 ──
const SUPABASE_URL = 'https://hcmgdztsgjvzcyxyayaj.supabase.co';
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWdkenRzZ2p2emN5eHlheWFqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQzNTg4NywiZXhwIjoyMDg3MDExODg3fQ.B12z8CQaR5IsigPgTy1ltk_g9fdckPDWxbNOq77ZlEc';

const STORAGE_BUCKET = 'joongang-editions';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── 판별 코드 라벨 ──
const EDITION_LABELS = {
  A: 'A섹션 (종합)',
  B: 'B섹션',
  G: 'G섹션',
};

// ── 파일명 파싱 ──
// 예: A0511100501.pdf → code=A, dateMMDD=0511, page=5, ver=01
// 예: A0511102501_1.pdf → code=A, dateMMDD=0511, page=25, ver=01, suffix=_1
function parseFilename(filename) {
  const match = filename.match(
    /^([A-Z])(\d{4})1(\d{3})(\d{2})(_.+)?\.pdf$/i
  );
  if (!match) return null;
  return {
    code: match[1].toUpperCase(),
    dateMMDD: match[2],
    page: parseInt(match[3], 10),
    version: parseInt(match[4], 10),
    suffix: match[5] || '',
    isRevision: !!match[5],
  };
}

// MMDD → YYYY-MM-DD
function mmddToDate(mmdd) {
  const year = new Date().getFullYear();
  const month = mmdd.substring(0, 2);
  const day = mmdd.substring(2, 4);
  return `${year}-${month}-${day}`;
}

// ── 메인 동기화 ──
async function main() {
  const targetFolders = process.argv.slice(2); // 특정 폴더 지정 가능
  const tmpDir = path.join(os.tmpdir(), `joongang-ftp-sync-${Date.now()}`);

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const ftp = new Client();
  ftp.ftp.verbose = false;

  try {
    console.log('FTP 접속 중...');
    await ftp.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASS,
      secure: false,
    });
    console.log('FTP 접속 성공');

    // Serv-U FTP의 MLSD는 type/size를 제대로 안 줌 → LIST 강제 사용
    ftp.availableListCommands = ['LIST -a'];

    // 날짜 폴더 목록
    const folders = await ftp.list(FTP_DIR);
    const dateFolders = folders
      .filter((f) => f.isDirectory && /^\d{4}$/.test(f.name))
      .map((f) => f.name)
      .sort();

    console.log(`발견된 날짜 폴더: ${dateFolders.join(', ')}`);

    // 특정 폴더만 동기화하거나 전체
    const foldersToSync =
      targetFolders.length > 0
        ? dateFolders.filter((f) => targetFolders.includes(f))
        : dateFolders;

    if (foldersToSync.length === 0) {
      console.log('동기화할 폴더가 없습니다.');
      return;
    }

    console.log(`동기화 대상: ${foldersToSync.join(', ')}\n`);

    let totalSuccess = 0;
    let totalSkip = 0;
    let totalError = 0;

    for (const folder of foldersToSync) {
      const editionDate = mmddToDate(folder);
      console.log(`\n━━━ ${editionDate} (${folder}) ━━━`);

      // FTP 파일 목록
      const files = await ftp.list(`${FTP_DIR}/${folder}`);
      const pdfFiles = files.filter(
        (f) => !f.isDirectory && /\.pdf$/i.test(f.name)
      );
      console.log(`  PDF 파일 ${pdfFiles.length}개 발견`);

      // 파일 파싱 & 수정본 필터링 (_1 suffix가 있으면 원본 대체)
      const fileMap = new Map();
      for (const f of pdfFiles) {
        const parsed = parseFilename(f.name);
        if (!parsed) {
          console.log(`  [건너뜀] 파싱 불가: ${f.name}`);
          totalSkip++;
          continue;
        }

        const key = `${parsed.code}-${parsed.page}`;
        const existing = fileMap.get(key);

        // 수정본(_1)이 있으면 원본 대체
        if (!existing || parsed.isRevision) {
          fileMap.set(key, { ...parsed, filename: f.name, size: f.size });
        }
      }

      // 기존 DB 데이터 확인
      const { data: existingEditions } = await supabase
        .from('joongang_editions')
        .select('edition_code, page_number')
        .eq('edition_date', editionDate);

      const existingKeys = new Set(
        (existingEditions || []).map((e) => `${e.edition_code}-${e.page_number}`)
      );

      // 파일별 다운로드 → 업로드 → DB 등록
      const entries = [...fileMap.values()].sort(
        (a, b) => a.code.localeCompare(b.code) || a.page - b.page
      );

      for (const entry of entries) {
        const dbKey = `${entry.code}-${entry.page}`;

        if (existingKeys.has(dbKey)) {
          console.log(
            `  [건너뜀] 이미 등록: ${entry.code}섹션 ${entry.page}면`
          );
          totalSkip++;
          continue;
        }

        const localFile = path.join(tmpDir, entry.filename);
        const storagePath = `editions/${editionDate}/${entry.code}/${entry.code}-${editionDate}-${String(entry.page).padStart(3, '0')}.pdf`;

        try {
          // 1. FTP 다운로드
          process.stdout.write(
            `  [다운로드] ${entry.code}섹션 ${entry.page}면 (${(entry.size / 1024 / 1024).toFixed(1)}MB)...`
          );
          await ftp.downloadTo(
            localFile,
            `${FTP_DIR}/${folder}/${entry.filename}`
          );

          // 2. Supabase Storage 업로드
          process.stdout.write(' → 업로드...');
          const fileBuffer = fs.readFileSync(localFile);
          const { error: uploadError } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(storagePath, fileBuffer, {
              contentType: 'application/pdf',
              upsert: true,
            });

          if (uploadError) {
            console.log(` 실패 (Storage: ${uploadError.message})`);
            totalError++;
            // 임시 파일 정리
            if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
            continue;
          }

          // 3. Public URL 생성
          const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(storagePath);

          // 4. DB 등록
          const { error: dbError } = await supabase
            .from('joongang_editions')
            .insert({
              edition_date: editionDate,
              edition_code: entry.code,
              edition_label: EDITION_LABELS[entry.code] || `${entry.code}섹션`,
              page_number: entry.page,
              pdf_url: urlData.publicUrl,
              file_size: entry.size,
            });

          if (dbError) {
            console.log(` 실패 (DB: ${dbError.message})`);
            totalError++;
          } else {
            console.log(' 완료');
            totalSuccess++;
          }

          // 임시 파일 정리
          if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
        } catch (err) {
          console.log(` 에러: ${err.message}`);
          totalError++;
          if (fs.existsSync(localFile)) fs.unlinkSync(localFile);
        }
      }
    }

    console.log('\n════════════════════════════');
    console.log(`완료: 성공 ${totalSuccess} / 건너뜀 ${totalSkip} / 실패 ${totalError}`);
    console.log('════════════════════════════');
  } catch (err) {
    console.error('오류 발생:', err.message);
  } finally {
    ftp.close();
    // 임시 디렉토리 정리
    if (fs.existsSync(tmpDir)) {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }
}

main();
