import React from 'react';
import { InteracaoHistorico } from '../types';
import { Clock, AlertCircle } from 'lucide-react';

interface HistorySidebarProps {
  history: InteracaoHistorico[];
  onSelect: (item: InteracaoHistorico) => void;
  currentId?: string;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, currentId }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[calc(100vh-8rem)] sticky top-24">
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <Clock size={18} />
          Histórico Recente
        </h3>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-2">
        {history.length === 0 ? (
          <div className="text-center py-8 px-4 text-slate-400 text-sm">
            Nenhuma interação registrada ainda.
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item)}
              className={`w-full text-left p-3 rounded-lg border transition-all duration-200 hover:shadow-md group ${
                currentId === item.id 
                  ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' 
                  : 'bg-white border-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-slate-500">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                {item.analise.triage.urgency === 'Alta' || item.analise.triage.urgency === 'Crítica' ? (
                  <AlertCircle size={14} className="text-red-500" />
                ) : null}
              </div>
              <p className="text-sm font-semibold text-slate-800 line-clamp-1 mb-1">
                {item.analise.triage.theme}
              </p>
              <p className="text-xs text-slate-500 line-clamp-2">
                {item.input_text}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
};