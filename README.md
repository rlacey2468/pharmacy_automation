# RxFlow — Intelligent Pharmacy Workflow Optimization

RxFlow is a full-stack workflow automation prototype designed to demonstrate how pharmacy operations can streamline order processing, automate routine decisions, prioritize urgent orders, and route exceptions for human review.

The platform combines a configurable Python workflow engine with an interactive Next.js dashboard. Operations users can monitor workflow performance, inspect orders requiring intervention, and simulate changes to routing rules to evaluate their potential operational impact before deployment.

**Project focus:** Workflow automation · Operations intelligence · Human-in-the-loop systems · Process optimization

> **Disclaimer:** RxFlow is a demonstration project that uses synthetic order data. It is not connected to a real pharmacy system and is not intended for clinical use or real prescription processing. Optimization results are simulations, not guaranteed real-world outcomes.

## Key Features

### 1. Operations Dashboard
Provides a centralized view of workflow performance and operational metrics, including:
- Orders processed
- Automation rate
- Automatic fulfillment, priority queue, and human review counts
- Workflow performance indicators
- Operational insights and navigation to workflow optimization tools

The dashboard retrieves operational metrics from the FastAPI backend.

### 2. Configurable Workflow Engine
Implements a deterministic decision pipeline that processes orders through validation, prioritization, and routing.

The workflow evaluates insurance status, patient risk, urgency, and routing confidence to determine the appropriate processing path.

| Condition | Routing decision |
|---|---|
| Failed or pending insurance verification | Human review |
| Urgent order | Priority queue |
| High-risk patient, when high-risk prioritization is enabled | Priority queue |
| Routine order with sufficient routing confidence | Automatic fulfillment |
| Routine order below the confidence threshold | Human review |

These rules demonstrate how routine operations can be automated while retaining human oversight for exceptions.

### 3. Workflow Explorer
Provides a visual representation of the workflow stages and their responsibilities. Users can select workflow stages and inspect their configuration.

The routing stage displays configuration retrieved from the backend, including the routing-confidence threshold and whether high-risk prioritization is enabled.

### 4. Exception Management
Displays orders routed to human review so that operational users can inspect the information and understand why an order was flagged.

The interface includes exception details and actions for resolving, escalating, or returning an order. These actions are currently part of the prototype interface and should not be interpreted as a fully persisted production workflow.

### 5. Optimization Simulator
Allows users to test proposed workflow configurations without changing the active workflow.

Users can adjust:
- **Routing confidence threshold:** The minimum confidence required for automatic fulfillment.
- **High-risk prioritization:** Whether high-risk patients are automatically assigned priority status.

The simulator compares the current configuration with the proposed configuration and calculates projected changes in automation rate and human-review volume.

This creates a feedback loop for operational decision-making:

**Observe → Configure → Simulate → Compare → Optimize**

Simulation results are based on the available synthetic dataset and are not persisted as production configuration changes.

## System Architecture

RxFlow separates the user interface from the backend decision engine.

```text
                    RxFlow Frontend
                 Next.js + React + TypeScript
                            |
             +--------------+--------------+
             |              |              |
         Overview        Workflow      Exceptions
             |              |              |
             +--------------+--------------+
                            |
                       REST API
                            |
                     FastAPI Backend
                            |
                  Deterministic Workflow
                        Engine
                            |
          +-----------------+-----------------+
          |                 |                 |
      Validation       Prioritization       Routing
          |                 |                 |
          +-----------------+-----------------+
                            |
                 Processing Decision
                            |
             +--------------+--------------+
             |              |              |
          Automatic       Priority       Human
          Fulfillment      Queue         Review

               Optimization Simulator
                            |
                Proposed Workflow Rules
                            |
                Compare Current vs.
                 Proposed Outcomes
```

### Order Processing Lifecycle

1. **Intake:** Load an order from the synthetic order dataset or submit an order to the processing endpoint.
2. **Validation:** Check insurance status and patient-risk conditions.
3. **Prioritization:** Determine whether the order is urgent or requires high-risk prioritization.
4. **Routing:** Select automatic fulfillment, priority queue, or human review.
5. **Measurement:** Aggregate processing outcomes into operational metrics.
6. **Optimization:** Simulate alternative rules and compare their projected impact.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Styling | Tailwind CSS |
| Backend | Python, FastAPI |
| Data validation | Pydantic |
| API communication | REST, JSON, Fetch API |
| Data generation | Python, random, JSON |
| Development tools | Git, GitHub, npm, Uvicorn |

