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
  Building2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, tenantConfig, darkMode, setDarkMode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getAccentBg = () => {
    switch (tenantConfig?.accentColor) {
      case 'pink': return 'bg-pink-600 hover:bg-pink-500';
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500';
      case 'purple': return 'bg-purple-600 hover:bg-purple-500';
      default: return 'bg-blue-600 hover:bg-blue-500';
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
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'appointments', label: 'Appointments', icon: Calendar },
            { id: 'contacts', label: `${tenantConfig?.clientLabelPlural || 'Clients'} CRM`, icon: Users },
            { id: 'reviews', label: 'Reviews & Rating', icon: Star }
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
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center justify-center ${
            isCollapsed ? 'p-2.5' : 'gap-2 p-2'
          } rounded-xl text-xs font-semibold border transition ${
            darkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-300 text-slate-700'
          }`}
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
          {!isCollapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>

        {!isCollapsed && (
          <button
            onClick={() => setIsCollapsed(true)}
            className="w-full flex items-center justify-center gap-1.5 p-1.5 rounded-xl text-[11px] font-semibold text-slate-400 hover:bg-slate-500/10"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Collapse Sidebar
          </button>
        )}
      </div>
    </aside>
  );
}