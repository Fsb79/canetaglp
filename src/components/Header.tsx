import React from 'react';
import { Pill, UserCircle, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onOpenMedicationModal: () => void;
  onLogout: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenMedicationModal,
  onLogout,
  onOpenProfile,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#082B55] text-white shadow-md border-b border-[#082B55]/40 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5">
          <img
            src="/assets/aistudio/image_00222cc8.png"
            alt="GLP360 Logo"
            className="w-9 h-9 rounded-xl object-cover shadow-sm ring-1 ring-white/20"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight leading-none text-white">
                GLP360
              </span>
              <span className="text-[10px] font-semibold text-[#00C9D7] px-1.5 py-0.5 rounded-full bg-[#00C9D7]/15">
                Saúde IA
              </span>
            </div>
            <p className="text-[10px] text-slate-300 leading-none mt-0.5">
              {user.name.split(' ')[0]} · Próxima dose Terça
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Medication trigger button (Allows choosing 3 names or custom) */}
          <button
            onClick={onOpenMedicationModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white transition-all active:scale-[0.98]"
            title="Alterar medicamento ou dosagem"
          >
            <Pill className="w-3.5 h-3.5 text-[#00C9D7]" />
            <span className="max-w-[130px] sm:max-w-[180px] truncate">
              {user.medication.split(' ')[0]} ({user.currentDose})
            </span>
          </button>

          {/* User profile / Logout */}
          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#00C9D7]/20 text-[#00C9D7] hover:bg-[#00C9D7]/30 flex items-center justify-center transition-colors"
            title="Ver Perfil do Paciente"
          >
            <UserCircle className="w-5 h-5" />
          </button>

          <button
            onClick={onLogout}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            title="Sair / Trocar de Conta"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
