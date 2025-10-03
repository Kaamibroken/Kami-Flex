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

// Agar packages API fail ho jaye to yeh fallback data return hoga
const SAMPLE_PACKAGES = [
  { id: "1", name: "📅 Daily Offer", price: "Rs. 10/day", description: "1 Day Streaming Package" },
  { id: "2", name: "📅 Weekly Offer", price: "Rs. 70/week", description: "7 Days Streaming Package" },
  { id: "3", name: "📅 Monthly Prepaid", price: "Rs. 300/month", description: "30 Days Package (Prepaid)" },
  { id: "4", name: "📅 Data Special", price: "Rs. 120/3 Days", description: "Special Data Package" }
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = (req.query.action || (req.body && req.body.action) || '').toString();

  try {
    if (action === 'packages') {
      try {
        const upstream = await fetch(`${API_BASE}/packages`, {
          method: 'GET',
          headers: getHeaders()
        });
        const text = await upstream.text();
        try {
          const json = JSON.parse(text);
          return res.status(200).json({ ok: true, data: json });
        } catch {
          return res.status(200).json({ ok: true, data: SAMPLE_PACKAGES });
        }
      } catch {
        return res.status(200).json({ ok: true, data: SAMPLE_PACKAGES });
      }
    }

    else if (action === 'send_otp') {
      const body = req.method === 'GET' ? req.query : req.body || {};
      const phone = (body.phone || '').toString().trim();
      if (!phone) return res.status(400).json({ ok: false, error: 'phone required' });

      const formatted = phone.startsWith('0') ? `92${phone.slice(1)}` : (phone.startsWith('92') ? phone : `92${phone}`);
      const payload = { msisdn: formatted, network: 'jazz', action: 'send_otp' };

      const upstream = await fetch(`${API_BASE}/sign-up-wc`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const text = await upstream.text();
      try {
        return res.status(200).json({ ok: true, data: JSON.parse(text) });
      } catch {
        return res.status(200).json({ ok: true, data: text });
      }
    }

    else if (action === 'verify_otp') {
      const body = req.method === 'GET' ? req.query : req.body || {};
      const phone = (body.phone || '').toString().trim();
      const otp = (body.otp || '').toString().trim();
      if (!phone || !otp) return res.status(400).json({ ok: false, error: 'phone & otp required' });

      const formatted = phone.startsWith('0') ? `92${phone.slice(1)}` : (phone.startsWith('92') ? phone : `92${phone}`);
      const payload = { msisdn: formatted, network: 'jazz', otp, action: 'verify_otp' };

      const upstream = await fetch(`${API_BASE}/sign-up-wc`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      const text = await upstream.text();
      try {
        return res.status(200).json({ ok: true, data: JSON.parse(text) });
      } catch {
        return res.status(200).json({ ok: true, data: text });
      }
    }

    else {
      return res.status(400).json({ ok: false, error: 'invalid action' });
    }
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
};
