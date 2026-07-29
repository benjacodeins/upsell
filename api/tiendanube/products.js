export default async function handler(req, res) {
  const storeId = process.env.TIENDANUBE_STORE_ID || '7961682';

  const neoHogarProducts = [
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

  res.status(200).json({
    success: true,
    storeId,
    count: neoHogarProducts.length,
    products: neoHogarProducts
  });
}
