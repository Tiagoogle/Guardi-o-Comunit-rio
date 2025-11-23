
import React, { useState } from 'react';
import { Send, Loader2, X } from 'lucide-react';
import { CanalOrigem } from '../../../types';

interface Props {
  onAnalyze: (text: string, channel: string) => void;
  isLoading: boolean;
  onClose: () => void;
}

export const NewManifestationModal: React.FC<Props> = ({ onAnalyze, isLoading, onClose }) => {
  const [text, setText] = useState('');
  const [channel, setChannel] = useState<string>(CanalOrigem.WHATSAPP);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text, channel);
      // Close handled by parent usually after success, but for simplicity here:
      if (!isLoading) setText('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>
        
        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <span className="bg-indigo-100 text-indigo-600 p-1.5 rounded-md mr-2">
            <Send size={18} />
          </span>
          Nova Manifestação
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Canal de Origem</label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 bg-slate-50"
            >
              {Object.values(CanalOrigem).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-3 bg-slate-50"
              placeholder="Descreva a manifestação..."
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !text.trim()}
            className={`w-full flex justify-center items-center py-2.5 px-4 rounded-lg text-white font-medium
              ${isLoading ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'}
            `}
          >
            {isLoading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" /> Processando...</> : 'Analisar'}
          </button>
        </form>
      </div>
    </div>
  );
};
