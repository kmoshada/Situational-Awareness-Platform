import random
import numpy as np
from collections import Counter

# Optional imports with graceful degradation
try:
    import spacy
    try:
        nlp = spacy.load("en_core_web_sm")
    except OSError:
        print("Warning: Spacy model 'en_core_web_sm' not found. Run 'python -m spacy download en_core_web_sm'")
        nlp = None
except (ImportError, RuntimeError, Exception) as e:
    print(f"Warning: Spacy import failed ({e}). Trend detection will be limited.")
    spacy = None
    nlp = None

try:
    from sklearn.ensemble import IsolationForest
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.cluster import KMeans
    SKLEARN_AVAILABLE = True
except (ImportError, Exception) as e:
    print(f"Warning: Scikit-learn import failed ({e}). Anomaly detection and clustering will be disabled.")
    SKLEARN_AVAILABLE = False

def detect_trends(data):
    """
    Detects trends using Spacy NER to find frequent entities in news.
    """
    trends = []
    news = data.get("news", [])
    
    if not news or not nlp:
        return trends

    # Combine titles for analysis
    titles = [n.get("title", "") for n in news]
    text = " ".join(titles)
    
    doc = nlp(text)
    
    # Extract interesting entities (Organizations, Countries, People, Events)
    target_labels = ["ORG", "GPE", "PERSON", "EVENT", "PRODUCT"]
    entities = [ent.text for ent in doc.ents if ent.label_ in target_labels]
    
    # Find most common entities
    if entities:
        common_entities = Counter(entities).most_common(5)
        for entity, count in common_entities:
            trends.append({
                "type": "entity_trend", 
                "description": f"High chatter about {entity} ({count} mentions)",
                "entity": entity,
                "count": count
            })
            
    # Fallback/Additional: Market trends
    gainers = data.get("cse_gainers", [])
    if len(gainers) > 5:
        trends.append({"type": "market", "description": "Strong buying momentum detected in CSE"})

    return trends

def detect_anomalies(data):
    """
    Detects anomalies using Isolation Forest on numerical data.
    """
    anomalies = []
    
    # 1. Weather Anomalies (Rule-based)
    weather = data.get("weather", [])
    for w in weather:
        if w.get("alert"):
            anomalies.append({"type": "weather", "severity": "High", "description": f"{w['alert']} in {w['city']}"})
            
    # 2. Market Anomalies (Isolation Forest)
    if not SKLEARN_AVAILABLE:
        return anomalies

    # In a real scenario, we'd fetch historical price data. 
    # Here, we simulate a stream of prices to demonstrate the logic.
    
    # Simulate historical data (normal distribution) + current point
    # Let's assume we are tracking a specific index or stock
    mock_history = np.random.normal(loc=100, scale=5, size=100)
    
    # Add a potential anomaly from the current data if available
    current_price = 100 # Default
    if data.get("cse_gainers"):
        # Just taking the first gainer's price as a sample point to check
        try:
            current_price = float(data["cse_gainers"][0].get("price", 100))
        except (ValueError, TypeError):
            pass
            
    # Combine history and current point
    data_points = np.append(mock_history, current_price).reshape(-1, 1)
    
    # Train Isolation Forest
    clf = IsolationForest(contamination=0.05, random_state=42)
    clf.fit(data_points)
    
    # Predict on the last point (current_price)
    # -1 is anomaly, 1 is normal
    prediction = clf.predict([data_points[-1]])[0]
    
    if prediction == -1:
        anomalies.append({
            "type": "market_anomaly", 
            "severity": "Medium", 
            "description": f"Unusual price level detected: {current_price}"
        })
         
    return anomalies

def cluster_events(data):
    """
    Clusters news events using TF-IDF and K-Means.
    """
    if not SKLEARN_AVAILABLE:
        return ["Clustering disabled (Scikit-learn missing)"]

    news = data.get("news", [])
    if len(news) < 3:
        return ["Not enough data to cluster"]
        
    titles = [n.get("title", "") for n in news]
    
    # Vectorize text
    vectorizer = TfidfVectorizer(stop_words='english')
    try:
        X = vectorizer.fit_transform(titles)
    except ValueError:
        return ["Clustering failed (empty vocabulary)"]
    
    # Cluster (adjust K based on data size, here K=3 for demo)
    k = min(3, len(titles))
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X)
    
    clusters = {}
    for i, label in enumerate(kmeans.labels_):
        if label not in clusters:
            clusters[label] = []
        clusters[label].append(titles[i])
        
    # Format output
    result = []
    for label, items in clusters.items():
        # Just taking the first item as a representative "topic" for now
        topic = items[0][:30] + "..." if len(items[0]) > 30 else items[0]
        result.append(f"Cluster {label+1}: {topic} ({len(items)} items)")
        
    return result
