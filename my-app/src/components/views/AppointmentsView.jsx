import React from 'react';
import { CheckCircle2, Check } from 'lucide-react';
import { markJobCompleted } from '../../api/crmConnector';

export default function AppointmentsView({ appointments, setAppointments, darkMode }) {

  const handleJobDone = async (item) => {
    const updatedVisits = (item.visits_count || 0) + 1;

    // 1. Instant local UI update (Visits go up, status changes to Completed)
    setAppointments((prev) =>
      prev.map((app) =>
        app.id === item.id
          ? {
              ...app,
              status: 'Completed',
              visits_count: updatedVisits,
              review_status: app.has_reviewed ? 'Already Reviewed' : 'Review Triggered'
            }
          : app
      )
    );

    // 2. Background webhook trigger (updates CRM + sends WhatsApp review link)
    await markJobCompleted(item);
  };

  return (
    <div className="space-y-3">
      {appointments.map((item) => (
        <div
          key={item.id}
          className={`flex items-center justify-between p-4 rounded-xl ${
            darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-800'
          } shadow-sm border border-slate-100/10`}
        >
          {/* Client & Service Info */}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-base">{item.client_name}</p>
              {/* Badge showing visit count */}
              <span className="px-2 py-0.5 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                {item.visits_count || 1} {item.visits_count === 1 ? 'visit' : 'visits'}
              </span>
            </div>
            <p className="text-sm opacity-60 mt-0.5">
              {item.service} • {item.phone}
            </p>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            {item.status !== 'Completed' ? (
              <button
                onClick={() => handleJobDone(item)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm active:scale-95"
              >
                <CheckCircle2 size={15} /> Job Done
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 rounded-lg">
                  <Check size={14} /> Completed
                </span>
                
                {/* Background status tag so owner knows what happened */}
                <span className="text-[11px] opacity-50 italic">
                  {item.has_reviewed ? '• Review on file' : '• Review request sent'}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}