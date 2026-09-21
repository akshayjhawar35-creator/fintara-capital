"use client";

import React from "react";
import { IndianRupee } from "lucide-react";

export default function AdminPayoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-midnight">Payouts &amp; Commissions</h1>
        <p className="text-sm text-slate">Strictly restricted to Owner (Admin). Blocked at database &amp; UI level.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-slate/15 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-gold/15 text-gold flex items-center justify-center mx-auto">
          <IndianRupee className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-lg font-semibold text-midnight">Payout Management (Phase 4)</h2>
        <p className="text-xs text-slate">
          Tracks DSA commission grid by lender and product, claim ageing (&gt; 30 days unpaid alert R12), invoice tracking, and receipt reconciliation.
        </p>
      </div>
    </div>
  );
}
