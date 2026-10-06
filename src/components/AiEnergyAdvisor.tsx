import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Brain,
  Sliders,
  AlertCircle,
} from 'lucide-react';
import {
  SolarTelemetry,
  HomeTelemetry,
  SmartDevice,
  WeatherInfo,
  AiRecommendation,
} from '../types';
import { ISLAMIC_ECO_PRINCIPLES } from '../data/mockData';
import { soundFx } from '../utils/soundEffects';

interface AiEnergyAdvisorProps {
  solar: SolarTelemetry;
  home: HomeTelemetry;
  devices: SmartDevice[];
  weather: WeatherInfo;
  onApplyAction: (recommendation: AiRecommendation) => void;
  isAiAutoPilot: boolean;
  onToggleAiAutoPilot: () => void;
}

export const AiEnergyAdvisor: React.FC<AiEnergyAdvisorProps> = ({
  solar,
  home,
  devices,
  weather,
  onApplyAction,
  isAiAutoPilot,
  onToggleAiAutoPilot,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiData, setAiData] = useState<{
    summary: string;
    islamicWisdom: string;
    recommendedActions: AiRecommendation[];
    ecoScore: number;
    dailyTargetKwh: number;
    source?: string;
  }>({
    summary:
      'Sistem AI mendeteksi potensi surplus daya surya sebesar 1.300 W. Menjadwalkan pengisian perangkat berdaya besar ke jam 11:00 - 13:30 WIB direkomendasikan untuk menekan pemakaian PLN.',
    islamicWisdom:
      '“Makan dan minumlah, tetapi jangan berlebih-lebihan. Sungguh Allah tidak menyukai orang yang berlebih-lebihan.” (QS. Al-A\'raf: 31) — Amanah menjaga efisiensi energi.',
    recommendedActions: [
      {
        id: 'act-solar-shift-heatpump',
        title: 'Pindahkan Siklus Pompa Kalor Air Panas ke Jam 11:30 WIB',
        impact: 'Tinggi',
        estimatedSavingsRp: 14500,
        reason: 'Menggunakan 100% listrik tenaga surya gratis tanpa membebani tagihan PLN jam malam.',
        suggestedDeviceId: 'dev-water-heater',
        isApplied: false,
      },
      {
        id: 'act-ac-eco-setpoint',
        title: 'Optimasi Setpoint AC Ruang Keluarga ke 25°C Eco Mode',
        impact: 'Sedang',
        estimatedSavingsRp: 8200,
        reason: 'Menghemat hingga 18% konsumsi kompresor tanpa mengurangi kenyamanan ruangan.',
        suggestedDeviceId: 'dev-ac-living',
        isApplied: false,
      },
      {
        id: 'act-ev-schedule',
        title: 'Tahan Pengisian EV Charger Sampai Baterai Rumah Mencapai 90%',
        impact: 'Tinggi',
        estimatedSavingsRp: 22000,
        reason: 'Mencegah lonjakan daya melampaui kapasitas MCB terpasang.',
        suggestedDeviceId: 'dev-ev-wallbox',
        isApplied: false,
      },
    ],
    ecoScore: 91,
    dailyTargetKwh: 14.8,
    source: 'gemini-3.8-flash',
  });

  const [activePrincipleIndex, setActivePrincipleIndex] = useState(0);

  const handleRefreshAiAnalysis = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telemetry: {
            solarGenerationWatts: solar.solarGenerationWatts,
            homeConsumptionWatts: home.homeConsumptionWatts,
            batterySoC: 82,
            batteryStatus: 'Charging',
            gridPowerWatts: -450,
            gridStatus: 'Export',
          },
          devices,
          weather,
          tariffPerKwh: 1444.7,
        }),
      });

      const json = await res.json();
      if (json?.data) {
        setAiData({
          ...json.data,
          source: json.source || 'gemini-3.8-flash',
        });
        soundFx.playSuccessChime();
      }
    } catch (err) {
      console.warn('AI analysis refresh notice, keeping cached model output:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = (rec: AiRecommendation) => {
    onApplyAction(rec);
    setAiData((prev) => ({
      ...prev,
      recommendedActions: prev.recommendedActions.map((item) =>
        item.id === rec.id ? { ...item, isApplied: true } : item
      ),
      ecoScore: Math.min(99, prev.ecoScore + 3),
    }));
    soundFx.playSuccessChime();
  };

  return (
    <div className="space-y-6">
      {/* Top AI Engine Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
              <Brain className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                  Gemini 3.8 Flash Engine
                </span>
                <span className="text-xs text-slate-300">• Logika Prediktif Beban Dinamis</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-1">
                Otomatisasi Efisiensi Listrik Berbasis AI UPIC
              </h2>
              <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                Mengintegrasikan prediksi produksi panel surya dan kurva konsumsi rumah tangga untuk penghematan biaya listrik harian secara berkelanjutan.
              </p>
            </div>
          </div>

          {/* AI Auto-Pilot Toggle & Refresh */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/15 flex items-center gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-300 block">
                  Mode AI Auto-Pilot
                </span>
                <span className="text-xs font-semibold text-emerald-300">
                  {isAiAutoPilot ? 'Aktif (Otomatis)' : 'Manual (Konfirmasi)'}
                </span>
              </div>
              <button
                onClick={onToggleAiAutoPilot}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAiAutoPilot ? 'bg-emerald-500' : 'bg-slate-600'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAiAutoPilot ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleRefreshAiAnalysis}
              disabled={isLoading}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all disabled:opacity-50 shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Menganalisis...' : 'Analisis AI'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Islamic Eco-Stewardship Principle Card */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white rounded-2xl border border-emerald-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-emerald-200/60 mb-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs uppercase font-extrabold tracking-wider">
              Landasan Nilai Islamicity: Hifz al-Bi'ah & Larangan Israf
            </h3>
          </div>
          <div className="flex items-center gap-1">
            {ISLAMIC_ECO_PRINCIPLES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActivePrincipleIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  activePrincipleIndex === idx ? 'bg-emerald-700 w-5' : 'bg-emerald-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="transition-all duration-300">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <h4 className="text-sm font-bold text-emerald-950">
              {ISLAMIC_ECO_PRINCIPLES[activePrincipleIndex].surah}
            </h4>
            <p className="text-right text-base font-serif font-bold text-emerald-800 leading-relaxed">
              {ISLAMIC_ECO_PRINCIPLES[activePrincipleIndex].arabic}
            </p>
          </div>
          <p className="text-xs italic text-slate-700 mt-1">
            {ISLAMIC_ECO_PRINCIPLES[activePrincipleIndex].translation}
          </p>
          <div className="mt-2.5 pt-2 border-t border-emerald-200/40 text-xs font-medium text-emerald-900 bg-white/70 p-2.5 rounded-lg border border-emerald-100">
            <span className="font-bold">Aplikasi dalam Rumah Cerdas: </span>
            {ISLAMIC_ECO_PRINCIPLES[activePrincipleIndex].application}
          </div>
        </div>
      </div>

      {/* AI Intelligence Summary & Eco-Score Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Summary and Action List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Situation Summary */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-800 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-600">
                Diagnosis Cerdas Real-Time
              </h4>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {aiData.summary}
            </p>
          </div>

          {/* Actionable Recommendations List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Rekomendasi Tindakan Penghematan Otomatis ({aiData.recommendedActions.length})
              </h3>
              <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Potensi Hemat: Rp {aiData.recommendedActions.reduce((acc, cur) => acc + cur.estimatedSavingsRp, 0).toLocaleString('id-ID')} / hari
              </span>
            </div>

            <div className="space-y-3">
              {aiData.recommendedActions.map((action) => (
                <div
                  key={action.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    action.isApplied
                      ? 'bg-slate-50 border-slate-200 opacity-70'
                      : 'bg-white hover:bg-slate-50/80 border-slate-200/90 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            action.impact === 'Tinggi'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          Dampak {action.impact}
                        </span>
                        <span className="text-xs font-bold text-emerald-700">
                          Hemat ~Rp {action.estimatedSavingsRp.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">{action.title}</h4>
                      <p className="text-[11px] text-slate-600">{action.reason}</p>
                    </div>

                    <div className="flex-shrink-0 self-end sm:self-center">
                      {action.isApplied ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Diterapkan
                        </span>
                      ) : (
                        <button
                          onClick={() => handleApply(action)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
                        >
                          <span>Terapkan</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Eco-Score Gauge & Automation Stats */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs text-center flex flex-col items-center justify-center">
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">
              Skor Efisiensi Islamicity (Eco-Score)
            </span>

            {/* Circular Gauge Representation */}
            <div className="relative my-4 flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#e2e8f0"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="#059669"
                  strokeWidth="10"
                  strokeDasharray="326"
                  strokeDashoffset={326 - (326 * aiData.ecoScore) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-emerald-800">
                  {aiData.ecoScore}
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  / 100 Poin
                </span>
              </div>
            </div>

            <p className="text-xs font-semibold text-slate-800">
              Kategori: <span className="text-emerald-700 font-bold">Sangat Istiqomah & Hemat</span>
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
              Rumah tangga Anda telah meminimalkan 88% pemborosan listrik standby dan memanfaatkan puncak radiasi matahari secara cerdas.
            </p>
          </div>

          {/* Quick Target Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold">Target Konsumsi Harian</span>
              <span className="font-bold text-slate-800">{aiData.dailyTargetKwh} kWh</span>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-2">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1.5 text-right">
              Tercapai 65% hari ini
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
