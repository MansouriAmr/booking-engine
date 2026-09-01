// sdk.js - Drop-in Client Library
(function (global) {
    class WhatsAppAPI {
        constructor(config = {}) {
            // Default to local server if no URL provided
            this.baseUrl = (config.baseUrl || 'http://localhost:3000').replace(/\/$/, '');
            this.apiKey = config.apiKey || '';
        }

        async send({ type, phone, name, vars }) {
            try {
                const response = await fetch(`${this.baseUrl}/api/v1/trigger`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.apiKey
                    },
                    body: JSON.stringify({ type, phone, name, vars })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error?.message || 'Request failed');
                
                return data;
            } catch (err) {
                console.error('❌ WhatsApp API Error:', err.message);
                throw err;
            }
        }

        // Helper Methods for clean code
        sendReminder(phone, name, time) {
            return this.send({ type: 'reminder', phone, name, vars: { time } });
        }

        sendReview(phone, name, reviewLink) {
            return this.send({ type: 'review', phone, name, vars: { reviewLink } });
        }

        sendCustom(phone, customMessage) {
            return this.send({ type: 'custom', phone, vars: { customMessage } });
        }
    }

    // Expose to browser window
    global.WhatsAppAPI = WhatsAppAPI;
})(typeof window !== 'undefined' ? window : this);