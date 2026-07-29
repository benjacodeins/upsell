export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const storeId = process.env.TIENDANUBE_STORE_ID || '7961682';
  const accessToken = process.env.TIENDANUBE_ACCESS_TOKEN || 'd1b5090a7cec9c055081ab5a6c3d8e5a650ee6d5';
  const scriptUrl = req.body?.scriptUrl || 'https://upsell-gamma-bay.vercel.app/api/widget.js';

  try {
    const response = await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts`, {
      method: 'POST',
      headers: {
        'Authentication': `bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TnUpsell (37816)'
      },
      body: JSON.stringify({
        src: scriptUrl,
        event: 'onload'
      })
    });

    const data = await response.json();
    return res.status(response.status).json({ success: response.ok, data });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}
