import React, { useState } from 'react';
import { Code, Copy, Check, ExternalLink, Zap, ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function EmbedCodeModal({ creds }) {
  const [copied, setCopied] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installStatus, setInstallStatus] = useState(null);

  const scriptUrl = 'https://upsell-gamma-bay.vercel.app/api/widget.js';

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

  const handleAutoInstall = async () => {
    setInstalling(true);
    setInstallStatus(null);
    try {
      const res = await fetch('/api/tiendanube/scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scriptUrl })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInstallStatus({ success: true, message: '¡Script inyectado automáticamente en tu Tienda Nube!' });
      } else {
        setInstallStatus({ success: false, message: data.error?.description || data.error || 'No se pudo autorizar mediante API. Puedes usar el método manual con GTM o Edición de Plantilla.' });
      }
    } catch (err) {
      setInstallStatus({ success: false, message: err.message });
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <span>Instalación del Widget en Tienda Nube</span>
          <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
            Script Injection Engine
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Guía rápida de integración para renderizar ofertas de Upsell en el carrito de tu tienda.
        </p>
      </div>

      {/* Auto Install Card */}
      <div className="glass-panel p-6 rounded-2xl border-emerald-500/40 bg-emerald-950/20 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Opción 1: Instalación Automática 1-Click (Vía API Script Tags)
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Si tu app está vinculada con la API de Tiendanube, puedes inyectar el script directamente en tu tienda con un clic.
            </p>
          </div>
          <button
            onClick={handleAutoInstall}
            disabled={installing}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center space-x-2 whitespace-nowrap shrink-0"
          >
            {installing ? 'Inyectando...' : 'Inyectar Script en Tienda'}
          </button>
        </div>

        {installStatus && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${installStatus.success ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}>
            {installStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
            <span>{installStatus.message}</span>
          </div>
        )}
      </div>

      {/* Alert Warning Box */}
      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
        <div className="font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          ¡Atención sobre la configuración en Tienda Nube!
        </div>
        <p>
          El campo <strong>"Metaetiqueta de Google"</strong> en <em>Códigos Externos</em> NO ejecuta código JavaScript <code>&lt;script&gt;</code> (Tienda Nube elimina/sanitiza las etiquetas de script ahí por seguridad ya que es solo para meta-tags de verificación).
        </p>
      </div>

      {/* Manual Install Snippet */}
      <div className="glass-panel p-6 rounded-2xl border-indigo-500/30 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-sm">Opción 2: Snippet para Instalación Manual</h3>
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

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Métodos Manuales Correctos en Tienda Nube:</h4>
          
          <div className="space-y-4 text-xs text-slate-300">
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-indigo-300">Método A: Vía Google Tag Manager (GTM) [Recomendado]</strong>
              <p className="text-slate-400">1. En Tienda Nube coloca tu ID de Google Tag Manager (ej: GTM-XXXXXXX).</p>
              <p className="text-slate-400">2. En tu cuenta de GTM, crea una etiqueta tipo <em>HTML Personalizado</em>, pega el snippet de arriba y activa en <em>All Pages</em>.</p>
            </div>

            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-1">
              <strong className="text-indigo-300">Método B: Edición de Código de Plantilla (layout.tpl)</strong>
              <p className="text-slate-400">1. En Tienda Nube ve a <strong>Mi Tienda Nube &gt; Diseño &gt; Edición de código</strong> (o vía FTP).</p>
              <p className="text-slate-400">2. Abre el archivo <code>layouts/layout.tpl</code> y pega el <code>&lt;script ...&gt;&lt;/script&gt;</code> justo antes de la etiqueta <code>&lt;/body&gt;</code>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

