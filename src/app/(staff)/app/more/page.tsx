"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  Users,
  Phone,
  Building2,
  Calculator,
  LayoutDashboard,
  DollarSign,
  UserCheck,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  Globe,
  FileCheck,
  Sparkles,
} from "lucide-react";

export default function MoreMenuPage() {
  const { profile, user, isAdmin, signOut } = useAuth();

  const deskLinks = [
    {
      title: "Clients Directory",
      desc: "Borrower CRM profiles, contact persons & DPDP consent",
      href: "/app/clients/",
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Contact History Timeline",
      desc: "Chronological log of client calls, meetings & WhatsApps",
      href: "/app/contacts/",
      icon: Phone,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Bankers Directory",
      desc: "Branch contacts, loan managers & escalation matrix",
      href: "/app/bankers/",
      icon: Building2,
      color: "text-amber-600 bg-amber-50",
    },
    {
      title: "Advisory Calculators",
      desc: "Loan EMI, borrowing capacity & balance transfer tools",
      href: "/app/tools/",
      icon: Calculator,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  const adminLinks = [
    {
      title: "Executive Admin Dashboard",
      desc: "Firm-wide pipeline volume, conversion funnel & targets",
      href: "/app/admin/dashboard/",
      icon: LayoutDashboard,
      color: "text-indigo-600 bg-indigo-50",
    },
    {
      title: "Payouts & Commissions",
      desc: "Track lender commission receivables & aging (>45d)",
      href: "/app/admin/payouts/",
      icon: DollarSign,
      color: "text-emerald-700 bg-emerald-100/60",
    },
    {
      title: "Team Management",
      desc: "Officer allocations, quotas & productivity metrics",
      href: "/app/admin/team/",
      icon: UserCheck,
      color: "text-sky-600 bg-sky-50",
    },
    {
      title: "Immutable Audit Trail",
      desc: "Detailed record of all system edits and stage changes",
      href: "/app/admin/audit/",
      icon: ShieldCheck,
      color: "text-slate-700 bg-slate-100",
    },
    {
      title: "Reports & Analytics",
      desc: "Lender approval turnaround & ticket size breakdowns",
      href: "/app/admin/reports/",
      icon: BarChart3,
      color: "text-rose-600 bg-rose-50",
    },
    {
      title: "Settings & System Controls",
      desc: "TAT SLAs, CIBIL cutoffs, CSV import & demo data purge",
      href: "/app/admin/settings/",
      icon: Settings,
      color: "text-teal bg-teal/10",
    },
  ];

  return (
    <div className="space-y-6 pb-20 max-w-2xl mx-auto">
      {/* User Session Profile Card */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-midnight text-white flex items-center justify-center font-bold text-base shadow-xs">
              {profile?.full_name ? profile.full_name.slice(0, 2).toUpperCase() : "FT"}
            </div>
            <div>
              <h2 className="font-bold text-sm text-midnight">{profile?.full_name || "Team Member"}</h2>
              <p className="text-xs text-slate font-mono">{user?.email || "staff@fintara.capital"}</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal/10 text-teal border border-teal/20">
            {profile?.role === "admin" ? "👑 Owner / Admin" : "💼 Staff Officer"}
          </span>
        </div>

        <div className="pt-2 border-t border-slate/10 flex items-center justify-between">
          <span className="text-xs text-slate">
            Status: <strong className="text-emerald-700">Active Session</strong>
          </span>
          <button
            onClick={() => signOut()}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Operational Modules */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate px-1">
          Loan Desk Modules
        </h3>
        <div className="bg-surface rounded-2xl border border-slate/15 divide-y divide-slate/10 shadow-xs overflow-hidden">
          {deskLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between p-4 hover:bg-paper/60 transition-colors group"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-midnight group-hover:text-teal block">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-slate block">{item.desc}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate/40 group-hover:text-midnight group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Admin Modules (Conditional) */}
      {isAdmin && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate">
              Management &amp; Admin Suite
            </h3>
            <span className="text-[10px] font-bold text-gold uppercase tracking-wider bg-midnight px-2 py-0.5 rounded">
              Admin Exclusive
            </span>
          </div>
          <div className="bg-surface rounded-2xl border border-slate/15 divide-y divide-slate/10 shadow-xs overflow-hidden">
            {adminLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-4 hover:bg-paper/60 transition-colors group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-midnight group-hover:text-teal block">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate block">{item.desc}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate/40 group-hover:text-midnight group-hover:translate-x-0.5 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* External / Public Links */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate px-1">
          Quick Portals
        </h3>
        <div className="bg-surface rounded-2xl border border-slate/15 divide-y divide-slate/10 shadow-xs overflow-hidden">
          <Link
            href="/"
            className="flex items-center justify-between p-4 hover:bg-paper/60 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-teal/10 text-teal flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-xs text-midnight group-hover:text-teal block">
                  Public Website
                </span>
                <span className="text-[11px] text-slate block">
                  Return to client-facing home page &amp; product guides
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate/40 group-hover:text-midnight group-hover:translate-x-0.5 transition-all" />
          </Link>
          <Link
            href="/apply/"
            className="flex items-center justify-between p-4 hover:bg-paper/60 transition-colors group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-gold/10 text-gold-dark flex items-center justify-center shrink-0">
                <FileCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-semibold text-xs text-midnight group-hover:text-teal block">
                  Borrower Eligibility Form
                </span>
                <span className="text-[11px] text-slate block">
                  Test the public loan application intake flow
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate/40 group-hover:text-midnight group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
