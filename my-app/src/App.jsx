import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BookingModal from "./components/BookingModal";
import DashboardView from "./components/views/DashboardView";
import AppointmentsView from "./components/views/AppointmentsView";
import ContactsView from "./components/views/ContactsView";
import ReviewsView from "./components/views/ReviewsView";
import {
  fetchAppointments,
  submitBookingToCRM,
  deleteAppointment,
} from "./api/crmConnector";
import { TENANT_CONFIG, TRANSLATIONS } from "./config";

export default function App({ tenantConfig = TENANT_CONFIG }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClientForRebook, setSelectedClientForRebook] = useState(null);
  const [appointments, setAppointments] = useState([]);

  // Persistent Dark Mode
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : false;
  });

  // Persistent Language State ('en' | 'fr')
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("appLang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("appLang", lang);
  }, [lang]);

  useEffect(() => {
    fetchAppointments().then(setAppointments).catch(console.error);
  }, []);

  // Pull translations directly from config.js
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const handleBookingSubmit = async (formData) => {
    const newAppointmentPayload = {
      client_name: formData.name,
      phone: formData.phone,
      service: formData.service,
      appointment_date: formData.date,
      time: formData.time,
      status: "Scheduled",
      visits_count: 1,
    };

    try {
      const response = await submitBookingToCRM(newAppointmentPayload);
      if (response?.data) {
        setAppointments((prev) => [response.data, ...prev]);
      }
    } catch (err) {
      console.error("Booking sync failed:", err);
    } finally {
      handleCloseModal();
    }
  };

  const handleCompleteAppointment = async (target) => {
    const targetId = typeof target === "object" ? target?.id : target;
    if (!targetId) return;

    // Optimistically update appointment status to Completed
    setAppointments((prev) =>
      prev.map((item) =>
        item.id === targetId ? { ...item, status: "Completed" } : item
      )
    );
  };

  const handleDeleteAppointment = async (target) => {
    const targetId =
      typeof target === "object" ? target?.id || target?.phone : target;
    if (!targetId) return;

    if (t.deleteConfirm && !window.confirm(t.deleteConfirm)) return;

    const previousAppointments = [...appointments];
    setAppointments((prev) =>
      prev.filter((item) => item.id !== targetId && item.phone !== targetId)
    );

    const result = await deleteAppointment(targetId);

    if (!result || !result.success) {
      setAppointments(previousAppointments);
      alert("Error updating database.");
    }
  };

  const handleDeleteContact = (target) => {
    handleDeleteAppointment(target);
  };

  // Passes client object directly to modal state for pre-filling
  const handleRebookContact = (contact) => {
    setSelectedClientForRebook(contact);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedClientForRebook(null);
  };

  return (
    <div
      className={`flex h-screen font-sans antialiased overflow-hidden ${
        darkMode ? "bg-[#0b0f17] text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tenantConfig={tenantConfig}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          activeTab={activeTab}
          tenantConfig={tenantConfig}
          onOpenBooking={() => setIsModalOpen(true)}
          darkMode={darkMode}
          lang={lang}
          setLang={setLang}
          t={t}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === "dashboard" && (
            <DashboardView
              appointments={appointments}
              darkMode={darkMode}
              onComplete={handleCompleteAppointment}
              onDelete={handleDeleteAppointment}
              t={t}
            />
          )}

          {activeTab === "appointments" && (
            <AppointmentsView
              appointments={appointments}
              setAppointments={setAppointments}
              tenantConfig={tenantConfig}
              darkMode={darkMode}
              t={t}
            />
          )}

          {activeTab === "contacts" && (
            <ContactsView
              appointments={appointments}
              tenantConfig={tenantConfig}
              darkMode={darkMode}
              onRebook={handleRebookContact}
              onDelete={handleDeleteContact}
              t={t}
            />
          )}

          {activeTab === "reviews" && (
            <ReviewsView
              appointments={appointments}
              darkMode={darkMode}
              t={t}
            />
          )}
        </main>
      </div>

      {(isModalOpen || selectedClientForRebook) && (
        <BookingModal
          initialData={selectedClientForRebook}
          onClose={handleCloseModal}
          onSubmit={handleBookingSubmit}
          tenantConfig={tenantConfig}
          darkMode={darkMode}
          t={t}
        />
      )}
    </div>
  );
}