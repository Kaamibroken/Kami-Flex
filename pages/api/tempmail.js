// pages/api/tempmail.js

export default async function handler(req, res) {
  const { op, email, messageid } = req.query;
  const apikey = "prince"; // ✅ fixed, delete nahi karna

  try {
    let url = "";

    if (op === "generate") {
      url = `https://api.princetechn.com/api/tempmail/generate?apikey=${apikey}`;
    } else if (op === "inbox" && email) {
      url = `https://api.princetechn.com/api/tempmail/inbox?apikey=${apikey}&email=${encodeURIComponent(email)}`;
    } else if (op === "message" && email && messageid) {
      url = `https://api.princetechn.com/api/tempmail/message?apikey=${apikey}&email=${encodeURIComponent(email)}&messageid=${encodeURIComponent(messageid)}`;
    } else {
      return res.status(400).json({ error: "❌ Invalid parameters" });
    }

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({
      error: "❌ API request failed",
      details: err.message,
    });
  }
}
