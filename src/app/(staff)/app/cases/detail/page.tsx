"use client";

import React, { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useData } from "@/lib/data/store";
import { formatINR, formatINRCompact, formatDate } from "@/lib/format";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Clock,
  AlertTriangle,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  X,
  Sparkles,
  Phone,
  MessageCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import { StageName, CaseItem } from "@/lib/data/mock-data";

function CaseDetailContent() {
  const searchParams = useSearchParams();
  const caseCode = searchParams.get("id") || "CS-0002";
  const { cases, stages, today, updateCaseStage, updateCaseFollowup, getCaseAlerts, addContactLog } =
    useData();

  const [activeTab, setActiveTab] = useState<"documents" | "submissions" | "history" | "notes">("documents");
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Stage Change Form State (Rule R13)
  const [targetStage, setTargetStage] = useState<StageName>("Sanctioned");
  const [stageFormData, setStageFormData] = useState({
    loginDate: "2026-09-20",
    sanctionedAmount: "5000000",
    sanctionDate: "2026-09-20",
    rejectionReason: "Lender policy mismatch",
    notes: "",
  });
  const [stageError, setStageError] = useState<string | null>(null);

  // Quick Log State
  const [logForm, setLogForm] = useState({
    contact_type: "Call" as const,
    summary: "",
    next_action: "",
    next_action_date: "2026-09-25",
  });

  const currentCase = useMemo(() => {
    return cases.find((c) => c.case_code.toLowerCase() === caseCode.toLowerCase() || c.id === caseCode) || cases[1] || cases[0];
  }, [cases, caseCode]);

  const alerts = getCaseAlerts(currentCase);

  const handleStageChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStageError(null);

    const res = updateCaseStage(currentCase.id, targetStage, {
      loginDate: stageFormData.loginDate,
      sanctionedAmount: parseFloat(stageFormData.sanctionedAmount) || undefined,
      sanctionDate: stageFormData.sanctionDate,
      rejectionReason: stageFormData.rejectionReason,
      notes: stageFormData.notes,
    });

    if (!res.success) {
      setStageError(res.error || "Validation failed.");
    } else {
      setIsStageModalOpen(false);
    }
  };

  const handleSaveContactLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.summary) return;

    addContactLog({
      date: today,
      client_id: currentCase.client_id,
      client_name: currentCase.client_name,
      contact_type: logForm.contact_type,
      handled_by: currentCase.handled_by,
      linked_case_code: currentCase.case_code,
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

  // Auto-generated Document Checklist based on product & case type (App9)
  const documentsList = useMemo(() => {
    const docs = [
      { name: "Identity Proof (Aadhaar / Passport copy)", status: "Received", date: "12 Sep 2026" },
      { name: "Address Proof (Utility Bill / Rent Agreement)", status: "Received", date: "12 Sep 2026" },
      { name: "Latest 6 Months Bank Statement", status: "Requested", date: "14 Sep 2026" },
    ];

    if (currentCase.product_name.includes("Home") || currentCase.product_name.includes("Property")) {
      docs.push(
        { name: "Complete Property Title Deed Chain", status: "Pending", date: "—" },
        { name: "Approved Building Sanction Map", status: "Pending", date: "—" },
        { name: "Latest Property Tax Receipt", status: "Pending", date: "—" }
      );
    }

    if (currentCase.case_type === "Balance Transfer (Takeover)") {
      docs.push(
        { name: "Existing Loan Sanction Letter", status: "Received", date: "15 Sep 2026" },
        { name: "Latest Loan Statement of Account (SOA)", status: "Pending", date: "—" },
        { name: "Foreclosure Statement & List of Documents (LOD)", status: "Pending", date: "—" }
      );
    } else {
      docs.push(
        { name: "Last 3 Months Salary Slips / Form 16", status: "Received", date: "16 Sep 2026" },
        { name: "Last 2 Years Income Tax Returns (ITR)", status: "Pending", date: "—" }
      );
    }

    return docs;
  }, [currentCase]);

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/app/pipeline/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate hover:text-midnight transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Pipeline
        </Link>
      </div>

      {/* Case Header Card (Wireframe 4) */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm px-2.5 py-1 rounded bg-teal/10 text-teal font-bold">
                {currentCase.case_code}
              </span>
              <h1 className="text-xl font-serif font-semibold text-midnight">
                {currentCase.client_name}
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate/10 text-slate font-medium">
                {currentCase.case_type}
              </span>
            </div>

            <p className="text-xs text-slate">
              {currentCase.product_name} • Primary Lender:{" "}
              <strong className="text-midnight">{currentCase.primary_submission.lender_name}</strong>{" "}
              ({currentCase.primary_submission.banker_name}) • Handled by: {currentCase.handled_by}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsStageModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold rounded-md bg-midnight text-white hover:bg-midnight/90 shadow-sm"
            >
              Advance Stage &darr;
            </button>
            <button
              onClick={() => setIsLogModalOpen(true)}
              className="px-3 py-2 text-xs font-semibold rounded-md bg-paper border border-slate/20 text-midnight hover:bg-slate/10"
            >
              + Log Contact
            </button>
            <a
              href={`https://wa.me/?text=Hello%20${encodeURIComponent(
                currentCase.client_name
              )},%20update%20on%20your%20${encodeURIComponent(
                currentCase.product_name
              )}%20application%20(${currentCase.case_code}):%20It%20is%20currently%20at%20'${encodeURIComponent(
                currentCase.primary_submission.stage
              )}'.`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700"
              title="Send WhatsApp Update"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Highlight Stats Strip (Wireframe 4) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate/15 text-xs">
          {/* Current Stage */}
          <div className="bg-paper p-3.5 rounded-xl border border-slate/15 space-y-1">
            <span className="text-slate block text-[11px]">Current Stage</span>
            <div className="font-bold text-midnight text-sm">
              {currentCase.primary_submission.stage}
            </div>
            <div className="text-[11px] font-semibold text-amber-800 flex items-center gap-1">
              {alerts.isStuck ? (
                <>
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  STUCK ({alerts.daysInStage} days)
                </>
              ) : (
                <span className="text-slate font-normal">{alerts.daysInStage} days in stage</span>
              )}
            </div>
          </div>

          {/* Requested / Sanctioned Amount */}
          <div className="bg-paper p-3.5 rounded-xl border border-slate/15 space-y-1">
            <span className="text-slate block text-[11px]">
              {currentCase.sanctioned_amount ? "Sanctioned Amount" : "Requested Amount"}
            </span>
            <div className="font-bold text-midnight text-sm tabular-nums">
              {formatINR(currentCase.sanctioned_amount || currentCase.requested_amount)}
            </div>
            <div className="text-[11px] text-slate font-medium">
              {formatINRCompact(currentCase.sanctioned_amount || currentCase.requested_amount)}
            </div>
          </div>

          {/* Next Follow-up */}
          <div className="bg-paper p-3.5 rounded-xl border border-slate/15 space-y-1">
            <span className="text-slate block text-[11px]">Next Follow-up</span>
            <div className="font-semibold text-midnight text-sm">
              {currentCase.next_followup_on ? formatDate(currentCase.next_followup_on) : "None"}
            </div>
            <div className="text-[11px] font-bold">
              {alerts.followupAlert === "OVERDUE" ? (
                <span className="text-red-700">OVERDUE {alerts.followupDaysDiff}d</span>
              ) : alerts.followupAlert === "DUE TODAY" ? (
                <span className="text-orange-700">DUE TODAY</span>
              ) : (
                <span className="text-green-700">OK</span>
              )}
            </div>
          </div>

          {/* Balance Transfer Saving (R6) OR Expected Disbursal */}
          {alerts.btSaving ? (
            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 space-y-1">
              <span className="text-blue-900 block text-[11px] font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-600" />
                BT Annual Saving (R6)
              </span>
              <div className="font-bold text-blue-950 text-sm tabular-nums">
                {formatINR(alerts.btSaving)}/yr
              </div>
              <div className="text-[11px] text-blue-700">
                {currentCase.existing_lender}: {(currentCase.existing_roi! * 100).toFixed(2)}% &rarr; {(currentCase.proposed_roi! * 100).toFixed(2)}%
              </div>
            </div>
          ) : (
            <div className="bg-paper p-3.5 rounded-xl border border-slate/15 space-y-1">
              <span className="text-slate block text-[11px]">Expected Disbursal</span>
              <div className="font-semibold text-midnight text-sm">
                {currentCase.primary_submission.expected_disbursal_date
                  ? formatDate(currentCase.primary_submission.expected_disbursal_date)
                  : "Not set"}
              </div>
              <div className="text-[11px] text-teal font-medium">
                {alerts.isDisbursalSoon && `Due in ${alerts.daysToDisbursal} days`}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate/15 pt-2 text-xs font-semibold">
          {[
            { id: "documents", label: "Document Checklist (App9)" },
            { id: "submissions", label: "Lender Submissions" },
            { id: "history", label: "Stage History" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-3 px-3 relative transition-colors ${
                activeTab === t.id ? "text-midnight font-bold" : "text-slate hover:text-midnight"
              }`}
            >
              {t.label}
              {activeTab === t.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-midnight rounded-t-sm" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* TAB CONTENT */}

      {/* 1. Documents Tab (App9 Checklist) */}
      {activeTab === "documents" && (
        <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-base font-semibold text-midnight">Required Documents</h2>
              <p className="text-xs text-slate">Auto-generated based on product type and borrowing profile.</p>
            </div>
          </div>

          <div className="divide-y divide-slate/10 text-xs">
            {documentsList.map((doc, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${doc.status === "Received" ? "bg-green-600" : doc.status === "Requested" ? "bg-amber-500" : "bg-slate/30"}`} />
                  <span className="font-medium text-midnight">{doc.name}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-slate text-[11px]">Updated: {doc.date}</span>
                  <span className={`px-2.5 py-0.5 rounded-full font-semibold text-[11px] ${doc.status === "Received" ? "bg-green-100 text-green-800" : doc.status === "Requested" ? "bg-amber-100 text-amber-800" : "bg-slate/10 text-slate"}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Submissions Tab (Multi-Lender Submissions) */}
      {activeTab === "submissions" && (
        <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-semibold text-midnight">Lender Applications</h2>
          <div className="p-4 rounded-xl border border-teal/30 bg-teal/5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-teal font-bold">{currentCase.primary_submission.submission_code}</span>
                <span className="font-bold text-midnight text-sm">{currentCase.primary_submission.lender_name}</span>
                <span className="px-2 py-0.5 rounded bg-teal text-white font-semibold text-[10px]">PRIMARY</span>
              </div>
              <span className="font-semibold text-xs px-2.5 py-1 rounded-full bg-white text-midnight border border-slate/15">
                {currentCase.primary_submission.stage}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-slate pt-2 border-t border-slate/15">
              <div>Banker: <strong className="text-midnight">{currentCase.primary_submission.banker_name}</strong></div>
              <div>Login Date: <strong className="text-midnight">{currentCase.primary_submission.login_date || "Not logged"}</strong></div>
              <div>Expected: <strong className="text-midnight">{currentCase.primary_submission.expected_disbursal_date || "TBD"}</strong></div>
            </div>
            {currentCase.primary_submission.notes && (
              <p className="text-[11px] text-slate bg-white p-2.5 rounded border border-slate/10">
                {currentCase.primary_submission.notes}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3. History Tab */}
      {activeTab === "history" && (
        <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
          <h2 className="font-serif text-base font-semibold text-midnight">Stage Progression Audit</h2>
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-paper rounded-xl border border-slate/15 flex justify-between items-center">
              <div>
                <span className="font-semibold text-midnight block">{currentCase.primary_submission.stage}</span>
                <span className="text-slate text-[11px]">Updated by {currentCase.handled_by}</span>
              </div>
              <span className="font-mono text-slate">{formatDate(currentCase.primary_submission.stage_updated_on)}</span>
            </div>
            <div className="p-3 bg-paper/60 rounded-xl border border-slate/10 flex justify-between items-center text-slate">
              <div>
                <span className="font-medium text-midnight block">Enquiry Qualified</span>
                <span className="text-[11px]">Initial Qualification</span>
              </div>
              <span className="font-mono">{formatDate(currentCase.created_at)}</span>
            </div>
          </div>
        </div>
      )}

      {/* ADVANCE STAGE MODAL (Rule R13 Engine) */}
      {isStageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/20 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate/15">
              <h2 className="font-serif text-lg font-semibold text-midnight">Advance Case Stage</h2>
              <button onClick={() => setIsStageModalOpen(false)} className="text-slate hover:text-midnight">
                <X className="w-5 h-5" />
              </button>
            </div>

            {stageError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{stageError}</span>
              </div>
            )}

            <form onSubmit={handleStageChangeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-midnight mb-1">Target Stage (11 Stages) *</label>
                <select
                  value={targetStage}
                  onChange={(e) => setTargetStage(e.target.value as StageName)}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                >
                  {stages.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} (Win: {(s.win_prob * 100).toFixed(0)}%)
                    </option>
                  ))}
                </select>
              </div>

              {/* R13 Conditional Fields */}
              {targetStage === "Logged In (Filed)" && (
                <div>
                  <label className="block font-semibold text-midnight mb-1">
                    Bank File Login Date * (Rule R13)
                  </label>
                  <input
                    type="date"
                    required
                    value={stageFormData.loginDate}
                    onChange={(e) => setStageFormData((p) => ({ ...p, loginDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                </div>
              )}

              {targetStage === "Sanctioned" && (
                <div className="space-y-3 bg-paper p-3 rounded-lg border border-slate/15">
                  <div>
                    <label className="block font-semibold text-midnight mb-1">
                      Sanctioned Amount (₹) * (Rule R13)
                    </label>
                    <input
                      type="number"
                      required
                      value={stageFormData.sanctionedAmount}
                      onChange={(e) => setStageFormData((p) => ({ ...p, sanctionedAmount: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-midnight mb-1">
                      Sanction Date * (Rule R13)
                    </label>
                    <input
                      type="date"
                      required
                      value={stageFormData.sanctionDate}
                      onChange={(e) => setStageFormData((p) => ({ ...p, sanctionDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-white"
                    />
                  </div>
                </div>
              )}

              {(targetStage === "Rejected" || targetStage === "Dropped / Lost") && (
                <div>
                  <label className="block font-semibold text-midnight mb-1">
                    Loss Reason * (Rule R13)
                  </label>
                  <select
                    value={stageFormData.rejectionReason}
                    onChange={(e) => setStageFormData((p) => ({ ...p, rejectionReason: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                  >
                    <option value="Low credit score">Low credit score</option>
                    <option value="Insufficient income / cash flow">Insufficient income / cash flow</option>
                    <option value="Property issue (title / valuation)">Property issue (title / valuation)</option>
                    <option value="Documents not available">Documents not available</option>
                    <option value="Rate or terms not acceptable">Rate or terms not acceptable</option>
                    <option value="Lender policy mismatch">Lender policy mismatch</option>
                    <option value="Lost to competitor">Lost to competitor</option>
                    <option value="Client not responding">Client not responding</option>
                    <option value="Requirement cancelled">Requirement cancelled</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block font-semibold text-midnight mb-1">Stage Progression Notes</label>
                <textarea
                  rows={2}
                  placeholder="Notes from credit manager, branch discussion, next steps..."
                  value={stageFormData.notes}
                  onChange={(e) => setStageFormData((p) => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div className="pt-3 border-t border-slate/15 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStageModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate hover:text-midnight"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-midnight text-white font-semibold rounded-md hover:bg-midnight/90"
                >
                  Update Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK LOG MODAL */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/20 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-lg font-semibold text-midnight">Log Touchpoint for {currentCase.case_code}</h3>
            <form onSubmit={handleSaveContactLog} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-midnight mb-1">Interaction Type</label>
                <select
                  value={logForm.contact_type}
                  onChange={(e) => setLogForm((p) => ({ ...p, contact_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                >
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Visit">Bank Visit</option>
                  <option value="Meeting">Meeting</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Summary</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Case discussion summary with banker or client..."
                  value={logForm.summary}
                  onChange={(e) => setLogForm((p) => ({ ...p, summary: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Next Action</label>
                <input
                  type="text"
                  placeholder="e.g. Chase credit officer for sanction"
                  value={logForm.next_action}
                  onChange={(e) => setLogForm((p) => ({ ...p, next_action: e.target.value }))}
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

export default function CaseDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="h-64 flex items-center justify-center text-sm text-slate">
          Loading case details...
        </div>
      }
    >
      <CaseDetailContent />
    </Suspense>
  );
}
