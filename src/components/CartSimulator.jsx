import React, { useState } from 'react';
import { ShoppingCart, Plus, Trash2, Zap, ArrowRight, CheckCircle, Tag, RefreshCw, ShieldCheck } from 'lucide-react';
import { MOCK_PRODUCTS } from '../services/store';

export default function CartSimulator({ rules, products = [], onConversion }) {
  const storeProducts = products && products.length > 0 ? products : MOCK_PRODUCTS;
  const [cartItems, setCartItems] = useState([
    { ...storeProducts[0], quantity: 1 }
  ]);
  const [showUpsellAnimation, setShowUpsellAnimation] = useState(false);
  const [addedUpsellSuccess, setAddedUpsellSuccess] = useState(null);

  // Find active upsell rules that match products currently in cart
  const activeMatchingRules = rules.filter(rule => {
    if (!rule.active) return false;
    return cartItems.some(item => Number(item.id) === Number(rule.triggerProductId));
  });

  // Get suggested upsell products that are NOT ALREADY in cart
  const upsellOffers = activeMatchingRules.map(rule => {
    const suggestedProd = storeProducts.find(p => Number(p.id) === Number(rule.suggestedProductId));
    if (!suggestedProd) return null;
    const isAlreadyInCart = cartItems.some(item => Number(item.id) === Number(suggestedProd.id));
    if (isAlreadyInCart) return null;

    const discountMultiplier = rule.discountType === 'percentage' 
      ? (100 - rule.discountValue) / 100 
      : 1;
    
    const discountedPrice = rule.discountType === 'percentage'
      ? Math.round(suggestedProd.price * discountMultiplier)
      : Math.max(0, suggestedProd.price - rule.discountValue);

    const savings = suggestedProd.price - discountedPrice;

    return {
      rule,
      suggestedProd,
      discountedPrice,
      savings
    };
  }).filter(Boolean);

  const addToCart = (product, customPrice = null, ruleId = null) => {
    setCartItems(prev => {
      const existing = prev.find(item => Number(item.id) === Number(product.id));
      if (existing) {
        return prev.map(item => Number(item.id) === Number(product.id) 
          ? { ...item, quantity: item.quantity + 1 }
          : item
        );
      }
      return [...prev, { 
        ...product, 
        price: customPrice !== null ? customPrice : product.price,
        originalPrice: customPrice !== null ? product.price : null,
        isUpsellItem: customPrice !== null,
        quantity: 1 
      }];
    });

    if (ruleId) {
      const offer = upsellOffers.find(o => o.rule.id === ruleId);
      if (offer) {
        onConversion(offer.rule.id, offer.discountedPrice);
        setAddedUpsellSuccess(offer.suggestedProd.name);
        setTimeout(() => setAddedUpsellSuccess(null), 3500);
      }
    }
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => Number(item.id) !== Number(id)));
  };

  const updateQuantity = (id, delta) => {
    setCartItems(prev => prev.map(item => {
      if (Number(item.id) === Number(id)) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const totalSavings = cartItems.reduce((acc, item) => {
    if (item.originalPrice) {
      return acc + ((item.originalPrice - item.price) * item.quantity);
    }
    return acc;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="glass-panel p-4 rounded-2xl border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900/60 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Simulador en Vivo de Tienda Nube</h3>
            <p className="text-xs text-slate-300">
              Prueba cómo los clientes ven las ofertas de In-Cart Upsell directamente en su carrito antes de comprar.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
            Tienda Nube ID: 37816
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Product Store Catalog */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>Catálogo de Productos Sincronizado</span>
              <span className="text-xs font-normal text-slate-400">({storeProducts.length} productos)</span>
            </h2>
            <button 
              onClick={() => setCartItems([{ ...storeProducts[0], quantity: 1 }])}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reiniciar Carrito</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {storeProducts.map((product) => {
              const isInCart = cartItems.some(i => Number(i.id) === Number(product.id));
              return (
                <div 
                  key={product.id}
                  className="glass-panel p-4 rounded-xl glass-panel-hover flex flex-col justify-between space-y-3"
                >
                  <div className="flex space-x-3">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-16 h-16 rounded-lg object-cover bg-slate-800 border border-slate-700/50"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold tracking-wider uppercase text-indigo-400">
                        {product.category}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100 truncate">{product.name}</h4>
                      <p className="text-xs font-mono font-bold text-cyan-400 mt-1">
                        ${product.price.toLocaleString('es-AR')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(product)}
                    className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                      isInCart
                        ? 'bg-slate-800 text-slate-300 border border-slate-700'
                        : 'bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isInCart ? 'Agregar otro a Carrito' : 'Agregar al Carrito'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Simulated Tienda Nube Cart Drawer */}
        <div className="lg:col-span-5">
          <div className="glass-panel rounded-2xl border-indigo-500/30 overflow-hidden shadow-2xl sticky top-20">
            {/* Cart Header */}
            <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold text-white text-base">Carrito de Tienda Nube</h3>
              </div>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {cartItems.reduce((a, b) => a + b.quantity, 0)} ítems
              </span>
            </div>

            {/* Success Toast */}
            {addedUpsellSuccess && (
              <div className="bg-emerald-500/20 border-b border-emerald-500/40 p-3 text-emerald-300 text-xs flex items-center space-x-2 animate-bounce">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span><strong>¡Oferta aceptada!</strong> Se agregó <strong>{addedUpsellSuccess}</strong> con descuento a tu carrito.</span>
              </div>
            )}

            {/* Cart Items List */}
            <div className="p-4 max-h-[280px] overflow-y-auto space-y-3">
              {cartItems.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  El carrito está vacío. Agrega un producto del catálogo para ver el funcionamiento.
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex items-center space-x-3 min-w-0">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover" />
                      <div className="min-w-0">
                        <h5 className="text-xs font-medium text-slate-200 truncate">{item.name}</h5>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs font-bold text-cyan-400">${item.price.toLocaleString('es-AR')}</span>
                          {item.originalPrice && (
                            <span className="text-[10px] line-through text-slate-500">${item.originalPrice.toLocaleString('es-AR')}</span>
                          )}
                          {item.isUpsellItem && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              UPSELL
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-slate-800 rounded-lg px-2 py-0.5 border border-slate-700">
                        <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-400 hover:text-white text-xs">-</button>
                        <span className="text-xs font-bold px-1 text-slate-200">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-400 hover:text-white text-xs">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-rose-400 p-1">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* IN-CART UPSELL WIDGET SECTION */}
            {upsellOffers.length > 0 && (
              <div className="p-4 bg-gradient-to-b from-indigo-950/80 to-purple-950/60 border-t border-b border-indigo-500/40 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300 flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
                    <span>Oferta Especial de Carrito</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-300 border border-yellow-400/40">
                    TIENDA NUBE IN-CART ENGINE
                  </span>
                </div>

                {upsellOffers.map(({ rule, suggestedProd, discountedPrice, savings }) => (
                  <div 
                    key={rule.id}
                    className="glass-panel p-3 rounded-xl border-indigo-400/40 bg-slate-900/90 space-y-2.5 shadow-lg relative overflow-hidden"
                  >
                    <div className="bg-indigo-600/30 -mx-3 -mt-3 p-2 px-3 border-b border-indigo-500/30 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-300 flex items-center space-x-1">
                        <Tag className="w-3 h-3" />
                        <span>{rule.badgeText}</span>
                      </span>
                    </div>

                    <div className="flex space-x-3 pt-1">
                      <img 
                        src={suggestedProd.image} 
                        alt={suggestedProd.name} 
                        className="w-14 h-14 rounded-lg object-cover border border-indigo-500/40 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h6 className="text-xs font-bold text-white truncate">{suggestedProd.name}</h6>
                        <p className="text-[11px] text-slate-400 line-clamp-1">Complemento sugerido por tu compra</p>

                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm font-extrabold text-emerald-400">
                            ${discountedPrice.toLocaleString('es-AR')}
                          </span>
                          <span className="text-xs line-through text-slate-500">
                            ${suggestedProd.price.toLocaleString('es-AR')}
                          </span>
                          <span className="text-[10px] font-extrabold text-indigo-300 px-1.5 py-0.5 rounded bg-indigo-500/30">
                            Ahorras ${savings.toLocaleString('es-AR')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(suggestedProd, discountedPrice, rule.id)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white glow-button flex items-center justify-center space-x-2 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      <Zap className="w-3.5 h-3.5 text-yellow-300" />
                      <span>Agregar a mi Carrito (+ Descuento)</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Cart Footer Summary */}
            <div className="p-4 bg-slate-950 space-y-3">
              {totalSavings > 0 && (
                <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                  <span>¡Ahorro total de Upsell aplicado!</span>
                  <span>-${totalSavings.toLocaleString('es-AR')}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-300 text-sm">
                <span>Subtotal de Carrito:</span>
                <span className="font-bold text-white text-base">${subtotal.toLocaleString('es-AR')}</span>
              </div>

              <button className="w-full py-3 rounded-xl font-extrabold text-sm text-slate-900 bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 hover:opacity-95 transition-all flex items-center justify-center space-x-2 shadow-lg">
                <span>Iniciar Checkout en Tienda Nube</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center space-x-1 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>Integración Oficial Tienda Nube • App ID 37816</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
