# Real Bhopal Infrastructure Assets and Projects (Points, Polygons, and LineStrings)
INFRASTRUCTURE_FEATURES = [
    # Public Buildings (Points)
    {
        "type": "Feature",
        "id": "building-vidhan-sabha",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4244, 23.2439]
        },
        "properties": {
            "asset_name": "Vidhan Sabha (Legislative Assembly)",
            "asset_type": "Public Building",
            "status": "ACTIVE",
            "health_score": 98.5,
            "last_inspected": "2026-03-10",
            "ward_number": 45
        }
    },
    {
        "type": "Feature",
        "id": "building-vallabh-bhawan",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4228, 23.2472]
        },
        "properties": {
            "asset_name": "Vallabh Bhawan (State Secretariat)",
            "asset_type": "Public Building",
            "status": "ACTIVE",
            "health_score": 94.0,
            "last_inspected": "2026-02-15",
            "ward_number": 45
        }
    },
    # Bridges (Points or LineStrings)
    {
        "type": "Feature",
        "id": "bridge-chetak",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4422, 23.2325]
        },
        "properties": {
            "asset_name": "Chetak Bridge Overpass",
            "asset_type": "Bridge",
            "status": "ACTIVE",
            "health_score": 76.5,
            "last_inspected": "2026-05-18",
            "ward_number": 13
        }
    },
    {
        "type": "Feature",
        "id": "bridge-kamla-park",
        "geometry": {
            "type": "Point",
            "coordinates": [77.3995, 23.2588]
        },
        "properties": {
            "asset_name": "Kamla Park Arch Bridge",
            "asset_type": "Bridge",
            "status": "ACTIVE",
            "health_score": 82.0,
            "last_inspected": "2026-04-12",
            "ward_number": 4
        }
    },
    # Dams (Water Infrastructure - Points)
    {
        "type": "Feature",
        "id": "dam-bhadbhada",
        "geometry": {
            "type": "Point",
            "coordinates": [77.3480, 23.2180]
        },
        "properties": {
            "asset_name": "Bhadbhada Dam & Spillway",
            "asset_type": "Water Infrastructure",
            "status": "ACTIVE",
            "health_score": 91.5,
            "last_inspected": "2026-05-20",
            "ward_number": 22
        }
    },
    {
        "type": "Feature",
        "id": "dam-kaliasot",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4020, 23.1720]
        },
        "properties": {
            "asset_name": "Kaliasot Dam Reservoir Gates",
            "asset_type": "Water Infrastructure",
            "status": "ACTIVE",
            "health_score": 89.0,
            "last_inspected": "2026-05-25",
            "ward_number": 18
        }
    },
    # Ongoing Smart City Projects (Points / Polygons)
    {
        "type": "Feature",
        "id": "project-metro-mpn",
        "geometry": {
            "type": "Point",
            "coordinates": [77.4325, 23.2265]
        },
        "properties": {
            "asset_name": "Bhopal Metro Line 1 - MP Nagar Section",
            "asset_type": "Ongoing Project",
            "status": "UNDER_CONSTRUCTION",
            "health_score": 100.0,
            "completion_percentage": 65,
            "last_inspected": "2026-06-05",
            "ward_number": 13
        }
    },
    {
        "type": "Feature",
        "id": "project-smart-road",
        "geometry": {
            "type": "Point",
            "coordinates": [77.3990, 23.2380]
        },
        "properties": {
            "asset_name": "TT Nagar Smart Road Corridor",
            "asset_type": "Ongoing Project",
            "status": "UNDER_CONSTRUCTION",
            "health_score": 100.0,
            "completion_percentage": 85,
            "last_inspected": "2026-05-30",
            "ward_number": 9
        }
    }
]

def get_infrastructure_geojson():
    """
    Returns standard GeoJSON FeatureCollection of Bhopal infrastructure assets and projects.
    """
    return {
        "type": "FeatureCollection",
        "features": INFRASTRUCTURE_FEATURES
    }
