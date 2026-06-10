from datetime import datetime

# Real Bhopal Road Segments (LineStrings)
TRAFFIC_FEATURES = [
    {
        "type": "Feature",
        "id": "traffic-vip-road",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [77.3980, 23.2610],  # Kamla Park
                [77.3850, 23.2680],  # Karbala
                [77.3710, 23.2730],  # Khanugaon
                [77.3620, 23.2790]   # Lalghati
            ]
        },
        "properties": {
            "road_name": "VIP Road",
            "road_type": "Arterial",
            "density_level": "Medium",
            "avg_speed_kmph": 45.0,
            "speed_limit": 60,
            "lanes": 4,
            "accident_prone": False,
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
    },
    {
        "type": "Feature",
        "id": "traffic-link-road-1",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [77.4320, 23.2320],  # Board Office Square
                [77.4260, 23.2310],  # Mansarovar Complex
                [77.4180, 23.2280]   # Shivaji Nagar
            ]
        },
        "properties": {
            "road_name": "Link Road No. 1",
            "road_type": "Collector",
            "density_level": "High",
            "avg_speed_kmph": 25.0,
            "speed_limit": 50,
            "lanes": 6,
            "accident_prone": True,
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
    },
    {
        "type": "Feature",
        "id": "traffic-hoshangabad-road",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [77.4320, 23.2320],  # Board Office Square
                [77.4420, 23.2180],  # Habibganj/Rani Kamalapati Station
                [77.4520, 23.2010],  # Sagar Plaza
                [77.4650, 23.1850]   # Misrod
            ]
        },
        "properties": {
            "road_name": "Hoshangabad Road",
            "road_type": "National Highway / Arterial",
            "density_level": "Severe",
            "avg_speed_kmph": 15.0,
            "speed_limit": 60,
            "lanes": 6,
            "accident_prone": True,
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
    },
    {
        "type": "Feature",
        "id": "traffic-hamidia-road",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [77.4110, 23.2650],  # Bhopal Junction
                [77.4100, 23.2610],  # Hamidia Road Market
                [77.4080, 23.2570]   # Alpana Talkies
            ]
        },
        "properties": {
            "road_name": "Hamidia Road",
            "road_type": "Commercial",
            "density_level": "Severe",
            "avg_speed_kmph": 10.0,
            "speed_limit": 30,
            "lanes": 2,
            "accident_prone": False,
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
    },
    {
        "type": "Feature",
        "id": "traffic-kolar-road",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [77.4180, 23.1880],  # Kolar Chauraha
                [77.4150, 23.1750],  # Lalita Nagar
                [77.4120, 23.1600],  # Kolar Road residential
                [77.4050, 23.1420]   # Chuna Bhatti outskirt
            ]
        },
        "properties": {
            "road_name": "Kolar Road",
            "road_type": "Arterial",
            "density_level": "High",
            "avg_speed_kmph": 30.0,
            "speed_limit": 50,
            "lanes": 4,
            "accident_prone": True,
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
    },
    {
        "type": "Feature",
        "id": "traffic-bhadbhada-road",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [77.3850, 23.2250],  # Depot Square
                [77.3710, 23.2210],  # Nehru Nagar
                [77.3480, 23.2180]   # Bhadbhada Dam
            ]
        },
        "properties": {
            "road_name": "Bhadbhada Road",
            "road_type": "Sub-Arterial",
            "density_level": "Low",
            "avg_speed_kmph": 55.0,
            "speed_limit": 50,
            "lanes": 4,
            "accident_prone": False,
            "last_updated": datetime.utcnow().isoformat() + "Z"
        }
    }
]

def get_traffic_geojson():
    """
    Returns standard GeoJSON FeatureCollection of Bhopal road segments traffic state.
    """
    # Dynamically update last_updated timestamp to keep it live
    current_time = datetime.utcnow().isoformat() + "Z"
    for feature in TRAFFIC_FEATURES:
        feature["properties"]["last_updated"] = current_time
        
    return {
        "type": "FeatureCollection",
        "features": TRAFFIC_FEATURES
    }
