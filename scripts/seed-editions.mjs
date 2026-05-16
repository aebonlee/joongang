import { createClient } from '@supabase/supabase-js';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import fs from 'fs';
import path from 'path';

const supabase = createClient(
  'https://hcmgdztsgjvzcyxyayaj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjbWdkenRzZ2p2emN5eHlheWFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MzU4ODcsImV4cCI6MjA4NzAxMTg4N30.gznaPzY1l8qDAPsEyYNR9KS7f7VqS3xaw-_2HTSwSZw'
);

// 폰트 로드
const fontDir = path.join(import.meta.dirname, 'fonts');
const fontRegularBytes = fs.readFileSync(path.join(fontDir, 'NotoSansKR-Regular.ttf'));
const fontBoldBytes = fs.readFileSync(path.join(fontDir, 'NotoSansKR-Bold.ttf'));

// 이미지 로드
const imgDir = path.join(import.meta.dirname, 'images');
const imageFiles = ['festival.jpg', 'business.jpg', 'realestate.jpg', 'youth.jpg',
  'weather.jpg', 'economy.jpg', 'community.jpg', 'education.jpg'];
const imageBuffers = imageFiles.map(f => {
  const fp = path.join(imgDir, f);
  return fs.existsSync(fp) ? fs.readFileSync(fp) : null;
}).filter(Boolean);

const EDITIONS = [
  { code: 'AW', label: '워싱턴판', pages: 8 },
  { code: 'AE', label: '동부판', pages: 6 },
];

const START = new Date('2026-05-01');
const END = new Date('2026-05-09');

