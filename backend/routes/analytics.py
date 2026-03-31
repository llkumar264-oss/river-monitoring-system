from fastapi import APIRouter

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary")
def get_analytics_summary():
    return {
        "total_sensors": 8,
        "active_sensors": 5,
        "warning_sensors": 3,
        "total_alerts": 6,
        "critical_alerts": 1,
        "warning_alerts": 2,
        "ph_average": 7.63,
        "turbidity_average": 20.5,
        "do_average": 6.86,
        "sectors": [
            {"name": "Sector 3",  "ph": 7.1, "turbidity": 15.0, "do": 8.2},
            {"name": "Sector 5",  "ph": 7.3, "turbidity": 18.0, "do": 8.0},
            {"name": "Sector 8",  "ph": 7.8, "turbidity": 28.0, "do": 6.2},
            {"name": "Sector 12", "ph": 7.2, "turbidity": 12.0, "do": 8.5},
            {"name": "Sector 15", "ph": 9.2, "turbidity": 45.0, "do": 3.1},
            {"name": "Sector 20", "ph": 7.6, "turbidity": 32.0, "do": 5.8},
        ]
    }
