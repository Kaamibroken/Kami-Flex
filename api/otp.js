import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://raazit.acchub.io/api/", {
      method: "POST",
      headers: {
        "auth-token": "f5f67281-417e-4925-b74b-e86de2eee205",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: "page_no=1&filter[0][name]=filter_status&filter[0][value]=&filter[1][name]=filter_items&filter[1][value]=20&filter[2][name]=app_id&filter[2][value]=0&filter[3][name]=countries&filter[3][value]=0&search="
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: "API fetch failed", details: error.message });
  }
}
