import fetch from "node-fetch";

const API_KEY = "prince";
const BASE = "https://api.princetechn.com/api/tempmail";

export default async function handler(req, res) {
  const { op, email, messageid } = req.query;

  try {
    if (op === "generate") {
      const r = await fetch(`${BASE}/generate?apikey=${API_KEY}`);
      const d = await r.json();
      return res.json(d);
    }
    if (op === "inbox" && email) {
      const r = await fetch(`${BASE}/inbox?apikey=${API_KEY}&email=${email}`);
      const d = await r.json();
      return res.json(d);
    }
    if (op === "message" && email && messageid) {
      const r = await fetch(`${BASE}/message?apikey=${API_KEY}&email=${email}&messageid=${messageid}`);
      const d = await r.json();
      return res.json(d);
    }
    res.status(400).json({ error: "Invalid operation" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
