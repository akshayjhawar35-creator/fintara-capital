"use client";

import React, { useState, useMemo } from "react";
import { useData } from "@/lib/data/store";
import { formatMobile } from "@/lib/format";
import {
  Search,
  Plus,
  Building2,
  Phone,
  Mail,
  Clock,
  ShieldAlert,
  X,
} from "lucide-react";
import { Banker } from "@/lib/data/mock-data";

export default function BankersPage() {
  const { bankers, lenders, products } = useData();

  const [bankerList, setBankerList] = useState<Banker[]>(bankers);
  const [searchQuery, setSearchQuery] = useState("");
  const [lenderFilter, setLenderFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Banker Form
  const [formData, setFormData] = useState({
    name: "",
    lender_id: lenders[0]?.id || "",
    designation: "Relationship Manager",
    branch_city: "Raipur - Pandri",
    mobile: "",
    email: "",
    escalation_contact: "",
    tat_days_min: 5,
    tat_days_max: 10,
  });

  const handleCreateBanker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;

    const lender = lenders.find((l) => l.id === formData.lender_id) || lenders[0];

    const newBanker: Banker = {
      id: `b-${Date.now()}`,
      name: formData.name,
      lender_id: lender.id,
      lender_name: lender.name,
      designation: formData.designation,
      branch_city: formData.branch_city,
      mobile: formData.mobile,
      email: formData.email,
      products_handled: ["Home Loan", "Business Loan"],
      escalation_contact: formData.escalation_contact || "Regional Head",
      tat_days_min: Number(formData.tat_days_min),
      tat_days_max: Number(formData.tat_days_max),
      is_active: true,
    };

    setBankerList((prev) => [newBanker, ...prev]);
    setIsModalOpen(false);
    setFormData({
      name: "",
      lender_id: lenders[0]?.id || "",
      designation: "Relationship Manager",
      branch_city: "Raipur - Pandri",
      mobile: "",
      email: "",
      escalation_contact: "",
      tat_days_min: 5,
      tat_days_max: 10,
    });
  };

  const filteredBankers = useMemo(() => {
    return bankerList.filter((b) => {
      const q = searchQuery.toLowerCase();
      const match =
        b.name.toLowerCase().includes(q) ||
        b.lender_name.toLowerCase().includes(q) ||
        b.branch_city.toLowerCase().includes(q) ||
        b.mobile.includes(q);

      if (!match) return false;
      if (lenderFilter !== "all" && b.lender_id !== lenderFilter) return false;
      return true;
    });
  }, [bankerList, searchQuery, lenderFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">Bankers Directory</h1>
          <p className="text-sm text-slate">
            Lender relationship managers, Raipur branches, TAT tracking &amp; escalations.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-midnight text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-midnight/90 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Banker
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate/50" />
          <input
            type="text"
            placeholder="Search banker name, branch, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>

        <select
          value={lenderFilter}
          onChange={(e) => setLenderFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="all">All Lenders</option>
          {lenders.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({l.type})
            </option>
          ))}
        </select>
      </div>

      {/* Bankers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredBankers.map((banker) => (
          <div
            key={banker.id}
            className="bg-surface p-5 rounded-2xl border border-slate/15 shadow-xs space-y-4 hover:border-teal/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-teal/10 text-teal uppercase tracking-wider">
                  {banker.lender_name}
                </span>
                <h3 className="font-serif text-lg font-semibold text-midnight mt-1">
                  {banker.name}
                </h3>
                <p className="text-xs text-slate">
                  {banker.designation} • {banker.branch_city}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate bg-paper px-2.5 py-1 rounded-md border border-slate/15">
                  <Clock className="w-3.5 h-3.5 text-teal" />
                  TAT: {banker.tat_days_min}–{banker.tat_days_max} days
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-slate/10 py-3">
              <div>
                <span className="text-slate block mb-0.5">Mobile</span>
                <a
                  href={`tel:${banker.mobile}`}
                  className="font-medium text-midnight hover:text-teal flex items-center gap-1"
                >
                  <Phone className="w-3 h-3 text-slate/50" />
                  {formatMobile(banker.mobile)}
                </a>
              </div>
              <div>
                <span className="text-slate block mb-0.5">Email</span>
                <a
                  href={`mailto:${banker.email}`}
                  className="font-medium text-midnight hover:text-teal truncate block"
                >
                  {banker.email}
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-slate">Escalation: </span>
                <span className="font-medium text-midnight">{banker.escalation_contact}</span>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${banker.mobile}`}
                  className="p-1.5 rounded bg-paper hover:bg-slate/10 text-midnight"
                  title="Call Banker"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${banker.email}`}
                  className="p-1.5 rounded bg-paper hover:bg-slate/10 text-midnight"
                  title="Email Banker"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD BANKER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/20 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate/15">
              <h2 className="font-serif text-lg font-semibold text-midnight">Add Lender Banker</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate hover:text-midnight"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBanker} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-midnight mb-1">Banker Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alok Verma"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Lender / Institution *</label>
                <select
                  value={formData.lender_id}
                  onChange={(e) => setFormData((p) => ({ ...p, lender_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                >
                  {lenders.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name} ({l.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-midnight mb-1">Designation</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData((p) => ({ ...p, designation: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-midnight mb-1">Branch (Raipur)</label>
                  <input
                    type="text"
                    value={formData.branch_city}
                    onChange={(e) => setFormData((p) => ({ ...p, branch_city: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-midnight mb-1">Mobile *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10 digits"
                    value={formData.mobile}
                    onChange={(e) => setFormData((p) => ({ ...p, mobile: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-midnight mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="banker@bank.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-midnight mb-1">Min TAT (Days)</label>
                  <input
                    type="number"
                    value={formData.tat_days_min}
                    onChange={(e) => setFormData((p) => ({ ...p, tat_days_min: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-midnight mb-1">Max TAT (Days)</label>
                  <input
                    type="number"
                    value={formData.tat_days_max}
                    onChange={(e) => setFormData((p) => ({ ...p, tat_days_max: Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Escalation Contact</label>
                <input
                  type="text"
                  placeholder="e.g. Regional Head / Area Sales Manager"
                  value={formData.escalation_contact}
                  onChange={(e) => setFormData((p) => ({ ...p, escalation_contact: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div className="pt-3 border-t border-slate/15 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 font-medium text-slate hover:text-midnight"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-midnight text-white font-semibold rounded-md hover:bg-midnight/90"
                >
                  Save Banker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
