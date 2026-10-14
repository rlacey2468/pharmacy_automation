import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models.order import Order
from services.workflow import process_order

from pydantic import BaseModel, Field

app = FastAPI(
    title="RxFlow API",
    description="Workflow automation engine for pharmacy operations",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_PATH = Path(__file__).parent / "data" / "orders.json"


def load_orders() -> list[Order]:
    with open(DATA_PATH, "r", encoding="utf-8") as file:
        data = json.load(file)

    return [Order(**order) for order in data]


@app.get("/")
def root():
    return {
        "name": "RxFlow",
        "status": "operational",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
    }


@app.get("/orders")
def get_orders():
    orders = load_orders()

    return {
        "count": len(orders),
        "orders": orders,
    }


@app.get("/orders/{order_id}")
def get_order(order_id: str):
    orders = load_orders()

    for order in orders:
        if order.id == order_id:
            return order

    raise HTTPException(
        status_code=404,
        detail=f"Order {order_id} not found",
    )


@app.post("/workflow/process")
def process_workflow(order: Order):
    return process_order(order)


@app.get("/metrics")
def get_metrics():
    orders = load_orders()

    results = [process_order(order) for order in orders]

    total_orders = len(results)

    automatic = sum(
        result["route"] == "automatic_fulfillment"
        for result in results
    )

    priority = sum(
        result["route"] == "priority_queue"
        for result in results
    )

    human_review = sum(
        result["route"] == "human_review"
        for result in results
    )

    automation_rate = (
        automatic / total_orders * 100
        if total_orders
        else 0
    )

    return {
        "orders_processed": total_orders,
        "automation_rate": round(automation_rate, 1),
        "automatic_fulfillment": automatic,
        "priority_queue": priority,
        "human_review": human_review,
    }

class SimulationConfig(BaseModel):
    confidence_threshold: float = Field(ge=0.0, le=1.0)
    high_risk_priority: bool = True

@app.post("/simulation/run")
def run_simulation(config: SimulationConfig):
    orders = load_orders()

    current_results = [
        process_order(order)
        for order in orders
    ]

    proposed_results = [
        process_order(
            order,
            confidence_threshold=config.confidence_threshold,
            high_risk_priority=config.high_risk_priority,
        )
        for order in orders
    ]

    def summarize(results):
        total = len(results)

        automatic = sum(
            result["route"] == "automatic_fulfillment"
            for result in results
        )

        priority = sum(
            result["route"] == "priority_queue"
            for result in results
        )

        human_review = sum(
            result["route"] == "human_review"
            for result in results
        )

        automation_rate = (
            automatic / total * 100
            if total
            else 0
        )

        return {
            "automation_rate": round(automation_rate, 1),
            "automatic_fulfillment": automatic,
            "priority_queue": priority,
            "human_review": human_review,
        }

    current = summarize(current_results)
    proposed = summarize(proposed_results)

    return {
        "simulation_only": True,
        "current": current,
        "proposed": proposed,
        "change": {
            "automation_rate": round(
                proposed["automation_rate"]
                - current["automation_rate"],
                1,
            ),
            "human_review": (
                proposed["human_review"]
                - current["human_review"]
            ),
        },
    }

@app.get("/workflow/config")
def get_workflow_config():
    return {
        "confidence_threshold": 0.75,
        "high_risk_priority": True,
        "rules": {
            "failed_validation": "human_review",
            "urgent": "priority_queue",
            "high_risk": "priority_queue",
            "high_confidence_routine": "automatic_fulfillment",
            "low_confidence": "human_review",
        },
    }