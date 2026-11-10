import React, { useState } from 'react';
import {
  Scale,
  Plus,
  TrendingDown,
  Trash2,
  Calendar,
  Activity,
  CheckCircle2,
  ChevronRight,
  Info,
} from 'lucide-react';
import { UserProfile, WeightRecord } from '../../types';

interface WeightModuleProps {
  user: UserProfile;
  weights: WeightRecord[];
  onAddWeight: (record: WeightRecord) => void;
  onDeleteWeight: (id: string) => void;
}

export const WeightModule: React.FC<WeightModuleProps> = ({
  user,
  weights,
  onAddWeight,
  onDeleteWeight,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const [hipCm, setHipCm] = useState('');
  const [abdominalCm, setAbdominalCm] = useState('');
  const [notes, setNotes] = useState('');

  // Selected node for interactive inspection
  const [selectedPointIndex, setSelectedPointIndex] = useState<number | null>(
    weights.length > 0 ? weights.length - 1 : null
  );

  const totalLossKg = (user.initialWeightKg - user.currentWeightKg).toFixed(1);
  const lossPercent = (
    ((user.initialWeightKg - user.currentWeightKg) / user.initialWeightKg) *
    100
  ).toFixed(1);

  const heightM = user.heightCm / 100;
  const bmi = (user.currentWeightKg / (heightM * heightM)).toFixed(1);
  const bmiNum = parseFloat(bmi);

  let bmiClassification = 'Peso Normal';
  let bmiColor = 'text-emerald-700 bg-emerald-50';
  if (bmiNum >= 30) {
    bmiClassification = 'Obesidade';
    bmiColor = 'text-amber-700 bg-amber-50';
  } else if (bmiNum >= 25) {
    bmiClassification = 'Sobrepeso';
    bmiColor = 'text-blue-700 bg-blue-50';
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weightKg);
    if (isNaN(parsedWeight) || parsedWeight <= 30) return;

    const newRecord: WeightRecord = {
      id: `weight_${Date.now()}`,
      date,
      weightKg: parsedWeight,
      waistCm: waistCm ? parseFloat(waistCm) : undefined,
      hipCm: hipCm ? parseFloat(hipCm) : undefined,
      abdominalCm: abdominalCm ? parseFloat(abdominalCm) : undefined,
      notes: notes.trim() || undefined,
    };

    onAddWeight(newRecord);
    setShowForm(false);
    setWeightKg('');
    setWaistCm('');
    setHipCm('');
    setAbdominalCm('');
    setNotes('');
  };

  // Sort weights chronologically for line chart
  const sortedWeights = [...weights].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // SVG Chart Geometry
  const svgWidth = 500;
  const svgHeight = 220;
  const padLeft = 45;
  const padRight = 35;
  const padTop = 30;
  const padBottom = 40;

  const chartW = svgWidth - padLeft - padRight;
  const chartH = svgHeight - padTop - padBottom;

  const weightVals = sortedWeights.map((w) => w.weightKg);
  const minW = Math.min(...weightVals, user.targetWeightKg) - 1.5;
  const maxW = Math.max(...weightVals, user.initialWeightKg) + 1.5;
  const valRange = maxW - minW || 1;

  const getX = (idx: number) => {
    if (sortedWeights.length <= 1) return padLeft + chartW / 2;
    return padLeft + (idx / (sortedWeights.length - 1)) * chartW;
  };

  const getY = (val: number) => {
    const ratio = (val - minW) / valRange;
    return padTop + (1 - ratio) * chartH;
  };

  const points = sortedWeights.map((w, idx) => ({
    x: getX(idx),
    y: getY(w.weightKg),
    record: w,
    index: idx,
  }));

  // Build SVG Path strings
  const linePathD = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaPathD =
    points.length > 0
      ? `${linePathD} L ${points[points.length - 1].x} ${
          padTop + chartH
        } L ${points[0].x} ${padTop + chartH} Z`
      : '';

  const targetLineY = getY(user.targetWeightKg);

  // Grid lines
  const gridSteps = 4;
  const gridLines = Array.from({ length: gridSteps + 1 }).map((_, i) => {
    const val = minW + (i / gridSteps) * valRange;
    return {
      val: Math.round(val * 10) / 10,
      y: getY(val),
    };
  });

  const activeRecord =
    selectedPointIndex !== null && sortedWeights[selectedPointIndex]
      ? sortedWeights[selectedPointIndex]
      : sortedWeights[sortedWeights.length - 1];

  const prevRecord =
    selectedPointIndex !== null && selectedPointIndex > 0
      ? sortedWeights[selectedPointIndex - 1]
      : null;

  return (
    <div className="space-y-4 pb-20">
      {/* Header Metric Summary */}
      <div className="bg-gradient-to-br from-[#082B55] to-[#0c396c] rounded-3xl p-6 text-white shadow-xl shadow-[#082B55]/15">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-[#35D68A]/20 text-[#35D68A] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white">
                Evolução Corporal
              </h2>
              <p className="text-xs text-slate-300">
                Histórico de pesagem e medidas corporais
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-3 py-1.5 bg-[#35D68A] text-[#082B55] hover:opacity-90 font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            Nova Pesagem
          </button>
        </div>

        {/* Big Numbers */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/15 text-center">
          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block uppercase font-bold">
              Peso Atual
            </span>
            <span className="text-2xl font-black text-white tabular-nums">
              {user.currentWeightKg} <span className="text-xs font-semibold">kg</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block uppercase font-bold">
              Eliminado
            </span>
            <span className="text-2xl font-black text-[#35D68A] tabular-nums">
              -{totalLossKg} <span className="text-xs font-semibold">kg</span>
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/10">
            <span className="text-[10px] text-slate-300 block uppercase font-bold">
              Evolução
            </span>
            <span className="text-2xl font-black text-[#00C9D7] tabular-nums">
              -{lossPercent}%
            </span>
          </div>
        </div>

        {/* Sub metrics */}
        <div className="mt-4 flex items-center justify-between text-xs text-slate-300 px-1">
          <span>Inicial: <strong className="text-white">{user.initialWeightKg} kg</strong></span>
          <span>Meta: <strong className="text-white">{user.targetWeightKg} kg</strong></span>
          <span className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${bmiColor}`}>
            IMC {bmi} ({bmiClassification})
          </span>
        </div>
      </div>

      {/* Interactive Line Chart */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-[#35D68A]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-[#082B55]">
                Gráfico de Linha de Evolução
              </h3>
              <p className="text-[10px] text-slate-500">
                Toque nos pontos da curva para inspecionar os detalhes
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#00C9D7] bg-[#00C9D7]/10 px-2.5 py-1 rounded-full">
            {sortedWeights.length} pesagens
          </span>
        </div>

        {/* SVG Line Chart Canvas */}
        <div className="w-full overflow-hidden pt-2">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            <defs>
              {/* Area gradient */}
              <linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00C9D7" stopOpacity="0.35" />
                <stop offset="85%" stopColor="#35D68A" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
              </linearGradient>

              {/* Stroke line gradient */}
              <linearGradient id="weightLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00C9D7" />
                <stop offset="100%" stopColor="#35D68A" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines and Y Labels */}
            {gridLines.map((gl, i) => (
              <g key={i}>
                <line
                  x1={padLeft}
                  y1={gl.y}
                  x2={svgWidth - padRight}
                  y2={gl.y}
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text
                  x={padLeft - 8}
                  y={gl.y + 3.5}
                  textAnchor="end"
                  fontSize="10"
                  fontWeight="600"
                  fill="#94A3B8"
                  className="font-mono"
                >
                  {gl.val}kg
                </text>
              </g>
            ))}

            {/* Target Goal Reference Line */}
            {user.targetWeightKg >= minW && user.targetWeightKg <= maxW && (
              <g>
                <line
                  x1={padLeft}
                  y1={targetLineY}
                  x2={svgWidth - padRight}
                  y2={targetLineY}
                  stroke="#35D68A"
                  strokeWidth="1.5"
                  strokeDasharray="6 3"
                />
                <text
                  x={svgWidth - padRight}
                  y={targetLineY - 5}
                  textAnchor="end"
                  fontSize="9.5"
                  fontWeight="700"
                  fill="#059669"
                >
                  Meta: {user.targetWeightKg}kg
                </text>
              </g>
            )}

            {/* Gradient Area Fill under the line */}
            {areaPathD && (
              <path
                d={areaPathD}
                fill="url(#weightAreaGrad)"
                className="transition-all duration-700"
              />
            )}

            {/* Evolution Line Path */}
            {linePathD && (
              <path
                d={linePathD}
                fill="none"
                stroke="url(#weightLineGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-700"
              />
            )}

            {/* Interactive Points / Nodes */}
            {points.map((pt) => {
              const isSelected = selectedPointIndex === pt.index;
              const isLatest = pt.index === sortedWeights.length - 1;

              return (
                <g
                  key={pt.record.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedPointIndex(pt.index)}
                >
                  {/* Invisible tap target expander */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="18"
                    fill="transparent"
                  />

                  {/* Outer pulse ring for selected node */}
                  {isSelected && (
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill="#00C9D7"
                      fillOpacity="0.25"
                      className="animate-ping"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isSelected ? 6 : 4.5}
                    fill="#FFFFFF"
                    stroke={isSelected ? '#082B55' : isLatest ? '#35D68A' : '#00C9D7'}
                    strokeWidth={isSelected ? '3.5' : '3'}
                    className="transition-all duration-200"
                  />

                  {/* Weight label above point */}
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    fontSize={isSelected ? '11' : '9.5'}
                    fontWeight={isSelected ? '800' : '700'}
                    fill={isSelected ? '#082B55' : '#475569'}
                    className="tabular-nums"
                  >
                    {pt.record.weightKg}
                  </text>

                  {/* X-axis date label below */}
                  <text
                    x={pt.x}
                    y={svgHeight - 14}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight={isSelected ? '700' : '500'}
                    fill={isSelected ? '#082B55' : '#94A3B8'}
                  >
                    {pt.record.date.slice(5)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Data Point Detail Box */}
        {activeRecord && (
          <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-3 animate-in fade-in">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500">
                  Pesagem selecionada:
                </span>
                <span className="text-xs font-extrabold text-[#082B55]">
                  {activeRecord.date}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-[#082B55] tabular-nums">
                  {activeRecord.weightKg} kg
                </span>
                {prevRecord && (
                  <span
                    className={`text-xs font-bold ${
                      activeRecord.weightKg <= prevRecord.weightKg
                        ? 'text-emerald-600'
                        : 'text-amber-600'
                    }`}
                  >
                    {activeRecord.weightKg <= prevRecord.weightKg ? '↓' : '↑'}{' '}
                    {Math.abs(
                      Math.round(
                        (activeRecord.weightKg - prevRecord.weightKg) * 10
                      ) / 10
                    )}{' '}
                    kg vs. anterior
                  </span>
                )}
              </div>

              {/* Measurements */}
              {(activeRecord.waistCm ||
                activeRecord.hipCm ||
                activeRecord.abdominalCm) && (
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 mt-2">
                  {activeRecord.waistCm && (
                    <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200">
                      Cintura: <strong>{activeRecord.waistCm}cm</strong>
                    </span>
                  )}
                  {activeRecord.hipCm && (
                    <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200">
                      Quadril: <strong>{activeRecord.hipCm}cm</strong>
                    </span>
                  )}
                  {activeRecord.abdominalCm && (
                    <span className="px-2 py-0.5 rounded-lg bg-white border border-slate-200">
                      Abdômen: <strong>{activeRecord.abdominalCm}cm</strong>
                    </span>
                  )}
                </div>
              )}

              {activeRecord.notes && (
                <p className="text-[11px] text-slate-500 italic mt-1.5">
                  "{activeRecord.notes}"
                </p>
              )}
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                Do Início
              </span>
              <span className="text-sm font-black text-emerald-600 tabular-nums">
                -{(user.initialWeightKg - activeRecord.weightKg).toFixed(1)} kg
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100">
          <span>Início: <strong>{user.initialWeightKg} kg</strong></span>
          <span>Ritmo saudável médio: <strong>~0.8 kg / semana</strong></span>
          <span>Meta: <strong className="text-emerald-600">{user.targetWeightKg} kg</strong></span>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-[#082B55]">
              Registrar Nova Pesagem
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-500"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  DATA DA PESAGEM
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  PESO EM JEJUM (KG)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="Ex: 82.8"
                  value={weightKg}
                  onChange={(e) => setWeightKg(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>
            </div>

            {/* Circumference measurements */}
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  CINTURA (CM)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Ex: 88"
                  value={waistCm}
                  onChange={(e) => setWaistCm(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  QUADRIL (CM)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Ex: 104"
                  value={hipCm}
                  onChange={(e) => setHipCm(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                  ABDÔMEN (CM)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Ex: 92"
                  value={abdominalCm}
                  onChange={(e) => setAbdominalCm(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                OBSERVAÇÕES
              </label>
              <input
                type="text"
                placeholder="Ex: Após treino leve, boa hidratação..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#082B55] hover:bg-[#082B55]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#082B55]/20 transition-all"
            >
              Salvar Registro de Peso
            </button>
          </form>
        </div>
      )}

      {/* History table */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-extrabold text-sm text-[#082B55] mb-3">
          Histórico de Pesagens
        </h3>

        <div className="space-y-2">
          {weights.slice().reverse().map((w) => (
            <div
              key={w.id}
              className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm text-[#082B55] tabular-nums">
                    {w.weightKg} kg
                  </span>
                  <span className="text-[10px] text-slate-400">{w.date}</span>
                </div>
                {(w.waistCm || w.hipCm || w.abdominalCm) && (
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Cintura: {w.waistCm ? `${w.waistCm}cm` : '-'} · Quadril: {w.hipCm ? `${w.hipCm}cm` : '-'} · Abdômen: {w.abdominalCm ? `${w.abdominalCm}cm` : '-'}
                  </p>
                )}
                {w.notes && (
                  <p className="text-[10px] text-slate-600 italic mt-0.5">
                    "{w.notes}"
                  </p>
                )}
              </div>

              <button
                onClick={() => onDeleteWeight(w.id)}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                title="Excluir pesagem"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
