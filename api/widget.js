export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const scriptContent = `
(function() {
  console.log('⚡ [Neo Hogar In-Cart Upsell Active] Store ID: 7961682');

  // Oferta basada en Regla a+b: Organizador de Calzado -> Secador de Ropa (20% OFF)
  const OFFER_DATA = {
    title: '🔥 OFERTA EXCLUSIVA DE CARRITO',
    badgeText: '⚡ ¡Aprovecha 20% OFF en este complemento!',
    name: 'SECADOR DE ROPA PORTATIL + 8 PERCHAS DE REGALO',
    price: 54999,
    discountPrice: 43999,
    savings: 11000,
    image: 'https://dcdn-us.mitiendanube.com/stores/007/961/682/products/principal-72554f7ba3ff08dce817842132500746-480-0.webp'
  };

  function injectUpsellWidget() {
    // Evitar duplicados si ya está inyectado
    if (document.getElementById('neohogar-upsell-container')) return;

    // Buscar elementos clave del carrito en temas de Tiendanube (Alma, Bahía, Simple, etc.)
    let checkoutBtn = document.querySelector([
      'a[href*="checkout"]',
      'a[href*="iniciar-compra"]',
      'input[name="checkout"]',
      'button.js-cart-checkout',
      '.js-cart-checkout',
      '.js-ajax-cart-submit',
      '.cart-btn-checkout',
      'form[action*="checkout"] input[type="submit"]',
      'form[action*="checkout"] button',
      '[data-singlestep-checkout-btn]',
      '.cart-summary .btn',
      '#ajax-cart .btn'
    ].join(', '));

    // Si no se encuentra por selector directo, buscar cualquier botón de checkout por texto
    if (!checkoutBtn) {
      const allButtons = document.querySelectorAll('button, a, input[type="submit"], input[type="button"]');
      for (const btn of allButtons) {
        const text = (btn.innerText || btn.value || '').toUpperCase();
        if (text.includes('INICIAR COMPRA') || text.includes('FINALIZAR COMPRA') || text.includes('CHECKOUT')) {
          checkoutBtn = btn;
          break;
        }
      }
    }

    const cartHeader = document.querySelector('.cart-summary, #ajax-cart, .js-ajax-cart-container, .js-ajax-cart-panel, .modal-cart, [data-modal-id="modal-cart"], .js-cart-container, .modal-cart-body');
    const parentContainer = checkoutBtn ? checkoutBtn.parentElement : (cartHeader || document.body);

    if (!parentContainer) return;

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
    \`;

    widgetDiv.innerHTML = \`
      <div style="font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 4px;">
        <span>\${OFFER_DATA.badgeText}</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px;">
        <img src="\${OFFER_DATA.image}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 1px solid #6366f1;" />
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
        ">
          + AGREGAR OFF
        </button>
      </div>
    \`;

    if (checkoutBtn) {
      checkoutBtn.parentNode.insertBefore(widgetDiv, checkoutBtn);
    } else {
      parentContainer.appendChild(widgetDiv);
    }

    document.getElementById('btn-add-neohogar-upsell')?.addEventListener('click', function() {
      const btn = this;
      btn.innerText = '¡AGREGANDO...!';
      btn.style.background = '#10b981';
      btn.disabled = true;

      // Intentar agregar al carrito de Tiendanube
      fetch('/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: new URLSearchParams({
          'add_to_cart': '7961682',
          'quantity': '1'
        })
      }).catch(err => console.log('Cart add notice:', err))
        .finally(() => {
          btn.innerText = '¡AGREGADO!';
          setTimeout(() => { window.location.reload(); }, 600);
        });
    });
  }

  // Monitoreo continuo cada 300ms para asegurar la inyección al abrir el carrito
  setInterval(injectUpsellWidget, 300);
})();
  `;

  res.send(scriptContent);
}
