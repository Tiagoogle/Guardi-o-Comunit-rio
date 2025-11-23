import React from 'react';
import { InteracaoHistorico } from '../types';
import { Eye, AlertTriangle, CheckCircle, Clock, FileText } from 'lucide-react';
import { generateIndividualPDF } from '../services/reportService';

interface HistoryTableProps {
  history: InteracaoHistorico[];
  onSelect: (item: InteracaoHistorico) => void;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, onSelect }) => {
  if (history.length === 0) {
    return null;
  }

  const getUrgencyBadge = (urgency: string) => {
    const styles = {
      'Baixa': 'bg-emerald-100 text-emerald-800 border-emerald-200',
      'Média': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Alta': 'bg-orange-100 text-orange-800 border-orange-200',
      'Crítica': 'bg-red-100 text-red-800 border-red-200',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold border ${styles[urgency as keyof typeof styles] || styles['Baixa']}`}>
        {urgency}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Clock size={18} className="text-slate-500" />
          Registro Completo de Interações
        </h3>
        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
          {history.length} registros
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Data/Hora</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Canal</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tema</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Urgência</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Risco Silencioso</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {history.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 font-medium">
                  {item.analise.observer.channel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  {item.analise.triage.theme}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getUrgencyBadge(item.analise.triage.urgency)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.analise.analyst.silent_risk_detected ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded border border-purple-100 w-fit">
                      <AlertTriangle size={12} /> DETECTADO
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <CheckCircle size={12} /> Normal
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        generateIndividualPDF(item);
                      }}
                      title="Baixar Relatório PDF"
                      className="text-slate-600 hover:text-red-700 bg-slate-100 hover:bg-red-50 p-2 rounded-lg transition-colors border border-slate-200"
                    >
                      <FileText size={16} />
                    </button>
                    <button
                      onClick={() => onSelect(item)}
                      className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 p-2 rounded-lg transition-colors flex items-center gap-1 border border-indigo-100"
                    >
                      <Eye size={16} /> Ver Análise
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};