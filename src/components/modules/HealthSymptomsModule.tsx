import React, { useState } from 'react';
import {
  HeartPulse,
  Plus,
  Smile,
  Frown,
  Meh,
  Activity,
  AlertTriangle,
  Sparkles,
  Trash2,
  HelpCircle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { SymptomRecord, SymptomType, UserProfile } from '../../types';
import { fetchAiSymptomAdvice } from '../../services/aiService';

interface HealthSymptomsModuleProps {
  user: UserProfile;
  symptoms: SymptomRecord[];
  onAddSymptom: (symptom: SymptomRecord) => void;
  onDeleteSymptom: (id: string) => void;
}

const SYMPTOM_OPTIONS: { id: SymptomType; label: string; icon: string }[] = [
  { id: 'nausea', label: 'Náusea / Enjoo', icon: '🤢' },
  { id: 'reflux', label: 'Refluxo / Azia', icon: '🔥' },
  { id: 'constipation', label: 'Constipação / Intestino Preso', icon: '🛑' },
  { id: 'early_satiety', label: 'Saciedade Excessiva / Estufamento', icon: '🫄' },
  { id: 'headache', label: 'Dor de Cabeça', icon: '🤕' },
  { id: 'fatigue', label: 'Fadiga / Cansaço', icon: '🥱' },
  { id: 'diarrhea', label: 'Diarreia / Trânsito Rápido', icon: '⚡' },
  { id: 'dizziness', label: 'Tontura / Fraqueza', icon: '💫' },
  { id: 'other', label: 'Outro Sintoma', icon: '📝' },
];

export const HealthSymptomsModule: React.FC<HealthSymptomsModuleProps> = ({
  user,
  symptoms,
  onAddSymptom,
  onDeleteSymptom,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [symptomType, setSymptomType] = useState<SymptomType>('nausea');
  const [customName, setCustomName] = useState('');
  const [severity, setSeverity] = useState(2);
  const [mood, setMood] = useState(3);
  const [physicalWellbeing, setPhysicalWellbeing] = useState(3);
  const [hoursAfterDose, setHoursAfterDose] = useState('24');
  const [notes, setNotes] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const moodEmojis = [
    { value: 1, emoji: '😞', label: 'Péssimo' },
    { value: 2, emoji: '😕', label: 'Desconfortável' },
    { value: 3, emoji: '😐', label: 'Neutro' },
    { value: 4, emoji: '🙂', label: 'Bom' },
    { value: 5, emoji: '🤩', label: 'Excelente' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAiLoading(true);

    const chosenOption = SYMPTOM_OPTIONS.find((s) => s.id === symptomType);
    const resolvedName =
      symptomType === 'other'
        ? customName.trim() || 'Outro sintoma'
        : chosenOption?.label || 'Sintoma';

    const hours = parseInt(hoursAfterDose, 10) || 24;

    // Fetch immediate AI guidance for the symptom
    let aiAdvice;
    try {
      aiAdvice = await fetchAiSymptomAdvice({
        symptomName: resolvedName,
        severity,
        hoursSinceDose: hours,
        medication: user.medication,
        currentDose: user.currentDose,
      });
    } catch {
      // Fallback
    }

    const newRecord: SymptomRecord = {
      id: `sym_${Date.now()}`,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      symptomType,
      symptomName: resolvedName,
      severity,
      mood,
      physicalWellbeing,
      hoursAfterDose: hours,
      notes: notes.trim() || undefined,
      aiAdvice,
    };

    onAddSymptom(newRecord);
    setIsAiLoading(false);
    setShowForm(false);
    setNotes('');
    setCustomName('');
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <HeartPulse className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#082B55]">
              Saúde & Bem-Estar
            </h2>
            <p className="text-xs text-slate-500">
              Monitore efeitos colaterais e humor diário
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-2 bg-[#082B55] hover:bg-[#082B55]/90 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          Registrar
        </button>
      </div>

      {/* Mood & Well-Being Quick Tracker */}
      <div className="bg-gradient-to-r from-blue-50/70 to-emerald-50/70 rounded-3xl p-5 border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-extrabold text-[#082B55] uppercase tracking-wider">
            Acompanhamento de Humor & Energia
          </span>
          <span className="text-[11px] text-slate-500">Hoje</span>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center">
          {moodEmojis.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={`p-2.5 rounded-2xl border transition-all flex flex-col items-center ${
                mood === m.value
                  ? 'bg-white border-[#00C9D7] shadow-md ring-2 ring-[#00C9D7]/20 scale-105'
                  : 'bg-white/60 border-slate-200/60 hover:bg-white'
              }`}
            >
              <span className="text-2xl">{m.emoji}</span>
              <span className="text-[10px] font-bold text-slate-700 mt-1">
                {m.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Form to log symptom */}
      {showForm && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-lg animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-[#082B55] flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-500" />
              Novo Registro de Sintoma / Efeito
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Fechar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Symptom Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-2">
                SELECIONE O QUE ESTÁ SENTINDO
              </label>
              <div className="grid grid-cols-2 gap-2">
                {SYMPTOM_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSymptomType(opt.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all flex items-center gap-2 ${
                      symptomType === opt.id
                        ? 'bg-[#082B55] text-white border-[#082B55] shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt.icon}</span>
                    <span className="truncate">{opt.label}</span>
                  </button>
                ))}
              </div>

              {symptomType === 'other' && (
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    placeholder="Especifique o sintoma..."
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                  />
                </div>
              )}
            </div>

            {/* Severity scale 1 to 5 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-slate-600">
                  INTENSIDADE DO SINTOMA
                </label>
                <span className="text-xs font-extrabold text-[#082B55]">
                  {severity}/5 ({severity === 1 ? 'Mínimo' : severity === 2 ? 'Leve' : severity === 3 ? 'Moderado' : severity === 4 ? 'Forte' : 'Severo'})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={severity}
                onChange={(e) => setSeverity(parseInt(e.target.value, 10))}
                className="w-full accent-[#082B55] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-1">
                <span>1 - Mínimo</span>
                <span>3 - Moderado</span>
                <span>5 - Intenso</span>
              </div>
            </div>

            {/* Hours after dose */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                TEMPO APROXIMADO APÓS A ÚLTIMA INJEÇÃO
              </label>
              <select
                value={hoursAfterDose}
                onChange={(e) => setHoursAfterDose(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              >
                <option value="6">Menos de 12 horas</option>
                <option value="24">24 horas (Dia D+1)</option>
                <option value="48">48 horas (Dia D+2)</option>
                <option value="72">3 a 4 dias após a dose</option>
                <option value="120">Fim da semana de aplicação</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                COMENTÁRIOS / O QUE VOCÊ COMEU ANTES
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Começou cerca de 1 hora após comer feijoada..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>

            <button
              type="submit"
              disabled={isAiLoading}
              className="w-full py-3 bg-[#082B55] hover:bg-[#082B55]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#082B55]/20 transition-all flex items-center justify-center gap-2"
            >
              {isAiLoading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-[#00C9D7]" />
                  Consultando Suporte Clínico IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#00C9D7]" />
                  Salvar e Obter Recomendações de Alívio
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Red Flag Warning */}
      <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-2.5">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <strong className="block font-bold">Sinais de Alerta Médico:</strong>
          Se você sentir dor abdominal intensa e contínua irradiando para as costas, vômitos incontroláveis que impeçam a hidratação por mais de 12h ou icterícia (olhos amarelos), procure atendimento médico imediato.
        </div>
      </div>

      {/* Symptom History List with AI Advice Box */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-extrabold text-sm text-[#082B55] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#082B55]" />
          Histórico de Sintomas ({symptoms.length})
        </h3>

        {symptoms.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Nenhum sintoma relatado. Continue mantendo bons hábitos!
          </p>
        ) : (
          <div className="space-y-3">
            {symptoms.slice().reverse().map((record) => (
              <div
                key={record.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#082B55]">
                        {record.symptomName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          record.severity <= 2
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.severity === 3
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        Gravidade {record.severity}/5
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {record.date} às {record.time} {record.hoursAfterDose ? `· ${record.hoursAfterDose}h pós-dose` : ''}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteSymptom(record.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {record.notes && (
                  <p className="text-xs text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-100">
                    "{record.notes}"
                  </p>
                )}

                {/* AI Advice Box */}
                {record.aiAdvice && (
                  <div className="p-3 bg-[#082B55]/5 border border-[#00C9D7]/30 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#082B55]">
                      <Sparkles className="w-3.5 h-3.5 text-[#00C9D7]" />
                      Orientação Clínica IA:
                    </div>
                    <ul className="text-xs text-slate-700 list-disc list-inside space-y-0.5">
                      {record.aiAdvice.immediateRelief.map((relief, idx) => (
                        <li key={idx}>{relief}</li>
                      ))}
                    </ul>
                    {record.aiAdvice.doctorQuestion && (
                      <p className="text-[11px] font-medium text-slate-600 pt-1 border-t border-slate-200/50">
                        💬 <strong className="text-[#082B55]">Para o médico:</strong> {record.aiAdvice.doctorQuestion}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
