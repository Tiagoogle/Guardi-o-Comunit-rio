
import React, { useState } from 'react';
import { MultiAgentSystemResult, InteracaoHistorico } from '../types';
import { generateIndividualPDF, generateIndividualExcel } from '../services/reportService';
import { 
  AlertTriangle, 
  ThumbsDown, 
  ThumbsUp, 
  Minus, 
  MapPin, 
  Megaphone, 
  Activity,
  CheckCircle2,
  BrainCircuit,
  Eye,
  GitBranch,
  ShieldAlert,
  MessageSquare,
  Search,
  Users,
  Clock,
  Radar,
  FileText,
  Table
} from 'lucide-react';

interface AnalysisCardProps {
  result: MultiAgentSystemResult;
  // Adicionamos o objeto completo opcional para poder passar para o gerador de relatórios
  fullInteractionObj?: InteracaoHistorico; 
}

export const AnalysisCard: React.FC<AnalysisCardProps> = ({ result, fullInteractionObj }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'json'>('pipeline');

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Negativo Extremo': return <AlertTriangle className="text-red-500" />;
      case 'Negativo Moderado': return <ThumbsDown className="text-orange-500" />;
      case 'Positivo': return <ThumbsUp className="text-emerald-500" />;
      default: return <Minus className="text-slate-400" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Crítica': return 'bg-red-100 text-red-800 border-red-200';
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const AgentHeader = ({ icon: Icon, title, subtitle }: any) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="bg-slate-100 p-1.5 rounded-md text-slate-600">
        <Icon size={16} />
      </div>
      <div>
        <h4 className="text-sm font-bold text-slate-800 leading-none">{title}</h4>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in duration-500">
      {/* Top Status Bar */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${getUrgencyColor(result.triage.urgency)}`}>
                Urgência: {result.triage.urgency}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-white border border-slate-200 text-slate-600">
                {result.triage.type}
              </span>
           </div>
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             {result.triage.theme}
             {result.analyst.silent_risk_detected && (
               <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1 animate-pulse">
                 <Radar size={12}/> Risco Silencioso Detectado
               </span>
             )}
           </h3>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
            <div className="flex gap-4 text-center mr-4">
              <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Score Risco</div>
                  <div className={`text-xl font-black ${result.analyst.risk_score > 0.6 ? 'text-red-500' : 'text-emerald-500'}`}>
                    {(result.analyst.risk_score * 100).toFixed(0)}%
                  </div>
              </div>
              <div>
                  <div className="text-xs text-slate-400 font-bold uppercase">Prioridade</div>
                  <div className="text-xl font-black text-slate-700">
                    {result.strategist.priority_level}/5
                  </div>
              </div>
            </div>

            {fullInteractionObj && (
              <div className="flex gap-2">
                <button 
                  onClick={() => generateIndividualPDF(fullInteractionObj)}
                  title="Baixar PDF"
                  className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  <FileText size={18} />
                </button>
                <button 
                  onClick={() => generateIndividualExcel(fullInteractionObj)}
                  title="Baixar Excel"
                  className="p-2 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  <Table size={18} />
                </button>
              </div>
            )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('pipeline')}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'pipeline' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Pipeline Agente Autônomo
        </button>
        <button 
          onClick={() => setActiveTab('json')}
          className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'json' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Dados Brutos (JSON)
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'pipeline' ? (
          <div className="space-y-8 relative">
            {/* Visual connector line */}
            <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100 hidden md:block"></div>

            {/* Stage 1: Observer & Triage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
               <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative z-10">
                  <AgentHeader icon={Search} title="Agente Observador" subtitle="Escuta Omnichannel" />
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="mt-0.5 text-slate-400"/>
                      <span className="text-slate-700">{result.observer.geolocation?.address_description || 'Sem localização detectada'}</span>
                    </div>
                    {result.observer.detected_entities.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.observer.detected_entities.map((e, i) => (
                           <span key={i} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{e}</span>
                        ))}
                      </div>
                    )}
                  </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative z-10">
                  <AgentHeader icon={BrainCircuit} title="Agente de Triagem" subtitle="Classificação & SLA" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                       <span className="text-xs text-slate-500 block">Sentimento</span>
                       <div className="flex items-center gap-1 font-medium text-slate-700">
                         {getSentimentIcon(result.triage.sentiment)} {result.triage.sentiment}
                       </div>
                     </div>
                     <div>
                       <span className="text-xs text-slate-500 block">SLA Recomendado</span>
                       <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 font-medium flex items-center gap-1 w-fit">
                         <Clock size={12} /> {result.triage.sla_recommendation}
                       </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Stage 2: Analyst & Strategist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
               <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm relative z-10">
                  <AgentHeader icon={Activity} title="Agente Analista" subtitle="Inteligência Preditiva" />
                  <div className="space-y-3 text-sm">
                     {result.analyst.silent_risk_detected && (
                       <div className="bg-purple-50 p-2 rounded border border-purple-100 text-purple-800 text-xs font-medium">
                         ⚠️ Risco Silencioso detectado: Potencial de escalada para crise de reputação.
                       </div>
                     )}
                     <div>
                        <span className="text-xs text-slate-500">Predição</span>
                        <p className="text-slate-700 italic">"{result.analyst.prediction}"</p>
                     </div>
                     <div>
                        <span className="text-xs text-slate-500">Impacto LSO (Confiança)</span>
                        <div className={`font-medium ${
                          result.analyst.confidence_index_impact === 'Em Queda' ? 'text-red-600' : 
                          result.analyst.confidence_index_impact === 'Estável' ? 'text-blue-600' : 'text-emerald-600'
                        }`}>
                          {result.analyst.confidence_index_impact}
                        </div>
                     </div>
                  </div>
               </div>

               <div className={`bg-white border rounded-lg p-4 shadow-sm relative z-10 ${result.strategist.escalation_required ? 'border-red-200 bg-red-50/30' : 'border-slate-200'}`}>
                  <AgentHeader icon={GitBranch} title="Agente Estratégico" subtitle="Mitigação Proativa" />
                  
                  {result.strategist.escalation_required && (
                    <div className="mb-3 bg-red-100 border border-red-200 text-red-800 p-2 rounded text-xs font-bold flex items-center gap-2">
                      <ShieldAlert size={14} />
                      ESCALONAR PARA: {result.strategist.escalation_target}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div>
                      <span className="text-xs text-slate-500 font-bold">Plano de Mitigação Proativa</span>
                      <p className="text-xs text-slate-700 bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                        {result.strategist.proactive_mitigation_plan}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-500 font-bold">Ações Recomendadas</span>
                      <ul className="mt-1 space-y-1">
                        {result.strategist.suggested_actions.map((act, i) => (
                          <li key={i} className="text-xs flex items-start gap-1.5 text-slate-700">
                             <div className="min-w-[4px] h-[4px] rounded-full bg-slate-400 mt-1.5"></div>
                             {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
               </div>
            </div>

            {/* Stage 3: Communicator & Mediator */}
            <div className="relative z-10">
               <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <AgentHeader icon={MessageSquare} title="Agente Comunicador" subtitle="Resposta Transparente" />
                    {result.communicator.needs_human_review && (
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded border border-amber-200 font-bold flex items-center gap-1">
                        <Users size={12} /> Revisão Mediador
                      </span>
                    )}
                  </div>
                  
                  <div className="bg-white p-4 rounded border border-emerald-100 text-slate-700 text-sm whitespace-pre-line leading-relaxed shadow-sm">
                    {result.communicator.reply_text}
                  </div>

                  <div className="mt-3 flex justify-between items-center text-xs text-emerald-700 font-medium px-1">
                    <span>Tom Utilizado: {result.communicator.tone_used}</span>
                    <button className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded transition-colors shadow-sm">
                       <Megaphone size={12} /> Aprovar & Enviar
                    </button>
                  </div>
               </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
            <pre className="text-xs font-mono text-emerald-400">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
