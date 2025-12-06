import feedparser
import os
import datetime
import json
import logging

OUTPUT_FOLDER = os.path.join(os.path.dirname(__file__), "..", "data", "news")
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

logging.basicConfig(
    filename=os.path.join(OUTPUT_FOLDER, "news_collector.log"),
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)

# Add Sri Lankan news RSS feeds here
RSS_FEEDS = {
    "ada_derana": "https://www.adaderana.lk/rss.php",
    "daily_mirror": "https://www.dailymirror.lk/rss",
    # add more feeds if needed
}

def fetch_feed(name, url):
    logging.info(f"Fetching {name} from {url}")
    d = feedparser.parse(url)
    items = []
    for e in d.entries[:20]: # Limit to 20 for now
        items.append({
            "source": name, # Added source field for easier processing
            "title": e.get("title"),
            "link": e.get("link"),
            "published": e.get("published"),
            "summary": e.get("summary", ""),
            "sentiment_score": 0.0 # Placeholder for now, could use NLTK/TextBlob later
        })
    return items

def run():
    logging.info("News collector started")
    now = datetime.datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    all_items = [] # Changed to list for easier consumption by processor
    
    for name, url in RSS_FEEDS.items():
        try:
            items = fetch_feed(name, url)
            all_items.extend(items)
            
            # Save individual feed
            path = os.path.join(OUTPUT_FOLDER, f"{name}_{now}.json")
            with open(path, "w", encoding="utf-8") as f:
                json.dump(items, f, ensure_ascii=False, indent=2)
                
        except Exception as e:
            logging.error(f"Failed fetching {name}: {e}")
            print("Failed", name, e)
            
    # also write latest combined file
    latest_path = os.path.join(OUTPUT_FOLDER, "news_latest.json") # Renamed to match convention
    with open(latest_path, "w", encoding="utf-8") as f:
        json.dump(all_items, f, ensure_ascii=False, indent=2)
        
    logging.info(f"Saved {len(all_items)} news items to {latest_path}")
    return all_items

if __name__ == "__main__":
    run()
