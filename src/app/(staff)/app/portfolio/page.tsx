"use client";

import React from "react";
import Link from "next/link";
import { Briefcase } from "lucide-react";

export default function PortfolioPreviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-midnight">Loan Portfolio &amp; Takeover Radar</h1>
        <p className="text-sm text-slate">
          Disbursed book, takeover radar (R8), top-up windows (R9) &amp; payout tracking (Phase 4).
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-slate/15 p-12 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto">
          <Briefcase className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-xl font-semibold text-midnight">Portfolio &amp; Payouts (Coming in Phase 4)</h2>
        <p className="text-sm text-slate leading-relaxed">
          Phase 4 tracks active disbursed loans (LN-0001, LN-0002), calculates exact monthly amortizations, scans for takeover opportunities when market rates drop by &ge; 0.50 pp, identifies open top-up windows, and manages DSA payout commissions.
        </p>
        <div className="pt-2">
          <Link
            href="/app/clients/"
            className="px-4 py-2 bg-midnight text-white text-xs font-semibold rounded-md hover:bg-midnight/90 inline-block"
          >
            View Active Clients &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
