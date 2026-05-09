import { createClient } from '@supabase/supabase-js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const supabase = createClient(
  'https://hcmgdztsgjvzcyxyayaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWdkenRzZ2p2emN5eHlheWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU4ODcsImV4cCI6MjA4NzAxMTg4N30.gznaPzY1l8qDAPsEyYNR9KS7f7VqS3xaw-_2HTSwSZw'
);

const EDITIONS = [
  { code: 'AW', label: 'Washington Edition', pages: 8 },
  { code: 'AE', label: 'East Coast Edition', pages: 6 },
];

const START = new Date('2026-05-01');
const END = new Date('2026-05-09');

// 1면 헤드라인 + 본문
const FRONT_PAGES = [
  {
    headline: 'Korean Community Spring Festival',
    subhead: 'Annual celebration draws record attendance in Washington D.C.',
    body: [
      'The Korean American community in the greater Washington D.C. area held its annual Spring Festival',
      'at the National Mall over the weekend, drawing an estimated 15,000 visitors over two days.',
      '',
      'The festival featured traditional Korean performances, food vendors from over 30 local Korean',
      'restaurants, and cultural exhibitions showcasing Korean heritage and modern K-culture.',
      '',
      '"This year\'s turnout exceeded all expectations," said festival organizer Kim Sung-ho. "It shows',
      'how the Korean community continues to grow and thrive in the D.C. metropolitan area."',
      '',
      'Highlights included a K-pop dance competition, a hanbok fashion show, and demonstrations of',
      'traditional Korean martial arts. Local politicians, including several members of Congress,',
      'attended the opening ceremony to show their support for the Korean American community.',
      '',
      'The festival also served as a fundraiser for the Korean American Community Foundation, which',
      'provides scholarships and social services to Korean Americans throughout the region.',
    ],
  },
  {
    headline: 'Immigration Policy Reform Expected',
    subhead: 'Federal government announces new framework for skilled worker visas',
    body: [
      'The Biden administration unveiled a comprehensive reform package for the H-1B and other',
      'skilled worker visa programs on Monday, marking the most significant changes to the system',
      'in over a decade.',
      '',
      'The proposed changes would streamline the application process, increase annual visa caps,',
      'and provide new pathways for international students graduating from U.S. universities.',
      '',
      '"These reforms recognize the vital contributions that skilled immigrants make to our economy,"',
      'said the Secretary of Homeland Security during a press briefing at the White House.',
      '',
      'Korean American business leaders have welcomed the announcement, noting that many Korean',
      'companies operating in the United States rely on the H-1B program to bring skilled workers.',
      '',
      'The Korean Embassy in Washington issued a statement expressing support for the reforms,',
      'calling them "a positive step toward a more efficient and fair immigration system."',
    ],
  },
  {
    headline: 'Small Business Program Expands',
    subhead: 'New SBA initiative targets Korean American entrepreneurs in DMV region',
    body: [
      'The U.S. Small Business Administration announced a targeted expansion of its lending and',
      'mentorship programs for Korean American small business owners in the D.C., Maryland, and',
      'Virginia metropolitan area.',
      '',
      'The program, which launches next month, will provide low-interest loans of up to $250,000',
      'and pair new business owners with experienced Korean American entrepreneurs as mentors.',
      '',
      '"Korean Americans are among the most entrepreneurial communities in the country," said the',
      'SBA Regional Administrator. "This program recognizes their contributions and helps them grow."',
      '',
      'According to the latest census data, Korean Americans own over 12,000 businesses in the',
      'greater D.C. area, employing more than 45,000 workers across various industries including',
      'restaurants, dry cleaning, construction, and technology.',
    ],
  },
  {
    headline: 'DMV Housing Market Report Q2 2026',
    subhead: 'Median home prices rise 8% year-over-year across the metropolitan area',
    body: [
      'The real estate market in the Washington D.C. metropolitan area continued its upward trend',
      'in the second quarter of 2026, with median home prices reaching $625,000 across the region.',
      '',
      'Fairfax County, home to a large Korean American community, saw prices increase by 9.2%,',
      'with the average single-family home now selling for $720,000.',
      '',
      'Korean American real estate agents report strong demand from first-generation immigrants',
      'seeking homes in areas with established Korean communities, particularly in Annandale,',
      'Centreville, and Ellicott City.',
      '',
      '"Buyers are looking for neighborhoods with Korean grocery stores, restaurants, and churches',
      'nearby," said Park Ji-young of Century 21 in Annandale. "These amenities drive housing',
      'demand in certain zip codes."',
    ],
  },
  {
    headline: 'Youth Leadership Camp Applications',
    subhead: 'CKA Fellowship program sees record number of applicants',
    body: [
      'The Council of Korean Americans (CKA) announced that its 2026 Next Generation Leadership',
      'Fellowship has received a record 450 applications, more than double last year\'s numbers.',
      '',
      'The fellowship, now in its eighth year, selects 25 emerging Korean American leaders ages',
      '21-35 for an intensive summer program that includes policy seminars, leadership training,',
      'and meetings with senior government officials and business leaders.',
      '',
      '"The growing interest reflects the Korean American community\'s increasing engagement in',
      'public service and civic leadership," said CKA President Abraham Kim.',
      '',
      'Past fellows have gone on to serve in government positions, lead nonprofit organizations,',
      'and launch successful businesses that serve the Korean American community.',
    ],
  },
  {
    headline: 'Weather: Clear Skies This Week',
    subhead: 'National Weather Service forecasts sunny conditions for D.C. metro area',
    body: [
      'Residents of the Washington D.C. metropolitan area can expect a stretch of pleasant weather',
      'this week, with clear skies and temperatures in the mid-70s through Friday.',
      '',
      'The National Weather Service forecast calls for sunshine and low humidity, making it ideal',
      'conditions for outdoor activities. Weekend temperatures may climb into the low 80s.',
      '',
      'Local Korean community organizations are taking advantage of the weather to hold several',
      'outdoor events, including the Korean American Golf Association tournament at Congressional',
      'Country Club and the annual Korean American Hiking Club spring outing at Great Falls.',
    ],
  },
  {
    headline: 'Korea-US Economic Forum Success',
    subhead: 'Bilateral trade discussions yield new investment commitments',
    body: [
      'The 2026 Korea-US Economic Cooperation Forum concluded successfully in Washington D.C.',
      'last week, with over 200 business leaders and government officials from both countries',
      'participating in three days of discussions.',
      '',
      'Key outcomes included $2.3 billion in new investment commitments from Korean companies',
      'in the United States, primarily in semiconductor manufacturing, electric vehicle batteries,',
      'and renewable energy sectors.',
      '',
      'Korean Ambassador to the United States Cho Hyun-dong called the forum "a milestone in',
      'bilateral economic relations" and emphasized the deepening integration of the two economies.',
    ],
  },
  {
    headline: 'Maryland Community Center Opens',
    subhead: 'New $15M Korean American community facility in Ellicott City',
    body: [
      'Maryland Governor Wes Moore joined Korean American community leaders on Saturday to cut',
      'the ribbon on the new Korean American Community Center in Ellicott City, Howard County.',
      '',
      'The $15 million facility features a 500-seat auditorium, a Korean language library, meeting',
      'rooms, a commercial kitchen for community events, and office space for Korean American',
      'nonprofit organizations.',
      '',
      '"This center will serve as a hub for our community for generations to come," said center',
      'director Lee Myung-ja. "It represents years of fundraising and planning by dedicated',
      'community volunteers."',
    ],
  },
  {
    headline: 'Virginia Korean Schools Expand',
    subhead: 'Weekend Korean language programs add new locations and curricula',
    body: [
      'Korean language schools across Northern Virginia are expanding their programs in response',
      'to growing demand from both Korean American families and non-Korean students interested',
      'in learning the language.',
      '',
      'The Washington Korean School, the largest in the area, announced it will open two new',
      'satellite locations in Ashburn and Woodbridge starting in the fall semester.',
      '',
      '"We\'re seeing unprecedented interest in Korean language education, partly driven by the',
      'global popularity of Korean entertainment and culture," said principal Choi Eun-sook.',
    ],
  },
];

