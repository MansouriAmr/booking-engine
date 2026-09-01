// src/api/crmConnector.js

import { supabase } from './supabaseClient';

export async function fetchAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching appointments:', error.message);
    return [];
  }
  return data || [];
}

export async function submitBookingToCRM(newAppointment) {
  // Build payload matching exact database column names
  const payload = {
    client_name: newAppointment.client_name,
    phone: newAppointment.phone,
    service: newAppointment.service,
    appointment_date: newAppointment.appointment_date || newAppointment.date,
    appointment_time: newAppointment.appointment_time || newAppointment.time || '10:00:00',
    status: newAppointment.status || 'Scheduled'
  };

  const { data, error } = await supabase
    .from('appointments')
    .insert([payload])
    .select();

  if (error) {
    console.error('Error inserting appointment:', error.message);
    throw error;
  }
  return { success: true, data: data[0] };
}

export async function markJobCompleted(item) {
  if (!item?.id) return { success: false, error: 'No valid ID' };

  const { data, error } = await supabase
    .from('appointments')
    .update({ status: 'Completed' })
    .eq('id', item.id)
    .select();

  if (error) {
    console.error('Error marking completed:', error.message);
    return { success: false, error };
  }
  return { success: true, data };
}

export async function deleteAppointment(identifier) {
  if (!identifier) return { success: false, error: 'No identifier provided' };

  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);

  const query = supabase.from('appointments').delete();
  const { data, error } = isUUID 
    ? await query.eq('id', identifier) 
    : await query.eq('phone', identifier);

  if (error) {
    console.error('Supabase deletion error:', error.message);
    return { success: false, error };
  }

  return { success: true, data };
}