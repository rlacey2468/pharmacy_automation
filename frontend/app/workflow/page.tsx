"use client";

import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GitBranch,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  Zap,
} from "lucide-react";

type NodeKey =
  | "intake"
  | "validation"
  | "prioritization"
  | "routing";

const nodes = [
  {
    id: "intake" as NodeKey,
    title: "Intake",
    subtitle: "Receive and normalize order",
    icon: Zap,
    status: "healthy",
  },
  {
    id: "validation" as NodeKey,
    title: "Validation",
    subtitle: "Patient, medication & insurance",
    icon: ShieldCheck,
    status: "healthy",
  },
  {
    id: "prioritization" as NodeKey,
    title: "Prioritization",
    subtitle: "Assess urgency and risk",
    icon: Clock3,
    status: "healthy",
  },
  {
    id: "routing" as NodeKey,
    title: "Routing",
    subtitle: "Select processing path",
    icon: GitBranch,
    status: "warning",
  },
];

const nodeDetails = {
  intake: {
    title: "Order Intake",
    description:
      "Receives incoming orders and normalizes the information used by downstream workflow decisions.",
    rules: [
      "Accept incoming order",
      "Normalize order fields",
      "Assign workflow identifier",
    ],
    metric: "100% received",
  },
  validation: {
    title: "Order Validation",
    description:
      "Checks whether an order contains conditions that prevent automatic processing.",
    rules: [
      "Verify insurance status",
      "Check patient risk",
      "Identify validation failures",
    ],
    metric: "84.0% pass validation",
  },
  prioritization: {
    title: "Prioritization",
    description:
      "Determines whether an order should follow the routine or priority processing path.",
    rules: [
      "Urgent orders → priority queue",
      "High-risk orders → priority queue",
      "Routine orders → standard path",
    ],
    metric: "12.8% priority",
  },
  routing: {
    title: "Workflow Routing",
    description:
      "Selects the final processing path using validation status, priority, and routing confidence.",
    rules: [
      "Failed validation → human review",
      "Urgent priority → priority queue",
      "Confidence ≥ 75% → automatic fulfillment",
      "Confidence < 75% → human review",
    ],
    metric: "78.6% automated",
  },
};

