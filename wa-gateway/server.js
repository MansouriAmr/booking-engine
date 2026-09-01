const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();

// Middleware setup
app.use(express.json());
app.use(cors()); 
app.use(express.static(__dirname)); 

const PORT = process.env.PORT || 3000;
const RENDER_URL = process.env.RENDER_URL || `http://localhost:${PORT}`;
const API_KEY = process.env.API_KEY || 'your-secret-api-key';
// Enables isolated session folders per client via env vars
const SESSION_FOLDER = process.env.SESSION_FOLDER || 'auth_info_baileys';
// Phone number to pair (e.g. "21612345678" or "+216 12 345 678")
const PAIRING_NUMBER = process.env.PAIRING_NUMBER;

let sock;
let activePairingCode = null;

// Simple message queue to prevent sending messages simultaneously (Anti-Ban)
const sendQueue = [];
let isProcessingQueue = false;

// -------------------------------------------------------------
// 1. API Security & Rate Limiting Middleware
// -------------------------------------------------------------

const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, 
    max: 30, 
    message: {
        success: false,
        error: { code: 'TOO_MANY_REQUESTS', message: 'Rate limit exceeded. Try again in a minute.' }
    }
});

const authenticateApiKey = (req, res, next) => {
    const userApiKey = req.headers['x-api-key'] || req.query.api_key;
    if (!userApiKey || userApiKey !== API_KEY) {
        return res.status(401).json({
            success: false,
            error: { code: 'UNAUTHORIZED', message: 'Invalid or missing API key.' }
        });
    }
    next();
};

// -------------------------------------------------------------
// 2. WhatsApp Connection & Session Management
// -------------------------------------------------------------
async function connectToWhatsApp() {
    // Dynamic folder assignment per client
    const { state, saveCreds } = await useMultiFileAuthState(SESSION_FOLDER);

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: false // Disabled QR code generation
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'close') {
            const statusCode = lastDisconnect?.error?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log(`⚠️ Connection closed (Code: ${statusCode}). Reconnecting: ${shouldReconnect}`);
            
            if (shouldReconnect) {
                setTimeout(connectToWhatsApp, 5000); 
            } else {
                console.error(`❌ Logged out from WhatsApp. Clear ${SESSION_FOLDER} folder and restart.`);
            }
        } else if (connection === 'open') {
            activePairingCode = null; // Clear code on successful connection
            console.log(`✅ WhatsApp Baileys Gateway connected successfully! [Session: ${SESSION_FOLDER}]`);
        }
    });

    // --- PAIRING CODE LOGIC ---
    if (!sock.authState.creds.registered && PAIRING_NUMBER) {
        setTimeout(async () => {
            try {
                const cleanNumber = PAIRING_NUMBER.toString().replace(/[^0-9]/g, '');
                const code = await sock.requestPairingCode(cleanNumber);
                
                // Formats code as ABCD-1234
                activePairingCode = code?.match(/.{1,4}/g)?.join('-') || code;

                console.log(`\n========================================`);
                console.log(`🔑 YOUR PAIRING CODE: ${activePairingCode}`);
                console.log(`========================================\n`);
            } catch (err) {
                console.error('❌ Failed to request pairing code:', err.message);
            }
        }, 4000); // 4-second delay allows socket initialization before code generation
    }
}

connectToWhatsApp();

// -------------------------------------------------------------
// 3. Message Queue Processor (Anti-Spam Safeguard)
// -------------------------------------------------------------
async function processQueue() {
    if (isProcessingQueue || sendQueue.length === 0) return;
    isProcessingQueue = true;

    while (sendQueue.length > 0) {
        const { jid, message, resolve, reject } = sendQueue.shift();
        try {
            const result = await sock.sendMessage(jid, { text: message });
            resolve(result);
        } catch (err) {
            reject(err);
        }
        // Buffer between message dispatches to mimic human pacing
        await new Promise(res => setTimeout(res, 1500));
    }

    isProcessingQueue = false;
}

function queueMessage(jid, message) {
    return new Promise((resolve, reject) => {
        sendQueue.push({ jid, message, resolve, reject });
        processQueue();
    });
}

