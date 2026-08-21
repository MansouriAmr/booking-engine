# 1. Mock Database Record (PascalCase)
MockData = {
    "Id": "0",
    "PhoneNumber": "+216 55123456",
    "ReviewStatus": "PENDING",       # Options: PENDING, AWAITING_FEEDBACK, DONE
    "PrivateFeedback": None
}

# 2. Handler Function (PascalCase / camelCase)
def ProcessReviewEvent(data, incomingPayload=None, incomingText=None, incomingMediaUrl=None):
    
    # PHASE 1: Button Tap (When user taps "Great" or "Bad")
    if data["ReviewStatus"] == "PENDING" and incomingPayload:
        
        if incomingPayload == "RATING_GOOD":
            print(f"--> Sending Google Maps Link to {data['PhoneNumber']}...")
            data["ReviewStatus"] = "DONE"
            
        elif incomingPayload == "RATING_BAD":
            print(f"--> Asking {data['PhoneNumber']} for private feedback text...")
            data["ReviewStatus"] = "AWAITING_FEEDBACK"
            
    # PHASE 2: Text Message Reply (When user types what went wrong)
    # PHASE 2: Text OR Voice Note Reply
    elif data["ReviewStatus"] == "AWAITING_FEEDBACK":
    
        if incomingText:
            data["PrivateFeedback"] = incomingText
            data["FeedbackType"] = "TEXT"
            data["ReviewStatus"] = "DONE"
            print("--> Saved text complaint!")
        
        elif incomingMediaUrl:
            data["PrivateFeedback"] = incomingMediaUrl
            data["FeedbackType"] = "VOICE_NOTE"
            data["ReviewStatus"] = "DONE"
            print(f"--> Saved voice note URL: {incomingMediaUrl}")
            print(f"--> Forwarding audio link to Clinic Owner...")

# =========================================================
# SIMULATING THE REAL-WORLD TIMELINE
# =========================================================

# --- EVENT 1: User Taps "RATING_BAD" Button ---
print("--- EVENT 1: User Taps 'Bad' Button ---")
ProcessReviewEvent(MockData, incomingPayload="RATING_BAD")
print("DB State after Event 1:", MockData)

# --- EVENT 2: User Types Complaint 20 Seconds Later ---
print("\n--- EVENT 2: User Sends Text Reply ---")
ProcessReviewEvent(MockData, incomingText="The doctor was 30 minutes late and rude.")
print("DB State after Event 2:", MockData)