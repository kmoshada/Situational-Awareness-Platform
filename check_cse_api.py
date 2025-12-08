import requests
import json
import sys

# CSE API Endpoints
ENDPOINTS = {
    "Summary": "https://www.cse.lk/api/marketSummery",
    "Status": "https://www.cse.lk/api/marketStatus",
    "Gainers": "https://www.cse.lk/api/topGainers",
    "Losers": "https://www.cse.lk/api/topLooses",
    "Prices": "https://www.cse.lk/api/todaySharePrice"
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; situational-awareness-bot/1.0)",
    "Referer": "https://www.cse.lk/",
    "Origin": "https://www.cse.lk"
}

def check_endpoint(name, url):
    print(f"\n--- Checking {name} ({url}) ---")
    try:
        response = requests.post(url, headers=HEADERS, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list):
                    print(f"Data Type: List (Length: {len(data)})")
                    if len(data) == 0:
                        print("WARNING: API returned an empty list []")
                    else:
                        print(f"Sample Item: {json.dumps(data[0], indent=2)}")
                elif isinstance(data, dict):
                    print(f"Data Type: Dict (Keys: {list(data.keys())})")
                    print(f"Content: {json.dumps(data, indent=2)}")
                else:
                    print(f"Data Type: {type(data)}")
            except json.JSONDecodeError:
                print("ERROR: Failed to decode JSON response")
                print(f"Raw Response: {response.text[:200]}...")
        else:
            print(f"ERROR: Request failed with status {response.status_code}")
            
    except Exception as e:
        print(f"ERROR: Exception occurred - {e}")

def main():
    print("Starting CSE API Health Check...")
    for name, url in ENDPOINTS.items():
        check_endpoint(name, url)
    print("\nCheck Complete.")

if __name__ == "__main__":
    main()
