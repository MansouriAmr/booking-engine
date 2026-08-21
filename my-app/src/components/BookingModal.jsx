import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function BookingModal({ onClose, onSubmit, tenantConfig, darkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '2026-08-16',
    time: '14:00',
    service: tenantConfig?.defaultServices?.[0] || 'General Service'
  });

  const getAccentBg = () => {
    switch (tenantConfig?.accentColor) {
      case 'pink': return 'bg-pink-600 hover:bg-pink-500';
      case 'emerald': return 'bg-emerald-600 hover:bg-emerald-500';
      case 'purple': return 'bg-purple-600 hover:bg-purple-500';
      default: return 'bg-blue-600 hover:bg-blue-500';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl relative ${
          darkMode ? 'bg-[#111623] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button onClick={onClose} className="absolute right-4 top-4 p-1 rounded-lg text-slate-400 hover:text-slate-200">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-base font-bold mb-4">New Appointment</h2>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold mb-1">{tenantConfig?.clientLabel || 'Client'} Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Youssef Ben Salem"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full rounded-xl p-2.5 border focus:outline-none ${
                darkMode ? 'bg-[#0b0f17] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input
              required
              type="tel"
              placeholder="+216 50 123 456"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full rounded-xl p-2.5 border focus:outline-none ${
                darkMode ? 'bg-[#0b0f17] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
              }`}
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">Service Required</label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className={`w-full rounded-xl p-2.5 border focus:outline-none ${
                darkMode ? 'bg-[#0b0f17] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
              }`}
            >
              {(tenantConfig?.defaultServices || ['General Service']).map((srv, idx) => (
                <option key={idx} value={srv}>{srv}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1">Date</label>
              <input
                required
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full rounded-xl p-2.5 border focus:outline-none ${
                  darkMode ? 'bg-[#0b0f17] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Time</label>
              <input
                required
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`w-full rounded-xl p-2.5 border focus:outline-none ${
                  darkMode ? 'bg-[#0b0f17] border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-300'
                }`}
              />
            </div>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl font-semibold bg-slate-100 dark:bg-slate-800">
              Cancel
            </button>
            <button type="submit" className={`px-4 py-2 text-white rounded-xl font-semibold shadow-md ${getAccentBg()}`}>
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}