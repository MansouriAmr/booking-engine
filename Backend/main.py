import os
import sqlite3
import time
from typing import Optional, Union
from fastapi import FastAPI, HTTPException, Security, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
import uvicorn

app = FastAPI(title="WhatsApp Automation SaaS Engine")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Persistent DB path (works locally and on Render persistent disk)
DB_PATH = os.getenv("DB_PATH", "clinic_demo.db")
API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)

# Registered Clients (Map API Key -> Client ID)
# When you onboard a new client, add their key here or in your DB
VALID_CLIENT_KEYS = {
    "wa_live_demo123": "demo_clinic",
    "wa_live_hannibal99": "clinique_hannibal",
    os.getenv("MASTER_API_KEY", "wa_live_master_key"): "admin"
}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            client_id TEXT DEFAULT 'default',
            client_name TEXT,
            phone TEXT,
            service TEXT,
            date TEXT,
            time TEXT,
            visits_count INTEGER,
            has_reviewed INTEGER,
            status TEXT,
            created_at INTEGER
        )
    """)
    conn.commit()
    conn.close()

init_db()

async def verify_api_key(api_key: str = Security(API_KEY_HEADER)):
    if api_key in VALID_CLIENT_KEYS or os.getenv("ENVIRONMENT") == "development":
        return VALID_CLIENT_KEYS.get(api_key, "demo_clinic")
    raise HTTPException(status_code=401, detail="Invalid or missing X-API-Key header")

class BookingPayload(BaseModel):
    event: Optional[str] = "NEW_BOOKING"
    appointment_id: Optional[Union[str, int]] = None
    client_name: Optional[str] = "Valued Client"
    phone: str
    service: Optional[str] = "Consultation"
    date: Optional[str] = "Today"
    time: Optional[str] = "As Scheduled"
    visits_count: Optional[Union[int, str]] = 1
    has_reviewed: Optional[bool] = False

# Function where you hook up your WhatsApp provider/bot
def send_whatsapp_reminder(phone: str, name: str, date: str, time_slot: str):
    print(f"📱 [WHATSAPP DISPATCHED] -> To: {name} ({phone}) for {date} at {time_slot}")
    return True

@app.get("/")
async def health_check():
    return {"status": "online", "system": "WhatsApp Automation API"}

# Endpoint for client dashboard to fetch their own appointments
@app.get("/api/appointments")
async def get_appointments(client_id: str = Depends(verify_api_key)):
    try:
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, client_name, phone, service, date, time, visits_count, has_reviewed, status FROM appointments WHERE client_id = ? ORDER BY created_at DESC",
            (client_id,)
        )
        rows = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": str(r["id"]),
                "client_name": r["client_name"] or "Unknown",
                "phone": r["phone"] or "",
                "service": r["service"] or "Consultation",
                "date": r["date"] or "Today",
                "time": r["time"] or "10:00 AM",
                "visits_count": int(r["visits_count"]) if r["visits_count"] is not None else 1,
                "has_reviewed": bool(r["has_reviewed"]),
                "status": r["status"] or "Scheduled"
            }
            for r in rows
        ]
    except Exception as e:
        print(f"Error fetching appointments: {e}")
        return []

# Webhook endpoint where external forms drop data
@app.post("/api/webhook")
async def handle_webhook(data: BookingPayload, client_id: str = Depends(verify_api_key)):
    try:
        conn = get_db()
        cursor = conn.cursor()

        appt_id = str(data.appointment_id) if data.appointment_id else str(int(time.time() * 1000))
        visits = int(data.visits_count) if data.visits_count is not None else 1
        reviewed_int = 1 if data.has_reviewed else 0

        if data.event == "NEW_BOOKING" or not data.event:
            cursor.execute("""
                INSERT OR REPLACE INTO appointments 
                (id, client_id, client_name, phone, service, date, time, visits_count, has_reviewed, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                appt_id, client_id, data.client_name, data.phone, data.service,
                data.date, data.time, visits, reviewed_int, "Scheduled", int(time.time())
            ))
            conn.commit()
            conn.close()
            
            # Fire the WhatsApp message trigger
            send_whatsapp_reminder(data.phone, data.client_name, data.date, data.time)

            return {
                "status": "success", 
                "message": f"Appointment saved & WhatsApp queued for {data.client_name}",
                "appointment_id": appt_id
            }

        elif data.event == "JOB_COMPLETED":
            cursor.execute("""
                UPDATE appointments 
                SET status = 'Completed', visits_count = visits_count + 1 
                WHERE (id = ? OR phone = ?) AND client_id = ?
            """, (appt_id, data.phone, client_id))
            conn.commit()
            conn.close()
            return {"status": "success", "message": "Updated status to Completed"}

        conn.close()
        return {"status": "success"}
    except Exception as e:
        print(f"Webhook Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)