from fastapi import APIRouter
from database import SessionLocal
import models

router = APIRouter(prefix="/sensors", tags=["Sensors"])

SEED_SENSORS = [
    {"location": "Sector 12 - Point A",    "ph": 7.2,  "turbidity": 12.0, "do": 8.5, "temperature": 24.0, "status": "Online"},
    {"location": "Sector 8 - Bridge",      "ph": 7.8,  "turbidity": 28.0, "do": 6.2, "temperature": 26.0, "status": "Online"},
    {"location": "Sector 15 - Industrial", "ph": 9.2,  "turbidity": 45.0, "do": 3.1, "temperature": 28.0, "status": "Warning"},
    {"location": "Sector 3 - Residential", "ph": 7.1,  "turbidity": 15.0, "do": 8.2, "temperature": 23.0, "status": "Online"},
    {"location": "Sector 20 - Downstream", "ph": 7.6,  "turbidity": 32.0, "do": 5.8, "temperature": 25.0, "status": "Warning"},
    {"location": "Sector 5 - Park Area",   "ph": 7.3,  "turbidity": 18.0, "do": 8.0, "temperature": 24.0, "status": "Online"},
    {"location": "Sector 9 - North Zone",  "ph": 6.8,  "turbidity": 10.0, "do": 9.1, "temperature": 22.0, "status": "Online"},
    {"location": "Sector 11 - West Bank",  "ph": 8.0,  "turbidity": 36.0, "do": 5.5, "temperature": 27.0, "status": "Warning"},
]


def _seed(db):
    if db.query(models.Sensor).count() == 0:
        for s in SEED_SENSORS:
            db.add(models.Sensor(**s))
        db.commit()


@router.get("/")
def get_sensors():
    db = SessionLocal()
    _seed(db)
    return db.query(models.Sensor).all()


@router.post("/")
def create_sensor(data: dict):
    db = SessionLocal()
    sensor = models.Sensor(**data)
    db.add(sensor)
    db.commit()
    db.refresh(sensor)
    return sensor