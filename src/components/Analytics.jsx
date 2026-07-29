import React from 'react';
import { DollarSign, TrendingUp, Eye, ShoppingCart, Award, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '../services/store';

export default function Analytics({ analytics, rules }) {
  const getProductName = (id) => {
    const prod = MOCK_PRODUCTS.find(p => Number(p.id) === Number(id));
    return prod ? prod.name : 'Producto';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Rendimiento & Métricas de Upsell</span>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Tienda Nube Live
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Impacto en ventas adicionales e incrementos de ticket promedio gracias al In-Cart Engine.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ventas Extra Generadas</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono glow-emerald">
            ${analytics.totalExtraRevenue.toLocaleString('es-AR')}
          </p>
          <p className="text-[11px] text-emerald-400 flex items-center space-x-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% de incremento en AOV</span>
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tasa de Conversión</span>
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono glow-text">
            {analytics.conversionRate}
          </p>
          <p className="text-[11px] text-indigo-300 font-semibold">
            Conversión promedio en carrito
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upsells Aceptados</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono glow-cyan">
            {analytics.totalUpsellsAdded}
          </p>
          <p className="text-[11px] text-cyan-300 font-semibold">
            Productos extra agregados
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Impresiones de Oferta</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono text-purple-300">
            {analytics.totalImpressions}
          </p>
          <p className="text-[11px] text-purple-300 font-semibold">
            Vistas del widget en carrito
          </p>
        </div>
      </div>

      {/* Top Rules Performance Breakdown */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Reglas de Upsell con Mayor Rendimiento</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase font-semibold">
                <th className="pb-3">Nombre de la Regla</th>
                <th className="pb-3">Producto Disparador</th>
                <th className="pb-3">Oferta Sugerida</th>
                <th className="pb-3 text-center">Conversiones</th>
                <th className="pb-3 text-right">Ingresos Extra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-900/40">
                  <td className="py-3 font-semibold text-white flex items-center space-x-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{rule.name}</span>
                  </td>
                  <td className="py-3 text-slate-300">{getProductName(rule.triggerProductId)}</td>
                  <td className="py-3 text-indigo-300 font-semibold">{getProductName(rule.suggestedProductId)}</td>
                  <td className="py-3 text-center font-bold text-slate-200">{rule.conversions}</td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-400">
                    ${rule.revenueBoosted.toLocaleString('es-AR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
