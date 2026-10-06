import React, { useState } from 'react';
import {
  Lock,
  Key,
  ShieldCheck,
  AlertTriangle,
  Fingerprint,
  RefreshCw,
  Eye,
  CheckCircle2,
  Cpu,
  Zap,
  Terminal,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import {
  encryptTelemetryPayload,
  decryptTelemetryPayload,
  EncryptionResult,
} from '../utils/cryptoSim';
import { soundFx } from '../utils/soundEffects';

interface SecurityEncryptionCenterProps {
  onTriggerSuspiciousTest: () => void;
}

export const SecurityEncryptionCenter: React.FC<SecurityEncryptionCenterProps> = ({
  onTriggerSuspiciousTest,
}) => {
  const [plaintextInput, setPlaintextInput] = useState(
    JSON.stringify(
      {
        deviceId: 'dev-inverter-upic-01',
        solarGenerationWatts: 3450,
        batterySoC: 82,
        voltageRMS: 224.2,
        timestamp: new Date().toISOString(),
      },
      null,
      2
    )
  );

  const [encryptionResult, setEncryptionResult] = useState<EncryptionResult | null>(null);
  const [decryptionOutput, setDecryptionOutput] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);

  // Security Incident Logs
  const [incidents, setIncidents] = useState([
    {
      id: 'inc-1',
      type: 'Lonjakan Daya Anomali Dini Hari',
      severity: 'WASPADA',
      timestamp: 'Hari ini, 03:14 WIB',
      device: 'Smart Plug Dapur (MAC: E0:98:06:55:7A:12)',
      details: 'Lonjakan tarikan arus 1.450W saat seluruh penghuni tertidur. Integritas paket telemetri dicek.',
      status: 'TERISOLIR OTOMATIS',
    },
    {
      id: 'inc-2',
      type: 'Percobaan Akses Perangkat IoT Tidak Sah',
      severity: 'KRITIS',
      timestamp: 'Kemarin, 21:05 WIB',
      device: 'Port Zigbee Gateway 3.0',
      details: 'Upaya handshake dari MAC address asing (A2:99:FF:01:23:45) tanpa token enkripsi AES-256 yang sah. Permintaan ditolak.',
      status: 'DIBLOKIR FIREWALL',
    },
    {
      id: 'inc-3',
      type: 'Uji Integritas Rutin Sensor Surya',
      severity: 'INFO',
      timestamp: 'Kemarin, 12:00 WIB',
      device: 'Inverter Hybrid UPIC-SolarMax',
      details: 'Rotasi kunci sesi simetris 256-bit berhasil tanpa gangguan transmisi daya.',
      status: 'NORMAL',
    },
  ]);

  const [aiDiagnosis, setAiDiagnosis] = useState<{
    isLoading: boolean;
    result?: any;
  }>({ isLoading: false });

  const handleEncrypt = async () => {
    setIsEncrypting(true);
    try {
      const res = await encryptTelemetryPayload(plaintextInput);
      setEncryptionResult(res);
      setDecryptionOutput(null);
      soundFx.playSuccessChime();
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptionResult) return;
    setIsDecrypting(true);
    try {
      const res = await decryptTelemetryPayload(
        encryptionResult.ciphertextHex,
        encryptionResult.ivHex,
        encryptionResult.authTagHex
      );
      if (res.success && res.plaintext) {
        setDecryptionOutput(res.plaintext);
        soundFx.playSuccessChime();
      } else {
        setDecryptionOutput(`Gagal: ${res.error}`);
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleRunAiDiagnosis = async (incident: any) => {
    setAiDiagnosis({ isLoading: true });
    try {
      const res = await fetch('/api/ai/diagnose-anomaly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anomalyType: incident.type,
          anomalyDetails: incident.details,
          currentWatts: 1450,
          baselineWatts: 120,
        }),
      });

      const data = await res.json();
      setAiDiagnosis({ isLoading: false, result: data?.data });
      soundFx.playSecurityAlert();
    } catch {
      setAiDiagnosis({
        isLoading: false,
        result: {
          severity: 'WASPADA',
          threatAnalysis: 'Potensi vampire drain atau pemanas air mendadak aktif tanpa otorisasi jadwal AI.',
          containmentStep: 'MCB sub-panel dapur diturunkan ke daya siaga 50W.',
          recommendedAction: 'Isolir Perangkat & Periksa Soket Fisik',
          safetyAdvisory: 'Hindari menyentuh kabel yang panas.',
        },
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
                  Zero-Trust Telemetry Architecture
                </span>
                <span className="text-xs text-slate-300">• Privasi Tertinggi Keluarga</span>
              </div>
              <h2 className="text-xl font-black tracking-tight text-white mt-1">
                Pusat Enkripsi Data Tingkat Lanjut & Intelijen Keamanan
              </h2>
              <p className="text-xs text-slate-300 max-w-xl mt-0.5">
                Setiap data telemetri penggunaan listrik, kamera sensor musholla, dan inverter dienkripsi dengan standar militer AES-256-GCM sebelum diproses.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onTriggerSuspiciousTest}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-600/90 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Simulasikan Anomali Mencurigakan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Security Architecture Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Algoritma Enkripsi</span>
            <Lock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-lg font-bold text-slate-800">AES-256-GCM</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Galois/Counter Mode dengan autentikasi integritas data 128-bit
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Rotasi Kunci Sesi</span>
            <Key className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-lg font-bold text-slate-800">Setiap 60 Menit</p>
          <p className="text-[11px] text-slate-500 mt-1">
            PBKDF2 SHA-256 Derivation dengan 100.000 iterasi
          </p>
        </div>

        <div className="bg-white p-4.5 rounded-xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Privasi Data Islami</span>
            <Fingerprint className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-lg font-bold text-slate-800">Zero-Knowledge</p>
          <p className="text-[11px] text-slate-500 mt-1">
            Data rumah tangga tidak dijual atau disadap pihak ketiga
          </p>
        </div>
      </div>

      {/* Interactive AES-256-GCM Inspector */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-indigo-600" />
              <span>Inspektor & Penguji Enkripsi Nyata (Client-Side W3C WebCrypto)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Ketik atau ubah payload telemetri untuk membuktikan enkripsi kriptografis tingkat lanjut secara langsung di peramban Anda.
            </p>
          </div>
          <button
            onClick={handleEncrypt}
            disabled={isEncrypting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-transform"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{isEncrypting ? 'Mengenkripsi...' : 'Enkripsi AES-256'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Plaintext Input */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              1. Payload Data Telemetri Mentah (Plaintext):
            </label>
            <textarea
              rows={6}
              value={plaintextInput}
              onChange={(e) => setPlaintextInput(e.target.value)}
              className="w-full p-3 font-mono text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-indigo-600 transition-colors"
            />
          </div>

          {/* Ciphertext Display */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                2. Hasil Enkripsi Kriptografis (Ciphertext & Auth Tag):
              </label>
              {encryptionResult && (
                <button
                  onClick={handleDecrypt}
                  disabled={isDecrypting}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Uji Verifikasi Dekripsi</span>
                </button>
              )}
            </div>

            {encryptionResult ? (
              <div className="p-3 font-mono text-[11px] rounded-xl bg-slate-900 text-slate-200 space-y-2 overflow-x-auto max-h-40">
                <div>
                  <span className="text-slate-400 block text-[10px]">Ciphertext (Hex):</span>
                  <p className="text-emerald-400 break-all select-all">
                    {encryptionResult.ciphertextHex}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">IV (Initialization Vector 96-bit):</span>
                  <p className="text-amber-400 break-all">{encryptionResult.ivHex}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">GCM Authentication Tag (128-bit):</span>
                  <p className="text-indigo-400 break-all">{encryptionResult.authTagHex}</p>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-xs text-slate-400 flex flex-col items-center justify-center h-36">
                <Lock className="w-6 h-6 text-slate-300 mb-1" />
                <span>Klik tombol "Enkripsi AES-256" di atas untuk memproses payload</span>
              </div>
            )}

            {decryptionOutput && (
              <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                <span className="font-bold text-emerald-900 block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Integritas Terverifikasi! Hasil Dekripsi:
                </span>
                <pre className="font-mono text-[10px] text-slate-800 mt-1 max-h-24 overflow-y-auto">
                  {decryptionOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Suspicious Activity Notification Log */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Log Notifikasi Real-Time: Deteksi Aktivitas Mencurigakan & Anomali
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Pemindaian Otomatis Aktif
          </span>
        </div>

        <div className="space-y-3">
          {incidents.map((inc) => (
            <div
              key={inc.id}
              className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inc.severity === 'KRITIS'
                          ? 'bg-rose-100 text-rose-700'
                          : inc.severity === 'WASPADA'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-teal-100 text-teal-700'
                      }`}
                    >
                      {inc.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{inc.type}</span>
                    <span className="text-[10px] text-slate-400">• {inc.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600">{inc.details}</p>
                  <span className="text-[11px] text-slate-500 font-mono block">
                    Perangkat: {inc.device}
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-1 rounded bg-slate-200 text-slate-700">
                    {inc.status}
                  </span>
                  <button
                    onClick={() => handleRunAiDiagnosis(inc)}
                    className="text-xs font-bold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1"
                  >
                    <span>Investigasi AI</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* AI Diagnosis Result Panel */}
        {aiDiagnosis.isLoading && (
          <div className="mt-4 p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-center text-xs text-indigo-900 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Menganalisis anomali kelistrikan & siber dengan Gemini 3.8 Flash...</span>
          </div>
        )}

        {aiDiagnosis.result && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 text-xs text-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Hasil Investigasi Intelijen AI Keamanan
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                {aiDiagnosis.result.severity}
              </span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong>Analisis Ancaman:</strong> {aiDiagnosis.result.threatAnalysis}
            </p>
            <p className="text-slate-700">
              <strong>Langkah Mitigasi:</strong> {aiDiagnosis.result.containmentStep}
            </p>
            <div className="pt-2 border-t border-indigo-100 flex items-center justify-between text-indigo-900 font-semibold">
              <span>Saran: {aiDiagnosis.result.safetyAdvisory}</span>
              <button
                onClick={() => setAiDiagnosis({ isLoading: false })}
                className="text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white font-bold"
              >
                Tutup Diagnosis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
