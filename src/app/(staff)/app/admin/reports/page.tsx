"use client";

import React from "react";
import { FileBarChart } from "lucide-react";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-midnight">Business Intelligence &amp; Reports</h1>
        <p className="text-sm text-slate">Lender-wise, source-wise, rejection reason, and staff performance analytics (Phase 7).</p>
      </div>

      <div className="bg-surface rounded-2xl border border-slate/15 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto">
          <FileBarChart className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-lg font-semibold text-midnight">Reports Engine (Phase 7)</h2>
        <p className="text-xs text-slate">
          8 standard reports with CSV and printable formats.
        </p>
      </div>
    </div>
  );
}
