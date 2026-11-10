import React from 'react';
import {
  Syringe,
  Droplets,
  HeartPulse,
  Scale,
  Sparkles,
  ChevronRight,
  Plus,
  Flame,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import {
  UserProfile,
  DoseRecord,
  SymptomRecord,
  WeightRecord,
  HydrationDay,
  ActiveModule,
  NutritionPlan,
} from '../../types';

interface DashboardModuleProps {
  user: UserProfile;
  doses: DoseRecord[];
  weights: WeightRecord[];
  symptoms: SymptomRecord[];
  hydration: HydrationDay[];
  nutrition: NutritionPlan;
  onNavigate: (module: ActiveModule) => void;
  onQuickAddWater: (ml: number) => void;
  onOpenMedicationModal: () => void;
}

export const DashboardModule: React.FC<DashboardModuleProps> = ({
  user,
  doses,
  weights,
  symptoms,
  hydration,
  nutrition,
  onNavigate,
  onQuickAddWater,
  onOpenMedicationModal,
}) => {
  const lastDose = doses[doses.length - 1];
  const todayHydration = hydration[0] || {
    totalMl: 0,
    goalMl: user.dailyWaterGoalMl,
    entries: [],
  };
  const hydrationPercent = Math.min(
    100,
    Math.round((todayHydration.totalMl / user.dailyWaterGoalMl) * 100)
  );

  const totalLossKg = (user.initialWeightKg - user.currentWeightKg).toFixed(1);
  const remainingLossKg = (user.currentWeightKg - user.targetWeightKg).toFixed(1);
  const totalGoalDelta = user.initialWeightKg - user.targetWeightKg;
  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(((user.initialWeightKg - user.currentWeightKg) / totalGoalDelta) * 100)
    )
  );

  const recentSymptom = symptoms[symptoms.length - 1];

  // Dynamically calculate smooth sparkline path from weights
  const sparkline = React.useMemo(() => {
    const sorted = [...weights].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const vals =
      sorted.length > 0
        ? sorted.map((r) => r.weightKg)
        : [user.initialWeightKg, user.currentWeightKg];
    const min = Math.min(...vals) - 0.4;
    const max = Math.max(...vals) + 0.4;
    const range = max - min || 1;
    const width = 180;
    const height = 46;
    const padX = 6;
    const padY = 6;
    const chartW = width - padX * 2;
    const chartH = height - padY * 2;

    const pts = vals.map((v, i) => ({
      x: padX + (i / Math.max(1, vals.length - 1)) * chartW,
      y: padY + (1 - (v - min) / range) * chartH,
    }));

    let pathD = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const mx = (p0.x + p1.x) / 2;
      pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const lastPt = pts[pts.length - 1];
    const areaD = `${pathD} L ${lastPt.x} ${height} L ${pts[0].x} ${height} Z`;

    return { pathD, areaD, lastPt, pts, width, height };
  }, [weights, user.initialWeightKg, user.currentWeightKg]);

  return (
    <div className="space-y-4 pb-20">
      {/* Hero 360 Dose Card */}
      <div className="bg-gradient-to-br from-[#082B55] via-[#0b386e] to-[#082B55] rounded-3xl p-5 text-white shadow-xl shadow-[#082B55]/15 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#00C9D7]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-4 bottom-2 w-28 h-28 bg-[#35D68A]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold tracking-wider text-[#00C9D7] uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              Cronograma de Aplicação
            </span>
            <button
              onClick={onOpenMedicationModal}
              className="text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full text-slate-200 transition-colors"
            >
              Ajustar Dose
            </button>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">
                {user.medication.split('(')[0].trim()}
              </h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Dose Semanal: <span className="font-bold text-[#00C9D7]">{user.currentDose}</span>
              </p>
            </div>
            <div className="text-right">
              <span className="inline-block text-[10px] font-bold text-[#35D68A] bg-[#35D68A]/15 px-2 py-0.5 rounded-full">
                Em dia
              </span>
              <p className="text-xs font-semibold text-slate-300 mt-1">
                Próxima: Terça-feira
              </p>
            </div>
          </div>

          {/* Dose Info & Quick Register Action */}
          <div className="mt-4 pt-4 border-t border-white/15 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-200">
              <span className="text-slate-400 block text-[10px]">ÚLTIMA APLICAÇÃO</span>
              <span className="font-semibold text-white">
                {lastDose ? `${lastDose.date} (${lastDose.dosage})` : 'Nenhum registro'}
              </span>
            </div>

            <button
              onClick={() => onNavigate('doses')}
              className="px-4 py-2 bg-gradient-to-r from-[#00C9D7] to-[#35D68A] text-[#082B55] hover:opacity-95 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-[0.98]"
            >
              <Syringe className="w-3.5 h-3.5 stroke-[2.5]" />
              Registrar Dose
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Matrix (2 columns) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Hydration Widget */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#082B55]">
                <Droplets className="w-4 h-4 text-[#00C9D7]" />
                Hidratação
              </div>
              <span className="text-[11px] font-extrabold text-[#082B55] tabular-nums">
                {todayHydration.totalMl} / {user.dailyWaterGoalMl} ml
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#00C9D7] to-[#082B55] h-2 rounded-full transition-all duration-500"
                style={{ width: `${hydrationPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              {hydrationPercent >= 100
                ? 'Meta do dia atingida! Excelente para a digestão.'
                : 'Água constante evita constipação e náuseas.'}
            </p>
          </div>

          <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
            <button
              onClick={() => onQuickAddWater(250)}
              className="flex-1 py-1.5 bg-[#00C9D7]/10 hover:bg-[#00C9D7]/20 text-[#082B55] font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> 250ml
            </button>
            <button
              onClick={() => onQuickAddWater(500)}
              className="flex-1 py-1.5 bg-[#00C9D7]/10 hover:bg-[#00C9D7]/20 text-[#082B55] font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Plus className="w-3 h-3" /> 500ml
            </button>
          </div>
        </div>

        {/* Weight & Body Evolution Widget */}
        <div
          onClick={() => onNavigate('weight')}
          className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs cursor-pointer hover:border-[#00C9D7] hover:shadow-md transition-all flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#082B55]">
                <Scale className="w-4 h-4 text-[#35D68A]" />
                Evolução
              </div>
              <span className="text-[11px] font-black text-[#35D68A] bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100/80">
                -{totalLossKg} kg
              </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-[#082B55] tabular-nums tracking-tight">
                {user.currentWeightKg}
              </span>
              <span className="text-xs text-slate-500 font-semibold">kg</span>
            </div>

            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
              Faltam <strong className="text-slate-700">{remainingLossKg} kg</strong> para a meta ({progressPercent}%).
            </p>
          </div>

          {/* Full-width Responsive Sparkline Line Graph */}
          <div className="mt-2 pt-1.5 border-t border-slate-100">
            <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold mb-1">
              <span>Curva de perda</span>
              <span className="text-[#00C9D7] group-hover:translate-x-0.5 transition-transform flex items-center font-bold">
                Ver gráfico →
              </span>
            </div>

            <div className="w-full h-11 relative overflow-hidden rounded-lg bg-gradient-to-b from-slate-50/70 to-emerald-50/30 border border-slate-100">
              <svg
                viewBox={`0 0 ${sparkline.width} ${sparkline.height}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="dashSparkArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#35D68A" stopOpacity="0.35" />
                    <stop offset="75%" stopColor="#00C9D7" stopOpacity="0.10" />
                    <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="dashSparkLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#00C9D7" />
                    <stop offset="100%" stopColor="#35D68A" />
                  </linearGradient>
                </defs>

                {/* Shaded Area under the curve */}
                <path
                  d={sparkline.areaD}
                  fill="url(#dashSparkArea)"
                />

                {/* Smooth Bezier Line */}
                <path
                  d={sparkline.pathD}
                  fill="none"
                  stroke="url(#dashSparkLine)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Intermediate data points */}
                {sparkline.pts.map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.x}
                    cy={pt.y}
                    r={i === sparkline.pts.length - 1 ? 3 : 1.5}
                    fill={i === sparkline.pts.length - 1 ? '#082B55' : '#35D68A'}
                  />
                ))}

                {/* Glowing pulse ring on current weight point */}
                <circle
                  cx={sparkline.lastPt.x}
                  cy={sparkline.lastPt.y}
                  r="5.5"
                  fill="#35D68A"
                  fillOpacity="0.3"
                  className="animate-pulse"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* AI Nutrition Daily Spotlight */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#00C9D7]/15 text-[#082B55] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00C9D7]" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#082B55]">
                Suporte Nutricional Inteligente
              </h4>
              <span className="text-[10px] text-slate-500">
                Personalizado para o perfil de {user.medication.split(' ')[0]}
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('nutrition')}
            className="text-[11px] font-bold text-[#00C9D7] hover:underline flex items-center"
          >
            Ver Cardápio <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
          💡 <span className="font-semibold text-[#082B55]">Dica do dia:</span>{' '}
          {nutrition.clinicalTips[0] || 'Priorize proteínas no almoço para proteger sua massa magra.'}
        </p>

        <div className="flex items-center justify-between mt-3 text-[11px] text-slate-600 px-1">
          <span>Meta proteica: <strong className="text-[#082B55]">{nutrition.dailyTargetProteinGrams}g</strong></span>
          <span>Calorias alvo: <strong className="text-[#082B55]">{nutrition.dailyTargetCalories} kcal</strong></span>
          <span>Água: <strong className="text-[#082B55]">{(nutrition.dailyWaterTargetMl / 1000).toFixed(1)}L</strong></span>
        </div>
      </div>

      {/* Symptoms & Health Status */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#082B55]">
                Saúde & Bem-Estar Físico
              </h4>
              <span className="text-[10px] text-slate-500">
                Histórico de efeitos colaterais
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('health')}
            className="text-[11px] font-bold text-[#082B55] hover:text-[#00C9D7] flex items-center"
          >
            Registrar <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {recentSymptom ? (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#082B55]">
                {recentSymptom.symptomName}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {recentSymptom.date} · Gravidade {recentSymptom.severity}/5
              </p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {recentSymptom.severity <= 2 ? 'Leve' : 'Moderado'}
            </span>
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center text-xs text-emerald-800 font-medium">
            Nenhum desconforto registrado recentemente. Tudo ótimo!
          </div>
        )}
      </div>

      {/* Direct Report & Export Teaser */}
      <div className="bg-gradient-to-r from-slate-900 to-[#082B55] rounded-2xl p-4 text-white flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold tracking-wider text-[#35D68A] uppercase">
            Consulta Médica
          </span>
          <h4 className="text-sm font-bold text-white mt-0.5">
            Exportar Histórico Completo
          </h4>
          <p className="text-[11px] text-slate-300">
            Gere o relatório em PDF ou Excel para o seu endocrinologista.
          </p>
        </div>
        <button
          onClick={() => onNavigate('reports')}
          className="px-3.5 py-2 bg-white text-[#082B55] hover:bg-slate-100 font-bold text-xs rounded-xl shadow-sm transition-all shrink-0"
        >
          Exportar
        </button>
      </div>
    </div>
  );
};
