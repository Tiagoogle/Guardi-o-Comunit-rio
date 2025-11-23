
import React, { useState } from 'react';
import { MultiAgentSystemResult, InteracaoHistorico } from '../../../types';
import { generateIndividualPDF, generateIndividualExcel } from '../../../services/reportService';
import { 
  AlertTriangle, ThumbsDown, ThumbsUp, Minus, MapPin, 
  Activity, BrainCircuit, GitBranch, ShieldAlert, MessageSquare, 
  Search, Clock, Radar, FileText, Table, Tag, CheckCircle2, 
  ListChecks, Target, Zap, UserCog, BarChart3, Fingerprint
} from 'lucide-react';

interface Props {
  interaction: InteracaoHistorico;
}

export const ManifestationDetails: React.FC<Props> = ({ interaction }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'json'>('pipeline');
  const result = interaction.analise;

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'Negativo Extremo': return <AlertTriangle className="text-red-500" size={16} />;
      case 'Negativo Moderado': return <ThumbsDown className="text-orange-500" size={16} />;
      case 'Positivo': return <ThumbsUp className="text-emerald-500" size={16} />;
      default: return <Minus className="text-slate-400" size={16} />;
    }
  };

  const getUrgencyStyles = (urgency: string) => {
    switch (urgency) {
      case 'Crítica': return 'bg-red-100 text-red-800 border-red-200';
      case 'Alta': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Média': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const AgentSectionHeader = ({ icon: Icon, title, colorClass }: { icon: any, title: string, colorClass: string }) => (
    <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${colorClass} border-opacity-20`}>
      <div className={`p-1.5 rounded-lg ${colorClass} bg-opacity-10 text-slate-700`}>
        <Icon size={18} />
      </div>
      <h4 className="font-bold text-slate-800 uppercase tracking-wide text-xs">{title}</h4>
    </div>
  );

  const DataField = ({ label, value, icon: Icon }: { label: string, value: React.ReactNode, icon?: any }) => (
    <div className="mb-3">
      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mb-1">
        {Icon && <Icon size={10} />} {label}
      </span>
      <div className="text-sm text-slate-800 font-medium break-words leading-relaxed">
        {value || <span className="text-slate-400 italic">N/A</span>}
      </div>
    </div>
  );

  const TagsList = ({ tags }: { tags: string[] }) => (
    <div className="flex flex-wrap gap-1.5 mt-1">
      {tags.length > 0 ? tags.map((tag, idx) => (
        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200 font-medium">
          {tag}
        </span>
      )) : <span className="text-xs text-slate-400 italic">Nenhum detectado</span>}
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-2">
      {/* Top Header */}
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
           <div className="flex items-center gap-3 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${getUrgencyStyles(result.triage.urgency)}`}>
                {result.triage.urgency}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={12} /> {new Date(interaction.timestamp).toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 font-medium bg-white border px-2 py-0.5 rounded">
                ID: {interaction.id.slice(-6)}
              </span>
           </div>
           <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
             {result.triage.theme}
             {result.analyst.silent_risk_detected && (
               <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded border border-purple-200 flex items-center gap-1 animate-pulse">
                 <Radar size={12}/> Risco Silencioso
               </span>
             )}
           </h3>
        </div>
        
        <div className="flex gap-2 self-start md:self-center">
           <button 
            onClick={() => generateIndividualPDF(interaction)} 
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
           >
             <FileText size={14} /> PDF
           </button>
           <button 
            onClick={() => generateIndividualExcel(interaction)} 
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors shadow-sm"
           >
             <Table size={14} /> Excel
           </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 bg-white sticky top-0 z-10">
        <button 
          onClick={() => setActiveTab('pipeline')} 
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pipeline' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          Pipeline Multi-Agente
        </button>
        <button 
          onClick={() => setActiveTab('json')} 
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'json' ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
          JSON Bruto
        </button>
      </div>

      <div className="p-6 bg-slate-50/50">
        {activeTab === 'pipeline' ? (
          <div className="space-y-6">
            
            {/* ROW 1: Contexto e Triagem */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
               {/* OBSERVER AGENT */}
               <div className="bg-white border border-blue-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <AgentSectionHeader icon={Search} title="Agente Observador (Ingestão)" colorClass="bg-blue-500 text-blue-600" />
                  
                  <div className="space-y-4">
                    <DataField 
                      label="Geolocalização" 
                      icon={MapPin}
                      value={result.observer.geolocation?.address_description} 
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mb-1">
                        <Tag size={10} /> Entidades Detectadas
                      </span>
                      <TagsList tags={result.observer.detected_entities} />
                    </div>
                    <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <span className="text-xs font-bold text-slate-400 block mb-1 uppercase">Texto Normalizado</span>
                      <p className="text-xs text-slate-600 leading-relaxed italic">
                        "{result.observer.normalized_text || interaction.input_text}"
                      </p>
                    </div>
                  </div>
               </div>

               {/* TRIAGE AGENT */}
               <div className="bg-white border border-purple-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <AgentSectionHeader icon={BrainCircuit} title="Agente de Triagem (Classificação)" colorClass="bg-purple-500 text-purple-600" />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <DataField label="Tipo" value={result.triage.type} />
                    <DataField label="Área Responsável" icon={UserCog} value={result.triage.area_responsavel} />
                    
                    <div className="col-span-2 grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">Sentimento</span>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
                          {getSentimentIcon(result.triage.sentiment)} {result.triage.sentiment}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-slate-500 block mb-1">Confiança IA</span>
                        <div className="flex items-center gap-2">
                           <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500 rounded-full" 
                                style={{ width: `${(result.triage.confidence_score * 100)}%` }}
                              ></div>
                           </div>
                           <span className="text-xs font-bold text-purple-700">{(result.triage.confidence_score * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                       <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mb-1">
                          <Clock size={10} /> SLA Recomendado
                       </span>
                       <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                         {result.triage.sla_recommendation}
                       </span>
                    </div>
                  </div>
               </div>
            </div>

            {/* ROW 2: Analista e Estrategista */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
               {/* ANALYST AGENT */}
               <div className="bg-white border border-indigo-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                  <AgentSectionHeader icon={Activity} title="Agente Analista (Predição)" colorClass="bg-indigo-500 text-indigo-600" />
                  
                  <div className="flex justify-between items-start mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                     <div>
                       <span className="text-xs font-bold text-slate-400 uppercase">Score de Risco</span>
                       <div className={`text-2xl font-black ${result.analyst.risk_score > 0.6 ? 'text-red-600' : 'text-emerald-600'}`}>
                         {(result.analyst.risk_score * 100).toFixed(0)}<span className="text-sm text-slate-400 font-normal">/100</span>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="text-xs font-bold text-slate-400 uppercase">Impacto na Confiança</span>
                       <div className={`text-sm font-bold mt-1 px-2 py-0.5 rounded border inline-block
                          ${result.analyst.confidence_index_impact === 'Em Queda' ? 'bg-red-50 text-red-700 border-red-200' : 
                            result.analyst.confidence_index_impact === 'Estável' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                            'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }
                       `}>
                         {result.analyst.confidence_index_impact}
                       </div>
                     </div>
                  </div>

                  <DataField label="Predição de Curto Prazo" icon={BarChart3} value={result.analyst.prediction} />
                  
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mb-1">
                      <Fingerprint size={10} /> Temas Latentes
                    </span>
                    <TagsList tags={result.analyst.latent_themes} />
                  </div>
               </div>

               {/* STRATEGIST AGENT */}
               <div className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${result.strategist.escalation_required ? 'border-red-200' : 'border-orange-100'}`}>
                  {result.strategist.escalation_required && (
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-1 font-bold rounded-bl-lg">
                      ESCALONAMENTO REQUERIDO
                    </div>
                  )}
                  <AgentSectionHeader icon={GitBranch} title="Agente Estratégico (Ação)" colorClass="bg-orange-500 text-orange-600" />

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex-1">
                      <span className="text-xs font-semibold text-slate-500">Nível de Prioridade</span>
                      <div className="flex gap-1 mt-1">
                        {[1,2,3,4,5].map(lvl => (
                          <div key={lvl} className={`h-2 flex-1 rounded-full ${lvl <= result.strategist.priority_level ? 'bg-orange-500' : 'bg-slate-200'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {result.strategist.escalation_required && (
                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-800">
                        <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold uppercase">Alvo de Escalonamento</p>
                          <p className="text-sm font-medium">{result.strategist.escalation_target}</p>
                        </div>
                     </div>
                  )}

                  <div className="mb-4">
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mb-2">
                      <ListChecks size={12} /> Ações Recomendadas
                    </span>
                    <ul className="space-y-2">
                      {result.strategist.suggested_actions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded border border-slate-100">
                           <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                           {action}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 mb-1">
                      <Target size={12} /> Plano de Mitigação Proativa
                    </span>
                    <p className="text-xs text-slate-600 bg-orange-50/50 p-2 rounded border border-orange-100 border-dashed">
                      {result.strategist.proactive_mitigation_plan}
                    </p>
                  </div>
               </div>
            </div>

            {/* ROW 3: Comunicador */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 shadow-sm relative">
                <AgentSectionHeader icon={MessageSquare} title="Agente Comunicador (Resposta)" colorClass="bg-emerald-500 text-emerald-600" />
                
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="bg-white p-4 rounded-lg border border-emerald-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line shadow-sm relative">
                      {/* Chat bubble tail representation */}
                      <div className="absolute top-4 -left-1.5 w-3 h-3 bg-white border-l border-b border-emerald-100 transform rotate-45"></div>
                      {result.communicator.reply_text}
                    </div>
                  </div>

                  <div className="md:w-64 space-y-4">
                     <div className="bg-white p-3 rounded-lg border border-emerald-100">
                        <span className="text-xs font-semibold text-slate-500 block mb-1">Tom de Voz</span>
                        <div className="flex items-center gap-2">
                           <Zap size={14} className="text-yellow-500" />
                           <span className="text-sm font-medium text-slate-800">{result.communicator.tone_used}</span>
                        </div>
                     </div>

                     {result.communicator.needs_human_review ? (
                        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-800">
                           <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                             <UserCog size={14} /> Revisão Necessária
                           </div>
                           <p className="text-xs opacity-90">O agente marcou esta resposta para validação humana antes do envio.</p>
                        </div>
                     ) : (
                        <div className="bg-emerald-100 p-3 rounded-lg border border-emerald-200 text-emerald-800">
                           <div className="flex items-center gap-2 font-bold text-xs uppercase mb-1">
                             <CheckCircle2 size={14} /> Resposta Aprovada
                           </div>
                           <p className="text-xs opacity-90">Alta confiança. Pode ser enviada automaticamente.</p>
                        </div>
                     )}
                  </div>
                </div>
            </div>

          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto shadow-inner border border-slate-800">
            <pre className="text-xs font-mono text-emerald-400 leading-normal">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
