// logging-middleware/index.js
// ESM module. No console.log. Persists structured logs to localStorage.

function nowISO() {
  return new Date().toISOString();
}

export function initLogger(options = {}) {
  const namespace = options.namespace || 'LM_DEFAULT';
  const persist = options.persist === false ? false : true;
  const storageKey = `lm:${namespace}`;

  function read() {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]'); }
    catch { return []; }
  }

  function write(arr) {
    try { localStorage.setItem(storageKey, JSON.stringify(arr)); } catch {}
  }

  function push(entry) {
    if (!persist) return;
    const arr = read();
    arr.push(entry);
    if (arr.length > 2000) arr.splice(0, arr.length - 2000);
    write(arr);
    // Optionally show in DOM debug area if exists
    const box = document.getElementById('lm-logs');
    if (box) {
      const el = document.createElement('div');
      el.style.fontSize = '11px';
      el.style.borderBottom = '1px solid #eee';
      el.textContent = `[${entry.ts}] [${entry.level.toUpperCase()}] ${entry.message}`;
      box.appendChild(el);
    }
  }

  function build(level, message, meta) {
    const entry = { ts: nowISO(), namespace, level, message, meta: meta || null };
    push(entry);
    return entry;
  }

  return {
    debug: (message, meta) => build('debug', message, meta),
    info:  (message, meta) => build('info', message, meta),
    warn:  (message, meta) => build('warn', message, meta),
    error: (message, meta) => build('error', message, meta),
    getLogs: () => read(),
    clearLogs: () => { try { localStorage.removeItem(storageKey); } catch {} },
    namespace
  };
}
