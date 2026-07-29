import React, { useState } from 'react';
import { Code, Copy, Check, ExternalLink, Zap, ShieldCheck } from 'lucide-react';

export default function EmbedCodeModal({ creds }) {
  const [copied, setCopied] = useState(false);

  const scriptUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/api/widget.js` 
    : 'https://tu-app-upsell.vercel.app/api/widget.js';

  const embedSnippet = `<!-- Tienda Nube In-Cart Upsell Engine (App ID: ${creds.appId || '37816'}) -->
<script 
  src="${scriptUrl}" 
  data-app-id="${creds.appId || '37816'}" 
  async>
</script>`;

  const copySnippet = () => {
    navigator.clipboard.writeText(embedSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Instalación del Script en Tienda Nube</span>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            1-Click Embed
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Copia el código a continuación e insértalo en tu panel de administración de Tienda Nube.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Snippet de Inyección de Carrito</h3>
          </div>

          <button
            onClick={copySnippet}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 hover:bg-indigo-600/50'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar Snippet'}</span>
          </button>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto selection:bg-indigo-500 selection:text-white">
          <pre>{embedSnippet}</pre>
        </div>

        {/* Step-by-step installation guide */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Instrucciones de Instalación en Tienda Nube:</h4>
          
          <ol className="space-y-2.5 text-xs text-slate-300 list-decimal list-inside">
            <li className="leading-relaxed">
              Ingresa a tu panel de control de <strong>Tienda Nube</strong>.
            </li>
            <li className="leading-relaxed">
              Ve a <strong>Configuración &gt; Códigos de seguimiento</strong> o <strong>Script Tags</strong>.
            </li>
            <li className="leading-relaxed">
              Pega el fragmento de código de arriba y guarda los cambios.
            </li>
            <li className="leading-relaxed">
              ¡Listo! El widget de <strong>In-Cart Upsell</strong> comenzará a renderizar automáticamente las ofertas configuradas en el carrito de tu tienda.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
