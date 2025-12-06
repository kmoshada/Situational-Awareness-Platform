import random

def detect_trends(data):
    # Mock trend detection
    trends = []
    
    # News trends
    news = data.get("news", [])
    if news:
        # Simple frequency count of words in titles (Mock NLP)
        all_text = " ".join([n.get("title", "") for n in news])
        # In a real app, use NLTK/Spacy here
        trends.append({"type": "news", "description": f"Latest headlines: {news[0].get('title', 'No news')[:50]}..."})
        
    # CSE Trends
    gainers = data.get("cse_gainers", [])
    if len(gainers) > 5:
        trends.append({"type": "market", "description": "Strong buying momentum detected"})
        
    return trends

def detect_anomalies(data):
    anomalies = []
    
    # Weather anomalies
    weather = data.get("weather", [])
    for w in weather:
        if w.get("alert"):
            anomalies.append({"type": "weather", "severity": "High", "description": f"{w['alert']} in {w['city']}"})
            
    # Market anomalies (Mock)
    # In real world, use Isolation Forest on price streams
    if random.random() > 0.8:
         anomalies.append({"type": "market", "severity": "Medium", "description": "Unusual trading volume detected"})
         
    return anomalies

def cluster_events(data):
    # Mock clustering
    return ["Cluster A: Politics & Economy", "Cluster B: Sports & Entertainment"]
