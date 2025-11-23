
export enum CanalOrigem {
  WHATSAPP = 'WhatsApp',
  WEB_FORM = 'Formulário Web',
  EMAIL = 'E-mail',
  APP_MOVEL = 'App Móvel',
  TOTENS = 'Totens',
  REDES_SOCIAIS = 'Redes Sociais',
  OUTROS = 'Outros'
}

export interface ObserverOutput {
  normalized_text: string;
  geolocation: {
    lat?: number;
    lon?: number;
    address_description?: string;
  } | null;
  detected_entities: string[];
  channel: string;
}

export interface TriageOutput {
  type: string;
  theme: string;
  sentiment: 'Negativo Extremo' | 'Negativo Moderado' | 'Neutro' | 'Positivo';
  urgency: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  confidence_score: number;
  area_responsavel: string;
  sla_recommendation: string;
}

export interface AnalystOutput {
  risk_score: number;
  latent_themes: string[];
  prediction: string;
  confidence_index_impact: 'Positivo' | 'Estável' | 'Em Queda';
  silent_risk_detected: boolean;
}

export interface StrategistOutput {
  suggested_actions: string[];
  priority_level: number;
  escalation_required: boolean;
  escalation_target?: string;
  proactive_mitigation_plan: string;
}

export interface CommunicatorOutput {
  reply_text: string;
  tone_used: string;
  needs_human_review: boolean;
}

export interface MultiAgentSystemResult {
  observer: ObserverOutput;
  triage: TriageOutput;
  analyst: AnalystOutput;
  strategist: StrategistOutput;
  communicator: CommunicatorOutput;
}

export interface InteracaoHistorico {
  id: string;
  timestamp: Date;
  input_text: string;
  analise: MultiAgentSystemResult;
}
