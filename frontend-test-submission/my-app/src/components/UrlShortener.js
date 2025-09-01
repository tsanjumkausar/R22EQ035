import React, { useState } from "react";
import { createLogger } from "../loggingMiddleware";
import "./UrlShortener.css";

const logger = createLogger("UrlShortener");

function UrlShortener({ clientId, onShortened }) {
  const [urls, setUrls] = useState([{ longUrl: "", validity: "", shortcode: "" }]);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: "", validity: "", shortcode: "" }]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let u of urls) {
      if (!/^https?:\/\/.+/.test(u.longUrl)) {
        alert("Invalid URL format!");
        logger.error("Invalid URL entered", { url: u.longUrl });
        return;
      }
    }

    try {
      const responses = await Promise.all(
        urls.map((u) =>
          fetch("http://localhost:5000/api/shorten", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              longUrl: u.longUrl,
              validity: u.validity ? parseInt(u.validity) : 30,
              shortcode: u.shortcode || undefined,
              clientId
            })
          }).then((res) => res.json())
        )
      );

      onShortened(responses);
      logger.info("URLs shortened successfully", { count: responses.length });
    } catch (err) {
      logger.error("Failed to shorten URLs", { error: err.message });
    }
  };

  return (
    <div className="shortener-container">
      <h2>Shorten Your URLs</h2>
      <form onSubmit={handleSubmit}>
        {urls.map((u, idx) => (
          <div key={idx} className="url-row">
            <input
              type="text"
              placeholder="Enter Long URL"
              value={u.longUrl}
              onChange={(e) => handleChange(idx, "longUrl", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Validity (minutes)"
              value={u.validity}
              onChange={(e) => handleChange(idx, "validity", e.target.value)}
            />
            <input
              type="text"
              placeholder="Custom Shortcode (optional)"
              value={u.shortcode}
              onChange={(e) => handleChange(idx, "shortcode", e.target.value)}
            />
          </div>
        ))}
        {urls.length < 5 && <button type="button" onClick={addField}>+ Add More</button>}
        <button type="submit">Shorten</button>
      </form>
    </div>
  );
}

export default UrlShortener;
