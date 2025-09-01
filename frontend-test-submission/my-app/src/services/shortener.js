import { readAll, saveMapping, getMapping } from './storage.js';

const DEFAULT_VALIDITY_MINUTES = 30;
const MIN_LEN = 4, MAX_LEN = 20;
const ALPHANUM = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function isValidShortcodeFormat(sc) {
  if (!sc || typeof sc !== 'string') return false;
  if (sc.length < MIN_LEN || sc.length > MAX_LEN) return false;
  return /^[A-Za-z0-9]+$/.test(sc);
}

function randomStr(len = 6) {
  let out = '';
  for (let i = 0; i < len; i++) out += ALPHANUM[Math.floor(Math.random() * ALPHANUM.length)];
  return out;
}

function chooseUnique(preferred = null) {
  const all = readAll();
  if (preferred) {
    const p = String(preferred).trim();
    if (!isValidShortcodeFormat(p)) throw new Error('INVALID_SHORTCODE_FORMAT');
    if (all[p]) throw new Error('SHORTCODE_TAKEN');
    return p;
  }
  for (let len = 4; len <= 8; len++) {
    for (let a = 0; a < 30; a++) {
      const s = randomStr(len);
      if (!all[s]) return s;
    }
  }
  while (true) {
    const s = randomStr(10);
    if (!readAll()[s]) return s;
  }
}

export function createShort({ longUrl, validityMinutes, preferredShortcode }, logger) {
  try { new URL(longUrl); } catch (e) { logger.warn('INVALID_URL', { longUrl }); throw new Error('INVALID_URL'); }
  const mins = Number.isInteger(validityMinutes) ? validityMinutes : null;
  const validity = (mins && mins > 0) ? mins : DEFAULT_VALIDITY_MINUTES;

  let code;
  try { code = chooseUnique(preferredShortcode ? preferredShortcode.trim() : null); }
  catch (e) { logger.warn('SHORTCODE_ERROR', { err: e.message }); throw e; }

  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + validity * 60000).toISOString();

  const mapping = { shortcode: code, longUrl, createdAt, expiresAt, clicks: 0, clickDetails: [] };
  saveMapping(code, mapping);
  logger.info('SHORTLINK_CREATED', { shortcode: code, longUrl, createdAt, expiresAt });
  return mapping;
}

export function recordClick(shortcode, meta, logger) {
  const mapping = getMapping(shortcode);
  if (!mapping) { logger.warn('CLICK_TO_MISSING', { shortcode }); return null; }
  const now = new Date();
  if (new Date(mapping.expiresAt) < now) { logger.warn('CLICK_TO_EXPIRED', { shortcode }); return { expired: true }; }
  mapping.clicks = (mapping.clicks || 0) + 1;
  mapping.clickDetails = mapping.clickDetails || [];
  mapping.clickDetails.push({ ts: now.toISOString(), meta });
  saveMapping(shortcode, mapping);
  logger.info('CLICK_RECORDED', { shortcode, meta });
  return { expired: false, mapping };
}
