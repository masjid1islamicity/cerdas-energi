import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Leaf,
  Sparkles,
  RefreshCw,
  Sun,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Heart,
} from 'lucide-react';
import { SolarTelemetry, HomeTelemetry, BatteryTelemetry, WeatherInfo } from '../types';
import { soundFx } from '../utils/soundEffects';

interface DailyIslamicEcoTipCardProps {
  solar: SolarTelemetry;
  home: HomeTelemetry;
  battery: BatteryTelemetry;
  weather: WeatherInfo;
  onApplyQuickAction?: (actionText: string) => void;
}

interface TipData {
  title: string;
  surahRef: string;
  arabicSnippet: string;
  translation: string;
  practicalTip: string;
  sustainabilityImpact: string;
  category: string;
  actionText: string;
  source?: string;
}

export const DailyIslamicEcoTipCard: React.FC<DailyIslamicEcoTipCardProps> = ({
  solar,
  home,
  battery,
  weather,
  onApplyQuickAction,
}) => {
  const [tip, setTip] = useState<TipData>({
    title: 'Maksimalkan Berkah Surya di Siang Hari',
    surahRef: 'QS. Yunus : 5',
    arabicSnippet: 'هُوَ ٱلَّذِى جَعَلَ ٱلشَّمْسَ ضِيَآءً وَٱلْقَمَرَ نُورًا',
    translation: '“Dialah yang menjadikan matahari bersinar dan bulan bercahaya...”',
    practicalTip: `Produksi panel surya saat ini mencapai ${solar.solarGenerationWatts.toLocaleString('id-ID')} W. Ini waktu terbaik memanaskan air dan menjalankan peralatan listrik utama dengan 100% energi bersih tanpa membebani tagihan PLN.`,
    sustainabilityImpact: 'Mencegah emisi pembangkit batu bara dan menunaikan amanah menjaga bumi (Hifz al-Bi\'ah).',
    category: 'Pemanfaatan Surya',
    actionText: 'Jadwalkan Pemanas Air Sekarang',
    source: 'Gemini 3.8 Flash AI',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Baru saja diperbarui');

  const fetchDailyTip = async (isManual = false) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/daily-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          solarWatts: solar.solarGenerationWatts,
          homeWatts: home.homeConsumptionWatts,
          batterySoC: battery.batterySoC,
          condition: weather.condition,
          timeStr: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        }),
      });

      const json = await res.json();
      if (json?.data) {
        setTip({
          ...json.data,
          source: json.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash AI' : 'Sistem Intelijen Islamicity',
        });
        setIsApplied(false);
        setLastUpdated(
          `Diperbarui ${new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
        );
        if (isManual) {
          soundFx.playSuccessChime();
        }
      }
    } catch (err) {
      console.warn('Daily tip fetch fallback:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch automatically when power condition changes substantially (e.g. surplus vs high load)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDailyTip(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [solar.solarGenerationWatts > home.homeConsumptionWatts, home.homeConsumptionWatts > 3000]);

  const handleAction = () => {
    setIsApplied(true);
    soundFx.playSuccessChime();
    if (onApplyQuickAction) {
      onApplyQuickAction(tip.actionText);
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white rounded-2xl p-5 lg:p-6 shadow-md border border-emerald-500/30 relative overflow-hidden transition-all">
      {/* Background Islamic star geometric motif */}
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-emerald-500/20 gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-xs">
            <BookOpen className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Ajaran Islam & Keberlanjutan
              </span>
              <span className="text-[10px] text-slate-300 hidden sm:inline">• {tip.category}</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5 tracking-tight">
              Tips Hemat Energi Harian Berbasis Syariat & Lingkungan
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <span className="text-[10px] text-emerald-300/80 font-medium hidden md:inline">
            {lastUpdated}
          </span>
          <button
            onClick={() => fetchDailyTip(true)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 transition-colors disabled:opacity-50"
            title="Segarkan tips hemat energi dengan telemetri terbaru"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Memperbarui...' : 'Segarkan Tips'}</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center relative z-10">
        {/* Left: Quranic Foundation Quote */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-xl p-4 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-300">{tip.surahRef}</span>
            <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
              Dalil Panduan
            </span>
          </div>

          <p className="text-right text-lg sm:text-xl font-serif font-bold text-emerald-200 leading-loose tracking-wide pt-1">
            {tip.arabicSnippet}
          </p>

          <p className="text-xs text-slate-300 italic pt-1 border-t border-white/10 leading-relaxed">
            {tip.translation}
          </p>
        </div>

        {/* Right: Practical Tip & Telemetry Link */}
        <div className="lg:col-span-7 space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-bold text-white">{tip.title}</h4>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-normal">
              {tip.practicalTip}
            </p>
          </div>

          {/* Sustainability Benefit Pill */}
          <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 flex items-start gap-2 text-[11px] text-emerald-300">
            <Leaf className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Dampak Keberlanjutan:</strong> {tip.sustainabilityImpact}
            </span>
          </div>

          {/* Action Trigger */}
          <div className="pt-1 flex items-center justify-between flex-wrap gap-2">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Dianalisis otomatis oleh {tip.source || 'AI UPIC'}
            </span>

            {isApplied ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tindakan Diterapkan
              </span>
            ) : (
              <button
                onClick={handleAction}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition-transform active:scale-95 shadow-sm"
              >
                <span>{tip.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
