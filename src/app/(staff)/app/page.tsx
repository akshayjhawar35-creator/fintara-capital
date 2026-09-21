"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import { useData } from "@/lib/data/store";
import { formatINR, formatINRCompact, formatDate, formatMobile } from "@/lib/format";
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
} from "lucide-react";

export default function MyDayPage() {
  const { profile } = useAuth();
  const { leads, getFollowupAlert, today } = useData();

  const name = profile?.full_name?.split(" ")[0] || "Team Member";

  // Filter overdue and due soon leads
  const overdueLeads = leads.filter((l) => getFollowupAlert(l.next_followup_on).alert === "OVERDUE");
  const dueTodayLeads = leads.filter((l) => getFollowupAlert(l.next_followup_on).alert === "DUE TODAY");
  const dueSoonLeads = leads.filter((l) => getFollowupAlert(l.next_followup_on).alert === "DUE SOON");

  return (
    <div className="space-y-6">
      {/* Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-serif font-semibold text-midnight">
            Good morning, {name}.
          </h1>
          <p className="text-xs text-slate">
            System Date: <strong className="text-midnight">{formatDate(today)}</strong> (Asia/Kolkata) • Morning 10-minute triage routine
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-surface border border-slate/15 font-semibold text-midnight">
            Active Leads: <strong className="text-teal">{leads.length}</strong>
          </span>
        </div>
      </div>

      {/* ACTION LIST: Grouped by Urgency (Wireframe 2) */}
      <div className="space-y-6">
        {/* 1. OVERDUE SECTION (RED) */}
        {overdueLeads.length > 0 && (
          <section className="bg-surface rounded-2xl border border-red-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-red-100 pb-2.5">
              <h2 className="text-sm font-semibold text-red-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-600" />
                Overdue Follow-ups ({overdueLeads.length})
              </h2>
              <span className="text-[11px] font-semibold text-red-600 uppercase tracking-wider">
                Action Required Immediately
              </span>
            </div>

            <div className="space-y-2">
              {overdueLeads.map((lead) => {
                const { daysDiff } = getFollowupAlert(lead.next_followup_on);
                return (
                  <div
                    key={lead.id}
                    className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-red-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-red-700">{lead.lead_code}</span>
                        <span className="font-semibold text-sm text-midnight">{lead.name}</span>
                        <span className="text-xs text-slate font-medium">({lead.location_area})</span>
                      </div>
                      <div className="text-xs text-slate flex items-center gap-2">
                        <span>{lead.product_name}</span>
                        <span>•</span>
                        <span className="font-semibold tabular-nums">{formatINR(lead.amount)}</span>
                        <span>•</span>
                        <span className="text-red-700 font-semibold">Overdue by {daysDiff} day{daysDiff > 1 ? "s" : ""}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/91${lead.mobile.replace(/\D/g, "")}?text=Hello%20${encodeURIComponent(
                          lead.name
                        )},%20following%20up%20on%20your%20${encodeURIComponent(lead.product_name)}%20enquiry.`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-md bg-white border border-slate/20 text-teal hover:bg-teal/10 transition-colors"
                        title="Open WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <a
                        href={`tel:${lead.mobile}`}
                        className="p-2 rounded-md bg-white border border-slate/20 text-midnight hover:bg-slate/10 transition-colors"
                        title="Call Prospect"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                      <Link
                        href="/app/leads/"
                        className="px-3 py-1.5 text-xs font-semibold bg-midnight text-white rounded-md hover:bg-midnight/90 transition-colors"
                      >
                        Open Lead
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* 2. DUE TODAY / THIS WEEK */}
        <section className="bg-surface rounded-2xl border border-slate/15 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate/10 pb-2.5">
            <h2 className="text-sm font-semibold text-midnight flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal" />
              Follow-ups Due Today &amp; This Week ({dueTodayLeads.length + dueSoonLeads.length})
            </h2>
            <Link href="/app/leads/" className="text-xs text-teal font-semibold hover:underline">
              View All Leads &rarr;
            </Link>
          </div>

          <div className="space-y-2">
            {[...dueTodayLeads, ...dueSoonLeads].length === 0 ? (
              <div className="text-xs text-slate py-4 text-center">No other follow-ups due this week.</div>
            ) : (
              [...dueTodayLeads, ...dueSoonLeads].map((lead) => {
                const { alert, daysDiff } = getFollowupAlert(lead.next_followup_on);
                return (
                  <div
                    key={lead.id}
                    className="p-3 bg-paper rounded-xl border border-slate/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-paper/75 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-teal">{lead.lead_code}</span>
                        <span className="font-semibold text-sm text-midnight">{lead.name}</span>
                        <span className="text-xs text-slate font-medium">({lead.location_area})</span>
                      </div>
                      <div className="text-xs text-slate flex items-center gap-2">
                        <span>{lead.product_name}</span>
                        <span>•</span>
                        <span className="font-semibold tabular-nums">{formatINRCompact(lead.amount)}</span>
                        <span>•</span>
                        <span className="text-slate font-medium">
                          {alert === "DUE TODAY" ? "Due Today" : `Due in ${daysDiff} days`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/91${lead.mobile.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-md bg-white border border-slate/20 text-teal hover:bg-teal/10"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                      <Link
                        href="/app/leads/"
                        className="px-3 py-1.5 text-xs font-semibold bg-surface border border-slate/20 text-midnight rounded-md hover:bg-paper"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* 3. STUCK CASES & DISBURSALS (Pipeline Preview) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stuck Cases */}
          <div className="bg-surface rounded-2xl border border-slate/15 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate/10 pb-2">
              <h3 className="text-sm font-semibold text-midnight flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Stuck Cases (&gt; 10 days in stage)
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">
                1
              </span>
            </div>
            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-midnight">
                <span>CS-0002 • SAMPLE - Anil Verma</span>
                <span className="text-amber-800">12 days in stage</span>
              </div>
              <p className="text-slate">Home Loan Balance Transfer • Bajaj Finance</p>
              <div className="pt-1.5 text-red-700 font-semibold">Stage: Docs Collection (STUCK)</div>
            </div>
          </div>

          {/* Expected Disbursals */}
          <div className="bg-surface rounded-2xl border border-slate/15 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate/10 pb-2">
              <h3 className="text-sm font-semibold text-midnight flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-teal" />
                Upcoming Disbursals (&le; 30d)
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 text-green-800">
                1
              </span>
            </div>
            <div className="p-3 bg-green-50/50 rounded-xl border border-green-100 text-xs space-y-1">
              <div className="flex items-center justify-between font-semibold text-midnight">
                <span>CS-0001 • SAMPLE - Raipur Traders</span>
                <span className="text-green-800 font-bold tabular-nums">₹40,00,000</span>
              </div>
              <p className="text-slate">Working Capital (OD/CC) • HDFC Bank</p>
              <div className="pt-1.5 text-teal font-semibold">Expected: 25 Sep 2026 (5 days away)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
