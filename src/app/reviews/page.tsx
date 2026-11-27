"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { formatINR } from "@/lib/format";
import {
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Building2,
} from "lucide-react";

interface CaseHighlight {
  id: string;
  clientProfile: string;
  location: string;
  product: string;
  category: "all" | "hl" | "lap" | "wc" | "bl" | "bt";
  amount: number;
  lender: string;
  quote: string;
  outcome: string;
}

const CASE_HIGHLIGHTS: CaseHighlight[] = [
  {
    id: "case-1",
    clientProfile: "Steel & Hardware Trading Firm",
    location: "Raipur (C.G.)",
    product: "Working Capital Limit (Secured CC / OD)",
    category: "wc",
    amount: 15000000,
    lender: "HDFC Bank",
    quote:
      "Needed a higher working capital limit ahead of peak season. Fintara helped structure our CMA projections and moved our existing OD limit with a clean enhancement.",
    outcome: "Limit enhanced & transferred cleanly",
  },
  {
    id: "case-2",
    clientProfile: "Salaried Couple & Medical Consultant",
    location: "Shankar Nagar, Raipur",
    product: "Home Loan",
    category: "hl",
    amount: 7500000,
    lender: "State Bank of India",
    quote:
      "Our mixed income documentation made direct branch visits slow. Their team organized the co-applicant file properly and coordinated the legal valuation smoothly.",
    outcome: "Sanctioned with co-applicant pooling",
  },
  {
    id: "case-3",
    clientProfile: "Logistics & Cold Chain Operator",
    location: "Bhilai / Durg",
    product: "Unsecured Business Loan",
    category: "bl",
    amount: 4500000,
    lender: "Tata Capital",
    quote:
      "Required short-term liquidity without pledging our fleet yard. Based on our GST and bank statements, we got approval within 3 working days.",
    outcome: "Fast collateral-free disbursal",
  },
  {
    id: "case-4",
    clientProfile: "Commercial Showroom Owner",
    location: "Raipur (C.G.)",
    product: "Loan Against Property (Balance Transfer)",
    category: "bt",
    amount: 11000000,
    lender: "ICICI Bank",
    quote:
      "We were paying an elevated NBFC rate on an older mortgage. Shifting to a private bank compressed our interest outflow and provided top-up capital.",
    outcome: "Lower ROI + Top-Up sanctioned",
  },
  {
    id: "case-5",
    clientProfile: "Agro-Processing Unit",
    location: "Bilaspur (C.G.)",
    product: "Project Loan & Term Finance",
    category: "lap",
    amount: 22000000,
    lender: "Axis Bank",
    quote:
      "From machinery quotations to bank valuation coordination, having a single point of contact saved weeks of back-and-forth with branch credit officers.",
    outcome: "Term loan disbursed on schedule",
  },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "hl" | "lap" | "wc" | "bl" | "bt">("all");

  const filteredCases = CASE_HIGHLIGHTS.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  return (
    <div className="min-h-dvh bg-paper flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 py-12 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald block">
              Client Case Mandates
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-midnight tracking-tight">
              Representative Borrowing Mandates
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Examples of how retail homeowners, professionals, and MSMEs structure home loans, working capital limits, and project debt through Fintara Capital.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "All Mandates" },
              { id: "hl", label: "Home Loans" },
              { id: "wc", label: "Working Capital" },
              { id: "lap", label: "LAP / Project Loan" },
              { id: "bl", label: "Business Loans" },
              { id: "bt", label: "Balance Transfer" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                  activeTab === tab.id
                    ? "bg-midnight text-white"
                    : "bg-white text-slate-600 hover:text-midnight border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCases.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> {item.outcome}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {item.lender}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <strong className="text-midnight">{item.clientProfile}</strong>
                    <span className="font-mono font-bold text-emerald">
                      {formatINR(item.amount)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {item.product} &bull; {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-midnight rounded-2xl p-8 text-white text-center space-y-4">
            <h2 className="text-2xl font-extrabold tracking-tight">
              Need Assistance With a Similar Requirement?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Speak directly with our advisory desk for an unbiased evaluation across 18+ lenders.
            </p>
            <div className="pt-1 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact/"
                className="px-5 py-2.5 bg-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Submit Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20discuss%20a%20loan%20requirement"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/20"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Advisor</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
