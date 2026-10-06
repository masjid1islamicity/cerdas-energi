import React from 'react';
import { AlertTriangle, Zap, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { HomeTelemetry } from '../types';

interface OverconsumptionAlertBannerProps {
  home: HomeTelemetry;
  onAutoShedLoad: () => void;
  onDismiss?: () => void;
}

export const OverconsumptionAlertBanner: React.FC<OverconsumptionAlertBannerProps> = ({
  home,
  onAutoShedLoad,
  onDismiss,
}) => {
  const isOver = home.homeConsumptionWatts > home.peakPowerLimitWatts;
  const isDanger = home.homeConsumptionWatts > home.dangerLimitWatts;
  const excessWatts = home.homeConsumptionWatts - home.peakPowerLimitWatts;

  if (!isOver) return null;

  return (
    <div
      className={`mx-4 sm:mx-6 lg:mx-8 mt-3 mb-1 p-4 rounded-xl border transition-all animate-bounce-subtle ${
        isDanger
          ? 'bg-rose-50 border-rose-300 text-rose-950 shadow-md shadow-rose-900/10'
          : 'bg-amber-50 border-amber-300 text-amber-950 shadow-md shadow-amber-900/10'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-lg flex-shrink-0 ${
              isDanger ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-500 text-white'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  isDanger ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'
                }`}
              >
                {isDanger ? 'Bahaya: Batas Kritis Terlampaui' : 'Peringatan Konsumsi Listrik Berlebih'}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Ambang Batas: {home.peakPowerLimitWatts} W
              </span>
            </div>
            <h4 className="text-sm font-bold mt-1 text-slate-900">
              Konsumsi Rumah Mencapai {home.homeConsumptionWatts.toLocaleString('id-ID')} Watt (+{excessWatts.toLocaleString('id-ID')} W di atas batas aman)
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Pemborosan daya listrik berisiko memicu trip MCB meteran PLN dan meningkatkan biaya tarif WBP. AI siap memangkas beban sekunder secara mandiri.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 self-end md:self-center">
          <button
            onClick={onAutoShedLoad}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-transform active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Aktifkan AI Shedding Otomatis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
