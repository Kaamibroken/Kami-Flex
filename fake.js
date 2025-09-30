// fake.js
// CommonJS version for Termux / Node (uses node-fetch v2)
// Usage:
//   node fake.js countries
//   node fake.js otp
//   node fake.js number <app> <carrier>

const fetch = require('node-fetch');
const { URLSearchParams } = require('url');

const AUTH_TOKEN = process.env.RAAZIT_AUTH_TOKEN || 'f5f67281-417e-4925-b74b-e86de2eee205';

const commonHeaders = {
  'auth-token': AUTH_TOKEN,
  'X-Requested-With': 'XMLHttpRequest',
  'User-Agent': 'Mozilla/5.0 (Linux; Android 14; TestAgent)',
  'Accept': 'application/json, text/javascript, */*; q=0.01',
};

function handleTextResponse(resText) {
  // try parse json, otherwise return text
  try {
    const j = JSON.parse(resText);
    return j;
  } catch (e) {
    return resText;
  }
}

async function getCountries() {
  try {
    const url = `https://raazit.acchub.io/api/sms/combo-list/?_=${Date.now()}`;
    const resp = await fetch(url, { method: 'GET', headers: commonHeaders });
    const text = await resp.text();
    const out = handleTextResponse(text);
    console.log('=== countries response ===');
    console.log(typeof out === 'string' ? out.slice(0,500) + (out.length>500?'...':'' ) : JSON.stringify(out, null, 2));
  } catch (err) {
    console.error('countries error:', err.message || err);
  }
}

async function getOtpList() {
  try {
    const url = 'https://raazit.acchub.io/api/';
    const form = new URLSearchParams();
    form.append('page_no','1');
    form.append('filter[0][name]','filter_status');
    form.append('filter[0][value]','');
    form.append('filter[1][name]','filter_items');
    form.append('filter[1][value]','20');
    form.append('filter[2][name]','app_id');
    form.append('filter[2][value]','0');
    form.append('filter[3][name]','countries');
    form.append('filter[3][value]','0');
    form.append('search','');

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://raazit.acchub.io'
      },
      body: form.toString()
    });

    const text = await resp.text();
    const out = handleTextResponse(text);
    console.log('=== otp list response ===');
    console.log(typeof out === 'string' ? out.slice(0,1000) : JSON.stringify(out, null, 2));
  } catch (err) {
    console.error('otp error:', err.message || err);
  }
}

async function getNumber(app, carrier) {
  if(!app || !carrier){
    console.error('Usage: node fake.js number <app> <carrier>');
    return;
  }
  try {
    const url = 'https://raazit.acchub.io/api/sms/';
    const form = new URLSearchParams();
    form.append('app', app);
    form.append('carrier', carrier);

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...commonHeaders,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://raazit.acchub.io'
      },
      body: form.toString()
    });

    const text = await resp.text();
    const out = handleTextResponse(text);
    console.log('=== number response ===');
    console.log(typeof out === 'string' ? out.slice(0,1000) : JSON.stringify(out, null, 2));
  } catch (err) {
    console.error('number error:', err.message || err);
  }
}

// CLI
(async function(){
  const args = process.argv.slice(2);
  const cmd = (args[0] || '').toLowerCase();

  if(cmd === 'countries'){
    await getCountries();
  } else if(cmd === 'otp'){
    await getOtpList();
  } else if(cmd === 'number'){
    const app = args[1];
    const carrier = args[2];
    await getNumber(app, carrier);
  } else {
    console.log('Usage:');
    console.log('  node fake.js countries            # fetch countries');
    console.log('  node fake.js otp                  # fetch otp list');
    console.log('  node fake.js number <app> <carrier>   # request number');
    console.log('');
    console.log('Example:');
    console.log('  node fake.js number global--AF-93 619');
  }
})();
