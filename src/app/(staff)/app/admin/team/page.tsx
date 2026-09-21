"use client";

import React from "react";
import { UserCog } from "lucide-react";

export default function AdminTeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-midnight">Team Management</h1>
        <p className="text-sm text-slate">Staff accounts, role assignments, and deactivation with lead re-assignment.</p>
      </div>

      <div className="bg-surface rounded-2xl border border-slate/15 p-12 text-center max-w-xl mx-auto space-y-4 shadow-xs">
        <div className="w-16 h-16 rounded-full bg-midnight/10 text-midnight flex items-center justify-center mx-auto">
          <UserCog className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-lg font-semibold text-midnight">Team Administration</h2>
        <p className="text-xs text-slate">
          Owner + up to 3 staff. Deactivated staff accounts automatically prompt to reassign active cases.
        </p>
      </div>
    </div>
  );
}
