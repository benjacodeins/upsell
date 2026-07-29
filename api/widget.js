export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const scriptContent = `
(function() {
  console.log('⚡ [Tienda Nube In-Cart Upsell Engine Active] App ID: 37816 | Store: 8022993');

  // Configuración del Widget de Upsell en Carrito
  const WIDGET_CONFIG = {
    appId: '37816',
    storeId: '8022993',
    rules: [
      {
        id: 'rule-1',
        triggerProductId: 101,
        suggestedProduct: {
          id: 104,
          name: 'Organizador de Cables Travel Tech',
          price: 8900,
          discountPrice: 7120,
          image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
          badge: '⚡ 20% OFF llevando este producto'
        }
      }
    ]
  };

  // Función para inyectar oferta en el Carrito de Tienda Nube
  function injectUpsellWidget() {
    const cartContainer = document.querySelector('.js-cart-container, #cart-drawer, .cart-items, .ajax-cart-container');
    if (!cartContainer || document.getElementById('tn-upsell-widget-container')) return;

    const offer = WIDGET_CONFIG.rules[0].suggestedProduct;

    const widgetHtml = \`
      <div id="tn-upsell-widget-container" style="
        background: #0f172a;
        border: 1px solid #6366f1;
        border-radius: 12px;
        padding: 12px;
        margin: 12px 0;
        color: #fff;
        font-family: sans-serif;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
      ">
        <div style="font-size: 11px; font-weight: bold; color: #fbbf24; margin-bottom: 6px;">
          \${offer.badge}
        </div>
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="\${offer.image}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover;" />
          <div style="flex: 1;">
            <div style="font-size: 12px; font-weight: bold; color: #f8fafc;">\${offer.name}</div>
            <div style="font-size: 12px; font-weight: bold; color: #34d399; margin-top: 2px;">
              $\${offer.discountPrice.toLocaleString('es-AR')} 
              <span style="font-size: 10px; text-decoration: line-through; color: #94a3b8;">$\${offer.price.toLocaleString('es-AR')}</span>
            </div>
          </div>
          <button id="tn-add-upsell-btn" style="
            background: linear-gradient(135deg, #6366f1, #7c3aed);
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: bold;
            cursor: pointer;
          ">
            + Agregar OFF
          </button>
        </div>
      </div>
    \`;

    cartContainer.insertAdjacentHTML('beforeend', widgetHtml);

    document.getElementById('tn-add-upsell-btn')?.addEventListener('click', function() {
      alert('¡Producto ' + offer.name + ' agregado al carrito con descuento!');
    });
  }

  // Detectar apertura de carrito o carga de página
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(injectUpsellWidget, 1000);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(injectUpsellWidget, 1000);
    });
  }
})();
  `;

  res.send(scriptContent);
}
