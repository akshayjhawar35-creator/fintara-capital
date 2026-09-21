"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useData } from "@/lib/data/store";
import { formatDate } from "@/lib/format";
import {
  Search,
  Plus,
  Phone,
  MessageCircle,
  Users,
  Calendar,
  Clock,
  ArrowUpRight,
  X,
} from "lucide-react";
import { ContactLogEntry } from "@/lib/data/mock-data";

export default function ContactsPage() {
  const { contactLogs, clients, today, addContactLog } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Contact Form State
  const [formData, setFormData] = useState({
    client_id: clients[0]?.id || "",
    contact_type: "Call" as ContactLogEntry["contact_type"],
    handled_by: "Owner",
    summary: "",
    next_action: "",
    next_action_date: "2026-09-25",
  });

  const handleCreateContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.summary) return;

    const selectedClient = clients.find((c) => c.id === formData.client_id) || clients[0];

    addContactLog({
      date: today,
      client_id: selectedClient.id,
      client_name: selectedClient.name,
      contact_type: formData.contact_type,
      handled_by: formData.handled_by,
      summary: formData.summary,
      next_action: formData.next_action,
      next_action_date: formData.next_action_date,
    });

    setIsModalOpen(false);
    setFormData({
      client_id: clients[0]?.id || "",
      contact_type: "Call",
      handled_by: "Owner",
      summary: "",
      next_action: "",
      next_action_date: "2026-09-25",
    });
  };

  const filteredLogs = useMemo(() => {
    return contactLogs.filter((log) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        log.client_name.toLowerCase().includes(q) ||
        log.summary.toLowerCase().includes(q) ||
        (log.next_action && log.next_action.toLowerCase().includes(q));

      if (!matchQuery) return false;
      if (typeFilter !== "all" && log.contact_type !== typeFilter) return false;
      return true;
    });
  }, [contactLogs, searchQuery, typeFilter]);

  const typeIcons: Record<string, any> = {
    Call: Phone,
    WhatsApp: MessageCircle,
    Visit: Users,
    Meeting: Users,
    "Portfolio Review": Clock,
    "Rate Update Sent": MessageCircle,
    Greeting: MessageCircle,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">Contact Log</h1>
          <p className="text-sm text-slate">
            Chronological audit of calls, WhatsApp discussions, meetings &amp; action items.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-midnight text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-midnight/90 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Log Interaction
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-surface p-4 rounded-xl border border-slate/15 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate/50" />
          <input
            type="text"
            placeholder="Search discussion summary, client name, action item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md bg-paper/50 text-midnight focus:outline-none focus:ring-2 focus:ring-teal"
        >
          <option value="all">All Interaction Types</option>
          <option value="Call">Phone Calls</option>
          <option value="WhatsApp">WhatsApp Updates</option>
          <option value="Visit">Client / Branch Visits</option>
          <option value="Meeting">In-Person Meetings</option>
          <option value="Portfolio Review">Portfolio Reviews</option>
          <option value="Rate Update Sent">Rate Updates</option>
        </select>
      </div>

      {/* Contact Logs Table */}
      <div className="bg-surface rounded-xl border border-slate/15 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-paper/75 text-xs text-slate uppercase border-b border-slate/15 tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Discussion Summary</th>
                <th className="py-3 px-4">Next Action</th>
                <th className="py-3 px-4">Logged By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate/10 text-midnight">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate">
                    No interactions logged yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const Icon = typeIcons[log.contact_type] || Phone;
                  return (
                    <tr key={log.id} className="hover:bg-paper/40 transition-colors">
                      <td className="py-3.5 px-4 text-xs font-mono text-slate whitespace-nowrap">
                        {formatDate(log.date)}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-midnight">
                        {log.client_name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate/10 text-slate">
                          <Icon className="w-3.5 h-3.5 text-teal" />
                          {log.contact_type}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate max-w-md">
                        {log.summary}
                      </td>
                      <td className="py-3.5 px-4 text-xs">
                        {log.next_action ? (
                          <div className="font-medium text-teal flex items-center gap-1">
                            <span>{log.next_action}</span>
                            <span className="text-slate font-normal">({formatDate(log.next_action_date)})</span>
                          </div>
                        ) : (
                          <span className="text-slate/40">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate">
                        {log.handled_by}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* LOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface rounded-2xl border border-slate/20 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate/15">
              <h2 className="font-serif text-lg font-semibold text-midnight">Log Interaction</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate hover:text-midnight"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateContact} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-midnight mb-1">Client *</label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData((p) => ({ ...p, client_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.client_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Interaction Type *</label>
                <select
                  value={formData.contact_type}
                  onChange={(e) => setFormData((p) => ({ ...p, contact_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                >
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Visit">Client Visit / Branch</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Portfolio Review">Portfolio Review</option>
                  <option value="Rate Update Sent">Rate Update Sent</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Summary / Notes *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What was discussed? Lender progress, requested documents..."
                  value={formData.summary}
                  onChange={(e) => setFormData((p) => ({ ...p, summary: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Next Action Required</label>
                <input
                  type="text"
                  placeholder="e.g. Call client for sanction letter, schedule valuer"
                  value={formData.next_action}
                  onChange={(e) => setFormData((p) => ({ ...p, next_action: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Action Due Date</label>
                <input
                  type="date"
                  value={formData.next_action_date}
                  onChange={(e) => setFormData((p) => ({ ...p, next_action_date: e.target.value }))}
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
