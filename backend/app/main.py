from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .processors import build_overall_indicators, get_cse_overview
import threading
import subprocess
import time
import sys
import os
from pathlib import Path

app = FastAPI(title="Situational Awareness API")

# Calculate absolute path to collectors directory
# main.py is in backend/app/main.py -> ../../.. is project root
BASE_DIR = Path(__file__).resolve().parent.parent.parent
COLLECTORS_DIR = BASE_DIR / "collectors"

def run_collectors_loop():
    """Runs data collectors in a background loop every 5 minutes."""
    while True:
        try:
            print(f"Running collectors from {COLLECTORS_DIR}...")
            subprocess.run([sys.executable, str(COLLECTORS_DIR / "traffic_collector.py")])
            subprocess.run([sys.executable, str(COLLECTORS_DIR / "cbsl_collector.py")])
            subprocess.run([sys.executable, str(COLLECTORS_DIR / "events_collector.py")])
            subprocess.run([sys.executable, str(COLLECTORS_DIR / "cse_collector.py")])
            print("Collectors finished. Sleeping for 5 minutes.")
        except Exception as e:
            print(f"Error running collectors: {e}")
        time.sleep(300)

@app.on_event("startup")
def startup_event():
    # Start collectors in a background thread
    # thread = threading.Thread(target=run_collectors_loop, daemon=True)
    # thread.start()
    pass

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "time": __import__("datetime").datetime.utcnow().isoformat()}

@app.get("/signals")
def signals():
    indicators = build_overall_indicators()
    # Ensure frontend compatibility by adding expected fields if missing
    # Frontend expects: raw_counts, trends, anomalies in 'signals' endpoint? 
    # Actually frontend calls /signals, /risk, /opportunities separately.
    # But if we want to follow user's single endpoint design, we might need to update frontend.
    # For now, I will keep this returning the full object, and add the specific endpoints below.
    
    # Add fields expected by frontend's Dashboard.tsx for 'signals' state
    indicators["raw_counts"] = {
        "news": indicators["news"]["headline_count"],
        "weather_alerts": len(indicators["weather"]["alerts"]),
        "cse_gainers": indicators["cse"]["gainers_count"]
    }
    indicators["trends"] = [{"type": "news", "description": t["title"]} for t in indicators["news"].get("latest", [])]
    # Weather alerts are already covered in 'risk' factors, so we don't need them in anomalies to avoid duplicates
    indicators["anomalies"] = []
    
    if indicators["market_anomaly"]["detected"]:
        indicators["anomalies"].append({"type": "market", "description": "Abnormal market movement detected"})

    return indicators

@app.get("/risk")
def get_risk():
    data = build_overall_indicators()
    factors = data["weather"]["alerts"][:]
    if data["market_volatility_percent"] > 60:
        factors.append(f"High Market Stress ({data['market_volatility_percent']:.0f}%)")
    if data["market_anomaly"]["detected"]:
        factors.append("Market Anomaly Detected")
        
    return {
        "score": data["risk_score"] / 100.0,
        "factors": factors
    }

@app.get("/opportunities")
def get_opportunities():
    data = build_overall_indicators()
    factors = []
    if data["opportunity_score"] > 50:
        factors.append("Favorable Market Conditions")
    return {
        "score": data["opportunity_score"] / 100.0,
        "factors": factors
    }

@app.get("/market")
def get_market_data():
    data = get_cse_overview()
    return {
        "summary": data.get("summary"),
        "status": data.get("status"),
        "gainers": data.get("gainers"),
        "losers": data.get("losers")
    }

@app.get("/")
def root():
    return {"message": "Situational Awareness Backend running"}
