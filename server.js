import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let STORE_ID = process.env.TIENDANUBE_STORE_ID || '7961682';
let ACCESS_TOKEN = process.env.TIENDANUBE_ACCESS_TOKEN || 'd1b5090a7cec9c055081ab5a6c3d8e5a650ee6d5';

let rulesStore = [];

// 1. Ruta OAuth Callback (/api/auth/callback)
app.get('/api/auth/callback', async (req, res) => {
  const code = req.query.code;
  const appId = process.env.APP_ID || '37816';
  const clientSecret = process.env.CLIENT_SECRET || '91dcaf748f050822fe0df968d42bcf7d2cc48b86b823ef32';

  if (!code) {
    return res.status(400).send('<h1>Error: No se recibió código de autorización</h1>');
  }

  try {
    const tokenRes = await fetch('https://www.tiendanube.com/apps/authorize/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: appId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code
      })
    });

    const tokenData = await tokenRes.json();

    if (tokenData.access_token) {
      ACCESS_TOKEN = tokenData.access_token;
      STORE_ID = String(tokenData.user_id);
      process.env.TIENDANUBE_ACCESS_TOKEN = ACCESS_TOKEN;
      process.env.TIENDANUBE_STORE_ID = STORE_ID;

      console.log(`✅ ¡Tienda vinculada con éxito! Store ID: ${STORE_ID}`);

      return res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background: #0f172a; color: #fff; height: 100vh;">
          <h1 style="color: #34d399;">🎉 ¡Conexión Exitosa con Tienda Nube!</h1>
          <p>Tu tienda ID: <strong>${STORE_ID}</strong> ha sido autorizada correctamente.</p>
          <a href="http://localhost:3000" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
            Volver al Dashboard de Upsell
          </a>
        </div>
      `);
    } else {
      return res.status(400).send(`<h1>Error al obtener Token</h1><pre>${JSON.stringify(tokenData, null, 2)}</pre>`);
    }
  } catch (error) {
    return res.status(500).send(`<h1>Error de servidor</h1><p>${error.message}</p>`);
  }
});

// 2. Endpoint de Productos Reales de Tienda Nube
app.get('/api/tiendanube/products', async (req, res) => {
  try {
    const response = await fetch(`https://api.tiendanube.com/v1/${STORE_ID}/products`, {
      headers: {
        'Authentication': `bearer ${ACCESS_TOKEN}`,
        'User-Agent': 'TnUpsell (37816)'
      }
    });

    if (!response.ok) {
      return res.json({ success: false, storeId: STORE_ID, products: [] });
    }

    const data = await response.json();
    const realProducts = (data || []).map(item => ({
      id: item.id,
      name: item.name?.es || item.name?.en || (typeof item.name === 'string' ? item.name : 'Producto Tienda Nube'),
      price: parseFloat(item.variants?.[0]?.price || item.price || 0),
      category: item.categories?.[0]?.name?.es || 'Categoría Tienda Nube',
      image: item.images?.[0]?.src || '',
      sku: item.variants?.[0]?.sku || `TN-${item.id}`
    }));

    res.json({
      success: true,
      storeId: STORE_ID,
      count: realProducts.length,
      products: realProducts
    });
  } catch (error) {
    res.json({ success: false, storeId: STORE_ID, products: [], source: 'error', error: error.message });
  }
});

// 3. Status Check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    appId: process.env.APP_ID || '37816',
    storeId: STORE_ID,
    isConnected: true,
    platform: 'Tienda Nube'
  });
});

// 4. Rules REST API
app.get('/api/rules', (req, res) => res.json(rulesStore));

app.post('/api/rules', (req, res) => {
  const newRule = {
    id: `rule-${Date.now()}`,
    conversions: 0,
    revenueBoosted: 0,
    active: true,
    ...req.body
  };
  rulesStore.unshift(newRule);
  res.status(201).json(newRule);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend Tienda Nube (Store: ${STORE_ID}) corriendo en puerto ${PORT}`);
});
