"use client";

import { useState } from "react";
import {
  ArrowLeft,
  FlaskConical,
  Play,
  RotateCcw,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

type SimulationResult = {
  simulation_only: boolean;
  current: {
    automation_rate: number;
    automatic_fulfillment: number;
    priority_queue: number;
    human_review: number;
  };
  proposed: {
    automation_rate: number;
    automatic_fulfillment: number;
    priority_queue: number;
    human_review: number;
  };
  change: {
    automation_rate: number;
    human_review: number;
  };
};

export default function OptimizationPage() {
  const [threshold, setThreshold] = useState(0.75);
  const [highRiskPriority, setHighRiskPriority] = useState(true);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSimulation() {
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/simulation/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            confidence_threshold: threshold,
            high_risk_priority: highRiskPriority,
          }),
        },
      );

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Simulation failed:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetSimulation() {
    setThreshold(0.75);
    setHighRiskPriority(true);
    setResult(null);
  }

  const automationChange =
    result?.change.automation_rate ?? 0;

  const reviewChange =
    result?.change.human_review ?? 0;

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <main className="mx-auto max-w-[1400px] px-6 py-8">
        <div className="mb-8">
          <button
            onClick={() => window.location.href = "/"}
            className="mb-5 flex items-center gap-2 text-[11px] font-medium text-slate-500 transition hover:text-slate-900"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to overview
          </button>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-indigo-600" />
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Optimization
                </span>
              </div>

              <h1 className="mt-2 text-[25px] font-semibold tracking-[-0.035em] text-slate-900">
                Workflow Simulator
              </h1>

              <p className="mt-1.5 text-[12px] text-slate-500">
                Test workflow changes before applying them to operations.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2">
              <FlaskConical className="h-3.5 w-3.5 text-indigo-600" />
              <span className="text-[10px] font-medium text-indigo-700">
                Simulation only
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                <div>
                  <h2 className="text-[13px] font-semibold text-slate-900">
                    Workflow parameters
                  </h2>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Adjust proposed routing rules.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-7 p-5">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-800">
                      Routing confidence
                    </p>
                    <p className="mt-1 text-[9px] text-slate-400">
                      Minimum confidence for automatic fulfillment
                    </p>
                  </div>

                  <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-700">
                    {Math.round(threshold * 100)}%
                  </span>
                </div>

                <input
                  type="range"
                  min="0.5"
                  max="0.95"
                  step="0.05"
                  value={threshold}
                  onChange={(event) =>
                    setThreshold(Number(event.target.value))
                  }
                  className="mt-5 w-full accent-slate-900"
                />

                <div className="mt-2 flex justify-between text-[9px] text-slate-400">
                  <span>50%</span>
                  <span>95%</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-800">
                      Prioritize high-risk orders
                    </p>
                    <p className="mt-1 max-w-[220px] text-[9px] leading-4 text-slate-400">
                      Send high-risk orders to the priority queue.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setHighRiskPriority(!highRiskPriority)
                    }
                    className={`relative h-5 w-9 rounded-full transition ${
                      highRiskPriority
                        ? "bg-slate-900"
                        : "bg-slate-200"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        highRiskPriority
                          ? "left-[18px]"
                          : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6">
                <button
                  onClick={runSimulation}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-3 text-[11px] font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Play className="h-3.5 w-3.5" />
                  {loading ? "Running simulation..." : "Run simulation"}
                </button>

                <button
                  onClick={resetSimulation}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset parameters
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            {!result ? (
              <div className="flex min-h-[470px] flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-8 text-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-50">
                  <FlaskConical className="h-5 w-5 text-indigo-600" />
                </div>

                <h2 className="mt-4 text-[14px] font-semibold text-slate-800">
                  Model a workflow change
                </h2>

                <p className="mt-2 max-w-[360px] text-[10px] leading-5 text-slate-400">
                  Adjust the workflow parameters and run a simulation
                  to compare the proposed configuration against the
                  current workflow.
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <MetricCard
                    label="Automation rate"
                    current={`${result.current.automation_rate}%`}
                    proposed={`${result.proposed.automation_rate}%`}
                    change={automationChange}
                    positive={automationChange >= 0}
                  />

                  <MetricCard
                    label="Manual reviews"
                    current={`${result.current.human_review}`}
                    proposed={`${result.proposed.human_review}`}
                    change={reviewChange}
                    positive={reviewChange <= 0}
                    inverse
                  />

                  <MetricCard
                    label="Automatic fulfillment"
                    current={`${result.current.automatic_fulfillment}`}
                    proposed={`${result.proposed.automatic_fulfillment}`}
                    change={
                      result.proposed.automatic_fulfillment -
                      result.current.automatic_fulfillment
                    }
                    positive={
                      result.proposed.automatic_fulfillment >=
                      result.current.automatic_fulfillment
                    }
                  />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white">
                  <div className="border-b border-slate-200 px-5 py-4">
                    <h2 className="text-[13px] font-semibold text-slate-900">
                      Projected workflow impact
                    </h2>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Current workflow compared with the proposed configuration.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 divide-y divide-slate-100 md:grid-cols-2 md:divide-x md:divide-y-0">
                    <ComparisonPanel
                      title="Current workflow"
                      data={result.current}
                    />

                    <ComparisonPanel
                      title="Proposed workflow"
                      data={result.proposed}
                      proposed
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
                  <div className="flex gap-3">
                    <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                    <div>
                      <p className="text-[11px] font-semibold text-amber-900">
                        Simulation result
                      </p>
                      <p className="mt-1 text-[10px] leading-5 text-amber-800">
                        This simulation was run against synthetic order
                        data. No production workflow or patient data was
                        changed.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  label,
  current,
  proposed,
  change,
  positive,
  inverse = false,
}: {
  label: string;
  current: string;
  proposed: string;
  change: number;
  positive: boolean;
  inverse?: boolean;
}) {
  const isGood = inverse ? change <= 0 : positive;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-[10px] text-slate-400">Current</p>
          <p className="mt-1 text-[15px] font-semibold text-slate-500">
            {current}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-slate-400">Proposed</p>
          <p className="mt-1 text-[18px] font-semibold text-slate-900">
            {proposed}
          </p>
        </div>
      </div>

      <div
        className={`mt-4 flex items-center gap-1 text-[10px] font-medium ${
          isGood ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {isGood ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {change > 0 ? "+" : ""}
        {change}
        {label === "Automation rate" ? " pts" : " orders"}
      </div>
    </div>
  );
}

function ComparisonPanel({
  title,
  data,
  proposed = false,
}: {
  title: string;
  data: SimulationResult["current"];
  proposed?: boolean;
}) {
  return (
    <div className="p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-semibold text-slate-800">
          {title}
        </h3>

        {proposed && (
          <span className="rounded-md bg-indigo-50 px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-indigo-600">
            Proposed
          </span>
        )}
      </div>

      <div className="mt-5 space-y-4">
        <ComparisonRow
          label="Automation rate"
          value={`${data.automation_rate}%`}
        />

        <ComparisonRow
          label="Automatic fulfillment"
          value={data.automatic_fulfillment}
        />

        <ComparisonRow
          label="Priority queue"
          value={data.priority_queue}
        />

        <ComparisonRow
          label="Human review"
          value={data.human_review}
        />
      </div>
    </div>
  );
}

function ComparisonRow({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
      <span className="text-[10px] text-slate-500">
        {label}
      </span>

      <span className="text-[11px] font-semibold text-slate-800">
        {value}
      </span>
    </div>
  );
}