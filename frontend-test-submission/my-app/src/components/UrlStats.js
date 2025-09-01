import React from "react";
import { createLogger } from "../loggingMiddleware";

const logger = createLogger("UrlStats");

function UrlStats({ stats }) {
  return (
    <div className="stats-container">
      <h2>URL Statistics</h2>
      {stats.length === 0 && <p>No URLs shortened yet.</p>}
      <ul>
        {stats.map((s, idx) => (
          <li key={idx}>
            <p><b>Original:</b> {s.originalUrl}</p>
            <p><b>Short:</b> <a href={s.shortUrl}>{s.shortUrl}</a></p>
            <p><b>Expiry:</b> {s.expiry}</p>
            <p><b>Clicks:</b> {s.clicks || 0}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UrlStats;
