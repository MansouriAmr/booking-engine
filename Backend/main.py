from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Union
import uvicorn
import re

app = FastAPI(title="Booking Automation Engine")

# Enable CORS for all origins (Netlify, Vercel, Localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Helper function to sanitize phone numbers
def clean_phone_number(phone: str) -> str:
    cleaned = re.sub(r"\D", "", phone) # Strip spaces, dashes, +, etc.
    if len(cleaned) == 8: # Local Tunisian 8-digit format
        return f"+216{cleaned}"
    return f"+{cleaned}" if not cleaned.startswith("+") else cleaned


# Payload Structure (Tolerates messy React input)
class BookingPayload(BaseModel):
    event: Optional[str] = "NEW_BOOKING"
    appointment_id: Optional[Union[str, int]] = None
    client_name: Optional[str] = "Valued Client"
    phone: str
    service: Optional[str] = "Service"
    date: Optional[str] = "Today"
    time: Optional[str] = "As Scheduled"
    visits_count: Optional[Union[int, str]] = 1
    has_reviewed: Optional[bool] = False
    auto_trigger_review: Optional[bool] = False


# Background Worker Functions
def send_whatsapp_message(phone: str, message: str):
    formatted_phone = clean_phone_number(phone)
    print(f"[WHATSAPP OUTBOUND] Destination: {formatted_phone} | Content: '{message}'")
    # API hook (e.g. GreenAPI / UltraMsg / Twilio) goes here


def process_review_flow(phone: str, name: str):
    review_link = "https://g.page/r/your-google-business-id/review"
    msg = f"Hi {name}! Thanks for visiting us today. Could you leave us a quick review? {review_link}"
    send_whatsapp_message(phone, msg)


# Health-Check Endpoint for Render Pings
@app.get("/")
async def health_check():
    return {"status": "online", "system": "Booking Engine Active"}


# Main Webhook Endpoint
@app.post("/api/webhook")
async def handle_webhook(data: BookingPayload, background_tasks: BackgroundTasks):
    
    # 1. ROUTE: New Booking
    if data.event == "NEW_BOOKING" or not data.event:
        print(f"[BOOKING RECEIVED] Client: {data.client_name} ({data.phone}) | Service: {data.service}")
        
        conf_msg = f"Hi {data.client_name}, your appointment for {data.service} on {data.date} at {data.time} is confirmed!"
        background_tasks.add_task(send_whatsapp_message, data.phone, conf_msg)
        
        return {
            "status": "success", 
            "event": "NEW_BOOKING",
            "message": f"Booking logged for {data.client_name}"
        }

    # 2. ROUTE: Job Completed
    elif data.event == "JOB_COMPLETED":
        print(f"[JOB COMPLETED] Client: {data.client_name} | Visit Count: {data.visits_count}")

        if data.auto_trigger_review and not data.has_reviewed:
            print(f"[REVIEW QUEUED] Sending link to {data.phone}")
            background_tasks.add_task(process_review_flow, data.phone, data.client_name or "Valued Client")
            msg = "Job done & review link dispatched."
        else:
            print(f"[REVIEW SKIPPED] {data.phone} opted out or already reviewed.")
            msg = "Job done logged (review skipped)."

        return {
            "status": "success", 
            "event": "JOB_COMPLETED",
            "message": msg
        }

    raise HTTPException(status_code=400, detail="Invalid event type provided.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)