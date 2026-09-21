"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/data/store";
import { formatINR, formatINRCompact, formatDate, formatMobile } from "@/lib/format";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  MessageCircle,
  FileText,
  Calendar,
  Briefcase,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

function ClientDetailContent() {
  const searchParams = useSearchParams();
  const clientCode = searchParams.get("id") || "CL-0001";
  const { clients, contactLogs, today, revokeConsent, addContactLog } = useData();

  const [activeTab, setActiveTab] = useState<"overview" | "cases" | "loans" | "timeline" | "consent">("overview");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [logForm, setLogForm] = useState({
    contact_type: "Call" as const,
    summary: "",
    next_action: "",
    next_action_date: "2026-09-25",
  });

  const client = useMemo(() => {
    return (
      clients.find(
        (c) => c.client_code.toLowerCase() === clientCode.toLowerCase() || c.id === clientCode
      ) || clients[0]
    );
  }, [clients, clientCode]);

  const clientLogs = useMemo(() => {
    return contactLogs.filter(
      (log) => log.client_id === client.id || log.client_name.includes(client.name)
    );
  }, [contactLogs, client]);

  // Demo linked cases based on client
  const clientCases = useMemo(() => {
    if (client.client_code === "CL-0001") {
      return [
        {
          code: "CS-0001",
          type: "Fresh",
          product: "Working Capital (OD/CC)",
          amount: 4000000,
          lender: "HDFC Bank",
          stage: "Credit Processing",
          statusClass: "bg-blue-100 text-blue-800",
          disbursalDate: "2026-09-25",
        },
      ];
    }
    if (client.client_code === "CL-0002") {
      return [
        {
          code: "CS-0002",
          type: "Balance Transfer (Takeover)",
          product: "Home Loan",
          amount: 5500000,
          lender: "Bajaj Finance",
          stage: "Docs Collection",
          statusClass: "bg-yellow-100 text-yellow-800",
          disbursalDate: "2026-10-15",
        },
      ];
    }
    return [
      {
        code: "CS-0003",
        type: "Fresh",
        product: "Loan Against Property",
        amount: 11000000,
        lender: "HDFC Bank",
        stage: "Sanctioned",
        statusClass: "bg-green-100 text-green-800",
        disbursalDate: "2026-10-08",
      },
    ];
  }, [client]);

  // Demo linked loans based on client
  const clientLoans = useMemo(() => {
    if (client.client_code === "CL-0001") {
      return [
        {
          code: "LN-0001",
          product: "Business Loan",
          lender: "Bajaj Finance",
          disbursed_amt: 2500000,
          disbursed_on: "2025-06-17",
          roi: 0.155,
          tenure_months: 48,
          emi: 70212,
          est_outstanding: 1876770,
          account_last4: "1234",
          status: "Active",
        },
      ];
    }
    if (client.client_code === "CL-0003") {
      return [
        {
          code: "LN-0002",
          product: "Home Loan",
          lender: "HDFC Bank",
          disbursed_amt: 6000000,
          disbursed_on: "2026-01-13",
          roi: 0.091,
          tenure_months: 240,
          emi: 54370,
          est_outstanding: 5927127,
          account_last4: "5678",
          status: "Active",
        },
      ];
    }
    return [];
  }, [client]);

  const handleSaveContactLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.summary) return;

    addContactLog({
      date: today,
      client_id: client.id,
      client_name: client.name,
      contact_type: logForm.contact_type,
      handled_by: client.relationship_owner,
      summary: logForm.summary,
      next_action: logForm.next_action,
      next_action_date: logForm.next_action_date,
    });

    setIsLogModalOpen(false);
    setLogForm({
      contact_type: "Call",
      summary: "",
      next_action: "",
      next_action_date: "2026-09-25",
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/app/clients/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-midnight transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Clients Directory
        </Link>
      </div>

      {/* 360 Header Card */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-midnight text-white flex items-center justify-center font-serif text-xl font-bold shrink-0">
              {client.name.replace("SAMPLE - ", "").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-serif font-semibold text-midnight">{client.name}</h1>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-teal/10 text-teal font-semibold">
                  {client.client_code}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-slate/10 text-slate font-medium">
                  {client.client_type}
                </span>
                {client.consent_status === "Yes" ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-green-600" />
                    DPDP Consented
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded-full">
                    <ShieldAlert className="w-3 h-3 text-red-600" />
                    Consent Revoked
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate mt-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate/60" />
                  {formatMobile(client.mobile)}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate/60" />
                  {client.email || "No email"}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate/60" />
                  {client.city_area}, Raipur
                </span>
                <span>•</span>
                <span>Owner: <strong className="text-midnight">{client.relationship_owner}</strong></span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <a
              href={`https://wa.me/91${client.mobile.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(
                client.contact_person
              )},%20this%20is%20Fintara%20Capital.`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>

            <button
              onClick={() => setIsLogModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-md bg-midnight text-white hover:bg-midnight/90 transition-colors shadow-xs"
            >
              + Log Contact
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate/15 mt-6 pt-2 overflow-x-auto text-xs font-semibold">
          {[
            { id: "overview", label: "Overview" },
            { id: "cases", label: `Cases (${clientCases.length})` },
            { id: "loans", label: `Active Loans (${clientLoans.length})` },
            { id: "timeline", label: `Contact Log (${clientLogs.length})` },
            { id: "consent", label: "DPDP Consent" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 relative transition-colors ${
                activeTab === tab.id ? "text-midnight font-bold" : "text-slate hover:text-midnight"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-midnight rounded-t-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* 1. Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface p-6 rounded-2xl border border-slate/15 shadow-xs space-y-4">
              <h2 className="font-serif text-base font-semibold text-midnight">Profile &amp; Entity Details</h2>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate block mb-1">Entity / Business Name</span>
                  <span className="font-medium text-midnight">{client.business_name || "Individual / Self"}</span>
                </div>
                <div>
                  <span className="text-slate block mb-1">Client Profile</span>
                  <span className="font-medium text-midnight">{client.client_type}</span>
                </div>
                {client.turnover && (
                  <div>
                    <span className="text-slate block mb-1">Annual Turnover</span>
                    <span className="font-semibold text-midnight tabular-nums">
                      {formatINR(client.turnover)} ({formatINRCompact(client.turnover)})
                    </span>
                  </div>
                )}
                {client.annual_income && (
                  <div>
                    <span className="text-slate block mb-1">Annual Salary</span>
                    <span className="font-semibold text-midnight tabular-nums">
                      {formatINR(client.annual_income)} ({formatINRCompact(client.annual_income)})
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-slate block mb-1">Registered Address (Raipur)</span>
                  <span className="font-medium text-midnight">{client.address}</span>
                </div>
                <div>
                  <span className="text-slate block mb-1">Client Since</span>
                  <span className="font-medium text-midnight">{formatDate(client.client_since)}</span>
                </div>
                <div>
                  <span className="text-slate block mb-1">Lead Source</span>
                  <span className="font-medium text-midnight">{client.source}</span>
                </div>
                <div>
                  <span className="text-slate block mb-1">Relationship Manager</span>
                  <span className="font-medium text-midnight">{client.relationship_owner}</span>
                </div>
              </div>

              {client.notes && (
                <div className="pt-4 border-t border-slate/10">
                  <span className="text-xs text-slate block mb-1 font-semibold">Banking Conduct &amp; Relationship Notes</span>
                  <p className="text-xs text-midnight bg-paper p-3 rounded-lg border border-slate/10 leading-relaxed">
                    {client.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Secure Document Links (Rule A9: Store link only, no KYC IDs) */}
          <div className="space-y-6">
            <div className="bg-surface p-6 rounded-2xl border border-slate/15 shadow-xs space-y-4">
              <h2 className="font-serif text-base font-semibold text-midnight">Secure Document Folder</h2>
              <p className="text-xs text-slate leading-relaxed">
                Per rule A9, raw KYC numbers (PAN, Aadhaar) are never stored in the database. All supporting proofs reside in your encrypted cloud drive.
              </p>
              <div className="p-3.5 bg-paper rounded-lg border border-slate/15 text-xs space-y-2">
                <div className="font-semibold text-midnight flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal" />
                  Client Documents Folder
                </div>
                <div className="text-slate break-all">
                  https://drive.google.com/drive/folders/fintara-vault-{client.client_code.toLowerCase()}
                </div>
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); alert("Opening secure client drive folder (placeholder link)."); }}
                  className="inline-flex items-center gap-1 text-teal font-semibold hover:underline mt-1"
                >
                  Open in Secure Drive
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Cases Tab */}
      {activeTab === "cases" && (
        <div className="bg-surface rounded-2xl border border-slate/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate/15 flex items-center justify-between">
            <h2 className="font-serif text-base font-semibold text-midnight">Pipeline Applications &amp; Submissions</h2>
          </div>
          <div className="divide-y divide-slate/10">
            {clientCases.map((cs) => (
              <div key={cs.code} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-paper/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-teal">{cs.code}</span>
                    <span className="font-semibold text-sm text-midnight">{cs.product}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate/10 text-slate font-medium">{cs.type}</span>
                  </div>
                  <div className="text-xs text-slate">
                    Lender: <strong className="text-midnight">{cs.lender}</strong> • Expected Disbursal: {formatDate(cs.disbursalDate)}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-midnight tabular-nums">{formatINR(cs.amount)}</div>
                    <div className="text-xs text-slate font-medium">{formatINRCompact(cs.amount)}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cs.statusClass}`}>
                    {cs.stage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Active Loans Tab */}
      {activeTab === "loans" && (
        <div className="bg-surface rounded-2xl border border-slate/15 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate/15">
            <h2 className="font-serif text-base font-semibold text-midnight">Disbursed Loans (Portfolio)</h2>
          </div>
          {clientLoans.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate">No active loans on file for this client.</div>
          ) : (
            <div className="divide-y divide-slate/10">
              {clientLoans.map((ln) => (
                <div key={ln.code} className="p-4 space-y-3 hover:bg-paper/40 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal">{ln.code}</span>
                      <span className="font-semibold text-sm text-midnight">{ln.product}</span>
                      <span className="text-xs text-slate">({ln.lender} • A/c ..{ln.account_last4})</span>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200">
                      {ln.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-paper p-3 rounded-lg border border-slate/10">
                    <div>
                      <span className="text-slate block mb-0.5">Disbursed Amount</span>
                      <span className="font-semibold text-midnight tabular-nums">{formatINR(ln.disbursed_amt)}</span>
                    </div>
                    <div>
                      <span className="text-slate block mb-0.5">Rate of Interest</span>
                      <span className="font-semibold text-midnight tabular-nums">{(ln.roi * 100).toFixed(2)}%</span>
                    </div>
                    <div>
                      <span className="text-slate block mb-0.5">Monthly EMI</span>
                      <span className="font-semibold text-midnight tabular-nums">{formatINR(ln.emi)}</span>
                    </div>
                    <div>
                      <span className="text-slate block mb-0.5">Est. Outstanding</span>
                      <span className="font-semibold text-midnight tabular-nums">{formatINR(ln.est_outstanding)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. Contact Log Timeline */}
      {activeTab === "timeline" && (
        <div className="bg-surface rounded-2xl border border-slate/15 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-base font-semibold text-midnight">Contact History &amp; Next Actions</h2>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="text-xs font-semibold text-teal hover:underline"
            >
              + Log New Touchpoint
            </button>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate/15">
            {clientLogs.length === 0 ? (
              <div className="text-xs text-slate py-4">No contact history logged yet.</div>
            ) : (
              clientLogs.map((log) => (
                <div key={log.id} className="relative flex items-start gap-4 pl-8">
                  <div className="w-3 h-3 rounded-full bg-teal ring-4 ring-white absolute left-2 top-1.5" />
                  <div className="bg-paper p-4 rounded-xl border border-slate/15 flex-1 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-midnight">
                        {log.contact_type} by {log.handled_by}
                      </span>
                      <span className="text-slate">{formatDate(log.date)}</span>
                    </div>
                    <p className="text-slate leading-relaxed">{log.summary}</p>
                    {log.next_action && (
                      <div className="pt-2 border-t border-slate/10 flex items-center justify-between text-teal font-medium">
                        <span>Next: {log.next_action}</span>
                        <span>Due: {formatDate(log.next_action_date)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 5. DPDP Consent Tab */}
      {activeTab === "consent" && (
        <div className="bg-surface rounded-2xl border border-slate/15 shadow-xs p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-serif text-base font-semibold text-midnight">Digital Personal Data Protection (DPDP) Record</h2>
              <p className="text-xs text-slate">
                Statutory record of consent for loan sourcing and credit advisory.
              </p>
            </div>
            {client.consent_status === "Yes" && (
              <button
                onClick={() => {
                  if (confirm("Are you sure you want to revoke consent for this client? Per DPDP Act rules, marketing touchpoints must cease.")) {
                    revokeConsent(client.id);
                  }
                }}
                className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors"
              >
                Revoke Consent
              </button>
            )}
          </div>

          <div className="bg-paper p-4 rounded-xl border border-slate/15 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-slate block mb-1">Consent Status</span>
                <span className={`font-semibold ${client.consent_status === "Yes" ? "text-green-700" : "text-red-700"}`}>
                  {client.consent_status}
                </span>
              </div>
              <div>
                <span className="text-slate block mb-1">Consent Channel</span>
                <span className="font-medium text-midnight">{client.consent_channel || "Verbal"}</span>
              </div>
              <div>
                <span className="text-slate block mb-1">Recorded Date</span>
                <span className="font-medium text-midnight">{formatDate(client.consent_date || client.client_since)}</span>
              </div>
              <div>
                <span className="text-slate block mb-1">Relationship Manager</span>
                <span className="font-medium text-midnight">{client.relationship_owner}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOG INTERACTION MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/20 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-lg font-semibold text-midnight">Log Interaction with {client.name}</h3>

            <form onSubmit={handleSaveContactLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-midnight mb-1">Contact Type</label>
                <select
                  value={logForm.contact_type}
                  onChange={(e) => setLogForm((p) => ({ ...p, contact_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                >
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Visit">Client Visit / Branch</option>
                  <option value="Meeting">In-person Meeting</option>
                  <option value="Portfolio Review">Portfolio Review</option>
                  <option value="Rate Update Sent">Rate Update Sent</option>
                  <option value="Greeting">Greeting (Birthday / Festival)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Discussion Summary</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Key discussion points, lender updates, required papers..."
                  value={logForm.summary}
                  onChange={(e) => setLogForm((p) => ({ ...p, summary: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Next Action Required</label>
                <input
                  type="text"
                  placeholder="e.g. Collect ITR copy, follow up with banker"
                  value={logForm.next_action}
                  onChange={(e) => setLogForm((p) => ({ ...p, next_action: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Next Action Due Date</label>
                <input
                  type="date"
                  value={logForm.next_action_date}
                  onChange={(e) => setLogForm((p) => ({ ...p, next_action_date: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div className="pt-3 border-t border-slate/15 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate hover:text-midnight"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-midnight text-white font-semibold rounded-md hover:bg-midnight/90"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ClientDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center text-sm text-slate">
          Loading client profile...
        </div>
      }
    >
      <ClientDetailContent />
    </Suspense>
  );
}
