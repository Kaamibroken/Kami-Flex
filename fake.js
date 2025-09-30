// api/fake.js
import fetch from 'node-fetch';

const AUTH_TOKEN = 'f5f67281-417e-4925-b74b-e86de2eee205'; // tumhara token

export default async function handler(req, res) {
  const { type, app, carrier } = req.query;

  const headers = {
    'auth-token': AUTH_TOKEN,
    'X-Requested-With': 'XMLHttpRequest',
    'User-Agent': 'Mozilla/5.0 (Linux; Android 14; motorola razr 2024) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.7339.155 Mobile Safari/537.36',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  };

  try {
    let response;

    if(type === 'otp') {
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

      response = await fetch('https://raazit.acchub.io/api/',{
        method:'POST',
        headers,
        body: form.toString()
      });

    } else if(type === 'number') {
      if(!app || !carrier) return res.status(400).json({error:'app and carrier required'});
      const form = new URLSearchParams();
      form.append('app', app);
      form.append('carrier', carrier);

      response = await fetch('https://raazit.acchub.io/api/sms/',{
        method:'POST',
        headers,
        body: form
      });

    } else {
      return res.status(400).json({error:'Invalid type param'});
    }

    const text = await response.text();
    try {
      const json = JSON.parse(text);
      return res.status(200).json(json);
    } catch(e){
      return res.status(200).send(text);
    }

  } catch(err){
    console.error('Upstream error:', err);
    return res.status(502).json({error:'Upstream failed', detail:err.message});
  }
}
