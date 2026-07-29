export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const scriptContent = `
(function() {
  console.log('⚡ [Neo Hogar Upsell Engine Active] Store ID: 7961682');

  const UPSELL_OFFER = {
    triggerKeywords: ['SECADOR', 'ROPA'],
    suggestedProduct: {
      id: 3,
      name: 'ORGANIZADOR DE CALZADO (10 NIVELES)',
      price: 24500,
      discountPrice: 19600,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
      badge: '🔥 20% OFF LLEVANDO CON TU SECADOR'
    }
  };

  function injectUpsellInNeoHogarCart() {
    if (document.getElementById('neohogar-upsell-box')) return;

    // Buscar contenedores típicos del carrito en el tema de Neo Hogar
    const cartContainer = document.querySelector('#ajax-cart, .cart-summary, #modal-cart, .js-modal-cart, .modal-cart, [data-modal-id="modal-cart"], .notification-cart-container') || document.querySelector('button[type="submit"], input[type="submit"]')?.parentElement;

    if (!cartContainer) return;

    const offer = UPSELL_OFFER.suggestedProduct;

    const widgetHtml = \`
      <div id="neohogar-upsell-box" style="
        background: #0f172a;
        border: 2px solid #6366f1;
        border-radius: 14px;
        padding: 14px;
        margin: 14px 0;
        color: #ffffff;
        font-family: system-ui, -apple-system, sans-serif;
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.35);
        text-align: left;
        clear: both;
      ">
        <div style="font-size: 11px; font-weight: 800; color: #fbbf24; text-transform: uppercase; tracking: 0.5px; margin-bottom: 8px; display: flex; align-items: center; gap: 4px;">
          <span>⚡</span> <span>\${offer.badge}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="\${offer.image}" style="width: 54px; height: 54px; border-radius: 10px; object-fit: cover; border: 1px solid #4f46e5;" />
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 13px; font-weight: 700; color: #f8fafc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\${offer.name}</div>
            <div style="font-size: 13px; font-weight: 800; color: #34d399; margin-top: 3px;">
              $\${offer.discountPrice.toLocaleString('es-AR')} 
              <span style="font-size: 11px; text-decoration: line-through; color: #94a3b8; margin-left: 4px;">$\${offer.price.toLocaleString('es-AR')}</span>
            </div>
          </div>
          <button id="neo-add-upsell-btn" style="
            background: linear-gradient(135deg, #6366f1, #7c3aed);
            color: #ffffff;
            border: none;
            padding: 10px 14px;
            border-radius: 10px;
            font-size: 11px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(99, 102, 241, 0.5);
            transition: transform 0.2s ease;
          ">
            + AGREGAR OFF
          </button>
        </div>
      </div>
    \`;

    const checkoutBtn = cartContainer.querySelector('input[name="checkout"], .js-cart-checkout, a[href*="checkout"], button[type="submit"]');
    if (checkoutBtn) {
      checkoutBtn.parentNode.insertBefore(document.createRange().createContextualFragment(widgetHtml), checkoutBtn);
    } else {
      cartContainer.appendChild(document.createRange().createContextualFragment(widgetHtml));
    }

    document.getElementById('neo-add-upsell-btn')?.addEventListener('click', function() {
      this.innerText = '¡AGREGADO!';
      this.style.background = '#10b981';
      alert('¡Se agregó el ' + offer.name + ' con 20% OFF a tu pedido!');
    });
  }

  // Observador continuo para detectar cuando se abre el carrito desplegable
  setInterval(injectUpsellInNeoHogarCart, 1000);
})();
  `;

  res.send(scriptContent);
}
