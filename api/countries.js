import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://raazit.acchub.io/api/sms/combo-list/?_=1759070232139", {
      method: "GET",
      headers: {
        "auth-token": "f5f67281-417e-4925-b74b-e86de2eee205",
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Countries API fetch failed", details: error.message });
  }
}
