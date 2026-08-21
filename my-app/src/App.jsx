import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BookingModal from './components/BookingModal';
import DashboardView from './components/views/DashboardView';
import AppointmentsView from './components/views/AppointmentsView';
import ContactsView from './components/views/ContactsView';
import ReviewsView from './components/views/ReviewsView';
import { fetchAppointments, submitBookingToCRM } from './api/crmConnector';

export default function App({ tenantConfig }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments().then(setAppointments).catch(console.error);
  }, []);

  const handleBookingSubmit = async (formData) => {
  const newAppointment = {
    id: Date.now().toString(),
    client_name: formData.name,
    phone: formData.phone,
    service: formData.service,
    date: formData.date,
    time: formData.time,
    status: 'Scheduled',
    visits_count: 1
  };

  try {
    // Attempt sending to webhook/CRM
    await submitBookingToCRM(newAppointment);
  } catch (err) {
    console.error('Booking sync failed:', err);
  } finally {
    // Always update UI state & close modal so demo/app never breaks
    setAppointments((prev) => [newAppointment, ...prev]);
    setIsModalOpen(false);
  }
};

  return (
    <div className={`flex h-screen font-sans antialiased overflow-hidden ${darkMode ? 'bg-[#0b0f17] text-slate-100' : 'bg-slate-100 text-slate-900'}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} tenantConfig={tenantConfig} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} tenantConfig={tenantConfig} onOpenBooking={() => setIsModalOpen(true)} darkMode={darkMode} />
        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView appointments={appointments} tenantConfig={tenantConfig} darkMode={darkMode} />}
          {activeTab === 'appointments' && <AppointmentsView appointments={appointments} setAppointments={setAppointments} tenantConfig={tenantConfig} darkMode={darkMode} />}
          {activeTab === 'contacts' && (
  <ContactsView 
    appointments={appointments} 
    tenantConfig={tenantConfig} 
    darkMode={darkMode} 
    onRebook={() => setIsModalOpen(true)} 
  />
)}
          {activeTab === 'reviews' && <ReviewsView appointments={appointments} darkMode={darkMode} />}
        </main>
      </div>
      {isModalOpen && <BookingModal onClose={() => setIsModalOpen(false)} onSubmit={handleBookingSubmit} tenantConfig={tenantConfig} darkMode={darkMode} />}
    </div>
  );
}