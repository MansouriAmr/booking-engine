import React from 'react';
import { Calendar, UserCheck, Users } from 'lucide-react';

export default function DashboardView({ appointments, tenantConfig, darkMode }) {
  const upcomingCount = appointments.filter((a) => a.status === 'Scheduled').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Today</span>
            <Calendar className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black">{upcomingCount}</div>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Completed</span>
            <UserCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black">{completedCount}</div>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Bookings</span>
            <Users className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black">{appointments.length}</div>
        </div>
      </div>

      <div className={`rounded-2xl border overflow-hidden ${darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
        <div className={`p-4 border-b ${darkMode ? 'bg-[#151b2c] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
          <h2 className="text-xs font-bold uppercase tracking-wider">Today's Schedule</h2>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {appointments.map((app) => (
            <div key={app.id} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex flex-col items-center justify-center font-mono font-bold text-xs">
                  <span>{app.appointment_time || app.time}</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold">{app.client_name}</h3>
                  <p className="text-[11px] text-slate-400">{app.service} • {app.phone}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                app.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'
              }`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}