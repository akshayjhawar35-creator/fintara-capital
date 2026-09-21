"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useData } from "@/lib/data/store";
import { formatINR, formatDate } from "@/lib/format";
import {
  BarChart3,
  TrendingUp,
  Target,
  Shield,
  Briefcase,
  Users,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Clock,
  ArrowUpRight,
  Layers,
  Percent,
  Flame,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { isAdmin } = useAuth();
  const { leads, cases, loans, payouts, contactLogs, today, getLoanMath, getCaseAlerts } = useData();

  // Metrics aggregation
  const metrics = useMemo(() => {
    // Portfolio
    let activeOutstanding = 0;
    let totalDisbursed = 0;
    loans.forEach((l) => {
      if (l.status === "Active") {
        const math = getLoanMath(l);
        activeOutstanding += math.estOutstanding;
        totalDisbursed += l.disbursed_amount;
      }
    });

    // Pipeline
    let totalPipeline = 0;
    let weightedPipeline = 0;
    let stuckCasesCount = 0;
    cases.forEach((c) => {
      const val = c.sanctioned_amount || c.requested_amount;
      totalPipeline += val;
      // Weighted
      const winProb =
        c.primary_submission.stage === "Sanctioned"
          ? 0.85
          : c.primary_submission.stage === "Legal / Valuation"
          ? 0.90
          : c.primary_submission.stage === "Disbursement Pending"
          ? 0.95
          : c.primary_submission.stage === "Credit Processing"
          ? 0.50
          : c.primary_submission.stage === "Docs Collection"
          ? 0.20
          : 0.10;
      weightedPipeline += Math.round(val * winProb);

      if (getCaseAlerts(c).isStuck) {
        stuckCasesCount++;
      }
    });

    // Payouts
    let expectedPayouts = 0;
    let receivedPayouts = 0;
    let unpaidPayouts = 0;
    payouts.forEach((p) => {
      expectedPayouts += p.expected_amount;
      if (p.status === "Received") {
        receivedPayouts += p.gross_amount || p.expected_amount;
      } else {
        unpaidPayouts += p.expected_amount;
      }
    });

    // Target (Rule R26: monthly target default ₹1.00 Cr)
    const monthlyTarget = 10000000;
    const achievedPercent = Math.min(100, Math.round((totalDisbursed / monthlyTarget) * 100));

    return {
      activeOutstanding,
      totalDisbursed,
      totalPipeline,
      weightedPipeline,
      stuckCasesCount,
      expectedPayouts,
      receivedPayouts,
      unpaidPayouts,
      monthlyTarget,
      achievedPercent,
    };
  }, [loans, cases, payouts, getLoanMath, getCaseAlerts]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-semibold text-midnight">
              Executive Dashboard
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-midnight text-white text-[10px] font-mono uppercase tracking-wider">
              <Shield className="w-3 h-3 text-gold" />
              Owner View
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate mt-0.5">
            Firm-wide origination book, conversion funnel, revenue realisation, and target tracking.
          </p>
        </div>

        <div className="text-xs text-slate">
          Snapshot as of: <strong className="text-midnight">{formatDate(today)}</strong>
        </div>
      </div>

      {/* Admin Fast Operational Links Bar */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate font-semibold text-[11px] uppercase tracking-wider mr-1">Admin Tools:</span>
        <Link
          href="/app/admin/reports/"
          className="px-3.5 py-1.5 bg-surface hover:bg-paper text-midnight rounded-xl border border-slate/20 font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <span>📈</span> Reports &amp; Banker TAT
        </Link>
        <Link
          href="/app/admin/audit/"
          className="px-3.5 py-1.5 bg-surface hover:bg-paper text-midnight rounded-xl border border-slate/20 font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <span>🛡️</span> Audit Trail Inspector
        </Link>
        <Link
          href="/app/admin/team/"
          className="px-3.5 py-1.5 bg-surface hover:bg-paper text-midnight rounded-xl border border-slate/20 font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <span>👥</span> Team Quotas &amp; Targets
        </Link>
        <Link
          href="/app/admin/payouts/"
          className="px-3.5 py-1.5 bg-surface hover:bg-paper text-midnight rounded-xl border border-slate/20 font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <span>💰</span> Payout Reconciliation
        </Link>
        <Link
          href="/app/admin/settings/"
          className="px-3.5 py-1.5 bg-surface hover:bg-paper text-midnight rounded-xl border border-slate/20 font-medium transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <span>⚙️</span> Excel Import &amp; Purge
        </Link>
      </div>

      {/* Target Progress Bar (Rule R26) */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-teal" />
            <div>
              <h2 className="font-serif text-base font-bold text-midnight">
                Monthly Disbursal Target (Rule R26)
              </h2>
              <p className="text-xs text-slate">
                Firm goal: {formatINR(metrics.monthlyTarget)} • Achieved: {formatINR(metrics.totalDisbursed)}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-2xl font-serif font-bold text-teal tabular-nums">
              {metrics.achievedPercent}%
            </span>
            <span className="text-xs text-slate ml-1">achieved</span>
          </div>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-3.5 bg-paper rounded-full overflow-hidden border border-slate/20">
          <div
            className="h-full bg-linear-to-r from-teal to-gold rounded-full transition-all duration-500"
            style={{ width: `${metrics.achievedPercent}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate font-medium pt-1">
          <span>₹0</span>
          <span>Shortfall: {formatINR(Math.max(0, metrics.monthlyTarget - metrics.totalDisbursed))}</span>
          <span>Target: {formatINR(metrics.monthlyTarget)}</span>
        </div>
      </div>

      {/* High-Level Volume Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs">
          <div className="flex items-center justify-between text-slate">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Active Book</span>
            <Briefcase className="w-4 h-4 text-teal" />
          </div>
          <div className="text-xl font-serif font-bold text-midnight tabular-nums mt-1">
            {formatINR(metrics.activeOutstanding)}
          </div>
          <span className="text-[11px] text-slate mt-0.5 block">
            {loans.length} Disbursed Loans (Book)
          </span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs">
          <div className="flex items-center justify-between text-slate">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Open Pipeline</span>
            <Layers className="w-4 h-4 text-midnight" />
          </div>
          <div className="text-xl font-serif font-bold text-midnight tabular-nums mt-1">
            {formatINR(metrics.totalPipeline)}
          </div>
          <span className="text-[11px] text-slate mt-0.5 block">
            {cases.length} Open Underwriting Cases
          </span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs">
          <div className="flex items-center justify-between text-slate">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Weighted Book</span>
            <Percent className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl font-serif font-bold text-gold-dark tabular-nums mt-1">
            {formatINR(metrics.weightedPipeline)}
          </div>
          <span className="text-[11px] text-slate mt-0.5 block">
            Stage Win-probability adjusted
          </span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs">
          <div className="flex items-center justify-between text-slate">
            <span className="text-[11px] uppercase tracking-wider font-semibold">Commissions</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-serif font-bold text-emerald-700 tabular-nums mt-1">
            {formatINR(metrics.receivedPayouts)}
          </div>
          <span className="text-[11px] text-slate mt-0.5 block">
            Realised of {formatINR(metrics.expectedPayouts)} total
          </span>
        </div>
      </div>

      {/* Conversion Funnel & Origination Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Origination Funnel */}
        <div className="lg:col-span-7 bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate/10 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal" />
              <h2 className="font-serif text-base font-bold text-midnight">
                Origination Funnel
              </h2>
            </div>
            <span className="text-xs text-slate">Inbound &rarr; Disbursed Book</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Step 1: Leads */}
            <div className="p-3 bg-paper rounded-xl border border-slate/10 flex items-center justify-between">
              <div>
                <span className="font-semibold text-midnight block">1. Inbound Leads</span>
                <span className="text-[11px] text-slate">Website, Google Search &amp; Referral Leads</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-midnight text-sm">{leads.length}</span>
                <span className="text-[10px] text-slate block">100% Inflow</span>
              </div>
            </div>

            {/* Step 2: Converted to Pipeline Cases */}
            <div className="p-3 bg-paper rounded-xl border border-slate/10 flex items-center justify-between">
              <div>
                <span className="font-semibold text-midnight block">2. Active Pipeline Cases</span>
                <span className="text-[11px] text-slate">Docs Collection &amp; Credit Processing</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-midnight text-sm">{cases.length}</span>
                <span className="text-[10px] text-teal font-semibold block">{formatINR(metrics.totalPipeline)}</span>
              </div>
            </div>

            {/* Step 3: Sanctions */}
            <div className="p-3 bg-paper rounded-xl border border-slate/10 flex items-center justify-between">
              <div>
                <span className="font-semibold text-midnight block">3. Sanctioned Files</span>
                <span className="text-[11px] text-slate">Bank sanctions approved, legal verification</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-midnight text-sm">
                  {cases.filter((c) => c.primary_submission.stage === "Sanctioned").length}
                </span>
                <span className="text-[10px] text-gold font-semibold block">₹1.10 Cr</span>
              </div>
            </div>

            {/* Step 4: Disbursed Book */}
            <div className="p-3 bg-teal/10 rounded-xl border border-teal/20 flex items-center justify-between">
              <div>
                <span className="font-bold text-teal block">4. Disbursed Loan Book</span>
                <span className="text-[11px] text-slate">Fully funded active client accounts</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-teal text-sm">{loans.length} Loans</span>
                <span className="text-[10px] text-teal font-bold block">{formatINR(metrics.totalDisbursed)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Health & Triage Alerts */}
        <div className="lg:col-span-5 bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate/10 pb-3">
            <h2 className="font-serif text-base font-bold text-midnight">
              Operational Triage
            </h2>
            <span className="text-xs text-slate">Action required</span>
          </div>

          <div className="space-y-3 text-xs">
            <Link
              href="/app/"
              className="p-3 bg-paper rounded-xl border border-slate/10 flex items-center justify-between hover:border-slate/30 transition-all block"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-crimson" />
                <div>
                  <span className="font-semibold text-midnight block">Overdue Follow-ups</span>
                  <span className="text-[11px] text-slate">Lead &amp; case SLA breaches</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-crimson/10 text-crimson font-bold text-xs">
                View in My Day &rarr;
              </span>
            </Link>

            <Link
              href="/app/pipeline/"
              className="p-3 bg-paper rounded-xl border border-slate/10 flex items-center justify-between hover:border-slate/30 transition-all block"
            >
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="font-semibold text-midnight block">Stuck Cases (&gt; 10 Days)</span>
                  <span className="text-[11px] text-slate">Files stalled at banker desks</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-xs">
                {metrics.stuckCasesCount} Files
              </span>
            </Link>

            <Link
              href="/app/portfolio/"
              className="p-3 bg-paper rounded-xl border border-slate/10 flex items-center justify-between hover:border-slate/30 transition-all block"
            >
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4 h-4 text-gold" />
                <div>
                  <span className="font-semibold text-midnight block">Takeover Radar (R8)</span>
                  <span className="text-[11px] text-slate">Clients eligible for lower rates</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-gold/15 text-gold-dark font-bold text-xs">
                2 Candidates
              </span>
            </Link>

            <Link
              href="/app/admin/payouts/"
              className="p-3 bg-paper rounded-xl border border-slate/10 flex items-center justify-between hover:border-slate/30 transition-all block"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-teal" />
                <div>
                  <span className="font-semibold text-midnight block">Unpaid Commissions (R12)</span>
                  <span className="text-[11px] text-slate">DSA receipts awaiting reconciliation</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-teal/10 text-teal font-bold text-xs">
                {formatINR(metrics.unpaidPayouts)}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Operational Updates Feed */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate/10 pb-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald" />
            <h2 className="font-serif text-base font-bold text-midnight">
              Recent Team Activity &amp; Updates Feed
            </h2>
          </div>
          <Link href="/app/contacts/" className="text-xs font-semibold text-emerald hover:underline">
            View Complete Contact History &rarr;
          </Link>
        </div>

        <div className="divide-y divide-slate/10 text-xs">
          {contactLogs.slice(0, 4).map((entry) => (
            <div key={entry.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-midnight">{entry.client_name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-paper border border-slate/15 text-slate font-medium">
                    {entry.contact_type}
                  </span>
                  {entry.linked_case_code && (
                    <span className="text-[10px] font-mono text-teal font-medium">
                      {entry.linked_case_code}
                    </span>
                  )}
                </div>
                <p className="text-slate text-[11px]">{entry.summary}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] text-slate block">{entry.date}</span>
                <span className="text-[10px] text-midnight font-medium">By {entry.handled_by}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
