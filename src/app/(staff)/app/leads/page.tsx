"use client";

import React, { useState, useMemo } from "react";
import { useData, FollowupAlert } from "@/lib/data/store";
import { formatINR, formatINRCompact, formatDate, formatMobile } from "@/lib/format";
import { detectSensitiveData } from "@/lib/sensitive-guard";
import {
  Search,
  Plus,
  Table as TableIcon,
  Kanban as KanbanIcon,
  MessageCircle,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  UserCheck,
  X,
  ArrowRight,
} from "lucide-react";
import { Lead } from "@/lib/data/mock-data";

export default function LeadsPage() {
  const {
    leads,
    products,
    today,
    addLead,
    updateLeadStatus,
    updateLeadFollowup,
    checkDuplicateMobile,
    getFollowupAlert,
    addClient,
  } = useData();

  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [alertFilter, setAlertFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);

  // Form State for Quick-Add Modal
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    location_area: "",
    product_id: "p-hl",
    amount: "2500000",
    source: "Website / Google Search",
    assigned_to: "Owner",
    next_followup_on: "2026-09-21",
    notes: "",
  });
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [sensitiveWarning, setSensitiveWarning] = useState<string | null>(null);

  // Handle Mobile Input Change with Real-Time Duplicate Check
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, mobile: val }));
    if (val.replace(/\D/g, "").length >= 10) {
      const check = checkDuplicateMobile(val);
      if (check.isDuplicate) {
        setDuplicateWarning(
          `This mobile number already exists under ${check.ownerName} — please coordinate with the team.`
        );
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  // Handle Notes Change with Sensitive Data Detection
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, notes: val }));
    const detected = detectSensitiveData(val);
    if (detected) {
      setSensitiveWarning(
        `This looks like a ${detected} number. Please don't store it here — paste the documents folder link instead.`
      );
    } else {
      setSensitiveWarning(null);
    }
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;

    const prod = products.find((p) => p.id === formData.product_id);
    addLead({
      name: formData.name,
      mobile: formData.mobile,
      location_area: formData.location_area || "Raipur",
      product_id: formData.product_id,
      product_name: prod ? prod.name : "Loan",
      amount: parseFloat(formData.amount) || 0,
      source: formData.source,
      status: "New",
      assigned_to: formData.assigned_to,
      assigned_to_id: formData.assigned_to === "Owner" ? "owner" : "staff-1",
      last_contact_on: today,
      next_followup_on: formData.next_followup_on || today,
      notes: formData.notes,
    });

    setIsAddModalOpen(false);
    // Reset form
    setFormData({
      name: "",
      mobile: "",
      location_area: "",
      product_id: "p-hl",
      amount: "2500000",
      source: "Website / Google Search",
      assigned_to: "Owner",
      next_followup_on: "2026-09-21",
      notes: "",
    });
    setDuplicateWarning(null);
    setSensitiveWarning(null);
  };

  // Quick Convert Lead to Client (R14)
  const handleConvertLead = (lead: Lead) => {
    addClient({
      name: lead.name,
      contact_person: lead.name,
      mobile: lead.mobile,
      email: `${lead.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@sample.test`,
      city_area: lead.location_area,
      address: `${lead.location_area}, Raipur, Chhattisgarh`,
      client_type: "Salaried",
      client_since: today,
      relationship_owner: lead.assigned_to,
      source: lead.source,
      consent_status: "Yes",
      consent_channel: "Verbal",
      consent_date: today,
      notes: `Converted from lead ${lead.lead_code}. ${lead.notes}`,
    });
    updateLeadStatus(lead.id, "Converted");
    setConvertingLead(null);
  };

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        lead.name.toLowerCase().includes(q) ||
        lead.lead_code.toLowerCase().includes(q) ||
        lead.mobile.includes(q) ||
        lead.location_area.toLowerCase().includes(q);

      if (!matchQuery) return false;
      if (statusFilter !== "all" && lead.status !== statusFilter) return false;
      if (productFilter !== "all" && lead.product_id !== productFilter) return false;

      if (alertFilter !== "all") {
        const { alert } = getFollowupAlert(lead.next_followup_on);
        if (alert !== alertFilter) return false;
      }

      return true;
    });
  }, [leads, searchQuery, statusFilter, productFilter, alertFilter, getFollowupAlert]);

  // SLA Alert Pill Renderer
  const renderAlertPill = (nextFollowupOn: string | null) => {
    const { alert, daysDiff } = getFollowupAlert(nextFollowupOn);

    switch (alert) {
      case "OVERDUE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
            <Clock className="w-3 h-3 text-red-600" />
            OVERDUE {daysDiff}d
          </span>
        );
      case "DUE TODAY":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
            <AlertCircle className="w-3 h-3 text-orange-600" />
            DUE TODAY
          </span>
        );
      case "DUE SOON":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock className="w-3 h-3 text-yellow-600" />
            Due in {daysDiff}d
          </span>
        );
      case "OK":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            OK
          </span>
        );
      case "NO FOLLOW-UP SET":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
            NO FOLLOW-UP
          </span>
        );
    }
  };

  const statusColors: Record<Lead["status"], string> = {
    New: "bg-blue-50 text-blue-700 border-blue-200",
    Contacted: "bg-purple-50 text-purple-700 border-purple-200",
    Interested: "bg-teal/10 text-teal border-teal/20",
    "Docs Awaited": "bg-yellow-50 text-yellow-800 border-yellow-200",
    Converted: "bg-green-50 text-green-800 border-green-200",
    "Not Interested": "bg-slate/10 text-slate border-slate/20",
    Lost: "bg-red-50 text-red-800 border-red-200",
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">Leads Directory</h1>
          <p className="text-sm text-slate">
            Enquiries, rapid 24h follow-up SLA tracking & conversion.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="inline-flex p-1 bg-surface border border-slate/20 rounded-lg">
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
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-midnight text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-midnight/90 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Lead
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate/50" />
          <input
            type="text"
            placeholder="Search prospect, mobile, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="all">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Interested">Interested</option>
          <option value="Docs Awaited">Docs Awaited</option>
          <option value="Converted">Converted</option>
          <option value="Not Interested">Not Interested</option>
          <option value="Lost">Lost</option>
        </select>

        {/* Product Filter */}
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

        {/* Alert Filter */}
        <select
          value={alertFilter}
          onChange={(e) => setAlertFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="all">All Follow-up Urgencies</option>
          <option value="OVERDUE">🔴 Overdue</option>
          <option value="DUE TODAY">🟠 Due Today</option>
          <option value="DUE SOON">🟡 Due Soon (&le; 7d)</option>
          <option value="OK">🟢 OK</option>
          <option value="NO FOLLOW-UP SET">⚠️ No Follow-up Set</option>
        </select>
      </div>

      {/* Main Content Area */}
      {viewMode === "table" ? (
        /* TABLE VIEW */
        <div className="bg-surface rounded-xl border border-slate/15 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead className="bg-paper/75 text-xs text-slate uppercase border-b border-slate/15 tracking-wider">
                <tr>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Prospect</th>
                  <th className="py-3 px-4">Requirement</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Follow-up SLA</th>
                  <th className="py-3 px-4">Owner</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/10 text-midnight">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate">
                      No leads match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-paper/40 transition-colors">
                      {/* Code */}
                      <td className="py-3.5 px-4 font-mono text-xs font-semibold text-teal">
                        {lead.lead_code}
                      </td>

                      {/* Prospect */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-midnight">{lead.name}</div>
                        <div className="text-xs text-slate flex items-center gap-1.5 mt-0.5">
                          <span>{formatMobile(lead.mobile)}</span>
                          <span>•</span>
                          <span>{lead.location_area}</span>
                        </div>
                      </td>

                      {/* Requirement */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-midnight">
                          {lead.product_name}
                        </div>
                        <div className="text-xs text-slate font-medium tabular-nums">
                          {formatINR(lead.amount)} ({formatINRCompact(lead.amount)})
                        </div>
                      </td>

                      {/* Source */}
                      <td className="py-3.5 px-4 text-xs text-slate">{lead.source}</td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            updateLeadStatus(lead.id, e.target.value as Lead["status"])
                          }
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border focus:outline-none ${statusColors[lead.status]}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interested">Interested</option>
                          <option value="Docs Awaited">Docs Awaited</option>
                          <option value="Converted">Converted</option>
                          <option value="Not Interested">Not Interested</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>

                      {/* SLA Alert & Follow-up Date */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <div>{renderAlertPill(lead.next_followup_on)}</div>
                          <div className="flex items-center gap-1 text-xs text-slate">
                            <Calendar className="w-3 h-3 text-slate/50" />
                            <input
                              type="date"
                              value={lead.next_followup_on || ""}
                              onChange={(e) => updateLeadFollowup(lead.id, e.target.value || null)}
                              className="bg-transparent border-0 text-xs p-0 focus:ring-0 text-slate hover:text-midnight cursor-pointer"
                            />
                          </div>
                        </div>
                      </td>

                      {/* Assigned Owner */}
                      <td className="py-3.5 px-4 text-xs font-medium text-slate">
                        {lead.assigned_to}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3.5 px-4 text-right space-x-2">
                        {/* WhatsApp Link */}
                        <a
                          href={`https://wa.me/91${lead.mobile.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(
                            lead.name
                          )},%20this%20is%20Fintara%20Capital%20following%20up%20on%20your%20${encodeURIComponent(
                            lead.product_name
                          )}%20enquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          title="Open in WhatsApp"
                          className="inline-flex p-1.5 rounded-md text-teal hover:bg-teal/10 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        {/* Convert to Client Button */}
                        {lead.status !== "Converted" && (
                          <button
                            onClick={() => setConvertingLead(lead)}
                            title="Convert to Client"
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-gold/15 text-midnight hover:bg-gold/30 transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5 text-gold" />
                            Convert
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN VIEW */
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4 overflow-x-auto pb-4">
          {(
            [
              "New",
              "Contacted",
              "Interested",
              "Docs Awaited",
              "Converted",
              "Not Interested",
              "Lost",
            ] as Lead["status"][]
          ).map((st) => {
            const colLeads = filteredLeads.filter((l) => l.status === st);
            return (
              <div
                key={st}
                className="bg-paper border border-slate/15 rounded-xl p-3 flex flex-col min-w-[220px]"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate/15 mb-3">
                  <span className="text-xs font-semibold text-midnight uppercase tracking-wider">
                    {st}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate/10 text-slate">
                    {colLeads.length}
                  </span>
                </div>

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {colLeads.length === 0 ? (
                    <div className="text-xs text-slate/50 text-center py-6">Empty</div>
                  ) : (
                    colLeads.map((l) => (
                      <div
                        key={l.id}
                        className="bg-surface p-3 rounded-lg border border-slate/15 shadow-xs hover:border-teal/50 transition-colors space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono font-bold text-teal">{l.lead_code}</span>
                          <span className="text-slate font-medium">{l.assigned_to}</span>
                        </div>

                        <div>
                          <div className="font-semibold text-sm text-midnight truncate">
                            {l.name}
                          </div>
                          <div className="text-xs text-slate flex justify-between mt-0.5">
                            <span>{l.product_name}</span>
                            <span className="font-medium tabular-nums">
                              {formatINRCompact(l.amount)}
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate/10 flex items-center justify-between">
                          <div>{renderAlertPill(l.next_followup_on)}</div>
                          <a
                            href={`https://wa.me/91${l.mobile.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1 text-teal hover:bg-teal/10 rounded"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK-ADD LEAD MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/20 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-midnight text-white flex items-center justify-between">
              <div>
                <h2 className="font-serif text-lg font-semibold">New Loan Enquiry (Lead)</h2>
                <p className="text-xs text-white/70">
                  Follow-up SLA within 24h is enforced by default.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateLead} className="p-6 space-y-4">
              {/* Duplicate Mobile Alert */}
              {duplicateWarning && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{duplicateWarning}</span>
                </div>
              )}

              {/* Sensitive Data Warning */}
              {sensitiveWarning && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{sensitiveWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Prospect Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Agrawal"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, name: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* Mobile */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10 digits (6-9...)"
                    value={formData.mobile}
                    onChange={handleMobileChange}
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* Raipur Area */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Location / Area (Raipur)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Shankar Nagar, Pandri"
                    value={formData.location_area}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, location_area: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* Product */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Product
                  </label>
                  <select
                    value={formData.product_id}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, product_id: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none bg-surface"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Loan Amount */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Requested Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="50000"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, amount: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                  <div className="text-[11px] text-teal font-medium mt-1">
                    {formatINR(parseFloat(formData.amount) || 0)} ({formatINRCompact(parseFloat(formData.amount) || 0)})
                  </div>
                </div>

                {/* Next Follow-up (SLA) */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Next Follow-up Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.next_followup_on}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, next_followup_on: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                  <div className="text-[11px] text-slate mt-1">
                    Default is within 24h per firm rule.
                  </div>
                </div>

                {/* Lead Source */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Lead Source
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, source: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none bg-surface"
                  >
                    <option value="Google Business Profile">Google Business Profile</option>
                    <option value="Website / Google Search">Website / Google Search</option>
                    <option value="Instagram / Facebook">Instagram / Facebook</option>
                    <option value="Referral - Client">Referral - Client</option>
                    <option value="Referral - Builder/Broker">Referral - Builder/Broker</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="CA Practice Client">CA Practice Client</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Assigned To */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Assigned To
                  </label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, assigned_to: e.target.value }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none bg-surface"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Staff 1">Staff 1</option>
                  </select>
                </div>

                {/* Notes */}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Qualification Notes (no Aadhaar / PAN)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Purpose of loan, property location, income/ITR details..."
                    value={formData.notes}
                    onChange={handleNotesChange}
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit / Cancel */}
              <div className="pt-4 border-t border-slate/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate hover:text-midnight font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm bg-midnight text-white font-semibold rounded-md hover:bg-midnight/90 transition-colors shadow-sm"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONVERT LEAD CONFIRMATION MODAL */}
      {convertingLead && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/20 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-midnight">
              <div className="p-2.5 bg-gold/15 text-gold rounded-full">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold">
                  Convert to Client?
                </h3>
                <p className="text-xs text-slate">
                  Rule R14: Creates client record, links lead, and prepares pipeline submission.
                </p>
              </div>
            </div>

            <div className="bg-paper p-3 rounded-lg border border-slate/15 text-sm space-y-1">
              <div>
                <span className="text-slate text-xs">Prospect: </span>
                <span className="font-semibold text-midnight">{convertingLead.name}</span>
              </div>
              <div>
                <span className="text-slate text-xs">Mobile: </span>
                <span className="font-medium text-midnight">
                  {formatMobile(convertingLead.mobile)}
                </span>
              </div>
              <div>
                <span className="text-slate text-xs">Loan Requirement: </span>
                <span className="font-medium text-midnight">
                  {convertingLead.product_name} ({formatINRCompact(convertingLead.amount)})
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConvertingLead(null)}
                className="px-4 py-2 text-sm text-slate hover:text-midnight font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleConvertLead(convertingLead)}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-midnight text-white font-semibold rounded-md hover:bg-midnight/90 transition-colors shadow-sm"
              >
                Confirm &amp; Convert
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
