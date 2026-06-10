# Real Bhopal Zones / Wards (Polygons) with Flood Risk Attributes
FLOOD_ZONES = [
    {
        "type": "Feature",
        "id": "zone-mp-nagar",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.4280, 23.2350],
                [77.4350, 23.2350],
                [77.4380, 23.2200],
                [77.4280, 23.2200],
                [77.4280, 23.2350]
            ]]
        },
        "properties": {
            "zone_name": "M.P. Nagar (Commercial District)",
            "zone_code": "ZONE_13_MPN",
            "risk_score": 6.80,
            "risk_category": "High",
            "elevation_m": 485.0,
            "drain_capacity_m3": 10.0,
            "drain_condition_score": 4.0,  # Scale 0 to 10
            "soil_permeability": 0.25,
            "rainfall_24h_mm": 85.0,
            "alert_active": True
        }
    },
    {
        "type": "Feature",
        "id": "zone-arera-hills",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.4100, 23.2480],
                [77.4250, 23.2480],
                [77.4250, 23.2380],
                [77.4100, 23.2380],
                [77.4100, 23.2480]
            ]]
        },
        "properties": {
            "zone_name": "Arera Hills (Administrative Zone)",
            "zone_code": "ZONE_09_ARH",
            "risk_score": 1.25,
            "risk_category": "Low",
            "elevation_m": 530.0,
            "drain_capacity_m3": 25.0,
            "drain_condition_score": 9.0,
            "soil_permeability": 0.70,
            "rainfall_24h_mm": 85.0,
            "alert_active": False
        }
    },
    {
        "type": "Feature",
        "id": "zone-old-bhopal",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.3950, 23.2650],
                [77.4180, 23.2650],
                [77.4180, 23.2500],
                [77.3950, 23.2500],
                [77.3950, 23.2650]
            ]]
        },
        "properties": {
            "zone_name": "Jahangirabad / Old City",
            "zone_code": "ZONE_04_JHB",
            "risk_score": 8.10,
            "risk_category": "Critical",
            "elevation_m": 475.0,
            "drain_capacity_m3": 5.0,
            "drain_condition_score": 2.0,
            "soil_permeability": 0.15,
            "rainfall_24h_mm": 85.0,
            "alert_active": True
        }
    },
    {
        "type": "Feature",
        "id": "zone-kolar",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.4000, 23.1900],
                [77.4250, 23.1900],
                [77.4250, 23.1700],
                [77.4000, 23.1700],
                [77.4000, 23.1900]
            ]]
        },
        "properties": {
            "zone_name": "Kolar River Corridor",
            "zone_code": "ZONE_18_KOL",
            "risk_score": 7.45,
            "risk_category": "High",
            "elevation_m": 465.0,
            "drain_capacity_m3": 12.0,
            "drain_condition_score": 6.0,
            "soil_permeability": 0.35,
            "rainfall_24h_mm": 85.0,
            "alert_active": True
        }
    },
    {
        "type": "Feature",
        "id": "zone-shahpura",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.4100, 23.2150],
                [77.4300, 23.2150],
                [77.4300, 23.2000],
                [77.4100, 23.2000],
                [77.4100, 23.2150]
            ]]
        },
        "properties": {
            "zone_name": "Shahpura Lake Catchment",
            "zone_code": "ZONE_11_SPL",
            "risk_score": 4.50,
            "risk_category": "Moderate",
            "elevation_m": 490.0,
            "drain_capacity_m3": 8.0,
            "drain_condition_score": 5.0,
            "soil_permeability": 0.40,
            "rainfall_24h_mm": 85.0,
            "alert_active": False
        }
    }
]

def predict_flood_risk(rainfall_24h: float, rainfall_72h: float, drain_capacity: float, elevation: float, soil_permeability: float, drain_condition: float):
    """
    Computes flood risk score and risk label deterministically using high-fidelity equations.
    No scikit-learn models are loaded.
    """
    # High rainfall, low elevation, bad drainage condition, small drain capacity, and low soil permeability increase risk.
    # Base risk is higher if elevation is low (e.g. baseline at 500m)
    elevation_factor = max(0.0, (550.0 - elevation) * 0.05) if elevation < 550.0 else 0.0
    
    score = (
        (rainfall_24h * 0.035) +
        (rainfall_72h * 0.015) +
        ((10.0 - drain_condition) * 0.35) -
        (drain_capacity * 0.08) +
        elevation_factor +
        ((1.0 - soil_permeability) * 1.5)
    )
    
    # Scale score to range between 0.0 and 10.0
    score = round(max(0.0, min(10.0, score)), 2)
    
    if score <= 2.5:
        category = "Low"
    elif score <= 5.0:
        category = "Moderate"
    elif score <= 7.5:
        category = "High"
    else:
        category = "Critical"
        
    return {
        "risk_score": score,
        "risk_label": category
    }

def get_flood_risk_geojson():
    """
    Returns standard GeoJSON FeatureCollection of Bhopal zones labeled with flood risk categories.
    """
    return {
        "type": "FeatureCollection",
        "features": FLOOD_ZONES
    }
