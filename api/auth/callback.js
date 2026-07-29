export default async function handler(req, res) {
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
      const storeId = tokenData.user_id;

      return res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background: #0f172a; color: #fff; height: 100vh;">
          <h1 style="color: #34d399;">🎉 ¡Conexión Exitosa con Tienda Nube!</h1>
          <p>Tu tienda ID: <strong>${storeId}</strong> ha sido autorizada correctamente.</p>
          <p style="color: #94a3b8; font-size: 14px;">Token generado: ${tokenData.access_token}</p>
          <a href="/" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
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
}
