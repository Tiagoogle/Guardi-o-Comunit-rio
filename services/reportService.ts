
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { InteracaoHistorico } from "../types";

// Função auxiliar para achatar o objeto JSON para Excel e tratar nulos
const flattenData = (item: InteracaoHistorico) => {
  const result = item.analise;
  return {
    ID: item.id || "N/A",
    Data: item.timestamp ? new Date(item.timestamp).toLocaleString() : "Data Inválida",
    Canal: result.observer?.channel || "Desconhecido",
    Mensagem_Original: item.input_text || "",
    Localizacao: result.observer?.geolocation?.address_description || "N/A",
    
    // Triage
    Tipo: result.triage?.type || "N/A",
    Tema: result.triage?.theme || "N/A",
    Urgencia: result.triage?.urgency || "N/A",
    Sentimento: result.triage?.sentiment || "N/A",
    Score_Confianca: result.triage?.confidence_score || 0,
    SLA_Recomendado: result.triage?.sla_recommendation || "N/A",
    Area_Responsavel: result.triage?.area_responsavel || "N/A",

    // Analyst
    Score_Risco: result.analyst?.risk_score || 0,
    Risco_Silencioso: result.analyst?.silent_risk_detected ? "SIM" : "NÃO",
    Predicao: result.analyst?.prediction || "",
    Impacto_Confianca: result.analyst?.confidence_index_impact || "N/A",

    // Strategist
    Prioridade: result.strategist?.priority_level || 0,
    Escalonamento: result.strategist?.escalation_required ? "SIM" : "NÃO",
    Alvo_Escalonamento: result.strategist?.escalation_target || "N/A",
    Plano_Mitigacao: result.strategist?.proactive_mitigation_plan || "N/A",
    
    // Communicator
    Resposta_Sugerida: result.communicator?.reply_text || "",
    Revisao_Humana: result.communicator?.needs_human_review ? "SIM" : "NÃO"
  };
};

export const generateIndividualPDF = (item: InteracaoHistorico) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 10;
    let y = 15;

    // Header
    doc.setFontSize(16);
    doc.text("Relatório de Manifestação Individual", margin, y);
    y += 10;
    
    doc.setFontSize(10);
    doc.text(`ID: ${item.id} | Data: ${new Date(item.timestamp).toLocaleString()}`, margin, y);
    y += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Conteúdo Original
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Entrada Original:", margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    
    const safeText = item.input_text || "Texto vazio";
    const splitText = doc.splitTextToSize(safeText, pageWidth - (margin * 2));
    doc.text(splitText, margin, y);
    y += (splitText.length * 5) + 10;

    // Seções dos Agentes
    const addSection = (title: string, data: any) => {
      // Check for page break
      if (y > 270) { 
        doc.addPage(); 
        y = 15; 
      }
      
      doc.setFillColor(245, 247, 250); // slate-50 equivalent
      doc.rect(margin, y - 5, pageWidth - (margin * 2), 7, 'F');
      
      doc.setFontSize(11);
      doc.setTextColor(30, 41, 59); // slate-800
      doc.setFont("helvetica", "bold");
      doc.text(title, margin + 2, y);
      y += 8;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(51, 65, 85); // slate-700
      
      Object.entries(data).forEach(([key, value]) => {
         if (y > 280) { doc.addPage(); y = 15; }
         const safeValue = value !== null && value !== undefined ? String(value) : "N/A";
         // Handle long values in properties
         const line = `${key}: ${safeValue}`;
         const splitLine = doc.splitTextToSize(line, pageWidth - (margin * 2));
         doc.text(splitLine, margin + 5, y);
         y += (splitLine.length * 5) + 1;
      });
      y += 5;
    };

    addSection("1. Triagem & Classificação", {
      Tipo: item.analise.triage.type,
      Tema: item.analise.triage.theme,
      Urgência: item.analise.triage.urgency,
      SLA: item.analise.triage.sla_recommendation,
      Área: item.analise.triage.area_responsavel
    });

    addSection("2. Análise de Risco", {
      Score: `${(item.analise.analyst.risk_score * 100).toFixed(0)}%`,
      "Risco Silencioso": item.analise.analyst.silent_risk_detected ? "DETECTADO" : "Não detectado",
      Predição: item.analise.analyst.prediction
    });

    addSection("3. Estratégia", {
      Prioridade: item.analise.strategist.priority_level,
      Escalonamento: item.analise.strategist.escalation_required ? "SIM" : "NÃO",
      Plano: item.analise.strategist.proactive_mitigation_plan
    });

    addSection("4. Resposta Sugerida", {
      Texto: item.analise.communicator.reply_text.substring(0, 300) + (item.analise.communicator.reply_text.length > 300 ? "..." : "")
    });

    doc.save(`manifestacao_${item.id}.pdf`);
  } catch (e) {
    console.error("Erro ao gerar PDF:", e);
    alert("Erro ao gerar o PDF. Verifique os dados e tente novamente.");
  }
};