// 내부 페이지 기사들
const SECTION_ARTICLES = {
  'Local News': [
    { title: 'Annandale Business District Renovation Plan Approved', body: 'The Fairfax County Board of Supervisors unanimously approved a $45 million renovation plan for the Annandale business district, which is home to one of the largest concentrations of Korean businesses on the East Coast. The project will include streetscape improvements, new parking facilities, and pedestrian-friendly walkways.' },
    { title: 'Korean Senior Center Celebrates 20th Anniversary', body: 'The Korean American Senior Citizens Center in Falls Church marked its 20th anniversary with a special celebration attended by over 300 community members. The center provides daily meals, health screenings, social activities, and transportation services to more than 500 Korean American seniors in the region.' },
  ],
  'Economy': [
    { title: 'Korean Banks Expand D.C. Area Operations', body: 'Several major Korean banks, including Shinhan and Woori, announced plans to expand their branch networks in the Washington D.C. metropolitan area. The expansion targets the growing Korean American business community and reflects increasing trade between Korea and the United States.' },
    { title: 'Stock Market Recap: Korean Tech Stocks Lead', body: 'Korean technology companies listed on U.S. exchanges showed strong gains this week, led by Samsung Electronics ADRs which rose 3.2%. Analysts attribute the gains to strong semiconductor demand and favorable currency movements.' },
  ],
  'Society': [
    { title: 'Korean Church Coalition Launches Food Bank Initiative', body: 'A coalition of 15 Korean churches in the D.C. metro area has launched a community food bank to serve families in need. The initiative, called "Sharing Table," will distribute groceries every Saturday at three locations across Northern Virginia and Maryland.' },
    { title: 'Anti-Asian Hate Crime Task Force Reports Progress', body: 'The FBI\'s Anti-Asian Hate Crime Task Force reported a 30% decrease in reported incidents in the D.C. metropolitan area compared to last year. Community leaders credit increased police patrols, bystander intervention training, and stronger community-law enforcement partnerships.' },
  ],
  'Culture': [
    { title: 'Korean Film Festival Opens at Kennedy Center', body: 'The 12th annual Korean Film Festival opened at the Kennedy Center with a screening of the latest critically acclaimed Korean drama. The week-long festival features 20 films, panel discussions with filmmakers, and a special retrospective on Korean cinema history.' },
    { title: 'K-Pop Concert at Capital One Arena Sells Out', body: 'A major K-pop group\'s concert at Capital One Arena in Washington D.C. sold out within minutes of tickets going on sale. The show, part of the group\'s North American tour, is expected to draw fans from across the East Coast.' },
  ],
  'Education': [
    { title: 'Korean SAT Prep Academy Opens in Centreville', body: 'A new SAT and college preparation academy targeting Korean American students has opened in Centreville, Virginia. The academy offers intensive test preparation courses, college admissions counseling, and essay writing workshops in both Korean and English.' },
    { title: 'University of Maryland Launches Korean Studies Program', body: 'The University of Maryland announced a new Korean Studies minor program starting in the fall 2026 semester. The program will offer courses in Korean language, history, politics, and culture, and will include a study abroad component with partner universities in Seoul.' },
  ],
  'Living': [
    { title: 'Best Korean Restaurants in DMV: 2026 Guide', body: 'Our annual guide to the best Korean dining in the D.C., Maryland, and Virginia area features 25 must-visit restaurants, from traditional Korean BBQ spots in Annandale to trendy fusion restaurants in downtown D.C. New additions include a temple food restaurant in Bethesda and a Korean fried chicken chain in Arlington.' },
    { title: 'Health Insurance Guide for Korean Immigrants', body: 'Navigating the U.S. health insurance system can be challenging for Korean immigrants. This comprehensive guide covers Medicare, Medicaid, and Marketplace options available in Virginia, Maryland, and D.C., with Korean-language enrollment assistance resources.' },
  ],
  'Opinion': [
    { title: 'Editorial: Strengthening Korean American Civic Participation', body: 'As the Korean American community continues to grow in the Washington D.C. area, civic participation must grow alongside it. Voter registration rates among Korean Americans remain below the national average. Community organizations must redouble their efforts to engage Korean Americans in the democratic process.' },
    { title: 'Column: Bridging the Generation Gap in Korean Families', body: 'The cultural and linguistic divide between first-generation Korean immigrants and their American-born children remains one of the most significant challenges facing Korean American families. Finding ways to bridge this gap while preserving cultural heritage requires intentional effort from both generations.' },
  ],
  'Sports': [
    { title: 'Korean American Golf Tournament Results', body: 'The Mid-Atlantic Korean American Golf Association held its spring tournament at Westfields Golf Club in Clifton, Virginia. Over 120 golfers participated in the two-day event, with Lee Dong-won taking the championship title with a combined score of 142.' },
    { title: 'Local Korean Youth Soccer League Kicks Off Season', body: 'The Northern Virginia Korean Youth Soccer League began its spring season with 24 teams competing across four age divisions. The league, now in its 15th year, has grown from a small weekend program to a comprehensive youth athletics organization.' },
  ],
};

