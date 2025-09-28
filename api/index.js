export default async function handler(req, res) {
  const { action, email, id } = req.query;
  const API_KEY = "prince";

  try {
    if (action === "generate") {
      const r = await fetch(`https://api.princetechn.com/api/tempmail/generate?apikey=${API_KEY}`);
      const d = await r.json();
      return res.status(200).json(d);
    }

    if (action === "inbox") {
      const r = await fetch(`https://api.princetechn.com/api/tempmail/inbox?apikey=${API_KEY}&email=${email}`);
      const d = await r.json();
      return res.status(200).json(d);
    }

    if (action === "message") {
      const r = await fetch(`https://api.princetechn.com/api/tempmail/message?apikey=${API_KEY}&email=${email}&messageid=${id}`);
      const d = await r.json();
      return res.status(200).json(d);
    }

    res.status(400).json({ error: "Invalid action" });
  } catch (e) {
    res.status(500).json({ error: "Server Error", detail: e.message });
  }
}
