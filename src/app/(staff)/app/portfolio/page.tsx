"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useData } from "@/lib/data/store";
import { formatINR, formatDate } from "@/lib/format";
import {
  Briefcase,
  Search,
  Filter,
  TrendingUp,
  Target,
  Clock,
  ArrowRightLeft,
  PhoneCall,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Layers,
  Building2,
  IndianRupee,
  Plus,
  Info,
  ChevronRight,
} from "lucide-react";

export default function PortfolioPage() {
  const router = useRouter();
  const { loans, clients, bankers, products, lenders, today, getLoanMath, updateLoanReview, createBTCaseFromLoan, addContactLog, addLoan } = useData();

  const [activeTab, setActiveTab] = useState<"all" | "takeover" | "topup" | "review" | "payout">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // New Loan Form State
  const [clientId, setClientId] = useState(clients[0]?.id || "");
  const [productId, setProductId] = useState(products[0]?.id || "");
  const [lenderId, setLenderId] = useState(lenders[0]?.id || "");
  const [disbursedAmount, setDisbursedAmount] = useState(3000000);
  const [disbursedDate, setDisbursedDate] = useState("2026-01-15");
  const [roiPercent, setRoiPercent] = useState(9.25);
  const [tenureMonths, setTenureMonths] = useState(180);
  const [accountLast4, setAccountLast4] = useState("9988");

  // Filtered Loans
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const math = getLoanMath(loan);

      if (activeTab === "takeover" && !math.takeover.isCandidate) return false;
      if (activeTab === "topup" && !math.topup.isOpen) return false;
      if (activeTab === "review" && math.review.status === "OK") return false;
      if (activeTab === "payout" && !math.isPayoutOverdue) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = loan.loan_code.toLowerCase().includes(q);
        const matchClient = loan.client_name.toLowerCase().includes(q);
        const matchLender = loan.lender_name.toLowerCase().includes(q);
        const matchProd = loan.product_name.toLowerCase().includes(q);
        const matchAc = loan.account_last4.includes(q);
        if (!matchCode && !matchClient && !matchLender && !matchProd && !matchAc) {
          return false;
        }
      }

      return true;
    });
  }, [loans, activeTab, searchQuery, getLoanMath]);

  // Overall Portfolio Totals
  const summary = useMemo(() => {
    let totalOutstanding = 0;
    let totalDisbursed = 0;
    let takeoverCount = 0;
    let takeoverSavings = 0;
    let topupCount = 0;
    let reviewDueCount = 0;
    let unpaidPayoutCount = 0;

    loans.forEach((loan) => {
      const math = getLoanMath(loan);
      if (loan.status === "Active") {
        totalOutstanding += math.estOutstanding;
        totalDisbursed += loan.disbursed_amount;
        if (math.takeover.isCandidate) {
          takeoverCount++;
          takeoverSavings += math.takeover.estAnnualSaving;
        }
        if (math.topup.isOpen) {
          topupCount++;
        }
        if (math.review.status !== "OK") {
          reviewDueCount++;
        }
        if (math.isPayoutOverdue) {
          unpaidPayoutCount++;
        }
      }
    });

    return {
      totalOutstanding,
      totalDisbursed,
      activeLoansCount: loans.filter((l) => l.status === "Active").length,
      takeoverCount,
      takeoverSavings,
      topupCount,
      reviewDueCount,
      unpaidPayoutCount,
    };
  }, [loans, getLoanMath]);

  // Handle R25 Create BT Case
  const handleCreateBTCase = (loanId: string) => {
    try {
      const newCase = createBTCaseFromLoan(loanId);
      setActionSuccess(`Case ${newCase.case_code} created successfully for Balance Transfer!`);
      setTimeout(() => setActionSuccess(null), 4000);
      router.push(`/app/cases/detail?id=${newCase.case_code}`);
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Log Review
  const handleLogReview = (loan: (typeof loans)[0]) => {
    updateLoanReview(loan.id, today);
    addContactLog({
      date: today,
      client_id: loan.client_id,
      client_name: loan.client_name,
      contact_type: "Portfolio Review",
      handled_by: loan.handled_by || "Staff 1",
      linked_loan_code: loan.loan_code,
      summary: `Routine 6-month portfolio review call completed for ${loan.loan_code}. Account balance & rate competitiveness verified.`,
      next_action: "Follow-up rate update",
      next_action_date: today,
    });
    setActionSuccess(`Portfolio review logged for ${loan.loan_code}. Next review scheduled in 6 months.`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  // Handle Copy WhatsApp Update
  const handleCopySummary = (loan: (typeof loans)[0]) => {
    const math = getLoanMath(loan);
    const text = `Namaste ${loan.client_name}, your ${loan.product_name} (${loan.lender_name} A/c ••••${loan.account_last4}) has an estimated outstanding balance of ${formatINR(math.estOutstanding)}. ${
      math.takeover.isCandidate
        ? `You are eligible for a Balance Transfer at ${((math.takeover.marketRoi || 0) * 100).toFixed(2)}%, saving approx ${formatINR(math.takeover.estAnnualSaving)}/yr.`
        : ""
    } Regards, Fintara Capital Raipur. Reply STOP to stop updates.`;

    navigator.clipboard?.writeText(text);
    setActionSuccess(`Client update copied to clipboard! Ready to paste into WhatsApp.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Handle Add Loan
  const handleAddLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selClient = clients.find((c) => c.id === clientId) || clients[0];
    const selProd = products.find((p) => p.id === productId) || products[0];
    const selLender = lenders.find((l) => l.id === lenderId) || lenders[0];

    addLoan({
      client_id: selClient.id,
      client_code: selClient.client_code,
      client_name: selClient.name,
      product_id: selProd.id,
      product_name: selProd.name,
      lender_id: selLender.id,
      lender_name: selLender.name,
      account_last4: accountLast4 || "1234",
      disbursed_amount: Number(disbursedAmount),
      disbursed_date: disbursedDate,
      roi: Number(roiPercent) / 100,
      tenure_months: Number(tenureMonths),
      status: "Active",
      last_review_on: disbursedDate,
      handled_by: "Owner",
    });

    setShowAddModal(false);
    setActionSuccess(`New loan added to active portfolio successfully!`);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">
            Loan Portfolio &amp; Takeover Radar
          </h1>
          <p className="text-xs sm:text-sm text-slate mt-0.5">
            Disbursed active book, 6-month routine reviews (R10), takeover candidates (R8) &amp; top-up windows (R9).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-midnight text-white text-xs font-semibold rounded-lg hover:bg-midnight/90 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Loan</span>
          </button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionSuccess && (
        <div className="p-3.5 bg-teal/10 border border-teal/20 rounded-xl text-xs text-teal font-medium flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-teal hover:underline text-[11px]">
            Dismiss
          </button>
        </div>
      )}

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-slate font-medium block">
            Est. Book Outstanding
          </span>
          <div className="text-xl font-serif font-bold text-midnight tabular-nums mt-1">
            {formatINR(summary.totalOutstanding)}
          </div>
          <span className="text-[10px] text-slate/80 mt-0.5 block">
            {summary.activeLoansCount} Active Loans (Disbursed: {formatINR(summary.totalDisbursed)})
          </span>
        </div>

        <div
          onClick={() => setActiveTab("takeover")}
          className={`bg-surface p-4 rounded-xl border cursor-pointer transition-all shadow-xs ${
            activeTab === "takeover" ? "border-gold ring-1 ring-gold/40" : "border-slate/15 hover:border-slate/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate font-medium block">
              Takeover Radar (R8)
            </span>
            <Target className="w-4 h-4 text-gold" />
          </div>
          <div className="text-xl font-serif font-bold text-gold tabular-nums mt-1">
            {summary.takeoverCount} Loans
          </div>
          <span className="text-[10px] text-slate/80 mt-0.5 block">
            Save ~{formatINR(summary.takeoverSavings)}/yr in interest
          </span>
        </div>

        <div
          onClick={() => setActiveTab("topup")}
          className={`bg-surface p-4 rounded-xl border cursor-pointer transition-all shadow-xs ${
            activeTab === "topup" ? "border-teal ring-1 ring-teal/40" : "border-slate/15 hover:border-slate/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate font-medium block">
              Top-up Window (R9)
            </span>
            <TrendingUp className="w-4 h-4 text-teal" />
          </div>
          <div className="text-xl font-serif font-bold text-teal tabular-nums mt-1">
            {summary.topupCount} Ready
          </div>
          <span className="text-[10px] text-slate/80 mt-0.5 block">
            Seasoned &gt; 12 months for top-up
          </span>
        </div>

        <div
          onClick={() => setActiveTab("review")}
          className={`bg-surface p-4 rounded-xl border cursor-pointer transition-all shadow-xs ${
            activeTab === "review" ? "border-midnight ring-1 ring-midnight/40" : "border-slate/15 hover:border-slate/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate font-medium block">
              Routine Reviews (R10)
            </span>
            <Calendar className="w-4 h-4 text-midnight" />
          </div>
          <div className="text-xl font-serif font-bold text-midnight tabular-nums mt-1">
            {summary.reviewDueCount} Actionable
          </div>
          <span className="text-[10px] text-slate/80 mt-0.5 block">
            Every 6-month check-in interval
          </span>
        </div>

        <div
          onClick={() => setActiveTab("payout")}
          className={`bg-surface p-4 rounded-xl border cursor-pointer transition-all shadow-xs ${
            activeTab === "payout" ? "border-crimson ring-1 ring-crimson/40" : "border-slate/15 hover:border-slate/30"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate font-medium block">
              Unpaid Payouts (R12)
            </span>
            <IndianRupee className="w-4 h-4 text-crimson" />
          </div>
          <div className="text-xl font-serif font-bold text-crimson tabular-nums mt-1">
            {summary.unpaidPayoutCount} Delayed
          </div>
          <span className="text-[10px] text-slate/80 mt-0.5 block">
            Unpaid commission ageing &gt; 30d
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="bg-surface rounded-xl border border-slate/15 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === "all"
                ? "bg-midnight text-white font-semibold"
                : "text-slate hover:bg-paper hover:text-midnight"
            }`}
          >
            All Active ({loans.length})
          </button>
          <button
            onClick={() => setActiveTab("takeover")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "takeover"
                ? "bg-gold text-midnight font-bold"
                : "text-slate hover:bg-paper hover:text-midnight"
            }`}
          >
            <span>🎯 Takeover Radar</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-black/10 rounded-full">{summary.takeoverCount}</span>
          </button>
          <button
            onClick={() => setActiveTab("topup")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "topup"
                ? "bg-teal text-white font-semibold"
                : "text-slate hover:bg-paper hover:text-midnight"
            }`}
          >
            <span>📈 Top-up Window</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full">{summary.topupCount}</span>
          </button>
          <button
            onClick={() => setActiveTab("review")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "review"
                ? "bg-midnight text-white font-semibold"
                : "text-slate hover:bg-paper hover:text-midnight"
            }`}
          >
            <span>📅 Review Due</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full">{summary.reviewDueCount}</span>
          </button>
          <button
            onClick={() => setActiveTab("payout")}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === "payout"
                ? "bg-crimson text-white font-semibold"
                : "text-slate hover:bg-paper hover:text-midnight"
            }`}
          >
            <span>💰 Unpaid Payouts</span>
            <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded-full">{summary.unpaidPayoutCount}</span>
          </button>
        </div>

        {/* Search & Layout Toggle */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input
              type="text"
              placeholder="Search code, client, bank..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-paper rounded-lg border border-slate/20 text-xs focus:outline-teal focus:border-teal"
            />
          </div>

          <div className="flex items-center border border-slate/20 rounded-lg p-0.5 bg-paper">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                viewMode === "cards" ? "bg-white shadow-xs text-midnight" : "text-slate"
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                viewMode === "table" ? "bg-white shadow-xs text-midnight" : "text-slate"
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Content Area: Cards or Table */}
      {filteredLoans.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-slate/15 p-12 text-center text-slate text-sm">
          No loans match the selected filter.
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredLoans.map((loan) => {
            const math = getLoanMath(loan);

            return (
              <div
                key={loan.id}
                className="bg-surface rounded-2xl border border-slate/15 p-5 shadow-xs space-y-4 hover:border-slate/30 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Row: Code, Last-4, Health Badges */}
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate/10">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-midnight bg-paper px-2 py-0.5 rounded border border-slate/15">
                          {loan.loan_code}
                        </span>
                        <Link
                          href={`/app/clients/detail?id=${loan.client_code}`}
                          className="font-serif font-bold text-midnight hover:text-teal transition-colors text-base"
                        >
                          {loan.client_name}
                        </Link>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate mt-1">
                        <span className="font-medium text-midnight">{loan.product_name}</span>
                        <span>•</span>
                        <span>{loan.lender_name}</span>
                        <span>•</span>
                        <span className="font-mono">•••• {loan.account_last4}</span>
                      </div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-teal/10 text-teal">
                        {loan.status}
                      </span>
                      {math.review.status !== "OK" && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            math.review.status === "OVERDUE"
                              ? "bg-crimson/10 text-crimson"
                              : "bg-gold/15 text-gold-dark"
                          }`}
                        >
                          Review: {math.review.status} ({Math.abs(math.review.daysDiff)}d)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amortization & Math Grid (R7) */}
                  <div className="grid grid-cols-3 gap-2 py-3 bg-paper rounded-xl p-3 my-3 text-xs border border-slate/10">
                    <div>
                      <span className="text-[10px] text-slate uppercase block">Monthly EMI</span>
                      <span className="font-bold text-midnight text-sm tabular-nums block mt-0.5">
                        {formatINR(math.emi)}
                      </span>
                      <span className="text-[10px] text-slate/80">
                        @ {(loan.roi * 100).toFixed(2)}% p.a.
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate uppercase block">Elapsed</span>
                      <span className="font-bold text-midnight text-sm tabular-nums block mt-0.5">
                        {math.monthsElapsed} / {loan.tenure_months} mo
                      </span>
                      <span className="text-[10px] text-slate/80">
                        Disb: {formatDate(loan.disbursed_date)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate uppercase block">Est. Outstanding</span>
                      <span className="font-bold text-midnight text-sm tabular-nums block mt-0.5">
                        {formatINR(math.estOutstanding)}
                      </span>
                      <span className="text-[10px] text-slate/80">
                        Original: {formatINR(loan.disbursed_amount)}
                      </span>
                    </div>
                  </div>

                  {/* Radar Opportunities Alert Chips */}
                  <div className="space-y-2 text-xs">
                    {math.takeover.isCandidate && (
                      <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2">
                          <Target className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-midnight block">
                              Takeover Candidate (R8)
                            </span>
                            <span className="text-slate text-[11px]">
                              ROI gap of {(math.takeover.roiGap * 100).toFixed(2)}% vs {((math.takeover.marketRoi || 0) * 100).toFixed(2)}% market rate.
                            </span>
                          </div>
                        </div>
                        <span className="font-bold text-gold-dark text-xs tabular-nums whitespace-nowrap">
                          Save ~{formatINR(math.takeover.estAnnualSaving)}/yr
                        </span>
                      </div>
                    )}

                    {math.topup.isOpen ? (
                      <div className="p-2.5 rounded-xl bg-teal/10 border border-teal/20 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-teal shrink-0" />
                          <span className="font-semibold text-teal text-xs">
                            Top-up Window Open (R9)
                          </span>
                        </div>
                        <span className="text-[11px] text-slate">Loan age &ge; 12 months</span>
                      </div>
                    ) : (
                      <div className="p-2 rounded-lg bg-paper border border-slate/10 flex items-center justify-between text-[11px] text-slate">
                        <span>Top-up window opens:</span>
                        <span className="font-semibold text-midnight">{math.topup.opensDateStr}</span>
                      </div>
                    )}

                    {math.isPayoutOverdue && (
                      <div className="p-2.5 rounded-xl bg-crimson/10 border border-crimson/20 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-crimson shrink-0" />
                          <span className="font-semibold text-crimson">
                            DSA Commission Unpaid &gt; 30d (R12)
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-crimson">
                          {math.payoutAgeingDays} days ageing
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-slate/15 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleLogReview(loan)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate/20 text-slate hover:text-midnight hover:border-slate/40 flex items-center gap-1.5 transition-colors"
                      title="Log 6-month portfolio review call"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Log Review</span>
                    </button>

                    <button
                      onClick={() => handleCopySummary(loan)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate/20 text-slate hover:text-midnight hover:border-slate/40 flex items-center gap-1.5 transition-colors"
                      title="Copy update message for WhatsApp"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp Copy</span>
                    </button>
                  </div>

                  {math.takeover.isCandidate && (
                    <button
                      onClick={() => handleCreateBTCase(loan.id)}
                      className="px-3 py-1.5 bg-gold text-midnight text-xs font-bold rounded-lg hover:bg-gold/90 transition-colors shadow-xs flex items-center gap-1.5"
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>Convert to BT Case (R25) &rarr;</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Dense Table View */
        <div className="bg-surface rounded-2xl border border-slate/15 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-paper border-b border-slate/15 font-semibold text-slate uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-4 py-3">Loan Code</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Product / Lender</th>
                  <th className="px-4 py-3 text-right">Disbursed Amount</th>
                  <th className="px-4 py-3 text-right">ROI</th>
                  <th className="px-4 py-3 text-right">Monthly EMI</th>
                  <th className="px-4 py-3 text-right">Est. Outstanding</th>
                  <th className="px-4 py-3 text-center">Takeover Radar</th>
                  <th className="px-4 py-3 text-center">Top-up</th>
                  <th className="px-4 py-3 text-center">Review</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/10">
                {filteredLoans.map((loan) => {
                  const math = getLoanMath(loan);

                  return (
                    <tr key={loan.id} className="hover:bg-paper/50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-midnight">
                        {loan.loan_code}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/app/clients/detail?id=${loan.client_code}`}
                          className="font-semibold text-midnight hover:text-teal transition-colors"
                        >
                          {loan.client_name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-midnight">{loan.product_name}</div>
                        <div className="text-[11px] text-slate">{loan.lender_name} (••••{loan.account_last4})</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate tabular-nums">
                        {formatINR(loan.disbursed_amount)}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-slate tabular-nums">
                        {(loan.roi * 100).toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-midnight tabular-nums">
                        {formatINR(math.emi)}
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-teal tabular-nums">
                        {formatINR(math.estOutstanding)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {math.takeover.isCandidate ? (
                          <span className="px-2 py-0.5 rounded bg-gold/15 text-gold-dark font-bold text-[10px]">
                            Save {formatINR(math.takeover.estAnnualSaving)}/yr
                          </span>
                        ) : (
                          <span className="text-slate/60 text-[11px]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {math.topup.isOpen ? (
                          <span className="px-2 py-0.5 rounded bg-teal/10 text-teal font-semibold text-[10px]">
                            OPEN
                          </span>
                        ) : (
                          <span className="text-slate/70 text-[11px]">{math.topup.opensDateStr}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            math.review.status === "OVERDUE"
                              ? "bg-crimson/10 text-crimson"
                              : math.review.status === "DUE TODAY"
                              ? "bg-gold/15 text-gold-dark"
                              : "bg-paper text-slate"
                          }`}
                        >
                          {math.review.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                        {math.takeover.isCandidate && (
                          <button
                            onClick={() => handleCreateBTCase(loan.id)}
                            className="px-2 py-1 bg-gold text-midnight font-bold rounded hover:bg-gold/90 text-[11px]"
                          >
                            BT Case
                          </button>
                        )}
                        <button
                          onClick={() => handleLogReview(loan)}
                          className="px-2 py-1 bg-paper border border-slate/20 text-slate hover:text-midnight rounded text-[11px]"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Mandatory Statutory Note (Spec R7) */}
      <div className="bg-paper p-4 rounded-xl border border-slate/15 flex items-start gap-3 text-xs text-slate">
        <Info className="w-4 h-4 text-teal shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-midnight">Notice on Calculations:</span> Estimate. Floating rates, part-payments and moratoriums will differ — check the lender statement before quoting a saving to the client.
        </p>
      </div>

      {/* Add Loan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/15 p-6 max-w-lg w-full space-y-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate/10">
              <h2 className="font-serif text-lg font-bold text-midnight">Register Disbursed Loan</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate hover:text-midnight font-bold text-sm"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddLoanSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-midnight mb-1">Select Client</label>
                <select
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate/20 text-xs bg-paper font-medium"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.client_code} — {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-midnight mb-1">Product</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 text-xs bg-paper font-medium"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-midnight mb-1">Lender</label>
                  <select
                    value={lenderId}
                    onChange={(e) => setLenderId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 text-xs bg-paper font-medium"
                  >
                    {lenders.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-midnight mb-1">Disbursed Amount (₹)</label>
                  <input
                    type="number"
                    step="50000"
                    min="100000"
                    value={disbursedAmount}
                    onChange={(e) => setDisbursedAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 text-xs bg-paper font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-midnight mb-1">Disbursal Date</label>
                  <input
                    type="date"
                    value={disbursedDate}
                    onChange={(e) => setDisbursedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 text-xs bg-paper font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-midnight mb-1">ROI (% p.a.)</label>
                  <input
                    type="number"
                    step="0.05"
                    min="5"
                    max="24"
                    value={roiPercent}
                    onChange={(e) => setRoiPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 text-xs bg-paper font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-midnight mb-1">Tenure (Mos)</label>
                  <input
                    type="number"
                    step="12"
                    min="12"
                    max="360"
                    value={tenureMonths}
                    onChange={(e) => setTenureMonths(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 text-xs bg-paper font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-midnight mb-1">A/c Last 4</label>
                  <input
                    type="text"
                    maxLength={4}
                    value={accountLast4}
                    onChange={(e) => setAccountLast4(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate/20 text-xs bg-paper font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-slate/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-2 rounded-lg border border-slate/20 text-slate hover:text-midnight text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-midnight text-white text-xs font-semibold rounded-lg hover:bg-midnight/90 shadow-xs"
                >
                  Save Loan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
