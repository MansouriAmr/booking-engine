import React, { useState } from "react";
import { Search, RotateCcw } from "lucide-react";

export default function ContactsView({ appointments, tenantConfig, darkMode, onRebook }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Aggregate patients dynamically from the appointments state
  const contactsMap = appointments.reduce((acc, curr) => {
    const key = curr.phone;
    if (!acc[key]) {
      acc[key] = {
        name: curr.client_name,
        phone: curr.phone,
        service: curr.service,
        lastVisit: curr.date,
        // Base visits count + 1 if this specific appointment is completed
        visitsCount: curr.status === "Completed" ? (curr.visits_count || 1) : (curr.visits_count || 1) - 1
      };
    } else {
      // If completed, ensure count reflects the update
      if (curr.status === "Completed") {
        acc[key].visitsCount = Math.max(acc[key].visitsCount, curr.visits_count || 1);
        acc[key].lastVisit = curr.date;
      }
    }
    return acc;
  }, {});

  const contacts = Object.values(contactsMap).filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className={`p-4 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white"} shadow-sm border border-slate-100/10`}>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none ${
              darkMode ? "bg-slate-700 text-white placeholder-slate-400" : "bg-slate-50 text-slate-900"
            }`}
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} shadow-sm`}>
        <table className="w-full text-left text-sm">
          <thead className={`text-xs uppercase border-b ${darkMode ? "bg-slate-800/50 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"}`}>
            <tr>
              <th className="p-4">Patient Name</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Preferred Service</th>
              <th className="p-4">Last Visit</th>
              <th className="p-4">Visits Count</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/10">
            {contacts.map((contact, idx) => (
              <tr key={idx} className="hover:bg-slate-500/5 transition">
                <td className="p-4 font-semibold">{contact.name}</td>
                <td className="p-4 opacity-70">{contact.phone}</td>
                <td className="p-4 opacity-70">{contact.service}</td>
                <td className="p-4 opacity-70">{contact.lastVisit}</td>
                <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                  {contact.visitsCount} {contact.visitsCount === 1 ? "visit" : "visits"}
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => onRebook(contact)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    <RotateCcw size={13} /> Re-book
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}