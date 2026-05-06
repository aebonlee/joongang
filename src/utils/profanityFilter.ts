/**
 * Profanity / Abuse Filter Utility
 * ---------------------------------
 * - Korean profanity, slurs, and hate speech detection
 * - English profanity detection
 * - Bypass detection (spaced characters, character substitution)
 *
 * Exports:
 *   normalizeText(text)        - strip spaces, lowercase, undo substitutions
 *   containsProfanity(text)    - check text; returns { isClean, reason? }
 *   sanitizeForDisplay(text)   - replace matched words with ***
 */

// ---------------------------------------------------------------------------
// 1. Word lists
// ---------------------------------------------------------------------------

/** Korean profanity / slurs / hate speech (including common variations) */
const KOREAN_PROFANITY: string[] = [
  // ㅅㅂ 계열
  '시발', '씨발', '씨빨', '씨팔', '씨벌', '시벌', '시팔', '씹발', '씹팔',
  'ㅅㅂ', 'ㅆㅂ', '시발놈', '씨발놈', '시발년', '씨발년',

  // ㅂㅅ 계열
  '병신', '빙신', '병딱', '병먹', 'ㅂㅅ',

  // 개- 계열
  '개새끼', '개색끼', '개색기', '개세끼', '개쉐끼', '개쉑', '개쌔끼',
  '개자식', '개년', '개놈', '개돼지', '개같은', '개소리', '개지랄',
  '개씹', '개좆',

  // ㅈ 계열
  '좆', '좃', '조까', '좆까', '졸라', '존나', '존니', '존못', '좆같',
  'ㅈㄹ', 'ㅈㄲ',

  // 미친- 계열
  '미친놈', '미친년', '미친새끼', '미친것', '미친개', '미친',

  // 닥쳐 / 꺼져
  '닥쳐', '닥치', '닥치세요', '닥쳐라', '꺼져', '꺼저', '꺼지',

  // 새끼
  '새끼', '색끼', '쌔끼', '섹끼',

  // 기타 욕설
  '지랄', '지랄하', '찐따', '찐다', '씹새', '씹덕', '씹창', '씹치',
  '엠창', '엠병', '느금마', '느금', '니미', '니애미', '니애비',
  '뒤질', '뒤져', '뒤져라', '뒤졌', '뒈질', '뒈져',
  '쓰레기같은', '쓰레기새끼',
  '한남', '한녀',
  '틀딱', '급식충',
  '걸레', '걸레년',
  '창녀', '창년',
  '화냥년',
  '보지', '자지',
  '육변기',
  '김치녀', '김치남',
  '맘충',
  '재기해', '재기하',
  '자살해', '자살하',
  '뒤져라',
  '엿먹어', '엿이나',
  '상놈', '상년',
  '못난놈', '못난년',
  '바보새끼',
  '멍청이', '멍청한',
  '등신', '또라이',
  '썩을', '썩어빠진',
  '후레자식', '후레아들',
  '애자', '장애인비하',
  '쪽바리', '짱깨', '짱개', '깜둥이', '흑형',
];

/** English profanity */
const ENGLISH_PROFANITY: string[] = [
  'fuck', 'fucking', 'fucked', 'fucker', 'motherfucker', 'motherfucking',
  'shit', 'shitty', 'shitting', 'bullshit',
  'bitch', 'bitchy', 'bitches', 'sonofabitch',
  'asshole', 'arsehole', 'ass',
  'bastard', 'bastards',
  'damn', 'dammit', 'goddamn',
  'dick', 'dickhead',
  'cock', 'cocksucker',
  'cunt', 'cunts',
  'whore', 'slut', 'slutty',
  'piss', 'pissed', 'pissoff',
  'crap', 'crappy',
  'nigger', 'nigga', 'negro',
  'faggot', 'fag',
  'retard', 'retarded',
  'twat',
  'wanker', 'wank',
  'bollocks',
  'arse',
  'jackass',
  'douche', 'douchebag',
  'stfu', 'gtfo', 'lmfao',
  'wtf',
];

// ---------------------------------------------------------------------------
// 2. Character-substitution map (number / special char -> letter)
// ---------------------------------------------------------------------------

const SUBSTITUTION_MAP: Record<string, string> = {
  '0': 'o',
  '1': 'i',
  '2': 'z',
  '3': 'e',
  '4': 'a',
  '5': 's',
  '6': 'g',
  '7': 't',
  '8': 'b',
  '9': 'g',
  '@': 'a',
  '$': 's',
  '!': 'i',
  '|': 'i',
  '+': 't',
  '(': 'c',
  '<': 'c',
  '&': 'and',
  '#': 'h',
  '%': 'x',
};

// ---------------------------------------------------------------------------
// 3. Korean Jamo (consonant-only) expansion
//    e.g. "ㅅㅂ" -> "시발" pattern already in list,
//    but we also want to catch when users type jamo only.
// ---------------------------------------------------------------------------

