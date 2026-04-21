"use client"

import React, { useEffect, useState } from "react";

function formatResetDate(resetOn) {
  if (!resetOn) return "No reset date";

  const date = new Date(resetOn);
  if (Number.isNaN(date.getTime())) return "No reset date";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function UsageOverview() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    try {
      const response = await fetch("/api/billing/status");
      if (!response.ok) {
        throw new Error("Unable to load billing status");
      }

      const nextStatus = await response.json();
      setStatus(nextStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();

    const refreshStatus = () => loadStatus();
    window.addEventListener("billing:refresh", refreshStatus);

    return () => {
      window.removeEventListener("billing:refresh", refreshStatus);
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-[22px] border border-[#dbd2c3] bg-[#fffaf2] p-5 text-sm text-slate-500">
        Loading plan usage...
      </div>
    );
  }

  if (!status) {
    return (
      <div className="rounded-[22px] border border-[#dbd2c3] bg-[#fffaf2] p-5 text-sm text-slate-500">
        Unable to load usage details right now.
      </div>
    );
  }

  return (
    <div className="surface-panel p-6 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#1f5d55]">
            Plan usage
          </div>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
            {status.plan === "free" ? "Free plan" : `${status.billingInterval} subscription`}
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-slate-600">
          {status.plan === "free"
            ? "Free accounts can create two interviews total."
            : "Paid plans allow 20 interview sessions per monthly entitlement window."}
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-[22px] border border-[#dbd2c3] bg-[#fffaf2] p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Used</div>
          <div className="mt-3 text-3xl font-semibold text-slate-900">{status.usedInterviews}</div>
        </div>
        <div className="rounded-[22px] border border-[#dbd2c3] bg-[#fffaf2] p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-400">Remaining</div>
          <div className="mt-3 text-3xl font-semibold text-slate-900">{status.remainingInterviews}</div>
        </div>
        <div className="rounded-[22px] border border-[#dbd2c3] bg-[#fffaf2] p-5">
          <div className="text-xs uppercase tracking-[0.16em] text-slate-400">
            {status.plan === "free" ? "Limit" : "Next reset"}
          </div>
          <div className="mt-3 text-lg font-semibold text-slate-900">
            {status.plan === "free" ? `${status.quotaLimit} total sessions` : formatResetDate(status.resetOn)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsageOverview;
