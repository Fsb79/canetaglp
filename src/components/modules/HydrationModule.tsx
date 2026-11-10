import React, { useState } from 'react';
import {
  Droplets,
  Plus,
  Trash2,
  Sparkles,
  Info,
  CheckCircle2,
  GlassWater,
  CupSoda,
} from 'lucide-react';
import { HydrationDay, HydrationEntry, UserProfile } from '../../types';

interface HydrationModuleProps {
  user: UserProfile;
  hydration: HydrationDay[];
  onAddWater: (entry: { amountMl: number; type: 'water' | 'electrolyte' | 'tea' }) => void;
  onDeleteEntry: (date: string, entryId: string) => void;
  onUpdateGoal: (newGoalMl: number) => void;
}

export const HydrationModule: React.FC<HydrationModuleProps> = ({
  user,
  hydration,
  onAddWater,
  onDeleteEntry,
  onUpdateGoal,
}) => {
  const [customMl, setCustomMl] = useState('');
  const [selectedType, setSelectedType] = useState<'water' | 'electrolyte' | 'tea'>('water');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(user.dailyWaterGoalMl));

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayRecord = hydration.find((h) => h.date === todayStr) || {
    date: todayStr,
    totalMl: 0,
    goalMl: user.dailyWaterGoalMl,
    entries: [],
  };

  const percent = Math.min(
    100,
    Math.round((todayRecord.totalMl / todayRecord.goalMl) * 100)
  );

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const ml = parseInt(customMl, 10);
    if (isNaN(ml) || ml <= 0) return;
    onAddWater({ amountMl: ml, type: selectedType });
    setCustomMl('');
  };

  const handleSaveGoal = () => {
    const g = parseInt(goalInput, 10);
    if (!isNaN(g) && g >= 1000) {
      onUpdateGoal(g);
      setIsEditingGoal(false);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Hydration Main Card */}
      <div className="bg-gradient-to-br from-[#082B55] to-[#0d3b6f] rounded-3xl p-6 text-white shadow-xl shadow-[#082B55]/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-36 bg-gradient-to-l from-[#00C9D7]/20 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#00C9D7]/20 text-[#00C9D7] flex items-center justify-center">
              <Droplets className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">
                Controle de Hidratação
              </h2>
              <p className="text-xs text-slate-300">
                Fundamental no tratamento com GLP-1
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingGoal(!isEditingGoal)}
            className="text-[11px] font-semibold text-[#00C9D7] bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full transition-colors"
          >
            {isEditingGoal ? 'Fechar' : 'Ajustar Meta'}
          </button>
        </div>

        {/* Goal Edit inline */}
        {isEditingGoal && (
          <div className="mb-4 p-3 bg-white/10 rounded-2xl border border-white/15 flex items-center gap-2">
            <input
              type="number"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="Meta em ml (ex: 2800)"
              className="flex-1 px-3 py-1.5 bg-white text-slate-800 rounded-xl text-xs font-bold focus:outline-none"
            />
            <button
              onClick={handleSaveGoal}
              className="px-3 py-1.5 bg-[#00C9D7] text-[#082B55] rounded-xl text-xs font-bold"
            >
              Salvar
            </button>
          </div>
        )}

        {/* Big Volume Indicator */}
        <div className="text-center py-4 relative z-10">
          <div className="inline-flex items-baseline gap-1">
            <span className="text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tight">
              {todayRecord.totalMl}
            </span>
            <span className="text-base font-bold text-slate-300">
              / {todayRecord.goalMl} ml
            </span>
          </div>

          <div className="w-full bg-white/15 rounded-full h-3 mt-4 overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-[#00C9D7] to-[#35D68A] h-full rounded-full transition-all duration-700"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mt-2 px-1">
            <span>{percent}% da meta alcançada</span>
            <span>
              Faltam{' '}
              <strong className="text-white">
                {Math.max(0, todayRecord.goalMl - todayRecord.totalMl)} ml
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Quick Tap Buttons */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <label className="block text-xs font-extrabold text-[#082B55] mb-3 uppercase tracking-wider">
          Registro Rápido de Água
        </label>

        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={() => onAddWater({ amountMl: 200, type: 'water' })}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-[#00C9D7]/10 hover:border-[#00C9D7] border border-slate-200 text-center transition-all flex flex-col items-center justify-center active:scale-[0.98]"
          >
            <GlassWater className="w-5 h-5 text-[#00C9D7] mb-1" />
            <span className="text-xs font-extrabold text-[#082B55]">+200 ml</span>
            <span className="text-[10px] text-slate-400">Copo</span>
          </button>

          <button
            onClick={() => onAddWater({ amountMl: 300, type: 'water' })}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-[#00C9D7]/10 hover:border-[#00C9D7] border border-slate-200 text-center transition-all flex flex-col items-center justify-center active:scale-[0.98]"
          >
            <GlassWater className="w-5 h-5 text-[#00C9D7] mb-1" />
            <span className="text-xs font-extrabold text-[#082B55]">+300 ml</span>
            <span className="text-[10px] text-slate-400">Caneca</span>
          </button>

          <button
            onClick={() => onAddWater({ amountMl: 500, type: 'water' })}
            className="p-3 rounded-2xl bg-slate-50 hover:bg-[#00C9D7]/10 hover:border-[#00C9D7] border border-slate-200 text-center transition-all flex flex-col items-center justify-center active:scale-[0.98]"
          >
            <Droplets className="w-5 h-5 text-[#082B55] mb-1" />
            <span className="text-xs font-extrabold text-[#082B55]">+500 ml</span>
            <span className="text-[10px] text-slate-400">Garrafa</span>
          </button>

          <button
            onClick={() => onAddWater({ amountMl: 350, type: 'electrolyte' })}
            className="p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200 text-center transition-all flex flex-col items-center justify-center active:scale-[0.98]"
          >
            <CupSoda className="w-5 h-5 text-emerald-600 mb-1" />
            <span className="text-xs font-extrabold text-emerald-800">+350 ml</span>
            <span className="text-[10px] text-emerald-600">Eletrólitos</span>
          </button>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomAdd} className="mt-3.5 flex items-center gap-2">
          <input
            type="number"
            placeholder="Outro volume em ml (ex: 450)"
            value={customMl}
            onChange={(e) => setCustomMl(e.target.value)}
            className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00C9D7]"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#082B55] text-white rounded-xl text-xs font-bold hover:bg-[#082B55]/90 transition-all flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </button>
        </form>
      </div>

      {/* Clinical Tip Banner */}
      <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-start gap-3">
        <Info className="w-5 h-5 text-[#082B55] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-[#082B55] block mb-0.5">
            Por que a hidratação é crucial no GLP-1?
          </strong>
          Os agonistas de GLP-1 retardam o esvaziamento gástrico e diminuem o reflexo natural de sede. Beber pelo menos 2.5L a 3L de água ao longo do dia previne constipação severa, reduz náuseas e protege a função renal durante o emagrecimento rápido.
        </div>
      </div>

      {/* Today's Log entries */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-extrabold text-sm text-[#082B55] mb-3">
          Ingestas de Hoje ({todayRecord.entries.length})
        </h3>

        {todayRecord.entries.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Nenhum copo de água registrado hoje ainda. Comece agora!
          </p>
        ) : (
          <div className="space-y-2">
            {todayRecord.entries.slice().reverse().map((entry) => (
              <div
                key={entry.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#082B55] flex items-center justify-center font-bold text-xs">
                    💧
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#082B55]">
                      +{entry.amountMl} ml
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {entry.timestamp} · {entry.type === 'electrolyte' ? 'Eletrólitos' : entry.type === 'tea' ? 'Chá' : 'Água Pura'}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onDeleteEntry(todayStr, entry.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