// -------------------------------------------------------------
// 4. Endpoints
// -------------------------------------------------------------

// Health Check (Public)
app.get('/health', (req, res) => {
    const isConnected = Boolean(sock && sock.user);
    res.status(200).json({
        success: true,
        status: isConnected ? 'ONLINE' : 'DISCONNECTED',
        pairingCodeAvailable: Boolean(activePairingCode),
        queueLength: sendQueue.length,
        session: SESSION_FOLDER,
        timestamp: new Date().toISOString()
    });
});

// Endpoint to view the Pairing Code in a browser or API
app.get('/pairing-code', (req, res) => {
    if (sock && sock.user) {
        return res.status(200).json({
            success: true,
            message: 'WhatsApp is already authenticated and connected!'
        });
    }

    if (!activePairingCode) {
        return res.status(404).json({
            success: false,
            message: 'Pairing code not available. Ensure PAIRING_NUMBER environment variable is set.'
        });
    }

    return res.status(200).json({
        success: true,
        pairingCode: activePairingCode,
        instructions: 'Open WhatsApp -> Settings -> Linked Devices -> Link with phone number instead'
    });
});

// Secured Universal Trigger Endpoint
app.post('/api/v1/trigger', apiLimiter, authenticateApiKey, async (req, res) => {
    const { type, phone, name, vars } = req.body;

    if (!phone) {
        return res.status(400).json({
            success: false,
            error: { code: 'INVALID_INPUT', message: 'Missing "phone" parameter.' }
        });
    }

    if (!sock || !sock.user) {
        return res.status(503).json({
            success: false,
            error: { code: 'SERVICE_UNAVAILABLE', message: 'WhatsApp engine is offline or re-connecting.' }
        });
    }

    // Standardize phone number format (Auto-adds Tunisia country code '216' if 8 digits)
    let cleanPhone = phone.toString().replace(/[^0-9]/g, '');
    if (cleanPhone.length === 8) cleanPhone = '216' + cleanPhone;
    const jid = `${cleanPhone}@s.whatsapp.net`;

    try {
        // --- WHATSAPP ACCOUNT CHECK ---
        const [onWaResult] = await sock.onWhatsApp(jid);
        if (!onWaResult || !onWaResult.exists) {
            console.log(`⚠️ Skipped: ${cleanPhone} is not registered on WhatsApp.`);
            return res.status(200).json({
                success: false,
                skipped: true,
                message: `Phone number ${cleanPhone} does not have an active WhatsApp account.`
            });
        }

        // Build template message
        let message = '';
        if (type === 'reminder') {
            message = `Bonjour ${name || ''}! 🔔 Rappel pour votre rendez-vous : ${vars?.time || 'prévu sous peu'}. À bientôt!`;
        } else if (type === 'review') {
            message = `Bonjour ${name || ''}! Merci de votre confiance. 🙏\nSi vous avez 30 secondes, laissez-nous un avis ici :\n${vars?.reviewLink || ''}`;
        } else if (type === 'custom') {
            message = vars?.customMessage || '';
        } else {
            return res.status(400).json({
                success: false,
                error: { code: 'INVALID_TYPE', message: 'Invalid "type". Use "reminder", "review", or "custom".' }
            });
        }

        await queueMessage(jid, message);

        return res.status(200).json({
            success: true,
            data: {
                recipient: cleanPhone,
                type: type,
                sentAt: new Date().toISOString()
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: { code: 'DISPATCH_FAILED', message: err.message }
        });
    }
});

// -------------------------------------------------------------
// 5. Keep-Alive Self Ping
// -------------------------------------------------------------
function startKeepAlive() {
    const TEN_MINUTES = 10 * 60 * 1000;
    setInterval(async () => {
        try {
            await axios.get(`${RENDER_URL}/health`);
        } catch (err) {
            console.error('⚠️ Keep-alive ping failed:', err.message);
        }
    }, TEN_MINUTES);
}

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Gateway running on port ${PORT}`);
    startKeepAlive();
});