import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://raazit.acchub.io/api/sms/", {
      method: "POST",
      headers: {
        "auth-token": "f5f67281-417e-4925-b74b-e86de2eee205"
      },
      body: new URLSearchParams({
        app: "global--AF-93",
        carrier: "619"
      })
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "Number API fetch failed", details: error.message });
  }
}
