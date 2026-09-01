// BookingModal.jsx
import React, { useState } from "react";

export default function BookingModal({ initialData, onClose, onSubmit, darkMode, t }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    service: initialData?.service || "",
    date: new Date().toISOString().split("T")[0], // Default to today
    time: "10:00",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-2xl shadow-xl ${darkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}`}>
        <h3 className="text-lg font-bold mb-4">
          {initialData ? (t?.rebookClient || "Re-réserver un client") : (t?.newBooking || "Nouveau rendez-vous")}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400">Nom</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full mt-1 p-2 rounded-lg border text-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Téléphone</label>
            <input
              type="text"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className={`w-full mt-1 p-2 rounded-lg border text-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Service</label>
            <input
              type="text"
              required
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className={`w-full mt-1 p-2 rounded-lg border text-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full mt-1 p-2 rounded-lg border text-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Heure</label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className={`w-full mt-1 p-2 rounded-lg border text-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}