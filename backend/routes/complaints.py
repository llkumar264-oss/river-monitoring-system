from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from database import SessionLocal
import models
import shutil
import os

router = APIRouter(prefix="/complaints", tags=["Complaints"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

SEED_COMPLAINTS = [
    {"name": "Rajesh Kumar",  "phone": "+91 98765 43210", "description": "Industrial waste being dumped directly into the river. Strong chemical smell and discoloration of water observed.", "location": "Sector 12, River Point A",   "severity": "high",   "media": "2 media file(s)", "status": "Pending"},
    {"name": "Priya Sharma",  "phone": "+91 87654 32109", "description": "Plastic waste and sewage overflow near residential area. Foul odor affecting nearby homes.",                        "location": "Sector 8, Bridge Area",        "severity": "medium", "media": "1 media file(s)", "status": "Verified"},
    {"name": "Amit Patel",    "phone": "+91 76543 21098", "description": "Foam and chemical effluents visible on river surface near the industrial outlet.",                                   "location": "Sector 15, Industrial Zone",  "severity": "high",   "media": "3 media file(s)", "status": "Resolved"},
    {"name": "Sunita Devi",   "phone": "+91 65432 10987", "description": "Garbage dumping on the riverbank affects the water quality during monsoon season.",                                  "location": "Sector 3, Residential Area",  "severity": "low",    "media": "1 media file(s)", "status": "Pending"},
    {"name": "Vikram Singh",  "phone": "+91 54321 09876", "description": "Unusual color change noticed in river water after heavy rains. Possible contamination from upstream.",               "location": "Sector 20, Downstream",       "severity": "medium", "media": "0 media file(s)", "status": "Rejected"},
]


def _seed(db):
    if db.query(models.Complaint).count() == 0:
        for idx, c in enumerate(SEED_COMPLAINTS):
            complaint = models.Complaint(
                name=c["name"], phone=c["phone"], description=c["description"],
                location=c["location"], severity=c["severity"],
                media=c["media"], status=c["status"]
            )
            db.add(complaint)
        db.commit()


@router.post("/")
async def create_complaint(
    name: str = Form(...),
    phone: str = Form(""),
    description: str = Form(...),
    location: str = Form(...),
    severity: str = Form("medium"),
    file: UploadFile = File(None),
):
    db = SessionLocal()
    media_path = ""

    if file and file.filename and file.filename != "no-file.txt":
        file_path = f"{UPLOAD_DIR}/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        media_path = file_path

    # Generate ID like RMS-2026-XXXX
    count = db.query(models.Complaint).count() + 1
    rms_id = f"RMS-2026-{1234 + count}"

    complaint = models.Complaint(
        name=name, phone=phone, description=description,
        location=location, severity=severity,
        media=media_path or "0 media file(s)", status="Pending"
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return {"msg": "Complaint submitted successfully", "id": rms_id}


@router.get("/")
def get_complaints():
    db = SessionLocal()
    _seed(db)
    complaints = db.query(models.Complaint).all()
    result = []
    for idx, c in enumerate(complaints):
        result.append({
            "id": f"RMS-2026-{1234 + idx}",
            "name": c.name,
            "phone": c.phone,
            "description": c.description,
            "location": c.location,
            "severity": c.severity or "medium",
            "media": c.media or "0 media file(s)",
            "status": c.status or "Pending",
            "timestamp": str(c.created_at)[:16].replace("T", " ") if c.created_at else "—",
        })
    return result


@router.patch("/{complaint_id}/status")
def update_complaint_status(complaint_id: str, body: dict):
    db = SessionLocal()
    # Find by index (id is RMS-based)
    try:
        idx = int(complaint_id.split("-")[-1]) - 1234
        complaints = db.query(models.Complaint).all()
        if 0 <= idx < len(complaints):
            complaints[idx].status = body.get("status", "Pending")
            db.commit()
    except Exception:
        pass
    return {"msg": "Status updated"}


@router.get("/{complaint_id}")
def get_complaint(complaint_id: int):
    db = SessionLocal()
    return db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()