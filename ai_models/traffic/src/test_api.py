
import requests
import os
from dotenv import load_dotenv

load_dotenv("../../../.env")

API_KEY = os.getenv("TOMTOM_API_KEY")

url = "https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json"

params = {
    "key": API_KEY,
    "point": "23.2330,77.4340"
}

try:
    response = requests.get(
        url,
        params=params,
        timeout=30
    )

except requests.exceptions.RequestException as e:
    print(f"Network Error for {area}: {e}")
    
