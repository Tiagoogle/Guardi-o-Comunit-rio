
import React from 'react';
import { InteracaoHistorico } from '../../../types';
import { Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface Props {
  history: InteracaoHistorico[];
  onSelect: (item: InteracaoHistorico) => void;
}

export const ManifestationsList: React.FC<Props> = ({ history, onSelect }) => {
  if (history.length === 0) return <div className="text-center p-8 text-slate-500">Nenhuma manifestação registrada.</div>;

  const getUrgencyBadge = (urgency: string) => {
    const styles: any = {
      'Baixa': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Média': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Alta': 'bg-orange-100 text-orange-800 border-orange-200',
      'Crítica': 'bg-red-100 text-red-800 border-red-200',
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-bold border ${styles[urgency] || styles['Baixa']}`}>{urgency}</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Canal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tema</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Urgência</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Risco Silencioso</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(item.timestamp).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.analise.observer.channel}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.analise.triage.theme}</td>
                <td className="px-6 py-4 whitespace-nowrap">{getUrgencyBadge(item.analise.triage.urgency)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.analise.analyst.silent_risk_detected ? 
                    <span className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100 w-fit"><AlertTriangle size={12} /> SIM</span> : 
                    <span className="flex items-center gap-1 text-xs text-slate-400"><CheckCircle size={12} /> Não</span>
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                   <button onClick={() => onSelect(item)} className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end gap-1 w-full">
                     <Eye size={16} /> Ver
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
