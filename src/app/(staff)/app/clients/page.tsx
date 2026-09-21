"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useData } from "@/lib/data/store";
import { formatINR, formatINRCompact, formatDate, formatMobile } from "@/lib/format";
import {
  Search,
  Plus,
  Building2,
  Phone,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  User,
  X,
  Briefcase,
} from "lucide-react";
import { Client } from "@/lib/data/mock-data";

export default function ClientsPage() {
  const { clients, today, addClient, checkDuplicateMobile } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add Client Modal
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    mobile: "",
    email: "",
    city_area: "Shankar Nagar",
    address: "",
    client_type: "Salaried" as Client["client_type"],
    business_name: "",
    turnover: "",
    annual_income: "",
    relationship_owner: "Owner",
    source: "Referral - Client",
    consent_channel: "Verbal" as NonNullable<Client["consent_channel"]>,
    consent_notes: "Verbal consent captured during initial loan qualification call.",
    notes: "",
  });
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({ ...prev, mobile: val }));
    if (val.replace(/\D/g, "").length >= 10) {
      const check = checkDuplicateMobile(val);
      if (check.isDuplicate) {
        setDuplicateWarning(
          `This mobile is already on file under ${check.ownerName}.`
        );
      } else {
        setDuplicateWarning(null);
      }
    } else {
      setDuplicateWarning(null);
    }
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.mobile) return;

    addClient({
      name: formData.name,
      contact_person: formData.contact_person || formData.name,
      mobile: formData.mobile,
      email: formData.email,
      city_area: formData.city_area,
      address: formData.address || `${formData.city_area}, Raipur, Chhattisgarh`,
      client_type: formData.client_type,
      business_name: formData.business_name || undefined,
      turnover: formData.turnover ? parseFloat(formData.turnover) : undefined,
      annual_income: formData.annual_income ? parseFloat(formData.annual_income) : undefined,
      client_since: today,
      relationship_owner: formData.relationship_owner,
      source: formData.source,
      consent_status: "Yes",
      consent_channel: formData.consent_channel,
      consent_date: today,
      notes: formData.notes,
    });

    setIsAddModalOpen(false);
    setFormData({
      name: "",
      contact_person: "",
      mobile: "",
      email: "",
      city_area: "Shankar Nagar",
      address: "",
      client_type: "Salaried",
      business_name: "",
      turnover: "",
      annual_income: "",
      relationship_owner: "Owner",
      source: "Referral - Client",
      consent_channel: "Verbal",
      consent_notes: "Verbal consent captured during initial loan qualification call.",
      notes: "",
    });
    setDuplicateWarning(null);
  };

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        c.name.toLowerCase().includes(q) ||
        c.client_code.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.city_area.toLowerCase().includes(q);

      if (!matchQuery) return false;
      if (typeFilter !== "all" && c.client_type !== typeFilter) return false;
      if (ownerFilter !== "all" && c.relationship_owner !== ownerFilter) return false;
      return true;
    });
  }, [clients, searchQuery, typeFilter, ownerFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">Clients Directory</h1>
          <p className="text-sm text-slate">
            Active borrowing relationships, 360° client views & DPDP consent tracking.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-midnight text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-midnight/90 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate/50" />
          <input
            type="text"
            placeholder="Search client, mobile, code, area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>

        {/* Client Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="all">All Profiles / Types</option>
          <option value="Salaried">Salaried</option>
          <option value="Business Owner">Business Owner</option>
          <option value="Self-employed Professional">Self-employed Professional</option>
          <option value="Trader">Trader</option>
          <option value="Company / LLP">Company / LLP</option>
        </select>

        {/* Relationship Owner Filter */}
        <select
          value={ownerFilter}
          onChange={(e) => setOwnerFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="all">All Relationship Owners</option>
          <option value="Owner">Owner</option>
          <option value="Staff 1">Staff 1</option>
        </select>
      </div>

      {/* Clients Table */}
      <div className="bg-surface rounded-xl border border-slate/15 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-paper/75 text-xs text-slate uppercase border-b border-slate/15 tracking-wider">
              <tr>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Client / Entity</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Type &amp; Area</th>
                <th className="py-3 px-4 text-center">Portfolio</th>
                <th className="py-3 px-4">Consent</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10 text-midnight">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate">
                    No clients found.
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-paper/40 transition-colors">
                    {/* Code */}
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-teal">
                      {client.client_code}
                    </td>

                    {/* Client Name */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/app/clients/detail/?id=${client.client_code}`}
                        className="font-semibold text-midnight hover:text-teal hover:underline flex items-center gap-1.5"
                      >
                        {client.name}
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate/60" />
                      </Link>
                      {client.business_name && (
                        <div className="text-xs text-slate">{client.business_name}</div>
                      )}
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-midnight">
                        {client.contact_person}
                      </div>
                      <div className="text-xs text-slate">{formatMobile(client.mobile)}</div>
                    </td>

                    {/* Type & Area */}
                    <td className="py-3.5 px-4 text-xs">
                      <span className="font-medium text-midnight">{client.client_type}</span>
                      <div className="text-slate">{client.city_area}, Raipur</div>
                    </td>

                    {/* Portfolio Counts */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex items-center gap-2 text-xs">
                        <span
                          title="Active Loans"
                          className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold"
                        >
                          {client.active_loans_count} Loan{client.active_loans_count !== 1 ? "s" : ""}
                        </span>
                        <span
                          title="Open Cases"
                          className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 font-semibold"
                        >
                          {client.open_cases_count} Case{client.open_cases_count !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </td>

                    {/* DPDP Consent */}
                    <td className="py-3.5 px-4 text-xs">
                      {client.consent_status === "Yes" ? (
                        <span className="inline-flex items-center gap-1 text-green-700 font-semibold bg-green-50 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3 text-green-600" />
                          Consented
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-700 font-semibold bg-red-50 px-2 py-0.5 rounded-full">
                          <ShieldAlert className="w-3 h-3 text-red-600" />
                          Revoked
                        </span>
                      )}
                    </td>

                    {/* Relationship Owner */}
                    <td className="py-3.5 px-4 text-xs font-medium text-slate">
                      {client.relationship_owner}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/app/clients/detail/?id=${client.client_code}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-paper text-midnight hover:bg-slate/10 transition-colors"
                      >
                        View 360°
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD CLIENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/20 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 bg-midnight text-white flex items-center justify-between sticky top-0 z-10">
              <div>
                <h2 className="font-serif text-lg font-semibold">Create Client Profile</h2>
                <p className="text-xs text-white/70">
                  New borrowing relationship with DPDP compliance record.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/70 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 space-y-4">
              {duplicateWarning && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-800 flex items-start gap-2">
                  <span>{duplicateWarning}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Client Name */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Client / Entity Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* Contact Person */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Contact Person Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Sharma"
                    value={formData.contact_person}
                    onChange={(e) => setFormData((p) => ({ ...p, contact_person: e.target.value }))}
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
                    placeholder="10 digits"
                    value={formData.mobile}
                    onChange={handleMobileChange}
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="client@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* Client Type */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Client Profile
                  </label>
                  <select
                    value={formData.client_type}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        client_type: e.target.value as Client["client_type"],
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none bg-surface"
                  >
                    <option value="Salaried">Salaried</option>
                    <option value="Business Owner">Business Owner</option>
                    <option value="Self-employed Professional">Self-employed Professional</option>
                    <option value="Trader">Trader</option>
                    <option value="Company / LLP">Company / LLP</option>
                  </select>
                </div>

                {/* City Area */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Area / Locality (Raipur)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Telibandha, Devendra Nagar"
                    value={formData.city_area}
                    onChange={(e) => setFormData((p) => ({ ...p, city_area: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>

                {/* DPDP Consent Channel */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Consent Channel (DPDP Act) *
                  </label>
                  <select
                    value={formData.consent_channel}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        consent_channel: e.target.value as "Verbal" | "WhatsApp" | "Physical Form",
                      }))
                    }
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none bg-surface"
                  >
                    <option value="Verbal">Verbal (Over Phone / Meeting)</option>
                    <option value="WhatsApp">WhatsApp Message</option>
                    <option value="Physical Form">Signed Physical Form</option>
                  </select>
                </div>

                {/* Relationship Owner */}
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-midnight mb-1">
                    Relationship Owner
                  </label>
                  <select
                    value={formData.relationship_owner}
                    onChange={(e) =>
                      setFormData((p) => ({ ...p, relationship_owner: e.target.value }))
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
                    Background &amp; Banking Conduct Notes
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Financial overview, key strengths, business profile..."
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal focus:outline-none"
                  />
                </div>
              </div>

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
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
