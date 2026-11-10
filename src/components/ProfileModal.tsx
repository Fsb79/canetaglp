import React, { useState } from 'react';
import { User, X, Stethoscope, Save, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSaveUser: (updated: UserProfile) => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onSaveUser,
  onLogout,
}) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [heightCm, setHeightCm] = useState(String(user.heightCm));
  const [initialWeight, setInitialWeight] = useState(String(user.initialWeightKg));
  const [targetWeight, setTargetWeight] = useState(String(user.targetWeightKg));
  const [dailyWater, setDailyWater] = useState(String(user.dailyWaterGoalMl));
  const [dailyProtein, setDailyProtein] = useState(String(user.dailyProteinGoalGrams));
  const [doctorName, setDoctorName] = useState(user.doctorName || '');
  const [crm, setCrm] = useState(user.crm || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      ...user,
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      heightCm: parseFloat(heightCm) || user.heightCm,
      initialWeightKg: parseFloat(initialWeight) || user.initialWeightKg,
      targetWeightKg: parseFloat(targetWeight) || user.targetWeightKg,
      dailyWaterGoalMl: parseInt(dailyWater, 10) || user.dailyWaterGoalMl,
      dailyProteinGoalGrams: parseInt(dailyProtein, 10) || user.dailyProteinGoalGrams,
      doctorName: doctorName.trim() || undefined,
      crm: crm.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082B55]/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#082B55] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00C9D7]/20 text-[#00C9D7] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Perfil do Paciente</h3>
              <p className="text-xs text-slate-300">Dados clínicos e metas do tratamento</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                NOME COMPLETO
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                E-MAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                ALTURA (CM)
              </label>
              <input
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                PESO INICIAL
              </label>
              <input
                type="number"
                step="0.1"
                value={initialWeight}
                onChange={(e) => setInitialWeight(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                PESO META
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                META DE ÁGUA (ML/DIA)
              </label>
              <input
                type="number"
                value={dailyWater}
                onChange={(e) => setDailyWater(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                META DE PROTEÍNA (G/DIA)
              </label>
              <input
                type="number"
                value={dailyProtein}
                onChange={(e) => setDailyProtein(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>
          </div>

          {/* Doctor info */}
          <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
              <Stethoscope className="w-4 h-4 text-purple-700" />
              Médico Assistente (para Relatórios)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Nome do Médico(a)"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="w-full p-2 bg-white border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
              />
              <input
                type="text"
                placeholder="CRM (ex: CRM/SP 148920)"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                className="w-full p-2 bg-white border border-purple-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="text-xs text-rose-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sair da Conta
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#082B55] hover:bg-[#082B55]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#082B55]/20 flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
