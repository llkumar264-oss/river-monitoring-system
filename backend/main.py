from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from database import Base, engine
import models

from routes import sensors, complaints, alerts, analytics

app = FastAPI(
    title="River Monitoring System API",
    description="Government Environmental Monitoring Platform",
    version="2.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create all tables
Base.metadata.create_all(bind=engine)

# Routes
app.include_router(sensors.router)
app.include_router(complaints.router)
app.include_router(alerts.router)
app.include_router(analytics.router)


@app.get("/", include_in_schema=False)
def root():
    return {"message": "River Monitoring System API v2.0 — Running ✅", "docs": "/docs"}