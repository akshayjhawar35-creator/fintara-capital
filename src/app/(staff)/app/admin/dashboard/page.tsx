"use client";

import React from "react";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-midnight">Executive Dashboard</h1>
        <p className="text-sm text-slate">Firm-wide pipeline, conversion funnel, and revenue metrics (Phase 5).</p>
      </div>

      <div className="bg-surface rounded-2xl border border-slate/15 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto">
          <BarChart3 className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-lg font-semibold text-midnight">Executive Dashboard (Phase 5)</h2>
        <p className="text-xs text-slate">
          Aggregates all metrics from leads, weighted pipeline, portfolio book, and monthly payout receipts.
        </p>
        <Link href="/app/" className="inline-block px-4 py-2 bg-midnight text-white text-xs font-semibold rounded-md">
          Go to My Day &rarr;
        </Link>
      </div>
    </div>
  );
}
