// Store Service para Tienda Nube (Neo Hogar - Store ID 7961682)

export const NEO_HOGAR_PRODUCTS = [
  {
    id: "prod-secador",
    name: "SECADOR DE ROPA PORTATIL + 8 PERCHAS DE REGALO",
    price: 54999,
    category: "Hogar",
    image: "https://dcdn-us.mitiendanube.com/stores/007/961/682/products/principal-72554f7ba3ff08dce817842132500746-480-0.webp",
    sku: "NEO-SEC-01"
  },
  {
    id: "prod-calzado",
    name: "ORGANIZADOR DE CALZADO (10 NIVELES)",
    price: 24500,
    category: "Organización",
    image: "https://dcdn-us.mitiendanube.com/stores/007/961/682/products/chatgpt-image-24-jul-2026-02_15_30-86b3c39598501e726f17848701552063-480-0.webp",
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

export const DEFAULT_RULES = [
  {
    id: "rule-neohogar-1",
    name: "Oferta Organizador de Calzado",
    triggerProductId: "prod-secador",
    suggestedProductId: "prod-calzado",
    discountType: "percentage",
    discountValue: 20,
    badgeText: "⚡ ¡Aprovecha 20% OFF llevando este complemento!",
    active: true,
    conversions: 14,
    revenueBoosted: 274400
  }
];

export function getStoredRules() {
  const data = localStorage.getItem("tn_upsell_rules");
  if (!data) return DEFAULT_RULES;
  try {
    const parsed = JSON.parse(data);
    return parsed.length > 0 ? parsed : DEFAULT_RULES;
  } catch (e) {
    return DEFAULT_RULES;
  }
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