## Project Structure

```text
pharmacy_automation/
├── backend/
│   ├── data/
│   │   └── orders.json
│   ├── models/
│   │   └── order.py
│   ├── services/
│   │   └── workflow.py
│   ├── generate_orders.py
│   └── main.py
├── frontend/
│   ├── app/
│   │   ├── exceptions/
│   │   │   └── page.tsx
│   │   ├── optimization/
│   │   │   └── page.tsx
│   │   ├── workflow/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── package.json
│   └── ...
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10 or later
- Node.js and npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/rlacey2468/pharmacy_automation.git
cd pharmacy_automation
```

### 2. Set up the backend

From the project root:

```bash
cd backend
python -m venv .venv
```

Activate the virtual environment in Git Bash on Windows:

```bash
source .venv/Scripts/activate
```

Install the backend dependencies:

```bash
pip install fastapi uvicorn
```

Start the API server:

```bash
uvicorn main:app --reload
```

The backend will be available at:

- API: http://127.0.0.1:8000
- Interactive API documentation: http://127.0.0.1:8000/docs
- Health check: http://127.0.0.1:8000/health

### 3. Generate synthetic orders (optional)

The repository includes a generated order dataset. To regenerate the 500 synthetic orders, open another terminal:

```bash
cd pharmacy_automation/backend
source .venv/Scripts/activate
python generate_orders.py
```

The generated dataset is written to `backend/data/orders.json`.

Regenerating the dataset replaces the existing synthetic orders.

### 4. Set up the frontend

Open another terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

Keep both the backend and frontend development servers running while using the application.

## API Endpoints

The backend exposes the following endpoints:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Returns API identity and status |
| GET | `/health` | Checks backend health |
| GET | `/orders` | Retrieves the available orders |
| GET | `/orders/{order_id}` | Retrieves a specific order |
| POST | `/workflow/process` | Processes an order through the workflow engine |
| GET | `/metrics` | Returns aggregated workflow metrics |
| GET | `/workflow/config` | Retrieves workflow configuration |
| POST | `/simulation/run` | Compares current and proposed workflow outcomes |

The API uses JSON for request and response payloads. FastAPI provides interactive documentation at `/docs`.

## Design Decisions

### Deterministic automation before AI
The core workflow uses explicit rules so that routing decisions are understandable and repeatable. This establishes a clear baseline for automation and makes the system easier to test and debug.

### Human-in-the-loop exception handling
Not every order should be processed automatically. Orders that fail validation or fall below the configured confidence threshold are routed for review, illustrating how automated systems can retain human oversight.

### Simulation before deployment
The optimization simulator evaluates proposed rule changes against the same synthetic order dataset used for the current workflow. This allows users to compare potential operational trade-offs before considering changes to an active process.

### Separation of frontend and backend
The Next.js frontend communicates with a FastAPI service through REST endpoints. This separation allows the interface, workflow logic, and API behavior to be developed and tested independently.

## Engineering Challenges

The project involves several practical full-stack engineering concerns:

- Designing consistent order models and validating incoming data with Pydantic.
- Integrating frontend pages with asynchronous backend API requests.
- Handling routing decisions consistently across metrics, order processing, and simulation.
- Generating synthetic data that exercises different workflow branches.
- Configuring cross-origin requests during local development.
- Comparing proposed workflow configurations against a baseline without modifying the active configuration.

## Future Improvements

Potential next steps include:

- Persisting workflow configuration and approved rule changes.
- Implementing functional exception-resolution actions and an audit trail.
- Adding automated unit and integration tests for routing rules.
- Introducing explainable AI-assisted exception classification and recommendations.
- Adding authentication and role-based permissions.
- Persisting orders and workflow events in a database.
- Adding historical trend analysis and simulation comparisons across different datasets.
- Deploying the frontend and backend with environment-specific API configuration.

## What This Project Demonstrates

RxFlow demonstrates the design of an operations-oriented software system that combines a modern web interface, backend API development, deterministic workflow automation, operational metrics, exception handling, and simulation-based process optimization.

The central idea is to treat automation as an operational system rather than simply a model prediction: define the rules, execute the workflow, measure the results, identify exceptions, and evaluate potential improvements.

**Built as a portfolio project focused on AI operations, workflow optimization, and full-stack engineering.**