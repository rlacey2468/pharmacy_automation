from models.order import Order


def validate_order(order: Order) -> dict:
    issues = []

    if order.insurance_status == "failed":
        issues.append("Insurance verification failed")

    if order.insurance_status == "pending":
        issues.append("Insurance verification pending")

    if order.patient_risk == "high":
        issues.append("High-risk patient requires review")

    return {
        "valid": len(issues) == 0,
        "issues": issues,
    }


def prioritize_order(order: Order, high_risk_priority: bool = True) -> str:
    if order.urgency == "urgent":
        return "urgent"

    if high_risk_priority and order.patient_risk == "high":
        return "urgent"

    return "routine"


def route_order(
    order: Order,
    validation: dict,
    priority: str,
    confidence_threshold: float = 0.75,
) -> str:
    if not validation["valid"]:
        return "human_review"

    if priority == "urgent":
        return "priority_queue"

    if order.routing_confidence < confidence_threshold:
        return "human_review"

    return "automatic_fulfillment"


def process_order(
    order: Order,
    confidence_threshold: float = 0.75,
    high_risk_priority: bool = True,
) -> dict:
    validation = validate_order(order)

    priority = prioritize_order(
        order,
        high_risk_priority,
    )

    route = route_order(
        order,
        validation,
        priority,
        confidence_threshold,
    )

    return {
        "order_id": order.id,
        "validation": validation,
        "priority": priority,
        "route": route,
    }