// Memory store for Vercel serverless rules API
let rulesMemoryStore = [
  {
    id: "rule-neohogar-1",
    name: "Oferta Organizador + Secador",
    triggerProductId: "prod-secador",
    suggestedProductId: "prod-calzado",
    discountType: "percentage",
    discountValue: 20,
    badgeText: "⚡ ¡Aprovecha 20% OFF en este complemento!",
    active: true
  }
];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    const newRules = req.body;
    if (Array.isArray(newRules)) {
      rulesMemoryStore = newRules;
    } else if (newRules && typeof newRules === 'object') {
      rulesMemoryStore = [newRules];
    }
    return res.status(200).json({ success: true, rules: rulesMemoryStore });
  }

  if (req.method === 'DELETE') {
    rulesMemoryStore = [];
    return res.status(200).json({ success: true, rules: [] });
  }

  return res.status(200).json(rulesMemoryStore);
}
