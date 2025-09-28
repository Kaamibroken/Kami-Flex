// api/temp.js
// Vercel serverless function (CommonJS)
const fetch = globalThis.fetch || require('node-fetch');

module.exports = async (req, res) => {
  // CORS headers for browser
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  const url = new URL(req.url, `https://${req.headers.host}`);
  const op = url.searchParams.get('op') || '';
  const princeKey = process.env.PRINCE_KEY || process.env.PRINCE_APIKEY || 'prince';

  try {
    if (op === 'generate') {
      // call generate endpoint
      const apiUrl = `https://api.princetechn.com/api/tempmail/generate?apikey=${encodeURIComponent(princeKey)}`;
      const r = await fetch(apiUrl);
      const j = await r.json();
      // expected { email: 'abc@...' }
      res.status(200).json(j);
      return;
    }

    if (op === 'inbox') {
      const email = url.searchParams.get('email') || '';
      if (!email) {
        res.status(400).json({ error: 'email required' });
        return;
      }
      const apiUrl = `https://api.princetechn.com/api/tempmail/inbox?apikey=${encodeURIComponent(princeKey)}&email=${encodeURIComponent(email)}`;
      const r = await fetch(apiUrl);
      const j = await r.json();
      // expected array of messages
      res.status(200).json(j);
      return;
    }

    if (op === 'message') {
      const email = url.searchParams.get('email') || '';
      const messageid = url.searchParams.get('messageid') || '';
      if (!email || !messageid) {
        res.status(400).json({ error: 'email and messageid required' });
        return;
      }
      const apiUrl = `https://api.princetechn.com/api/tempmail/message?apikey=${encodeURIComponent(princeKey)}&email=${encodeURIComponent(email)}&messageid=${encodeURIComponent(messageid)}`;
      const r = await fetch(apiUrl);
      const j = await r.json();
      res.status(200).json(j);
      return;
    }

    // default: invalid op
    res.status(400).json({ error: 'invalid op. use op=generate|inbox|message' });
  } catch (err) {
    console.error('API proxy error', err);
    res.status(500).json({ error: 'server error', details: String(err) });
  }
};
