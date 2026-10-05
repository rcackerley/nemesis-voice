// Pure utility functions used by the app and by Node tests
// Exported as ES modules (package.json sets "type":"module")

/**
 * Compute per-item delays preserving the original speaking cadence.
 * - First item should play immediately (0 ms)
 * - Each subsequent delay is time[i] - time[i-1], clamped to sane bounds
 *
 * @param {number[]} timesMs - Monotonic timestamps (e.g., performance.now()) for each final word
 * @param {{ clampMinMs?: number, clampMaxMs?: number }} [opts]
 * @returns {number[]} delaysMs - Array of length timesMs.length, starting with 0
 */
export function computeDelays(timesMs, opts = {}) {
  const { clampMinMs = 0, clampMaxMs = Number.POSITIVE_INFINITY } = opts;
  if (!Array.isArray(timesMs) || timesMs.length === 0) return [];
  const delays = new Array(timesMs.length).fill(0);
  for (let i = 1; i < timesMs.length; i++) {
    let d = Math.max(0, timesMs[i] - timesMs[i - 1]);
    if (Number.isFinite(clampMaxMs)) d = Math.min(d, clampMaxMs);
    if (clampMinMs > 0) d = Math.max(d, clampMinMs);
    delays[i] = Math.round(d); // integer ms is sufficient for setTimeout
  }
  return delays;
}

// Normalization dictionary for common color/symbol words used in Warcraft
const CANONICAL = {
  // colors
  red: 'red',
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  orange: 'orange',
  purple: 'purple',
  violet: 'purple',
  pink: 'pink',
  magenta: 'magenta',
  cyan: 'cyan',
  teal: 'teal',
  white: 'white',
  black: 'black',
  grey: 'gray',
  gray: 'gray',
  brown: 'brown',
  // symbols (WoW raid markers + common)
  star: 'star',
  circle: 'circle',
  diamond: 'diamond',
  triangle: 'triangle',
  square: 'square',
  moon: 'moon',
  cross: 'cross',
  x: 'cross',
  ex: 'cross',
  skull: 'skull',
  sun: 'sun',
  arrow: 'arrow',
  heart: 'heart',
  skulls: 'skull',
};

/**
 * Normalize common color/symbol tokens inside a free-form utterance.
 * - Case-insensitive
 * - If multiple known tokens are present (e.g., "red triangle"), returns "red triangle"
 * - If none are known, returns the original trimmed string
 * @param {string} raw
 * @returns {string}
 */
export function normalizeWord(raw) {
  if (!raw) return '';
  const lower = String(raw).toLowerCase().trim();
  // Tokenize words (keep letters only)
  const tokens = lower.match(/[a-z]+/g) || [];
  if (tokens.length === 0) return raw.trim();
  const normalizedTokens = tokens.map(t => CANONICAL[t] || t);
  // If at least one token was canonicalized or recognized, return joined tokens
  const anyKnown = tokens.some(t => CANONICAL[t]);
  if (anyKnown) return normalizedTokens.join(' ');
  return raw.trim();
}

