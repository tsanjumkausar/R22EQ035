// simple localStorage-based storage (JS)
const KEY = 'url_shortener_v1';

export function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
}

export function writeAll(obj) {
  try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch {}
}

export function getMapping(code) {
  const all = readAll();
  return all[code] || null;
}

export function saveMapping(code, mapping) {
  const all = readAll();
  all[code] = mapping;
  writeAll(all);
}

export function removeMapping(code) {
  const all = readAll();
  delete all[code];
  writeAll(all);
}
