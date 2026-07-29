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
      const accessToken = tokenData.access_token;

      // Inyectar el script tag automáticamente en la tienda autorizada
      let scriptStatus = 'Pendiente';
      try {
        const scriptRes = await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts`, {
          method: 'POST',
          headers: {
            'Authentication': `bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'User-Agent': `TnUpsell (${appId})`
          },
          body: JSON.stringify({
            src: 'https://upsell-gamma-bay.vercel.app/api/widget.js',
            event: 'onload'
          })
        });
        const scriptData = await scriptRes.json();
        if (scriptRes.ok || scriptRes.status === 201) {
          scriptStatus = '✅ Script inyectado con éxito en la tienda';
        } else {
          scriptStatus = `⚠️ Aviso API: ${JSON.stringify(scriptData)}`;
        }
      } catch (err) {
        scriptStatus = `⚠️ Error al inyectar script: ${err.message}`;
      }

      return res.send(`
        <div style="font-family: sans-serif; text-align: center; padding: 40px; background: #0f172a; color: #fff; min-height: 100vh;">
          <h1 style="color: #34d399;">🎉 ¡Conexión Exitosa con Tienda Nube!</h1>
          <p>Tu tienda ID: <strong>${storeId}</strong> ha sido autorizada correctamente.</p>
          <div style="margin: 20px auto; max-width: 500px; padding: 16px; background: #1e293b; border-radius: 12px; border: 1px solid #334155;">
            <p style="color: #60a5fa; font-weight: bold;">Estado de Inyección de Script:</p>
            <p style="color: #cbd5e1; font-size: 14px;">${scriptStatus}</p>
          </div>
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
