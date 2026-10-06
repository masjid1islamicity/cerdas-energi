import React, { useState } from 'react';
import {
  X,
  Cpu,
  Wifi,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { SmartDevice, DeviceCategory } from '../types';
import { soundFx } from '../utils/soundEffects';

interface AddDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDevice: (device: SmartDevice) => void;
}

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({
  isOpen,
  onClose,
  onAddDevice,
}) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('Ruang Tamu');
  const [category, setCategory] = useState<DeviceCategory>('plug');
  const [maxWatts, setMaxWatts] = useState<number>(1500);
  const [protocol, setProtocol] = useState<'matter' | 'zigbee' | 'wifi'>('matter');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Generate random valid hex MAC address
    const randomMac = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
    ).join(':');

    const newDevice: SmartDevice = {
      id: `dev-${Date.now()}`,
      name: name.trim(),
      category,
      room,
      currentWatts: Math.round(maxWatts * 0.4),
      maxWatts: Number(maxWatts) || 1200,
      status: 'online',
      isOn: true,
      isAiManaged: true,
      priority: maxWatts >= 2000 ? 'high' : 'medium',
      schedule: 'Manajemen AI Mandiri',
      dailyKwh: 0.8,
      macAddress: randomMac,
      encryptionStatus: 'AES-256-GCM Secure',
    };

    onAddDevice(newDevice);
    setIsSuccess(true);
    soundFx.playSuccessChime();

    setTimeout(() => {
      setIsSuccess(false);
      setName('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-4.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <Cpu className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Integrasi Perangkat IoT Baru
              </h3>
              <p className="text-[11px] text-emerald-100">
                Protokol Kompatibel Matter • Zigbee 3.0 • Wi-Fi 6
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">
              Perangkat Berhasil Diintegrasikan!
            </h4>
            <p className="text-xs text-slate-500">
              Kunci enkripsi AES-256-GCM telah dipasangkan ke sistem UPIC.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nama Perangkat:
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Smart AC Kamar Anak, Pompa Kolam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Kategori:
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DeviceCategory)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                >
                  <option value="ac">Smart AC / Pendingin</option>
                  <option value="water_heater">Water Heater / Pemanas</option>
                  <option value="ev">EV Charger Kendaraan</option>
                  <option value="plug">Smart Plug Stopkontak</option>
                  <option value="lighting">Penerangan / Lampu</option>
                  <option value="mosque">Sensor Musholla / Ibadah</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Ruangan:
                </label>
                <input
                  type="text"
                  required
                  value={room}
                  onChange={(e) => setRoom(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                  placeholder="Ruang Tamu / Dapur"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Daya Maksimum (Watt):
                </label>
                <input
                  type="number"
                  min={10}
                  max={8000}
                  value={maxWatts}
                  onChange={(e) => setMaxWatts(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Protokol Jaringan:
                </label>
                <select
                  value={protocol}
                  onChange={(e) => setProtocol(e.target.value as any)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-emerald-800"
                >
                  <option value="matter">Matter Universal</option>
                  <option value="zigbee">Zigbee 3.0 Mesh</option>
                  <option value="wifi">Wi-Fi 6 WPA3-Personal</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-[11px] text-emerald-900 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-700 flex-shrink-0" />
              <span>Otomatis memverifikasi sertifikat kriptografi AES-256-GCM perangkat.</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-bold rounded-xl text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-transform active:scale-95 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pasangkan Sekarang</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
