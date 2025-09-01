import React from 'react';

export default function ShortenRow({ index, onChange }) {
  const [longUrl, setLongUrl] = React.useState('');
  const [validity, setValidity] = React.useState('');
  const [shortcode, setShortcode] = React.useState('');

  React.useEffect(() => { onChange({ longUrl, validity, shortcode }); }, [longUrl, validity, shortcode]);

  return (
    <div className="form-row">
      <input type="text" placeholder="Long URL (https://...)" value={longUrl} onChange={(e) => setLongUrl(e.target.value)} />
      <input className="small" type="number" placeholder="Validity (mins)" value={validity} onChange={(e) => setValidity(e.target.value)} />
      <input className="small" type="text" placeholder="Custom shortcode (optional)" value={shortcode} onChange={(e) => setShortcode(e.target.value)} />
    </div>
  );
}
