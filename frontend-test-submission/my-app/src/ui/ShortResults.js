import React from 'react';

export default function ShortResults({ items = [], logger }) {
  if (!items || items.length === 0) return null;
  return (
    <div className="results-list card" style={{ marginTop: 16 }}>
      <h3>Created Short Links</h3>
      {items.map(it => (
        <div className="link-line" key={it.shortcode}>
          <div className="link-left">
            <a className="short-link" href={`/${it.shortcode}`}>{window.location.origin}/{it.shortcode}</a>
            <div className="meta">Original: {it.longUrl}</div>
            <div className="meta">Expires: {new Date(it.expiresAt).toLocaleString()}</div>
          </div>
          <div>
            <a className="button secondary" href={`/stats`}>View Stats</a>
          </div>
        </div>
      ))}
    </div>
  );
}
