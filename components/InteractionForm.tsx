import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { CanalOrigem } from '../types';

interface InteractionFormProps {
  onAnalyze: (text: string, channel: string) => void;
  isLoading: boolean;
}

export const InteractionForm: React.FC<InteractionFormProps> = ({ onAnalyze, isLoading }) => {
  const [text, setText] = useState('');
  const [channel, setChannel] = useState<string>(CanalOrigem.WHATSAPP);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text, channel);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
        <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-md mr-2">
          <Send size={18} />
        </span>
        Nova Interação
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="channel" className="block text-sm font-medium text-slate-700 mb-1">
            Canal de Origem
          </label>
          <select
            id="channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2.5 border bg-slate-50"
          >
            {Object.values(CanalOrigem).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            Mensagem da Comunidade
          </label>
          <textarea
            id="message"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-lg border-slate-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-3 border bg-slate-50 placeholder:text-slate-400"
            placeholder="Ex: 'Ouvi uma explosão muito forte perto da minha casa agora à tarde...'"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !text.trim()}
          className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
            ${isLoading || !text.trim() ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'}
            transition-colors duration-200
          `}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              Processando...
            </>
          ) : (
            'Analisar Interação'
          )}
        </button>
      </form>
    </div>
  );
};