"""
Traffic collector.

Behavior:
- If TOMTOM_KEY env var is present, query TomTom Traffic Incidents API for configured bbox/locations.
- Otherwise produce a simulated traffic dataset for configured Sri Lankan cities.
- Saves timestamped CSV and a latest JSON file to data/traffic/.
"""

import os
import time
import json
import logging
import datetime
import random
import requests
import pandas as pd

OUTPUT_FOLDER = os.path.join(os.path.dirname(__file__), "..", "data", "traffic")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

logging.basicConfig(
    filename=os.path.join(OUTPUT_FOLDER, "traffic_collector.log"),
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

# Basic set of Sri Lankan cities with rough centroids (lat/lon)
CITIES = {
    "Colombo": {"lat": 6.9271, "lon": 79.8612},
    "Galle": {"lat": 6.0535, "lon": 80.2210},
    "Kandy": {"lat": 7.2906, "lon": 80.6337},
    "Jaffna": {"lat": 9.6615, "lon": 80.0255},
    "Negombo": {"lat": 7.2083, "lon": 79.8358},
    "Anuradhapura": {"lat": 8.3114, "lon": 80.4037},
    "Kurunegala": {"lat": 7.4863, "lon": 80.3647},
    "Ratnapura": {"lat": 6.6828, "lon": 80.3992},
    "Matara": {"lat": 5.9549, "lon": 80.5550},
    "Badulla": {"lat": 6.9934, "lon": 81.0550}
}

TOMTOM_KEY = os.environ.get("TOMTOM_KEY")  # optional

def simulate_traffic():
    """Return a list of simulated traffic records per city."""
    records = []
    now = datetime.datetime.utcnow().isoformat()
    for name, coords in CITIES.items():
        # congestion: 0-100
        base = random.uniform(10, 40)
        # simulate higher congestion at plausible "rush hours" (UTC offset applied roughly)
        hour_local = (datetime.datetime.utcnow().hour + 5) % 24  # Sri Lanka UTC+5:30 ~ +5 or +6 hours approximated
        if 6 <= hour_local <= 9 or 16 <= hour_local <= 19:
            base += random.uniform(20, 30)
        congestion = min(100, max(0, base + random.uniform(-5, 10)))
        incident_count = random.randint(0, 5) if congestion > 40 else random.randint(0, 2)
        records.append({
            "city": name,
            "lat": coords["lat"],
            "lon": coords["lon"],
            "congestion_percent": round(congestion, 1),
            "incident_count": incident_count,
            "fetched_at_utc": now,
            "source": "simulated"
        })
    return records

def fetch_tomtom_incidents():
    """
    Query TomTom Traffic Incidents API (requires TOMTOM_KEY).
    We will query a bounding box per city (small box).
    """
    results = []
    if not TOMTOM_KEY:
        return results
    for city, coords in CITIES.items():
        lat = coords["lat"]
        lon = coords["lon"]
        # small box ~ +-0.05 degrees
        min_lat = lat - 0.05
        max_lat = lat + 0.05
        min_lon = lon - 0.05
        max_lon = lon + 0.05
        bbox = f"{min_lat},{min_lon},{max_lat},{max_lon}"
        url = f"https://api.tomtom.com/traffic/services/4/incidentDetails?key={TOMTOM_KEY}&bbox={bbox}"
        try:
            r = requests.get(url, timeout=10)
            r.raise_for_status()
            data = r.json()
            incidents = data.get("incidents", []) if isinstance(data, dict) else []
            # derive a congestion-like score from incident count
            incident_count = len(incidents)
            congestion = min(100, 10 + incident_count * 15)
            results.append({
                "city": city,
                "lat": lat,
                "lon": lon,
                "congestion_percent": congestion,
                "incident_count": incident_count,
                "source": "tomtom",
                "raw_incidents_count": incident_count,
                "fetched_at_utc": datetime.datetime.utcnow().isoformat()
            })
        except Exception as e:
            logging.warning("TomTom fetch failed for %s: %s", city, e)
    return results

def save_records(records, name="traffic"):
    if not records:
        logging.info("No traffic records to save")
        return None
    df = pd.DataFrame(records)
    ts = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    csv_path = os.path.join(OUTPUT_FOLDER, f"{name}_{ts}.csv")
    json_latest = os.path.join(OUTPUT_FOLDER, f"{name}_latest.json")
    df.to_csv(csv_path, index=False)
    df.to_json(json_latest, orient="records", date_format="iso")
    logging.info("Saved traffic data to %s and %s", csv_path, json_latest)
    return {"csv": csv_path, "json": json_latest}

def run():
    logging.info("Traffic collector started")
    records = []
    if TOMTOM_KEY:
        records = fetch_tomtom_incidents()
        # if TomTom returned nothing, fall back to simulation to ensure something exists
        if not records:
            logging.info("TomTom returned no incidents; falling back to simulated traffic")
            records = simulate_traffic()
    else:
        logging.info("TOMTOM_KEY not configured — using simulated traffic")
        records = simulate_traffic()
    out = save_records(records)
    logging.info("Traffic collector finished")
    return out

if __name__ == "__main__":
    run()
