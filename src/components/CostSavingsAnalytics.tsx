import React, { useState } from 'react';
import {
  TrendingDown,
  Coins,
  Leaf,
  TreeDeciduous,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { HomeTelemetry, SolarTelemetry } from '../types';

interface CostSavingsAnalyticsProps {
  home: HomeTelemetry;
  solar: SolarTelemetry;
}

export const CostSavingsAnalytics: React.FC<CostSavingsAnalyticsProps> = ({
  home,
  solar,
}) => {
  const [selectedTariff, setSelectedTariff] = useState<number>(1444.7); // Rp / kWh

  // Simulated 7-day savings history
  const weekData = [
    { day: 'Senin', savedRp: 19800, solarKwh: 13.8 },
    { day: 'Selasa', savedRp: 21500, solarKwh: 15.2 },
    { day: 'Rabu', savedRp: 23400, solarKwh: 16.5 },
    { day: 'Kamis', savedRp: 18200, solarKwh: 12.9 },
    { day: 'Jumat', savedRp: 24100, solarKwh: 17.1 },
    { day: 'Sabtu', savedRp: 22800, solarKwh: 16.0 },
    { day: 'Minggu (Hari ini)', savedRp: home.dailySavingsRp, solarKwh: solar.dailySolarYieldKwh, isToday: true },
  ];

  const totalWeekSaved = weekData.reduce((acc, cur) => acc + cur.savedRp, 0);
  const totalWeekSolar = weekData.reduce((acc, cur) => acc + cur.solarKwh, 0);

  const monthlyEst = home.dailySavingsRp * 30;
  const annualEst = home.dailySavingsRp * 365;
  const co2AvoidedKg = (totalWeekSolar * 0.785).toFixed(1); // 0.785 kg CO2 per kWh grid baseline
  const treesEquiv = Math.max(1, Math.round(Number(co2AvoidedKg) / 20));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>Efisiensi Finansial & Keberkahan Energi Berkelanjutan</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Optimasi Penghematan Biaya Operasional Harian
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-0.5">
              Perhitungan akurat penghematan rupiah berdasarkan Tarif Dasar Listrik (TDL) PLN dan pengurangan emisi karbon.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/15 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">
                Penghematan Hari Ini
              </span>
              <span className="text-2xl font-black text-amber-300">
                Rp {home.dailySavingsRp.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards: Daily, Monthly, Annual Savings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hari Ini */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Biaya Nyata Hari Ini</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              -81% Lebih Murah
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-700">
              Rp {home.dailyCostRp.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-400 line-through">
              Rp {home.dailyCostWithoutSolarRp.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Tanpa solar & AI: Rp {home.dailyCostWithoutSolarRp.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Card 2: Proyeksi Bulanan */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Estimasi Hemat 30 Hari</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
            Rp {monthlyEst.toLocaleString('id-ID')}
          </span>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Mengurangi 75% tagihan bulanan PLN
          </p>
        </div>

        {/* Card 3: Proyeksi Tahunan */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Estimasi Hemat 1 Tahun</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
            Rp {annualEst.toLocaleString('id-ID')}
          </span>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            ROI Sistem Solar PV: ~3.8 Tahun
          </p>
        </div>

        {/* Card 4: Jejak Karbon & Pohon */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4.5 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-bold">Dampak Ekologis (Hifz al-Bi'ah)</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-800">
              {co2AvoidedKg} <span className="text-sm">kg CO₂</span>
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-2 font-medium flex items-center gap-1">
            <TreeDeciduous className="w-3.5 h-3.5 text-emerald-600" />
            Setara menanam {treesEquiv} pohon rindang
          </p>
        </div>
      </div>

      {/* Weekly Savings Bar Chart */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Riwayat Penghematan 7 Hari Terakhir
            </h3>
            <p className="text-xs text-slate-500">
              Total Penghematan Mingguan:{' '}
              <span className="font-bold text-emerald-700">
                Rp {totalWeekSaved.toLocaleString('id-ID')}
              </span>{' '}
              ({totalWeekSolar.toFixed(1)} kWh Panen Surya)
            </p>
          </div>

          {/* Tariff Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Skema Tarif PLN:</span>
            <select
              value={selectedTariff}
              onChange={(e) => setSelectedTariff(Number(e.target.value))}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-emerald-600"
            >
              <option value={1444.7}>R-1/TR 1.300 - 2.200 VA (Rp 1.444,70/kWh)</option>
              <option value={1699.53}>R-2/TR 3.500 - 5.500 VA (Rp 1.699,53/kWh)</option>
              <option value={1444.7}>B-1 Bisnis Kecil (Rp 1.444,70/kWh)</option>
            </select>
          </div>
        </div>

        {/* 7-Day Columns */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48">
            {weekData.map((item, idx) => {
              const heightPercent = Math.min(100, Math.round((item.savedRp / 26000) * 100));
              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-emerald-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Rp {Math.round(item.savedRp / 1000)}rb
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 relative ${
                      item.isToday
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md ring-2 ring-emerald-500/30'
                        : 'bg-emerald-200 hover:bg-emerald-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {item.isToday && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white"></span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-2">
                    {item.day.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {item.solarKwh.toFixed(1)} kWh
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
