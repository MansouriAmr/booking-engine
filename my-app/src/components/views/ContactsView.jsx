import React, { useState } from "react";
import { Search, RotateCcw, Trash2 } from "lucide-react";

export default function ContactsView({ appointments = [], darkMode, onRebook, onDelete, t = {} }) {
  const [searchTerm, setSearchTerm] = useState("");

  const contactsMap = (appointments || []).reduce((acc, curr) => {
    if (!curr) return acc;
    const key = curr.phone || curr.client_name || curr.id;
    const clientName = curr.client_name || t.unnamedClient || "Client sans nom";
    const clientPhone = curr.phone || t.noPhone || "Pas de numéro";
    const clientService = curr.service || "Consultation";
    const clientDate = curr.appointment_date || curr.date || "N/A";

    if (!acc[key]) {
      acc[key] = {
        id: curr.id,
        name: clientName,
        phone: clientPhone,
        service: clientService,
        lastVisit: clientDate,
        visitsCount: curr.status === "Completed" ? (curr.visits_count || 1) : Math.max((curr.visits_count || 1) - 1, 1),
      };
    } else if (curr.status === "Completed") {
      acc[key].visitsCount = Math.max(acc[key].visitsCount + 1, curr.visits_count || 1);
      acc[key].lastVisit = clientDate;
    }
    return acc;
  }, {});

  const contacts = Object.values(contactsMap).filter((c) => {
    const nameMatch = (c.name || "").toLowerCase().includes((searchTerm || "").toLowerCase());
    const phoneMatch = (c.phone || "").includes(searchTerm || "");
    return nameMatch || phoneMatch;
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className={`p-4 rounded-xl ${darkMode ? "bg-slate-800" : "bg-white"} shadow-sm border border-slate-100/10`}>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder={t?.searchClients || "Rechercher par nom ou téléphone..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg text-sm outline-none ${
              darkMode ? "bg-slate-700 text-white placeholder-slate-400" : "bg-slate-50 text-slate-900"
            }`}
          />
        </div>
      </div>

      {/* Contacts Table */}
      <div className={`rounded-xl overflow-hidden ${darkMode ? "bg-slate-800" : "bg-white"} shadow-sm border border-slate-100/10`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase border-b ${
              darkMode ? "bg-slate-800/50 border-slate-700 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-500"
            }`}>
              <tr>
                <th className="p-4">{t?.clientName || "NOM DU CLIENT"}</th>
                <th className="p-4">{t?.phone || "TÉLÉPHONE"}</th>
                <th className="p-4">{t?.preferredService || "SERVICE PRÉFÉRÉ"}</th>
                <th className="p-4">{t?.lastVisit || "DERNIÈRE VISITE"}</th>
                <th className="p-4">{t?.visitsCount || "TOTAL VISITES"}</th>
                <th className="p-4 text-right">{t?.actions || "ACTIONS"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/10">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact.id || contact.phone} className="hover:bg-slate-500/5 transition">
                    <td className="p-4 font-semibold">{contact.name}</td>
                    <td className="p-4 opacity-70">{contact.phone}</td>
                    <td className="p-4 opacity-70">{contact.service}</td>
                    <td className="p-4 opacity-70">{contact.lastVisit}</td>
                    <td className="p-4 font-bold text-blue-600 dark:text-blue-400">
                      {contact.visitsCount}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        <button
                          onClick={() => onRebook(contact)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                        >
                          <RotateCcw size={13} /> {t?.rebook || t?.rebookBtn || "Re-réserver"}
                        </button>

                        {onDelete && (
                          <button
                            onClick={() => onDelete(contact.id || contact.phone)}
                            title={t?.delete || "Supprimer"}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-xs text-slate-400">
                    {t?.noClientsFound || "Aucun client trouvé."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}