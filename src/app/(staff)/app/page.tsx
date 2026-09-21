"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useData } from "@/lib/data/store";
import { formatINR, formatDate, formatMobile } from "@/lib/format";
import WhatsAppModal from "@/components/app/WhatsAppModal";
import {
  Clock,
  AlertCircle,
  Phone,
  MessageCircle,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Cake,
  Building2,
  ChevronRight,
  MoreHorizontal,
  Flame,
  UserCheck,
  SlidersHorizontal,
} from "lucide-react";

export default function MyDayPage() {
  const { profile, isAdmin } = useAuth();
  const {
    leads,
    cases,
    loans,
    clients,
    today,
    getFollowupAlert,
    getCaseAlerts,
    getLoanMath,
    updateLeadFollowup,
    updateCaseFollowup,
    addContactLog,
  } = useData();

  const [staffFilter, setStaffFilter] = useState<"all" | "mine">("all");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // WhatsApp Modal State
  const [waModalConfig, setWaModalConfig] = useState<{
    isOpen: boolean;
    clientName: string;
    mobile: string;
    consent: boolean;
    clientId?: string;
    caseCode?: string;
    product?: string;
    templateId?: string;
  }>({
    isOpen: false,
    clientName: "",
    mobile: "",
    consent: false,
  });

  const staffName = profile?.full_name?.split(" ")[0] || "Team Member";
  const userTeamLabel = profile?.team_label || (isAdmin ? "Owner" : "Staff 1");

  // Helper to add days to ISO string
  const addDays = (baseDateStr: string, numDays: number) => {
    const d = new Date(baseDateStr);
    d.setDate(d.getDate() + numDays);
    return d.toISOString().split("T")[0];
  };

  // Helper to check Birthday / Anniversary in next 7 days (Rule R22)
  const isCelebrationThisWeek = (dateStr?: string) => {
    if (!dateStr) return false;
    const celebration = new Date(dateStr);
    const curr = new Date(today);

    // Normalize to current year
    celebration.setFullYear(curr.getFullYear());
    const diff = (celebration.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  };

  // 1. Overdue Items
  const overdueLeads = useMemo(() => {
    return leads.filter((l) => {
      if (staffFilter === "mine" && l.assigned_to !== userTeamLabel) return false;
      return getFollowupAlert(l.next_followup_on).alert === "OVERDUE";
    });
  }, [leads, staffFilter, userTeamLabel, getFollowupAlert]);

  const overdueCases = useMemo(() => {
    return cases.filter((c) => {
      if (staffFilter === "mine" && c.handled_by !== userTeamLabel) return false;
      return getFollowupAlert(c.next_followup_on).alert === "OVERDUE";
    });
  }, [cases, staffFilter, userTeamLabel, getFollowupAlert]);

  const overdueReviews = useMemo(() => {
    return loans.filter((ln) => {
      if (staffFilter === "mine" && ln.handled_by !== userTeamLabel) return false;
      return getLoanMath(ln).review.status === "OVERDUE";
    });
  }, [loans, staffFilter, userTeamLabel, getLoanMath]);

  // 2. Due Today Items
  const dueTodayLeads = useMemo(() => {
    return leads.filter((l) => {
      if (staffFilter === "mine" && l.assigned_to !== userTeamLabel) return false;
      return getFollowupAlert(l.next_followup_on).alert === "DUE TODAY";
    });
  }, [leads, staffFilter, userTeamLabel, getFollowupAlert]);

  const dueTodayCases = useMemo(() => {
    return cases.filter((c) => {
      if (staffFilter === "mine" && c.handled_by !== userTeamLabel) return false;
      return getFollowupAlert(c.next_followup_on).alert === "DUE TODAY";
    });
  }, [cases, staffFilter, userTeamLabel, getFollowupAlert]);

  const dueTodayReviews = useMemo(() => {
    return loans.filter((ln) => {
      if (staffFilter === "mine" && ln.handled_by !== userTeamLabel) return false;
      return getLoanMath(ln).review.status === "DUE TODAY";
    });
  }, [loans, staffFilter, userTeamLabel, getLoanMath]);

  // 3. Stuck Cases (Rule R3: > 10d in stage)
  const stuckCases = useMemo(() => {
    return cases.filter((c) => {
      if (staffFilter === "mine" && c.handled_by !== userTeamLabel) return false;
      return getCaseAlerts(c).isStuck;
    });
  }, [cases, staffFilter, userTeamLabel, getCaseAlerts]);

  // 4. Expected Disbursals This Week (Rule R4)
  const expectedDisbursals = useMemo(() => {
    return cases.filter((c) => {
      if (staffFilter === "mine" && c.handled_by !== userTeamLabel) return false;
      return (
        c.primary_submission.stage === "Disbursement Pending" ||
        getCaseAlerts(c).isDisbursalSoon
      );
    });
  }, [cases, staffFilter, userTeamLabel, getCaseAlerts]);

  // 5. Birthdays / Anniversaries (Rule R22)
  const celebrationClients = useMemo(() => {
    return clients.filter((c) => {
      return (
        isCelebrationThisWeek(c.dob) ||
        isCelebrationThisWeek(c.incorporated_on)
      );
    });
  }, [clients]);

  // 6. Due Soon (Next 7 days)
  const dueSoonLeads = useMemo(() => {
    return leads.filter((l) => {
      if (staffFilter === "mine" && l.assigned_to !== userTeamLabel) return false;
      return getFollowupAlert(l.next_followup_on).alert === "DUE SOON";
    });
  }, [leads, staffFilter, userTeamLabel, getFollowupAlert]);

  const dueSoonCases = useMemo(() => {
    return cases.filter((c) => {
      if (staffFilter === "mine" && c.handled_by !== userTeamLabel) return false;
      return getFollowupAlert(c.next_followup_on).alert === "DUE SOON";
    });
  }, [cases, staffFilter, userTeamLabel, getFollowupAlert]);

  // Total Action Count
  const totalActionCount =
    overdueLeads.length +
    overdueCases.length +
    overdueReviews.length +
    dueTodayLeads.length +
    dueTodayCases.length +
    dueTodayReviews.length +
    stuckCases.length;

  // Snooze Actions
  const handleSnoozeLead = (leadId: string, days: number) => {
    const newDate = addDays(today, days);
    updateLeadFollowup(leadId, newDate);
    setSuccessToast(`Follow-up rescheduled to ${formatDate(newDate)}.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSnoozeCase = (caseId: string, days: number) => {
    const newDate = addDays(today, days);
    updateCaseFollowup(caseId, newDate);
    setSuccessToast(`Case follow-up rescheduled to ${formatDate(newDate)}.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Open WhatsApp Helper
  const triggerWhatsApp = (
    clientName: string,
    mobile: string,
    consent: boolean,
    clientId?: string,
    caseCode?: string,
    product?: string,
    templateId?: string
  ) => {
    setWaModalConfig({
      isOpen: true,
      clientName,
      mobile,
      consent,
      clientId,
      caseCode,
      product,
      templateId,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Greeting & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">
            Good morning, {staffName}.
          </h1>
          <p className="text-xs text-slate mt-0.5">
            System Date: <strong className="text-midnight">{formatDate(today)}</strong> (Asia/Kolkata) • Morning 10-minute triage routine
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {isAdmin && (
            <div className="flex items-center border border-slate/20 rounded-lg p-0.5 bg-paper">
              <button
                onClick={() => setStaffFilter("all")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  staffFilter === "all" ? "bg-white shadow-xs text-midnight" : "text-slate"
                }`}
              >
                Firm-wide
              </button>
              <button
                onClick={() => setStaffFilter("mine")}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                  staffFilter === "mine" ? "bg-white shadow-xs text-midnight" : "text-slate"
                }`}
              >
                Assigned to Me
              </button>
            </div>
          )}

          <span
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
              totalActionCount > 0
                ? "bg-amber-50 text-amber-900 border-amber-200"
                : "bg-emerald-50 text-emerald-800 border-emerald-200"
            }`}
          >
            {totalActionCount > 0 ? (
              <>⚡ <strong>{totalActionCount}</strong> items needing action today</>
            ) : (
              <>✨ All caught up! Time for a cup of chai.</>
            )}
          </span>
        </div>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="p-3 bg-teal/10 border border-teal/20 rounded-xl text-xs text-teal font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ACTION LIST: Grouped by Urgency (Wireframe 2) */}
      <div className="space-y-6">
        {/* 1. OVERDUE SECTION (RED) */}
        {(overdueLeads.length > 0 || overdueCases.length > 0 || overdueReviews.length > 0) && (
          <section className="bg-surface rounded-2xl border border-red-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-red-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-red-900">
                  Overdue Actions ({overdueLeads.length + overdueCases.length + overdueReviews.length})
                </h2>
              </div>
              <span className="text-[11px] text-red-700 font-medium">Clear these first</span>
            </div>

            <div className="space-y-2.5">
              {/* Overdue Leads */}
              {overdueLeads.map((lead) => {
                const alertInfo = getFollowupAlert(lead.next_followup_on);
                return (
                  <div
                    key={lead.id}
                    className="p-3.5 rounded-xl bg-red-50/50 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-midnight bg-white px-1.5 py-0.5 rounded border border-red-200 text-[11px]">
                          {lead.lead_code}
                        </span>
                        <span className="font-semibold text-midnight text-sm">{lead.name}</span>
                        <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                          {alertInfo.daysDiff}d OVERDUE
                        </span>
                      </div>
                      <div className="text-slate text-[11px] flex items-center gap-2">
                        <span>Lead ({lead.product_name})</span>
                        <span>•</span>
                        <span>Raipur - {lead.location_area}</span>
                        <span>•</span>
                        <span>Follow-up was {formatDate(lead.next_followup_on || "")}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`tel:${lead.mobile}`}
                        className="px-2.5 py-1.5 bg-white border border-slate/20 rounded-lg text-slate hover:text-midnight hover:border-slate/40 flex items-center gap-1 font-semibold"
                      >
                        <Phone className="w-3 h-3 text-midnight" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() =>
                          triggerWhatsApp(
                            lead.name,
                            lead.mobile,
                            true, // Lead inquiry
                            undefined,
                            lead.lead_code,
                            lead.product_name,
                            "t10_gentle_followup"
                          )
                        }
                        className="px-2.5 py-1.5 bg-white border border-slate/20 rounded-lg text-slate hover:text-midnight hover:border-slate/40 flex items-center gap-1 font-semibold"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>

                      <div className="flex items-center border border-slate/20 rounded-lg bg-white overflow-hidden">
                        <button
                          onClick={() => handleSnoozeLead(lead.id, 1)}
                          className="px-2 py-1 text-[11px] font-medium hover:bg-paper border-r border-slate/15"
                          title="Snooze 1 day"
                        >
                          +1d
                        </button>
                        <button
                          onClick={() => handleSnoozeLead(lead.id, 3)}
                          className="px-2 py-1 text-[11px] font-medium hover:bg-paper"
                          title="Snooze 3 days"
                        >
                          +3d
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Overdue Cases */}
              {overdueCases.map((c) => {
                const alertInfo = getFollowupAlert(c.next_followup_on);
                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-red-50/50 border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-midnight bg-white px-1.5 py-0.5 rounded border border-red-200 text-[11px]">
                          {c.case_code}
                        </span>
                        <Link
                          href={`/app/cases/detail?id=${c.case_code}`}
                          className="font-semibold text-midnight text-sm hover:text-teal"
                        >
                          {c.client_name}
                        </Link>
                        <span className="px-1.5 py-0.2 rounded bg-red-100 text-red-800 text-[10px] font-bold">
                          {alertInfo.daysDiff}d OVERDUE
                        </span>
                      </div>
                      <div className="text-slate text-[11px] flex items-center gap-2">
                        <span>Case ({c.product_name})</span>
                        <span>•</span>
                        <span>Stage: {c.primary_submission.stage}</span>
                        <span>•</span>
                        <span>Lender: {c.primary_submission.lender_name}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/app/cases/detail?id=${c.case_code}`}
                        className="px-3 py-1.5 bg-midnight text-white text-xs font-semibold rounded-lg hover:bg-midnight/90"
                      >
                        Open Case &rarr;
                      </Link>
                      <button
                        onClick={() => handleSnoozeCase(c.id, 1)}
                        className="px-2 py-1 bg-white border border-slate/20 rounded text-[11px] hover:bg-paper"
                      >
                        +1d
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. DUE TODAY SECTION (AMBER) */}
        {(dueTodayLeads.length > 0 || dueTodayCases.length > 0 || dueTodayReviews.length > 0) && (
          <section className="bg-surface rounded-2xl border border-amber-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-amber-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-amber-950">
                  Due Today ({dueTodayLeads.length + dueTodayCases.length + dueTodayReviews.length})
                </h2>
              </div>
              <span className="text-[11px] text-amber-800 font-medium">Scheduled for today</span>
            </div>

            <div className="space-y-2.5">
              {/* Due Today Cases */}
              {dueTodayCases.map((c) => (
                <div
                  key={c.id}
                  className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-midnight bg-white px-1.5 py-0.5 rounded border border-amber-200">
                        {c.case_code}
                      </span>
                      <Link
                        href={`/app/cases/detail?id=${c.case_code}`}
                        className="font-semibold text-midnight text-sm hover:text-teal"
                      >
                        {c.client_name}
                      </Link>
                      <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                        DUE TODAY
                      </span>
                    </div>
                    <div className="text-slate text-[11px] mt-0.5">
                      {c.product_name} • {c.primary_submission.stage} ({c.primary_submission.lender_name})
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/app/cases/detail?id=${c.case_code}`}
                      className="px-3 py-1.5 bg-midnight text-white font-semibold rounded-lg text-xs"
                    >
                      Update Case &rarr;
                    </Link>
                  </div>
                </div>
              ))}

              {/* Due Today Leads */}
              {dueTodayLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-midnight bg-white px-1.5 py-0.5 rounded border border-amber-200">
                        {lead.lead_code}
                      </span>
                      <span className="font-semibold text-midnight">{lead.name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                        DUE TODAY
                      </span>
                    </div>
                    <div className="text-slate text-[11px] mt-0.5">
                      {lead.product_name} ({formatINR(lead.amount)}) • {lead.location_area}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${lead.mobile}`}
                      className="px-2.5 py-1.5 bg-white border border-slate/20 rounded-lg text-slate font-medium"
                    >
                      Call
                    </a>
                    <button
                      onClick={() =>
                        triggerWhatsApp(
                          lead.name,
                          lead.mobile,
                          true, // Lead inquiry
                          undefined,
                          lead.lead_code,
                          lead.product_name
                        )
                      }
                      className="px-2.5 py-1.5 bg-white border border-slate/20 rounded-lg text-emerald-700 font-semibold"
                    >
                      WhatsApp
                    </button>
                  </div>
                </div>
              ))}

              {/* Due Today Reviews (Rule R10) */}
              {dueTodayReviews.map((ln) => (
                <div
                  key={ln.id}
                  className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-midnight bg-white px-1.5 py-0.5 rounded border border-amber-200">
                        {ln.loan_code}
                      </span>
                      <span className="font-semibold text-midnight">{ln.client_name}</span>
                      <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[10px] font-bold">
                        ROUTINE REVIEW DUE
                      </span>
                    </div>
                    <div className="text-slate text-[11px] mt-0.5">
                      6-month portfolio review call for {ln.product_name} ({ln.lender_name})
                    </div>
                  </div>

                  <Link
                    href="/app/portfolio/"
                    className="px-3 py-1.5 bg-white border border-slate/20 rounded-lg font-semibold text-slate hover:text-midnight"
                  >
                    View in Portfolio &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. STUCK CASES SECTION (DARK/RED ALERT - Rule R3) */}
        {stuckCases.length > 0 && (
          <section className="bg-surface rounded-2xl border border-slate/20 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate/10 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate/10 text-midnight flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-crimson" />
                </div>
                <h2 className="text-sm font-bold text-midnight">
                  Stuck Cases (&gt; 10 Days in Stage) ({stuckCases.length})
                </h2>
              </div>
              <span className="text-[11px] text-crimson font-semibold">Rule R3 Alert</span>
            </div>

            <div className="space-y-2.5">
              {stuckCases.map((c) => {
                const alerts = getCaseAlerts(c);
                return (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-paper border border-slate/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-midnight bg-surface px-1.5 py-0.5 rounded border border-slate/20">
                          {c.case_code}
                        </span>
                        <Link
                          href={`/app/cases/detail?id=${c.case_code}`}
                          className="font-semibold text-midnight text-sm hover:text-teal"
                        >
                          {c.client_name}
                        </Link>
                        <span className="px-1.5 py-0.2 rounded bg-crimson/10 text-crimson text-[10px] font-bold">
                          STUCK: {alerts.daysInStage} DAYS IN {c.primary_submission.stage.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-slate text-[11px]">
                        Lender: {c.primary_submission.lender_name} • Banker: {c.primary_submission.banker_name || "Unassigned"}
                        {c.primary_submission.notes && (
                          <span className="block italic text-slate/80 mt-0.5">&ldquo;{c.primary_submission.notes}&rdquo;</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/app/cases/detail?id=${c.case_code}`}
                        className="px-3 py-1.5 bg-midnight text-white text-xs font-semibold rounded-lg hover:bg-midnight/90"
                      >
                        Chase Banker &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 4. EXPECTED DISBURSALS THIS WEEK (Rule R4) */}
        {expectedDisbursals.length > 0 && (
          <section className="bg-surface rounded-2xl border border-teal/20 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-teal/15 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-teal/10 text-teal flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-teal-dark">
                  Expected Disbursals This Week (Rule R4)
                </h2>
              </div>
              <span className="text-[11px] text-teal font-semibold">Priority Closing</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {expectedDisbursals.map((c) => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-xl bg-teal/5 border border-teal/15 text-xs space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-midnight">{c.case_code}</span>
                      <span className="font-bold text-teal text-sm tabular-nums">
                        {formatINR(c.sanctioned_amount || c.requested_amount)}
                      </span>
                    </div>
                    <div className="font-semibold text-midnight mt-1">{c.client_name}</div>
                    <div className="text-[11px] text-slate mt-0.5">
                      {c.product_name} • {c.primary_submission.lender_name}
                    </div>
                    <div className="text-[11px] text-teal font-medium mt-1">
                      Target Disbursal: {c.primary_submission.expected_disbursal_date ? formatDate(c.primary_submission.expected_disbursal_date) : "Pending"}
                    </div>
                  </div>

                  <Link
                    href={`/app/cases/detail?id=${c.case_code}`}
                    className="w-full py-1.5 bg-midnight text-white text-center rounded-lg text-xs font-semibold hover:bg-midnight/90 block mt-2"
                  >
                    View Closing Details &rarr;
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CELEBRATIONS THIS WEEK (Rule R22) */}
        {celebrationClients.length > 0 && (
          <section className="bg-surface rounded-2xl border border-purple-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-purple-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Cake className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm font-bold text-purple-950">
                  Birthdays &amp; Anniversaries This Week (Rule R22)
                </h2>
              </div>
              <span className="text-[11px] text-purple-800 font-medium">Relationship Touchpoint</span>
            </div>

            <div className="space-y-2">
              {celebrationClients.map((cl) => (
                <div
                  key={cl.id}
                  className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-midnight block text-sm">{cl.name}</span>
                    <span className="text-[11px] text-slate">
                      {cl.city_area} • Client since {cl.client_since ? formatDate(cl.client_since) : "2026"}
                    </span>
                  </div>

                  <button
                    onClick={() =>
                      triggerWhatsApp(
                        cl.name,
                        cl.mobile,
                        cl.consent_status === "Yes",
                        cl.id,
                        undefined,
                        undefined,
                        "t9_birthday_greeting"
                      )
                    }
                    className="px-3 py-1.5 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 text-xs shadow-xs"
                  >
                    Send Greeting (App8)
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. UPCOMING THIS WEEK */}
        {(dueSoonLeads.length > 0 || dueSoonCases.length > 0) && (
          <section className="bg-surface rounded-2xl border border-slate/15 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate/10 pb-2.5">
              <h2 className="text-sm font-semibold text-midnight flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate" />
                Due Later This Week ({dueSoonLeads.length + dueSoonCases.length})
              </h2>
              <span className="text-[11px] text-slate">Planning horizon</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {dueSoonLeads.map((l) => (
                <div key={l.id} className="p-2.5 bg-paper rounded-lg border border-slate/10 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-midnight">{l.name}</span>
                    <span className="text-[11px] text-slate block">{l.product_name} • {formatDate(l.next_followup_on || "")}</span>
                  </div>
                  <span className="text-[10px] bg-slate/10 text-slate px-2 py-0.5 rounded font-medium">Lead</span>
                </div>
              ))}
              {dueSoonCases.map((c) => (
                <div key={c.id} className="p-2.5 bg-paper rounded-lg border border-slate/10 flex justify-between items-center">
                  <div>
                    <span className="font-medium text-midnight">{c.client_name}</span>
                    <span className="text-[11px] text-slate block">{c.product_name} • {formatDate(c.next_followup_on || "")}</span>
                  </div>
                  <span className="text-[10px] bg-teal/10 text-teal px-2 py-0.5 rounded font-medium">Case</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Shared WhatsApp Template Modal */}
      <WhatsAppModal
        isOpen={waModalConfig.isOpen}
        onClose={() => setWaModalConfig((prev) => ({ ...prev, isOpen: false }))}
        clientName={waModalConfig.clientName}
        mobile={waModalConfig.mobile}
        consent={waModalConfig.consent}
        clientId={waModalConfig.clientId}
        linkedCaseCode={waModalConfig.caseCode}
        product={waModalConfig.product}
        initialTemplateId={waModalConfig.templateId || "t10_gentle_followup"}
        onLogged={() => {
          setSuccessToast("WhatsApp interaction logged in client contact history.");
          setTimeout(() => setSuccessToast(null), 3000);
        }}
      />
    </div>
  );
}