export const generateIndividualExcel = (item: InteracaoHistorico) => {
  try {
    const flattened = flattenData(item);
    const ws = XLSX.utils.json_to_sheet([flattened]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Manifestacao");
    XLSX.writeFile(wb, `manifestacao_${item.id}.xlsx`);
  } catch (e) {
    console.error("Erro ao gerar Excel:", e);
    alert("Erro ao gerar o Excel.");
  }
};

export const generateAggregatedReport = (data: InteracaoHistorico[], type: 'Diário' | 'Semanal' | 'Mensal', format: 'pdf' | 'excel') => {
  if (!data || data.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }

  const now = new Date();
  let filteredData = data;

  // Filtragem (usando timestamp do item)
  if (data.length > 0) {
      const oneDay = 24 * 60 * 60 * 1000;
      const oneWeek = 7 * oneDay;
      const oneMonth = 30 * oneDay;
      
      const timeDiff = type === 'Diário' ? oneDay : type === 'Semanal' ? oneWeek : oneMonth;
      
      filteredData = data.filter(d => {
        const itemDate = new Date(d.timestamp);
        const diff = now.getTime() - itemDate.getTime();
        return diff < timeDiff;
      });
  }

  if (filteredData.length === 0) {
      alert(`Não há registros para o período: ${type}.`);
      return;
  }

  if (format === 'excel') {
      try {
        const flattenedRows = filteredData.map(flattenData);
        const ws = XLSX.utils.json_to_sheet(flattenedRows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, `Relatorio_${type}`);
        XLSX.writeFile(wb, `relatorio_consolidado_${type.toLowerCase()}.xlsx`);
      } catch (e) {
        console.error("Erro Excel consolidado:", e);
        alert("Erro ao gerar relatório Excel.");
      }
  } else {
      try {
        const doc = new jsPDF('l'); // Landscape
        doc.setFontSize(18);
        doc.text(`Relatório Consolidado - ${type}`, 14, 22);
        doc.setFontSize(11);
        doc.text(`Gerado em: ${now.toLocaleString()} | Total de Registros: ${filteredData.length}`, 14, 30);

        const tableColumn = ["ID", "Data", "Tema", "Urgência", "Risco", "Status"];
        const tableRows: any[] = [];

        filteredData.forEach(item => {
          const row = [
            (item.id || "").substring(Math.max(0, (item.id || "").length - 6)),
            new Date(item.timestamp).toLocaleDateString(),
            item.analise.triage.theme,
            item.analise.triage.urgency,
            item.analise.analyst.silent_risk_detected ? "ALTO (Silencioso)" : "Normal",
            item.analise.strategist.escalation_required ? "ESCALONADO" : "Resolvido"
          ];
          tableRows.push(row);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 40,
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129] }, // Emerald color
        });

        doc.save(`relatorio_${type.toLowerCase()}.pdf`);
      } catch (e) {
        console.error("Erro PDF consolidado:", e);
        alert("Erro ao gerar relatório PDF consolidado.");
      }
  }
};
