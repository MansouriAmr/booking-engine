import React from 'react';
import { Plus, Search } from 'lucide-react';

export default function Header({ activeTab, tenantConfig, onOpenBooking, darkMode, t }) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard': return t.dashboard;
      case 'appointments': return t.appointments;
      case 'contacts': return `${tenantConfig?.clientLabelPlural || 'Patients'} CRM`;
      case 'reviews': return t.reviews;
      default: return '';
    }
  };

  return (
    <header className={`h-16 px-6 border-b flex items-center justify-between shrink-0 ${
      darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'
    }`}>
      <div>
        <h1 className="text-base font-bold">{getTabTitle()}</h1>
        <p className="text-xs text-slate-400">{t.welcomeBack}, {tenantConfig?.name || 'Admin'}</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onOpenBooking}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t.bookAppointment}</span>
        </button>
      </div>
    </header>
  );
}