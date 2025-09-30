// api/fake.js
import fetch from 'node-fetch';

const AUTH_TOKEN = process.env.RAAZIT_AUTH_TOKEN || 'f5f67281-417e-4925-b74b-e86de2eee205';

// Helper to build a Raazit app ID based on country code
function buildAppId(countryCode) {
  if (!countryCode) return `global--AF-${Math.floor(10 + Math.random() * 90)}`;
  return `global--${countryCode}-${Math.floor(10 + Math.random() * 90)}`;
}

export default async function handler(req, res) {
  const method = (req.method || 'GET').toUpperCase();
  const { type, app, carrier, country } = req.query || {};

  const headers = {
    'auth-token': AUTH_TOKEN,
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json, text/javascript, */*; q=0.01'
  };

  try {
    let upstream;

    if (type === 'otp') {
      // Fetch OTP for given app/carrier
      upstream = await fetch('https://raazit.acchub.io/api/', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'page_no=1&filter%5B0%5D%5Bname%5D=filter_status&filter%5B0%5D%5Bvalue%5D=&filter%5B1%5D%5Bname%5D=filter_items&filter%5B1%5D%5Bvalue%5D=20&filter%5B2%5D%5Bname%5D=app_id&filter%5B2%5D%5Bvalue%5D=0&filter%5B3%5D%5Bname%5D=countries&filter%5B3%5D%5Bvalue%5D=0&search='
      });

    } else if (type === 'number') {
      // Generate a number for a specific country and carrier
      const appId = buildAppId(country);
      const form = new URLSearchParams();
      form.append('app', appId);
      form.append('carrier', carrier || 'global');

      upstream = await fetch('https://raazit.acchub.io/api/sms/', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: form.toString()
      });

    } else if (type === 'countries') {
      upstream = await fetch(`https://raazit.acchub.io/api/sms/combo-list/?_=${Date.now()}`, {
        method: 'GET', headers
      });

    } else if (type === 'carriers') {
      const appParam = encodeURIComponent(app || buildAppId(country));
      upstream = await fetch(`https://raazit.acchub.io/api/sms/carrier-list/?app=${appParam}&_=${Date.now()}`, {
        method: 'GET', headers
      });

    } else {
      return res.status(400).json({ error: 'Missing or invalid type param (otp | number | countries | carriers)' });
    }

    const text = await upstream.text();

    // try parse JSON, otherwise return raw text
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch (e) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(text);
    }

  } catch (err) {
    console.error('Upstream error:', err.message);
    return res.status(502).json({ error: 'Upstream request failed', detail: err.message });
  }
}