const KOREAN_JAMO_SLANG: Record<string, string[]> = {
  'ㅅㅂ': ['시발', '씨발'],
  'ㅆㅂ': ['씨발'],
  'ㅂㅅ': ['병신'],
  'ㅈㄹ': ['지랄'],
  'ㅈㄲ': ['좆까', '조까'],
  'ㄲㅈ': ['꺼져'],
  'ㄷㅊ': ['닥쳐'],
  'ㅁㅊ': ['미친'],
  'ㄴㄱㅁ': ['느금마'],
  'ㅅㅋ': ['새끼'],
  'ㄱㅅㄲ': ['개새끼'],
  'ㅆㄹㄱ': ['쓰레기'],
};

// ---------------------------------------------------------------------------
// 4. normalizeText
// ---------------------------------------------------------------------------

/**
 * Normalize input text for profanity matching.
 * - Removes all whitespace (including between characters to defeat spacing tricks)
 * - Converts to lowercase
 * - Applies character substitution map (0->o, @->a, $->s, etc.)
 * - Strips common decorative / separator characters (dots, dashes, underscores, asterisks)
 */
export function normalizeText(text: string): string {
  // 1. Lowercase
  let normalized = text.toLowerCase();

  // 2. Remove whitespace (spaces, tabs, zero-width chars, etc.)
  normalized = normalized.replace(/[\s\u200B\u200C\u200D\uFEFF]+/g, '');

  // 3. Remove common separator / decorative characters
  normalized = normalized.replace(/[.\-_*~,;:!?'"^`]+/g, '');

  // 4. Apply character substitutions
  let result = '';
  for (const char of normalized) {
    result += SUBSTITUTION_MAP[char] ?? char;
  }

  return result;
}

// ---------------------------------------------------------------------------
// 5. containsProfanity
// ---------------------------------------------------------------------------

export interface ProfanityResult {
  isClean: boolean;
  reason?: string;
}

/**
 * Check whether the given text contains profanity or hate speech.
 *
 * Returns `{ isClean: true }` when clean.
 * Returns `{ isClean: false, reason }` when profanity is found.
 */
export function containsProfanity(text: string): ProfanityResult {
  if (!text || text.trim().length === 0) {
    return { isClean: true };
  }

  const normalized = normalizeText(text);

  // --- Korean jamo shorthand check (on original text, spaces removed) ---
  const spaceless = text.replace(/\s+/g, '');
  for (const jamo of Object.keys(KOREAN_JAMO_SLANG)) {
    if (spaceless.includes(jamo)) {
      return {
        isClean: false,
        reason: '욕설이 포함된 글은 등록할 수 없습니다.',
      };
    }
  }

  // --- Korean profanity check ---
  for (const word of KOREAN_PROFANITY) {
    // Normalize the dictionary word the same way so matching is consistent
    const normalizedWord = normalizeText(word);
    if (normalized.includes(normalizedWord)) {
      return {
        isClean: false,
        reason: '욕설이 포함된 글은 등록할 수 없습니다.',
      };
    }
  }

  // --- English profanity check ---
  for (const word of ENGLISH_PROFANITY) {
    const normalizedWord = normalizeText(word);
    if (normalized.includes(normalizedWord)) {
      return {
        isClean: false,
        reason: '비방/혐오 표현이 포함되어 있습니다.',
      };
    }
  }

  return { isClean: true };
}

// ---------------------------------------------------------------------------
// 6. sanitizeForDisplay
// ---------------------------------------------------------------------------

/**
 * Replace any profanity found in `text` with `***`.
 * Works on the *original* text by locating matching substrings.
 */
export function sanitizeForDisplay(text: string): string {
  if (!text || text.trim().length === 0) {
    return text;
  }

  let sanitized = text;

  // Build a combined list of all words to scan for
  const allWords: string[] = [...KOREAN_PROFANITY, ...ENGLISH_PROFANITY];

  // Sort by length descending so longer matches are replaced first
  allWords.sort((a, b) => b.length - a.length);

  for (const word of allWords) {
    // Create a regex that allows optional whitespace / separators between
    // each character of the word, making it resilient to spacing tricks.
    const escapedChars = [...word].map((ch) =>
      ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const pattern = escapedChars.join('[\\s.\\-_*~]*');
    const regex = new RegExp(pattern, 'gi');
    sanitized = sanitized.replace(regex, '***');
  }

  // Also replace Korean jamo shorthand patterns
  for (const jamo of Object.keys(KOREAN_JAMO_SLANG)) {
    const escapedChars = [...jamo].map((ch) =>
      ch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const pattern = escapedChars.join('[\\s.\\-_*~]*');
    const regex = new RegExp(pattern, 'gi');
    sanitized = sanitized.replace(regex, '***');
  }

  return sanitized;
}
