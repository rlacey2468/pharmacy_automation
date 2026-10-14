"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Clock3,
  ShieldAlert,
  UserRound,
} from "lucide-react";

type Order = {
  id: string;
  medication: string;
  quantity: number;
  urgency: "routine" | "urgent";
  insurance_status: "verified" | "pending" | "failed";
  patient_risk: "low" | "medium" | "high";
  routing_confidence: number;
};

type ProcessedOrder = {
  order: Order;
  validation: {
    valid: boolean;
    issues: string[];
  };
  priority: string;
  route: string;
};

export default function ExceptionsPage() {
  const [exceptions, setExceptions] = useState<ProcessedOrder[]>([]);
  const [selectedOrder, setSelectedOrder] =
    useState<ProcessedOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/orders")
      .then((response) => response.json())
      .then(async (data) => {
        const processed = await Promise.all(
          data.orders.map(async (order: Order) => {
            const response = await fetch(
              "http://127.0.0.1:8000/workflow/process",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
              },
            );

            const result = await response.json();

            return {
              order,
              ...result,
            };
          }),
        );

        setExceptions(
          processed.filter(
            (item) => item.route === "human_review",
          ),
        );

        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load exceptions:", error);
        setLoading(false);
      });
  }, []);

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
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                  Operations
                </span>
              </div>

              <h1 className="mt-2 text-[25px] font-semibold tracking-[-0.035em] text-slate-900">
                Exceptions
              </h1>

              <p className="mt-1.5 text-[12px] text-slate-500">
                Orders that require human review before fulfillment.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                Requires attention
              </p>
              <p className="mt-1 text-[20px] font-semibold text-slate-900">
                {loading ? "—" : exceptions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[13px] font-semibold text-slate-900">
                    Review queue
                  </h2>
                  <p className="mt-1 text-[10px] text-slate-500">
                    Prioritized exceptions from the workflow engine
                  </p>
                </div>

                <span className="text-[10px] text-slate-400">
                  {exceptions.length} orders
                </span>
              </div>
            </div>

            {loading ? (
              <div className="p-8 text-center text-[11px] text-slate-400">
                Loading exceptions...
              </div>
            ) : exceptions.length === 0 ? (
              <div className="p-8 text-center text-[11px] text-slate-400">
                No exceptions require review.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {exceptions.map((item) => (
                  <button
                    key={item.order.id}
                    onClick={() => setSelectedOrder(item)}
                    className={`flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50 ${
                      selectedOrder?.order.id === item.order.id
                        ? "bg-slate-50"
                        : ""
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                      <ShieldAlert className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-[12px] font-semibold text-slate-800">
                          {item.order.id}
                        </p>

                        {item.order.urgency === "urgent" && (
                          <span className="rounded-md bg-red-50 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-red-600">
                            Urgent
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.order.medication} ·{" "}
                        {item.validation.issues[0] ||
                          "Routing confidence below threshold"}
                      </p>
                    </div>

                    <div className="hidden text-right sm:block">
                      <p className="text-[10px] font-medium text-slate-600">
                        {Math.round(
                          item.order.routing_confidence * 100,
                        )}
                        %
                      </p>
                      <p className="mt-1 text-[9px] text-slate-400">
                        confidence
                      </p>
                    </div>

                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white">
            {selectedOrder ? (
              <div>
                <div className="border-b border-slate-200 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400">
                        Order
                      </p>
                      <h2 className="mt-1 text-[16px] font-semibold text-slate-900">
                        {selectedOrder.order.id}
                      </h2>
                    </div>

                    <span className="rounded-md bg-amber-50 px-2 py-1 text-[9px] font-medium text-amber-700">
                      Human review
                    </span>
                  </div>
                </div>

                <div className="space-y-5 p-5">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                      Medication
                    </p>
                    <p className="mt-1 text-[12px] font-medium text-slate-800">
                      {selectedOrder.order.medication}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                        Quantity
                      </p>
                      <p className="mt-1 text-[12px] text-slate-700">
                        {selectedOrder.order.quantity}
                      </p>
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                        Urgency
                      </p>
                      <p className="mt-1 text-[12px] text-slate-700">
                        {selectedOrder.order.urgency}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                      <div>
                        <p className="text-[11px] font-semibold text-amber-900">
                          Why was this escalated?
                        </p>

                        <p className="mt-1.5 text-[10px] leading-5 text-amber-800">
                          {selectedOrder.validation.issues.length > 0
                            ? selectedOrder.validation.issues.join(
                                " · ",
                              )
                            : "Routing confidence is below the automatic fulfillment threshold."}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                        Routing confidence
                      </p>

                      <span className="text-[11px] font-semibold text-slate-800">
                        {Math.round(
                          selectedOrder.order.routing_confidence *
                            100,
                        )}
                        %
                      </span>
                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-500"
                        style={{
                          width: `${
                            selectedOrder.order.routing_confidence *
                            100
                          }%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-[9px] text-slate-400">
                      Automatic fulfillment threshold: 75%
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-[10px] font-medium text-slate-700 transition hover:bg-slate-50">
                      <Clock3 className="h-3.5 w-3.5" />
                      Escalate
                    </button>

                    <button className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-[10px] font-semibold text-white transition hover:bg-slate-800">
                      <UserRound className="h-3.5 w-3.5" />
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[400px] flex-col items-center justify-center px-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <AlertCircle className="h-4 w-4 text-slate-400" />
                </div>

                <p className="mt-4 text-[12px] font-medium text-slate-700">
                  Select an exception
                </p>

                <p className="mt-1 max-w-[220px] text-[10px] leading-5 text-slate-400">
                  Select an order from the review queue to inspect why
                  it was escalated.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}