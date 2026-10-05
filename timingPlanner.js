export function computeDelays(timesMs, opts = {}) {
  const { clampMinMs = 0, clampMaxMs = Number.POSITIVE_INFINITY } = opts;
  if (!Array.isArray(timesMs) || timesMs.length === 0) return [];
  const delays = new Array(timesMs.length).fill(0);
  for (let i = 1; i < timesMs.length; i++) {
    let d = Math.max(0, timesMs[i] - timesMs[i - 1]);
    if (Number.isFinite(clampMaxMs)) d = Math.min(d, clampMaxMs);
    if (clampMinMs > 0) d = Math.max(d, clampMinMs);
    delays[i] = Math.round(d);
  }
  return delays;
}

const CANONICAL = {
  red: 'red', blue: 'blue', green: 'green', yellow: 'yellow', orange: 'orange',
  purple: 'purple', violet: 'purple', pink: 'pink', magenta: 'magenta', cyan: 'cyan',
  teal: 'teal', white: 'white', black: 'black', grey: 'gray', gray: 'gray', brown: 'brown',
  star: 'star', circle: 'circle', diamond: 'diamond', triangle: 'triangle', square: 'square',
  moon: 'moon', cross: 'cross', x: 'cross', ex: 'cross', skull: 'skull', sun: 'sun',
  arrow: 'arrow', heart: 'heart', skulls: 'skull',
};

export function normalizeWord(raw) {
  if (!raw) return '';
  const lower = String(raw).toLowerCase().trim();
  const tokens = lower.match(/[a-z]+/g) || [];
  if (tokens.length === 0) return raw.trim();
  const normalizedTokens = tokens.map(t => CANONICAL[t] || t);
  const anyKnown = tokens.some(t => CANONICAL[t]);
  if (anyKnown) return normalizedTokens.join(' ');
  return raw.trim();
}
