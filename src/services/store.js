// Store Service para Tienda Nube (Neo Hogar - Store ID 7961682)

export async function fetchRealTiendaNubeProducts() {
  try {
    const res = await fetch('/api/tiendanube/products');
    const data = await res.json();
    if (data.success && data.products) {
      return data.products;
    }
  } catch (e) {
    console.error('Error al consultar productos reales:', e);
  }
  return [];
}

export const MOCK_PRODUCTS = [];
export const DEFAULT_MOCK_PRODUCTS = [];

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
