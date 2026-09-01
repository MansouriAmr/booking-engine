import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Building2,
  Globe
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  tenantConfig, 
  darkMode, 
  setDarkMode, 
  lang = 'en', 
  setLang 
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getAccentBg = () => {
    switch (tenantConfig?.accentColor) {
      case 'pink': return 'bg-pink-600 hover:bg-pink-500';
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500';
      case 'purple': return 'bg-purple-600 hover:bg-purple-500';
      default: return 'bg-blue-600 hover:bg-blue-500';
    }
  };

  const navLabels = {
    en: {
      dashboard: 'Dashboard',
      appointments: 'Appointments',
      contacts: `${tenantConfig?.clientLabelPlural || 'Clients'} CRM`,
      reviews: 'Reviews & Rating',
      lightMode: 'Light Mode',
      darkMode: 'Dark Mode',
      collapse: 'Collapse Sidebar'
    },
    fr: {
      dashboard: 'Tableau de bord',
      appointments: 'Rendez-vous',
      contacts: `CRM ${tenantConfig?.clientLabelPlural || 'Clients'}`,
      reviews: 'Avis & Notes',
      lightMode: 'Mode Clair',
      darkMode: 'Mode Sombre',
      collapse: 'Réduire le menu'
    }
  };

  const currentLabels = navLabels[lang] || navLabels.en;

  const toggleLanguage = () => {
    if (setLang) {
      setLang(lang === 'en' ? 'fr' : 'en');
    }
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } flex flex-col justify-between border-r transition-all duration-200 shrink-0 ${
        darkMode ? 'bg-[#111623] border-slate-800' : 'bg-white border-slate-200'
      }`}
    >
      <div>
        <div
          className={`h-16 border-b flex items-center ${
            isCollapsed ? 'justify-center px-0' : 'justify-between px-4'
          } ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}
        >
          {!isCollapsed ? (
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md ${getAccentBg()}`}>
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h2 className="text-xs font-bold truncate">{tenantConfig?.name || 'Workspace'}</h2>
                <p className="text-[10px] text-slate-400 truncate">{tenantConfig?.category || 'Service'}</p>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCollapsed(false)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition ${
                darkMode ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="p-2 space-y-1.5">
          {[
            { id: 'dashboard', label: currentLabels.dashboard, icon: LayoutDashboard },
            { id: 'appointments', label: currentLabels.appointments, icon: Calendar },
            { id: 'contacts', label: currentLabels.contacts, icon: Users },
            { id: 'reviews', label: currentLabels.reviews, icon: Star }
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center ${
                  isCollapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
                } rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? `${getAccentBg()} text-white shadow-md`
                    : darkMode
                    ? 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      <div className={`p-2.5 border-t space-y-2 ${darkMode ? 'border-slate-800' : 'border-slate-200'}`}>
        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className={`w-full flex items-center justify-center ${
            isCollapsed ? 'p-2.5' : 'gap-2 p-2'
          } rounded-xl text-xs font-semibold border transition ${
            darkMode 
              ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800' 
              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
          }`}
          title="Switch Language"
        >
          <Globe className="w-4 h-4 text-emerald-500 shrink-0" />
          {!isCollapsed && (
            <div className="flex items-center justify-between w-full">
              <span>Language</span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-300 dark:bg-slate-700 uppercase">
                {lang}
              </span>
            </div>
          )}
        </button>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center justify-center ${
            isCollapsed ? 'p-2.5' : 'gap-2 p-2'
          } rounded-xl text-xs font-semibold border transition ${
            darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400 shrink-0" /> : <Moon className="w-4 h-4 text-blue-600 shrink-0" />}
          {!isCollapsed && <span>{darkMode ? currentLabels.lightMode : currentLabels.darkMode}</span>}
        </button>

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="w-full flex items-center justify-center gap-1.5 p-1.5 rounded-xl text-[11px] font-semibold text-slate-400 hover:bg-slate-500/10"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> {currentLabels.collapse}
          </button>
        )}
      </div>
    </aside>
  );
}