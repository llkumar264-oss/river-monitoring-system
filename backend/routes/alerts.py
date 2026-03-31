from fastapi import APIRouter
from database import SessionLocal
import models

router = APIRouter(prefix="/alerts", tags=["Alerts"])

SEED_ALERTS = [
    {"zone": "Sector 15 - Industrial Zone", "status": "Critical", "ph": 9.2,  "turbidity": 45.0, "detail": "pH critically high — immediate containment action required"},
    {"zone": "Sector 20 - Downstream",      "status": "Warning",  "ph": 7.6,  "turbidity": 32.0, "detail": "Turbidity above safe threshold — monitor closely"},
    {"zone": "Sector 8 - Bridge Area",      "status": "Warning",  "ph": 7.8,  "turbidity": 28.0, "detail": "Dissolved oxygen dropping below 6.0 mg/L threshold"},
    {"zone": "Sector 12 - Point A",         "status": "Info",     "ph": 7.2,  "turbidity": 12.0, "detail": "Sensor reading variance detected — under investigation"},
    {"zone": "Sector 3 - Residential",      "status": "Info",     "ph": 7.1,  "turbidity": 15.0, "detail": "Scheduled maintenance cycle completed successfully"},
    {"zone": "Sector 5 - Park Area",        "status": "Info",     "ph": 7.3,  "turbidity": 18.0, "detail": "Data sync completed — all readings up to date"},
]

TIME_MAP = {0: "2 min ago", 1: "14 min ago", 2: "31 min ago", 3: "1 hr ago", 4: "2 hr ago", 5: "3 hr ago"}


def _seed(db):
    if db.query(models.Alert).count() == 0:
        for a in SEED_ALERTS:
            db.add(models.Alert(**a))
        db.commit()


@router.get("/")
def get_alerts():
    db = SessionLocal()
    _seed(db)
    alerts = db.query(models.Alert).all()
    return [
        {
            "zone": a.zone,
            "status": a.status,
            "ph": a.ph,
            "turbidity": a.turbidity,
            "detail": a.detail,
            "time": TIME_MAP.get(idx, "Recently")
        }
        for idx, a in enumerate(alerts)
    ]