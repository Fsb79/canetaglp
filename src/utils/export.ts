import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import {
  UserProfile,
  DoseRecord,
  SymptomRecord,
  WeightRecord,
  HydrationDay,
} from '../types';

export function exportToExcel(
  user: UserProfile,
  doses: DoseRecord[],
  weights: WeightRecord[],
  symptoms: SymptomRecord[],
  hydration: HydrationDay[]
): void {
  const wb = XLSX.utils.book_new();

  // 1. Resumo Geral
  const totalLossKg = (user.initialWeightKg - user.currentWeightKg).toFixed(1);
  const lossPercent = (
    ((user.initialWeightKg - user.currentWeightKg) / user.initialWeightKg) *
    100
  ).toFixed(1);

  const summaryData = [
    ['GLP360 - RELATÓRIO CLÍNICO INTEGRADO'],
    ['Data de Emissão:', new Date().toLocaleDateString('pt-BR')],
    [''],
    ['DADOS DO PACIENTE'],
    ['Nome:', user.name],
    ['E-mail:', user.email],
    ['Medicamento GLP-1:', user.medication],
    ['Dose Atual:', user.currentDose],
    ['Início do Tratamento:', user.startDate],
    ['Médico Assistente:', user.doctorName || 'Não informado'],
    ['CRM:', user.crm || 'Não informado'],
    [''],
    ['INDICADORES PONDERAIS'],
    ['Altura:', `${user.heightCm} cm`],
    ['Peso Inicial:', `${user.initialWeightKg} kg`],
    ['Peso Atual:', `${user.currentWeightKg} kg`],
    ['Peso Meta:', `${user.targetWeightKg} kg`],
    ['Perda Total Acumulada:', `${totalLossKg} kg (${lossPercent}%)`],
    [
      'IMC Atual:',
      (user.currentWeightKg / ((user.heightCm / 100) * (user.heightCm / 100))).toFixed(1),
    ],
    ['Meta Diária de Hidratação:', `${user.dailyWaterGoalMl} ml`],
    ['Meta Diária de Proteína:', `${user.dailyProteinGoalGrams} g`],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Resumo do Paciente');

  // 2. Histórico de Doses
  const doseRows = doses.map((d) => ({
    'Data da Aplicação': d.date,
    'Horário': d.time,
    'Medicamento': d.medication,
    'Dose Administrada': d.dosage,
    'Local de Injeção': translateSite(d.injectionSite),
    'Trocou Agulha': d.needleChanged ? 'Sim' : 'Não',
    'Nível de Dor (1-5)': d.painLevel || 1,
    'Observações': d.notes || '',
  }));
  const wsDoses = XLSX.utils.json_to_sheet(doseRows);
  XLSX.utils.book_append_sheet(wb, wsDoses, 'Histórico de Doses');

  // 3. Evolução do Peso
  const weightRows = weights.map((w) => ({
    'Data da Pesagem': w.date,
    'Peso (kg)': w.weightKg,
    'Cintura (cm)': w.waistCm || '-',
    'Quadril (cm)': w.hipCm || '-',
    'Abdômen (cm)': w.abdominalCm || '-',
    'Observações': w.notes || '',
  }));
  const wsWeights = XLSX.utils.json_to_sheet(weightRows);
  XLSX.utils.book_append_sheet(wb, wsWeights, 'Evolução Corporal');

  // 4. Registro de Sintomas
  const symptomRows = symptoms.map((s) => ({
    'Data': s.date,
    'Horário': s.time,
    'Sintoma': s.symptomName,
    'Gravidade (1 a 5)': s.severity,
    'Humor (1 a 5)': s.mood,
    'Bem-Estar Físico (1 a 5)': s.physicalWellbeing,
    'Horas Pós-Dose': s.hoursAfterDose ? `${s.hoursAfterDose}h` : 'N/A',
    'Anotações do Paciente': s.notes || '',
    'Conduta/Alívio Recomendado': s.aiAdvice ? s.aiAdvice.immediateRelief.join('; ') : '',
  }));
  const wsSymptoms = XLSX.utils.json_to_sheet(symptomRows);
  XLSX.utils.book_append_sheet(wb, wsSymptoms, 'Registro de Sintomas');

  // 5. Hidratação
  const hydrationRows = hydration.map((h) => ({
    'Data': h.date,
    'Total Consumido (ml)': h.totalMl,
    'Meta do Dia (ml)': h.goalMl,
    '% Atingido': `${Math.round((h.totalMl / h.goalMl) * 100)}%`,
    'Número de Registros': h.entries.length,
  }));
  const wsHydration = XLSX.utils.json_to_sheet(hydrationRows);
  XLSX.utils.book_append_sheet(wb, wsHydration, 'Hidratação');

  // Write and download
  const dateStr = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `GLP1_Relatorio_Clinico_${user.name.replace(/\s+/g, '_')}_${dateStr}.xlsx`);
}

