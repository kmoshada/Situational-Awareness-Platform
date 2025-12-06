import os
import json
import pandas as pd
from datetime import datetime
import logging

# Adjusted base path to match my project structure
BASE = os.path.join(os.path.dirname(__file__), "..", "..", "data")

def read_latest_json(category, filename):
    path = os.path.join(BASE, category, filename)
    if not os.path.exists(path):
        return None
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logging.error(f"Error reading {path}: {e}")
        return None

def get_cse_overview():
    # read latest summary/status/prices JSON saved by collector
    summary = read_latest_json("cse", "summary_latest.json") or {}
    status = read_latest_json("cse", "status_latest.json") or {}
    prices = read_latest_json("cse", "prices_latest.json") or []
    gainers = read_latest_json("cse", "gainers_latest.json") or []
    losers = read_latest_json("cse", "losers_latest.json") or []

    # derive simple metrics
    index_val = None
    try:
        # summary sometimes contains 'aspi' or 'marketIndex' - inspect keys
        if isinstance(summary, dict):
            for k in ["aspi", "ASPI", "marketIndex", "index"]:
                if k in summary:
                    try:
                        index_val = float(summary[k])
                        break
                    except Exception:
                        pass
        # fallback: check summary with list
        if index_val is None and isinstance(prices, list) and len(prices) > 0:
            index_val = None # Could calculate from prices if needed

        metrics = {
            "index": index_val,
            "gainers_count": len(gainers),
            "losers_count": len(losers),
            "prices_count": len(prices),
            "status": status,
            "summary": summary,
            "gainers": gainers, # Added to pass through for frontend
            "losers": losers    # Added to pass through for frontend
        }
    except Exception:
        metrics = {"index": index_val, "gainers_count": len(gainers), "losers_count": len(losers), "status": {}, "summary": {}, "gainers": [], "losers": []}

    return metrics

def get_news_overview():
    # My collector saves as a LIST in news_latest.json
    news = read_latest_json("news", "news_latest.json")
    
    count = 0
    sources = []
    
    if isinstance(news, list):
        count = len(news)
        sources = list(set(item.get("source", "Unknown") for item in news))
    elif isinstance(news, dict):
        # Fallback for user's expected format if I switch back
        for k, v in news.items():
            count += len(v) if isinstance(v, list) else 0
            sources.append(k)
            
    return {"headline_count": count, "sources": sources, "latest": news[:5] if isinstance(news, list) else []}

def get_weather_overview():
    weather = read_latest_json("weather", "weather_latest.json")
    # quick severity estimate - check for 'weather alerts' or heavy rain
    severity = 0
    alerts = []
    
    if weather and "locations" in weather:
        for name, loc in weather["locations"].items():
            if "error" in loc:
                continue
            
            # Check for custom 'alert' field from my mock
            if loc.get("alert"):
                severity += 3
                alerts.append(f"{name}: {loc['alert']}")
                
            main = loc.get("weather", [])
            if main:
                # detect rain keywords
                desc = main[0].get("main", "").lower()
                if "rain" in desc or "storm" in desc or "thunder" in desc:
                    severity += 1
                    
    return {"severity": severity, "raw": weather, "alerts": alerts}

def build_overall_indicators():
    cse = get_cse_overview()
    news = get_news_overview()
    weather = get_weather_overview()

    # National activity roughly from news count + market moves
    activity_score = min(100, int((news.get("headline_count", 0) / 20) * 100)) # Adjusted denominator for demo
    if cse.get("gainers_count", 0) + cse.get("losers_count", 0) > 10: # Adjusted threshold
        activity_score = min(100, activity_score + 10)

    # Market volatility (simple): ratio of losers/gainers
    mv = 0
    try:
        total_moves = cse["gainers_count"] + cse["losers_count"]
        if total_moves > 0:
            # Simple volatility: just activity? Or imbalance?
            # User's logic: losers / total. This is more "bearishness" than volatility.
            # Let's use |gainers - losers| / total as "imbalance" or just total count as "volatility"
            # Sticking to user's code for now but maybe it meant something else.
            # "mv = (cse["losers_count"] / max(1, cse["gainers_count"] + cse["losers_count"])) * 100"
            # This calculates percentage of losers. High losers != High volatility necessarily.
            # But I will use it as "Market Stress" maybe?
            mv = (cse["losers_count"] / max(1, total_moves)) * 100
    except Exception:
        mv = 0

    # risk score: weather severity + market volatility scaled + activity
    # User: weather * 10 + mv * 0.5 + activity * 0.2
    risk_score = min(100, int(weather.get("severity", 0) * 10 + mv * 0.5 + activity_score * 0.2))
    
    # Opportunity score (My addition to keep frontend happy)
    opp_score = 0
    if cse.get("gainers_count", 0) > cse.get("losers_count", 0):
        opp_score += 40
    if activity_score > 50:
        opp_score += 20
    if weather.get("severity", 0) == 0:
        opp_score += 20

    return {
        "national_activity_score": activity_score,
        "market_volatility_percent": mv,
        "risk_score": risk_score,
        "opportunity_score": opp_score, # Added
        "cse": cse,
        "news": news,
        "weather": weather
    }
