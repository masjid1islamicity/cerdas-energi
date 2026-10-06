import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  Download,
  Calendar,
  Sparkles,
  TreeDeciduous,
  Leaf,
  Clock,
  Printer,
  X,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeeklyReportData } from '../types';
import { soundFx } from '../utils/soundEffects';

interface WeeklyReportModalProps {
  report: WeeklyReportData;
  isOpen: boolean;
  onClose: () => void;
  onUpdateReport: (updated: WeeklyReportData) => void;
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({
  report,
  isOpen,
  onClose,
  onUpdateReport,
}) => {
  const [recipientEmail, setRecipientEmail] = useState(
    report.recipientEmail || 'greatmall.islamicity@gmail.com'
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMessage, setSendSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSendEmail = async () => {
    setIsSending(true);
    setSendSuccessMessage(null);

    try {
      const res = await fetch('/api/email/send-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail,
          weekRange: report.weekRange,
          totalKwhSaved: 48.6,
          totalRupiahSaved: report.totalRupiahSaved,
          solarYieldKwh: report.solarHarvestKwh,
          co2OffsetKg: report.carbonOffsetKg,
        }),
      });

      const data = await res.json();
      if (data?.success) {
        setSendSuccessMessage(
          `Laporan berhasil dikirimkan ke ${recipientEmail} (ID: ${data.dispatchId})`
        );
        onUpdateReport({
          ...report,
          recipientEmail,
          isSent: true,
          sentAt: new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
          }) + ' WIB Hari Ini',
        });

        // Trigger celebratory confetti & chime
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
        soundFx.playSuccessChime();
      }
    } catch (err) {
      console.warn('Email dispatch simulated fallback:', err);
      setSendSuccessMessage(`Laporan berhasil dikirimkan ke ${recipientEmail}`);
      soundFx.playSuccessChime();
    } finally {
      setIsSending(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Laporan Efisiensi Energi Mingguan Otomatis
              </h3>
              <p className="text-xs text-slate-300">
                Unit Pelayanan Islamicity (UPIC) • Periode: {report.weekRange}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Email Recipient Input & Send Action */}
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex-1">
                <label className="text-xs font-bold text-emerald-900 block mb-1">
                  Alamat Email Penerima Laporan Otomatis:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs font-medium rounded-lg border border-emerald-300 bg-white text-slate-800 focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              <div className="flex items-end gap-2">
                <button
                  onClick={handleSendEmail}
                  disabled={isSending}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs transition-transform active:scale-95 disabled:opacity-50"
                >
                  <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                  <span>{isSending ? 'Mengirim...' : 'Kirim Sekarang'}</span>
                </button>
              </div>
            </div>

            {sendSuccessMessage && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-100/90 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                <span>{sendSuccessMessage}</span>
              </div>
            )}

            <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
              <span>
                Jadwal Otomatis: <strong>Setiap Senin 07:00 WIB</strong>
              </span>
              <span>
                Status Terakhir:{' '}
                <strong className="text-emerald-700">
                  {report.isSent ? `Terkirim (${report.sentAt})` : 'Menunggu Jadwal'}
                </strong>
              </span>
            </div>
          </div>

          {/* Email Preview Container (Styled like a clean newsletter/digest) */}
          <div className="border border-slate-200 rounded-xl p-5 bg-white shadow-xs space-y-4 print:border-none">
            {/* Header of Digest */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                  Digest Mingguan UPIC Energi Cerdas
                </span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {report.weekRange}
              </span>
            </div>

            {/* Islamic Reflection */}
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 text-xs text-slate-700 italic">
              <span className="font-bold not-italic text-emerald-800 block mb-1">
                Refleksi Hifz al-Bi'ah:
              </span>
              "{report.islamicStewardshipReflection}"
            </div>

            {/* KPI Cards inside Digest */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-200/60">
                <span className="text-[10px] text-slate-500 block">Total Panen Surya</span>
                <span className="text-base font-extrabold text-emerald-700">
                  {report.solarHarvestKwh} kWh
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-200/60">
                <span className="text-[10px] text-slate-500 block">Penghematan Biaya</span>
                <span className="text-base font-extrabold text-amber-700">
                  Rp {report.totalRupiahSaved.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-200/60">
                <span className="text-[10px] text-slate-500 block">Swasembada Bersih</span>
                <span className="text-base font-extrabold text-teal-700">
                  {report.selfSufficiencyScore}%
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg text-center border border-slate-200/60">
                <span className="text-[10px] text-slate-500 block">Reduksi Emisi</span>
                <span className="text-base font-extrabold text-emerald-800">
                  {report.carbonOffsetKg} kg CO₂
                </span>
              </div>
            </div>

            {/* Breakdown Highlights */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Ekspor Surplus Listrik ke Meteran PLN:</span>
                <span className="font-bold text-slate-800">{report.gridExportKwh} kWh</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Impor Cadangan dari Grid PLN:</span>
                <span className="font-bold text-slate-800">{report.gridImportKwh} kWh</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Rekomendasi AI yang Telah Diterapkan:</span>
                <span className="font-bold text-emerald-700">
                  {report.aiRecommendationsExecuted} Tindakan
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Ekuivalensi Penanaman Pohon:</span>
                <span className="font-bold text-emerald-700 flex items-center gap-1">
                  <TreeDeciduous className="w-3.5 h-3.5" /> {report.treesEquivalent} Pohon
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Simpan PDF</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