// 1면 헤드라인
const FRONT_PAGES = [
  {
    headline: '워싱턴 한인사회 봄 축제 개최',
    subhead: '내셔널몰에서 이틀간 1만5천명 참가... 역대 최대 규모',
    body: '워싱턴 D.C. 광역 한인사회가 지난 주말 내셔널몰에서 연례 봄 축제를 개최했다. 이틀간 약 1만5천명이 방문해 역대 최대 참가 기록을 세웠다.\n\n축제에는 전통 공연, 30여 한인 식당의 음식 판매, 한국 문화유산과 K-컬처를 소개하는 전시가 마련됐다.\n\n축제 조직위원장 김성호 씨는 "올해 참가 인원이 모든 예상을 뛰어넘었다"며 "D.C. 지역 한인사회가 계속 성장하고 있음을 보여준다"고 말했다.\n\n주요 행사로는 K-팝 댄스 대회, 한복 패션쇼, 전통 무예 시범이 진행됐으며, 연방 의원 여러 명이 개막식에 참석해 한인사회에 대한 지지를 표명했다.',
  },
  {
    headline: '연방정부 이민정책 개혁안 발표',
    subhead: 'H-1B 등 전문직 비자 프레임워크 대폭 변경',
    body: '바이든 행정부가 월요일 H-1B 및 기타 전문직 비자 프로그램에 대한 포괄적 개혁안을 공개했다. 이는 10여 년 만에 가장 큰 규모의 변화다.\n\n개정안은 신청 절차 간소화, 연간 비자 발급 한도 확대, 미국 대학 졸업 유학생을 위한 새로운 경로 제공 등을 포함한다.\n\n국토안보부 장관은 백악관 브리핑에서 "이번 개혁은 숙련된 이민자들이 우리 경제에 기여하는 핵심적 역할을 인정한 것"이라고 밝혔다.\n\n한인 기업인들은 미국 내 한국 기업 다수가 H-1B 프로그램에 의존하고 있다며 이번 발표를 환영했다.',
  },
  {
    headline: '한인 자영업자 지원 프로그램 확대',
    subhead: 'SBA, DMV 지역 한인 사업자 대상 저금리 대출·멘토링',
    body: '미국 중소기업청(SBA)이 D.C., 메릴랜드, 버지니아 광역 지역 한인 자영업자를 위한 대출 및 멘토링 프로그램 확대를 발표했다.\n\n다음 달 시작되는 이 프로그램은 최대 25만 달러의 저금리 대출을 제공하고, 경험 많은 한인 사업가와 신규 사업자를 짝지어 멘토링을 제공한다.\n\nSBA 지역 관리자는 "한인은 미국에서 가장 기업가 정신이 강한 커뮤니티 중 하나"라며 "이 프로그램이 그들의 성장을 지원할 것"이라고 말했다.\n\n최신 인구조사에 따르면 D.C. 광역 지역에 한인 소유 사업체는 1만2천여 개, 고용 인원은 4만5천명 이상이다.',
  },
  {
    headline: 'DMV 지역 부동산 시장 동향 보고서',
    subhead: '중간 주택 가격 전년 대비 8% 상승... 62만5천 달러',
    body: '워싱턴 D.C. 광역 부동산 시장이 2026년 2분기에도 상승세를 이어갔다. 지역 전체 중간 주택 가격은 62만5천 달러에 달했다.\n\n대규모 한인 커뮤니티가 있는 페어팩스 카운티는 9.2% 가격 상승을 기록했으며, 단독주택 평균 매매가는 72만 달러에 이른다.\n\n한인 부동산 에이전트들은 1세대 이민자들이 한인 커뮤니티가 형성된 지역의 주택을 선호한다고 전했다. 애난데일, 센터빌, 엘리콧시티 등이 대표적이다.',
  },
  {
    headline: '한인 청소년 리더십 캠프 모집',
    subhead: 'CKA 차세대 리더십 펠로우십, 역대 최다 450명 지원',
    body: '미주한인위원회(CKA)는 2026 차세대 리더십 펠로우십에 역대 최다인 450명이 지원했다고 발표했다. 지난해의 두 배 이상이다.\n\n8년차를 맞은 이 펠로우십은 21~35세의 떠오르는 한인 리더 25명을 선발해 정책 세미나, 리더십 교육, 고위 정부 관계자 및 기업인과의 만남 등 집중 여름 프로그램을 제공한다.\n\nCKA 회장 에이브러햄 김 씨는 "증가하는 관심은 한인사회의 공공서비스와 시민 리더십 참여가 늘고 있음을 반영한다"고 말했다.',
  },
  {
    headline: '이번 주 워싱턴 날씨 맑음 지속',
    subhead: '국립기상청, D.C. 지역 금요일까지 쾌청한 날씨 예보',
    body: '워싱턴 D.C. 광역 지역 주민들은 이번 주 화창한 날씨를 기대할 수 있다. 금요일까지 맑은 하늘에 25도 내외의 기온이 이어질 전망이다.\n\n국립기상청 예보에 따르면 햇살과 낮은 습도가 계속되어 야외 활동에 이상적인 조건이다. 주말에는 기온이 약 30도까지 올라갈 수 있다.\n\n지역 한인 단체들은 좋은 날씨를 활용해 한인 골프대회, 등산 모임 등 다양한 야외 행사를 개최할 예정이다.',
  },
  {
    headline: '한미 경제 협력 포럼 성공적 폐막',
    subhead: '23억 달러 신규 투자 약속... 반도체·배터리 분야 집중',
    body: '2026 한미 경제협력 포럼이 워싱턴 D.C.에서 성공적으로 마무리됐다. 양국 기업인과 정부 관계자 200여 명이 3일간 논의에 참여했다.\n\n주요 성과로 한국 기업들의 미국 내 23억 달러 규모 신규 투자 약속이 이뤄졌다. 반도체, 전기차 배터리, 신재생 에너지 분야가 중심이다.\n\n조현동 주미대사는 포럼을 "양국 경제 관계의 이정표"라 평가하며 양국 경제의 심화되는 통합을 강조했다.',
  },
  {
    headline: '메릴랜드 한인 커뮤니티 센터 개관',
    subhead: '엘리콧시티에 1500만 달러 규모 시설... 웨스 무어 주지사 참석',
    body: '메릴랜드주 웨스 무어 주지사가 토요일 하워드 카운티 엘리콧시티에 새로 건립된 한인 커뮤니티 센터 개관식에 참석했다.\n\n1500만 달러 규모의 이 시설은 500석 강당, 한국어 도서관, 회의실, 커뮤니티 행사용 주방, 한인 비영리 단체 사무 공간을 갖추고 있다.\n\n센터 관장 이명자 씨는 "이 센터는 앞으로 여러 세대에 걸쳐 우리 커뮤니티의 거점이 될 것"이라며 "헌신적인 커뮤니티 자원봉사자들의 수년간 모금과 계획의 결과"라고 말했다.',
  },
  {
    headline: '버지니아 한글학교 수업 확대',
    subhead: '한국어 교육 수요 급증... 애쉬번·우드브릿지 신규 캠퍼스',
    body: '북부 버지니아 전역의 한글학교들이 한인 가정과 비한인 학생 모두의 증가하는 수요에 대응해 프로그램을 확대하고 있다.\n\n지역 최대 규모인 워싱턴 한글학교는 올 가을부터 애쉬번과 우드브릿지에 두 곳의 신규 캠퍼스를 개설한다고 발표했다.\n\n최은숙 교장은 "한국 엔터테인먼트와 문화의 세계적 인기에 힘입어 한국어 교육에 대한 관심이 전례 없이 높아지고 있다"고 전했다.',
  },
];

