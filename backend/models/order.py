from pydantic import BaseModel, Field
from typing import Literal


class Order(BaseModel):
    id: str
    medication: str
    quantity: int = Field(gt=0)
    urgency: Literal["routine", "urgent"]
    insurance_status: Literal["verified", "pending", "failed"]
    patient_risk: Literal["low", "medium", "high"]
    routing_confidence: float = Field(ge=0.0, le=1.0)