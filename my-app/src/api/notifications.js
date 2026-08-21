export async function sendClientNotification(appointment, tenant, type = 'BOOKING_CONFIRMATION') {
  try {
    await fetch('https://your-n8n-instance.com/webhook/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenant_id: tenant.id,
        tenant_name: tenant.name,
        client_name: appointment.client_name,
        phone: appointment.phone,
        service: appointment.service,
        date: appointment.appointment_date,
        time: appointment.appointment_time,
        channel: tenant.messagingChannel || 'whatsapp',
        type: type
      })
    });
  } catch (err) {
    console.error('Failed to trigger notification:', err);
  }
}