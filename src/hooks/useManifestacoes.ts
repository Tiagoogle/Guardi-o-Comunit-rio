
import { useState, useEffect } from 'react';
import { InteracaoHistorico } from '../types';
import { analisarInteracao } from '../services/geminiService';

const STORAGE_KEY = 'guardiao_comunitario_history';

export const useManifestacoes = () => {
  const [history, setHistory] = useState<InteracaoHistorico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        const hydrated = parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
        setHistory(hydrated);
      } catch (e) {
        console.error("Erro storage:", e);
      }
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isInitialized]);

  const addManifestacao = async (text: string, channel: string) => {
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
      
      setHistory(prev => [newInteraction, ...prev]);
      return newInteraction;
    } catch (err) {
      setError('Erro ao processar interação.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    history,
    loading,
    error,
    addManifestacao,
    clearHistory,
    isInitialized
  };
};
