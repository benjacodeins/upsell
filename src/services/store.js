// Store Service para Tienda Nube (Neo Hogar - Store ID 7961682)

export const NEO_HOGAR_PRODUCTS = [
  {
    id: 1,
    name: "SECADOR DE ROPA PORTATIL + 8 PERCHAS DE REGALO",
    price: 45900,
    category: "Hogar",
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=400&q=80",
    sku: "NEO-SEC-01"
  },
  {
    id: 3,
    name: "ORGANIZADOR DE CALZADO (10 NIVELES)",
    price: 24500,
    category: "Organización",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
    sku: "NEO-CALZ-03"
  }
];

export const MOCK_PRODUCTS = NEO_HOGAR_PRODUCTS;
export const DEFAULT_MOCK_PRODUCTS = NEO_HOGAR_PRODUCTS;

export async function fetchRealTiendaNubeProducts() {
  try {
    const res = await fetch('/api/tiendanube/products');
    if (!res.ok) return NEO_HOGAR_PRODUCTS;
    const data = await res.json();
    if (data.success && data.products && data.products.length > 0) {
      return data.products;
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
  return NEO_HOGAR_PRODUCTS;
}

export const DEFAULT_RULES = [];

export function getStoredRules() {
  const data = localStorage.getItem("tn_upsell_rules");
  return data ? JSON.parse(data) : DEFAULT_RULES;
}

export function saveStoredRules(rules) {
  localStorage.setItem("tn_upsell_rules", JSON.stringify(rules));
}

export function getStoredAnalytics() {
  const data = localStorage.getItem("tn_upsell_analytics");
  return data ? JSON.parse(data) : {
    totalImpressions: 0,
    totalUpsellsAdded: 0,
    totalExtraRevenue: 0,
    conversionRate: "0.0%"
  };
}

export function saveStoredAnalytics(stats) {
  localStorage.setItem("tn_upsell_analytics", JSON.stringify(stats));
}

export function getStoredCredentials() {
  const data = localStorage.getItem("tn_upsell_creds");
  return data ? JSON.parse(data) : {
    appId: "37816",
    clientSecret: "91dcaf748f050822fe0df968d42bcf7d2cc48b86b823ef32",
    storeId: "7961682",
    storeName: "Neo Hogar",
    domain: "neohogar.com.ar",
    isConnected: true,
    connectedAt: new Date().toISOString()
  };
}

export function saveStoredCredentials(creds) {
  localStorage.setItem("tn_upsell_creds", JSON.stringify(creds));
}
