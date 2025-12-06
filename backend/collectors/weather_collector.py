import os
import requests
import datetime
import json
import logging
import random

OUTPUT_FOLDER = os.path.join(os.path.dirname(__file__), "..", "data", "weather")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

logging.basicConfig(
    filename=os.path.join(OUTPUT_FOLDER, "weather_collector.log"),
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

# configure cities or coordinates for Sri Lanka
LOCATIONS = {
    "Colombo": {"lat": 6.9271, "lon": 79.8612},
    "Galle": {"lat": 6.0535, "lon": 80.2210},
    "Kandy": {"lat": 7.2906, "lon": 80.6337},
    "Jaffna": {"lat": 9.6615, "lon": 80.0255},
    "Trincomalee": {"lat": 8.5874, "lon": 81.2152}
}

OPENWEATHER_KEY = os.environ.get("OPENWEATHER_KEY")

def fetch_weather_for(lat, lon):
    if not OPENWEATHER_KEY:
        return None
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_KEY}&units=metric"
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        return r.json()
    except Exception as e:
        logging.error(f"Error fetching weather: {e}")
        return None

def generate_mock_weather():
    logging.info("Generating mock weather data (No API Key found)")
    weather_data = {}
    conditions = ["Sunny", "Rainy", "Cloudy", "Stormy", "Windy"]
    for city in LOCATIONS.keys():
        condition = random.choice(conditions)
        temp = random.randint(25, 35)
        alert = None
        if condition == "Stormy":
            alert = "High Wind Warning"
        elif condition == "Rainy" and random.random() > 0.7:
            alert = "Flood Warning"
            
        weather_data[city] = {
            "main": {"temp": temp},
            "weather": [{"main": condition, "description": condition}],
            "alert": alert # Custom field for mock
        }
    return weather_data

def run():
    now = datetime.datetime.utcnow().isoformat()
    result = {"fetched_at": now, "locations": {}}
    
    if OPENWEATHER_KEY:
        for name, coords in LOCATIONS.items():
            data = fetch_weather_for(coords["lat"], coords["lon"])
            if data:
                result["locations"][name] = data
            else:
                result["locations"][name] = {"error": "Failed to fetch"}
    else:
        result["locations"] = generate_mock_weather()

    # Save as weather_latest.json to match other collectors
    latest_path = os.path.join(OUTPUT_FOLDER, "weather_latest.json")
    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
        
    logging.info(f"Saved weather data to {latest_path}")
    return result

if __name__ == "__main__":
    run()