async function createPdf(date, editionCode, editionLabel, pageNum, totalPages) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595.28, 841.89]); // A4
  const font = await doc.embedFont(StandardFonts.TimesRoman);
  const fontBold = await doc.embedFont(StandardFonts.TimesRomanBold);
  const fontItalic = await doc.embedFont(StandardFonts.TimesRomanItalic);
  const helvetica = await doc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const { width, height } = page.getSize();

  const dateStr = date.toISOString().split('T')[0];
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayName = weekdays[date.getDay()];
  const monthName = months[date.getMonth()];
  const formattedDate = `${dayName}, ${monthName} ${date.getDate()}, ${date.getFullYear()}`;

  // ===== 상단 마스트헤드 =====
  // 빨간 상단 라인
  page.drawRectangle({ x: 0, y: height - 4, width, height: 4, color: rgb(0.78, 0.06, 0.18) });

  // 신문 제목
  page.drawText('The JoongAng Daily', {
    x: width / 2 - 120, y: height - 40, size: 30, font: fontBold, color: rgb(0, 0, 0),
  });
  page.drawText('WASHINGTON D.C. EDITION', {
    x: width / 2 - 72, y: height - 55, size: 10, font: helvetica, color: rgb(0.4, 0.4, 0.4),
  });

  // 날짜/판 정보
  page.drawText(formattedDate, {
    x: 30, y: height - 55, size: 9, font, color: rgb(0.3, 0.3, 0.3),
  });
  page.drawText(`${editionLabel}  |  Page ${pageNum}`, {
    x: width - 150, y: height - 55, size: 9, font, color: rgb(0.3, 0.3, 0.3),
  });

  // 구분선
  page.drawLine({
    start: { x: 30, y: height - 62 }, end: { x: width - 30, y: height - 62 },
    thickness: 1.5, color: rgb(0, 0, 0),
  });
  page.drawLine({
    start: { x: 30, y: height - 65 }, end: { x: width - 30, y: height - 65 },
    thickness: 0.5, color: rgb(0, 0, 0),
  });

  const marginLeft = 35;
  const marginRight = width - 35;
  const contentWidth = marginRight - marginLeft;

  if (pageNum === 1) {
    // ===== 1면 =====
    const fp = FRONT_PAGES[(date.getDate() - 1) % FRONT_PAGES.length];
    let y = height - 100;

    // 헤드라인
    const headlineSize = 32;
    page.drawText(fp.headline, {
      x: marginLeft, y, size: headlineSize, font: fontBold, color: rgb(0, 0, 0),
    });
    y -= 22;

    // 부제목
    page.drawText(fp.subhead, {
      x: marginLeft, y, size: 14, font: fontItalic, color: rgb(0.3, 0.3, 0.3),
    });
    y -= 20;

    // 구분선
    page.drawLine({
      start: { x: marginLeft, y }, end: { x: marginRight, y },
      thickness: 0.5, color: rgb(0.7, 0.7, 0.7),
    });
    y -= 8;

    // 기자명
    page.drawText('By Staff Reporter  |  joongang@dreamitbiz.com', {
      x: marginLeft, y, size: 9, font: fontItalic, color: rgb(0.5, 0.5, 0.5),
    });
    y -= 20;

    // 이미지 자리 (회색 박스)
    const imgHeight = 180;
    page.drawRectangle({
      x: marginLeft, y: y - imgHeight, width: contentWidth, height: imgHeight,
      color: rgb(0.93, 0.93, 0.93), borderColor: rgb(0.85, 0.85, 0.85), borderWidth: 0.5,
    });
    page.drawText('Photo / Yonhap News Agency', {
      x: width / 2 - 70, y: y - imgHeight / 2, size: 11, font: fontItalic, color: rgb(0.6, 0.6, 0.6),
    });
    y -= imgHeight + 8;

    // 캡션
    page.drawText('The event drew thousands of attendees from across the D.C. metropolitan area.', {
      x: marginLeft, y, size: 8, font: fontItalic, color: rgb(0.5, 0.5, 0.5),
    });
    y -= 18;

    // 본문 (2단)
    const colWidth = (contentWidth - 16) / 2;
    const colGap = 16;
    let leftY = y;
    let rightY = y;
    const lineHeight = 13;
    const bodySize = 10;

    for (let i = 0; i < fp.body.length; i++) {
      const line = fp.body[i];
      if (line === '') {
        if (i < fp.body.length / 2) leftY -= 8;
        else rightY -= 8;
        continue;
      }

      if (i < fp.body.length / 2) {
        // 왼쪽 단
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          if (font.widthOfTextAtSize(testLine, bodySize) > colWidth) {
            page.drawText(currentLine, { x: marginLeft, y: leftY, size: bodySize, font, color: rgb(0.15, 0.15, 0.15) });
            leftY -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          page.drawText(currentLine, { x: marginLeft, y: leftY, size: bodySize, font, color: rgb(0.15, 0.15, 0.15) });
          leftY -= lineHeight;
        }
      } else {
        // 오른쪽 단
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
          const testLine = currentLine ? currentLine + ' ' + word : word;
          if (font.widthOfTextAtSize(testLine, bodySize) > colWidth) {
            page.drawText(currentLine, { x: marginLeft + colWidth + colGap, y: rightY, size: bodySize, font, color: rgb(0.15, 0.15, 0.15) });
            rightY -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) {
          page.drawText(currentLine, { x: marginLeft + colWidth + colGap, y: rightY, size: bodySize, font, color: rgb(0.15, 0.15, 0.15) });
          rightY -= lineHeight;
        }
      }
    }

    // 단 구분선
    const colDividerTop = y + 5;
    const colDividerBottom = Math.min(leftY, rightY) - 10;
    page.drawLine({
      start: { x: marginLeft + colWidth + colGap / 2, y: colDividerTop },
      end: { x: marginLeft + colWidth + colGap / 2, y: colDividerBottom },
      thickness: 0.5, color: rgb(0.8, 0.8, 0.8),
    });

    // 하단: 인덱스 박스
    const boxY = 50;
    page.drawLine({
      start: { x: marginLeft, y: boxY + 55 }, end: { x: marginRight, y: boxY + 55 },
      thickness: 1, color: rgb(0, 0, 0),
    });
    page.drawText('INSIDE THIS EDITION', {
      x: marginLeft, y: boxY + 40, size: 10, font: helveticaBold, color: rgb(0.78, 0.06, 0.18),
    });
    const sections = ['Local News....2', 'Economy....3', 'Society....4', 'Culture....5', 'Opinion....6', 'Sports....7'];
    sections.forEach((s, i) => {
      const sx = marginLeft + (i % 3) * (contentWidth / 3);
      const sy = boxY + (i < 3 ? 25 : 10);
      page.drawText(s, { x: sx, y: sy, size: 9, font, color: rgb(0.3, 0.3, 0.3) });
    });

  } else {
    // ===== 내부 페이지 =====
    const sectionNames = Object.keys(SECTION_ARTICLES);
    const sectionName = sectionNames[(pageNum - 2) % sectionNames.length];
    const articles = SECTION_ARTICLES[sectionName];

    // 섹션 제목
    let y = height - 85;
    page.drawRectangle({
      x: marginLeft, y: y - 2, width: contentWidth, height: 18,
      color: rgb(0.78, 0.06, 0.18),
    });
    page.drawText(sectionName.toUpperCase(), {
      x: marginLeft + 8, y: y + 1, size: 11, font: helveticaBold, color: rgb(1, 1, 1),
    });
    page.drawText(`The JoongAng Daily  |  Page ${pageNum}`, {
      x: marginRight - 160, y: y + 1, size: 9, font: helvetica, color: rgb(1, 1, 1),
    });
    y -= 30;

    // 2단 레이아웃
    const colWidth = (contentWidth - 20) / 2;
    const colGap = 20;

    for (let artIdx = 0; artIdx < 2 && artIdx < articles.length; artIdx++) {
      const article = articles[artIdx];
      const cx = marginLeft + artIdx * (colWidth + colGap);
      let ay = y;

      // 기사 제목
      const titleWords = article.title.split(' ');
      let titleLine = '';
      const titleSize = 16;
      for (const word of titleWords) {
        const test = titleLine ? titleLine + ' ' + word : word;
        if (fontBold.widthOfTextAtSize(test, titleSize) > colWidth) {
          page.drawText(titleLine, { x: cx, y: ay, size: titleSize, font: fontBold, color: rgb(0, 0, 0) });
          ay -= 20;
          titleLine = word;
        } else {
          titleLine = test;
        }
      }
      if (titleLine) {
        page.drawText(titleLine, { x: cx, y: ay, size: titleSize, font: fontBold, color: rgb(0, 0, 0) });
        ay -= 14;
      }

      // 구분선
      page.drawLine({
        start: { x: cx, y: ay }, end: { x: cx + colWidth, y: ay },
        thickness: 0.5, color: rgb(0.8, 0.8, 0.8),
      });
      ay -= 12;

      // 기자명
      page.drawText('Staff Reporter', {
        x: cx, y: ay, size: 8, font: fontItalic, color: rgb(0.5, 0.5, 0.5),
      });
      ay -= 16;

      // 이미지 자리
      const imgH = 120;
      page.drawRectangle({
        x: cx, y: ay - imgH, width: colWidth, height: imgH,
        color: rgb(0.94, 0.94, 0.94), borderColor: rgb(0.88, 0.88, 0.88), borderWidth: 0.5,
      });
      page.drawText('Photo', {
        x: cx + colWidth / 2 - 15, y: ay - imgH / 2, size: 11, font: fontItalic, color: rgb(0.65, 0.65, 0.65),
      });
      ay -= imgH + 14;

      // 본문
      const bodyWords = article.body.split(' ');
      let bodyLine = '';
      const bSize = 9.5;
      const bLineHeight = 12.5;
      for (const word of bodyWords) {
        const test = bodyLine ? bodyLine + ' ' + word : word;
        if (font.widthOfTextAtSize(test, bSize) > colWidth) {
          page.drawText(bodyLine, { x: cx, y: ay, size: bSize, font, color: rgb(0.15, 0.15, 0.15) });
          ay -= bLineHeight;
          bodyLine = word;
        } else {
          bodyLine = test;
        }
        if (ay < 80) break;
      }
      if (bodyLine && ay >= 80) {
        page.drawText(bodyLine, { x: cx, y: ay, size: bSize, font, color: rgb(0.15, 0.15, 0.15) });
      }
    }

    // 단 구분선
    page.drawLine({
      start: { x: marginLeft + colWidth + colGap / 2, y: y + 5 },
      end: { x: marginLeft + colWidth + colGap / 2, y: 80 },
      thickness: 0.5, color: rgb(0.85, 0.85, 0.85),
    });

    // 하단 광고
    page.drawRectangle({
      x: marginLeft, y: 30, width: contentWidth, height: 45,
      color: rgb(0.96, 0.96, 0.96), borderColor: rgb(0.88, 0.88, 0.88), borderWidth: 0.5,
    });
    page.drawText('ADVERTISEMENT', {
      x: width / 2 - 40, y: 48, size: 10, font: helvetica, color: rgb(0.7, 0.7, 0.7),
    });
  }

  // 하단 페이지 번호
  page.drawLine({
    start: { x: marginLeft, y: 22 }, end: { x: marginRight, y: 22 },
    thickness: 0.5, color: rgb(0.8, 0.8, 0.8),
  });
  page.drawText(`${pageNum}`, {
    x: width / 2 - 4, y: 10, size: 9, font: helveticaBold, color: rgb(0.4, 0.4, 0.4),
  });

  return await doc.save();
}

