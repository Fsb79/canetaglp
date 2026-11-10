import React, { useState } from 'react';
import {
  Target,
  Trophy,
  Award,
  Plus,
  CheckCircle2,
  Flame,
  Scale,
  Droplets,
  Syringe,
  Dumbbell,
} from 'lucide-react';
import { GoalItem, UserProfile } from '../../types';

interface GoalsModuleProps {
  user: UserProfile;
  goals: GoalItem[];
  onAddGoal: (goal: GoalItem) => void;
  onUpdateGoalProgress: (id: string, delta: number) => void;
}

export const GoalsModule: React.FC<GoalsModuleProps> = ({
  user,
  goals,
  onAddGoal,
  onUpdateGoalProgress,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');

  const badges = [
    {
      id: 'b1',
      title: 'Determinação 360',
      desc: 'Primeiras doses de GLP-1 registradas pontualmente',
      unlocked: true,
      icon: '💉',
    },
    {
      id: 'b2',
      title: 'Guardião Muscular',
      desc: 'Consumo de mais de 80g de proteína por dia',
      unlocked: true,
      icon: '🥩',
    },
    {
      id: 'b3',
      title: 'Hidratação de Ouro',
      desc: 'Mais de 2.5L de água por dia para prevenir enjoo',
      unlocked: true,
      icon: '💧',
    },
    {
      id: 'b4',
      title: '5kg Eliminados',
      desc: 'Primeiro grande marco de peso saudável alcançado',
      unlocked: true,
      icon: '🏆',
    },
    {
      id: 'b5',
      title: 'Mestre da Rotação',
      desc: 'Alternou perfeitamente os 6 sítios de injeção',
      unlocked: false,
      icon: '🔄',
    },
    {
      id: 'b6',
      title: 'Meta Final Conquistada',
      desc: 'Chegou ao peso alvo prescrito pelo médico',
      unlocked: false,
      icon: '🎯',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetValue);
    if (!title.trim() || isNaN(val) || val <= 0) return;

    const newGoal: GoalItem = {
      id: `goal_${Date.now()}`,
      title: title.trim(),
      currentValue: 0,
      targetValue: val,
      unit: unit.trim() || 'unid',
      category: 'habits',
      description: description.trim() || 'Meta personalizada',
    };

    onAddGoal(newGoal);
    setShowForm(false);
    setTitle('');
    setTargetValue('');
    setUnit('');
    setDescription('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#082B55] to-[#0c386d] rounded-3xl p-6 text-white shadow-xl shadow-[#082B55]/15">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#00C9D7]/20 text-[#00C9D7] flex items-center justify-center">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">
                Metas & Conquistas
              </h2>
              <p className="text-xs text-slate-300">
                Acompanhamento dos objetivos do tratamento
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 bg-[#00C9D7] text-[#082B55] hover:opacity-90 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Nova Meta
          </button>
        </div>

        <p className="text-xs text-slate-200 mt-2 leading-relaxed">
          O emagrecimento com agonistas de GLP-1 é mais eficiente e duradouro quando acompanhado de metas comportamentais: hidratação, ingestão proteica e adesão sem falhas.
        </p>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-[#082B55]">
              Criar Nova Meta
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-500"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                TÍTULO DO OBJETIVO
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Treinos de musculação na semana"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  VALOR ALVO
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Ex: 4"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  UNIDADE
                </label>
                <input
                  type="text"
                  placeholder="Ex: dias, gramas, km..."
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                DESCRIÇÃO / POR QUE É IMPORTANTE
              </label>
              <input
                type="text"
                placeholder="Ex: Preservar tônus muscular e força"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#082B55] hover:bg-[#082B55]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#082B55]/20 transition-all"
            >
              Criar Objetivo
            </button>
          </form>
        </div>
      )}

      {/* Goals Progress List */}
      <div className="space-y-3">
        <h3 className="font-extrabold text-sm text-[#082B55] px-1">
          Seus Objetivos Ativos ({goals.length})
        </h3>

        {goals.map((g) => {
          const percent = Math.min(
            100,
            Math.round((g.currentValue / g.targetValue) * 100)
          );

          return (
            <div
              key={g.id}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#082B55]">
                    {g.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {g.description}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-[#082B55] tabular-nums">
                    {g.currentValue} / {g.targetValue} {g.unit}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {percent}% alcançado
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#00C9D7] to-[#35D68A] h-2.5 rounded-full transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase">
                  Progresso diário
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onUpdateGoalProgress(g.id, -1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onUpdateGoalProgress(g.id, 1)}
                    className="w-6 h-6 rounded-lg bg-[#082B55] text-white hover:bg-[#082B55]/90 font-bold text-xs flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-extrabold text-sm text-[#082B55] mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          Conquistas Desbloqueadas ({badges.filter((b) => b.unlocked).length}/{badges.length})
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-2xl border transition-all flex items-start gap-2.5 ${
                b.unlocked
                  ? 'bg-amber-50/40 border-amber-200 text-slate-800'
                  : 'bg-slate-50 border-slate-200/70 text-slate-400 opacity-60'
              }`}
            >
              <span className="text-2xl shrink-0 mt-0.5">{b.icon}</span>
              <div>
                <span className="text-xs font-bold block leading-tight text-slate-900">
                  {b.title}
                </span>
                <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                  {b.desc}
                </p>
                {b.unlocked && (
                  <span className="inline-block text-[9px] font-extrabold text-amber-700 mt-1">
                    ✓ Conquistado
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
