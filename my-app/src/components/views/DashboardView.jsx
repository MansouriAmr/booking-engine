import React from 'react';
import { Calendar, CheckCircle2, Clock, Users, Check, Trash2 } from 'lucide-react';

export default function DashboardView({ 
  appointments = [], 
  tenantConfig, 
  darkMode, 
  onComplete, 
  onDelete, 
  t = {} 
}) {
  const scheduled = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Programmé').length;
  const completed = appointments.filter(a => a.status === 'Completed' || a.status === 'Terminé').length;

  const formatDisplayTime = (rawTime) => {
    if (!rawTime) return '--:--';
    const parts = rawTime.split(':');
    if (parts.length < 2) return rawTime;
    
    const date = new Date();
    date.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10));
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Overview Header */}
      <div>
        <h2 className="text-lg font-bold">{t.dailyOverview || 'Planning du jour'}</h2>
        <p className="text-xs text-slate-400">{t.overviewSubtitle || 'Aperçu de vos rendez-vous'}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t.totalAppointments || 'Total rendez-vous'}</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{appointments.length}</p>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t.scheduledVisits || 'Visites programmées'}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{scheduled}</p>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t.completedVisits || 'Visites terminées'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{completed}</p>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t.activePatients || 'Clients actifs'}</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-2xl font-bold mt-2">{appointments.length}</p>
        </div>
      </div>

      {/* Today's Schedule Table */}
      <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'}`}>
        <h3 className="text-sm font-bold mb-4">{t.todaySchedule || 'Planning du jour'}</h3>
        {appointments.length === 0 ? (
          <p className="text-xs text-slate-400">{t.noAppointmentsToday || 'Aucun rendez-vous aujourd’hui'}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-700/50 text-slate-400">
                  <th className="pb-2">{t.patient || 'Client'}</th>
                  <th className="pb-2">{t.service || 'Service'}</th>
                  <th className="pb-2">{t.time || 'Heure'}</th>
                  <th className="pb-2">{t.status || 'Statut'}</th>
                  <th className="pb-2 text-right">{t.actions || 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {appointments.slice(0, 5).map((item) => {
                  const isCompleted = item.status === 'Completed' || item.status === 'Terminé';
                  const timeValue = item.appointment_time || item.time;

                  return (
                    <tr key={item.id} className="hover:bg-slate-500/5 transition">
                      <td className="py-2.5 font-medium">{item.client_name}</td>
                      <td className="py-2.5 text-slate-400">{item.service}</td>
                      <td className="py-2.5">{formatDisplayTime(timeValue)}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          isCompleted ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                        }`}>
                          {isCompleted ? (t.completed || 'Terminé') : (t.scheduled || 'Programmé')}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="inline-flex items-center gap-1 justify-end">
                          {!isCompleted && onComplete && (
                            <button
                              onClick={() => onComplete(item.id || item)}
                              title={t.markCompleted || 'Marquer comme terminé'}
                              className="p-1 text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition"
                            >
                              <Check size={15} />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              onClick={() => onDelete(item.id || item)}
                              title={t.delete || 'Supprimer'}
                              className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}