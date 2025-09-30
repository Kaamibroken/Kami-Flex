// api/fake.js
// Vercel serverless function — proxies upstream "number" and "otp" endpoints.
// Adjust upstream URLs / headers if needed.

import fetch from 'node-fetch';

const RAAZIT_BASE = 'https://raazit.acchub.io'; // example upstream for fake-numbers (change if different)
const RAAZIT_AUTH_TOKEN = process.env.RAAZIT_AUTH_TOKEN || 'f5f67281-417e-4925-b74b-e86de2eee205';

export default async function handler(req, res) {
  try {
    const q = req.query || {};
    const type = (q.type || '').toLowerCase();

    const headers = {
      'auth-token': RAAZIT_AUTH_TOKEN,
      'X-Requested-With': 'XMLHttpRequest',
      Accept: 'application/json, text/javascript, */*; q=0.01'
    };

    if (type === 'number' || type === 'generate') {
      // POST to /api/sms/ to get one number (upstream expects form data)
      const app = q.app || 'global--AF-93';
      const carrier = q.carrier || '';
      const body = new URLSearchParams();
      body.append('app', app);
      if (carrier) body.append('carrier', carrier);

      const up = await fetch(`${RAAZIT_BASE}/api/sms/`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString()
      });
      const text = await up.text();
      // try JSON parse
      try { return res.status(200).json(JSON.parse(text)); } catch(e){ res.setHeader('Content-Type','text/plain'); return res.status(200).send(text); }

    } else if (type === 'countries') {
      const up = await fetch(`${RAAZIT_BASE}/api/sms/combo-list/?_=${Date.now()}`, { headers, method: 'GET' });
      const text = await up.text();
      try { return res.status(200).json(JSON.parse(text)); } catch(e){ res.setHeader('Content-Type','text/plain'); return res.status(200).send(text); }

    } else if (type === 'otp' || type === 'inbox' || type === 'messages') {
      // OTP listing endpoint — here we call the upstream OTP/alerts endpoint
      // Example: POST to /api/ (the original raazit OTP endpoint) — adjust if your upstream differs
      const up = await fetch(`${RAAZIT_BASE}/api/`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'page_no=1&filter%5B0%5D%5Bname%5D=filter_status&filter%5B0%5D%5Bvalue%5D=&filter%5B1%5D%5Bname%5D=filter_items&filter%5B1%5D%5Bvalue%5D=20&filter%5B2%5D%5Bname%5D=app_id&filter%5B2%5D%5Bvalue%5D=0&filter%5B3%5D%5Bname%5D=countries&filter%5B3%5D%5Bvalue%5D=0&search='
      });
      const text = await up.text();
      try { return res.status(200).json(JSON.parse(text)); } catch(e){ res.setHeader('Content-Type','text/plain'); return res.status(200).send(text); }

    } else {
      return res.status(400).json({ error: 'type param missing (number|countries|otp)' });
    }

  } catch (err) {
    console.error('API proxy error:', err);
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
