import React, { useState } from 'react';
import {
  Cpu,
  Power,
  Sliders,
  Plus,
  Wifi,
  Lock,
  Sparkles,
  Zap,
  CheckCircle,
  AlertTriangle,
  Flame,
  Radio,
  Search,
} from 'lucide-react';
import { SmartDevice, DeviceCategory } from '../types';

interface IotDeviceManagerProps {
  devices: SmartDevice[];
  onToggleDevice: (deviceId: string) => void;
  onToggleDeviceAi: (deviceId: string) => void;
  onOpenAddModal: () => void;
}

export const IotDeviceManager: React.FC<IotDeviceManagerProps> = ({
  devices,
  onToggleDevice,
  onToggleDeviceAi,
  onOpenAddModal,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDevices = devices.filter((device) => {
    const matchesCategory =
      filterCategory === 'all' ||
      (filterCategory === 'high_power' && device.maxWatts >= 1500) ||
      (filterCategory === 'climate' && (device.category === 'ac' || device.category === 'water_heater')) ||
      (filterCategory === 'mosque' && device.category === 'mosque') ||
      device.category === filterCategory;

    const matchesSearch =
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.room.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const totalActiveWatts = devices
    .filter((d) => d.isOn)
    .reduce((acc, d) => acc + d.currentWatts, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
              <Wifi className="w-3.5 h-3.5" />
              <span>Matter • Zigbee 3.0 • Wi-Fi 6 IoT Protocol</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Integrasi Ekosistem Perangkat IoT Pintar Kompatibel
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-0.5">
              Pantau dan kendalikan beban alat elektronik rumah tangga secara langsung dengan telemetri terenkripsi AES-256-GCM.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/15 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">
                Total Beban Aktif IoT
              </span>
              <span className="text-xl font-black text-emerald-400">
                {totalActiveWatts.toLocaleString('id-ID')} <span className="text-xs font-normal">W</span>
              </span>
            </div>

            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Perangkat</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari perangkat atau ruangan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'Semua Perangkat' },
            { id: 'high_power', label: 'Beban Daya Tinggi (≥1.5kW)' },
            { id: 'climate', label: 'Pendingin & Pemanas' },
            { id: 'mosque', label: 'Musholla & Sensor' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* IoT Devices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => {
          const isHeavy = device.maxWatts >= 2000;
          return (
            <div
              key={device.id}
              className={`bg-white rounded-2xl border p-4.5 shadow-xs transition-all relative overflow-hidden ${
                device.isOn
                  ? 'border-emerald-200 shadow-emerald-900/5'
                  : 'border-slate-200/80 bg-slate-50/50 opacity-85'
              }`}
            >
              {/* Top Card Bar */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      device.isOn
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">
                      {device.name}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {device.room}
                    </span>
                  </div>
                </div>

                {/* Power Toggle Switch */}
                <button
                  onClick={() => onToggleDevice(device.id)}
                  title={device.isOn ? 'Matikan Perangkat' : 'Nyalakan Perangkat'}
                  className={`p-2 rounded-xl transition-all active:scale-90 ${
                    device.isOn
                      ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  <Power className="w-4 h-4" />
                </button>
              </div>

              {/* Power Metrics & Gauge */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Daya Real-Time
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span
                      className={`text-xl font-black ${
                        device.isOn ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {device.isOn ? device.currentWatts.toLocaleString('id-ID') : 0}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      / {device.maxWatts} W
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    Total Hari Ini
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {device.dailyKwh.toFixed(1)} kWh
                  </span>
                </div>
              </div>

              {/* Schedule and AI Status */}
              <div className="mt-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="font-semibold text-slate-700">Jadwal Pintar:</span>
                  <span className="text-slate-500 text-[10px] truncate max-w-[170px]" title={device.schedule}>
                    {device.schedule}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-600 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Manajemen AI:
                  </span>
                  <button
                    onClick={() => onToggleDeviceAi(device.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                      device.isAiManaged
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {device.isAiManaged ? 'Aktif (Otomatis)' : 'Manual'}
                  </button>
                </div>
              </div>

              {/* Security & Protocol Footer */}
              <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 font-mono">
                  <Lock className="w-2.5 h-2.5 text-emerald-600" />
                  {device.macAddress}
                </span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                  AES-256 Valid
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
