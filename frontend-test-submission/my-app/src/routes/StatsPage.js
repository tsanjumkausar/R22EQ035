import React from 'react';
import { readAll } from '../services/storage.js';

export default function StatsPage({ logger }) {
  const [mappings, setMappings] = React.useState({});

  React.useEffect(() => {
    const all = readAll();
    setMappings(all);
    logger.info('STATS_VIEWED', { count: Object.keys(all).length });
  }, []);

  const keys = Object.keys(mappings).sort((a, b) => new Date(mappings[b].createdAt) - new Date(mappings[a].createdAt));

  return (
    <div className="card">
      <h2>Short Link Statistics</h2>
      <div>
        {keys.length === 0 && <div className="small-muted">No links created yet.</div>}
        {keys.map(k => {
          const m = mappings[k];
          return (
            <div className="card stat-card" key={k}>
              <div><strong>Short:</strong> <a className="short-link" href={`/${m.shortcode}`}>{window.location.origin}/{m.shortcode}</a></div>
              <div className="meta">Original: {m.longUrl}</div>
              <div className="meta">Created: {new Date(m.createdAt).toLocaleString()} | Expires: {new Date(m.expiresAt).toLocaleString()}</div>
              <div className="meta">Total Clicks: {m.clicks || 0}</div>

              <div style={{ marginTop: 8 }}>
                <div className="small-muted">Click details (newest first):</div>
                {(m.clickDetails || []).slice().reverse().map((c, idx) => (
                  <div key={idx} className="stat-click">
                    <div>{new Date(c.ts).toLocaleString()}</div>
                    <div>Source: {c.meta?.referrer || 'direct'}</div>
                    <div>Coarse location: {c.meta?.locale || 'unknown'}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
