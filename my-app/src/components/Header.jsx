import React from 'react';
import { Plus } from 'lucide-react';

export default function Header({ activeTab, tenantConfig, onOpenBooking, darkMode }) {
  const getAccentBg = () => {
    switch (tenantConfig?.accentColor) {
      case 'pink': return 'bg-pink-600 hover:bg-pink-500';
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500';
      case 'purple': return 'bg-purple-600 hover:bg-purple-500';
      default: return 'bg-blue-600 hover:bg-blue-500';
    }
  };

  return (
    <header
      className={`h-16 border-b px-6 flex items-center justify-between z-10 shrink-0 ${
        darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <h1 className={`text-base font-bold capitalize ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
        {activeTab === 'dashboard' && 'Daily Overview'}
        {activeTab === 'appointments' && 'Appointment Manager'}
        {activeTab === 'contacts' && `${tenantConfig?.clientLabelPlural || 'Clients'} Directory`}
        {activeTab === 'reviews' && 'Reviews & Feedback'}
      </h1>

      <button
        onClick={onOpenBooking}
        className={`flex items-center gap-2 font-semibold text-xs px-4 py-2.5 rounded-xl transition shadow-md text-white ${getAccentBg()}`}
      >
        <Plus className="w-4 h-4" /> Book Appointment
      </button>
    </header>
  );
}