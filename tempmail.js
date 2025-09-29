const fetch = require("node-fetch");

const API_KEY = "prince"; // fixed API key
const BASE = "https://api.princetechn.com/api/tempmail";

module.exports = async (req, res) => {
  try {
    const { op, email, messageid } = req.query;

    let url = "";
    if (op === "generate") {
      url = `${BASE}/generate?apikey=${API_KEY}`;
    } else if (op === "inbox") {
      if (!email) return res.status(400).json({ error: "Missing email" });
      url = `${BASE}/inbox?apikey=${API_KEY}&email=${encodeURIComponent(email)}`;
    } else if (op === "message") {
      if (!email || !messageid) {
        return res.status(400).json({ error: "Missing email or messageid" });
      }
      url = `${BASE}/message?apikey=${API_KEY}&email=${encodeURIComponent(email)}&messageid=${encodeURIComponent(messageid)}`;
    } else {
      return res.status(400).json({ error: "Invalid op parameter" });
    }

    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
