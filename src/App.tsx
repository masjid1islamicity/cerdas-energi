import React, { useState, useEffect } from 'react';
import {
  Sun,
  Zap,
  Sparkles,
  TrendingDown,
  Cpu,
  Mail,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Bell,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Activity,
  Layers,
} from 'lucide-react';
import {
  INITIAL_WEATHER,
  INITIAL_SOLAR,
  INITIAL_BATTERY,
  INITIAL_GRID,
  INITIAL_HOME,
  INITIAL_DEVICES,
  INITIAL_ALERTS,
  INITIAL_WEEKLY_REPORT,
} from './data/mockData';
import {
  SolarTelemetry,
  BatteryTelemetry,
  GridTelemetry,
  HomeTelemetry,
  SmartDevice,
  NotificationAlert,
  WeeklyReportData,
  AiRecommendation,
} from './types';
import { Header } from './components/Header';
import { OverconsumptionAlertBanner } from './components/OverconsumptionAlertBanner';
import { EnergyFlowVisualizer } from './components/EnergyFlowVisualizer';
import { SolarManagementCard } from './components/SolarManagementCard';
import { AiEnergyAdvisor } from './components/AiEnergyAdvisor';
import { IotDeviceManager } from './components/IotDeviceManager';
import { CostSavingsAnalytics } from './components/CostSavingsAnalytics';
import { WeeklyReportModal } from './components/WeeklyReportModal';
import { SecurityEncryptionCenter } from './components/SecurityEncryptionCenter';
import { AddDeviceModal } from './components/AddDeviceModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { soundFx } from './utils/soundEffects';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [weather, setWeather] = useState(INITIAL_WEATHER);
  const [solar, setSolar] = useState<SolarTelemetry>(INITIAL_SOLAR);
  const [battery, setBattery] = useState<BatteryTelemetry>(INITIAL_BATTERY);
  const [grid, setGrid] = useState<GridTelemetry>(INITIAL_GRID);
  const [home, setHome] = useState<HomeTelemetry>(INITIAL_HOME);
  const [devices, setDevices] = useState<SmartDevice[]>(INITIAL_DEVICES);
  const [alerts, setAlerts] = useState<NotificationAlert[]>(INITIAL_ALERTS);
  const [weeklyReport, setWeeklyReport] = useState<WeeklyReportData>(INITIAL_WEEKLY_REPORT);

  // Modals and Drawer
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [isAiAutoPilot, setIsAiAutoPilot] = useState(true);
  const [activeScenario, setActiveScenario] = useState<string>('peak_solar');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Recalculate total home consumption and grid flow whenever devices change
  const recalculateEnergySystem = (updatedDevices: SmartDevice[], currentSolarWatts = solar.solarGenerationWatts) => {
    const activeLoad = updatedDevices
      .filter((d) => d.isOn)
      .reduce((acc, d) => acc + d.currentWatts, 0);

    const netBalance = currentSolarWatts - activeLoad;
    let newBatteryPower = 0;
    let newGridPower = 0;
    let newGridStatus: GridTelemetry['gridStatus'] = 'Seimbang';

    if (netBalance > 0) {
      // Surplus: charge battery first up to 1200W, rest to grid
      newBatteryPower = Math.min(netBalance, 1200);
      newGridPower = -(netBalance - newBatteryPower); // Negative = export
      newGridStatus = newGridPower < -50 ? 'Ekspor Bersih' : 'Seimbang';
    } else {
      // Deficit: discharge battery if SoC > 30%
      const deficit = Math.abs(netBalance);
      if (battery.batterySoC > 30) {
        newBatteryPower = -Math.min(deficit, 1500); // Negative = discharge
        const remainingDeficit = deficit - Math.abs(newBatteryPower);
        newGridPower = remainingDeficit;
        newGridStatus = newGridPower > 50 ? 'Impor PLN' : 'Seimbang';
      } else {
        newBatteryPower = 0;
        newGridPower = deficit;
        newGridStatus = 'Impor PLN';
      }
    }

    const isOver = activeLoad > home.peakPowerLimitWatts;

    setHome((prev) => {
      const dailyKwh = (activeLoad * 8) / 1000;
      const costToday = Math.round(dailyKwh * 1444.7 * (currentSolarWatts > 1000 ? 0.2 : 0.8));
      const costWithoutSolar = Math.round(dailyKwh * 1444.7);
      return {
        ...prev,
        homeConsumptionWatts: activeLoad,
        isOverconsumption: isOver,
        dailyCostRp: Math.max(3000, costToday),
        dailyCostWithoutSolarRp: Math.max(18000, costWithoutSolar),
        dailySavingsRp: Math.max(5000, costWithoutSolar - costToday),
      };
    });

    setBattery((prev) => ({
      ...prev,
      batteryPowerWatts: newBatteryPower,
    }));

    setGrid((prev) => ({
      ...prev,
      gridPowerWatts: Math.round(newGridPower),
      gridStatus: newGridStatus,
    }));

    // Trigger audio chime if newly exceeding limit
    if (isOver && !home.isOverconsumption) {
      soundFx.playWarningAlert();
    }
  };

  // Scenario Simulator
  const handleSetScenario = (scenario: 'peak_solar' | 'cloudy' | 'evening_peak' | 'overload' | 'night_eco') => {
    setActiveScenario(scenario);

    if (scenario === 'peak_solar') {
      setSolar((prev) => ({ ...prev, solarGenerationWatts: 3850 }));
      const updated = devices.map((d) =>
        d.id === 'dev-water-heater' ? { ...d, isOn: true, currentWatts: 950 } : d
      );
      setDevices(updated);
      recalculateEnergySystem(updated, 3850);
      showToast('Simulasi Siang Cerah: Radiasi matahari maksimal, memanaskan water heater & mengekspor ke PLN.');
    } else if (scenario === 'evening_peak') {
      setSolar((prev) => ({ ...prev, solarGenerationWatts: 0 }));
      const updated = devices.map((d) =>
        d.id === 'dev-smart-led' ? { ...d, isOn: true, currentWatts: 90 } : d
      );
      setDevices(updated);
      recalculateEnergySystem(updated, 0);
      showToast('Simulasi Jam Beban Puncak (WBP 18:00 WIB): Solar padam, Baterai ESS aktif memasok rumah.');
    } else if (scenario === 'overload') {
      // Simulate overconsumption by turning on heavy loads (AC + EV + Water Heater)
      const updated = devices.map((d) => {
        if (d.id === 'dev-ev-wallbox') return { ...d, isOn: true, currentWatts: 2400 };
        if (d.id === 'dev-water-heater') return { ...d, isOn: true, currentWatts: 1200 };
        if (d.id === 'dev-ac-living') return { ...d, isOn: true, currentWatts: 900 };
        return d;
      });
      setDevices(updated);
      recalculateEnergySystem(updated, 1500);
      soundFx.playWarningAlert();

      // Push real-time alert to alerts list
      const newAlert: NotificationAlert = {
        id: `alt-overload-${Date.now()}`,
        timestamp: 'Baru saja',
        type: 'overconsumption',
        severity: 'critical',
        title: 'Peringatan Bahaya Beban Puncak Terlampaui',
        message: 'Konsumsi rumah melonjak di atas 4.000 Watt. Segera aktifkan AI Shedding untuk mencegah pemadaman sekering MCB.',
        isRead: false,
        actionLabel: 'Pangkas Beban Sekarang',
      };
      setAlerts((prev) => [newAlert, ...prev]);
      showToast('Simulasi Beban Berlebih diaktifkan! Peringatan konsumsi listrik berlebih muncul.');
    } else if (scenario === 'night_eco') {
      setSolar((prev) => ({ ...prev, solarGenerationWatts: 0 }));
      const updated = devices.map((d) => {
        if (d.id === 'dev-ev-wallbox' || d.id === 'dev-water-heater') return { ...d, isOn: false, currentWatts: 0 };
        if (d.id === 'dev-ac-living') return { ...d, isOn: true, currentWatts: 450 }; // Eco temp
        return d;
      });
      setDevices(updated);
      recalculateEnergySystem(updated, 0);
      showToast('Simulasi Malam Mode Hemat: Beban non-kritis dimatikan, AC masuk ke mode suhu optimal.');
    }
  };

  // AI Load Shedding Execution
  const handleAutoShedLoad = () => {
    const updated = devices.map((d) => {
      // Shed low-priority and heavy devices
      if (d.category === 'ev' || d.category === 'water_heater' || d.id === 'dev-smart-led') {
        return { ...d, isOn: false, currentWatts: 0 };
      }
      if (d.category === 'ac') {
        return { ...d, currentWatts: 480 }; // Throttle AC compressor
      }
      return d;
    });

    setDevices(updated);
    recalculateEnergySystem(updated);
    soundFx.playSuccessChime();
    showToast('AI Shedding Berhasil: Beban sekunder dimatikan. Konsumsi listrik kembali ke zona aman.');
  };

  // Toggle single device on/off
  const handleToggleDevice = (deviceId: string) => {
    const updated = devices.map((d) => {
      if (d.id === deviceId) {
        const nextState = !d.isOn;
        return {
          ...d,
          isOn: nextState,
          currentWatts: nextState ? Math.round(d.maxWatts * 0.6) : 0,
        };
      }
      return d;
    });
    setDevices(updated);
    recalculateEnergySystem(updated);
  };

  const handleToggleDeviceAi = (deviceId: string) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, isAiManaged: !d.isAiManaged } : d))
    );
  };

  const handleAddDevice = (newDevice: SmartDevice) => {
    const updated = [...devices, newDevice];
    setDevices(updated);
    recalculateEnergySystem(updated);
    showToast(`Perangkat "${newDevice.name}" berhasil ditambahkan & diamankan dengan AES-256-GCM.`);
  };

  // Trigger test suspicious activity
  const handleTriggerSuspiciousTest = () => {
    soundFx.playSecurityAlert();
    const newAlert: NotificationAlert = {
      id: `alt-susp-${Date.now()}`,
      timestamp: 'Baru Saja',
      type: 'suspicious',
      severity: 'critical',
      title: 'Aktivitas Mencurigakan: Percobaan Intrusi Sensor Port 8080',
      message: 'Perangkat tidak dikenal berusaha membaca telemetri rumah tanpa handshake AES-256-GCM yang sah. Port langsung dikarantina.',
      isRead: false,
      actionLabel: 'Lihat Analisis Keamanan',
    };
    setAlerts((prev) => [newAlert, ...prev]);
    setActiveTab('security');
    showToast('Peringatan Keamanan Real-Time! Intrusi disimulasikan & sistem otomatis melakukan karantina.');
  };

  const handleApplyAiRecommendation = (rec: AiRecommendation) => {
    if (rec.suggestedDeviceId) {
      const updated = devices.map((d) => {
        if (d.id === rec.suggestedDeviceId) {
          if (rec.id.includes('shift')) return { ...d, isOn: true, currentWatts: 850 };
          if (rec.id.includes('eco')) return { ...d, currentWatts: 480 };
          if (rec.id.includes('ev')) return { ...d, isOn: false, currentWatts: 0 };
        }
        return d;
      });
      setDevices(updated);
      recalculateEnergySystem(updated);
    }
    showToast(`Rekomendasi AI "${rec.title}" telah diterapkan.`);
  };

  const handleMarkAllAlertsAsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, isRead: true })));
    showToast('Semua notifikasi ditandai telah dibaca.');
  };

  const handleAlertActionClick = (alert: NotificationAlert) => {
    if (alert.type === 'overconsumption') {
      handleAutoShedLoad();
    } else if (alert.type === 'suspicious') {
      setActiveTab('security');
    }
    setIsAlertsDrawerOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span className="flex-1">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Main App Header */}
      <Header
        weather={weather}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        alerts={alerts}
        onOpenAlerts={() => setIsAlertsDrawerOpen(true)}
        isOverconsumption={home.isOverconsumption}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Real-Time Overconsumption Sticky Alert Banner */}
      <OverconsumptionAlertBanner
        home={home}
        onAutoShedLoad={handleAutoShedLoad}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: DASBOR UTAMA */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Energy Flow Diagram */}
            <EnergyFlowVisualizer
              solar={solar}
              battery={battery}
              grid={grid}
              home={home}
              onSetScenario={handleSetScenario}
              activeScenario={activeScenario}
            />

            {/* Quick Dual Cards: AI Advisor Teaser & Cost Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: AI Quick Efficiency Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-bold">Otomatisasi Efisiensi AI Real-Time</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Eco-Score: 91/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Sistem mendeteksi surplus listrik surya. Pindahkan pengisian daya alat berat ke jam siang ini untuk memaksimalkan swasembada 100% tanpa biaya PLN.
                  </p>
                  <div className="mt-3 p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-900 font-medium">
                    "Dan janganlah kamu berbuat boros..." (QS. Al-A'raf: 31) — Hemat energi sebagai amanah lingkungan.
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-700">
                    Potensi hemat harian: Rp 21.600
                  </span>
                  <button
                    onClick={() => setActiveTab('ai-efficiency')}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900"
                  >
                    <span>Buka Panel AI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right: Quick Weekly Report Teaser */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-slate-800">
                      <Mail className="w-4 h-4 text-emerald-600" />
                      <h3 className="text-sm font-bold">Laporan Mingguan ke Email</h3>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      Terkirim Otomatis
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                    Laporan efisiensi energi otomatis siap dikirimkan langsung ke{' '}
                    <strong className="text-slate-800 font-semibold">{weeklyReport.recipientEmail}</strong> setiap Senin pukul 07:00 WIB.
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block">Total Panen</span>
                      <span className="font-extrabold text-emerald-700">128.4 kWh</span>
                    </div>
                    <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 block">Total Hemat</span>
                      <span className="font-extrabold text-amber-700">Rp 168.500</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">
                    Status: {weeklyReport.isSent ? 'Terkirim Minggu Ini' : 'Siap Kirim'}
                  </span>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-900"
                  >
                    <span>Kirim / Pratinjau Email</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PANEL SURYA & ESS */}
        {activeTab === 'solar' && (
          <SolarManagementCard
            solar={solar}
            battery={battery}
            weather={weather}
            onToggleReserveLock={() => {
              setBattery((prev) => ({
                ...prev,
                isEcoReserveLocked: !prev.isEcoReserveLocked,
              }));
              showToast('Proteksi cadangan baterai 30% diperbarui.');
            }}
          />
        )}

        {/* TAB 3: OTOMATISASI AI */}
        {activeTab === 'ai-efficiency' && (
          <AiEnergyAdvisor
            solar={solar}
            home={home}
            devices={devices}
            weather={weather}
            onApplyAction={handleApplyAiRecommendation}
            isAiAutoPilot={isAiAutoPilot}
            onToggleAiAutoPilot={() => {
              const next = !isAiAutoPilot;
              setIsAiAutoPilot(next);
              showToast(
                next
                  ? 'Mode AI Auto-Pilot diaktifkan: Sistem akan menyesuaikan beban secara mandiri.'
                  : 'Mode AI Auto-Pilot dimatikan: Rekomendasi memerlukan konfirmasi manual.'
              );
            }}
          />
        )}

        {/* TAB 4: PERANGKAT IOT */}
        {activeTab === 'devices' && (
          <IotDeviceManager
            devices={devices}
            onToggleDevice={handleToggleDevice}
            onToggleDeviceAi={handleToggleDeviceAi}
            onOpenAddModal={() => setIsAddDeviceOpen(true)}
          />
        )}

        {/* TAB 5: ANALITIK & PENGHEMATAN BIAYA */}
        {activeTab === 'analytics' && (
          <CostSavingsAnalytics
            home={home}
            solar={solar}
          />
        )}

        {/* TAB 6: LAPORAN MINGGUAN EMAIL */}
        {activeTab === 'weekly-report' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Pengiriman Otomatis Terjadwal
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Laporan Efisiensi Energi Mingguan ke Email Anda
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Laporan dikirimkan otomatis ke alamat email pengguna: <strong>{weeklyReport.recipientEmail}</strong>
                </p>
              </div>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
              >
                <Mail className="w-4 h-4 text-emerald-300" />
                <span>Kirim & Pratinjau Laporan Email</span>
              </button>
            </div>

            <CostSavingsAnalytics home={home} solar={solar} />
          </div>
        )}

        {/* TAB 7: ENKRIPSI & KEAMANAN */}
        {activeTab === 'security' && (
          <SecurityEncryptionCenter
            onTriggerSuspiciousTest={handleTriggerSuspiciousTest}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-700 text-white flex items-center justify-center font-bold text-[10px]">
              U
            </div>
            <span className="font-semibold text-slate-800">
              UPIC Unit Pelayanan Islamicity
            </span>
            <span>• Platform Rumah Cerdas Energi & Keberlanjutan Islami</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" /> Enkripsi AES-256-GCM Terverifikasi
            </span>
            <span>•</span>
            <span>Hifz al-Bi'ah & Amanah Energi</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <WeeklyReportModal
        report={weeklyReport}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onUpdateReport={(updated) => {
          setWeeklyReport(updated);
          showToast(`Laporan mingguan berhasil dikirim ke ${updated.recipientEmail}!`);
        }}
      />

      <AddDeviceModal
        isOpen={isAddDeviceOpen}
        onClose={() => setIsAddDeviceOpen(false)}
        onAddDevice={handleAddDevice}
      />

      <NotificationDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        alerts={alerts}
        onMarkAllAsRead={handleMarkAllAlertsAsRead}
        onActionClick={handleAlertActionClick}
      />
    </div>
  );
}
