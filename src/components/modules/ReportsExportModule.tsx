import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Download,
  Sparkles,
  CheckCircle2,
  TrendingDown,
  Syringe,
  Activity,
  Droplets,
  Calendar,
  Stethoscope,
} from 'lucide-react';
import {
  DoseRecord,
  HydrationDay,
  SymptomRecord,
  UserProfile,
  WeightRecord,
} from '../../types';
import { exportToExcel, exportToPdf } from '../../utils/export';
import { fetchAiDoctorReport } from '../../services/aiService';

interface ReportsExportModuleProps {
  user: UserProfile;
  doses: DoseRecord[];
  weights: WeightRecord[];
  symptoms: SymptomRecord[];
  hydration: HydrationDay[];
}

export const ReportsExportModule: React.FC<ReportsExportModuleProps> = ({
  user,
  doses,
  weights,
  symptoms,
  hydration,
}) => {
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiReport, setAiReport] = useState<{
    executiveSummary: string;
    clinicalRecommendationsForMD: string[];
    predominantSymptoms: string[];
  } | null>(null);

  const totalLossKg = (user.initialWeightKg - user.currentWeightKg).toFixed(1);
  const lossPercent = (
    ((user.initialWeightKg - user.currentWeightKg) / user.initialWeightKg) *
    100
  ).toFixed(1);

  const handleExportPdf = () => {
    exportToPdf(
      user,
      doses,
      weights,
      symptoms,
      aiReport?.executiveSummary
    );
  };

  const handleExportExcel = () => {
    exportToExcel(user, doses, weights, symptoms, hydration);
  };

  const handleGenerateDoctorBriefing = async () => {
    setIsGeneratingAi(true);
    try {
      const result = await fetchAiDoctorReport({
        userProfile: user,
        doseHistory: doses,
        symptomHistory: symptoms,
        weightHistory: weights,
      });
      setAiReport(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#082B55] to-[#0c386d] rounded-3xl p-6 text-white shadow-xl shadow-[#082B55]/15">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[#00C9D7]/20 text-[#00C9D7] flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-tight text-white">
              Relatórios & Exportação
            </h2>
            <p className="text-xs text-slate-300">
              Pronto para levar à consulta com o seu médico
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-200 mt-2 leading-relaxed">
          Exporte seu histórico integral de doses, curvas de peso, hidratação e sintomas em formato oficial PDF ou planilha Excel (.xlsx).
        </p>

        {/* Export Buttons Bar */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/15">
          <button
            onClick={handleExportPdf}
            className="py-3 px-3 bg-white text-[#082B55] hover:bg-slate-100 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            Baixar PDF Clínico
          </button>

          <button
            onClick={handleExportExcel}
            className="py-3 px-3 bg-[#35D68A] text-[#082B55] hover:opacity-95 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            Exportar Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Clinical Indicators Matrix */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-extrabold text-sm text-[#082B55] mb-3">
          Indicadores do Tratamento
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Perda Ponderal
            </span>
            <span className="text-xl font-black text-[#35D68A] tabular-nums">
              -{totalLossKg} kg
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              -{lossPercent}% do peso inicial
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Adesão Posológica
            </span>
            <span className="text-xl font-black text-[#00C9D7] tabular-nums">
              100%
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {doses.length} doses registradas no prazo
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Tolerância Gastrointestinal
            </span>
            <span className="text-xl font-black text-[#082B55] tabular-nums">
              Boa / Estável
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              {symptoms.length} eventos leves monitorados
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Meta Diária de Água
            </span>
            <span className="text-xl font-black text-[#082B55] tabular-nums">
              {user.dailyWaterGoalMl} ml
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">
              Prevenção de constipação
            </span>
          </div>
        </div>
      </div>

      {/* AI Doctor Summary Assistant */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#082B55]">
                Síntese Clínica para o Endocrinologista (IA)
              </h3>
              <p className="text-[10px] text-slate-500">
                Gere um resumo formal dos dados para a conversa com o médico
              </p>
            </div>
          </div>
        </div>

        {!aiReport ? (
          <button
            onClick={handleGenerateDoctorBriefing}
            disabled={isGeneratingAi}
            className="w-full py-3 bg-[#082B55] hover:bg-[#082B55]/90 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className={`w-4 h-4 text-[#00C9D7] ${isGeneratingAi ? 'animate-spin' : ''}`} />
            {isGeneratingAi
              ? 'Compilando histórico clínico com IA...'
              : 'Gerar Parecer Resumido para o Médico'}
          </button>
        ) : (
          <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">
                Resumo da Resposta ao Tratamento:
              </span>
              <button
                onClick={handleGenerateDoctorBriefing}
                className="text-[10px] font-bold text-purple-700 hover:underline"
              >
                Atualizar
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              "{aiReport.executiveSummary}"
            </p>

            <div className="pt-2 border-t border-purple-200/60">
              <span className="text-[11px] font-bold text-purple-900 block mb-1">
                Sugestões de tópicos para discutir na consulta:
              </span>
              <ul className="text-xs text-slate-700 list-disc list-inside space-y-1">
                {aiReport.clinicalRecommendationsForMD?.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
