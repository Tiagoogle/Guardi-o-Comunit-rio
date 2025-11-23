
import React from 'react';
import { StatsCards } from './components/StatsCards';
import { useManifestacoes } from '../../hooks/useManifestacoes';

export const DashboardPage = () => {
  const { history } = useManifestacoes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Visão Geral</h1>
        <p className="text-slate-500">Monitoramento em tempo real do risco comunitário.</p>
      </div>
      <StatsCards data={history} />
    </div>
  );
};
