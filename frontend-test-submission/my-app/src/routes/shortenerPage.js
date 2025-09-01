import React, { useState } from 'react';
import ShortenRow from '../ui/ShortenRow.js';
import ShortResults from '../ui/ShortResults.js';
import { createShort } from '../services/shortener.js';

export default function ShortenerPage({ logger }) {
  const [rows, setRows] = useState([{}, {}, {}, {}, {}]);
  const [created, setCreated] = useState([]);
  const [error, setError] = useState(null);

  function onRowChange(idx, data) {
    const copy = [...rows];
    copy[idx] = data;
    setRows(copy);
  }

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const outputs = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r || !r.longUrl) continue;
      try {
        const validity = r.validity !== undefined && r.validity !== '' ? parseInt(r.validity, 10) : undefined;
        if (r.validity !== undefined && r.validity !== '' && (!Number.isInteger(validity) || validity <= 0)) {
          throw new Error('INVALID_VALIDITY');
        }
        const mapping = createShort({ longUrl: r.longUrl.trim(), validityMinutes: validity, preferredShortcode: r.shortcode ? r.shortcode.trim() : null }, logger);
        outputs.push(mapping);
      } catch (err) {
        setError(err.message);
        logger.warn('SHORTEN_FAILED', { rowIndex: i, err: err.message });
      }
    }
    if (outputs.length) setCreated(prev => outputs.concat(prev));
  }

  function reset() {
    setRows([{}, {}, {}, {}, {}]);
    setError(null);
  }

  return (
    <div className="card">
      <h2>Shorten URLs</h2>
      <p className="small-muted">You can shorten up to 5 URLs at once. Default validity is 30 minutes.</p>
      {error && <div className="error">Error: {error}</div>}
      <form onSubmit={onSubmit}>
        {rows.map((r, i) => <ShortenRow key={i} index={i} onChange={(d) => onRowChange(i, d)} />)}
        <div style={{ marginTop: 14 }}>
          <button className="button" type="submit">Create Short Links</button>
          <button type="button" className="button secondary" onClick={reset} style={{ marginLeft: 8 }}>Reset</button>
        </div>
      </form>
      <ShortResults items={created} logger={logger} />
    </div>
  );
}
