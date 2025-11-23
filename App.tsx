
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { InteractionForm } from './components/InteractionForm';
import { AnalysisCard } from './components/AnalysisCard';
import { HistorySidebar } from './components/HistorySidebar';
import { StatsDashboard } from './components/StatsDashboard';
import { ReportsToolbar } from './components/ReportsToolbar';
import { HistoryTable } from './components/HistoryTable';
import { analisarInteracao } from './services/geminiService';
import { MultiAgentSystemResult, InteracaoHistorico } from './types';
import { AlertCircle, Terminal } from 'lucide-react';

const STORAGE_KEY = 'guardiao_comunitario_history';

const App: React.FC = () => {
  const [history, setHistory] = useState<InteracaoHistorico[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentInteraction, setCurrentInteraction] = useState<InteracaoHistorico | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Hydrate Date objects because JSON.parse makes them strings
        const hydrated = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(hydrated);
        if (hydrated.length > 0) {
          setCurrentInteraction(hydrated[0]);
        }
      } catch (e) {
        console.error("Erro ao carregar histórico local:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isInitialized]);

  const handleClearHistory = () => {
    if (window.confirm("Tem certeza que deseja apagar todo o histórico de interações?")) {
      setHistory([]);
      setCurrentInteraction(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleAnalyze = async (text: string, channel: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analisarInteracao(text, channel);
      const newInteraction: InteracaoHistorico = {
        id: Date.now().toString(),
        timestamp: new Date(),
        input_text: text,
        analise: result,
      };
      
      const updatedHistory = [newInteraction, ...history];
      setHistory(updatedHistory);
      setCurrentInteraction(newInteraction);
      
      // Auto-save immediatelly just in case
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));

    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao processar a interação. Verifique sua conexão e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: InteracaoHistorico) => {
    setCurrentInteraction(item);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isInitialized) return null; // Prevent flash of empty state

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header onClearHistory={history.length > 0 ? handleClearHistory : undefined} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3">
             <HistorySidebar 
                history={history} 
                onSelect={handleSelectHistory} 
                currentId={currentInteraction?.id} 
             />
          </div>
          <div className="lg:col-span-9 space-y-6">
            <ReportsToolbar history={history} />
            <StatsDashboard data={history} />
            
            <InteractionForm onAnalyze={handleAnalyze} isLoading={loading} />
            
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {currentInteraction ? (
              <AnalysisCard 
                result={currentInteraction.analise} 
                fullInteractionObj={currentInteraction}
              />
            ) : (
              !loading && (
                <div className="bg-white border-2 border-slate-200 border-dashed rounded-xl p-12 text-center select-none">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-400 mb-4">
                    <Terminal size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">Aguardando Interação</h3>
                  <p className="mt-2 text-slate-500 max-w-md mx-auto">
                    O sistema de Inteligência Artificial está pronto. Utilize o formulário acima para registrar uma manifestação da comunidade e iniciar o ciclo de análise proativa.
                  </p>
                </div>
              )
            )}

            {/* Nova Tabela de Histórico */}
            <div className="pt-8 border-t border-slate-200">
              <HistoryTable history={history} onSelect={handleSelectHistory} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
