import React from 'react';
import {
  Sun,
  Battery,
  Zap,
  TrendingUp,
  Thermometer,
  Gauge,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  Calendar,
  CloudSun,
} from 'lucide-react';
import { SolarTelemetry, BatteryTelemetry, WeatherInfo } from '../types';

interface SolarManagementCardProps {
  solar: SolarTelemetry;
  battery: BatteryTelemetry;
  weather: WeatherInfo;
  onToggleReserveLock: () => void;
}

export const SolarManagementCard: React.FC<SolarManagementCardProps> = ({
  solar,
  battery,
  weather,
  onToggleReserveLock,
}) => {
  // Simulated hourly generation curve data
  const hourlyData = [
    { time: '06:00', watts: 150, label: 'Subuh/Terbit' },
    { time: '08:00', watts: 1100, label: 'Pagi' },
    { time: '10:00', watts: 2850, label: 'Mulai Terik' },
    { time: '12:00', watts: 3950, label: 'Puncak Radiasi' },
    { time: '14:00', watts: 3450, label: 'Siang (Aktif)', isCurrent: true },
    { time: '16:00', watts: 1800, label: 'Sore' },
    { time: '18:00', watts: 200, label: 'Maghrib' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Highlight Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold border border-white/30 mb-2">
              <Sun className="w-3.5 h-3.5 text-amber-200" />
              <span>Sistem Manajemen Panel Surya UPIC (On-Grid Hybrid)</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight">
              Produksi Energi Bersih Mandiri & Berkelanjutan
            </h2>
            <p className="text-xs text-amber-100 max-w-xl mt-1">
              Memaksimalkan karunia sinar mentari dengan teknologi MPPT dual-string dan efisiensi inverter {solar.inverterEfficiency}% untuk kemandirian energi rumah tangga Islami.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md px-5 py-3.5 rounded-xl border border-white/20">
            <div>
              <span className="text-[10px] text-amber-100 uppercase font-bold tracking-wider block">
                Total Panen Hari Ini
              </span>
              <span className="text-3xl font-black text-white">
                {solar.dailySolarYieldKwh.toFixed(1)} <span className="text-base font-semibold">kWh</span>
              </span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div>
              <span className="text-[10px] text-amber-100 uppercase font-bold tracking-wider block">
                Estimasi Harian
              </span>
              <span className="text-sm font-bold text-white">18.5 kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Cards: Inverter Health & Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: String 1 Voltage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">String PV 1 (Atap Depan)</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-slate-800">
            {solar.string1Voltage} <span className="text-xs font-normal text-slate-500">Volt DC</span>
          </p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Kondisi Sel Surya Optimal
          </div>
        </div>

        {/* Metric 2: String 2 Voltage */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">String PV 2 (Atap Belakang)</span>
            <Sun className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-xl font-bold text-slate-800">
            {solar.string2Voltage} <span className="text-xs font-normal text-slate-500">Volt DC</span>
          </p>
          <div className="mt-2 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Sudut Penyinaran 15° Presisi
          </div>
        </div>

        {/* Metric 3: Inverter Thermal */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Suhu Inverter & Radiator</span>
            <Thermometer className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-xl font-bold text-slate-800">
            {solar.inverterTemp}°C <span className="text-xs font-normal text-slate-500">/ 65°C Maks</span>
          </p>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Pendingin Aktif: Senyap & Dingin
          </div>
        </div>

        {/* Metric 4: Battery Health */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Kesehatan Sel Baterai (SoH)</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-800">
            {battery.batteryHealth}% <span className="text-xs font-normal text-emerald-600 font-semibold">(Grade A+)</span>
          </p>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            Siklus: {battery.cycleCount} dari 6.000 siklus
          </div>
        </div>
      </div>

      {/* Hourly Generation Chart & Battery Deep Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Solar Curve */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Profil Kurva Radiasi Surya Hari Ini (06:00 - 18:00 WIB)
              </h3>
              <p className="text-xs text-slate-500">
                Data telemetri produksi daya per 2 jam real-time
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              <CloudSun className="w-3.5 h-3.5" />
              <span>{weather.solarYieldForecast}</span>
            </div>
          </div>

          {/* Bar / Column Chart Representation */}
          <div className="pt-6 pb-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48">
              {hourlyData.map((item, idx) => {
                const heightPercent = Math.min(100, Math.round((item.watts / 4200) * 100));
                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <span className="text-[10px] font-bold text-slate-600 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.watts}W
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 relative ${
                        item.isCurrent
                          ? 'bg-gradient-to-t from-emerald-600 to-amber-400 shadow-md ring-2 ring-emerald-500/30'
                          : 'bg-gradient-to-t from-amber-200 to-amber-400 hover:from-amber-300 hover:to-amber-500'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {item.isCurrent && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white"></span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-2">
                      {item.time}
                    </span>
                    <span className="text-[9px] text-slate-400 hidden sm:block truncate max-w-[50px]">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Battery ESS Settings & Protection */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">
                Konfigurasi Cadangan Baterai
              </h3>
              <Battery className="w-4 h-4 text-teal-600" />
            </div>

            <div className="mt-4 space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <span className="text-xs font-semibold text-slate-700 block">
                  Kapasitas Saat Ini:
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-2xl font-black text-emerald-700">
                    {battery.batterySoC}%
                  </span>
                  <span className="text-xs text-slate-500">
                    {(battery.batteryCapacityKwh * (battery.batterySoC / 100)).toFixed(1)} / {battery.batteryCapacityKwh} kWh
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Proteksi Cadangan Darurat (30%)
                    </span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">
                      Kunci cadangan minimal untuk lampu ibadah & kulkas saat pemadaman
                    </span>
                  </div>
                  <button
                    onClick={onToggleReserveLock}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      battery.isEcoReserveLocked ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        battery.isEcoReserveLocked ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI secara otomatis beralih ke baterai pada jam 17:00 - 21:00 WIB</span>
          </div>
        </div>
      </div>
    </div>
  );
};
