import random
import time
import requests  # Make sure requests is in requirements.txt


def send_whatsapp_reminder(phone: str, name: str, date: str, time_slot: str):
  # Jitter delay (2-4s) to keep messaging looking human and safe
  time.sleep(random.uniform(2.0, 4.0))

  msg = (
      f"Bonjour {name} 👋,\n\n"
      f"Votre rendez-vous est confirmé pour le *{date}* à *{time_slot}*.\n\n"
      "Merci de répondre *1* pour confirmer ou *2* pour reporter."
  )

  try:
    response = requests.post(
        "http://localhost:3000/send-message",
        json={"phone": phone, "message": msg},
        timeout=5,
    )
    if response.status_code == 200:
      print(f"📱 [WHATSAPP DELIVERED] -> {phone}")
      return True
    else:
      print(f"⚠️ Gateway Error ({response.status_code}): {response.text}")
      return False
  except Exception as e:
    print(f"❌ Could not reach WA Gateway on port 3000: {e}")
    return False