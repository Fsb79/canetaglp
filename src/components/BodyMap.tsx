import React from 'react';
import { InjectionSite } from '../types';

interface BodyMapProps {
  selectedSite: InjectionSite;
  onSelectSite: (site: InjectionSite) => void;
  lastUsedSite?: InjectionSite;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedSite,
  onSelectSite,
  lastUsedSite,
}) => {
  const sites: {
    id: InjectionSite;
    name: string;
    sub: string;
    recommended: boolean;
  }[] = [
    {
      id: 'abdomen_right',
      name: 'Abdômen Direito',
      sub: '5cm lateral ao umbigo',
      recommended: lastUsedSite !== 'abdomen_right',
    },
    {
      id: 'abdomen_left',
      name: 'Abdômen Esquerdo',
      sub: '5cm lateral ao umbigo',
      recommended: lastUsedSite !== 'abdomen_left',
    },
    {
      id: 'thigh_right',
      name: 'Coxa Direita',
      sub: 'Face ântero-lateral superior',
      recommended: lastUsedSite !== 'thigh_right',
    },
    {
      id: 'thigh_left',
      name: 'Coxa Esquerda',
      sub: 'Face ântero-lateral superior',
      recommended: lastUsedSite !== 'thigh_left',
    },
    {
      id: 'arm_right',
      name: 'Braço Direito',
      sub: 'Região posterior do tríceps',
      recommended: lastUsedSite !== 'arm_right',
    },
    {
      id: 'arm_left',
      name: 'Braço Esquerdo',
      sub: 'Região posterior do tríceps',
      recommended: lastUsedSite !== 'arm_left',
    },
  ];

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-bold text-[#082B55] uppercase tracking-wider">
          Sítio de Injeção Subcutânea
        </h4>
        <span className="text-[11px] text-slate-500">
          Alterne sempre para evitar nódulos
        </span>
      </div>

      {/* Grid of injection zones */}
      <div className="grid grid-cols-2 gap-2">
        {sites.map((site) => {
          const isSelected = selectedSite === site.id;
          const isLast = lastUsedSite === site.id;

          return (
            <button
              key={site.id}
              type="button"
              onClick={() => onSelectSite(site.id)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? 'bg-[#082B55] text-white border-[#082B55] shadow-md shadow-[#082B55]/15'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-[#00C9D7] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold ${
                    isSelected ? 'text-white' : 'text-[#082B55]'
                  }`}
                >
                  {site.name}
                </span>
                {isLast && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight ${
                      isSelected
                        ? 'bg-amber-400 text-slate-900'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Última
                  </span>
                )}
              </div>
              <p
                className={`text-[10px] mt-0.5 ${
                  isSelected ? 'text-slate-200' : 'text-slate-400'
                }`}
              >
                {site.sub}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
