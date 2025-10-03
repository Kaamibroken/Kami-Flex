// api/tamasha.js
const fetch = require('node-fetch');

const API_BASE = process.env.TAMASHA_API_BASE || 'https://jazztv.pk/alpha/api_gateway/index.php/v3/users-dbss';
const HEADER_TOKEN = process.env.TAMASHA_HEADER_TOKEN || '774a719yycaa6xc44bg12e5hf5buj69dmkcdt46dl';

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${HEADER_TOKEN}`,
    'User-Agent': 'Mozilla/5.0 (compatible; KamiFlex/1.0)',
    'Accept': 'application/json',
    'Origin': 'http://portal.tamashaweb.com',
    'Referer': 'http://portal.tamashaweb.com/'
  };
}

// Sample fallback packages
const SAMPLE_PACKAGES = [
  { id: "1", name: "Daily Offer", price: "Rs. 10/day", description: "Daily subscription package" },
  { id: "2", name: "Weekly Offer", price: "Rs. 70/week", description: "Weekly subscription package" },
  { id: "3", name: "Monthly Prepaid", price: "Rs. 300/month", description: "Monthly package for prepaid users" },
  { id: "4", name: "Monthly Postpaid", price: "Rs. 120/month", description: "Monthly package for postpaid users" }
];

module.exports = async (req, res) => {
  // ✅ CORS setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = (req.query.action || (req.body && req.body.action) || 'packages').toString();

  try {
    // 📦 Get Packages
    if (action === 'packages') {
      try {
        const upstream = await fetch(`${API_BASE}/packages`, {
          method: 'GET',
          headers: getHeaders(),
          timeout: 10000
        });
        const text = await upstream.text();
        try {
          const json = JSON.parse(text);
          return res.status(200).json({ ok: true, upstream: true, data: json });
        } catch {
          return res.status(200).json({ ok: true, upstream: false, data: SAMPLE_PACKAGES });
        }
      } catch {
        return res.status(200).json({ ok: true, upstream: false, data: SAMPLE_PACKAGES, note: 'Upstream unreachable' });
      }
    }

    // 📲 Send OTP
    else if (action === 'send_otp') {
      const body = req.method === 'GET' ? req.query : req.body || {};
      const phone = (body.phone || '').toString().trim();
      if (!phone) return res.status(400).json({ ok: false, error: 'phone required' });

      const formatted = phone.startsWith('0') ? `92${phone.slice(1)}` : (phone.startsWith('92') ? phone : `92${phone}`);
      const payload = { msisdn: formatted, network: 'jazz', action: 'send_otp' };

      try {
        const upstream = await fetch(`${API_BASE}/sign-up-wc`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload),
          timeout: 15000
        });
        const text = await upstream.text();
        try {
          return res.status(200).json({ ok: true, upstream: true, data: JSON.parse(text) });
        } catch {
          return res.status(200).json({ ok: true, upstream: true, data: text });
        }
      } catch (err) {
        return res.status(502).json({ ok: false, error: 'Upstream failed', detail: err.message });
      }
    }

    // 🔑 Verify OTP
    else if (action === 'verify_otp') {
      const body = req.method === 'GET' ? req.query : req.body || {};
      const phone = (body.phone || '').toString().trim();
      const otp = (body.otp || '').toString().trim();
      if (!phone || !otp) return res.status(400).json({ ok: false, error: 'phone & otp required' });

      const formatted = phone.startsWith('0') ? `92${phone.slice(1)}` : (phone.startsWith('92') ? phone : `92${phone}`);
      const payload = { msisdn: formatted, network: 'jazz', otp, action: 'verify_otp' };

      try {
        const upstream = await fetch(`${API_BASE}/sign-up-wc`, {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify(payload),
          timeout: 15000
        });
        const text = await upstream.text();
        try {
          return res.status(200).json({ ok: true, upstream: true, data: JSON.parse(text) });
        } catch {
          return res.status(200).json({ ok: true, upstream: true, data: text });
        }
      } catch (err) {
        return res.status(502).json({ ok: false, error: 'Upstream failed', detail: err.message });
      }
    }

    // ❌ Invalid Action
    else {
      return res.status(400).json({ ok: false, error: 'invalid action (packages|send_otp|verify_otp)' });
    }
  } catch (e) {
    console.error('Handler error', e);
    return res.status(500).json({ ok: false, error: 'internal server error', detail: e.message });
  }
};
