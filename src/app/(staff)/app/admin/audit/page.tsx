"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useData } from "@/lib/data/store";
import { formatDate } from "@/lib/format";
import {
  Shield,
  Search,
  Filter,
  Download,
  Clock,
  User,
  Database,
  Eye,
  X,
  FileCode,
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actor_role: string;
  action: "INSERT" | "UPDATE" | "STAGE_ADVANCE" | "CONSENT_REVOKE" | "PAYOUT_CLAIM";
  table_name: string;
  record_code: string;
  old_data?: Record<string, unknown>;
  new_data: Record<string, unknown>;
  ip_address: string;
}

const INITIAL_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "aud-001",
    timestamp: "2026-09-20 17:15:22",
    actor: "Owner",
    actor_role: "admin",
    action: "STAGE_ADVANCE",
    table_name: "cases",
    record_code: "CS-0003",
    old_data: { stage: "Credit Processing", sanctioned_amount: null },
    new_data: { stage: "Sanctioned", sanctioned_amount: 11000000, sanction_date: "2026-09-17" },
    ip_address: "103.21.144.12 (Raipur)",
  },
  {
    id: "aud-002",
    timestamp: "2026-09-20 14:30:10",
    actor: "Staff 1",
    actor_role: "staff",
    action: "UPDATE",
    table_name: "leads",
    record_code: "LD-0001",
    old_data: { next_followup_on: "2026-09-17" },
    new_data: { next_followup_on: "2026-09-21", last_contact_on: "2026-09-20" },
    ip_address: "103.21.144.12 (Raipur)",
  },
  {
    id: "aud-003",
    timestamp: "2026-09-19 11:20:45",
    actor: "Owner",
    actor_role: "admin",
    action: "PAYOUT_CLAIM",
    table_name: "payouts",
    record_code: "LN-0002",
    old_data: { status: "Not Claimed" },
    new_data: { status: "Claimed", invoice_number: "INV-2026-004", invoice_date: "2026-01-20" },
    ip_address: "103.21.144.12 (Raipur)",
  },
  {
    id: "aud-004",
    timestamp: "2026-09-18 16:45:00",
    actor: "Staff 1",
    actor_role: "staff",
    action: "INSERT",
    table_name: "leads",
    record_code: "LD-0002",
    new_data: { name: "SAMPLE - Neha Gupta", mobile: "9800000012", product: "Home Loan" },
    ip_address: "103.21.144.12 (Raipur)",
  },
  {
    id: "aud-005",
    timestamp: "2026-09-17 10:10:15",
    actor: "Owner",
    actor_role: "admin",
    action: "CONSENT_REVOKE",
    table_name: "clients",
    record_code: "CL-0002",
    old_data: { consent_status: "Yes" },
    new_data: { consent_status: "Revoked", revoked_on: "2026-09-17" },
    ip_address: "103.21.144.12 (Raipur)",
  },
];

export default function AdminAuditPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("all");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const filteredLogs = useMemo(() => {
    return INITIAL_AUDIT_LOGS.filter((entry) => {
      if (selectedAction !== "all" && entry.action !== selectedAction) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = entry.record_code.toLowerCase().includes(q);
        const matchActor = entry.actor.toLowerCase().includes(q);
        const matchTable = entry.table_name.toLowerCase().includes(q);
        if (!matchCode && !matchActor && !matchTable) return false;
      }
      return true;
    });
  }, [searchQuery, selectedAction]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-semibold text-midnight">
              Append-Only Audit Trail
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-midnight text-white text-[10px] font-mono uppercase tracking-wider">
              <Shield className="w-3 h-3 text-gold" />
              Immutable Log
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate mt-0.5">
            Tamper-proof audit history of all data mutations, role changes, stage transitions, and consent updates.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface rounded-xl border border-slate/15 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-medium">
          {["all", "STAGE_ADVANCE", "UPDATE", "INSERT", "PAYOUT_CLAIM", "CONSENT_REVOKE"].map((action) => (
            <button
              key={action}
              onClick={() => setSelectedAction(action)}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedAction === action
                  ? "bg-midnight text-white font-semibold"
                  : "text-slate hover:bg-paper hover:text-midnight"
              }`}
            >
              {action === "all" ? "All Actions" : action}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            type="text"
            placeholder="Search code, actor, table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-paper rounded-lg border border-slate/20 text-xs focus:outline-teal"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-surface rounded-2xl border border-slate/15 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-paper border-b border-slate/15 font-semibold text-slate uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp (IST)</th>
                <th className="px-4 py-3">Actor / Role</th>
                <th className="px-4 py-3 text-center">Action</th>
                <th className="px-4 py-3">Table / Entity</th>
                <th className="px-4 py-3">Record Code</th>
                <th className="px-4 py-3">IP / Location</th>
                <th className="px-4 py-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10 font-mono text-[11px]">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-paper/40 transition-colors">
                  <td className="px-4 py-3 text-slate">
                    {entry.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold text-midnight block">{entry.actor}</span>
                    <span className="text-[10px] text-slate uppercase">{entry.actor_role}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        entry.action === "STAGE_ADVANCE"
                          ? "bg-teal/10 text-teal"
                          : entry.action === "CONSENT_REVOKE"
                          ? "bg-crimson/10 text-crimson"
                          : entry.action === "PAYOUT_CLAIM"
                          ? "bg-gold/15 text-gold-dark"
                          : "bg-paper text-slate"
                      }`}
                    >
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate">
                    {entry.table_name}
                  </td>
                  <td className="px-4 py-3 font-bold text-midnight">
                    {entry.record_code}
                  </td>
                  <td className="px-4 py-3 text-slate text-[10px]">
                    {entry.ip_address}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setSelectedEntry(entry)}
                      className="px-2.5 py-1 bg-paper border border-slate/20 rounded hover:border-slate/40 text-midnight text-xs font-sans inline-flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3 h-3 text-teal" />
                      <span>Diff</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Diff Inspector Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/15 p-6 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate/10">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-teal" />
                <h2 className="font-serif text-sm font-bold text-midnight">
                  Audit Mutation Diff: {selectedEntry.record_code}
                </h2>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-slate hover:text-midnight font-bold text-sm"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 text-slate text-[11px] p-2 bg-paper rounded-lg">
                <div>
                  <span className="block font-medium">Actor:</span>
                  <span className="text-midnight font-bold">{selectedEntry.actor} ({selectedEntry.actor_role})</span>
                </div>
                <div>
                  <span className="block font-medium">Time:</span>
                  <span className="text-midnight">{selectedEntry.timestamp}</span>
                </div>
              </div>

              {selectedEntry.old_data && (
                <div>
                  <label className="block text-[11px] font-semibold text-crimson mb-1">
                    Previous State (Before)
                  </label>
                  <pre className="p-3 bg-red-50/50 rounded-xl border border-red-200 text-[11px] font-mono overflow-x-auto text-red-950">
                    {JSON.stringify(selectedEntry.old_data, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-teal mb-1">
                  Mutated State (After)
                </label>
                <pre className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-200 text-[11px] font-mono overflow-x-auto text-emerald-950">
                  {JSON.stringify(selectedEntry.new_data, null, 2)}
                </pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-1.5 bg-midnight text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
