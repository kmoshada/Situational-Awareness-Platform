def calculate_risk_score(data, anomalies):
    # risk_score = 0.3*news_spike + 0.2*weather_severity + 0.2*traffic_disruption + 0.2*market_volatility + 0.1*sentiment_drop
    
    score = 0.0
    details = []
    
    # 1. News Spike (Mock: based on count)
    news_count = len(data.get("news", []))
    if news_count > 10:
        score += 0.3 * 1.0
        details.append("High news volume")
    else:
        score += 0.3 * 0.5
        
    # 2. Weather Severity
    weather_alerts = [w for w in data.get("weather", []) if w.get("alert")]
    if weather_alerts:
        score += 0.2 * 1.0
        details.append(f"{len(weather_alerts)} weather alerts")
        
    # 3. Traffic
    severe_traffic = [t for t in data.get("traffic", []) if t.get("congestion") == "Severe"]
    if severe_traffic:
        score += 0.2 * 1.0
        details.append("Severe traffic congestion")
        
    # 4. Market Volatility (Mock)
    # Assume high volatility for demo if random > 0.5
    import random
    if random.random() > 0.5:
        score += 0.2 * 0.8
        details.append("Elevated market volatility")
        
    # 5. Sentiment
    # Calculate avg sentiment
    news = data.get("news", [])
    if news:
        avg_sentiment = sum(n["sentiment_score"] for n in news) / len(news)
        if avg_sentiment < -0.2:
            score += 0.1 * 1.0
            details.append("Negative public sentiment")
            
    return {"score": min(score, 1.0), "factors": details}

def calculate_opportunity_score(data):
    # opportunity_score = 0.4*event_importance + 0.3*sentiment_rise + 0.3*CSE_sector_strength
    
    score = 0.0
    details = []
    
    # 1. Events
    events = data.get("events", [])
    if events:
        score += 0.4 * 1.0
        details.append(f"Upcoming major events: {events[0]['event_name']}")
        
    # 2. Sentiment
    news = data.get("news", [])
    if news:
        avg_sentiment = sum(n["sentiment_score"] for n in news) / len(news)
        if avg_sentiment > 0.2:
            score += 0.3 * 1.0
            details.append("Positive public sentiment")
            
    # 3. CSE Strength (Mock)
    gainers = data.get("cse_gainers", [])
    if len(gainers) > 3:
        score += 0.3 * 1.0
        details.append("Strong market performance")
        
    return {"score": min(score, 1.0), "factors": details}
