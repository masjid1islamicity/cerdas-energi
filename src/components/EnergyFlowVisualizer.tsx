import React from 'react';
import {
  Sun,
  BatteryCharging,
  Home,
  Zap,
  ArrowRight,
  ArrowDown,
  ArrowUp,
  Battery,
  Shield,
  Activity,
  Sliders,
  Sparkles,
} from 'lucide-react';
import {
  SolarTelemetry,
  BatteryTelemetry,
  GridTelemetry,
  HomeTelemetry,
} from '../types';

interface EnergyFlowVisualizerProps {
  solar: SolarTelemetry;
  battery: BatteryTelemetry;
  grid: GridTelemetry;
  home: HomeTelemetry;
  onSetScenario: (scenario: 'peak_solar' | 'cloudy' | 'evening_peak' | 'overload' | 'night_eco') => void;
  activeScenario: string;
}

export const EnergyFlowVisualizer: React.FC<EnergyFlowVisualizerProps> = ({
  solar,
  battery,
  grid,
  home,
  onSetScenario,
  activeScenario,
}) => {
  const isSolarGenerating = solar.solarGenerationWatts > 50;
  const isBatteryCharging = battery.batteryPowerWatts > 0;
  const isBatteryDischarging = battery.batteryPowerWatts < 0;
  const isGridExporting = grid.gridPowerWatts < 0;
  const isGridImporting = grid.gridPowerWatts > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 lg:p-6 transition-all">
      {/* Title & Live Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Aliran Daya Energi Real-Time (Interactive Power Flow)
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Integrasi dinamis antara panel surya, baterai ESS, beban rumah tangga, dan jaringan PLN
          </p>
        </div>

        {/* Live Scenario Simulator Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
            <Sliders className="w-3 h-3" /> Simulasi:
          </span>
          <button
            onClick={() => onSetScenario('peak_solar')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
              activeScenario === 'peak_solar'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Siang Cerah (Surplus)
          </button>
          <button
            onClick={() => onSetScenario('evening_peak')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
              activeScenario === 'evening_peak'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Sore WBP (ESS Baterai)
          </button>
          <button
            onClick={() => onSetScenario('overload')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
              activeScenario === 'overload'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Uji Beban Lebih (Overload)
          </button>
          <button
            onClick={() => onSetScenario('night_eco')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
              activeScenario === 'night_eco'
                ? 'bg-slate-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Malam Mode Hemat
          </button>
        </div>
      </div>

      {/* Main Flow Diagram Matrix */}
      <div className="relative py-6 my-2">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-radial from-emerald-50/40 via-transparent to-transparent pointer-events-none rounded-xl"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center relative z-10">
          {/* LEFT COLUMN: SOLAR ROOFTOP */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-xs bg-gradient-to-b from-amber-50 to-orange-50/40 rounded-2xl p-4 border border-amber-200/80 shadow-xs text-center transition-transform hover:scale-[1.02]">
              <div className="inline-flex p-3 rounded-2xl bg-amber-500 text-white shadow-md shadow-amber-500/20 mb-2">
                <Sun className={`w-7 h-7 ${isSolarGenerating ? 'animate-spin-slow' : 'opacity-40'}`} />
              </div>
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-amber-900">
                Panel Surya PV UPIC
              </h3>
              <p className="text-2xl font-extrabold text-amber-600 mt-1">
                {solar.solarGenerationWatts.toLocaleString('id-ID')} <span className="text-sm font-semibold">W</span>
              </p>
              <div className="mt-2.5 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800">
                <span>Panen Hari Ini:</span>
                <span className="font-bold">{solar.dailySolarYieldKwh.toFixed(1)} kWh</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-amber-800">
                <span>Efisiensi MPPT:</span>
                <span className="font-bold text-emerald-700">{solar.inverterEfficiency}%</span>
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: HYBRID INVERTER BRAIN */}
          <div className="flex flex-col items-center justify-center">
            {/* Upper Connection from Solar */}
            <div className="hidden md:flex flex-col items-center my-1 text-xs font-semibold text-amber-600">
              <span className="bg-amber-100 px-2 py-0.5 rounded-full text-[10px] mb-1">
                +{solar.solarGenerationWatts} W Masuk
              </span>
              <div className="w-0.5 h-6 bg-gradient-to-b from-amber-400 to-emerald-500"></div>
            </div>

            <div className="w-full max-w-sm bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-5 shadow-xl border border-emerald-500/30 text-center relative overflow-hidden group">
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>AI Controller</span>
              </div>

              <div className="inline-flex p-3 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 mb-2">
                <Zap className="w-7 h-7 text-amber-300 animate-pulse" />
              </div>

              <h4 className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
                Inverter Cerdas UPIC Hybrid
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                Pengendali Arus Otomatis Berbasis AI
              </p>

              <div className="mt-3 grid grid-cols-2 gap-2 text-left bg-white/5 p-2.5 rounded-xl border border-white/10 text-[11px]">
                <div>
                  <span className="text-slate-400 block text-[10px]">Tegangan Bus:</span>
                  <span className="font-bold text-slate-200">{solar.string1Voltage} V</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Suhu Operasional:</span>
                  <span className="font-bold text-slate-200">{solar.inverterTemp}°C (Aman)</span>
                </div>
              </div>
            </div>

            {/* Lower Connection to Battery */}
            <div className="hidden md:flex flex-col items-center my-1 text-xs font-semibold text-emerald-600">
              <div className="w-0.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-500"></div>
              <span className="bg-teal-100 px-2 py-0.5 rounded-full text-[10px] text-teal-800 mt-1">
                {isBatteryCharging ? `Mengisi: +${battery.batteryPowerWatts} W` : isBatteryDischarging ? `Menguras: ${battery.batteryPowerWatts} W` : 'Siaga'}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: HOME LOAD & GRID */}
          <div className="flex flex-col gap-4 items-center">
            {/* Home Consumption Card */}
            <div
              className={`w-full max-w-xs rounded-2xl p-4 border shadow-xs transition-transform hover:scale-[1.02] ${
                home.homeConsumptionWatts > home.peakPowerLimitWatts
                  ? 'bg-rose-50/80 border-rose-300 text-rose-950'
                  : 'bg-gradient-to-b from-teal-50 to-emerald-50/40 border-teal-200/80 text-teal-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="inline-flex p-2.5 rounded-xl bg-teal-600 text-white shadow-xs">
                  <Home className="w-5 h-5" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    home.homeConsumptionWatts > home.peakPowerLimitWatts
                      ? 'bg-rose-200 text-rose-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {home.homeConsumptionWatts > home.peakPowerLimitWatts ? 'Beban Berlebih!' : 'Konsumsi Normal'}
                </span>
              </div>

              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mt-2">
                Beban Rumah Tangga
              </h3>
              <p
                className={`text-2xl font-extrabold mt-0.5 ${
                  home.homeConsumptionWatts > home.peakPowerLimitWatts ? 'text-rose-600' : 'text-teal-700'
                }`}
              >
                {home.homeConsumptionWatts.toLocaleString('id-ID')} <span className="text-sm font-semibold">W</span>
              </p>

              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                <span>Batas Aman:</span>
                <span className="font-bold">{home.peakPowerLimitWatts} W</span>
              </div>
            </div>

            {/* Grid Net-Metering Card */}
            <div className="w-full max-w-xs bg-gradient-to-b from-slate-50 to-slate-100/60 rounded-2xl p-4 border border-slate-200 shadow-xs transition-transform hover:scale-[1.02]">
              <div className="flex items-center justify-between">
                <div className="inline-flex p-2.5 rounded-xl bg-slate-800 text-white shadow-xs">
                  <Activity className="w-5 h-5 text-amber-300" />
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isGridExporting
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {grid.gridStatus}
                </span>
              </div>

              <h3 className="text-xs uppercase font-extrabold tracking-wider text-slate-700 mt-2">
                Jaringan Grid PLN (Net-Metering)
              </h3>
              <p className="text-2xl font-extrabold text-slate-800 mt-0.5">
                {Math.abs(grid.gridPowerWatts).toLocaleString('id-ID')}{' '}
                <span className="text-sm font-semibold">
                  W {isGridExporting ? '(Ekspor)' : isGridImporting ? '(Impor)' : ''}
                </span>
              </p>

              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                <span>Tarif:</span>
                <span className="font-semibold text-slate-800">Rp 1.444,70 / kWh</span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: BATTERY STORAGE ESS (Full Width Card) */}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full md:w-auto">
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300">
                <BatteryCharging className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold tracking-tight text-white">
                    Penyimpanan Energi Cerdas (Smart ESS LiFePO4)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                    10.0 kWh Bank
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Menyimpan surplus tenaga surya siang hari untuk cadangan malam hari & proteksi mati lampu
                </p>
              </div>
            </div>

            {/* Battery SoC Progress & Stats */}
            <div className="flex items-center gap-5 w-full md:w-auto justify-between md:justify-end">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                  Daya Tersimpan (SoC)
                </span>
                <span className="text-2xl font-black text-emerald-400">
                  {battery.batterySoC}%
                </span>
                <span className="text-[11px] text-slate-300 ml-1.5 font-medium">
                  ({(battery.batteryCapacityKwh * (battery.batterySoC / 100)).toFixed(1)} kWh)
                </span>
              </div>

              {/* Graphical SoC Bar */}
              <div className="w-28 sm:w-36 bg-slate-800 rounded-full h-3.5 p-0.5 border border-slate-700 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${battery.batterySoC}%` }}
                ></div>
              </div>

              <div className="text-right border-l border-slate-700/80 pl-4 hidden sm:block">
                <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">
                  Cadangan Waktu
                </span>
                <span className="text-sm font-bold text-slate-200">
                  ~{battery.backupReserveHours} Jam
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