export default function WorkflowPage() {
  const [selectedNode, setSelectedNode] =
    useState<NodeKey>("routing");

  const [workflowConfig, setWorkflowConfig] = useState<{
    confidence_threshold: number;
    high_risk_priority: boolean;
  } | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/workflow/config")
      .then((response) => response.json())
      .then((data) => setWorkflowConfig(data))
      .catch((error) => {
        console.error(
          "Failed to load workflow configuration:",
          error,
        );
      });
  }, []);

  const detail = nodeDetails[selectedNode];

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="mb-5 flex items-center gap-2 text-[11px] font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to overview
          </button>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-indigo-600" />
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Operations
                </span>
              </div>

              <h1 className="mt-2 text-[25px] font-semibold tracking-[-0.035em] text-slate-900">
                Workflow
              </h1>

              <p className="mt-1.5 text-[12px] text-slate-500">
                Inspect the rules and decision points powering order automation.
              </p>
            </div>

            <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-medium text-emerald-700">
                  Workflow active
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-[13px] font-semibold text-slate-900">
                Order processing pipeline
              </h2>
              <p className="mt-1 text-[10px] text-slate-500">
                Select a stage to inspect its decision logic.
              </p>
            </div>

            <div className="overflow-x-auto p-8">
              <div className="min-w-[760px]">
                <div className="flex items-center justify-center">
                  {nodes.map((node, index) => {
                    const Icon = node.icon;
                    const active = selectedNode === node.id;

                    return (
                      <div
                        key={node.id}
                        className="flex items-center"
                      >
                        <button
                          onClick={() => setSelectedNode(node.id)}
                          className={`group relative w-[165px] rounded-xl border p-4 text-left transition ${
                            active
                              ? "border-indigo-300 bg-indigo-50/50 shadow-sm"
                              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div
                              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                                active
                                  ? "bg-indigo-100 text-indigo-600"
                                  : "bg-white text-slate-600"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>

                            <span
                              className={`mt-1 h-1.5 w-1.5 rounded-full ${
                                node.status === "warning"
                                  ? "bg-amber-500"
                                  : "bg-emerald-500"
                              }`}
                            />
                          </div>

                          <p className="mt-4 text-[12px] font-semibold text-slate-900">
                            {node.title}
                          </p>

                          <p className="mt-1 text-[9px] leading-4 text-slate-500">
                            {node.subtitle}
                          </p>
                        </button>

                        {index < nodes.length - 1 && (
                          <div className="flex w-12 items-center justify-center">
                            <div className="h-px w-full bg-slate-200" />
                            <ChevronRight className="-ml-1 h-3.5 w-3.5 shrink-0 text-slate-300" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-10 flex justify-center">
                  <div className="h-8 w-px bg-slate-200" />
                </div>

                <div className="relative mx-auto max-w-[650px]">
                  <div className="absolute left-[16.5%] right-[16.5%] top-0 h-px bg-slate-200" />

                  <div className="grid grid-cols-3 gap-5">
                    <Branch
                      icon={CheckCircle2}
                      title="Automatic"
                      value="78.6%"
                      subtitle="Fulfillment"
                      tone="success"
                    />

                    <Branch
                      icon={Zap}
                      title="Priority"
                      value="12.8%"
                      subtitle="Queue"
                      tone="accent"
                    />

                    <Branch
                      icon={Users}
                      title="Review"
                      value="8.6%"
                      subtitle="Human"
                      tone="warning"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-[13px] font-semibold text-slate-900">
                    Stage configuration
                  </p>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Decision logic for the selected stage.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Selected stage
                  </p>

                  <h2 className="mt-1 text-[17px] font-semibold text-slate-900">
                    {detail.title}
                  </h2>
                </div>

                {selectedNode === "routing" && (
                  <span className="rounded-md bg-amber-50 px-2 py-1 text-[9px] font-medium text-amber-700">
                    Attention
                  </span>
                )}
              </div>

              <p className="mt-4 text-[11px] leading-5 text-slate-500">
                {detail.description}
              </p>

              <div className="mt-6">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                    Decision rules
                </p>

                {selectedNode === "routing" && workflowConfig && (
                    <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2.5">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-indigo-500">
                        Live configuration
                    </p>

                    <p className="mt-1 text-[10px] text-indigo-800">
                        Automatic fulfillment requires{" "}
                        <span className="font-semibold">
                        {Math.round(
                            workflowConfig.confidence_threshold * 100,
                        )}%
                        </span>{" "}
                        routing confidence.
                    </p>

                    <p className="mt-1 text-[10px] text-indigo-700">
                        High-risk prioritization is{" "}
                        <span className="font-semibold">
                        {workflowConfig.high_risk_priority
                            ? "enabled"
                            : "disabled"}
                        </span>
                        .
                    </p>
                    </div>
                )}

                <div className="mt-3 space-y-2">
                    {detail.rules.map((rule, index) => (
                    <div
                        key={rule}
                        className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3"
                    >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white text-[8px] font-semibold text-slate-500">
                        {index + 1}
                        </span>

                        <span className="text-[10px] leading-5 text-slate-700">
                        {rule}
                        </span>
                    </div>
                    ))}
                </div>
                </div>

              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                  Current outcome
                </p>

                <p className="mt-1 text-[20px] font-semibold text-slate-900">
                  {detail.metric}
                </p>
              </div>

              <div className="mt-6 rounded-lg border border-indigo-100 bg-indigo-50 p-4">
                <div className="flex gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                  <div>
                    <p className="text-[10px] font-semibold text-indigo-900">
                      Workflow is rule-driven
                    </p>

                    <p className="mt-1 text-[9px] leading-5 text-indigo-700">
                      Rules determine the initial processing path. Orders
                      that cannot be safely resolved are escalated to a
                      human operator.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Branch({
  icon: Icon,
  title,
  value,
  subtitle,
  tone,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  subtitle: string;
  tone: "success" | "accent" | "warning";
}) {
  const styles = {
    success: {
      icon: "text-emerald-600",
      dot: "bg-emerald-500",
    },
    accent: {
      icon: "text-indigo-600",
      dot: "bg-indigo-500",
    },
    warning: {
      icon: "text-amber-600",
      dot: "bg-amber-500",
    },
  };

  return (
    <div className="flex flex-col items-center pt-6 text-center">
      <div className="h-6 w-px bg-slate-200" />

      <div className="flex items-center gap-2">
        <Icon className={`h-3.5 w-3.5 ${styles[tone].icon}`} />

        <span className="text-[11px] font-medium text-slate-700">
          {title}
        </span>

        <span
          className={`h-1 w-1 rounded-full ${styles[tone].dot}`}
        />

        <span className="text-[10px] font-medium text-slate-400">
          {value}
        </span>
      </div>

      <span className="mt-1 text-[9px] text-slate-400">
        {subtitle}
      </span>
    </div>
  );
}