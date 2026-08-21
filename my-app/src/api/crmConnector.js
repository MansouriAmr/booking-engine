// src/api/crmConnector.js

// 1. Swap with your live Render backend URL once deployed
// Example: 'https://my-booking-backend.onrender.com/api/webhook'
// my-app/src/api/crmConnector.js
const CRM_WEBHOOK_URL = 'https://booking-engine-4caw.onrender.com/api/webhook';

// 2. Initial data loader for the UI
export async function fetchAppointments() {
  return [
    {
      id: '1',
      client_name: 'Youssef Ben Salem',
      phone: '+216 50 123 456',
      service: 'Consultation',
      date: '2026-08-16',
      time: '02:00 PM',
      status: 'Scheduled',
      visits_count: 1,
      has_reviewed: false
    },
    {
      id: '2',
      client_name: 'Amina Mansour',
      phone: '+216 22 987 654',
      service: 'Detartrage',
      date: '2026-08-16',
      time: '04:30 PM',
      status: 'Completed',
      visits_count: 3,
      has_reviewed: true
    }
  ];
}

// 3. Submit new booking form modal
export async function submitBookingToCRM(bookingData) {
  // Ensure the payload matches FastAPI's expected structure
  const payload = {
    event: 'NEW_BOOKING',
    appointment_id: bookingData.id || String(Date.now()),
    client_name: bookingData.client_name,
    phone: bookingData.phone,
    service: bookingData.service,
    date: bookingData.date,
    time: bookingData.time,
    visits_count: bookingData.visits_count || 1,
    has_reviewed: bookingData.has_reviewed || false
  };

  try {
    const res = await fetch(CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('CRM Endpoint unreachable. Falling back to local state update.', err);
    return { status: 'fallback', success: true };
  }
}

// 4. One-click Job Done trigger (increments visit + handles background review flow)
export async function markJobCompleted(appointment) {
  const updatedVisits = (appointment.visits_count || 0) + 1;

  const payload = {
    event: 'JOB_COMPLETED',
    appointment_id: appointment.id,
    client_name: appointment.client_name,
    phone: appointment.phone,
    service: appointment.service || 'General Service',
    visits_count: updatedVisits,
    has_reviewed: appointment.has_reviewed || false,
    auto_trigger_review: !appointment.has_reviewed
  };

  try {
    const res = await fetch(CRM_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('Background sync failed, updated UI locally:', err);
    return { status: 'fallback', success: true, updatedVisits };
  }
}