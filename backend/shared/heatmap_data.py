# Real Bhopal Hotspots for Heatmap Visualization (Points with Weights)
HEATMAP_FEATURES = [
    # Grievance Hotspots
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4310, 23.2270]},
        "properties": {"type": "grievance", "weight": 0.85, "description": "High frequency of street water logging complaints"}
    },
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4260, 23.2200]},
        "properties": {"type": "grievance", "weight": 0.70, "description": "Streetlight outages & open manhole alerts"}
    },
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4100, 23.2550]},
        "properties": {"type": "grievance", "weight": 0.90, "description": "Waste clearance and garbage pileup complaints"}
    },
    
    # Traffic Congestion Hotspots
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4320, 23.2320]},
        "properties": {"type": "traffic", "weight": 0.95, "description": "Board Office Square gridlock during peak hours"}
    },
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4110, 23.2650]},
        "properties": {"type": "traffic", "weight": 0.88, "description": "Hamidia Road Bhopal Junction bottleneck"}
    },
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.3620, 23.2790]},
        "properties": {"type": "traffic", "weight": 0.65, "description": "Lalghati merging traffic slow down"}
    },

    # Flooding Hotspots
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4220, 23.2100]},
        "properties": {"type": "flooding", "weight": 0.80, "description": "Shahpura Lake inflow overflow risk"}
    },
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4130, 23.1700]},
        "properties": {"type": "flooding", "weight": 0.92, "description": "Kaliasot river discharge high flood alert"}
    },
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.3480, 23.2180]},
        "properties": {"type": "flooding", "weight": 0.75, "description": "Bhadbhada Dam spillway overflow watch area"}
    },

    # Pollution / AQI Hotspots
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4580, 23.2420]},
        "properties": {"type": "pollution", "weight": 0.90, "description": "Govindpura Industrial Area PM2.5 elevation"}
    },
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4350, 23.2300]},
        "properties": {"type": "pollution", "weight": 0.78, "description": "MP Nagar Commercial Zone high dust & emission"}
    },
    {
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [77.4120, 23.2600]},
        "properties": {"type": "pollution", "weight": 0.82, "description": "Bhopal Junction railway emission hotspot"}
    }
]

def get_heatmap_geojson(layer_type: str = None):
    """
    Returns standard GeoJSON FeatureCollection of city heatmap indicators.
    Can be filtered by type: "grievance", "traffic", "flooding", "pollution".
    """
    if layer_type:
        filtered = [f for f in HEATMAP_FEATURES if f["properties"]["type"] == layer_type.lower()]
    else:
        filtered = HEATMAP_FEATURES
        
    return {
        "type": "FeatureCollection",
        "features": filtered
    }