function translateSite(site: string): string {
  switch (site) {
    case 'abdomen_right':
      return 'Abdômen Direito';
    case 'abdomen_left':
      return 'Abdômen Esquerdo';
    case 'thigh_right':
      return 'Coxa Direita';
    case 'thigh_left':
      return 'Coxa Esquerda';
    case 'arm_right':
      return 'Braço Direito';
    case 'arm_left':
      return 'Braço Esquerdo';
    default:
      return site;
  }
}

export function exportToPdf(
  user: UserProfile,
  doses: DoseRecord[],
  weights: WeightRecord[],
  symptoms: SymptomRecord[],
  doctorSummaryAi?: string
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const primaryColor = [8, 43, 85]; // #082B55
  const accentTurquoise = [0, 201, 215]; // #00C9D7
  const emeraldColor = [53, 214, 138]; // #35D68A

  let y = 18;

  // Header Bar
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(0, 0, 210, 26, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('GLP360  |  RELATÓRIO CLÍNICO DE ACOMPANHAMENTO', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `Gerado em: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')} • Documento para consulta médica`,
    14,
    19
  );

  y = 35;

  // Patient Card
  doc.setDrawColor(220, 225, 235);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, y, 182, 34, 2, 2, 'FD');

  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('DADOS DO PACIENTE & ESQUEMA TERAPÊUTICO', 18, y + 7);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(50, 60, 75);

  doc.text(`Paciente: ${user.name}`, 18, y + 14);
  doc.text(`E-mail: ${user.email}`, 18, y + 20);
  doc.text(`Início da Terapia: ${user.startDate}`, 18, y + 26);

  doc.text(`Medicamento: ${user.medication}`, 105, y + 14);
  doc.text(`Dose Atual: ${user.currentDose}`, 105, y + 20);
  doc.text(
    `Médico: ${user.doctorName || 'Dra. Camila Ramos'} (${user.crm || 'CRM/SP'})`,
    105,
    y + 26
  );

  y += 42;

  // KPIs
  const totalLossKg = (user.initialWeightKg - user.currentWeightKg).toFixed(1);
  const lossPercent = (
    ((user.initialWeightKg - user.currentWeightKg) / user.initialWeightKg) *
    100
  ).toFixed(1);
  const bmi = (
    user.currentWeightKg /
    ((user.heightCm / 100) * (user.heightCm / 100))
  ).toFixed(1);

  doc.setFillColor(240, 253, 250);
  doc.setDrawColor(accentTurquoise[0], accentTurquoise[1], accentTurquoise[2]);
  doc.roundedRect(14, y, 57, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${user.currentWeightKg} kg`, 18, y + 9);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 90, 105);
  doc.text(`Peso Atual (Inicial: ${user.initialWeightKg}kg)`, 18, y + 15);

  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(emeraldColor[0], emeraldColor[1], emeraldColor[2]);
  doc.roundedRect(76, y, 57, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(20, 120, 70);
  doc.text(`-${totalLossKg} kg (${lossPercent}%)`, 80, y + 9);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 90, 105);
  doc.text(`Evolução Ponderal Total`, 80, y + 15);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(220, 225, 235);
  doc.roundedRect(138, y, 58, 20, 2, 2, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text(`${bmi} kg/m²`, 142, y + 9);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 90, 105);
  doc.text(`IMC Atual (Altura: ${user.heightCm}cm)`, 142, y + 15);

  y += 28;

  // Section 1: Histórico de Doses
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('1. HISTÓRICO DAS ÚLTIMAS APLICAÇÕES', 14, y);
  y += 5;

  // Table header
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, y, 182, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DATA', 17, y + 4.2);
  doc.text('DOSE', 42, y + 4.2);
  doc.text('SÍTIO DE APLICAÇÃO', 75, y + 4.2);
  doc.text('AGULHA NOVA', 125, y + 4.2);
  doc.text('OBSERVAÇÕES', 155, y + 4.2);
  y += 7;

  // Dose table rows
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 50, 65);
  doses.slice(-5).forEach((d, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 1, 182, 5.5, 'F');
    }
    doc.text(d.date, 17, y + 3);
    doc.text(d.dosage, 42, y + 3);
    doc.text(translateSite(d.injectionSite), 75, y + 3);
    doc.text(d.needleChanged ? 'Sim (Nova)' : 'Não', 125, y + 3);
    doc.text((d.notes || '-').slice(0, 24), 155, y + 3);
    y += 5.5;
  });

  y += 6;

  // Section 2: Histórico de Sintomas e Efeitos Colaterais
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('2. MONITORAMENTO DE SINTOMAS & TOLERÂNCIA GASTROINTESTINAL', 14, y);
  y += 5;

  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(14, y, 182, 6, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DATA', 17, y + 4.2);
  doc.text('SINTOMA REGISTRADO', 45, y + 4.2);
  doc.text('INTENSIDADE', 105, y + 4.2);
  doc.text('HUMOR / BEM-ESTAR', 135, y + 4.2);
  doc.text('TEMPO PÓS-DOSE', 170, y + 4.2);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(40, 50, 65);
  symptoms.slice(-4).forEach((s, idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y - 1, 182, 5.5, 'F');
    }
    doc.text(s.date, 17, y + 3);
    doc.text(s.symptomName.slice(0, 28), 45, y + 3);
    doc.text(`${s.severity}/5 (${s.severity <= 2 ? 'Leve' : s.severity === 3 ? 'Moderado' : 'Acentuado'})`, 105, y + 3);
    doc.text(`Nota ${s.mood}/5  ·  Físico ${s.physicalWellbeing}/5`, 135, y + 3);
    doc.text(s.hoursAfterDose ? `${s.hoursAfterDose}h` : '-', 170, y + 3);
    y += 5.5;
  });

  y += 6;

  // Section 3: Resumo Clínico para o Médico (AI Powered)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('3. SÍNTESE CLÍNICA PARA DISCUSSÃO MÉDICA', 14, y);
  y += 5;

  doc.setDrawColor(220, 225, 235);
  doc.setFillColor(252, 253, 255);
  doc.roundedRect(14, y, 182, 38, 2, 2, 'FD');

  const summaryText =
    doctorSummaryAi ||
    'Paciente em acompanhamento regular sob regime semanal de GLP-1 com adesão de 100% às doses programadas. Perda ponderal gradual e sustentada com preservação do bem-estar. Eventos gastrointestinais esporádicos (leve náusea e lentificação de trânsito) responsivos a fracionamento de refeições e hidratação adequada acima de 2.5L/dia.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 60, 75);
  const splitText = doc.splitTextToSize(summaryText, 174);
  doc.text(splitText, 18, y + 6);

  // Recommendations for endocrinologist
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('Pontos sugeridos para avaliação:', 18, y + 25);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(70, 80, 95);
  doc.text('• Avaliação da necessidade de ajuste/titulação posológica para a próxima etapa.', 18, y + 30);
  doc.text('• Checagem laboratorial periódica (perfil glicídico, lipídico e função renal/hepática).', 18, y + 34);

  y += 44;

  // Signature Block
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 110, 125);
  doc.text('Assinatura / Carimbo do Médico Assistente: ____________________________________________________', 14, y + 6);
  doc.text('Este documento foi compilado pelo aplicativo GLP360 com base nos registros do paciente.', 14, y + 12);

  // Save PDF
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`GLP360_Relatorio_Medico_${user.name.replace(/\s+/g, '_')}_${dateStr}.pdf`);
}
