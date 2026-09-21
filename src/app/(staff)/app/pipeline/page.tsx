"use client";

import React from "react";
import Link from "next/link";
import { Kanban, ArrowRight } from "lucide-react";

export default function PipelinePreviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">Pipeline &amp; Case Tracking</h1>
          <p className="text-sm text-slate">
            Multi-lender loan submissions, drag-and-drop stage progression (Phase 3).
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-slate/15 p-12 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto">
          <Kanban className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-semibold text-midnight">Pipeline Engine (Coming in Phase 3)</h2>
        <p className="text-sm text-slate leading-relaxed">
          Phase 3 builds the 11-stage progression engine: Enquiry Qualified &rarr; Docs Collection &rarr; Logged In &rarr; Credit Processing &rarr; Sanctioned &rarr; Disbursed, with full stage history audit, lender submission tracking, and automated weighted pipeline values.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/app/leads/"
            className="px-4 py-2 bg-midnight text-white text-xs font-semibold rounded-md hover:bg-midnight/90"
          >
            Go to Leads &rarr;
          </Link>
          <Link
            href="/app/clients/"
            className="px-4 py-2 bg-paper border border-slate/20 text-midnight text-xs font-semibold rounded-md hover:bg-slate/10"
          >
            Go to Clients &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
