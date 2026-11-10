import React from 'react';
import {
  Home,
  Syringe,
  HeartPulse,
  Sparkles,
  Droplets,
  Scale,
  CalendarDays,
  FileSpreadsheet,
  Target,
} from 'lucide-react';
import { ActiveModule } from '../types';

interface BottomNavProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeModule,
  onSelectModule,
}) => {
  const mainTabs: {
    id: ActiveModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: 'Início', icon: Home },
    { id: 'doses', label: 'Doses', icon: Syringe },
    { id: 'hydration', label: 'Água', icon: Droplets },
    { id: 'health', label: 'Saúde', icon: HeartPulse },
    { id: 'nutrition', label: 'Nutrição IA', icon: Sparkles },
    { id: 'reports', label: 'Relatórios', icon: FileSpreadsheet },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(8,43,85,0.06)]">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center h-16 px-1">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectModule(tab.id)}
              className={`flex flex-col items-center justify-center h-full transition-all relative ${
                isActive
                  ? 'text-[#082B55] font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-b-full bg-[#00C9D7]" />
              )}
              <div
                className={`w-9 h-7 flex items-center justify-center rounded-xl transition-all ${
                  isActive
                    ? 'bg-[#00C9D7]/15 text-[#082B55]'
                    : 'text-slate-500'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-[#082B55] stroke-[2.3]' : 'stroke-[1.8]'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] tracking-tight leading-none mt-1 truncate max-w-[55px] ${
                  isActive ? 'font-bold text-[#082B55]' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const SecondaryModuleBar: React.FC<{
  activeModule: ActiveModule;
  onSelectModule: (m: ActiveModule) => void;
}> = ({ activeModule, onSelectModule }) => {
  const allModules: {
    id: ActiveModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: Home },
    { id: 'doses', label: '💉 Doses', icon: Syringe },
    { id: 'hydration', label: '💧 Hidratação', icon: Droplets },
    { id: 'health', label: '❤️ Saúde', icon: HeartPulse },
    { id: 'nutrition', label: '🥗 Nutrição IA', icon: Sparkles },
    { id: 'weight', label: '⚖️ Peso', icon: Scale },
    { id: 'calendar', label: '📅 Calendário', icon: CalendarDays },
    { id: 'reports', label: '📊 Relatórios', icon: FileSpreadsheet },
    { id: 'goals', label: '🎯 Metas', icon: Target },
  ];

  return (
    <div className="bg-white border-b border-slate-100 shadow-xs sticky top-[57px] z-20 overflow-x-auto py-2 px-4 no-scrollbar">
      <div className="flex items-center gap-1.5 max-w-4xl mx-auto min-w-max">
        {allModules.map((mod) => {
          const isActive = activeModule === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#082B55] text-white shadow-sm'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
              }`}
            >
              {mod.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
