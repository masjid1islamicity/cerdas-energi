export type InverterStatus = 'Normal' | 'Overload' | 'Warning' | 'Standby';
export type GridStatus = 'Ekspor Bersih' | 'Impor PLN' | 'Seimbang';
export type DeviceCategory = 'solar' | 'battery' | 'ac' | 'ev' | 'water_heater' | 'plug' | 'lighting' | 'mosque';
export type DeviceStatus = 'online' | 'offline' | 'eco_standby';
export type AlertSeverity = 'critical' | 'warning' | 'info';
export type AlertType = 'overconsumption' | 'suspicious' | 'solar_peak' | 'battery_low' | 'system';

export interface SolarTelemetry {
  solarGenerationWatts: number;
  dailySolarYieldKwh: number;
  inverterStatus: InverterStatus;
  inverterEfficiency: number; // e.g. 97.8%
  string1Voltage: number;
  string2Voltage: number;
  inverterTemp: number; // Celsius
  ambientTemp: number;
  dailyPeakWatts: number;
}

export interface BatteryTelemetry {
  batterySoC: number; // percentage 0-100
  batteryPowerWatts: number; // positive = charging, negative = discharging
  batteryHealth: number; // 99%
  backupReserveHours: number;
  batteryCapacityKwh: number;
  currentKwh: number;
  cycleCount: number;
  temp: number;
  isEcoReserveLocked: boolean;
}

export interface GridTelemetry {
  gridPowerWatts: number; // positive = importing from PLN, negative = exporting
  gridVoltage: number;
  frequencyHz: number;
  gridStatus: GridStatus;
  plnTariffPerKwh: number; // Rp
  tariffTier: string;
}

export interface HomeTelemetry {
  homeConsumptionWatts: number;
  peakPowerLimitWatts: number; // Warning threshold e.g. 3500 W
  dangerLimitWatts: number; // e.g. 4400 W
  isOverconsumption: boolean;
  dailyCostRp: number;
  dailyCostWithoutSolarRp: number;
  dailySavingsRp: number;
}

export interface SmartDevice {
  id: string;
  name: string;
  category: DeviceCategory;
  room: string;
  currentWatts: number;
  maxWatts: number;
  status: DeviceStatus;
  isOn: boolean;
  isAiManaged: boolean;
  priority: 'high' | 'medium' | 'low';
  schedule: string;
  dailyKwh: number;
  macAddress: string;
  encryptionStatus: string;
  isSuspicious?: boolean;
}

export interface NotificationAlert {
  id: string;
  timestamp: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  isRead: boolean;
  actionLabel?: string;
  actionPayload?: any;
}

export interface AiRecommendation {
  id: string;
  title: string;
  impact: 'Tinggi' | 'Sedang' | 'Rendah';
  estimatedSavingsRp: number;
  reason: string;
  suggestedDeviceId?: string;
  isApplied?: boolean;
}

export interface WeeklyReportData {
  weekRange: string;
  recipientEmail: string;
  solarHarvestKwh: number;
  gridImportKwh: number;
  gridExportKwh: number;
  totalHomeConsumptionKwh: number;
  totalRupiahSaved: number;
  carbonOffsetKg: number;
  treesEquivalent: number;
  selfSufficiencyScore: number;
  aiRecommendationsExecuted: number;
  islamicStewardshipReflection: string;
  sentAt?: string;
  isSent: boolean;
}

export interface WeatherInfo {
  condition: string;
  temp: number;
  uvIndex: number;
  solarYieldForecast: string;
  icon: string;
}
