const fetch = require('node-fetch');

const AUTH_TOKEN = 'f5f67281-417e-4925-b74b-e86de2eee205';

async function handler(type, app, carrier) {
  const headers = {
    'auth-token': AUTH_TOKEN,
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/140 Mobile Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  };

  try {
    let response;
    if (type === 'otp') {
      const form = new URLSearchParams();
      form.append('page_no', '1');
      form.append('filter[0][name]', 'filter_status');
      form.append('filter[0][value]', '');
      form.append('filter[1][name]', 'filter_items');
      form.append('filter[1][value]', '20');
      form.append('filter[2][name]', 'app_id');
      form.append('filter[2][value]', '0');
      form.append('filter[3][name]', 'countries');
      form.append('filter[3][value]', '0');
      form.append('search', '');
      response = await fetch('https://raazit.acchub.io/api/', {
        method: 'POST',
        headers,
        body: form.toString(),
      });
    } else if (type === 'number') {
      // ✅ Default values agar frontend se na mile
      const appId = app || 'global--AF-93';
      const carrierId = carrier || '619';

      const form = new URLSearchParams();
      form.append('app', appId);
      form.append('carrier', carrierId);

      response = await fetch('https://raazit.acchub.io/api/sms/', {
        method: 'POST',
        headers,
        body: form.toString(),
      });
    } else {
      return { error: 'Invalid type' };
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  } catch (err) {
    return { error: 'Upstream failed', detail: err.message };
  }
}

module.exports = async (req, res) => {
  const { type, app, carrier } = req.query;
  const result = await handler(type, app, carrier);
  res.status(200).json(result);
};
