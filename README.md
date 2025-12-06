# Situational Awareness Platform

A real-time situational awareness dashboard for Sri Lanka, integrating multi-source intelligence (News, Weather, Traffic, Market Data).

## Project Structure

- `dashboard-app/`: Next.js Frontend
- `backend/`: FastAPI Backend
- `collectors/`: Python Data Collectors
- `data/`: JSON data storage

## Prerequisites

- Node.js (v18+)
- Python (v3.9+)
- npm

## Setup & Running

For detailed local running instructions, please refer to [LOCAL_RUN.md](LOCAL_RUN.md).

### Quick Start

1. **Backend**:
   ```bash
   # Install dependencies
   pip install -r requirements.txt
   
   # Start Server (Collectors run automatically)
   uvicorn backend.app.main:app --reload --port 8000
   ```

2. **Frontend**:
   ```bash
   cd dashboard-app
   npm install
   npm run dev
   ```


## Features

- **Real-time Dashboard**: Visualizes risk scores, market volatility, weather alerts, and exchange rates.
- **Risk Analysis**: Calculates operational risk based on multiple factors.
- **Data Collectors**:
  - `traffic_collector.py`: Fetches traffic data (TomTom API) for 10 major cities.
  - `cbsl_collector.py`: Fetches real-time exchange rates (USD/LKR, etc.).
  - `events_collector.py`: Fetches news, holidays, and weather alerts.
