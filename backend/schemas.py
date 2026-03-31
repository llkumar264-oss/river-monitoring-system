from pydantic import BaseModel
from typing import Optional


class SensorCreate(BaseModel):
    location: str
    ph: float
    turbidity: float
    do: float
    temperature: Optional[float] = 25.0
    status: Optional[str] = "Online"


class ComplaintCreate(BaseModel):
    name: str
    phone: Optional[str] = ""
    description: str
    location: str
    severity: Optional[str] = "medium"


class ComplaintStatusUpdate(BaseModel):
    status: str


class AlertCreate(BaseModel):
    zone: str
    status: str
    ph: Optional[float] = None
    turbidity: Optional[float] = None
    detail: Optional[str] = None