"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useData } from "@/lib/data/store";
import { formatINR, formatDate } from "@/lib/format";
import { PayoutItem } from "@/lib/data/mock-data";
import {
  IndianRupee,
  Shield,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  Table,
  Receipt,
  PlusCircle,
  ExternalLink,
} from "lucide-react";

export default function AdminPayoutsPage() {
  const { isAdmin } = useAuth();
  const { payouts, payoutGrid, today, updatePayout } = useData();

  const [activeTab, setActiveTab] = useState<"all" | "Not Claimed" | "Claimed" | "Received" | "Disputed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGridDrawer, setShowGridDrawer] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Edit Modal State
  const [newStatus, setNewStatus] = useState<PayoutItem["status"]>("Claimed");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(today);
  const [receivedDate, setReceivedDate] = useState(today);
  const [grossAmount, setGrossAmount] = useState(0);
  const [tdsAmount, setTdsAmount] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [remarks, setRemarks] = useState("");

  // Calculate Ageing (Rule R12)
  const calculateAgeingDays = (disbursedDateStr: string) => {
    const disbDate = new Date(disbursedDateStr);
    const curr = new Date(today);
    const diff = Math.floor((curr.getTime() - disbDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  };

  // Metrics Summary
  const metrics = useMemo(() => {
    let totalDisbursed = 0;
    let totalExpected = 0;
    let totalReceived = 0;
    let totalUnpaid = 0;
    let overdueAgeingCount = 0;

    payouts.forEach((p) => {
      totalDisbursed += p.disbursed_amount;
      totalExpected += p.expected_amount;
      if (p.status === "Received") {
        totalReceived += p.gross_amount || p.expected_amount;
      } else {
        totalUnpaid += p.expected_amount;
        const ageing = calculateAgeingDays(p.disbursed_date);
        if (ageing > 30) {
          overdueAgeingCount++;
        }
      }
    });

    return {
      totalDisbursed,
      totalExpected,
      totalReceived,
      totalUnpaid,
      overdueAgeingCount,
    };
  }, [payouts, today]);

  // Filtered Payouts
  const filteredPayouts = useMemo(() => {
    return payouts.filter((p) => {
      if (activeTab !== "all" && p.status !== activeTab) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = p.loan_code.toLowerCase().includes(q);
        const matchClient = p.client_name.toLowerCase().includes(q);
        const matchLender = p.lender_name.toLowerCase().includes(q);
        const matchProd = p.product_name.toLowerCase().includes(q);
        const matchInv = p.invoice_number?.toLowerCase().includes(q);
        if (!matchCode && !matchClient && !matchLender && !matchProd && !matchInv) return false;
      }
      return true;
    });
  }, [payouts, activeTab, searchQuery]);

  // Open Edit Modal
  const handleOpenEdit = (payout: PayoutItem) => {
    setSelectedPayout(payout);
    setNewStatus(payout.status);
    setInvoiceNumber(payout.invoice_number || "");
    setInvoiceDate(payout.invoice_date || today);
    setReceivedDate(payout.received_date || today);
    setGrossAmount(payout.gross_amount || payout.expected_amount);
    // Standard 5% TDS for DSA commissions
    const estTds = Math.round((payout.gross_amount || payout.expected_amount) * 0.05);
    setTdsAmount(payout.tds_amount !== undefined ? payout.tds_amount : estTds);
    setGstAmount(payout.gst_amount || 0);
    setNetAmount(
      payout.net_amount !== undefined
        ? payout.net_amount
        : (payout.gross_amount || payout.expected_amount) - estTds
    );
    setRemarks(payout.remarks || "");
  };

  // Submit Update
  const handleSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayout) return;

    updatePayout(selectedPayout.id, {
      status: newStatus,
      invoice_number: invoiceNumber || undefined,
      invoice_date: invoiceDate || undefined,
      received_date: newStatus === "Received" ? receivedDate : undefined,
      gross_amount: newStatus === "Received" ? Number(grossAmount) : undefined,
      tds_amount: newStatus === "Received" ? Number(tdsAmount) : undefined,
      gst_amount: newStatus === "Received" ? Number(gstAmount) : undefined,
      net_amount: newStatus === "Received" ? Number(netAmount) : undefined,
      remarks: remarks || undefined,
    });

    setActionSuccess(`Payout for ${selectedPayout.loan_code} updated to ${newStatus}.`);
    setSelectedPayout(null);
    setTimeout(() => setActionSuccess(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-semibold text-midnight">
              Payouts &amp; Commission Management
            </h1>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-midnight text-white text-[10px] font-mono uppercase tracking-wider">
              <Shield className="w-3 h-3 text-gold" />
              Owner Only (R12)
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate mt-0.5">
            Lender DSA commission tracking, claim ageing, invoice reconciliation and receipts audit.
          </p>
        </div>

        <button
          onClick={() => setShowGridDrawer(!showGridDrawer)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate/20 bg-paper text-slate hover:text-midnight text-xs font-semibold self-start sm:self-auto transition-colors"
        >
          <Table className="w-4 h-4 text-teal" />
          <span>{showGridDrawer ? "Hide Payout Grid" : "View Payout Grid"}</span>
        </button>
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-slate font-medium block">
            Disbursed Volume
          </span>
          <div className="text-xl font-serif font-bold text-midnight tabular-nums mt-1">
            {formatINR(metrics.totalDisbursed)}
          </div>
          <span className="text-[10px] text-slate/80 mt-0.5 block">
            Total active book basis
          </span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-slate font-medium block">
            Expected Commissions
          </span>
          <div className="text-xl font-serif font-bold text-midnight tabular-nums mt-1">
            {formatINR(metrics.totalExpected)}
          </div>
          <span className="text-[10px] text-slate/80 mt-0.5 block">
            Avg yield ~{( (metrics.totalExpected / metrics.totalDisbursed) * 100 ).toFixed(2)}%
          </span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs">
          <span className="text-[11px] uppercase tracking-wider text-slate font-medium block">
            Realised (Received)
          </span>
          <div className="text-xl font-serif font-bold text-teal tabular-nums mt-1">
            {formatINR(metrics.totalReceived)}
          </div>
          <span className="text-[10px] text-teal/80 mt-0.5 block">
            Net received in bank accounts
          </span>
        </div>

        <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-wider text-slate font-medium block">
              Pending / Delayed (R12)
            </span>
            {metrics.overdueAgeingCount > 0 && (
              <AlertTriangle className="w-4 h-4 text-crimson" />
            )}
          </div>
          <div className="text-xl font-serif font-bold text-crimson tabular-nums mt-1">
            {formatINR(metrics.totalUnpaid)}
          </div>
          <span className="text-[10px] text-crimson font-medium mt-0.5 block">
            {metrics.overdueAgeingCount} payout(s) overdue &gt; 30 days
          </span>
        </div>
      </div>

      {/* Collapsible Reference Payout Grid */}
      {showGridDrawer && (
        <div className="bg-paper p-5 rounded-2xl border border-slate/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-4 h-4 text-teal" />
              <h2 className="font-serif text-sm font-bold text-midnight">
                Lender Master Commission Grid (Effective 01-Apr-2026)
              </h2>
            </div>
            <span className="text-[11px] text-slate">Snapshotted onto payouts upon disbursal (R12)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {payoutGrid.map((g) => (
              <div key={g.id} className="bg-surface p-3 rounded-xl border border-slate/15 shadow-xs">
                <div className="font-semibold text-midnight">{g.lender_name}</div>
                <div className="text-slate text-[11px]">{g.product_name}</div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-[10px] text-slate uppercase">Commission</span>
                  <span className="font-mono text-base font-bold text-teal">
                    {(g.payout_percentage * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div className="bg-surface rounded-xl border border-slate/15 p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-medium">
          {(["all", "Not Claimed", "Claimed", "Received", "Disputed"] as const).map((tab) => {
            const count =
              tab === "all" ? payouts.length : payouts.filter((p) => p.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? "bg-midnight text-white font-semibold"
                    : "text-slate hover:bg-paper hover:text-midnight"
                }`}
              >
                {tab === "all" ? "All Payouts" : tab} ({count})
              </button>
            );
          })}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            type="text"
            placeholder="Search code, client, invoice..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-paper rounded-lg border border-slate/20 text-xs focus:outline-teal"
          />
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-surface rounded-2xl border border-slate/15 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-paper border-b border-slate/15 font-semibold text-slate uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3">Loan</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Lender / Product</th>
                <th className="px-4 py-3 text-right">Disbursed (₹)</th>
                <th className="px-4 py-3 text-right">Payout %</th>
                <th className="px-4 py-3 text-right">Expected (₹)</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Ageing (R12)</th>
                <th className="px-4 py-3">Invoice / Receipt</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10">
              {filteredPayouts.map((payout) => {
                const ageingDays = calculateAgeingDays(payout.disbursed_date);
                const isOverdue = payout.status !== "Received" && ageingDays > 30;

                return (
                  <tr key={payout.id} className="hover:bg-paper/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-midnight">
                      {payout.loan_code}
                    </td>
                    <td className="px-4 py-3 font-medium text-midnight">
                      {payout.client_name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-midnight">{payout.lender_name}</div>
                      <div className="text-[11px] text-slate">{payout.product_name}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate tabular-nums">
                      {formatINR(payout.disbursed_amount)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-midnight">
                      {(payout.payout_percentage * 100).toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-midnight tabular-nums">
                      {formatINR(payout.expected_amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          payout.status === "Received"
                            ? "bg-teal/10 text-teal"
                            : payout.status === "Claimed"
                            ? "bg-midnight/10 text-midnight"
                            : payout.status === "Disputed"
                            ? "bg-crimson/10 text-crimson"
                            : "bg-paper text-slate"
                        }`}
                      >
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-slate text-xs">{ageingDays}d</span>
                        {isOverdue && (
                          <span className="px-1.5 py-0.2 rounded bg-crimson/10 text-crimson text-[9px] font-bold">
                            UNPAID &gt; 30d
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {payout.status === "Received" ? (
                        <div className="text-[11px] space-y-0.5">
                          <span className="text-teal font-semibold block">
                            Received {formatDate(payout.received_date || today)}
                          </span>
                          <span className="text-slate block">
                            Net: {formatINR(payout.net_amount || payout.expected_amount)} (TDS: {formatINR(payout.tds_amount || 0)})
                          </span>
                        </div>
                      ) : payout.invoice_number ? (
                        <div className="text-[11px] space-y-0.5">
                          <span className="font-mono font-medium text-midnight block">
                            {payout.invoice_number}
                          </span>
                          <span className="text-slate block">
                            Dated: {formatDate(payout.invoice_date || payout.disbursed_date)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate/60 text-[11px] italic">Not Invoiced</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(payout)}
                        className="px-2.5 py-1 bg-midnight text-white text-xs font-semibold rounded hover:bg-midnight/90 transition-colors shadow-xs"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Payout Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/15 p-6 max-w-md w-full space-y-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate/10">
              <div>
                <h2 className="font-serif text-lg font-bold text-midnight">
                  Update Payout: {selectedPayout.loan_code}
                </h2>
                <p className="text-xs text-slate">
                  {selectedPayout.client_name} • {selectedPayout.lender_name}
                </p>
              </div>
              <button
                onClick={() => setSelectedPayout(null)}
                className="text-slate hover:text-midnight font-bold text-sm"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmitUpdate} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-midnight mb-1">Payout Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as PayoutItem["status"])}
                  className="w-full px-3 py-2 rounded-lg border border-slate/20 bg-paper text-xs font-medium"
                >
                  <option value="Not Claimed">Not Claimed</option>
                  <option value="Claimed">Claimed (Invoice Submitted)</option>
                  <option value="Received">Received (Reconciled in Bank)</option>
                  <option value="Disputed">Disputed</option>
                </select>
              </div>

              {(newStatus === "Claimed" || newStatus === "Received") && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-midnight mb-1">Invoice Number</label>
                    <input
                      type="text"
                      placeholder="e.g. INV-2026-004"
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate/20 bg-paper text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-midnight mb-1">Invoice Date</label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate/20 bg-paper text-xs"
                    />
                  </div>
                </div>
              )}

              {newStatus === "Received" && (
                <div className="p-3 bg-paper rounded-xl border border-slate/15 space-y-3">
                  <div className="font-semibold text-midnight text-xs border-b border-slate/10 pb-1.5">
                    Receipt Reconciliation Breakdown
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate mb-1">Receipt Date</label>
                      <input
                        type="date"
                        value={receivedDate}
                        onChange={(e) => setReceivedDate(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate/20 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate mb-1">Gross Amount (₹)</label>
                      <input
                        type="number"
                        value={grossAmount}
                        onChange={(e) => setGrossAmount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate/20 bg-white text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] text-slate mb-1">TDS Deducted (₹)</label>
                      <input
                        type="number"
                        value={tdsAmount}
                        onChange={(e) => setTdsAmount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate/20 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate mb-1">Net Received (₹)</label>
                      <input
                        type="number"
                        value={netAmount}
                        onChange={(e) => setNetAmount(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate/20 bg-white text-xs font-bold text-teal"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-midnight mb-1">Audit Notes / Remarks</label>
                <textarea
                  rows={2}
                  placeholder="Notes on receipt or discrepancy..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate/20 bg-paper text-xs"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-slate/10">
                <button
                  type="button"
                  onClick={() => setSelectedPayout(null)}
                  className="px-3 py-1.5 rounded-lg border border-slate/20 text-slate hover:text-midnight text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-midnight text-white text-xs font-semibold rounded-lg hover:bg-midnight/90 shadow-xs"
                >
                  Save Payout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
