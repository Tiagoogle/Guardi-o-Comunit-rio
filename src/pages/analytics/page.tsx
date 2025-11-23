
import React from 'react';
import { useManifestacoes } from '../../hooks/useManifestacoes';
import { ReportsGeneration } from './components/ReportsGeneration';

export const AnalyticsPage = () => {
  const { history } = useManifestacoes();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Relatórios & Analytics</h1>
      <ReportsGeneration history={history} />
      {/* Aqui poderiam entrar mais gráficos complexos de CommunityAnalytics */}
    </div>
  );
};
