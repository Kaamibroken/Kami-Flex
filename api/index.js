export default async function handler(req, res) {
  const { type, email, messageid } = req.query;

  let url = "";
  if (type === "generate") {
    url = "https://api.princetechn.com/api/tempmail/generate?apikey=prince";
  } else if (type === "inbox") {
    url = `https://api.princetechn.com/api/tempmail/inbox?apikey=prince&email=${email}`;
  } else if (type === "message") {
    url = `https://api.princetechn.com/api/tempmail/message?apikey=prince&email=${email}&messageid=${messageid}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch" });
  }
}
