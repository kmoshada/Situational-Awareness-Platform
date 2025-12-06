import os
import json
import pandas as pd
from datetime import datetime
import logging
from .ml_engine import detect_market_anomaly, compute_rolling_trend

# Adjusted base path to match my project structure
# Adjusted base path to match my project structure
BASE = os.path.join(os.path.dirname(__file__), "..", "data")

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
    summary_data = read_latest_json("cse", "summary_latest.json")
    summary = {}
    if isinstance(summary_data, list) and len(summary_data) > 0:
        summary = summary_data[0]
    elif isinstance(summary_data, dict):
        summary = summary_data

    status = read_latest_json("cse", "status_latest.json") or {}
    prices = read_latest_json("cse", "prices_latest.json") or []
    gainers = read_latest_json("cse", "gainers_latest.json") or []
    losers = read_latest_json("cse", "losers_latest.json") or []
    indices = read_latest_json("cse", "indices_latest.json") or []

    # derive simple metrics
    index_val = None
    
    # Try to get ASPI from indices first
    if isinstance(indices, list):
        for idx in indices:
            if "ASPI" in idx.get("indexName", "") or "All Share" in idx.get("indexName", ""):
                try:
                    index_val = float(idx.get("value", 0))
                    break
                except:
                    pass

    # Fallback to summary if not found
    if index_val is None:
        try:
            if isinstance(summary, dict):
                for k in ["aspi", "ASPI", "marketIndex", "index"]:
                    if k in summary:
                        try:
                            index_val = float(summary[k])
                            break
                        except Exception:
                            pass
        except:
            pass

    metrics = {
        "index": index_val,
        "gainers_count": len(gainers),
        "losers_count": len(losers),
        "prices_count": len(prices),
        "status": status,
        "summary": summary,
        "gainers": gainers,
        "losers": losers,
        "prices": prices
    }

    return metrics

def get_news_overview():
    news = read_latest_json("news", "news_latest.json")
    count = 0
    sources = []
    latest = []
    
    if isinstance(news, list):
        count = len(news)
        sources = list(set(item.get("source", "Unknown") for item in news))
        latest = news[:5]
    elif isinstance(news, dict):
        for k, v in news.items():
            count += len(v) if isinstance(v, list) else 0
            sources.append(k)
            
    return {"headline_count": count, "sources": sources, "latest": latest}

def get_weather_overview():
    weather = read_latest_json("weather", "weather_latest.json")
    severity = 0
    alerts = []
    
    summaries = []
    if weather and "locations" in weather:
        for name, loc in weather["locations"].items():
            if "error" in loc:
                continue
            
            # Extract basic info
            temp = loc.get("main", {}).get("temp", "N/A")
            condition = "Unknown"
            weather_desc = loc.get("weather", [])
            if weather_desc:
                condition = weather_desc[0].get("main", "Unknown")

            summaries.append({
                "city": name,
                "temp": temp,
                "condition": condition
            })

            if loc.get("alert"):
                severity += 3
                alerts.append(f"{name}: {loc['alert']}")
                
            desc = condition.lower()
            if "rain" in desc or "storm" in desc or "thunder" in desc:
                severity += 1
                    
    return {"severity": severity, "raw": weather, "alerts": alerts, "summaries": summaries}

def get_traffic_overview():
    traffic = read_latest_json("traffic", "traffic_latest.json") or []
    # traffic is a list of dicts: {city, congestion_percent, incident_count, ...}
    
    high_congestion_count = 0
    total_congestion = 0
    details = []
    
    if isinstance(traffic, list):
        for t in traffic:
            cong = t.get("congestion_percent", 0)
            total_congestion += cong
            if cong > 60:
                high_congestion_count += 1
                details.append(f"High traffic in {t.get('city')} ({cong}%)")
                
    avg_congestion = total_congestion / len(traffic) if traffic else 0
    
    return {
        "avg_congestion": avg_congestion,
        "high_congestion_count": high_congestion_count,
        "details": details,
        "raw": traffic
    }

def get_cbsl_overview():
    data = read_latest_json("cbsl", "rates_latest.json") or {}
    # Extract USD rate
    usd_rate = 0
    if "rates" in data and "USD" in data["rates"]:
        usd_rate = data["rates"]["USD"].get("lkr_per_unit", 0)
    return {"usd_rate": usd_rate, "raw": data}

def get_events_overview():
    data = read_latest_json("events", "events_latest.json") or {}
    # Check for upcoming holidays
    holidays = data.get("nager_holidays", []) or data.get("fallback", [])
    upcoming = []
    today = datetime.utcnow().strftime("%Y-%m-%d")
    
    for h in holidays:
        # Simple string comparison for upcoming
        if h.get("date", "") >= today:
            upcoming.append({
                "name": h.get("name") or h.get("localName"),
                "date": h.get("date")
            })
            if len(upcoming) >= 10: break
            
    return {"upcoming": upcoming, "count": len(holidays)}

def build_overall_indicators():
    cse = get_cse_overview()
    news = get_news_overview()
    weather = get_weather_overview()
    traffic = get_traffic_overview()
    cbsl = get_cbsl_overview()
    events = get_events_overview()

    # National activity
    activity_score = min(100, int((news.get("headline_count", 0) / 20) * 100))
    if cse.get("gainers_count", 0) + cse.get("losers_count", 0) > 10:
        activity_score = min(100, activity_score + 10)

    # Market volatility
    mv = 0
    try:
        total_moves = cse["gainers_count"] + cse["losers_count"]
        if total_moves > 0:
            mv = (cse["losers_count"] / max(1, total_moves)) * 100
    except Exception:
        mv = 0

    # ML Anomaly Detection
    current_index = cse.get("index", 0) or 10000
    
    # Try to load recent history from CSVs for real anomaly detection
    # For now, if no history, we just check against the current value (simplified)
    # or skip anomaly detection to avoid fake positives.
    
    # TODO: Implement proper history loading from data/cse/*.csv
    real_history = [current_index] 
    
    is_anom, anom_score = detect_market_anomaly(real_history)
    
    # Risk score
    risk_score = 0
    risk_score += weather.get("severity", 0) * 10 
    risk_score += (traffic["avg_congestion"] / 100) * 20 
    risk_score += (mv / 100) * 20 
    risk_score += (activity_score / 100) * 10 
    
    # Economic risk (High USD rate = risk? or volatility?)
    # For now, just add a small factor if USD > 300 (Mock threshold)
    if cbsl["usd_rate"] > 300:
        risk_score += 10
        
    if is_anom:
        risk_score += 20
        
    risk_score = min(100, int(risk_score))

    # Opportunity score
    opp_score = 0
    if cse.get("gainers_count", 0) > cse.get("losers_count", 0):
        opp_score += 30
    if activity_score > 50:
        opp_score += 10
    if weather.get("severity", 0) == 0:
        opp_score += 10
    if traffic["avg_congestion"] < 30:
        opp_score += 10
    if events["upcoming"]:
        opp_score += 20 # Events bring business opportunities

    return {
        "national_activity_score": activity_score,
        "market_volatility_percent": mv,
        "risk_score": risk_score,
        "opportunity_score": opp_score,
        "cse": cse,
        "news": news,
        "weather": weather,
        "traffic": traffic,
        "cbsl": cbsl,
        "events": events,
        "market_anomaly": {"detected": is_anom, "score": anom_score}
    }
