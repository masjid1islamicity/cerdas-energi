import React from 'react';
import {
  X,
  Bell,
  CheckCheck,
  AlertTriangle,
  ShieldAlert,
  Sun,
  Zap,
  Info,
  ArrowRight,
} from 'lucide-react';
import { NotificationAlert } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: NotificationAlert[];
  onMarkAllAsRead: () => void;
  onActionClick: (alert: NotificationAlert) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkAllAsRead,
  onActionClick,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Pusat Notifikasi & Peringatan Real-Time
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 px-2 py-1 rounded hover:bg-emerald-50 transition-colors"
            >
              Tandai Dibaca
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Alerts List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <CheckCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-50" />
              <span>Semua sistem normal. Tidak ada peringatan aktif.</span>
            </div>
          ) : (
            alerts.map((alert) => {
              const isCrit = alert.severity === 'critical';
              const isWarn = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    alert.isRead
                      ? 'bg-slate-50/60 border-slate-200/60 opacity-80'
                      : isCrit
                      ? 'bg-rose-50/80 border-rose-300 shadow-xs'
                      : isWarn
                      ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                      : 'bg-emerald-50/60 border-emerald-200'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`p-2 rounded-lg flex-shrink-0 mt-0.5 ${
                        isCrit
                          ? 'bg-rose-600 text-white'
                          : isWarn
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {alert.type === 'suspicious' ? (
                        <ShieldAlert className="w-4 h-4" />
                      ) : alert.type === 'overconsumption' ? (
                        <Zap className="w-4 h-4" />
                      ) : alert.type === 'solar_peak' ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400">
                          {alert.timestamp}
                        </span>
                        {!alert.isRead && (
                          <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug">
                        {alert.title}
                      </h4>

                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {alert.message}
                      </p>

                      {alert.actionLabel && (
                        <div className="pt-2">
                          <button
                            onClick={() => onActionClick(alert)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-slate-300 shadow-2xs hover:bg-slate-50 transition-colors"
                          >
                            <span>{alert.actionLabel}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500 font-medium">
          UPIC Telemetri Sistem Keamanan & Efisiensi Energi
        </div>
      </div>
    </div>
  );
};
