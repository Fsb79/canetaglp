import React, { useState } from 'react';
import {
  Syringe,
  Plus,
  Clock,
  RotateCcw,
  Check,
  Trash2,
  AlertCircle,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import { DoseRecord, InjectionSite, UserProfile } from '../../types';
import { BodyMap } from '../BodyMap';

interface DosesModuleProps {
  user: UserProfile;
  doses: DoseRecord[];
  onAddDose: (dose: DoseRecord) => void;
  onDeleteDose: (id: string) => void;
  onOpenMedicationModal: () => void;
}

export const DosesModule: React.FC<DosesModuleProps> = ({
  user,
  doses,
  onAddDose,
  onDeleteDose,
  onOpenMedicationModal,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  );
  const [dosage, setDosage] = useState(user.currentDose || '0.5mg');
  const [injectionSite, setInjectionSite] = useState<InjectionSite>('abdomen_right');
  const [needleChanged, setNeedleChanged] = useState(true);
  const [painLevel, setPainLevel] = useState(1);
  const [notes, setNotes] = useState('');

  const lastDose = doses[doses.length - 1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: DoseRecord = {
      id: `dose_${Date.now()}`,
      date,
      time,
      medication: user.medication,
      dosage,
      injectionSite,
      needleChanged,
      painLevel,
      notes: notes.trim() || undefined,
    };
    onAddDose(newRecord);
    setShowForm(false);
    setNotes('');
  };

  const getSiteName = (site: InjectionSite) => {
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
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header Info */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#082B55] text-[#00C9D7] flex items-center justify-center shadow-sm">
              <Syringe className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-[#082B55]">
                Controle das Doses
              </h2>
              <p className="text-xs text-slate-500">
                {user.medication.split('(')[0].trim()} · {user.currentDose}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenMedicationModal}
            className="text-xs font-semibold text-[#00C9D7] hover:underline"
          >
            Alterar
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 text-center">
          <div className="p-2 rounded-xl bg-slate-50">
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Total Doses
            </span>
            <span className="text-lg font-black text-[#082B55] tabular-nums">
              {doses.length}
            </span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50">
            <span className="text-[10px] font-bold text-emerald-600 block uppercase">
              Adesão
            </span>
            <span className="text-lg font-black text-emerald-700 tabular-nums">
              100%
            </span>
          </div>
          <div className="p-2 rounded-xl bg-blue-50">
            <span className="text-[10px] font-bold text-[#082B55] block uppercase">
              Regime
            </span>
            <span className="text-xs font-extrabold text-[#082B55] block mt-1">
              Semanal
            </span>
          </div>
        </div>
      </div>

      {/* Button to open form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3.5 bg-[#082B55] hover:bg-[#082B55]/95 text-white font-bold text-sm rounded-2xl shadow-md shadow-[#082B55]/15 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Registrar Nova Aplicação
        </button>
      ) : (
        /* Form */
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-sm text-[#082B55] flex items-center gap-2">
              <Syringe className="w-4 h-4 text-[#00C9D7]" />
              Nova Aplicação de {user.medication.split(' ')[0]}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancelar
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  DATA DA DOSE
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
                  HORÁRIO
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>
            </div>

            {/* Dose value */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                QUANTIDADE / DOSE (MG OU CLIQUES)
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 0.5mg, 1.0mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>

            {/* Injection Site Map */}
            <div>
              <BodyMap
                selectedSite={injectionSite}
                onSelectSite={(s) => setInjectionSite(s)}
                lastUsedSite={lastDose?.injectionSite}
              />
            </div>

            {/* Safety: Needle Changed */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Agulha Nova Esterilizada
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Nunca reutilize agulhas para evitar contaminação e dor
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={needleChanged}
                onChange={(e) => setNeedleChanged(e.target.checked)}
                className="w-5 h-5 accent-[#082B55] rounded cursor-pointer"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                OBSERVAÇÕES (OPCIONAL)
              </label>
              <textarea
                rows={2}
                placeholder="Ex: Aplicação indolor, leve vermelhidão rápida..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#082B55] hover:bg-[#082B55]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#082B55]/20 transition-all"
            >
              Confirmar e Salvar Aplicação
            </button>
          </form>
        </div>
      )}

      {/* History of Doses */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-extrabold text-sm text-[#082B55] mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#082B55]" />
          Histórico de Injeções ({doses.length})
        </h3>

        {doses.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            Nenhuma dose registrada ainda.
          </p>
        ) : (
          <div className="space-y-2.5">
            {doses.slice().reverse().map((dose) => (
              <div
                key={dose.id}
                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/70 transition-all flex items-start justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#082B55]/10 text-[#082B55] flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    {dose.dosage}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-[#082B55]">
                        {dose.date}
                      </span>
                      <span className="text-[10px] text-slate-400">às {dose.time}</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 font-medium">
                      Sítio: <span className="font-bold text-slate-800">{getSiteName(dose.injectionSite)}</span>
                    </div>
                    {dose.notes && (
                      <p className="text-[11px] text-slate-500 mt-1 italic">
                        "{dose.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDeleteDose(dose.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Excluir registro"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
