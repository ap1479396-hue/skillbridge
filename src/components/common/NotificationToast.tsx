import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div
      id="notification-toast-container"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {notifications.map((notif, idx) => (
        <div
          key={notif.id ? `toast-${notif.id}` : `toast-fallback-${idx}-${Date.now()}`}
          className="pointer-events-auto bg-[#0f172a]/95 backdrop-blur-xl text-white rounded-xl p-3.5 shadow-2xl border border-white/15 flex items-start gap-2.5 animate-in slide-in-from-bottom-2 duration-200"
        >
          {notif.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : notif.type === 'warning' ? (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs text-slate-200 leading-relaxed">
            {notif.message}
          </div>

          <button
            onClick={() => dismissNotification(notif.id)}
            className="text-slate-400 hover:text-white p-0.5 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