// 내부 페이지 기사
const SECTION_ARTICLES = {
  '지역뉴스': [
    { title: '애난데일 상업지구 리노베이션 계획 승인', body: '페어팩스 카운티 의회가 동부 최대 한인 상권인 애난데일 상업지구의 4500만 달러 규모 리노베이션 계획을 만장일치로 승인했다. 이 프로젝트는 거리 환경 개선, 새 주차 시설, 보행자 친화적 보도 조성을 포함한다. 공사는 내년 상반기에 시작될 예정이며, 지역 한인 사업체들의 영업에 미치는 영향을 최소화하기 위한 단계적 시공이 계획되어 있다.' },
    { title: '한인 노인복지관 개관 20주년 기념', body: '폴스처치의 한인 노인복지관이 20주년 기념행사를 개최했다. 300여 명의 지역 주민이 참석한 가운데 열린 이번 행사에서는 그간의 활동을 되돌아보는 시간이 마련됐다. 복지관은 500여 명의 한인 시니어에게 매일 식사, 건강 검진, 사회 활동, 교통 서비스를 제공하고 있다.' },
  ],
  '경제': [
    { title: '한국계 은행, D.C. 지역 영업 확대', body: '신한은행, 우리은행 등 주요 한국계 은행들이 워싱턴 D.C. 광역 지역 지점 네트워크 확대 계획을 발표했다. 이번 확장은 성장하는 한인 비즈니스 커뮤니티를 겨냥한 것으로, 한미 간 증가하는 교역량을 반영한다. 새 지점은 센터빌과 엘리콧시티에 각각 올해 3분기와 4분기에 개설될 예정이다.' },
    { title: '증시 리캡: 한국 테크 주식 강세', body: '미국 거래소에 상장된 한국 기술 기업들이 이번 주 강세를 보였다. 삼성전자 ADR이 3.2% 상승하며 상승세를 주도했다. 애널리스트들은 반도체 수요 호조와 유리한 환율 변동을 상승 요인으로 꼽았다. SK하이닉스와 LG에너지솔루션도 각각 2.1%, 1.8% 올랐다.' },
  ],
  '사회': [
    { title: '한인 교회 연합, 푸드뱅크 사업 개시', body: 'D.C. 광역 지역 15개 한인 교회 연합이 도움이 필요한 가정을 위한 커뮤니티 푸드뱅크를 시작했다. "나눔의 식탁"이라 명명된 이 사업은 매주 토요일 북부 버지니아와 메릴랜드 3곳에서 식료품을 배분한다. 첫 배분 행사에 200여 가정이 참여했으며, 월 평균 500가정 지원을 목표로 하고 있다.' },
    { title: '반아시안 혐오범죄 태스크포스 성과', body: 'FBI 반아시안 혐오범죄 태스크포스가 D.C. 광역 지역의 신고 건수가 전년 대비 30% 감소했다고 보고했다. 커뮤니티 지도자들은 강화된 경찰 순찰, 방관자 개입 교육, 커뮤니티-법 집행기관 간 파트너십 강화를 그 원인으로 꼽았다.' },
  ],
  '문화': [
    { title: '케네디센터 한국영화제 개막', body: '제12회 한국영화제가 케네디센터에서 최신 화제작 상영으로 개막했다. 일주일간 진행되는 이번 영화제에서는 20편의 영화가 상영되며, 영화감독과의 패널 토론, 한국 영화사 특별 회고전 등이 마련된다. 올해는 특히 젊은 감독들의 작품이 다수 선정되어 주목받고 있다.' },
    { title: '캐피털원 아레나 K-팝 콘서트 매진', body: '워싱턴 D.C. 캐피털원 아레나에서 열리는 대형 K-팝 그룹의 콘서트가 티켓 판매 시작 수 분 만에 매진됐다. 북미 투어의 일환인 이번 공연은 동부 전역에서 팬들이 모일 것으로 예상된다. 주최 측은 추가 공연 검토 중이라고 밝혔다.' },
  ],
  '교육': [
    { title: '센터빌에 한인 SAT 학원 개원', body: '버지니아 센터빌에 한인 학생 대상 SAT 및 대학입시 준비 학원이 새로 문을 열었다. 이 학원은 집중 시험 준비 과정, 대학 입학 상담, 한영 이중 언어 에세이 작성 워크숍을 제공한다. 원장은 "한인 학생들의 특성에 맞는 맞춤형 교육을 제공하겠다"고 밝혔다.' },
    { title: '메릴랜드대, 한국학 프로그램 신설', body: '메릴랜드대학교가 2026년 가을 학기부터 한국학 부전공 프로그램을 신설한다고 발표했다. 한국어, 역사, 정치, 문화 과목을 제공하며, 서울 소재 파트너 대학과의 교환학생 프로그램도 포함된다. 개설 첫 해 30명의 학생을 모집할 계획이다.' },
  ],
  '생활': [
    { title: 'DMV 한식당 베스트 25선 2026', body: 'D.C., 메릴랜드, 버지니아 지역 최고의 한식당 25곳을 선정했다. 애난데일의 전통 한우 불고기 전문점부터 D.C. 다운타운의 퓨전 레스토랑까지 다양하다. 올해 새로 선정된 곳으로는 베데스다의 사찰음식점과 알링턴의 한국식 치킨 체인이 있다. 각 식당의 대표 메뉴와 가격대, 예약 정보를 상세히 안내한다.' },
    { title: '한인 이민자를 위한 건강보험 가이드', body: '미국 건강보험 제도는 한인 이민자들에게 복잡할 수 있다. 이 종합 가이드는 버지니아, 메릴랜드, D.C.에서 이용 가능한 메디케어, 메디케이드, 마켓플레이스 옵션을 다루며, 한국어 등록 지원 자원도 안내한다. 올해부터 달라진 보험료 지원 기준도 상세히 설명한다.' },
  ],
  '오피니언': [
    { title: '[사설] 한인의 시민참여를 높이자', body: '워싱턴 D.C. 지역 한인사회가 계속 성장하는 가운데, 시민참여도 함께 커져야 한다. 한인의 유권자 등록률은 여전히 전국 평균 이하다. 커뮤니티 단체들은 한인들의 민주적 과정 참여를 위한 노력을 배가해야 한다. 특히 젊은 세대의 투표 참여를 독려하는 프로그램이 시급하다.' },
    { title: '[칼럼] 한인 가정의 세대 간 다리 놓기', body: '1세대 한인 이민자와 미국에서 태어난 자녀 사이의 문화적·언어적 격차는 한인 가정이 직면한 가장 큰 도전 중 하나다. 문화유산을 보존하면서 이 격차를 좁히는 길을 찾으려면 양 세대 모두의 의식적인 노력이 필요하다. 가정 내 한국어 사용, 함께하는 문화 활동이 중요한 첫걸음이다.' },
  ],
  '스포츠': [
    { title: '한인 골프대회 결과', body: '중부대서양 한인 골프협회가 버지니아 클리프턴의 웨스트필즈 골프클럽에서 봄 시즌 토너먼트를 개최했다. 120여 명의 골퍼가 이틀간 경기에 참가했으며, 이동원 씨가 합산 142타로 챔피언십 타이틀을 획득했다. 여성부에서는 박서연 씨가 우승을 차지했다.' },
    { title: '한인 유소년 축구리그 시즌 개막', body: '북부 버지니아 한인 유소년 축구리그가 봄 시즌을 개막했다. 4개 연령 디비전에 24개 팀이 경쟁한다. 15년차를 맞은 이 리그는 소규모 주말 프로그램에서 종합 유소년 스포츠 단체로 성장했다. 올해부터 U-8 디비전이 신설되어 더 어린 선수들도 참가할 수 있게 됐다.' },
  ],
};

