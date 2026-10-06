import React, { useState } from 'react';
import {
  X,
  Target,
  Coins,
  CheckCircle2,
  Sparkles,
  Sliders,
  Calendar,
  HelpCircle,
  TrendingDown,
} from 'lucide-react';
import { MonthlySavingsTarget } from '../types';
import { soundFx } from '../utils/soundEffects';

interface SetMonthlyTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetData: MonthlySavingsTarget;
  onSaveTarget: (newTarget: MonthlySavingsTarget) => void;
}

export const SetMonthlyTargetModal: React.FC<SetMonthlyTargetModalProps> = ({
  isOpen,
  onClose,
  targetData,
  onSaveTarget,
}) => {
  const [targetRp, setTargetRp] = useState<number>(targetData.targetSavingsRp);
  const [isAiPacing, setIsAiPacing] = useState<boolean>(targetData.isAiPacingEnabled);
  const [notes, setNotes] = useState<string>(targetData.notes || '');

  if (!isOpen) return null;

  const quickPresets = [
    { label: 'Rumah 1.300 VA', amount: 350000, desc: 'Target hemat dasar' },
    { label: 'Rumah 2.200 VA', amount: 500000, desc: 'Hemat AC & Kulkas' },
    { label: 'Rumah 3.500 VA (Direkomendasikan)', amount: 650000, desc: 'Optimal Solar 3-5kW' },
    { label: 'Rumah 5.500 VA & EV', amount: 950000, desc: 'Maksimal swasembada surya' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetRp <= 0) return;

    onSaveTarget({
      ...targetData,
      targetSavingsRp: targetRp,
      isAiPacingEnabled: isAiPacing,
      notes: notes.trim(),
    });

    soundFx.playSuccessChime();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Target className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Pengaturan Target Penghematan Bulanan
              </h3>
              <p className="text-xs text-slate-300">
                Periode: {targetData.monthName} (Hari ke-{targetData.daysElapsed} dari {targetData.totalDaysInMonth} hari)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Target Amount Input */}
          <div>
            <label className="text-xs font-bold text-slate-800 block mb-1.5 flex items-center justify-between">
              <span>Nominal Target Penghematan Bulan Ini:</span>
              <span className="text-xs font-extrabold text-emerald-700">
                Rp {targetRp.toLocaleString('id-ID')}
              </span>
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                Rp
              </span>
              <input
                type="number"
                min={50000}
                max={3000000}
                step={25000}
                value={targetRp}
                onChange={(e) => setTargetRp(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 text-base font-black text-slate-900 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="650000"
              />
            </div>

            {/* Slider */}
            <div className="mt-3">
              <input
                type="range"
                min={150000}
                max={1500000}
                step={25000}
                value={Math.min(1500000, targetRp)}
                onChange={(e) => setTargetRp(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-1">
                <span>Rp 150.000</span>
                <span>Rp 750.000</span>
                <span>Rp 1.500.000</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Pilihan Cepat Berdasarkan Kapasitas Listrik Rumah:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPresets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTargetRp(preset.amount)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    targetRp === preset.amount
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-950'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{preset.label}</span>
                    {targetRp === preset.amount && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-xs font-black text-emerald-700 block mt-0.5">
                    Rp {preset.amount.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-500 block">{preset.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Auto-Pacing Toggle */}
          <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50/50 rounded-xl border border-emerald-200">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Aktifkan AI Auto-Pacing Penghematan</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Jika laju penghematan harian tertinggal dari target bulanan, AI UPIC akan secara mandiri memprioritaskan pemanfaatan surya dan meredupkan perangkat non-kritis.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAiPacing(!isAiPacing)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 mt-0.5 ${
                  isAiPacing ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAiPacing ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Notes or Intention */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Catatan / Niat Keberkahan Energi (Opsional):
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Dana hemat dialokasikan untuk sedekah & kas musholla"
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
            >
              <Target className="w-3.5 h-3.5 text-amber-300" />
              <span>Simpan Target Bulanan</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