async function main() {
  console.log('=== Storage PDF 업로드 (upsert) ===\n');

  let uploaded = 0;
  let errors = 0;

  for (let d = new Date(START); d <= END; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const editionsForDay = dayOfWeek === 0 ? [EDITIONS[0]] : EDITIONS;

    for (const edition of editionsForDay) {
      const pageCount = edition.pages - (d.getDate() % 3 === 0 ? 2 : 0);
      process.stdout.write(`[${dateStr}] ${edition.code} ${pageCount}p...`);

      for (let p = 1; p <= pageCount; p++) {
        const pdfBytes = await createPdf(d, edition.code, edition.label, p, pageCount);
        const fileName = `${edition.code}-${dateStr}-${String(p).padStart(2, '0')}.pdf`;
        const storagePath = `editions/${dateStr}/${edition.code}/${fileName}`;

        // 기존 파일 삭제 후 새로 업로드
        await supabase.storage.from('joongang-editions').remove([storagePath]);
        const { error } = await supabase.storage
          .from('joongang-editions')
          .upload(storagePath, pdfBytes, { contentType: 'application/pdf' });

        if (error) {
          process.stdout.write(` ERR(${p})`);
          errors++;
        } else {
          uploaded++;
        }
      }
      console.log(' OK');
    }
  }

  console.log(`\n=== Done: ${uploaded} uploaded, ${errors} errors ===`);
}

main().catch(console.error);