const SECTION_NAMES_KO = Object.keys(SECTION_ARTICLES);

// 텍스트 줄바꿈 유틸
function wrapText(text, font, fontSize, maxWidth) {
  const lines = [];
  const paragraphs = text.split('\n');
  for (const para of paragraphs) {
    if (para === '') { lines.push(''); continue; }
    const words = para.split('');
    let line = '';
    for (const char of words) {
      const test = line + char;
      if (font.widthOfTextAtSize(test, fontSize) > maxWidth) {
        lines.push(line);
        line = char;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

async function createPdf(date, editionCode, editionLabel, pageNum, totalPages) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const fontR = await doc.embedFont(fontRegularBytes);
  const fontB = await doc.embedFont(fontBoldBytes);

  // 이미지 임베드
  const imgIdx = (date.getDate() + pageNum) % imageBuffers.length;
  let embeddedImg = null;
  try {
    embeddedImg = await doc.embedJpg(imageBuffers[imgIdx]);
  } catch { /* skip */ }

  const page = doc.addPage([595.28, 841.89]); // A4
  const { width, height } = page.getSize();

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const dateStr = `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;

  const mL = 35;
  const mR = width - 35;
  const cW = mR - mL;

  // ===== 마스트헤드 =====
  page.drawRectangle({ x: 0, y: height - 4, width, height: 4, color: rgb(0.78, 0.06, 0.18) });

  page.drawText('중앙일보', { x: width / 2 - 55, y: height - 42, size: 30, font: fontB, color: rgb(0, 0, 0) });
  page.drawText('WASHINGTON D.C.', { x: width / 2 - 48, y: height - 56, size: 9, font: fontR, color: rgb(0.45, 0.45, 0.45) });

  page.drawText(dateStr, { x: mL, y: height - 56, size: 9, font: fontR, color: rgb(0.35, 0.35, 0.35) });
  page.drawText(`${editionLabel}  |  ${pageNum}면`, { x: mR - 80, y: height - 56, size: 9, font: fontR, color: rgb(0.35, 0.35, 0.35) });

  page.drawLine({ start: { x: mL, y: height - 63 }, end: { x: mR, y: height - 63 }, thickness: 1.5, color: rgb(0, 0, 0) });
  page.drawLine({ start: { x: mL, y: height - 66 }, end: { x: mR, y: height - 66 }, thickness: 0.5, color: rgb(0, 0, 0) });

  if (pageNum === 1) {
    // ===== 1면 =====
    const fp = FRONT_PAGES[(date.getDate() - 1) % FRONT_PAGES.length];
    let y = height - 95;

    // 헤드라인
    const hlLines = wrapText(fp.headline, fontB, 28, cW);
    for (const line of hlLines) {
      page.drawText(line, { x: mL, y, size: 28, font: fontB, color: rgb(0, 0, 0) });
      y -= 34;
    }

    // 부제목
    const shLines = wrapText(fp.subhead, fontR, 13, cW);
    for (const line of shLines) {
      page.drawText(line, { x: mL, y, size: 13, font: fontR, color: rgb(0.3, 0.3, 0.3) });
      y -= 17;
    }
    y -= 5;

    page.drawLine({ start: { x: mL, y }, end: { x: mR, y }, thickness: 0.5, color: rgb(0.75, 0.75, 0.75) });
    y -= 12;

    page.drawText('워싱턴 | 중앙일보 취재팀', { x: mL, y, size: 9, font: fontR, color: rgb(0.5, 0.5, 0.5) });
    y -= 18;

    // 이미지
    if (embeddedImg) {
      const imgH = 180;
      const imgW = cW;
      page.drawImage(embeddedImg, { x: mL, y: y - imgH, width: imgW, height: imgH });
      y -= imgH + 6;
      page.drawText('▲ 연합뉴스 제공', { x: mL, y, size: 8, font: fontR, color: rgb(0.5, 0.5, 0.5) });
      y -= 16;
    }

    // 본문 (2단)
    const colW = (cW - 14) / 2;
    const bodyLines = wrapText(fp.body, fontR, 9.5, colW);
    const half = Math.ceil(bodyLines.length / 2);
    let ly = y, ry = y;

    for (let i = 0; i < bodyLines.length; i++) {
      const line = bodyLines[i];
      if (i < half) {
        if (line === '') { ly -= 6; continue; }
        page.drawText(line, { x: mL, y: ly, size: 9.5, font: fontR, color: rgb(0.12, 0.12, 0.12) });
        ly -= 13;
      } else {
        if (line === '') { ry -= 6; continue; }
        page.drawText(line, { x: mL + colW + 14, y: ry, size: 9.5, font: fontR, color: rgb(0.12, 0.12, 0.12) });
        ry -= 13;
      }
    }

    // 단 구분선
    page.drawLine({
      start: { x: mL + colW + 7, y: y + 3 }, end: { x: mL + colW + 7, y: Math.min(ly, ry) - 5 },
      thickness: 0.4, color: rgb(0.82, 0.82, 0.82),
    });

    // 하단 목차
    page.drawLine({ start: { x: mL, y: 65 }, end: { x: mR, y: 65 }, thickness: 1, color: rgb(0, 0, 0) });
    page.drawText('오늘의 지면', { x: mL, y: 50, size: 10, font: fontB, color: rgb(0.78, 0.06, 0.18) });
    const toc = ['지역뉴스....2면', '경제....3면', '사회....4면', '문화....5면', '오피니언....6면', '스포츠....7면'];
    toc.forEach((s, i) => {
      page.drawText(s, { x: mL + (i % 3) * (cW / 3), y: i < 3 ? 35 : 20, size: 9, font: fontR, color: rgb(0.3, 0.3, 0.3) });
    });

  } else {
    // ===== 내부 페이지 =====
    const secName = SECTION_NAMES_KO[(pageNum - 2) % SECTION_NAMES_KO.length];
    const articles = SECTION_ARTICLES[secName];
    let y = height - 85;

    // 섹션 바
    page.drawRectangle({ x: mL, y: y - 3, width: cW, height: 20, color: rgb(0.78, 0.06, 0.18) });
    page.drawText(secName, { x: mL + 8, y: y, size: 12, font: fontB, color: rgb(1, 1, 1) });
    page.drawText(`중앙일보  |  ${pageNum}면`, { x: mR - 100, y: y, size: 9, font: fontR, color: rgb(1, 1, 1) });
    y -= 32;

    // 2단
    const colW = (cW - 18) / 2;
    for (let ai = 0; ai < 2 && ai < articles.length; ai++) {
      const art = articles[ai];
      const cx = mL + ai * (colW + 18);
      let ay = y;

      // 기사 제목
      const titleLines = wrapText(art.title, fontB, 15, colW);
      for (const line of titleLines) {
        page.drawText(line, { x: cx, y: ay, size: 15, font: fontB, color: rgb(0, 0, 0) });
        ay -= 19;
      }
      ay -= 2;

      page.drawLine({ start: { x: cx, y: ay }, end: { x: cx + colW, y: ay }, thickness: 0.4, color: rgb(0.8, 0.8, 0.8) });
      ay -= 12;

      page.drawText('중앙일보 기자', { x: cx, y: ay, size: 8, font: fontR, color: rgb(0.5, 0.5, 0.5) });
      ay -= 14;

      // 이미지
      if (embeddedImg) {
        const iH = 110;
        page.drawImage(embeddedImg, { x: cx, y: ay - iH, width: colW, height: iH });
        ay -= iH + 10;
      }

      // 본문
      const bodyLines = wrapText(art.body, fontR, 9, colW);
      for (const line of bodyLines) {
        if (ay < 85) break;
        if (line === '') { ay -= 5; continue; }
        page.drawText(line, { x: cx, y: ay, size: 9, font: fontR, color: rgb(0.15, 0.15, 0.15) });
        ay -= 12;
      }
    }

    // 단 구분선
    page.drawLine({
      start: { x: mL + colW + 9, y: y + 3 }, end: { x: mL + colW + 9, y: 85 },
      thickness: 0.4, color: rgb(0.85, 0.85, 0.85),
    });

    // 하단 광고
    page.drawRectangle({
      x: mL, y: 30, width: cW, height: 48,
      color: rgb(0.96, 0.96, 0.96), borderColor: rgb(0.88, 0.88, 0.88), borderWidth: 0.5,
    });
    page.drawText('광 고', { x: width / 2 - 13, y: 48, size: 11, font: fontR, color: rgb(0.72, 0.72, 0.72) });
  }

  // 페이지 번호
  page.drawLine({ start: { x: mL, y: 20 }, end: { x: mR, y: 20 }, thickness: 0.4, color: rgb(0.8, 0.8, 0.8) });
  page.drawText(`${pageNum}`, { x: width / 2 - 4, y: 8, size: 9, font: fontB, color: rgb(0.4, 0.4, 0.4) });

  return await doc.save();
}

async function main() {
  console.log('=== 한글 PDF 생성 + 업로드 ===\n');

  let uploaded = 0, errors = 0;

  for (let d = new Date(START); d <= END; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay();
    const editionsForDay = dayOfWeek === 0 ? [EDITIONS[0]] : EDITIONS;

    for (const edition of editionsForDay) {
      const pageCount = edition.pages - (d.getDate() % 3 === 0 ? 2 : 0);
      process.stdout.write(`[${dateStr}] ${edition.code} ${pageCount}면...`);

      for (let p = 1; p <= pageCount; p++) {
        const pdfBytes = await createPdf(d, edition.code, edition.label, p, pageCount);
        const fileName = `${edition.code}-${dateStr}-${String(p).padStart(2, '0')}.pdf`;
        const storagePath = `editions/${dateStr}/${edition.code}/${fileName}`;

        await supabase.storage.from('joongang-editions').remove([storagePath]);
        const { error } = await supabase.storage
          .from('joongang-editions')
          .upload(storagePath, pdfBytes, { contentType: 'application/pdf' });

        if (error) {
          process.stdout.write(` X(${p})`);
          errors++;
        } else {
          uploaded++;
        }
      }
      console.log(' OK');
    }
  }

  console.log(`\n=== 완료: ${uploaded}개 업로드, ${errors}개 오류 ===`);
}

main().catch(console.error);
