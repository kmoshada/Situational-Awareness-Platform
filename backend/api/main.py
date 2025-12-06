from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import sys

# Add parent directory to path to import ml_engine
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from ml_engine import processor

app = FastAPI(title="Situational Awareness API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "active", "system": "Situational Awareness Platform"}

@app.get("/signals")
def get_signals():
    data = processor.build_overall_indicators()
    # Map to frontend expectations or return raw
    return {
        "raw_counts": {
            "news": data["news"]["headline_count"],
            "weather_alerts": len(data["weather"]["alerts"]),
            "cse_gainers": data["cse"]["gainers_count"]
        },
        "trends": [{"type": "news", "description": t["title"]} for t in data["news"].get("latest", [])],
        "anomalies": [{"type": "weather", "description": a} for a in data["weather"]["alerts"]]
    }

@app.get("/risk")
def get_risk():
    data = processor.build_overall_indicators()
    return {
        "score": data["risk_score"] / 100.0, # Normalize to 0-1
        "factors": data["weather"]["alerts"] + ([f"High Market Stress ({data['market_volatility_percent']:.0f}%)"] if data["market_volatility_percent"] > 60 else [])
    }

@app.get("/opportunities")
def get_opportunities():
    data = processor.build_overall_indicators()
    factors = []
    if data["opportunity_score"] > 50:
        factors.append("Favorable Market Conditions")
    return {
        "score": data["opportunity_score"] / 100.0,
        "factors": factors
    }

@app.get("/market")
def get_market_data():
    data = processor.get_cse_overview()
    return {
        "summary": data.get("summary"),
        "status": data.get("status"),
        "gainers": data.get("gainers"),
        "losers": data.get("losers")
    }

@app.get("/dashboard-stats")
def get_dashboard_stats():
    # New endpoint for the full indicator set
    return processor.build_overall_indicators()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
