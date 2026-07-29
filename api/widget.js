export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const scriptContent = `
(function() {
  console.log('⚡ [Neo Hogar In-Cart Upsell Active] Store ID: 7961682');

  // Estado global de reglas (por defecto activa)
  let activeRules = [{ active: true }];

  // Consultar reglas activas desde la API del servidor
  async function checkActiveRules() {
    try {
      const res = await fetch('https://upsell-gamma-bay.vercel.app/api/rules');
      if (res.ok) {
        const rules = await res.json();
        if (Array.isArray(rules) && rules.length > 0) {
          activeRules = rules.filter(r => r.active !== false);
        }
      }
    } catch (e) {
      // Mantener activa
    }
  }

  checkActiveRules();

  function injectUpsellWidget() {
    // Si no hay reglas activas en el dashboard, ELIMINAR WIDGET SI EXISTE Y NO MOSTRAR NADA
    if (activeRules && activeRules.length === 0) {
      const existing = document.getElementById('neohogar-upsell-container');
      if (existing) existing.remove();
      return;
    }

    // Evitar duplicados si ya está inyectado
    if (document.getElementById('neohogar-upsell-container')) return;

    // Oferta basada en Regla a+b: Secador de Ropa (20% OFF)
    const OFFER_DATA = {
      title: '🔥 OFERTA EXCLUSIVA DE CARRITO',
      badgeText: '⚡ ¡Aprovecha 20% OFF en este complemento!',
      name: 'SECADOR DE ROPA PORTATIL + 8 PERCHAS DE REGALO',
      variantId: '355582153',
      price: 54999,
      discountPrice: 43999,
      savings: 11000,
      image: 'https://dcdn-us.mitiendanube.com/stores/007/961/682/products/principal-72554f7ba3ff08dce817842132500746-480-0.webp'
    };

    // 1. Buscar el botón de checkout dentro del carrito desplegable
    let checkoutBtn = document.querySelector([
      '#modal-cart a[href*="checkout"]',
      '#modal-cart a[href*="iniciar-compra"]',
      '#modal-cart .js-ajax-cart-submit',
      '#modal-cart input[name="checkout"]',
      '.js-ajax-cart-panel a[href*="checkout"]',
      '.js-ajax-cart-panel .js-ajax-cart-submit',
      '.js-ajax-cart-container a[href*="checkout"]',
      '.modal-cart a[href*="checkout"]',
      'a[href*="checkout"]',
      'a[href*="iniciar-compra"]',
      'input[name="checkout"]',
      '.js-ajax-cart-submit'
    ].join(', '));

    // Si no se encuentra por selector directo, buscar botón por texto ("INICIAR COMPRA" / "CHECKOUT")
    if (!checkoutBtn) {
      const allButtons = document.querySelectorAll('#modal-cart button, #modal-cart a, .js-ajax-cart-panel button, .js-ajax-cart-panel a, button, a, input[type="submit"]');
      for (const btn of allButtons) {
        const text = (btn.innerText || btn.value || '').toUpperCase();
        if (text.includes('INICIAR COMPRA') || text.includes('FINALIZAR COMPRA') || text.includes('CHECKOUT')) {
          checkoutBtn = btn;
          break;
        }
      }
    }

    // 2. Buscar el contenedor del panel/modal del carrito desplegable
    const cartDrawer = document.querySelector('#modal-cart .modal-body, #modal-cart, .js-ajax-cart-panel, .js-ajax-cart-container, .modal-cart-body, #ajax-cart');

    // SI NO HAY CARRITO DESPLEGABLE O EL CARRITO NO ESTÁ EN PANTALLA, NO INYECTAR EN HEADER
    if (!checkoutBtn && !cartDrawer) return;

    // Crear el elemento del Widget de Upsell
    const widgetDiv = document.createElement('div');
    widgetDiv.id = 'neohogar-upsell-container';
    widgetDiv.style.cssText = \`
      background: #0f172a;
      border: 2px solid #6366f1;
      border-radius: 12px;
      padding: 12px;
      margin: 12px 0;
      color: #ffffff;
      font-family: system-ui, -apple-system, sans-serif;
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.35);
      text-align: left;
      clear: both;
      z-index: 99999;
      width: 100%;
      box-sizing: border-box;
    \`;

    widgetDiv.innerHTML = \`
      <div style="font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
        <span>\${OFFER_DATA.badgeText}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="\${OFFER_DATA.image}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 1px solid #6366f1; flex-shrink: 0;" />
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 11px; font-weight: 700; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${OFFER_DATA.name}</div>
          <div style="font-size: 12px; font-weight: 800; color: #34d399; margin-top: 2px;">
            $\${OFFER_DATA.discountPrice.toLocaleString('es-AR')}
            <span style="font-size: 10px; text-decoration: line-through; color: #94a3b8; margin-left: 4px;">$\${OFFER_DATA.price.toLocaleString('es-AR')}</span>
          </div>
        </div>
        <button id="btn-add-neohogar-upsell" style="
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: #ffffff;
          border: none;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
          transition: transform 0.15s ease;
          white-space: nowrap;
        ">
          + AGREGAR OFF
        </button>
      </div>
    \`;

    if (checkoutBtn) {
      checkoutBtn.parentNode.insertBefore(widgetDiv, checkoutBtn);
    } else if (cartDrawer) {
      cartDrawer.appendChild(widgetDiv);
    }

    document.getElementById('btn-add-neohogar-upsell')?.addEventListener('click', function(e) {
      e.preventDefault();
      const btn = this;
      btn.innerText = '¡AGREGANDO...!';
      btn.style.background = '#10b981';
      btn.disabled = true;

      // Solicitud AJAX sin recargar página
      const params = new URLSearchParams();
      params.append('add_to_cart', '355582153');
      params.append('quantity', '1');

      fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: params
      })
      .then(function() {
        btn.innerText = '✓ ¡AGREGADO CON 20% OFF!';
        btn.style.background = '#059669';
        // Si el carrito de Tiendanube tiene update dinámico, lo dispara sin recargar la página entera
        if (window.LS && window.LS.cart && typeof window.LS.cart.update === 'function') {
          window.LS.cart.update();
        }
      })
      .catch(function() {
        btn.innerText = '✓ ¡AGREGADO!';
        btn.style.background = '#059669';
      });
    });
  }

  // Monitoreo continuo cada 400ms
  setInterval(injectUpsellWidget, 400);
})();
  `;

  res.send(scriptContent);
}
