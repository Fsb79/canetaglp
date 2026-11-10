import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  Clock,
  Trash2,
  Syringe,
  Scale,
  Stethoscope,
  Pill,
} from 'lucide-react';
import { CalendarEvent, UserProfile } from '../../types';

interface CalendarModuleProps {
  user: UserProfile;
  events: CalendarEvent[];
  onAddEvent: (event: CalendarEvent) => void;
  onToggleEvent: (id: string) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarModule: React.FC<CalendarModuleProps> = ({
  user,
  events,
  onAddEvent,
  onToggleEvent,
  onDeleteEvent,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState('08:00');
  const [type, setType] = useState<CalendarEvent['type']>('dose');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newEvent: CalendarEvent = {
      id: `cal_${Date.now()}`,
      date,
      time: time || undefined,
      title: title.trim(),
      type,
      completed: false,
      notes: notes.trim() || undefined,
    };

    onAddEvent(newEvent);
    setShowForm(false);
    setTitle('');
    setNotes('');
  };

  const getEventIcon = (eventType: CalendarEvent['type']) => {
    switch (eventType) {
      case 'dose':
        return <Syringe className="w-4 h-4 text-[#00C9D7]" />;
      case 'weigh_in':
        return <Scale className="w-4 h-4 text-[#35D68A]" />;
      case 'doctor':
        return <Stethoscope className="w-4 h-4 text-purple-600" />;
      case 'refill':
        return <Pill className="w-4 h-4 text-amber-500" />;
      default:
        return <CalendarDays className="w-4 h-4 text-[#082B55]" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#082B55] text-white flex items-center justify-center shadow-sm">
            <CalendarDays className="w-6 h-6 stroke-[2]" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-[#082B55]">
              Calendário & Lembretes
            </h2>
            <p className="text-xs text-slate-500">
              Agendamento de injeções, pesagens e consultas
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="px-3 py-2 bg-[#082B55] hover:bg-[#082B55]/90 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          Lembrete
        </button>
      </div>

      {/* Routine schedule tip */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/60 p-4 rounded-3xl border border-blue-100 flex items-start gap-3">
        <Syringe className="w-5 h-5 text-[#082B55] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <strong className="text-[#082B55] block">
            Seu dia oficial de aplicação é toda Terça-feira
          </strong>
          Manter um dia fixo da semana maximiza a estabilidade dos níveis plasmáticos de GLP-1, diminuindo oscilações de apetite e picos de efeitos colaterais.
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-extrabold text-sm text-[#082B55]">
              Novo Agendamento / Lembrete
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
                TÍTULO DO EVENTO
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Aplicação da dose 0.5mg, Consulta com Endocrino..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  DATA
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
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                CATEGORIA
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as CalendarEvent['type'])}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              >
                <option value="dose">💉 Injeção GLP-1</option>
                <option value="weigh_in">⚖️ Pesagem Oficial</option>
                <option value="doctor">🩺 Consulta Médica</option>
                <option value="refill">💊 Farmácia / Receita</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                NOTAS ADICIONAIS
              </label>
              <input
                type="text"
                placeholder="Ex: Não esquecer de tirar a caneta da geladeira 15 min antes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#082B55] hover:bg-[#082B55]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#082B55]/20 transition-all"
            >
              Salvar no Calendário
            </button>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-extrabold text-sm text-[#082B55] mb-3">
          Próximos Compromissos ({events.length})
        </h3>

        <div className="space-y-2.5">
          {events.map((evt) => (
            <div
              key={evt.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                evt.completed
                  ? 'bg-slate-50/60 border-slate-200 opacity-60'
                  : 'bg-white border-slate-200 hover:border-[#00C9D7]'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onToggleEvent(evt.id)}
                  className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    evt.completed
                      ? 'bg-emerald-500 text-white'
                      : 'border-2 border-slate-300 hover:border-[#082B55]'
                  }`}
                >
                  {evt.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    {getEventIcon(evt.type)}
                    <span
                      className={`text-xs font-bold ${
                        evt.completed
                          ? 'line-through text-slate-400'
                          : 'text-[#082B55]'
                      }`}
                    >
                      {evt.title}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 block mt-0.5 font-medium">
                    {evt.date} {evt.time ? `às ${evt.time}` : ''}
                  </span>

                  {evt.notes && (
                    <p className="text-[11px] text-slate-500 mt-1 italic">
                      {evt.notes}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => onDeleteEvent(evt.id)}
                className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
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
