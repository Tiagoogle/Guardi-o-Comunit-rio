
import React, { useState } from 'react';
import { useManifestacoes } from '../../hooks/useManifestacoes';
import { ManifestationsList } from './components/ManifestationsList';
import { NewManifestationModal } from './components/NewManifestationModal';
import { ManifestationDetails } from './components/ManifestationDetails';
import { Plus } from 'lucide-react';
import { InteracaoHistorico } from '../../types';

export const ManifestationsPage = () => {
  const { history, addManifestacao, loading } = useManifestacoes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<InteracaoHistorico | null>(null);

  const handleAnalyze = async (text: string, channel: string) => {
    try {
      const newInteraction = await addManifestacao(text, channel);
      setIsModalOpen(false);
      setSelectedInteraction(newInteraction);
    } catch (e) {
      alert("Erro ao analisar.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h1 className="text-2xl font-bold text-slate-800">Manifestações</h1>
           <p className="text-slate-500">Gestão e tratamento de demandas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Nova Manifestação
        </button>
      </div>

      {selectedInteraction && (
        <div className="animate-in slide-in-from-top-4 fade-in">
          <button onClick={() => setSelectedInteraction(null)} className="text-sm text-slate-500 mb-2 hover:text-slate-800">← Voltar para lista</button>
          <ManifestationDetails interaction={selectedInteraction} />
        </div>
      )}

      {!selectedInteraction && (
        <ManifestationsList history={history} onSelect={setSelectedInteraction} />
      )}

      {isModalOpen && (
        <NewManifestationModal 
          onAnalyze={handleAnalyze} 
          isLoading={loading} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};
