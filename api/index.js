// api/index.js
export default async function handler(req, res) {
  const { query } = req;
  const op = query.op;
  const key = process.env.PRINCE_KEY || "prince";

  try {
    if (op === "generate") {
      const r = await fetch(`https://api.princetechn.com/api/tempmail/generate?apikey=${key}`);
      const j = await r.json();
      return res.status(200).json(j);
    }

    if (op === "inbox") {
      const email = query.email;
      const r = await fetch(`https://api.princetechn.com/api/tempmail/inbox?apikey=${key}&email=${email}`);
      const j = await r.json();
      return res.status(200).json(j);
    }

    if (op === "message") {
      const { email, messageid } = query;
      const r = await fetch(`https://api.princetechn.com/api/tempmail/message?apikey=${key}&email=${email}&messageid=${messageid}`);
      const j = await r.json();
      return res.status(200).json(j);
    }

    res.status(400).json({ error: "Invalid operation" });
  } catch (e) {
    res.status(500).json({ error: "Server error", detail: String(e) });
  }
}
