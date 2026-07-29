import React, { useState } from 'react';
import { Plus, Trash2, Tag, X, Sparkles, ToggleLeft, ToggleRight, Package } from 'lucide-react';

export default function RulesManager({ rules = [], setRules, products = [] }) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const availableProducts = products && products.length > 0 ? products : [];

  const [formData, setFormData] = useState({
    name: '',
    triggerProductId: availableProducts[0]?.id || '',
    suggestedProductId: availableProducts[1]?.id || availableProducts[0]?.id || '',
    discountType: 'percentage',
    discountValue: 20,
    badgeText: '⚡ ¡Aprovecha 20% OFF en este complemento!'
  });

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const newRule = {
      id: `rule-${Date.now()}`,
      ...formData,
      triggerProductId: String(formData.triggerProductId || availableProducts[0]?.id),
      suggestedProductId: String(formData.suggestedProductId || availableProducts[1]?.id || availableProducts[0]?.id),
      discountValue: Number(formData.discountValue),
      active: true,
      conversions: 0,
      revenueBoosted: 0
    };

    setRules(prev => [newRule, ...prev]);
    setShowCreateModal(false);
    setFormData({
      name: '',
      triggerProductId: availableProducts[0]?.id || '',
      suggestedProductId: availableProducts[1]?.id || availableProducts[0]?.id || '',
      discountType: 'percentage',
      discountValue: 20,
      badgeText: '⚡ ¡Aprovecha 20% OFF en este complemento!'
    });
  };

  const toggleRuleActive = (id) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  const deleteRule = (id) => {
    setRules(prev => prev.filter(r => r.id !== id));
  };

  const getProductName = (id) => {
    const prod = availableProducts.find(p => String(p.id) === String(id));
    return prod ? prod.name : 'Producto Neo Hogar';
  };

  const getProductImage = (id) => {
    const prod = availableProducts.find(p => String(p.id) === String(id));
    return prod?.image || '';
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <span>Reglas de In-Cart Upsell</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {rules.length} configuradas
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Define qué producto complementario de Neo Hogar se sugiere en el carrito con descuento.
          </p>
        </div>

        <button
          onClick={() => {
            if (availableProducts.length > 0) {
              setFormData(prev => ({
                ...prev,
                triggerProductId: availableProducts[0]?.id,
                suggestedProductId: availableProducts[1]?.id || availableProducts[0]?.id
              }));
            }
            setShowCreateModal(true);
          }}
          className="glow-button px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nueva Regla de Upsell</span>
        </button>
      </div>

      {/* Rules List or Empty State */}
      {rules.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center space-y-4 border-dashed border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mx-auto flex items-center justify-center">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No tienes reglas creadas todavía</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Haz clic en <strong>"Crear Nueva Regla de Upsell"</strong> para elegir qué producto de Neo Hogar sugerir cuando tus clientes agreguen un ítem al carrito.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="glow-button px-5 py-2.5 rounded-xl text-xs font-bold text-white inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear mi Primera Regla</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => {
            const triggerName = getProductName(rule.triggerProductId);
            const triggerImg = getProductImage(rule.triggerProductId);
            const suggestedName = getProductName(rule.suggestedProductId);
            const suggestedImg = getProductImage(rule.suggestedProductId);

            return (
              <div
                key={rule.id}
                className={`glass-panel p-5 rounded-2xl glass-panel-hover border ${
                  rule.active ? 'border-indigo-500/30 bg-slate-900/80' : 'border-slate-800/60 bg-slate-950/40 opacity-70'
                } space-y-4 relative`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${rule.active ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                    <h3 className="font-bold text-white text-sm truncate">{rule.name}</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleRuleActive(rule.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg border font-semibold flex items-center space-x-1 ${
                        rule.active
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {rule.active ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                      <span>{rule.active ? 'Activa' : 'Pausada'}</span>
                    </button>
                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-indigo-950/40 border border-indigo-500/20 p-2.5 rounded-xl text-xs font-semibold text-indigo-300 flex items-center space-x-2">
                  <Tag className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0" />
                  <span className="truncate">{rule.badgeText}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 items-center">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    {triggerImg ? (
                      <img src={triggerImg} alt={triggerName} className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">En Carrito</span>
                      <span className="text-xs font-medium text-slate-200 truncate block">{triggerName}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 min-w-0 border-l border-slate-800 pl-3">
                    {suggestedImg ? (
                      <img src={suggestedImg} alt={suggestedName} className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-indigo-500/40" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-800 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                        <Package className="w-5 h-5" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <span className="text-[9px] uppercase font-bold text-indigo-400 block">
                        Ofertado ({rule.discountValue}{rule.discountType === 'percentage' ? '%' : '$'} OFF)
                      </span>
                      <span className="text-xs font-medium text-slate-200 truncate block">{suggestedName}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 text-slate-400 border-t border-slate-800/80">
                  <span>Conversiones: <strong className="text-white">{rule.conversions}</strong></span>
                  <span>Ingresos Extra: <strong className="text-emerald-400 font-mono">${rule.revenueBoosted.toLocaleString('es-AR')}</strong></span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full rounded-2xl border-indigo-500/40 p-6 space-y-5 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-indigo-400" />
                <span>Crear Regla de In-Cart Upsell</span>
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre de la Regla</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Oferta Secador + Organizador"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Si está en carrito (Disparador)</label>
                  <select
                    value={formData.triggerProductId}
                    onChange={(e) => setFormData({ ...formData, triggerProductId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Sugerir este complemento</label>
                  <select
                    value={formData.suggestedProductId}
                    onChange={(e) => setFormData({ ...formData, suggestedProductId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    {availableProducts.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Descuento</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="percentage">Porcentaje (% OFF)</option>
                    <option value="fixed">Monto Fijo ($ OFF)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Valor del Descuento</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Texto del Badge Promocional</label>
                <input
                  type="text"
                  required
                  placeholder="⚡ ¡Aprovecha 20% OFF en este producto!"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="glow-button px-5 py-2 rounded-xl text-xs font-bold text-white"
                >
                  Guardar Regla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
