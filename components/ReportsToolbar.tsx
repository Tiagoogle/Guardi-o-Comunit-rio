import React from 'react';
import { InteracaoHistorico } from '../types';
import { generateAggregatedReport } from '../services/reportService';
import { FileText, Table, Calendar } from 'lucide-react';

interface ReportsToolbarProps {
  history: InteracaoHistorico[];
}

export const ReportsToolbar: React.FC<ReportsToolbarProps> = ({ history }) => {
  const handleExport = (period: 'Diário' | 'Semanal' | 'Mensal', format: 'pdf' | 'excel') => {
    generateAggregatedReport(history, period, format);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
          <Calendar size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Relatórios Consolidados</h3>
          <p className="text-xs text-slate-500">Exporte indicadores e históricos por período</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {['Diário', 'Semanal', 'Mensal'].map((period) => (
          <div key={period} className="flex items-center bg-slate-50 rounded-lg border border-slate-200 p-1">
            <span className="px-3 text-xs font-semibold text-slate-600">{period}</span>
            <div className="h-4 w-px bg-slate-300 mx-1"></div>
            <button
              onClick={() => handleExport(period as any, 'pdf')}
              title="PDF"
              className="p-1.5 hover:bg-white rounded-md text-slate-500 hover:text-red-600 transition-colors"
            >
              <FileText size={16} />
            </button>
            <button
              onClick={() => handleExport(period as any, 'excel')}
              title="Excel"
              className="p-1.5 hover:bg-white rounded-md text-slate-500 hover:text-green-600 transition-colors"
            >
              <Table size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
