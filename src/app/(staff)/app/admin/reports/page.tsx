"use client";

import React, { useState, useMemo } from "react";
import { useData } from "@/lib/data/store";
import { formatINR, formatDate } from "@/lib/format";
import {
  FileBarChart,
  Download,
  Building2,
  Users,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Percent,
  Clock,
  Briefcase,
  CheckCircle2,
  Phone,
} from "lucide-react";

export default function AdminReportsPage() {
  const { bankers, cases, leads, loans, payouts } = useData();

  const [activeReport, setActiveReport] = useState<"banker_tat" | "referrers" | "lost_business">("banker_tat");
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  // Banker TAT Report Data (Rule R18)
  const bankerReportData = useMemo(() => {
    return bankers.map((b) => {
      const assignedCases = cases.filter((c) => c.primary_submission.banker_id === b.id);
      const activeCount = assignedCases.filter((c) => !["Disbursed", "Rejected", "Dropped / Lost"].includes(c.primary_submission.stage)).length;
      const totalVolume = assignedCases.reduce((sum, c) => sum + (c.sanctioned_amount || c.requested_amount), 0);

      return {
        ...b,
        assignedCount: assignedCases.length,
        activeCount,
        totalVolume,
        avgTatDays: Math.round((b.tat_days_min + b.tat_days_max) / 2),
      };
    });
  }, [bankers, cases]);

  // Referrer Attribution Report Data (Rule R23)
  const referrerReportData = useMemo(() => {
    return [
      {
        id: "ref-1",
        name: "CA Manoj Agrawal (Raipur)",
        category: "Chartered Accountant",
        leadsReferred: 4,
        casesLogged: 3,
        disbursedVolume: 6500000,
        commissionPaid: 32500,
        status: "Active",
      },
      {
        id: "ref-2",
        name: "Shri Balaji Builders (Pandri)",
        category: "Builder / Broker",
        leadsReferred: 6,
        casesLogged: 4,
        disbursedVolume: 12000000,
        commissionPaid: 48000,
        status: "Active",
      },
      {
        id: "ref-3",
        name: "Raipur Chamber of Commerce Member",
        category: "Sub-agent",
        leadsReferred: 2,
        casesLogged: 1,
        disbursedVolume: 2500000,
        commissionPaid: 12500,
        status: "Active",
      },
      {
        id: "ref-4",
        name: "Existing Client Referrals",
        category: "Client",
        leadsReferred: 3,
        casesLogged: 2,
        disbursedVolume: 5500000,
        commissionPaid: 0,
        status: "Active",
      },
    ];
  }, []);

  // Lost Business & Competitor Report Data (Rule R17)
  const lostBusinessData = useMemo(() => {
    return [
      {
        reason: "Rate difference / Lower ROI offered",
        competitor: "State Bank of India (Direct)",
        casesCount: 2,
        lostVolume: 9500000,
        product: "Home Loan",
      },
      {
        reason: "Valuation lower than borrower expectation",
        competitor: "None (Dropped by borrower)",
        casesCount: 1,
        lostVolume: 4000000,
        product: "Loan Against Property",
      },
      {
        reason: "CIBIL past write-off / Low credit score",
        competitor: "Unserviceable",
        casesCount: 2,
        lostVolume: 3500000,
        product: "Business Loan",
      },
      {
        reason: "Turnaround time delay (> 20 days)",
        competitor: "HDFC Bank (Direct branch)",
        casesCount: 1,
        lostVolume: 5000000,
        product: "Home Loan",
      },
    ];
  }, []);

  // Download CSV Simulation
  const handleExportCSV = (reportName: string) => {
    setDownloadSuccess(`Exported "${reportName}" to CSV successfully.`);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">
            Business Intelligence &amp; Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate mt-0.5">
            Banker turnaround times, referrer payouts (R23), and lost business competitor analytics.
          </p>
        </div>

        <button
          onClick={() => handleExportCSV(activeReport)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate/20 bg-paper text-slate hover:text-midnight text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-teal" />
          <span>Export CSV</span>
        </button>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-teal/10 border border-teal/20 rounded-xl text-xs text-teal font-medium flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Report Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate/15 pb-2 text-xs font-medium overflow-x-auto">
        <button
          onClick={() => setActiveReport("banker_tat")}
          className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeReport === "banker_tat"
              ? "bg-midnight text-white font-semibold"
              : "text-slate hover:bg-paper hover:text-midnight"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Banker TAT &amp; Volume Report (R18)</span>
        </button>

        <button
          onClick={() => setActiveReport("referrers")}
          className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeReport === "referrers"
              ? "bg-midnight text-white font-semibold"
              : "text-slate hover:bg-paper hover:text-midnight"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Referrer Origination &amp; Payouts (R23)</span>
        </button>

        <button
          onClick={() => setActiveReport("lost_business")}
          className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeReport === "lost_business"
              ? "bg-midnight text-white font-semibold"
              : "text-slate hover:bg-paper hover:text-midnight"
          }`}
        >
          <TrendingDown className="w-3.5 h-3.5" />
          <span>Lost Business &amp; Competitor Breakdown (R17)</span>
        </button>
      </div>

      {/* REPORT 1: Banker TAT & Volume */}
      {activeReport === "banker_tat" && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-slate/15 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate/10 flex justify-between items-center bg-paper/50">
              <div>
                <h2 className="font-serif text-sm font-bold text-midnight">
                  Banker Processing SLA &amp; Volume
                </h2>
                <p className="text-[11px] text-slate">Turnaround times (TAT) across Raipur branches</p>
              </div>
              <span className="text-[11px] font-semibold text-teal">Rule R18 SLA Active</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-paper border-b border-slate/15 font-semibold text-slate uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Banker Name</th>
                    <th className="px-4 py-3">Lender &amp; Branch</th>
                    <th className="px-4 py-3 text-center">Agreed TAT</th>
                    <th className="px-4 py-3 text-center">Active Files</th>
                    <th className="px-4 py-3 text-right">Logged Volume</th>
                    <th className="px-4 py-3">Escalation Manager</th>
                    <th className="px-4 py-3">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate/10">
                  {bankerReportData.map((b) => (
                    <tr key={b.id} className="hover:bg-paper/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-midnight">
                        {b.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-midnight">{b.lender_name}</div>
                        <div className="text-[11px] text-slate">{b.branch_city}</div>
                      </td>
                      <td className="px-4 py-3 text-center font-mono">
                        <span className="px-2 py-0.5 rounded bg-paper border border-slate/15 font-bold">
                          {b.tat_days_min}–{b.tat_days_max} days
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="font-bold text-teal">{b.activeCount} files</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-midnight tabular-nums">
                        {formatINR(b.totalVolume)}
                      </td>
                      <td className="px-4 py-3 text-slate">
                        {b.escalation_contact || "Direct"}
                      </td>
                      <td className="px-4 py-3 font-mono text-[11px] text-slate">
                        +91 {b.mobile}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 2: Referrer Origination & Payouts (Rule R23) */}
      {activeReport === "referrers" && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-slate/15 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate/10 flex justify-between items-center bg-paper/50">
              <div>
                <h2 className="font-serif text-sm font-bold text-midnight">
                  Referral Partner Performance &amp; Sharing (Rule R23)
                </h2>
                <p className="text-[11px] text-slate">Origination channel breakdown and sub-DSA commission sharing</p>
              </div>
              <span className="text-[11px] font-semibold text-teal">Rule R23 Thank-you Tasks Linked</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-paper border-b border-slate/15 font-semibold text-slate uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Referrer Name</th>
                    <th className="px-4 py-3">Channel / Category</th>
                    <th className="px-4 py-3 text-center">Leads Sent</th>
                    <th className="px-4 py-3 text-center">Conversion</th>
                    <th className="px-4 py-3 text-right">Disbursed Book (₹)</th>
                    <th className="px-4 py-3 text-right">Referral Paid (₹)</th>
                    <th className="px-4 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate/10">
                  {referrerReportData.map((ref) => (
                    <tr key={ref.id} className="hover:bg-paper/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-midnight">
                        {ref.name}
                      </td>
                      <td className="px-4 py-3 text-slate">
                        {ref.category}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-midnight">
                        {ref.leadsReferred}
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-teal font-semibold">
                        {Math.round((ref.casesLogged / ref.leadsReferred) * 100)}%
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-midnight tabular-nums">
                        {formatINR(ref.disbursedVolume)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-teal tabular-nums">
                        {ref.commissionPaid > 0 ? formatINR(ref.commissionPaid) : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal/10 text-teal">
                          {ref.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 3: Lost Business & Competitor Breakdown (Rule R17) */}
      {activeReport === "lost_business" && (
        <div className="space-y-4">
          <div className="bg-surface rounded-2xl border border-slate/15 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate/10 flex justify-between items-center bg-paper/50">
              <div>
                <h2 className="font-serif text-sm font-bold text-midnight">
                  Lost Business &amp; Rejection Reason Audit (Rule R17)
                </h2>
                <p className="text-[11px] text-slate">Competitor wins and unserviceable file analysis</p>
              </div>
              <span className="text-[11px] font-semibold text-crimson">Rule R17 Compliance</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-paper border-b border-slate/15 font-semibold text-slate uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Primary Loss Reason</th>
                    <th className="px-4 py-3">Lost To Competitor</th>
                    <th className="px-4 py-3">Product Category</th>
                    <th className="px-4 py-3 text-center">Cases</th>
                    <th className="px-4 py-3 text-right">Lost Volume (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate/10">
                  {lostBusinessData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-paper/40 transition-colors">
                      <td className="px-4 py-3 font-semibold text-midnight">
                        {row.reason}
                      </td>
                      <td className="px-4 py-3 text-slate">
                        {row.competitor}
                      </td>
                      <td className="px-4 py-3 text-slate">
                        {row.product}
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-crimson">
                        {row.casesCount}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-midnight tabular-nums">
                        {formatINR(row.lostVolume)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
