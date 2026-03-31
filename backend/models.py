from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from database import Base


class Sensor(Base):
    __tablename__ = "sensors"

    id          = Column(Integer, primary_key=True, index=True)
    location    = Column(String)
    ph          = Column(Float)
    turbidity   = Column(Float)
    do          = Column(Float)
    temperature = Column(Float, default=25.0)
    status      = Column(String, default="Online")
    created_at  = Column(DateTime(timezone=True), server_default=func.now())


class Complaint(Base):
    __tablename__ = "complaints"

    id          = Column(Integer, primary_key=True)
    name        = Column(String)
    phone       = Column(String)
    description = Column(String)
    location    = Column(String)
    severity    = Column(String, default="medium")
    media       = Column(String)
    status      = Column(String, default="Pending")
    created_at  = Column(DateTime(timezone=True), server_default=func.now())


class Alert(Base):
    __tablename__ = "alerts"

    id         = Column(Integer, primary_key=True)
    zone       = Column(String)
    status     = Column(String)   # Critical / Warning / Info
    ph         = Column(Float, nullable=True)
    turbidity  = Column(Float, nullable=True)
    detail     = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())