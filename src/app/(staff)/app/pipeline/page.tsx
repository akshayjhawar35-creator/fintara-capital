"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useData } from "@/lib/data/store";
import { formatINR, formatINRCompact, formatDate } from "@/lib/format";
import {
  Kanban as KanbanIcon,
  Table as TableIcon,
  Plus,
  Search,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  X,
  Building2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { CaseItem, StageName } from "@/lib/data/mock-data";

export default function PipelinePage() {
  const { cases, stages, products, lenders, bankers, clients, today, addCase, getCaseAlerts } =
    useData();

  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [lenderFilter, setLenderFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [alertFilter, setAlertFilter] = useState("all");
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);

  // New Case Form State
  const [formData, setFormData] = useState({
    client_id: clients[0]?.id || "",
    case_type: "Fresh" as CaseItem["case_type"],
    product_id: "p-hl",
    requested_amount: "4500000",
    lender_id: lenders[0]?.id || "",
    banker_id: bankers[0]?.id || "",
    existing_lender: "State Bank of India",
    existing_roi: "9.35",
    proposed_roi: "8.40",
    handled_by: "Owner",
    next_followup_on: "2026-09-24",
    notes: "",
  });

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const client = clients.find((c) => c.id === formData.client_id) || clients[0];
    const product = products.find((p) => p.id === formData.product_id) || products[0];
    const lender = lenders.find((l) => l.id === formData.lender_id) || lenders[0];
    const banker = bankers.find((b) => b.id === formData.banker_id) || bankers[0];

    const isBT = formData.case_type === "Balance Transfer (Takeover)";

    addCase({
      client_id: client.id,
      client_code: client.client_code,
      client_name: client.name,
      case_type: formData.case_type,
      product_id: product.id,
      product_name: product.name,
      requested_amount: parseFloat(formData.requested_amount) || 0,
      existing_lender: isBT ? formData.existing_lender : undefined,
      existing_roi: isBT ? parseFloat(formData.existing_roi) / 100 : undefined,
      proposed_roi: isBT ? parseFloat(formData.proposed_roi) / 100 : undefined,
      handled_by: formData.handled_by,
      next_followup_on: formData.next_followup_on,
      primary_submission: {
        id: `sub-${Date.now()}`,
        submission_code: `SUB-1`,
        lender_id: lender.id,
        lender_name: lender.name,
        banker_id: banker.id,
        banker_name: banker.name,
        stage: "Enquiry Qualified",
        stage_updated_on: today,
        is_primary: true,
        notes: formData.notes,
      },
    });

    setIsNewCaseModalOpen(false);
  };

  // Filter Cases
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        c.case_code.toLowerCase().includes(q) ||
        c.client_name.toLowerCase().includes(q) ||
        c.product_name.toLowerCase().includes(q) ||
        c.primary_submission.lender_name.toLowerCase().includes(q);

      if (!matchQuery) return false;
      if (productFilter !== "all" && c.product_id !== productFilter) return false;
      if (lenderFilter !== "all" && c.primary_submission.lender_id !== lenderFilter) return false;
      if (ownerFilter !== "all" && c.handled_by !== ownerFilter) return false;

      if (alertFilter !== "all") {
        const alerts = getCaseAlerts(c);
        if (alertFilter === "OVERDUE" && alerts.followupAlert !== "OVERDUE") return false;
        if (alertFilter === "STUCK" && !alerts.isStuck) return false;
        if (alertFilter === "DISBURSAL" && !alerts.isDisbursalSoon) return false;
        if (alertFilter === "BT" && !alerts.btSaving) return false;
      }

      return true;
    });
  }, [cases, searchQuery, productFilter, lenderFilter, ownerFilter, alertFilter, getCaseAlerts]);

  // Aggregate Pipeline Stats
  const { totalPipeline, weightedPipeline, stuckCount, overdueCount } = useMemo(() => {
    let total = 0;
    let weighted = 0;
    let stuck = 0;
    let overdueCount = 0;

    filteredCases.forEach((c) => {
      const amt = c.sanctioned_amount || c.requested_amount;
      total += amt;

      const stageDef = stages.find((s) => s.name === c.primary_submission.stage);
      const prob = stageDef ? stageDef.win_prob : 0;
      weighted += amt * prob;

      const alerts = getCaseAlerts(c);
      if (alerts.isStuck) stuck += 1;
      if (alerts.followupAlert === "OVERDUE") overdueCount += 1;
    });

    return {
      totalPipeline: total,
      weightedPipeline: Math.round(weighted),
      stuckCount: stuck,
      overdueCount,
    };
  }, [filteredCases, stages, getCaseAlerts]);

  // Alert Badge Helper
  const renderCaseBadges = (c: CaseItem) => {
    const { followupAlert, followupDaysDiff, isStuck, daysInStage, isDisbursalSoon, daysToDisbursal, btSaving } =
      getCaseAlerts(c);

    return (
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {/* Overdue */}
        {followupAlert === "OVERDUE" && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700">
            <Clock className="w-3 h-3 text-red-600" />
            OVD {followupDaysDiff}d
          </span>
        )}

        {/* Stuck (R3) */}
        {isStuck && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            STUCK {daysInStage}d
          </span>
        )}

        {/* Disbursal Due (R4) */}
        {isDisbursalSoon && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-green-100 text-green-800">
            <TrendingUp className="w-3 h-3 text-green-700" />
            Due in {daysToDisbursal}d
          </span>
        )}

        {/* Balance Transfer Savings (R6) */}
        {btSaving && btSaving > 0 && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            <Sparkles className="w-3 h-3 text-blue-600" />
            Save {formatINRCompact(btSaving)}/yr
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">Pipeline &amp; Case Tracking</h1>
          <p className="text-sm text-slate">
            Multi-lender loan submissions, 11-stage engine &amp; weighted revenue forecasting.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="inline-flex p-1 bg-surface border border-slate/20 rounded-lg">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === "kanban"
                  ? "bg-midnight text-white shadow-sm"
                  : "text-slate hover:text-midnight"
              }`}
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-midnight text-white shadow-sm"
                  : "text-slate hover:text-midnight"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              Table
            </button>
          </div>

          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="flex items-center gap-2 bg-midnight text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-midnight/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Case
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate/50" />
          <input
            type="text"
            placeholder="Search case code, client, lender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>

        <select
          value={productFilter}
          onChange={(e) => setProductFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="all">All Products</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <select
          value={lenderFilter}
          onChange={(e) => setLenderFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="all">All Lenders</option>
          {lenders.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>

        <select
          value={alertFilter}
          onChange={(e) => setAlertFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="all">All Alerts</option>
          <option value="OVERDUE">🔴 Overdue Follow-up</option>
          <option value="STUCK">🚨 Stuck Cases (&gt; 10d)</option>
          <option value="DISBURSAL">💰 Disbursal Due (&le; 30d)</option>
          <option value="BT">🔵 Balance Transfer Savings</option>
        </select>
      </div>

      {/* Main Content Area */}
      {viewMode === "kanban" ? (
        /* KANBAN BOARD */
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[500px]">
          {stages.slice(0, 8).map((stage) => {
            const stageCases = filteredCases.filter(
              (c) => c.primary_submission.stage === stage.name
            );
            const colTotal = stageCases.reduce(
              (acc, c) => acc + (c.sanctioned_amount || c.requested_amount),
              0
            );

            return (
              <div
                key={stage.id}
                className="bg-paper border border-slate/15 rounded-xl p-3 flex flex-col w-[260px] shrink-0"
              >
                {/* Column Header */}
                <div className="pb-2.5 border-b border-slate/15 mb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-midnight truncate" title={stage.name}>
                      {stage.name}
                    </h3>
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-slate/10 text-slate">
                      {stageCases.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate mt-1">
                    <span>Win: {(stage.win_prob * 100).toFixed(0)}%</span>
                    <span className="font-semibold text-midnight tabular-nums">
                      {formatINRCompact(colTotal)}
                    </span>
                  </div>
                </div>

                {/* Column Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto">
                  {stageCases.length === 0 ? (
                    <div className="text-xs text-slate/40 text-center py-8">No active cases</div>
                  ) : (
                    stageCases.map((c) => {
                      const displayAmt = c.sanctioned_amount || c.requested_amount;
                      return (
                        <Link
                          key={c.id}
                          href={`/app/cases/detail/?id=${c.case_code}`}
                          className="block bg-surface p-3.5 rounded-xl border border-slate/15 shadow-xs hover:border-teal hover:shadow-md transition-all space-y-2 group"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-mono font-bold text-teal group-hover:underline">
                              {c.case_code}
                            </span>
                            <span className="text-[11px] font-medium text-slate">
                              {c.handled_by}
                            </span>
                          </div>

                          <div>
                            <div className="font-semibold text-sm text-midnight truncate">
                              {c.client_name}
                            </div>
                            <div className="text-xs text-slate flex justify-between mt-0.5">
                              <span className="truncate">{c.product_name}</span>
                              <span className="font-bold text-midnight tabular-nums">
                                {formatINRCompact(displayAmt)}
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-slate pt-1 border-t border-slate/10 flex items-center justify-between">
                            <span className="truncate">{c.primary_submission.lender_name}</span>
                            <ArrowUpRight className="w-3.5 h-3.5 text-slate/40 group-hover:text-teal" />
                          </div>

                          {/* Alert Badges */}
                          {renderCaseBadges(c)}
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-surface rounded-xl border border-slate/15 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-paper/75 text-xs text-slate uppercase border-b border-slate/15 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Product &amp; Type</th>
                  <th className="py-3 px-4">Lender</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Health &amp; Alerts</th>
                  <th className="py-3 px-4">Follow-up</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/10 text-midnight">
                {filteredCases.map((c) => {
                  const displayAmt = c.sanctioned_amount || c.requested_amount;
                  return (
                    <tr key={c.id} className="hover:bg-paper/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-teal">
                        <Link href={`/app/cases/detail/?id=${c.case_code}`} className="hover:underline">
                          {c.case_code}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-midnight">{c.client_name}</div>
                        <div className="text-xs text-slate">{c.client_code}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-medium text-midnight">{c.product_name}</div>
                        <div className="text-slate">{c.case_type}</div>
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        <div className="font-medium text-midnight">{c.primary_submission.lender_name}</div>
                        <div className="text-slate">{c.primary_submission.banker_name}</div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="font-semibold text-midnight tabular-nums">{formatINR(displayAmt)}</div>
                        <div className="text-xs text-slate font-medium">{formatINRCompact(displayAmt)}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate/10 text-midnight">
                          {c.primary_submission.stage}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">{renderCaseBadges(c)}</td>
                      <td className="py-3.5 px-4 text-xs text-slate whitespace-nowrap">
                        {c.next_followup_on ? formatDate(c.next_followup_on) : "None"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/app/cases/detail/?id=${c.case_code}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-paper text-midnight hover:bg-slate/10"
                        >
                          View &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PIPELINE SUMMARY FOOTER (Workbook Spec) */}
      <div className="bg-midnight text-white p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <span className="text-xs text-white/60 uppercase tracking-wider block">Active Pipeline Book</span>
          <div className="text-2xl font-serif font-bold text-white tabular-nums mt-0.5">
            {formatINR(totalPipeline)} <span className="text-sm font-sans font-medium text-white/70">({formatINRCompact(totalPipeline)})</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6">
          <div>
            <span className="text-white/60 block mb-0.5">Weighted Pipeline</span>
            <span className="text-gold font-bold text-base tabular-nums">
              {formatINR(weightedPipeline)} ({formatINRCompact(weightedPipeline)})
            </span>
          </div>
          <div>
            <span className="text-white/60 block mb-0.5">Total Cases</span>
            <span className="font-bold text-base text-white">{filteredCases.length}</span>
          </div>
          <div>
            <span className="text-white/60 block mb-0.5">Stuck Attention</span>
            <span className="font-bold text-base text-amber-400">{stuckCount}</span>
          </div>
        </div>
      </div>

      {/* NEW CASE MODAL */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/20 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-midnight text-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="font-serif text-lg font-semibold">New Case Application</h2>
                <p className="text-xs text-white/70">
                  Initiate case submission with primary lender allocation.
                </p>
              </div>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                {/* Client Select */}
                <div className="col-span-2">
                  <label className="block font-semibold text-midnight mb-1">Select Client *</label>
                  <select
                    value={formData.client_id}
                    onChange={(e) => setFormData((p) => ({ ...p, client_id: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.client_code} • {c.client_type})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Case Type */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold text-midnight mb-1">Case Type *</label>
                  <select
                    value={formData.case_type}
                    onChange={(e) => setFormData((p) => ({ ...p, case_type: e.target.value as any }))}
                    className="w-full px-3 py-2 text-xs border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                  >
                    <option value="Fresh">Fresh Loan</option>
                    <option value="Balance Transfer (Takeover)">Balance Transfer (Takeover)</option>
                    <option value="Top-up">Top-up</option>
                    <option value="Enhancement / Renewal">Enhancement / Renewal</option>
                  </select>
                </div>

                {/* Product */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold text-midnight mb-1">Product *</label>
                  <select
                    value={formData.product_id}
                    onChange={(e) => setFormData((p) => ({ ...p, product_id: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Requested Amount */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold text-midnight mb-1">Requested Amount (₹) *</label>
                  <input
                    type="number"
                    step="50000"
                    required
                    value={formData.requested_amount}
                    onChange={(e) => setFormData((p) => ({ ...p, requested_amount: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                  <div className="text-[11px] text-teal font-medium mt-1">
                    {formatINR(parseFloat(formData.requested_amount) || 0)} ({formatINRCompact(parseFloat(formData.requested_amount) || 0)})
                  </div>
                </div>

                {/* Target Lender */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold text-midnight mb-1">Primary Lender *</label>
                  <select
                    value={formData.lender_id}
                    onChange={(e) => setFormData((p) => ({ ...p, lender_id: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                  >
                    {lenders.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Balance Transfer Specific Fields (Rule R6) */}
                {formData.case_type === "Balance Transfer (Takeover)" && (
                  <div className="col-span-2 bg-paper p-4 rounded-xl border border-slate/15 space-y-3">
                    <div className="font-semibold text-midnight text-xs flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Balance Transfer Savings Inputs (Rule R6)
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-slate mb-1">Existing Lender</label>
                        <input
                          type="text"
                          value={formData.existing_lender}
                          onChange={(e) => setFormData((p) => ({ ...p, existing_lender: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-slate/20 rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate mb-1">Existing ROI (%)</label>
                        <input
                          type="number"
                          step="0.05"
                          value={formData.existing_roi}
                          onChange={(e) => setFormData((p) => ({ ...p, existing_roi: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-slate/20 rounded bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate mb-1">Proposed ROI (%)</label>
                        <input
                          type="number"
                          step="0.05"
                          value={formData.proposed_roi}
                          onChange={(e) => setFormData((p) => ({ ...p, proposed_roi: e.target.value }))}
                          className="w-full px-2.5 py-1.5 border border-slate/20 rounded bg-white"
                        />
                      </div>
                    </div>
                    {/* Live BT Savings Preview */}
                    {parseFloat(formData.existing_roi) > parseFloat(formData.proposed_roi) && (
                      <div className="text-[11px] text-blue-700 font-semibold bg-blue-50 p-2 rounded border border-blue-200">
                        Indicative Annual Interest Saving:{" "}
                        {formatINR(
                          Math.round(
                            (parseFloat(formData.requested_amount) || 0) *
                              ((parseFloat(formData.existing_roi) - parseFloat(formData.proposed_roi)) / 100)
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Handled By */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold text-midnight mb-1">Handled By</label>
                  <select
                    value={formData.handled_by}
                    onChange={(e) => setFormData((p) => ({ ...p, handled_by: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Staff 1">Staff 1</option>
                  </select>
                </div>

                {/* Next Follow-up */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block font-semibold text-midnight mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={formData.next_followup_on}
                    onChange={(e) => setFormData((p) => ({ ...p, next_followup_on: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <label className="block font-semibold text-midnight mb-1">Submission Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Initial documentation status, property location, target loan terms..."
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    className="w-full px-3 py-2 text-xs border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate/15 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate hover:text-midnight"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-midnight text-white font-semibold rounded-md hover:bg-midnight/90 shadow-sm"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
