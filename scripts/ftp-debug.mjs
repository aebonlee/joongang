import { Client } from 'basic-ftp';

const ftp = new Client();
ftp.ftp.verbose = true;

try {
  await ftp.access({
    host: 'ftp.koreadailyusa.com',
    user: 'dckoreadaily',
    password: '@dcjoongang!',
    secure: false,
  });

  console.log('\n=== Root listing ===');
  const rootList = await ftp.list('/');
  for (const f of rootList) {
    console.log(`  ${f.isDirectory ? 'DIR' : 'FILE'} | ${f.name} | size=${f.size} | type=${f.type}`);
  }

  console.log('\n=== LA_PDF_for_NEWMEDIA listing ===');
  const pdfList = await ftp.list('/LA_PDF_for_NEWMEDIA');
  for (const f of pdfList) {
    console.log(`  ${f.isDirectory ? 'DIR' : 'FILE'} | ${f.name} | size=${f.size} | type=${f.type}`);
  }

  if (pdfList.length > 0) {
    const firstDir = pdfList.find(f => f.isDirectory || f.type === 2);
    if (firstDir) {
      console.log(`\n=== ${firstDir.name} listing ===`);
      const subList = await ftp.list(`/LA_PDF_for_NEWMEDIA/${firstDir.name}`);
      for (const f of subList.slice(0, 5)) {
        console.log(`  ${f.isDirectory ? 'DIR' : 'FILE'} | ${f.name} | size=${f.size}`);
      }
      console.log(`  ... total ${subList.length} files`);
    }
  }
} catch (err) {
  console.error('Error:', err.message);
} finally {
  ftp.close();
}
