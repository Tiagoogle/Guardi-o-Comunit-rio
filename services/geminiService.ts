
import { GoogleGenAI, Type } from "@google/genai";
import { MultiAgentSystemResult } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const STRATEGIC_PLAN_CONTEXT = `
CONTEXTO ESTRATÉGICO: "Gestão Proativa de Risco Comunitário com IA"
O objetivo é transformar a gestão de risco de um centro de custo reativo para um motor de vantagem competitiva proativa.

CONCEITOS CHAVE:
1. **Risco Silencioso**: Manifestações mal classificadas ou ignoradas que escalam para crises de reputação. O sistema deve identificar isso ativamente.
2. **Ciclo de Ação Inteligente**:
   - Escuta Omnichannel (Observer)
   - Inteligência Preditiva (Analyst/Triage)
   - Ação Orquestrada (Strategist)
   - Transparência (Communicator)

AGENTES DO SISTEMA (Baseado na arquitetura do Agente Autônomo):

1. **Observer (Escuta Omnichannel)**:
   - Coleta e normaliza dados. Garante que nenhuma voz seja perdida (acessibilidade).

2. **Triage (Classificação Inteligente & SLA)**:
   - Classifica Tipo e Tema.
   - Define a Urgência baseada no impacto potencial à LSO (Licença Social para Operar).
   - **Novo**: Define o SLA (Prazo de Resposta) recomendado para garantir consistência.

3. **Analyst (Inteligência Preditiva)**:
   - Identifica "Risco Silencioso": Padrões sutis que indicam problemas maiores.
   - Calcula Score de Risco focado na antecipação de crises.
   - Prevê impacto no Índice de Confiança.

4. **Strategist (Ação Orquestrada)**:
   - Foco em **Mitigação Proativa**: Não apenas reagir, mas gerar planos para neutralizar ameaças antes que escalem.
   - Prioriza ações baseadas em Sustentabilidade, Eficiência e Mitigação de Riscos.
   - Define escalonamento para riscos à LSO.

5. **Communicator (Transparência)**:
   - Gera respostas que fortalecem a confiança.
   - Assegura transparência e tom empático.
`;

const SYSTEM_INSTRUCTION = `
Você é o "Agente Autônomo de Inteligência Comunitária".
Sua missão é processar interações seguindo o Plano Estratégico de Gestão Proativa.

Diretrizes de Comportamento:
1. **Detecte Risco Silencioso**: Se o texto parecer inofensivo mas contiver palavras-chave sobre barragens, saúde crônica, ou insatisfação coletiva recorrente, marque 'silent_risk_detected' como true.
2. **Seja Proativo**: No campo 'proactive_mitigation_plan', sugira ações que previnam a reincidência, não apenas resolvam o caso atual.
3. **Defina SLA**: No campo 'sla_recommendation', defina prazos agressivos (ex: "2 horas") para riscos altos e padrões (ex: "48 horas") para dúvidas simples.

${STRATEGIC_PLAN_CONTEXT}
`;

/**
 * Helper function to clean markdown code blocks from the response
 * to prevent JSON.parse failures.
 */
const cleanJsonOutput = (text: string): string => {
  let cleaned = text.trim();
  // Remove markdown code blocks if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\n?/, '').replace(/\n?```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '').replace(/\n?```$/, '');
  }
  return cleaned;
};

export const analisarInteracao = async (inputText: string, canalOrigem: string): Promise<MultiAgentSystemResult> => {
  if (!API_KEY) {
    throw new Error("API Key não configurada. Por favor, configure a variável de ambiente API_KEY.");
  }

  try {
    const model = "gemini-2.5-flash";
    
    const prompt = `
    INPUT:
    Canal: "${canalOrigem}"
    Texto Bruto: "${inputText}"

    Execute o ciclo de ação inteligente. Retorne APENAS o JSON.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            observer: {
              type: Type.OBJECT,
              properties: {
                normalized_text: { type: Type.STRING },
                geolocation: {
                  type: Type.OBJECT,
                  properties: {
                    lat: { type: Type.NUMBER },
                    lon: { type: Type.NUMBER },
                    address_description: { type: Type.STRING }
                  },
                  nullable: true
                },
                detected_entities: { type: Type.ARRAY, items: { type: Type.STRING } },
                channel: { type: Type.STRING }
              }
            },
            triage: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                theme: { type: Type.STRING },
                sentiment: { type: Type.STRING, enum: ['Negativo Extremo', 'Negativo Moderado', 'Neutro', 'Positivo'] },
                urgency: { type: Type.STRING, enum: ['Baixa', 'Média', 'Alta', 'Crítica'] },
                confidence_score: { type: Type.NUMBER },
                area_responsavel: { type: Type.STRING },
                sla_recommendation: { type: Type.STRING, description: "Prazo sugerido para resolução (ex: 2h, 24h)" }
              }
            },
            analyst: {
              type: Type.OBJECT,
              properties: {
                risk_score: { type: Type.NUMBER },
                latent_themes: { type: Type.ARRAY, items: { type: Type.STRING } },
                prediction: { type: Type.STRING },
                confidence_index_impact: { type: Type.STRING, enum: ['Positivo', 'Estável', 'Em Queda'] },
                silent_risk_detected: { type: Type.BOOLEAN, description: "Se detectou risco latente/silencioso" }
              }
            },
            strategist: {
              type: Type.OBJECT,
              properties: {
                suggested_actions: { type: Type.ARRAY, items: { type: Type.STRING } },
                priority_level: { type: Type.NUMBER },
                escalation_required: { type: Type.BOOLEAN },
                escalation_target: { type: Type.STRING, nullable: true },
                proactive_mitigation_plan: { type: Type.STRING, description: "Plano para evitar recorrência e proteger LSO" }
              }
            },
            communicator: {
              type: Type.OBJECT,
              properties: {
                reply_text: { type: Type.STRING },
                tone_used: { type: Type.STRING },
                needs_human_review: { type: Type.BOOLEAN }
              }
            }
          },
          required: ["observer", "triage", "analyst", "strategist", "communicator"]
        }
      }
    });

    const rawText = response.text;
    if (!rawText) throw new Error("A IA retornou uma resposta vazia.");

    const cleanedJson = cleanJsonOutput(rawText);
    
    try {
      return JSON.parse(cleanedJson) as MultiAgentSystemResult;
    } catch (parseError) {
      console.error("Erro ao fazer parse do JSON:", parseError, "Raw Text:", rawText);
      throw new Error("Falha ao processar a resposta estruturada da IA.");
    }

  } catch (error) {
    console.error("Erro ao processar pipeline:", error);
    throw error;
  }
};
