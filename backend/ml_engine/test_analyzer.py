import sys
import os

# Add the parent directory to sys.path so we can import the backend module
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from backend.ml_engine.analyzer import detect_trends, detect_anomalies, cluster_events

# Mock Data
mock_data = {
    "news": [
        {"title": "Colombo Stock Exchange sees massive gains today"},
        {"title": "President to visit Colombo Stock Exchange tomorrow"},
        {"title": "Heavy rain expected in Colombo and Kandy"},
        {"title": "Cricket match delayed due to rain in Kandy"},
        {"title": "New economic policy announced by the Government"}
    ],
    "cse_gainers": [
        {"symbol": "JKH", "price": 150.0},
        {"symbol": "SAMP", "price": 55.0},
        {"symbol": "COMB", "price": 80.0},
        {"symbol": "HNB", "price": 120.0},
        {"symbol": "NDB", "price": 45.0},
        {"symbol": "DFCC", "price": 60.0}
    ],
    "weather": [
        {"city": "Colombo", "alert": "Flood Warning"}
    ]
}

print("--- Testing Trend Detection ---")
trends = detect_trends(mock_data)
print(trends)

print("\n--- Testing Anomaly Detection ---")
anomalies = detect_anomalies(mock_data)
print(anomalies)

print("\n--- Testing Clustering ---")
clusters = cluster_events(mock_data)
print(clusters)