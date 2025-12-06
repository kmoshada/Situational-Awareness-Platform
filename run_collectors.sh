#!/bin/bash

echo "Starting Data Collectors Loop..."

while true; do
    echo "Running Traffic Collector..."
    python3 collectors/traffic_collector.py
    
    echo "Running Market Collector..."
    python3 collectors/cbsl_collector.py
    
    echo "Running Events Collector..."
    python3 collectors/events_collector.py
    
    echo "Sleeping for 5 minutes..."
    sleep 300
done
