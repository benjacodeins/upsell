export default function handler(req, res) {
  res.status(200).json({
    status: 'online',
    appId: process.env.APP_ID || '37816',
    storeId: process.env.TIENDANUBE_STORE_ID || '7961682',
    storeName: 'Neo Hogar',
    domain: 'neohogar.com.ar',
    isConnected: true,
    platform: 'Tienda Nube',
    timestamp: new Date().toISOString()
  });
}
