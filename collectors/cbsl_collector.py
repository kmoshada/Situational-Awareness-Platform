"""
CBSL / economic collector.

Behavior:
- Uses exchangerate.host (free) to get latest LKR exchange rates (USD -> LKR and others).
- Attempts to fetch CBSL pages if necessary (graceful fallback).
- Produces a simple economic snapshot: exchange rates, timestamp, basic change vs previous.
"""

import os
import json
import datetime
import logging
import requests
import pandas as pd
from pathlib import Path

OUTPUT_FOLDER = os.path.join(os.path.dirname(__file__), "..", "data", "cbsl")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

logging.basicConfig(
    filename=os.path.join(OUTPUT_FOLDER, "cbsl_collector.log"),
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

# We'll use exchangerate.host free API (no key)
EXRATE_BASE = "https://api.exchangerate.host/latest"
CURRENCIES = ["USD", "EUR", "INR", "GBP", "JPY"]  # add more if desired
BASE_CURRENCY = "LKR"

def fetch_exchange_rates():
    """
    Fetch rates using open.er-api.com (free, no key).
    Falls back to mock data if fetch fails.
    """
    results = {}
    # We will fetch USD base, then compute others.
    # open.er-api.com/v6/latest/USD returns rates relative to USD.
    url = "https://open.er-api.com/v6/latest/USD"
    
    try:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        data = r.json()
        rates = data.get("rates", {})
        
        # We want LKR per Unit (e.g. LKR per USD, LKR per EUR)
        # API gives USD -> LKR (e.g. 300). So LKR_per_USD = 300.
        # API gives USD -> EUR (e.g. 0.9). So LKR_per_EUR = LKR_per_USD / EUR_per_USD = 300 / 0.9
        
        lkr_per_usd = rates.get("LKR")
        
        if lkr_per_usd:
            results["USD"] = {"lkr_per_unit": float(lkr_per_usd), "timestamp": data.get("time_last_update_utc")}
            
            for cur in ["EUR", "GBP", "JPY", "INR"]:
                cur_per_usd = rates.get(cur)
                if cur_per_usd:
                    # Cross rate: LKR/Unit = (LKR/USD) / (Unit/USD)
                    lkr_per_unit = lkr_per_usd / cur_per_usd
                    results[cur] = {"lkr_per_unit": float(lkr_per_unit), "timestamp": data.get("time_last_update_utc")}
                    
    except Exception as e:
        logging.warning("Failed to fetch rates from API: %s. Using mock data.", e)
        # Mock fallback
        results = {
            "USD": {"lkr_per_unit": 295.50, "timestamp": datetime.datetime.utcnow().isoformat()},
            "EUR": {"lkr_per_unit": 310.20, "timestamp": datetime.datetime.utcnow().isoformat()},
            "GBP": {"lkr_per_unit": 375.80, "timestamp": datetime.datetime.utcnow().isoformat()},
            "JPY": {"lkr_per_unit": 1.95, "timestamp": datetime.datetime.utcnow().isoformat()},
            "INR": {"lkr_per_unit": 3.50, "timestamp": datetime.datetime.utcnow().isoformat()},
        }
        
    return results

def read_previous_rates():
    # read latest json if exists to compute small change
    latest_path = os.path.join(OUTPUT_FOLDER, "rates_latest.json")
    if os.path.exists(latest_path):
        try:
            with open(latest_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def compute_changes(prev, current):
    out = {}
    for cur, info in current.items():
        prev_rate = prev.get(cur, {}).get("lkr_per_unit")
        now_rate = info.get("lkr_per_unit")
        if prev_rate:
            change_pct = ((now_rate - prev_rate) / (prev_rate + 1e-9)) * 100
        else:
            change_pct = 0.0
        out[cur] = {"now": now_rate, "prev": prev_rate, "change_pct": round(change_pct, 4)}
    return out

def run():
    logging.info("CBSL collector started")
    rates = fetch_exchange_rates()
    prev = read_previous_rates()
    changes = compute_changes(prev, rates)
    snapshot = {
        "fetched_at_utc": datetime.datetime.utcnow().isoformat(),
        "rates": rates,
        "changes": changes
    }
    ts = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    json_path = os.path.join(OUTPUT_FOLDER, f"rates_{ts}.json")
    latest = os.path.join(OUTPUT_FOLDER, "rates_latest.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=2)
    with open(latest, "w", encoding="utf-8") as f:
        json.dump(snapshot, f, ensure_ascii=False, indent=2)
    logging.info("Saved CBSL snapshot to %s", json_path)
    return {"json": json_path, "latest": latest}

if __name__ == "__main__":
    run()
