from datetime import datetime, timedelta

# 1. Mock Data (Added full dates so time math compares cleanly)
Appointments = [
    {
        "Id": "101",
        "PatientName": "Youssef",
        "PhoneNumber": "+216 55123456",
        "AppointmentTime": "2026-08-14 14:00:00",  # Scheduled for 14:00 (2 PM)
        "ReminderSent": False,
        "AppointmentStatus": "SCHEDULED"            # Options: SCHEDULED, CONFIRMED, CANCELLED
    },
    {
        "Id": "102",
        "PatientName": "Amina",
        "PhoneNumber": "+216 98765432",
        "AppointmentTime": "2026-08-14 16:30:00",  # 4.5 hours away (Too far)
        "ReminderSent": False,
        "AppointmentStatus": "SCHEDULED"
    }
]

# 2. Reminder Engine
def SendReminder(appointmentsList):
    # Simulated current server clock: 12:05 PM (Aug 14, 2026)
    currentTime = datetime.strptime("2026-08-14 12:05:00", "%Y-%m-%d %H:%M:%S")
    targetTime = currentTime + timedelta(hours=2) # 14:05 PM window limit
    
    for appt in appointmentsList:    
        # FIX: Access individual 'appt', not the entire 'Appointments' list
        apptTime = datetime.strptime(appt["AppointmentTime"], "%Y-%m-%d %H:%M:%S")
        
        isWithinTwoHours = currentTime <= apptTime <= targetTime
        
        if appt["ReminderSent"] == False and appt["AppointmentStatus"] == "SCHEDULED" and isWithinTwoHours:
            print(f"--> Sending 2-Hour Reminder to {appt['PatientName']} for {appt['AppointmentTime']}...")
            appt["ReminderSent"] = True
        else:
            print(f"--> Skipping {appt['PatientName']}: Not in 2-hour window or already sent.")

# 3. Webhook Response Handler
def HandleReminder(appt, incomingPayload):
    if incomingPayload == "CONFIRMRDV":
        appt["AppointmentStatus"] = "CONFIRMED" # FIX: Matched status option 'CONFIRMED'
        print(f"--> {appt['PatientName']} confirmed their appointment!")

    elif incomingPayload == "CANCELRDV":
        appt["AppointmentStatus"] = "CANCELLED"
        print(f"--> {appt['PatientName']} cancelled! Alerting clinic secretary...")


# --- SIMULATION ---
print("--- EVENT 1: Checking Reminders at 12:05 PM ---")
SendReminder(Appointments)

print("\n--- EVENT 2: Youssef Taps 'CONFIRMRDV' ---")
# FIX: Clean string parameter passing
HandleReminder(Appointments[0], "CONFIRMRDV")

print("\nUpdated Appointments:\n", Appointments)