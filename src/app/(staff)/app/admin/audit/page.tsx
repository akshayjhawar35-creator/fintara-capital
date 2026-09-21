"use client";

import React from "react";
import { Shield } from "lucide-react";

export default function AdminAuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-midnight">Append-Only Audit Log</h1>
        <p className="text-sm text-slate">Immutable tamper-proof audit trail of all database mutations and logins.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-slate/15 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-700 flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-lg font-semibold text-midnight">Audit Trail (Append-Only)</h2>
        <p className="text-xs text-slate">
          Every insert, update, and delete triggers an immutable record in audit_log capturing old and new records as JSONB.
        </p>
      </div>
    </div>
  );
}
