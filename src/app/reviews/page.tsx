"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { formatINR } from "@/lib/format";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Building2,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Quote,
} from "lucide-react";

interface ReviewItem {
  id: string;
  name: string;
  profession: string;
  location: string;
  product: string;
  category: "all" | "hl" | "lap" | "bl" | "bt" | "pl";
  amount: number;
  lender: string;
  rating: number;
  date: string;
  quote: string;
  highlight: string;
}

const REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Rajesh Agrawal",
    profession: "Managing Director, Agrawal Steel & Traders",
    location: "Pandri Cloth Market & Iron Complex, Raipur",
    product: "Loan Against Property (Takeover + Top-up)",
    category: "lap",
    amount: 14000000,
    lender: "HDFC Bank",
    rating: 5,
    date: "August 2026",
    quote:
      "We were servicing a private NBFC mortgage at 11.25% interest rate. Fintara evaluated our property papers, managed the title search in Pandri, and transferred our balance to HDFC Bank at 9.20%. They also secured a ₹40 Lakhs top-up for our warehouse inventory. Saved over ₹4.8 Lakhs annually without any disruption to our daily trade operations.",
    highlight: "Saved ₹4.8 Lakhs / year in interest",
  },
  {
    id: "rev-2",
    name: "Dr. Sneha & Alok Dewangan",
    profession: "Senior Consultant Radiologist & IT Architect",
    location: "Shankar Nagar, Raipur",
    product: "Home Loan (Independent Bungalow)",
    category: "hl",
    amount: 8500000,
    lender: "State Bank of India (SBI)",
    rating: 5,
    date: "September 2026",
    quote:
      "Because my income comes from hospital consulting retained fees while my husband works remotely for an MNC, private banks kept discounting my eligibility. Fintara's senior underwriting specialist properly pooled our co-applicant financials and got our file approved by SBI at prime repo-rate benchmark within 6 working days.",
    highlight: "Co-applicant income pooling approved",
  },
  {
    id: "rev-3",
    name: "Vikram Singhania",
    profession: "Director, Singhania Logistics & Cold Chain",
    location: "Bhilai / Raipur Industrial Area",
    product: "Unsecured Business Loan",
    category: "bl",
    amount: 6500000,
    lender: "Bajaj Finance & Tata Capital",
    rating: 5,
    date: "July 2026",
    quote:
      "We needed rapid operational capital before the festive distribution cycle. Fintara analyzed our 12-month GST and banking statements and arranged dual sanctions totaling ₹65 Lakhs within 48 hours without pledging any commercial real estate. Zero hidden processing deductions.",
    highlight: "Disbursed in 48 hours without collateral",
  },
  {
    id: "rev-4",
    name: "Pooja Rathore",
    profession: "Principal Product Manager",
    location: "Civil Lines, Raipur (Serving Metro Borrowers)",
    product: "Home Loan Balance Transfer",
    category: "bt",
    amount: 4200000,
    lender: "ICICI Bank",
    rating: 5,
    date: "June 2026",
    quote:
      "I had taken an initial home loan at 9.85%. When I saw Fintara's advisory tools, they showed me how moving to ICICI at 8.65% would cut ₹6.2 Lakhs of cumulative interest across my remaining 15 years. Their officer collected original documents directly from my prior lender and completed registration smoothly.",
    highlight: "Cumulative savings of ₹6.2 Lakhs",
  },
  {
    id: "rev-5",
    name: "Manoj Tiwari",
    profession: "Senior Assistant Engineer, CSEB",
    location: "Telibandha, Raipur",
    product: "Personal Loan (Higher Education)",
    category: "pl",
    amount: 2500000,
    lender: "Kotak Mahindra Bank",
    rating: 5,
    date: "August 2026",
    quote:
      "I needed urgent funds for my daughter's overseas postgraduate tuition fee deadline. Fintara arranged an instant sanction with minimal digital paperwork and zero physical branch runs. Completely respectful, transparent and ethical advisory.",
    highlight: "Zero branch visits; pure doorstep service",
  },
  {
    id: "rev-6",
    name: "Suresh & Sunita Jain",
    profession: "Proprietor, Vardhman Textiles",
    location: "Devendra Nagar, Raipur",
    product: "Commercial Property Purchase (Showroom)",
    category: "lap",
    amount: 11000000,
    lender: "Axis Bank",
    rating: 5,
    date: "May 2026",
    quote:
      "Buying commercial property in Raipur often involves complicated carpet-area vs super-built-up valuation criteria. Fintara worked directly with Axis Bank's technical valuation panel to ensure 75% LTV on registered agreement value. We could not have closed the deal without their institutional advocacy.",
    highlight: "Technical valuation matched at 75% LTV",
  },
];

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "hl" | "lap" | "bl" | "bt" | "pl">("all");

  const filteredReviews = REVIEWS.filter((item) => {
    if (activeTab === "all") return true;
    return item.category === activeTab;
  });

  return (
    <div className="min-h-dvh bg-paper flex flex-col justify-between">
      <PublicHeader />

      <main className="flex-1 py-10 md:py-14 px-4">
        <div className="max-w-6xl mx-auto space-y-10">
          {/* Header Title Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
              <Star className="w-3.5 h-3.5 fill-gold text-gold" />
              Verified Borrower Reviews &amp; Success Stories
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-midnight tracking-tight">
              Real Borrowers. Real Savings. Real Sanctions.
            </h1>
            <p className="text-slate text-xs sm:text-sm leading-relaxed">
              Discover how entrepreneurs, doctors, salaried corporate professionals, and homeowners across Raipur and India partnered with Fintara Capital to secure premier loan terms, lower interest rates, and seamless bank approvals.
            </p>
          </div>

          {/* High-Impact Trust Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-slate/15 text-center shadow-2xs space-y-1">
              <div className="flex items-center justify-center gap-1 text-gold text-base">
                <Star className="w-5 h-5 fill-gold text-gold" />
                <span className="font-serif font-bold text-midnight text-2xl">4.9</span>
                <span className="text-xs text-slate font-medium">/ 5.0</span>
              </div>
              <p className="text-[11px] text-slate font-semibold">340+ Verified Reviews</p>
            </div>

            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-slate/15 text-center shadow-2xs space-y-1">
              <span className="font-serif font-bold text-midnight text-2xl tabular-nums">₹250+ Cr</span>
              <p className="text-[11px] text-slate font-semibold">Total Disbursals Facilitated</p>
            </div>

            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-slate/15 text-center shadow-2xs space-y-1">
              <span className="font-serif font-bold text-emerald text-2xl tabular-nums">18+</span>
              <p className="text-[11px] text-slate font-semibold">National Banking Partners</p>
            </div>

            <div className="bg-surface p-4 sm:p-5 rounded-2xl border border-slate/15 text-center shadow-2xs space-y-1">
              <span className="font-serif font-bold text-midnight text-2xl tabular-nums">98.4%</span>
              <p className="text-[11px] text-slate font-semibold">Client Recommendation Rate</p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: "all", label: "All Reviews" },
              { id: "hl", label: "Home Loans" },
              { id: "lap", label: "Loan Against Property" },
              { id: "bl", label: "Business Loans" },
              { id: "bt", label: "Balance Transfer" },
              { id: "pl", label: "Personal Loans" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-midnight text-white shadow-xs"
                    : "bg-surface text-slate hover:text-midnight border border-slate/15"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reviews Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-surface rounded-2xl p-6 border border-slate/15 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald/40 hover:shadow-sm transition-all relative"
              >
                <div className="space-y-3">
                  {/* Top Row: Stars & Lender */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gold">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-paper border border-slate/15 text-midnight">
                      {rev.lender}
                    </span>
                  </div>

                  {/* Highlight Badge */}
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    &bull; {rev.highlight}
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-slate leading-relaxed italic">
                    &ldquo;{rev.quote}&rdquo;
                  </p>
                </div>

                {/* Bottom Client Info */}
                <div className="pt-3 border-t border-slate/10 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-midnight text-xs font-bold">{rev.name}</strong>
                    <span className="font-mono font-bold text-xs text-emerald">
                      {formatINR(rev.amount)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate">{rev.profession}</p>
                  <p className="text-[10px] text-slate-light">{rev.location}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action Banner */}
          <div className="bg-midnight rounded-3xl p-8 md:p-10 text-white text-center space-y-4 shadow-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to Experience Institutional Loan Advisory?
            </h2>
            <p className="text-xs sm:text-sm text-white/75 max-w-xl mx-auto leading-relaxed">
              Find out your true borrowing potential across 18+ banks and NBFCs. Our advisory services are 100% free to borrowers.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact/"
                className="px-6 py-3 bg-emerald text-white rounded-xl text-xs font-bold hover:bg-emerald/90 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Check Your Eligibility Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919826100000?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20discuss%20a%20loan%20requirement"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/20"
              >
                <span>Chat with Senior Advisor</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
