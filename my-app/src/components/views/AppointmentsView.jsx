import React, { useState } from 'react';
import { CheckCircle2, Check, Loader2 } from 'lucide-react';
import { markJobCompleted } from '../../api/crmConnector';

export default function AppointmentsView({ appointments = [], setAppointments, darkMode, t = {} }) {
  const [loadingId, setLoadingId] = useState(null);

  const handleJobDone = async (item) => {
    if (!item?.id) return;
    setLoadingId(item.id);

    // Optimistic UI update
    setAppointments((prev) =>
      prev.map((app) => (app.id === item.id ? { ...app, status: 'Completed' } : app))
    );

    const result = await markJobCompleted(item);
    if (!result || !result.success) {
      setAppointments((prev) => prev.map((app) => (app.id === item.id ? item : app)));
      alert(t.dbError || 'Failed to update status in database.');
    }
    setLoadingId(null);
  };

  if (!appointments.length) {
    return (
      <div className={`p-8 text-center rounded-xl border border-dashed ${
        darkMode ? 'border-slate-700 text-slate-400' : 'border-slate-200 text-slate-500'
      }`}>
        {t.noAppointments || t.noAppointmentsFound || 'Aucun rendez-vous trouvé.'}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {appointments.map((item) => {
        const isProcessing = loadingId === item.id;
        const apptTime = item.appointment_time || item.time;
        const apptDate = item.appointment_date || item.date;

        // Dynamic status text resolution
        const isCompleted = item.status === 'Completed' || item.status === 'Terminé';
        const displayStatus = isCompleted 
          ? (t.completed || 'Terminé') 
          : (t.scheduled || 'Programmé');

        return (
          <div
            key={item.id || Math.random()}
            className={`flex items-center justify-between p-4 rounded-xl ${
              darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'
            } shadow-sm border border-slate-100/10 transition-all`}
          >
            {/* Left Info Section */}
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-900 dark:text-slate-100">
                {item.client_name || t.unnamedClient || 'Client sans nom'}
              </span>

              <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {item.service || 'Consultation'} • {item.phone || t.noPhone || 'Pas de numéro'}
                {apptDate ? ` • ${apptDate}` : ''}
                {apptTime ? ` • ${apptTime}` : ''}
              </span>
            </div>

            {/* Right Action Section: Status Badge Only */}
            <div className="flex items-center gap-2 shrink-0">
              {!isCompleted ? (
                <button
                  onClick={() => handleJobDone(item)}
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 rounded-full hover:bg-blue-100 transition disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  {displayStatus}
                </button>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-full">
                  <Check size={13} /> {displayStatus}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}