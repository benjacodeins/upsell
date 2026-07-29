import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CartSimulator from './components/CartSimulator';
import RulesManager from './components/RulesManager';
import Analytics from './components/Analytics';
import EmbedCodeModal from './components/EmbedCodeModal';
import TiendaNubeAuth from './components/TiendaNubeAuth';
import { 
  getStoredRules, 
  saveStoredRules, 
  getStoredAnalytics, 
  saveStoredAnalytics, 
  getStoredCredentials, 
  saveStoredCredentials,
  fetchRealTiendaNubeProducts,
  NEO_HOGAR_PRODUCTS
} from './services/store';

export default function App() {
  const [activeTab, setActiveTab] = useState('simulator');
  const [rules, setRules] = useState(getStoredRules);
  const [analytics, setAnalytics] = useState(getStoredAnalytics);
  const [creds, setCreds] = useState(getStoredCredentials);
  const [products, setProducts] = useState(NEO_HOGAR_PRODUCTS);

  useEffect(() => {
    fetchRealTiendaNubeProducts()
      .then(realProds => {
        if (realProds && realProds.length > 0) {
          setProducts(realProds);
        }
      })
      .catch(err => console.log('Store products fallback active:', err));
  }, []);

  useEffect(() => {
    saveStoredRules(rules);
  }, [rules]);

  useEffect(() => {
    saveStoredAnalytics(analytics);
  }, [analytics]);

  useEffect(() => {
    saveStoredCredentials(creds);
  }, [creds]);

  const handleConversion = (ruleId, revenueBoost) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return {
          ...r,
          conversions: r.conversions + 1,
          revenueBoosted: r.revenueBoosted + revenueBoost
        };
      }
      return r;
    }));

    setAnalytics(prev => {
      const newAccepted = prev.totalUpsellsAdded + 1;
      const newImpressions = prev.totalImpressions + 1;
      const newExtraRevenue = prev.totalExtraRevenue + revenueBoost;
      const newRate = ((newAccepted / newImpressions) * 100).toFixed(1) + '%';

      return {
        totalImpressions: newImpressions,
        totalUpsellsAdded: newAccepted,
        totalExtraRevenue: newExtraRevenue,
        conversionRate: newRate
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} creds={creds} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'simulator' && (
          <CartSimulator rules={rules} products={products} onConversion={handleConversion} />
        )}

        {activeTab === 'rules' && (
          <RulesManager rules={rules} setRules={setRules} products={products} />
        )}

        {activeTab === 'analytics' && (
          <Analytics analytics={analytics} rules={rules} products={products} />
        )}

        {activeTab === 'embed' && (
          <EmbedCodeModal creds={creds} />
        )}

        {activeTab === 'settings' && (
          <TiendaNubeAuth creds={creds} setCreds={setCreds} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Tienda Nube In-Cart Engine</span>
            <span>• Store ID: {creds.storeId || '7961682'}</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Neo Hogar Sync</span>
            <span>•</span>
            <span>Vercel Serverless Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
