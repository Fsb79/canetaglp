import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  Utensils,
  ShieldAlert,
  Flame,
  CheckCircle2,
  Clock,
  Droplets,
  Search,
} from 'lucide-react';
import { NutritionPlan, SymptomRecord, UserProfile } from '../../types';
import { fetchAiNutritionPlan } from '../../services/aiService';

interface NutritionAiModuleProps {
  user: UserProfile;
  nutrition: NutritionPlan;
  symptoms: SymptomRecord[];
  onUpdateNutrition: (plan: NutritionPlan) => void;
}

export const NutritionAiModule: React.FC<NutritionAiModuleProps> = ({
  user,
  nutrition,
  symptoms,
  onUpdateNutrition,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [appetite, setAppetite] = useState('Moderado');
  const [searchFood, setSearchFood] = useState('');
  const [foodVerdict, setFoodVerdict] = useState<{
    food: string;
    status: 'good' | 'caution' | 'avoid';
    text: string;
  } | null>(null);

  const handleGenerateNewPlan = async () => {
    setIsLoading(true);
    const recentSymptomNames = symptoms
      .slice(-3)
      .map((s) => `${s.symptomName} (gravidade ${s.severity}/5)`);

    try {
      const plan = await fetchAiNutritionPlan({
        medication: user.medication,
        dosage: user.currentDose,
        weight: user.currentWeightKg,
        targetWeight: user.targetWeightKg,
        symptoms: recentSymptomNames,
        appetite,
        waterIntake: user.dailyWaterGoalMl,
      });
      onUpdateNutrition(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchFood.trim()) return;

    const query = searchFood.toLowerCase();
    if (
      query.includes('frit') ||
      query.includes('pastel') ||
      query.includes('bacon') ||
      query.includes('feijoada') ||
      query.includes('refrigerante') ||
      query.includes('pizza') ||
      query.includes('costela')
    ) {
      setFoodVerdict({
        food: searchFood,
        status: 'avoid',
        text: 'Alimentos com alto teor de gorduras e frituras retardam ainda mais o esvaziamento do estômago sob efeito de GLP-1, podendo deflagrar náusea intensa, azia e refluxo. Prefira versões assadas ou cozidas.',
      });
    } else if (
      query.includes('frango') ||
      query.includes('ovo') ||
      query.includes('peixe') ||
      query.includes('iogurte') ||
      query.includes('whey') ||
      query.includes('cottage') ||
      query.includes('chia')
    ) {
      setFoodVerdict({
        food: searchFood,
        status: 'good',
        text: 'Excelente escolha! Proteína magra de alto valor biológico é o pilar número 1 no tratamento com GLP-1 para preservar a massa magra e manter o metabolismo ativo.',
      });
    } else {
      setFoodVerdict({
        food: searchFood,
        status: 'caution',
        text: 'Pode ser consumido em porção moderada. Mastigue bastante e certifique-se de parar ao primeiro sinal de saciedade.',
      });
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#082B55] to-[#0c3767] rounded-3xl p-6 text-white shadow-xl shadow-[#082B55]/15 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#00C9D7]/20 text-[#00C9D7] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00C9D7]" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">
                Nutrição Personalizada com IA
              </h2>
              <p className="text-xs text-slate-300">
                Adaptada para {user.medication.split(' ')[0]} ({user.currentDose})
              </p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed bg-white/10 p-3.5 rounded-2xl border border-white/10 mt-2">
          {nutrition.focusSummary}
        </p>

        {/* Nutritional Targets Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block uppercase font-bold">
              Meta Proteica
            </span>
            <span className="text-lg font-black text-[#35D68A] tabular-nums">
              {nutrition.dailyTargetProteinGrams} g
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block uppercase font-bold">
              Calorias Alvo
            </span>
            <span className="text-lg font-black text-[#00C9D7] tabular-nums">
              {nutrition.dailyTargetCalories} kcal
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block uppercase font-bold">
              Água Diária
            </span>
            <span className="text-lg font-black text-white tabular-nums">
              {(nutrition.dailyWaterTargetMl / 1000).toFixed(1)} L
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex items-center gap-2">
          <button
            onClick={handleGenerateNewPlan}
            disabled={isLoading}
            className="flex-1 py-3 bg-gradient-to-r from-[#00C9D7] to-[#35D68A] hover:opacity-95 text-[#082B55] font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading
              ? 'Analisando perfil clínico com IA...'
              : 'Gerar Novo Cardápio Diário com IA'}
          </button>
        </div>
      </div>

      {/* Quick Meal Checker Tool */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-extrabold text-sm text-[#082B55] mb-2 flex items-center gap-2">
          <Utensils className="w-4 h-4 text-[#00C9D7]" />
          Verificador de Alimentos para GLP-1
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          Tem dúvida se um alimento pode causar enjoo ou desconforto? Digite abaixo:
        </p>

        <form onSubmit={handleCheckFood} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Ex: Pastel frito, Omelete, Feijoada, Morango..."
              value={searchFood}
              onChange={(e) => setSearchFood(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00C9D7]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#082B55] text-white rounded-xl text-xs font-bold hover:bg-[#082B55]/90 transition-all shrink-0"
          >
            Verificar
          </button>
        </form>

        {foodVerdict && (
          <div
            className={`mt-3 p-3.5 rounded-2xl border text-xs leading-relaxed ${
              foodVerdict.status === 'good'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : foodVerdict.status === 'avoid'
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              {foodVerdict.status === 'good'
                ? '✅ Liberado e Recomendado'
                : foodVerdict.status === 'avoid'
                ? '⚠️ Evitar ou Muito Cuidado'
                : '🟡 Consumir com Moderação'}
              : "{foodVerdict.food}"
            </div>
            {foodVerdict.text}
          </div>
        )}
      </div>

      {/* Suggested Meals List */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-[#082B55] px-1 flex items-center justify-between">
          <span>Refeições Sugeridas para Hoje ({nutrition.meals.length})</span>
          <span className="text-[11px] font-semibold text-slate-500">
            Foco: Proteína & Fácil Digestão
          </span>
        </h3>

        {nutrition.meals.map((meal, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#082B55] text-white text-[10px] font-extrabold tabular-nums">
                  {meal.time}
                </span>
                <h4 className="text-sm font-extrabold text-[#082B55]">
                  {meal.name}
                </h4>
              </div>

              <span className="text-xs font-bold text-[#35D68A] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                +{meal.proteinGrams}g proteína
              </span>
            </div>

            <ul className="space-y-1 pl-2">
              {meal.items.map((item, itemIdx) => (
                <li
                  key={itemIdx}
                  className="text-xs text-slate-700 flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C9D7]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {meal.tip && (
              <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-start gap-1.5">
                💡 <span className="italic">{meal.tip}</span>
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Foods to Avoid Today */}
      {nutrition.foodsToAvoidToday?.length > 0 && (
        <div className="bg-rose-50/70 border border-rose-100 rounded-3xl p-5">
          <h4 className="text-xs font-extrabold text-rose-900 mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            Alimentos a Evitar no Tratamento com GLP-1
          </h4>
          <ul className="text-xs text-rose-800 space-y-1 pl-2">
            {nutrition.foodsToAvoidToday.map((food, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                <span>{food}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Clinical rules box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
        <h4 className="text-xs font-extrabold text-[#082B55]">
          Regras de Ouro da Nutrição no GLP-1
        </h4>
        <div className="space-y-2 text-xs text-slate-600">
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <strong>1. Proteína em primeiro lugar:</strong> Coma o peito de frango, peixe ou ovos antes do arroz ou batata.
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <strong>2. Líquidos separados dos sólidos:</strong> Nunca tome copos de suco ou água durante as refeições principais.
          </div>
          <div className="p-2.5 bg-slate-50 rounded-xl">
            <strong>3. Não espere a fome voraz:</strong> Como o GLP-1 anula a fome física, planeje horários para garantir calorias e nutrientes suficientes.
          </div>
        </div>
      </div>
    </div>
  );
};
