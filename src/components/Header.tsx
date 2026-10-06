import React, { useState } from 'react';
import {
  Sun,
  ShieldCheck,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Cpu,
  TrendingDown,
  Mail,
  Lock,
  ChevronDown,
  Clock,
  CloudSun,
} from 'lucide-react';
import { WeatherInfo, NotificationAlert } from '../types';
import { soundFx } from '../utils/soundEffects';

interface HeaderProps {
  weather: WeatherInfo;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alerts: NotificationAlert[];
  onOpenAlerts: () => void;
  isOverconsumption: boolean;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  weather,
  activeTab,
  setActiveTab,
  alerts,
  onOpenAlerts,
  isOverconsumption,
  onOpenReportModal,
}) => {
  const [isMuted, setIsMuted] = useState(soundFx.getMuted());
  const unreadAlerts = alerts.filter((a) => !a.isRead).length;

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundFx.setMuted(next);
  };

  const navTabs = [
    { id: 'dashboard', label: 'Dasbor Utama', icon: Zap },
    { id: 'solar', label: 'Panel Surya & ESS', icon: Sun },
    { id: 'ai-efficiency', label: 'Otomatisasi AI', icon: Sparkles },
    { id: 'devices', label: 'Perangkat IoT', icon: Cpu },
    { id: 'analytics', label: 'Analitik & Biaya', icon: TrendingDown },
    { id: 'weekly-report', label: 'Laporan Mingguan', icon: Mail },
    { id: 'security', label: 'Enkripsi & Keamanan', icon: Lock },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            UPIC Islamicity
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Unit Pelayanan Islamicity • Hifz al-Bi'ah & Penghematan Energi Cerdas
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-300">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>{weather.temp}°C {weather.condition}</span>
            <span className="hidden md:inline text-slate-400">• Indeks UV: {weather.uvIndex}</span>
          </div>

          <div className="h-3 w-px bg-slate-700 hidden sm:block"></div>

          <div className="flex items-center gap-1.5 text-emerald-300 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Enkripsi AES-256-GCM Aktif</span>
            <span className="sm:hidden">AES-256</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-md shadow-emerald-900/10 border border-emerald-400/20 group">
              <Sun className="w-6 h-6 text-amber-300 animate-spin-slow" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  UPIC <span className="text-emerald-700 font-extrabold">Rumah Cerdas Energi</span>
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  v3.8 AI
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Sistem Manajemen Panel Surya, Efisiensi AI & Privasi Berkelanjutan
              </p>
            </div>
          </div>

          {/* Quick Action Badges & Alerts */}
          <div className="flex items-center gap-2.5">
            {/* Audio chime toggle */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Nyalakan Notifikasi Suara' : 'Senyapkan Notifikasi Suara'}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80"
              aria-label="Toggle mute"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-slate-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              )}
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/80 flex items-center gap-1.5"
              aria-label="Pusat Notifikasi"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts > 0 && (
                <span className="flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {/* Direct Send Weekly Report button */}
            <button
              onClick={onOpenReportModal}
              className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-xs"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-600" />
              <span>Kirim Laporan Mingguan</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <div className="mt-3 flex items-center space-x-1 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-2">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-200' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
