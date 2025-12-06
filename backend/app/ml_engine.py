import os
import json
import numpy as np
from sklearn.ensemble import IsolationForest
from datetime import datetime, timedelta
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "data")

def compute_rolling_trend(series, window=3):
    if len(series) < window + 1:
        return 0
    s = pd.Series(series)
    ma = s.rolling(window=window).mean()
    # percent change last vs previous
    last = ma.iloc[-1]
    prev = ma.iloc[-2] if len(ma) >= 2 else ma.iloc[-1]
    if prev == 0:
        return 0
    return float((last - prev) / (abs(prev) + 1e-9) * 100)

def detect_market_anomaly(values):
    """
    values: list or 1D np array of numeric metric (e.g., daily index changes)
    Returns: True/False and score (anomaly score)
    """
    if len(values) < 10:
        # not enough history; return simple threshold detection
        if len(values) >= 2:
            change = abs(values[-1] - values[-2])
            return change > 0.05 * (abs(values[-2]) + 1e-9), float(change)
        return False, 0.0

    arr = np.array(values).reshape(-1, 1)
    iso = IsolationForest(contamination=0.05, random_state=42)
    iso.fit(arr)
    preds = iso.predict(arr)
    # last element anomaly?
    is_anom = preds[-1] == -1
    # anomaly score: distance to decision function
    score = float(iso.decision_function(arr)[-1])
    return bool(is_anom), score
