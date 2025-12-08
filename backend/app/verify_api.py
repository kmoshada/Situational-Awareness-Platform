import sys
import os
from fastapi.testclient import TestClient

# Add project root to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

try:
    from backend.app.main import app
except ImportError as e:
    print(f"Error importing app: {e}")
    sys.exit(1)

client = TestClient(app)

print("--- Testing /api/signals ---")
try:
    response = client.get("/api/signals")
    if response.status_code == 200:
        data = response.json()
        print("Success!")
        print("Trends:", data.get("trends"))
        print("Anomalies:", data.get("anomalies"))
        print("Clusters:", data.get("clusters"))
        
        # Validation
        if "trends" in data and "anomalies" in data and "clusters" in data:
            print("\nVerification PASSED: All ML fields are present.")
        else:
            print("\nVerification FAILED: Missing ML fields.")
    else:
        print(f"Failed with status code: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Error calling API: {e}")
