import React from 'react';
import {
  Target,
  TrendingDown,
  Sparkles,
  Calendar,
  CheckCircle2,
  Sliders,
  ArrowUpRight,
  Plus,
  Coins,
  Award,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MonthlySavingsTarget } from '../types';
import { soundFx } from '../utils/soundEffects';

interface MonthlySavingsTargetCardProps {
  targetData: MonthlySavingsTarget;
  onOpenSettings: () => void;
  onSimulateIncrement: (amount: number) => void;
}

export const MonthlySavingsTargetCard: React.FC<MonthlySavingsTargetCardProps> = ({
  targetData,
  onOpenSettings,
  onSimulateIncrement,
}) => {
  const {
    targetSavingsRp,
    currentSavingsRp,
    monthName,
    daysElapsed,
    totalDaysInMonth,
    isAiPacingEnabled,
    notes,
  } = targetData;

  const percentage = Math.min(150, Math.round((currentSavingsRp / targetSavingsRp) * 1000) / 10);
  const isTargetAchieved = percentage >= 100;
  const remainingRp = Math.max(0, targetSavingsRp - currentSavingsRp);

  // Pacing calculations
  const expectedPacingPercentage = Math.round((daysElapsed / totalDaysInMonth) * 100);
  const isOnTrack = percentage >= expectedPacingPercentage;

  // Daily average and projected month end
  const averageDailySavings = daysElapsed > 0 ? Math.round(currentSavingsRp / daysElapsed) : 21600;
  const projectedMonthEndRp = Math.round(currentSavingsRp + averageDailySavings * (totalDaysInMonth - daysElapsed));
  const daysToTarget = averageDailySavings > 0 ? Math.ceil(remainingRp / averageDailySavings) : 8;

  const handleQuickAdd = () => {
    onSimulateIncrement(25000);
    soundFx.playSuccessChime();
    if (currentSavingsRp + 25000 >= targetSavingsRp) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-sm transition-all relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-72 h-72 bg-radial from-emerald-100/50 via-teal-50/20 to-transparent pointer-events-none rounded-full blur-2xl"></div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/20">
            <Target className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Target Penghematan Bulanan Real-Time
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {monthName}
              </span>
              {isAiPacingEnabled && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-500" />
                  AI Pacing Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pantau progres akumulasi penghematan listrik panel surya & otomatisasi AI terhadap target bulanan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>Atur Target</span>
          </button>
        </div>
      </div>

      {/* Main KPI Numbers Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 my-5 relative z-10">
        {/* Metric 1: Target Nominal */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Target Bulan Ini
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 block">
            Rp {targetSavingsRp.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            31 Hari Penuh
          </span>
        </div>

        {/* Metric 2: Realized Savings */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-3.5 rounded-xl border border-emerald-200/90">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Tercapai Saat Ini
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-900">
              Hari ke-{daysElapsed}
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-0.5 block">
            Rp {currentSavingsRp.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" /> Panel Surya & Efisiensi AI
          </span>
        </div>

        {/* Metric 3: Remaining / Exceeded */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            {isTargetAchieved ? 'Surplus Di Atas Target' : 'Sisa Menuju Target'}
          </span>
          <span
            className={`text-xl sm:text-2xl font-black mt-0.5 block ${
              isTargetAchieved ? 'text-amber-600' : 'text-slate-800'
            }`}
          >
            {isTargetAchieved
              ? `+Rp ${(currentSavingsRp - targetSavingsRp).toLocaleString('id-ID')}`
              : `Rp ${remainingRp.toLocaleString('id-ID')}`}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            {isTargetAchieved ? 'Target Berhasil Dilampaui!' : `~${daysToTarget} hari lagi pada laju saat ini`}
          </span>
        </div>

        {/* Metric 4: Projected Month-End */}
        <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Proyeksi Akhir Bulan
            </span>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                isOnTrack ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isOnTrack ? 'Di Jalur Cepat' : 'Perlu Didorong'}
            </span>
          </div>
          <span className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 block">
            Rp {projectedMonthEndRp.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold">
            {Math.round((projectedMonthEndRp / targetSavingsRp) * 100)}% dari target awal
          </span>
        </div>
      </div>

      {/* VISUAL REAL-TIME PROGRESS BAR SECTION */}
      <div className="bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              Progres Pencapaian Real-Time:
            </span>
            <span
              className={`text-xs font-black px-2 py-0.5 rounded-full ${
                isTargetAchieved
                  ? 'bg-amber-100 text-amber-900 ring-1 ring-amber-300'
                  : 'bg-emerald-100 text-emerald-900'
              }`}
            >
              {percentage}%
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Rp {currentSavingsRp.toLocaleString('id-ID')} / Rp {targetSavingsRp.toLocaleString('id-ID')}
          </div>
        </div>

        {/* Outer Bar Track */}
        <div className="relative w-full bg-slate-200 rounded-full h-5 p-0.5 overflow-visible shadow-inner">
          {/* Milestone markers tick marks inside bar */}
          <div className="absolute inset-0 flex justify-between px-1 pointer-events-none z-10 items-center">
            <div className="w-0.5 h-3 bg-white/60 ml-[25%]"></div>
            <div className="w-0.5 h-3 bg-white/60 ml-[25%]"></div>
            <div className="w-0.5 h-3 bg-white/60 ml-[25%]"></div>
          </div>

          {/* Glowing Animated Fill */}
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out relative ${
              isTargetAchieved
                ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400 shadow-md shadow-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 shadow-sm'
            }`}
            style={{ width: `${Math.min(100, percentage)}%` }}
          >
            {/* Pulsing indicator needle knob at the tip */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1.5 w-4 h-4 rounded-full bg-white border-2 border-emerald-600 shadow-md flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            </div>
          </div>
        </div>

        {/* Milestone Labels Below Bar */}
        <div className="grid grid-cols-4 text-center mt-2 text-[10px] text-slate-500 font-semibold pt-1">
          <div className="text-left">
            <span className="text-slate-400 block font-normal">0%</span>
            <span>Awal Bulan</span>
          </div>
          <div className="text-center">
            <span className="text-slate-400 block font-normal">25%</span>
            <span>Awal Hemat</span>
          </div>
          <div className="text-center">
            <span className="text-slate-400 block font-normal">50%</span>
            <span>Separuh Jalan</span>
          </div>
          <div className="text-right">
            <span className="text-emerald-700 block font-bold">100% Target</span>
            <span className="text-emerald-700 font-extrabold flex items-center justify-end gap-1">
              <Award className="w-3 h-3 text-amber-500" /> Berkah Energi
            </span>
          </div>
        </div>
      </div>

      {/* Footer Insight & Quick Simulation Trigger */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-[11px] text-slate-600 leading-snug">
            <strong>Analisis AI Pacing:</strong> Rata-rata hemat saat ini{' '}
            <strong>Rp {averageDailySavings.toLocaleString('id-ID')}/hari</strong>. Dengan mempertahankan swasembada surya, target diproyeksikan tercapai sebelum akhir bulan.
          </p>
        </div>

        {/* Interactive Quick Simulation Action */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-2xs active:scale-95"
            title="Tambah simulasi penghematan untuk menguji pergerakan progress bar real-time"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulasi +Rp 25.000</span>
          </button>
        </div>
      </div>
    </div>
  );
};
