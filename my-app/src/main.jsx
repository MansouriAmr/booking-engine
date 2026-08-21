import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Hardcoded config for today's client (e.g., Dr. Salem)
const clientConfig = {
  id: 'tenant_salem_01', // Your Supabase tenant_id or client identifier
  name: 'Cabinet Dr. Salem',
  category: 'Dental Clinic',
  messagingChannel: 'whatsapp', // 'whatsapp' or 'sms'
  clientLabel: 'Patient',
  clientLabelPlural: 'Patients',
  accentColor: 'blue',
  defaultServices: ['Consultation', 'Detartrage', 'Blanchiment']
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App tenantConfig={clientConfig} />
  </React.StrictMode>
);