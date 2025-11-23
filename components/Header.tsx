
import React from 'react';
import { ShieldCheck, Trash2 } from 'lucide-react';

interface HeaderProps {
  onClearHistory?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClearHistory }) => {
  return (
    <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold leading-none">Guardião Comunitário</h1>
            <span className="text-xs text-slate-400 font-medium tracking-wider uppercase">Painel de Controle Socioambiental</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {onClearHistory && (
            <button 
              onClick={onClearHistory}
              className="text-slate-400 hover:text-white text-sm flex items-center gap-1 transition-colors mr-2"
              title="Limpar todos os dados locais"
            >
              <Trash2 size={14} />
              <span className="hidden sm:inline">Limpar Dados</span>
            </button>
          )}
          <div className="flex items-center space-x-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-emerald-400">Sistema Online</span>
          </div>
        </div>
      </div>
    </header>
  );
};
