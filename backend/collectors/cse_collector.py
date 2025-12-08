import requests
import pandas as pd
import os
import datetime
import time
import logging
import json

import glob

OUTPUT_FOLDER = os.path.join(os.path.dirname(__file__), "..", "data", "cse")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

endpoints = {
    "summary": "https://www.cse.lk/api/marketSummery",
    "status": "https://www.cse.lk/api/marketStatus",
    "prices": "https://www.cse.lk/api/todaySharePrice",
    "gainers": "https://www.cse.lk/api/topGainers",
    "losers": "https://www.cse.lk/api/topLooses",
    "indices": "https://www.cse.lk/api/marketIndices"
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; situational-awareness-bot/1.0)",
    "Referer": "https://www.cse.lk/",
    "Origin": "https://www.cse.lk"
}

logging.basicConfig(
    filename=os.path.join(OUTPUT_FOLDER, "cse_collector.log"),
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

def get_latest_saved_data(name):
    """Retrieves the latest saved CSV for a given endpoint name."""
    pattern = os.path.join(OUTPUT_FOLDER, f"{name}_*.csv")
    files = glob.glob(pattern)
    if not files:
        return None
    
    # Sort by modification time, newest first
    files.sort(key=os.path.getmtime, reverse=True)
    latest_file = files[0]
    
    try:
        logging.info("Loading fallback data from %s", latest_file)
        df = pd.read_csv(latest_file)
        return df
    except Exception as e:
        logging.error("Failed to load fallback data from %s: %s", latest_file, e)
        return None

def safe_post(url, headers=HEADERS, retries=3, timeout=10):
    for attempt in range(1, retries + 1):
        try:
            res = requests.post(url, headers=headers, timeout=timeout)
            res.raise_for_status()
            return res
        except Exception as e:
            logging.warning("Attempt %d failed for %s: %s", attempt, url, e)
            if attempt < retries:
                time.sleep(2 ** attempt)
    raise RuntimeError(f"All {retries} attempts failed for {url}")

def fetch_and_save(name, url):
    logging.info("Fetching %s from %s", name, url)
    try:
        res = safe_post(url)
        data = res.json()

        # Determine DataFrame
        df = None
        if isinstance(data, list):
            df = pd.DataFrame(data)
            logging.info("Fetched list with %d rows", len(df))
        elif isinstance(data, dict):
            # attempt to extract inner list
            found_list = False
            for k, v in data.items():
                if isinstance(v, list) and len(v) >= 1:
                    df = pd.DataFrame(v)
                    logging.info("Extracted list from key %s with %d rows", k, len(df))
                    found_list = True
                    break
            if not found_list:
                df = pd.DataFrame([data])
                logging.info("Saved dict as single-row DataFrame")

        if df is not None and not df.empty:
            ts = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
            df["fetched_at_utc"] = datetime.datetime.utcnow().isoformat()
            csv_path = os.path.join(OUTPUT_FOLDER, f"{name}_{ts}.csv")
            df.to_csv(csv_path, index=False)
            # also save latest JSON shard for quick API access
            latest_json_path = os.path.join(OUTPUT_FOLDER, f"{name}_latest.json")
            df.to_json(latest_json_path, orient="records", date_format="iso")
            logging.info("Saved to %s and %s", csv_path, latest_json_path)
            return {"csv": csv_path, "json": latest_json_path}
        else:
            logging.warning("No usable data found for %s (df empty)", name)
            # Fallback to Saved Data if API returns empty
            logging.info("Attempting to load saved data for %s", name)
            df = get_latest_saved_data(name)
            
            if df is not None and not df.empty:
                # We don't save a new CSV, but we do update the 'latest.json' so the API serves this old data
                latest_json_path = os.path.join(OUTPUT_FOLDER, f"{name}_latest.json")
                df.to_json(latest_json_path, orient="records", date_format="iso")
                logging.info("Restored saved data to %s", latest_json_path)
                return {"csv": "restored_from_cache", "json": latest_json_path}
            return None
    except Exception as ex:
        logging.exception("Failed fetching %s: %s", name, ex)
        return None

def run():
    logging.info("CSE collector started")
    results = {}
    for name, url in endpoints.items():
        out = fetch_and_save(name, url)
        results[name] = out
    logging.info("CSE collector finished")
    return results

if __name__ == "__main__":
    run()
