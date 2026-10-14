import json
import random
from pathlib import Path

random.seed(42)

OUTPUT_PATH = Path(__file__).parent / "data" / "orders.json"

URGENT_COUNT = 0.10
HIGH_RISK_COUNT = 0.07
FAILED_INSURANCE = 0.03
PENDING_INSURANCE = 0.05

orders = []

medications = [
    "Amoxicillin",
    "Atorvastatin",
    "Lisinopril",
    "Metformin",
    "Gabapentin",
    "Losartan",
    "Levothyroxine",
    "Amlodipine",
    "Omeprazole",
    "Sertraline",
]

for i in range(1, 501):
    patient_risk = (
        "high"
        if random.random() < HIGH_RISK_COUNT
        else random.choices(
            ["low", "medium"],
            weights=[0.70, 0.30],
        )[0]
    )

    urgency = (
        "urgent"
        if random.random() < URGENT_COUNT
        else "routine"
    )

    insurance_roll = random.random()

    if insurance_roll < FAILED_INSURANCE:
        insurance_status = "failed"
    elif insurance_roll < FAILED_INSURANCE + PENDING_INSURANCE:
        insurance_status = "pending"
    else:
        insurance_status = "verified"

    routing_confidence = round(
        random.betavariate(8, 2),
        2,
    )

    orders.append(
    {
        "id": f"ORD-{i:04d}",
        "medication": random.choice(medications),
        "quantity": random.randint(10, 90),
        "patient_risk": patient_risk,
        "urgency": urgency,
        "insurance_status": insurance_status,
        "routing_confidence": routing_confidence,
    }
    
)
with open(OUTPUT_PATH, "w", encoding="utf-8") as file:
    json.dump(orders, file, indent=2)

print(f"Generated {len(orders)} synthetic orders.")
print(f"Saved to: {OUTPUT_PATH}")