export default async function handler(req, res) {
  const storeId = process.env.TIENDANUBE_STORE_ID || '7961682';
  const token = process.env.TIENDANUBE_ACCESS_TOKEN || 'd1b5090a7cec9c055081ab5a6c3d8e5a650ee6d5';

  try {
    const response = await fetch(`https://api.tiendanube.com/v1/${storeId}/products`, {
      headers: {
        'Authentication': `bearer ${token}`,
        'User-Agent': 'TnUpsell (37816)'
      }
    });

    if (!response.ok) {
      return res.status(200).json({ success: false, storeId, products: [] });
    }

    const data = await response.json();
    const realProducts = (data || []).map(item => ({
      id: item.id,
      name: item.name?.es || item.name?.en || (typeof item.name === 'string' ? item.name : 'Producto Tienda Nube'),
      price: parseFloat(item.variants?.[0]?.price || item.price || 0),
      category: item.categories?.[0]?.name?.es || 'Hogar & Organización',
      image: item.images?.[0]?.src || 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=400&q=80',
      sku: item.variants?.[0]?.sku || `TN-${item.id}`
    }));

    res.status(200).json({
      success: true,
      storeId,
      count: realProducts.length,
      products: realProducts
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
