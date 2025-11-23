
import React from 'react';
import { InteracaoHistorico } from '../../../types';
import { generateAggregatedReport } from '../../../services/reportService';
import { FileText, Table, Calendar } from 'lucide-react';

interface Props {
  history: InteracaoHistorico[];
}

export const ReportsGeneration: React.FC<Props> = ({ history }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Calendar size={20} /></div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Exportar Relatórios</h3>
          <p className="text-xs text-slate-500">Consolidados Diário, Semanal e Mensal</p>
        </div>
      </div>
      <div className="flex gap-2">
        {['Diário', 'Semanal', 'Mensal'].map((period) => (
          <div key={period} className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
            <span className="px-2 text-xs font-semibold text-slate-600">{period}</span>
            <div className="h-4 w-px bg-slate-300 mx-1"></div>
            <button onClick={() => generateAggregatedReport(history, period as any, 'pdf')} className="p-1.5 hover:bg-white rounded text-slate-500 hover:text-red-600"><FileText size={14}/></button>
            <button onClick={() => generateAggregatedReport(history, period as any, 'excel')} className="p-1.5 hover:bg-white rounded text-slate-500 hover:text-green-600"><Table size={14}/></button>
          </div>
        ))}
      </div>
    </div>
  );
};
