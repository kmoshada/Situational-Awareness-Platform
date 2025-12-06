"""
Events collector.

Behavior:
- Attempts to fetch public holidays for Sri Lanka using the free Nager.Date API.
- If GOOGLE_CALENDAR_URL env var is provided and reachable, attempts to fetch that feed (expects JSON or ICS).
- Falls back to a small built-in list of recurring events.
- Saves a timestamped JSON and a latest JSON file.
"""

import os
import requests
import json
import datetime
import logging

OUTPUT_FOLDER = os.path.join(os.path.dirname(__file__), "..", "data", "events")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

logging.basicConfig(
    filename=os.path.join(OUTPUT_FOLDER, "events_collector.log"),
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

NAGER_API = "https://date.nager.at/api/v3/PublicHolidays"
COUNTRY_CODE = "LK"  # Sri Lanka

GOOGLE_CALENDAR_URL = os.environ.get("GOOGLE_CALENDAR_URL")  # optional public calendar URL (JSON/ICS)

def fetch_public_holidays(year=None):
    year = year or datetime.datetime.utcnow().year
    try:
        url = f"{NAGER_API}/{year}/{COUNTRY_CODE}"
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()
        # Data is list of objects: date, localName, name, countryCode, fixed, global...
        return data
    except Exception as e:
        logging.warning("Failed to fetch Nager.Date holidays: %s", e)
        return []

def fetch_google_calendar(url):
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        # try JSON first
        try:
            return r.json()
        except Exception:
            # if ICS returned, save raw and return as text entry
            return {"raw": r.text}
    except Exception as e:
        logging.warning("Failed to fetch Google Calendar feed: %s", e)
        return None

FALLBACK_EVENTS = [
    {"date": "YYYY-MM-DD", "name": "Poya Day (recurring; see schedule)"},
    {"date": "2025-12-25", "name": "Christmas Day"},
    {"date": "2025-04-14", "name": "Sinhala & Tamil New Year"},
    {"date": "2025-02-04", "name": "Independence Day (observed)"},
]

def run():
    logging.info("Events collector started")
    year = datetime.datetime.utcnow().year
    holidays = fetch_public_holidays(year)
    calendar = None
    if GOOGLE_CALENDAR_URL:
        calendar = fetch_google_calendar(GOOGLE_CALENDAR_URL)

    result = {
        "fetched_at_utc": datetime.datetime.utcnow().isoformat(),
        "year": year,
        "nager_holidays": holidays,
        "google_calendar": calendar,
    }

    # if no holidays found, use fallback small list
    if not holidays:
        logging.info("No holidays fetched from Nager.Date; using fallback events")
        result["fallback"] = FALLBACK_EVENTS

    ts = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    json_path = os.path.join(OUTPUT_FOLDER, f"events_{ts}.json")
    latest = os.path.join(OUTPUT_FOLDER, "events_latest.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    with open(latest, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    logging.info("Saved events snapshot to %s", json_path)
    logging.info("Events collector finished")
    return {"json": json_path, "latest": latest}

if __name__ == "__main__":
    run()
