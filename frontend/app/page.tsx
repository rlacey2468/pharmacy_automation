"use client";
import { useEffect, useState } from "react";

import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Bot,
  ChevronRight,
  CircleCheck,
  Clock3,
  GitBranch,
  Play,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

type Metrics = {
  orders_processed: number;
  automation_rate: number;
  automatic_fulfillment: number;
  priority_queue: number;
  human_review: number;
};

type WorkflowNodeProps = {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  status?: "healthy" | "warning";
};

const defaultMetrics = [
  {
    label: "Orders processed",
    value: "1,284",
    change: "+8.4%",
    direction: "up",
  },
  {
    label: "Automation rate",
    value: "78.6%",
    change: "+4.2%",
    direction: "up",
  },
  {
    label: "Avg. processing",
    value: "7.4 min",
    change: "-12.8%",
    direction: "down",
  },
];

const signals = [
  {
    type: "warning",
    title: "Routing is generating elevated manual review",
    description:
      "16.4% of routing decisions are being escalated to operators.",
    action: "Review routing",
  },
  {
    type: "opportunity",
    title: "Automation opportunity detected",
    description:
      "A low-risk order segment may be eligible for automated processing.",
    action: "Run simulation",
  },
];

function WorkflowNode({
  title,
  subtitle,
  icon: Icon,
  status = "healthy",
}: WorkflowNodeProps) {
  return (
    <button className="group relative w-[170px] text-left">
      <div
        className={`rounded-xl border bg-slate-50 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition-all duration-200 ${
          status === "warning"
            ? "border-amber-200 hover:border-amber-300"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <div className="flex items-start justify-between">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              status === "warning"
                ? "bg-amber-50 text-amber-600"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
          </div>
          <span
            className={`mt-1 h-1.5 w-1.5 rounded-full ${
              status === "warning" ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />
        </div>
        <div className="mt-4">
          <p className="text-[13px] font-semibold text-slate-900">
            {title}
          </p>
          <p className="mt-1 text-[10px] leading-4 text-slate-500">
            {subtitle}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-transparent transition group-hover:ring-slate-200" />
    </button>
  );
}

function WorkflowBranch({
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
    success: { icon: "text-emerald-600", dot: "bg-emerald-500" },
    accent: { icon: "text-indigo-600", dot: "bg-indigo-500" },
    warning: { icon: "text-amber-600", dot: "bg-amber-500" },
  };

  return (
    <button className="group relative flex flex-col items-center pt-7 text-center">
      <div className="absolute top-0 h-7 w-px bg-slate-200" />
      <div className="flex items-center gap-2.5 transition-transform duration-200 group-hover:-translate-y-0.5">
        <Icon className={`h-3.5 w-3.5 ${styles[tone].icon}`} />
        <span className="text-[12px] font-medium text-slate-700">
          {title}
        </span>
        <span className={`h-1 w-1 rounded-full ${styles[tone].dot}`} />
        <span className="text-[10px] font-medium text-slate-400">
          {value}
        </span>
      </div>
      <span className="mt-1.5 text-[9px] text-slate-400">{subtitle}</span>
    </button>
  );
}

function Connector({
  label,
  direction = "horizontal",
}: {
  label?: string;
  direction?: "horizontal" | "vertical";
}) {
  if (direction === "vertical") {
    return (
      <div className="flex h-10 flex-col items-center justify-center">
        <div className="h-6 w-px bg-slate-200" />
        <div className="h-1.5 w-1.5 rotate-45 border-r border-t border-slate-300" />
      </div>
    );
  }

  return (
    <div className="flex w-12 items-center">
      <div className="h-px flex-1 bg-slate-200" />
      <div className="h-1.5 w-1.5 rotate-45 border-r border-t border-slate-300" />
      {label && (
        <span className="absolute mt-[-24px] text-[9px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </span>
      )}
    </div>
  );
}

function Metric({
  label,
  value,
  change,
  direction,
}: {
  label: string;
  value: string;
  change: string;
  direction: string;
}) {
  const isGood =
    (direction === "up" && label !== "Exceptions") ||
    (direction === "down" && label === "Exceptions");

  return (
    <div className="border-l border-slate-200 pl-6 first:border-l-0 first:pl-0">
      <p className="text-[11px] font-medium text-slate-500">{label}</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-[27px] font-semibold tracking-[-0.03em] text-slate-900">
          {value}
        </span>
        <span
          className={`flex items-center text-[10px] font-medium ${
            isGood ? "text-emerald-600" : "text-slate-500"
          }`}
        >
          {direction === "up" ? (
            <ArrowUpRight className="mr-0.5 h-3 w-3" />
          ) : (
            <ArrowDownRight className="mr-0.5 h-3 w-3" />
          )}
          {change}
        </span>
      </div>
    </div>
  );
}

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  badge,
  href,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  badge?: string;
  href?: string;
}) {
  return (
    <a
      href={href ?? "#"}
      className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-[12px] transition ${
        active
          ? "bg-slate-100 text-slate-900"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon
          className={`h-[15px] w-[15px] ${
            active
              ? "text-slate-800"
              : "text-slate-500 group-hover:text-slate-600"
          }`}
        />
        {label}
      </span>

      {badge && (
        <span className="rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-medium text-amber-600">
          {badge}
        </span>
      )}
    </a>
  );
}

export default function Home() {
  const [backendMetrics, setBackendMetrics] = useState<Metrics | null>(
    null,
  );

  useEffect(() => {
    fetch("http://127.0.0.1:8000/metrics")
      .then((response) => response.json())
      .then((data) => setBackendMetrics(data))
      .catch((error) => {
        console.error("Failed to load RxFlow metrics:", error);
      });
  }, []);

  const metrics = [
    {
      label: "Orders processed",
      value: backendMetrics
        ? backendMetrics.orders_processed.toLocaleString()
        : "—",
      change: "+8.4%",
      direction: "up",
    },
    {
      label: "Automation rate",
      value: backendMetrics
        ? `${backendMetrics.automation_rate}%`
        : "—",
      change: "+4.2%",
      direction: "up",
    },
    {
      label: "Avg. processing",
      value: "7.4 min",
      change: "-12.8%",
      direction: "down",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[228px] border-r border-slate-200 bg-white lg:flex lg:flex-col">
        {/* Brand */}
        <div className="flex h-[68px] items-center border-b border-slate-200 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <p className="text-[14px] font-semibold tracking-[-0.01em] text-slate-900">
                RxFlow
              </p>
              <p className="text-[9px] uppercase tracking-[0.14em] text-slate-500">
                Workflow intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-6">
          <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Operations
          </p>
          <div className="space-y-1">
            <SidebarItem icon={Activity} label="Overview" active />
            <SidebarItem icon={GitBranch} label="Workflow" />
            <SidebarItem
              icon={AlertCircle}
              label="Exceptions"
              href="/exceptions"
            />
          </div>

          <p className="mb-2 mt-8 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Optimization
          </p>
          <div className="space-y-1">
            <SidebarItem
              icon={SlidersHorizontal}
              label="Simulator"
              href="/optimization"
            />
            <SidebarItem icon={Settings2} label="Rules" />
          </div>

          <p className="mb-2 mt-8 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            System
          </p>
          <div className="space-y-1">
            <SidebarItem icon={Activity} label="Activity" />
            <SidebarItem icon={Settings2} label="Settings" />
          </div>
        </div>

        {/* System status */}
        <div className="border-t border-slate-200 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-600">
                Systems operational
              </p>
              <p className="mt-0.5 text-[9px] text-slate-400">
                All services healthy
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-[228px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-[68px] items-center justify-between border-b border-slate-200 bg-[#f7f8fa]/90 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-slate-600">
              Production
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-[11px] text-slate-500">
              Workflow Operations
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-[10px] text-slate-500 sm:block">
              Last updated 32 sec ago
            </span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-[10px] font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900">
              RL
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1500px] px-6 pb-16">
          {/* Hero */}
          <section className="border-b border-slate-200 py-7">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                    Workflow operations
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-[10px] text-slate-400">
                    Production
                  </span>
                </div>
                <div className="mt-2 flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:gap-3">
                  <h1 className="text-[24px] font-semibold tracking-[-0.035em] text-slate-900">
                    Operational overview
                  </h1>
                  <p className="text-[12px] text-slate-500">
                    Monitor automation, exceptions, and workflow performance.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[11px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900">
                  <Settings2 className="h-3.5 w-3.5" />
                  Configure
                </button>
                <button className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-slate-800">
                  <Play className="h-3.5 w-3.5" />
                  Run simulation
                </button>
              </div>
            </div>

            {/* Metrics */}
            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {metrics.map((metric) => (
                <Metric
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                  change={metric.change}
                  direction={metric.direction}
                />
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section className="py-8">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-slate-500" />
                  <h2 className="text-[14px] font-semibold text-slate-900">
                    Live workflow
                  </h2>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">
                  Current order processing pipeline
                </p>
              </div>
              <button className="flex items-center gap-1 text-[10px] font-medium text-slate-500 transition hover:text-slate-900">
                Open workflow
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <div className="min-w-[1000px] p-8">
                <div className="flex items-center justify-center">
                  <WorkflowNode
                    title="Intake"
                    subtitle="Receive and normalize order"
                    icon={Zap}
                  />
                  <Connector />
                  <WorkflowNode
                    title="Validation"
                    subtitle="Patient, medication & insurance"
                    icon={ShieldIcon}
                  />
                  <Connector />
                  <WorkflowNode
                    title="Prioritization"
                    subtitle="Assess urgency and SLA"
                    icon={Clock3}
                  />
                  <Connector />
                  <WorkflowNode
                    title="Routing"
                    subtitle="Select processing path"
                    icon={GitBranch}
                    status="warning"
                  />
                </div>

                <div className="mt-1 flex justify-center">
                  <Connector direction="vertical" />
                </div>

                <div className="relative flex justify-center">
                  <div className="absolute top-0 h-px w-[560px] bg-slate-200" />
                  <div className="grid w-[620px] grid-cols-3 gap-12">
                    <WorkflowBranch
                      icon={CircleCheck}
                      title="Routine"
                      value="71.2%"
                      subtitle="Automated"
                      tone="success"
                    />
                    <WorkflowBranch
                      icon={Zap}
                      title="Urgent"
                      value="12.8%"
                      subtitle="Priority queue"
                      tone="accent"
                    />
                    <WorkflowBranch
                      icon={Users}
                      title="Review"
                      value="16.0%"
                      subtitle="Human intervention"
                      tone="warning"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Signals + Health */}
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            {/* Signals */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-[14px] font-semibold text-slate-900">
                    Operational signals
                  </h2>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Areas requiring attention or optimization
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">
                  2 active
                </span>
              </div>

              <div className="space-y-2">
                {signals.map((signal) => (
                  <button
                    key={signal.title}
                    className="group flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        signal.type === "warning"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      {signal.type === "warning" ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-slate-800">
                        {signal.title}
                      </p>
                      <p className="mt-1 text-[10px] leading-5 text-slate-500">
                        {signal.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-[10px] font-medium text-slate-500 transition group-hover:text-slate-900">
                      {signal.action}
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Health */}
            <div>
              <div className="mb-4">
                <h2 className="text-[14px] font-semibold text-slate-900">
                  Automation health
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Current system distribution
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[30px] font-semibold tracking-[-0.04em] text-slate-900">
                      {backendMetrics ? `${backendMetrics.automation_rate}%` : "—"}
                    </p>
                    <p className="mt-1 text-[10px] text-slate-500">
                      Orders processed automatically
                    </p>
                  </div>
                  <span className="flex items-center text-[10px] font-medium text-emerald-600">
                    <ArrowUpRight className="h-3 w-3" />
                    4.2%
                  </span>
                </div>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-indigo-600"
                    style={{
                    width: `${backendMetrics?.automation_rate ?? 0}%`,
                    }}
                  />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <Bot className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="text-[10px] text-slate-500">
                        Automated
                      </span>
                    </div>
                    <p className="mt-2 text-[16px] font-semibold text-slate-800">
                      {backendMetrics?.automatic_fulfillment.toLocaleString() ?? "—"}
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-amber-600" />
                      <span className="text-[10px] text-slate-500">
                        Human review
                      </span>
                    </div>
                    <p className="mt-2 text-[16px] font-semibold text-slate-800">
                      {backendMetrics?.human_review.toLocaleString() ?? "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Optimization */}
          <section className="mt-6 overflow-hidden rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-slate-50">
            <div className="flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-indigo-200 bg-indigo-50">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-semibold text-slate-900">
                      Optimization opportunity
                    </p>
                    <span className="rounded-md bg-indigo-50 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wider text-indigo-700">
                      Suggested
                    </span>
                  </div>

                  <p className="mt-1.5 max-w-2xl text-[11px] leading-5 text-slate-500">
                    Adjusting the routing confidence threshold could reduce
                    manual review volume while maintaining the current SLA
                    target. Test the proposed configuration before applying it.
                  </p>
                </div>
              </div>

              <button className="flex shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[11px] font-semibold text-white transition hover:bg-slate-800">
                Open simulator
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/*
 * Small custom icon wrapper so the workflow node doesn't need
 * another dependency.
 */
function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
    >
      <path
        d="M12 3.5 19 6v5.5c0 4.4-2.8 7.6-7 9-4.2-1.4-7-4.6-7-9V6l7-2.5Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}