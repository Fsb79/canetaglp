import React, { useState } from 'react';
import { Pill, Check, X, ShieldAlert } from 'lucide-react';

interface MedicationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMedication: string;
  currentDose: string;
  onSave: (medication: string, dose: string) => void;
}

const PRESET_MEDICATIONS = [
  {
    name: 'Ozempic / Wegovy (Semaglutida)',
    short: 'Ozempic / Wegovy',
    type: 'Semaglutida (Semanal)',
    doses: ['0.25mg', '0.5mg', '1.0mg', '1.7mg', '2.4mg'],
  },
  {
    name: 'Mounjaro / Zepbound (Tirzepatida)',
    short: 'Mounjaro / Zepbound',
    type: 'Tirzepatida (Semanal)',
    doses: ['2.5mg', '5.0mg', '7.5mg', '10.0mg', '12.5mg', '15.0mg'],
  },
  {
    name: 'Saxenda / Victoza (Liraglutida)',
    short: 'Saxenda / Victoza',
    type: 'Liraglutida (Diária)',
    doses: ['0.6mg', '1.2mg', '1.8mg', '2.4mg', '3.0mg'],
  },
];

export const MedicationSelectorModal: React.FC<MedicationSelectorModalProps> = ({
  isOpen,
  onClose,
  currentMedication,
  currentDose,
  onSave,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(() => {
    const isPreset = PRESET_MEDICATIONS.some((p) => p.name === currentMedication);
    return isPreset ? currentMedication : 'custom';
  });

  const [customName, setCustomName] = useState<string>(() => {
    const isPreset = PRESET_MEDICATIONS.some((p) => p.name === currentMedication);
    return isPreset ? '' : currentMedication;
  });

  const [dose, setDose] = useState<string>(currentDose || '0.5mg');
  const [customDose, setCustomDose] = useState<string>('');

  if (!isOpen) return null;

  const handleSelectPreset = (medName: string) => {
    setSelectedOption(medName);
    const found = PRESET_MEDICATIONS.find((m) => m.name === medName);
    if (found && !found.doses.includes(dose)) {
      setDose(found.doses[0]);
    }
  };

  const handleConfirm = () => {
    const finalMedName =
      selectedOption === 'custom'
        ? customName.trim() || 'GLP-1 Personalizado'
        : selectedOption;
    const finalDose = customDose.trim() ? customDose.trim() : dose;
    onSave(finalMedName, finalDose);
    onClose();
  };

  const activePreset = PRESET_MEDICATIONS.find((m) => m.name === selectedOption);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#082B55]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#082B55] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#00C9D7]/20 text-[#00C9D7] flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Medicamento GLP-1</h3>
              <p className="text-xs text-slate-300">Escolha a medicação e dose em uso</p>
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
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Section: 3 Quick Selection Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              SELEÇÃO RÁPIDA (3 PRINCIPAIS)
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {PRESET_MEDICATIONS.map((preset) => {
                const isSelected = selectedOption === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset.name)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#082B55]/5 border-[#00C9D7] ring-2 ring-[#00C9D7]/40 text-[#082B55]'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-[#082B55]">
                        {preset.short}
                      </div>
                      <div className="text-xs text-slate-500">{preset.type}</div>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-[#00C9D7] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Custom Medication Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-600">
                OUTRO MEDICAMENTO GLP-1
              </label>
              {selectedOption === 'custom' && (
                <span className="text-[11px] font-bold text-[#00C9D7]">Opção Ativa</span>
              )}
            </div>
            <div
              onClick={() => setSelectedOption('custom')}
              className={`p-3.5 rounded-2xl border transition-all ${
                selectedOption === 'custom'
                  ? 'bg-[#082B55]/5 border-[#00C9D7] ring-2 ring-[#00C9D7]/40'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <input
                type="text"
                placeholder="Ex: Rybelsus, Retatrutida, Manipulado..."
                value={customName}
                onChange={(e) => {
                  setCustomName(e.target.value);
                  setSelectedOption('custom');
                }}
                onFocus={() => setSelectedOption('custom')}
                className="w-full bg-transparent border-0 p-0 text-sm font-semibold text-[#082B55] placeholder:text-slate-400 focus:outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Caso não esteja nos 3 botões acima, digite aqui o nome prescrito.
              </p>
            </div>
          </div>

          {/* Section: Dosage Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              DOSE ATUAL EM MILIGRAMAS (MG)
            </label>
            {activePreset ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {activePreset.doses.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDose(d);
                      setCustomDose('');
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      dose === d && !customDose
                        ? 'bg-[#082B55] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            ) : null}

            {/* Custom Dose Input */}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Ou digite outra dose (ex: 0.75mg, 18 cliques)"
                value={customDose}
                onChange={(e) => setCustomDose(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#00C9D7]"
              />
            </div>
          </div>

          {/* Clinical note */}
          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldAlert className="w-4 h-4 text-[#082B55] shrink-0 mt-0.5" />
            <span>
              O ajuste de dose deve sempre ser acompanhado por prescrição e orientação médica individualizada.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 bg-[#082B55] hover:bg-[#082B55]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#082B55]/20 transition-all active:scale-[0.98]"
          >
            Salvar Medicamento
          </button>
        </div>
      </div>
    </div>
  );
};
