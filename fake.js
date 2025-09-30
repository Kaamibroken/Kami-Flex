// api/fake.js
// Vercel serverless function that proxies the Raazit endpoints you provided.
// Filename: api/fake.js  (this matches your "fake" name request for the JS file)

import fetch from 'node-fetch';

const AUTH_TOKEN = process.env.RAAZIT_AUTH_TOKEN || 'f5f67281-417e-4925-b74b-e86de2eee205';

export default async function handler(req, res) {
  const method = (req.method || 'GET').toUpperCase();
  const { type } = req.query || req.body || {};
  const app = req.query.app || (req.body && req.body.app) || 'global--AF-93';
  const carrier = req.query.carrier || (req.body && req.body.carrier) || '619';

  const headers = {
    'auth-token': AUTH_TOKEN,
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json, text/javascript, */*; q=0.01'
  };

  try {
    let upstream;

    if (type === 'otp') {
      upstream = await fetch('https://raazit.acchub.io/api/', {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'page_no=1&filter%5B0%5D%5Bname%5D=filter_status&filter%5B0%5D%5Bvalue%5D=&filter%5B1%5D%5Bname%5D=filter_items&filter%5B1%5D%5Bvalue%5D=20&filter%5B2%5D%5Bname%5D=app_id&filter%5B2%5D%5Bvalue%5D=0&filter%5B3%5D%5Bname%5D=countries&filter%5B3%5D%5Bvalue%5D=0&search='
      });

    } else if (type === 'number') {
      const form = new URLSearchParams();
      form.append('app', app);
      form.append('carrier', carrier);
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
      const appParam = encodeURIComponent(app || 'airbnb--KH-855');
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
      // return as plain text if not JSON
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.status(200).send(text);
    }

  } catch (err) {
    console.error('Upstream error:', err.message);
    return res.status(502).json({ error: 'Upstream request failed', detail: err.message });
  }
}
