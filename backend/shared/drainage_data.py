# Real Bhopal Drainage Lines (LineStrings) and Drainage Points (Manholes, Culverts, Outfalls)
DRAINAGE_FEATURES = [
    # Stormwater Drains (LineStrings)
    {
        "type": "Feature",
        "id": "drain-line-mpnagar",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [77.4320, 23.2320],  # Board Office Square
                [77.4310, 23.2270],  # MP Nagar Zone 1
                [77.4350, 23.2250],  # Jyoti Talkies Square
                [77.4410, 23.2240]   # Chetak Bridge Outfall
            ]
        },
        "properties": {
            "segment_name": "MP Nagar Central Storm Sewer",
            "drain_type": "Storm Sewer",
            "capacity_m3": 12.5,
            "condition": "OVERFLOW",
            "last_cleaned": "2026-05-15",
            "feature_class": "pipeline"
        }
    },
    {
        "type": "Feature",
        "id": "drain-line-arera",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [77.4260, 23.2200],  # Arera Colony E-7
                [77.4220, 23.2100],  # Shahpura Lake Inflow
                [77.4160, 23.2080]   # Shahpura Lake Outfall
            ]
        },
        "properties": {
            "segment_name": "Arera Colony Main Conduit",
            "drain_type": "Closed Drain",
            "capacity_m3": 8.0,
            "condition": "BLOCKED",
            "last_cleaned": "2026-06-01",
            "feature_class": "pipeline"
        }
    },
    {
        "type": "Feature",
        "id": "drain-line-kolar",
        "geometry": {
            "type": "LineString",
            "coordinates": [
                [77.4180, 23.1880],  # Kolar main crossing
                [77.4150, 23.1800],  # Kolar roadside channel
                [77.4130, 23.1700]   # Kaliasot River discharge
            ]
        },
        "properties": {
            "segment_name": "Kolar Arterial Drain",
            "drain_type": "Open Drain",
            "capacity_m3": 15.0,
            "condition": "GOOD",
            "last_cleaned": "2026-05-28",
            "feature_class": "pipeline"
        }
    },
    # Manholes (Points)
    {
        "type": "Feature",
        "id": "manhole-mpn-1",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4310, 23.2270]
        },
        "properties": {
            "asset_id": "MH-MPN-001",
            "asset_type": "Manhole",
            "status": "CLOGGED",
            "depth_m": 4.5,
            "condition": "BLOCKED",
            "last_cleaned": "2026-05-15",
            "feature_class": "node"
        }
    },
    {
        "type": "Feature",
        "id": "manhole-mpn-2",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4350, 23.2250]
        },
        "properties": {
            "asset_id": "MH-MPN-002",
            "asset_type": "Manhole",
            "status": "OPEN",
            "depth_m": 4.5,
            "condition": "GOOD",
            "last_cleaned": "2026-05-15",
            "feature_class": "node"
        }
    },
    {
        "type": "Feature",
        "id": "manhole-arera-1",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4260, 23.2200]
        },
        "properties": {
            "asset_id": "MH-ARA-102",
            "asset_type": "Manhole",
            "status": "UNDER_REPAIR",
            "depth_m": 3.8,
            "condition": "FAIR",
            "last_cleaned": "2026-06-01",
            "feature_class": "node"
        }
    },
    # Culverts / Outfalls (Points)
    {
        "type": "Feature",
        "id": "outfall-shahpura",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4220, 23.2100]
        },
        "properties": {
            "asset_id": "OF-SHA-01",
            "asset_type": "Outfall",
            "status": "OPEN",
            "depth_m": 1.5,
            "condition": "GOOD",
            "last_cleaned": "2026-05-10",
            "feature_class": "node"
        }
    },
    {
        "type": "Feature",
        "id": "outfall-kaliasot",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4130, 23.1700]
        },
        "properties": {
            "asset_id": "OF-KAS-09",
            "asset_type": "Outfall",
            "status": "OPEN",
            "depth_m": 2.0,
            "condition": "GOOD",
            "last_cleaned": "2026-04-20",
            "feature_class": "node"
        }
    }
]

def get_drainage_geojson():
    """
    Returns standard GeoJSON FeatureCollection of Bhopal stormwater drainage network.
    """
    return {
        "type": "FeatureCollection",
        "features": DRAINAGE_FEATURES
    }

def get_blockages_geojson():
    """
    Returns points in the drainage system that are currently clogged or blocked.
    """
    blockages = [f for f in DRAINAGE_FEATURES if f["properties"].get("condition") in ["BLOCKED", "OVERFLOW", "CLOGGED"]]
    return {
        "type": "FeatureCollection",
        "features": blockages
    }
