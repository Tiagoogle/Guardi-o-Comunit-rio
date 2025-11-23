
import React from 'react';
import { InteracaoHistorico } from '../../../types';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Activity, ShieldAlert, TrendingUp, CheckCircle } from 'lucide-react';

interface StatsCardsProps {
  data: InteracaoHistorico[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data }) => {
  if (data.length === 0) {
    return <div className="p-4 bg-white rounded shadow-sm text-slate-500">Sem dados para exibir no dashboard.</div>;
  }

  const urgencyCounts = data.reduce((acc, curr) => {
    const u = curr.analise.triage.urgency;
    acc[u] = (acc[u] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const urgencyData = Object.keys(urgencyCounts).map(key => ({
    name: key,
    value: urgencyCounts[key]
  }));

  const URGENCY_COLORS: Record<string, string> = {
    'Baixa': '#10B981', 
    'Média': '#F59E0B', 
    'Alta': '#F97316', 
    'Crítica': '#EF4444', 
  };

  const highRiskCount = data.filter(d => d.analise.analyst.risk_score > 0.6).length;
  const escalationCount = data.filter(d => d.analise.strategist.escalation_required).length;
  const avgConfidence = data.reduce((acc, curr) => acc + curr.analise.triage.confidence_score, 0) / data.length;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Total</p>
                <h3 className="text-2xl font-bold text-slate-800">{data.length}</h3>
              </div>
              <Activity className="text-indigo-500 h-5 w-5" />
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Críticos</p>
                <h3 className="text-2xl font-bold text-red-600">{highRiskCount}</h3>
              </div>
              <ShieldAlert className="text-red-500 h-5 w-5" />
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Escalonados</p>
                <h3 className="text-2xl font-bold text-orange-600">{escalationCount}</h3>
              </div>
              <TrendingUp className="text-orange-500 h-5 w-5" />
            </div>
         </div>
         <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase">Confiança IA</p>
                <h3 className="text-2xl font-bold text-emerald-600">{(avgConfidence * 100).toFixed(0)}%</h3>
              </div>
              <CheckCircle className="text-emerald-500 h-5 w-5" />
            </div>
         </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-72">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Distribuição de Urgência</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={urgencyData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {urgencyData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={URGENCY_COLORS[entry.name] || '#CBD5E1'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-72">
          <h4 className="text-sm font-semibold text-slate-700 mb-4">Risco por Tema Recente</h4>
          <ResponsiveContainer width="100%" height="100%">
             <BarChart data={data.slice(0, 10).reverse()}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
               <XAxis dataKey="analise.triage.theme" tick={{fontSize: 10}} interval={0} />
               <YAxis domain={[0, 1]} tick={{fontSize: 10}} />
               <Tooltip />
               <Bar dataKey="analise.analyst.risk_score" fill="#6366F1" radius={[4, 4, 0, 0]}>
                 {data.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={entry.analise.analyst.risk_score > 0.6 ? '#EF4444' : '#6366F1'} />
                 ))}
               </Bar>
             </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
