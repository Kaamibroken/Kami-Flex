import fetch from "node-fetch";

export default async function handler(req, res) {
  const { op, email, messageid } = req.query;
  const apikey = "prince";

  try {
    let url = "";
    if (op === "generate") {
      url = `https://api.princetechn.com/api/tempmail/generate?apikey=${apikey}`;
    } else if (op === "inbox" && email) {
      url = `https://api.princetechn.com/api/tempmail/inbox?apikey=${apikey}&email=${email}`;
    } else if (op === "message" && email && messageid) {
      url = `https://api.princetechn.com/api/tempmail/message?apikey=${apikey}&email=${email}&messageid=${messageid}`;
    } else {
      return res.status(400).json({ error: "Invalid parameters" });
    }

    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
