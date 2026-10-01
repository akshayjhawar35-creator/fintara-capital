"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatINR } from "@/lib/format";
import {
  ShieldCheck,
  Building2,
  Home,
  Briefcase,
  UserCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  BookOpen,
  Users,
  Compass,
  FileCheck,
  ChevronRight,
  TrendingDown,
  Globe2,
  Star,
  Percent,
  Check,
  MessageCircle,
} from "lucide-react";

type LoanCategory = "hl" | "lap" | "bl" | "pl" | "bt";

interface LoanTypeConfig {
  id: LoanCategory;
  name: string;
  type: "Secured" | "Unsecured" | "Refinance";
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  defaultTenureYears: number;
  maxTenureYears: number;
  benefits: string[];
  bestFor: string;
  link: string;
}

const LOAN_TYPES: Record<LoanCategory, LoanTypeConfig> = {
  hl: {
    id: "hl",
    name: "Home Loan",
    type: "Secured",
    defaultAmount: 4500000,
    minAmount: 1000000,
    maxAmount: 50000000,
    stepAmount: 500000,
    defaultTenureYears: 20,
    maxTenureYears: 30,
    benefits: [
      "Tenures up to 30 years for manageable monthly EMIs",
      "Financing up to 80–90% of registered agreement value",
      "Co-applicant pooling for maximum borrowing eligibility",
      "Tax deduction benefits under Section 80C and Section 24(b)",
    ],
    bestFor: "Apartment purchase, plot + construction, independent house, or resale",
    link: "/loans/home-loan/",
  },
  lap: {
    id: "lap",
    name: "Loan Against Property",
    type: "Secured",
    defaultAmount: 7500000,
    minAmount: 2000000,
    maxAmount: 150000000,
    stepAmount: 1000000,
    defaultTenureYears: 15,
    maxTenureYears: 20,
    benefits: [
      "High-ticket sanctions up to ₹15+ Crore based on property valuation",
      "Substantially lower borrowing cost than unsecured business credit",
      "Tenures up to 15–20 years that protect operational business liquidity",
      "Accepted on residential, commercial offices, and industrial premises",
    ],
    bestFor: "Business expansion, long-term working capital, or debt consolidation",
    link: "/loans/loan-against-property/",
  },
  bl: {
    id: "bl",
    name: "Business Loan",
    type: "Unsecured",
    defaultAmount: 2500000,
    minAmount: 500000,
    maxAmount: 7500000,
    stepAmount: 250000,
    defaultTenureYears: 3,
    maxTenureYears: 5,
    benefits: [
      "100% collateral-free sanction based on banking and GST turnover",
      "Fast-track processing with disbursals within 48 to 72 hours",
      "Multipliers structured on gross profit and banking credit velocity",
      "Zero lien on business equipment or real estate assets",
    ],
    bestFor: "Inventory stocking, seasonal vendor payments, and operational liquidity",
    link: "/loans/business-loan/",
  },
  pl: {
    id: "pl",
    name: "Personal Loan",
    type: "Unsecured",
    defaultAmount: 800000,
    minAmount: 100000,
    maxAmount: 4000000,
    stepAmount: 100000,
    defaultTenureYears: 4,
    maxTenureYears: 5,
    benefits: [
      "Fast 24-hour approval with streamlined digital KYC",
      "No security, guarantor, or fixed deposit pledge needed",
      "Flexible tenures from 1 to 5 years with auto-debit facilities",
      "Freedom of end-use: medical, education, family milestones, or debt payoff",
    ],
    bestFor: "Salaried employees and practicing professionals needing rapid capital",
    link: "/loans/personal-loan/",
  },
  bt: {
    id: "bt",
    name: "Balance Transfer",
    type: "Refinance",
    defaultAmount: 5000000,
    minAmount: 1500000,
    maxAmount: 100000000,
    stepAmount: 500000,
    defaultTenureYears: 15,
    maxTenureYears: 25,
    benefits: [
      "Reduce your existing interest rate by migrating to a competitive lender",
      "Unlock substantial additional top-up funds at primary loan rates",
      "Significant cumulative interest savings over remaining tenure",
      "End-to-end documentation & foreclosure coordination handled by Fintara",
    ],
    bestFor: "Borrowers with active loans older than 6 months paying above-market rates",
    link: "/balance-transfer/",
  },
};

const PARTNER_BANKS = [
  "HDFC Bank",
  "State Bank of India",
  "ICICI Bank",
  "Bajaj Finance",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Tata Capital",
  "IDFC First Bank",
  "Bank of Baroda",
  "Punjab National Bank",
];

export default function HomePage() {
  const [selectedProduct, setSelectedProduct] = useState<LoanCategory>("hl");
  const [amount, setAmount] = useState<number>(LOAN_TYPES.hl.defaultAmount);
  const [tenureYears, setTenureYears] = useState<number>(LOAN_TYPES.hl.defaultTenureYears);

  const currentConfig = LOAN_TYPES[selectedProduct];

  const handleProductChange = (newProd: LoanCategory) => {
    setSelectedProduct(newProd);
    setAmount(LOAN_TYPES[newProd].defaultAmount);
    setTenureYears(LOAN_TYPES[newProd].defaultTenureYears);
  };

  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does Fintara Capital do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fintara Capital is an institutional loan advisory and Direct Selling Agent (DSA) desk partnering with 18+ leading national banks and NBFCs across India. We evaluate your financial profile, compare underwriting criteria across lenders, structure your loan to maximize sanction limits, and manage the entire liaisoning process through disbursal with zero upfront fees.",
        },
      },
      {
        "@type": "Question",
        name: "Does Fintara Capital serve clients only in Raipur or all of India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "While Fintara Capital is proudly headquartered in Raipur, Chhattisgarh, our digital loan advisory desk and institutional banking network serve retail, SME, and commercial borrowers across all major cities and states in India.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between secured and unsecured loans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Secured loans (Home Loans, Loan Against Property) are backed by real estate collateral, offering lower interest costs, multi-crore sanction sizes, and long repayment tenures up to 30 years. Unsecured loans (Business Loans, Personal Loans) require zero asset pledging and are evaluated purely on banking turnover, cash flow, and CIBIL score, offering fast disbursal within 24 to 72 hours.",
        },
      },
      {
        "@type": "Question",
        name: "Do borrowers pay any advisory fee to Fintara Capital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Borrowers never pay Fintara an advisory fee. Our services are 100% free to borrowers. We are compensated directly by our institutional lending partners upon successful loan disbursal.",
        },
      },
      {
        "@type": "Question",
        name: "How does Fintara Capital protect borrower data under the DPDP Act 2023?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We follow strict data minimization and affirmative consent protocols under India's Digital Personal Data Protection (DPDP) Act 2023. We never store raw PAN or Aadhaar numbers in unsecured databases, and your financial papers are shared only with the specific lending institutions you explicitly authorize.",
        },
      },
    ],
  };

  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <JsonLd data={faqData} type="FAQPage" />

      {/* Unified Public Header (NO LOGIN BUTTON) */}
      <PublicHeader />

      <main className="flex-1 space-y-10 md:space-y-14">
        {/* 1. Hero Section with 3D Interactive Card & Perspective Depth */}
        <section className="fintech-gradient-hero text-white py-12 md:py-16 px-4 relative overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Mission & Value Proposition */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Globe2 className="w-3.5 h-3.5" />
                Serving Borrowers Across India &bull; Headquartered in Raipur (C.G.)
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-bold leading-[1.15] tracking-tight">
                Loans, Arranged Across 18+ National Lenders.
              </h1>

              <p className="text-white/80 text-xs sm:text-sm max-w-xl leading-relaxed">
                We eliminate banking confusion and high borrowing costs. Our institutional loan desk compares underwriting policies across India&apos;s leading banks and NBFCs to secure the highest eligibility, maximum LTV, and smoothest approval path for your profile.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/contact/"
                  className="px-6 py-3 bg-emerald text-white font-bold rounded-xl hover:bg-emerald/90 transition-all text-xs sm:text-sm flex items-center gap-2 shadow-xs active:scale-98"
                >
                  <span>Start Free Loan Assessment</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/loans/secured-loans/"
                  className="px-5 py-3 border border-white/20 hover:bg-white/10 text-white font-medium rounded-xl transition-colors text-xs sm:text-sm"
                >
                  Explore Secured Mortgages &rarr;
                </Link>
              </div>

              {/* Fast Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs text-white/70">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">Zero Upfront Fees</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">18+ Banking Partners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">Doorstep Liaisoning</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Perspective Interactive Loan Finder */}
            <div className="lg:col-span-5 relative perspective-1000">
              {/* Floating 3D Badge */}
              <div className="absolute -top-4 -right-2 z-20 floating-3d hidden sm:flex items-center gap-2 bg-midnight/90 text-white px-3.5 py-1.5 rounded-full border border-gold/40 shadow-xl text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>₹250+ Cr Disbursed</span>
              </div>

              {/* 3D Glass Hero Card */}
              <div className="bg-white rounded-3xl p-6 text-midnight shadow-2xl border border-white/20 space-y-5 hero-3d-card">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-emerald uppercase tracking-wider">
                      Interactive Loan Selector
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-paper text-slate border border-slate/15">
                      {currentConfig.type} Facility
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-midnight">
                    Find Your Ideal Loan Structure
                  </h2>
                </div>

                {/* Product Selector Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 p-1 bg-paper rounded-xl border border-slate/15">
                  {(Object.keys(LOAN_TYPES) as LoanCategory[]).map((key) => {
                    const item = LOAN_TYPES[key];
                    const isSelected = selectedProduct === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleProductChange(key)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-bold transition-all text-center ${
                          isSelected
                            ? "bg-midnight text-white shadow-xs"
                            : "text-slate hover:text-midnight hover:bg-white"
                        }`}
                      >
                        {item.name.replace(" Loan", "")}
                      </button>
                    );
                  })}
                </div>

                {/* Amount Slider */}
                <div className="space-y-1.5 bg-paper/60 p-3.5 rounded-2xl border border-slate/15">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate font-medium">Requested Capital</span>
                    <span className="font-mono text-base font-bold text-emerald">
                      {formatINR(amount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={currentConfig.minAmount}
                    max={currentConfig.maxAmount}
                    step={currentConfig.stepAmount}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full accent-emerald cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate font-medium">
                    <span>Min: {formatINR(currentConfig.minAmount)}</span>
                    <span>Max: {formatINR(currentConfig.maxAmount)}</span>
                  </div>
                </div>

                {/* Key Product Advantages */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate block">
                    Why Borrowers Choose This:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate">
                    {currentConfig.benefits.slice(0, 3).map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action Link */}
                <div className="pt-2 border-t border-slate/10 flex items-center justify-between">
                  <Link
                    href={`/contact/?product=${encodeURIComponent(currentConfig.name)}`}
                    className="w-full py-2.5 px-4 bg-midnight hover:bg-midnight/90 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <span>Check Eligibility for {currentConfig.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-gold" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Compact High-Density Value Metrics Bar (No dead space) */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-surface border border-slate/15 shadow-2xs space-y-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-midnight block">
                18+ Lenders
              </span>
              <p className="text-[11px] text-slate font-medium leading-snug">
                Direct institutional tie-ups with PSU, Private Banks &amp; Premier NBFCs.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-slate/15 shadow-2xs space-y-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-emerald block">
                ₹250+ Crore
              </span>
              <p className="text-[11px] text-slate font-medium leading-snug">
                Cumulative mortgage and business loan volume successfully arranged.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-slate/15 shadow-2xs space-y-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-midnight block">
                48h Fast TAT
              </span>
              <p className="text-[11px] text-slate font-medium leading-snug">
                Rapid in-principle sanctions with dedicated doorstep document processing.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-surface border border-slate/15 shadow-2xs space-y-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold text-midnight block">
                Zero Fees
              </span>
              <p className="text-[11px] text-slate font-medium leading-snug">
                100% free loan advisory, market comparison, and bank liaisoning for clients.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Comprehensive Loan Products Suite (3D Tilt Cards) */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate/15 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald block mb-1">
                Institutional Portfolio
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-midnight">
                Structured Loan Products
              </h2>
            </div>
            <Link
              href="/contact/"
              className="text-xs font-bold text-emerald hover:underline flex items-center gap-1"
            >
              <span>Submit General Loan Enquiry</span> &rarr;
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Home Loan Card */}
            <div className="bg-surface rounded-2xl p-5 border border-slate/15 shadow-xs space-y-4 tilt-card-3d flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-midnight">Home Loans</h3>
                  <span className="text-[11px] text-slate block mt-0.5">
                    Purchase, Plot + Construction &amp; Resale
                  </span>
                </div>
                <p className="text-xs text-slate leading-relaxed">
                  Financing up to 85% of property value with tenures up to 30 years and co-applicant pooling for maximum eligibility.
                </p>
              </div>
              <div className="pt-3 border-t border-slate/10 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-midnight">Up to ₹5 Cr</span>
                <Link href="/loans/home-loan/" className="font-bold text-emerald hover:underline">
                  Details &rarr;
                </Link>
              </div>
            </div>

            {/* Loan Against Property (LAP) Card */}
            <div className="bg-surface rounded-2xl p-5 border border-slate/15 shadow-xs space-y-4 tilt-card-3d flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-midnight/10 text-midnight flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-midnight">Loan Against Property</h3>
                  <span className="text-[11px] text-slate block mt-0.5">
                    Residential &amp; Commercial Mortgages
                  </span>
                </div>
                <p className="text-xs text-slate leading-relaxed">
                  Unlock high liquidity against registered property with 15–20 year tenures at substantially lower rates than unsecured debt.
                </p>
              </div>
              <div className="pt-3 border-t border-slate/10 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-midnight">Up to ₹15 Cr</span>
                <Link href="/loans/loan-against-property/" className="font-bold text-emerald hover:underline">
                  Details &rarr;
                </Link>
              </div>
            </div>

            {/* Business Loan Card */}
            <div className="bg-surface rounded-2xl p-5 border border-slate/15 shadow-xs space-y-4 tilt-card-3d flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-midnight">Business Loans</h3>
                  <span className="text-[11px] text-slate block mt-0.5">
                    100% Collateral-Free SME Credit
                  </span>
                </div>
                <p className="text-xs text-slate leading-relaxed">
                  Fast 48-hour sanctions based on banking cash flow and GST turnover multipliers without encumbering business assets.
                </p>
              </div>
              <div className="pt-3 border-t border-slate/10 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-midnight">Up to ₹75 Lakhs</span>
                <Link href="/loans/business-loan/" className="font-bold text-emerald hover:underline">
                  Details &rarr;
                </Link>
              </div>
            </div>

            {/* Personal Loan Card */}
            <div className="bg-surface rounded-2xl p-5 border border-slate/15 shadow-xs space-y-4 tilt-card-3d flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-midnight">Personal Loans</h3>
                  <span className="text-[11px] text-slate block mt-0.5">
                    Salaried &amp; Professional Credit
                  </span>
                </div>
                <p className="text-xs text-slate leading-relaxed">
                  Rapid 24-hour disbursal with minimal digital paperwork for practicing doctors, corporate staff, and professionals.
                </p>
              </div>
              <div className="pt-3 border-t border-slate/10 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-midnight">Up to ₹40 Lakhs</span>
                <Link href="/loans/personal-loan/" className="font-bold text-emerald hover:underline">
                  Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. The 4-Step Loan Facilitation Lifecycle Timeline (Even Space, Zero Dead Gaps) */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald block">
              Transparent Advisory Workflow
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-midnight">
              From Enquiry to Disbursal in 4 Steps
            </h2>
            <p className="text-xs text-slate">
              How our Raipur loan desk liaisons with national institutions on your behalf.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-surface border border-slate/15 shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-midnight text-white flex items-center justify-center font-bold text-xs font-mono">
                01
              </div>
              <h3 className="font-serif text-base font-bold text-midnight">
                Profile &amp; Eligibility Audit
              </h3>
              <p className="text-xs text-slate leading-relaxed">
                We review your ITR, bank statements, existing obligations, and credit history to diagnose your true borrowing headroom.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-slate/15 shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center font-bold text-xs font-mono">
                02
              </div>
              <h3 className="font-serif text-base font-bold text-midnight">
                Multi-Lender Comparison
              </h3>
              <p className="text-xs text-slate leading-relaxed">
                We benchmark your profile across Banks, NBFCs, and HFCs to identify the lowest rate, highest LTV, and minimal fees.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-slate/15 shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-midnight text-white flex items-center justify-center font-bold text-xs font-mono">
                03
              </div>
              <h3 className="font-serif text-base font-bold text-midnight">
                Fast-Track In-Principle Sanction
              </h3>
              <p className="text-xs text-slate leading-relaxed">
                Our underwriters structure your application file to clear credit committee queries swiftly without multiple rejections.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-slate/15 shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center font-bold text-xs font-mono">
                04
              </div>
              <h3 className="font-serif text-base font-bold text-midnight">
                Disbursal &amp; Lifecycle Care
              </h3>
              <p className="text-xs text-slate leading-relaxed">
                We manage legal title clearance, banker coordination, and subsequent 6-month portfolio reviews for rate reduction.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Institutional Lender Ecosystem Matrix (Informative & Authoritative) */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-slate/15 shadow-xs space-y-6">
            <div className="max-w-2xl space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald block">
                Fintech Advisory Guide
              </span>
              <h2 className="font-serif text-2xl font-bold text-midnight">
                Understanding Lender Types: Which Institution Fits You?
              </h2>
              <p className="text-xs text-slate leading-relaxed">
                Different financial institutions serve different borrower profiles. Fintara directs your file to the category that offers you the highest probability of approval.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-paper border border-slate/15 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald"></span>
                  <strong className="text-midnight text-sm">Commercial Banks (PSU &amp; Private)</strong>
                </div>
                <p className="text-slate leading-relaxed">
                  <strong>Best for:</strong> Borrowers with clean CIBIL scores (750+), formal audited ITRs, and standard property titles.
                </p>
                <div className="text-[11px] text-emerald font-semibold">
                  &bull; Lowest repo-rate linked ROI &bull; Longest 30-year tenures
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-paper border border-slate/15 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-midnight"></span>
                  <strong className="text-midnight text-sm">Non-Banking Financial Co. (NBFCs)</strong>
                </div>
                <p className="text-slate leading-relaxed">
                  <strong>Best for:</strong> Business owners, traders, and borrowers needing faster 48h turnaround or higher banking multiplier multipliers.
                </p>
                <div className="text-[11px] text-midnight font-semibold">
                  &bull; Flexible cash-flow underwriting &bull; Higher LTV allowances
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-paper border border-slate/15 space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gold"></span>
                  <strong className="text-midnight text-sm">Housing Finance Companies (HFCs)</strong>
                </div>
                <p className="text-slate leading-relaxed">
                  <strong>Best for:</strong> Real estate purchases, self-construction on Lal Dora or Gram Panchayat land, and specialized property titles.
                </p>
                <div className="text-[11px] text-slate font-semibold">
                  &bull; High technical valuation LTV &bull; Customized title clearance
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Real Client Success Stories & Reviews Snippet */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate/15 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald block mb-1">
                Verified Client Testimonials
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-midnight">
                What Our Borrowers Say
              </h2>
            </div>
            <Link
              href="/reviews/"
              className="text-xs font-bold text-emerald hover:underline flex items-center gap-1"
            >
              <span>View All 340+ Client Reviews</span> &rarr;
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-surface rounded-2xl p-5 border border-slate/15 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate leading-relaxed italic">
                  &ldquo;Transferred our LAP from 11.25% to HDFC at 9.20% and unlocked ₹40L extra working capital. Fintara handled everything without disrupting our business.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate/10 text-xs">
                <strong className="text-midnight block">Rajesh Agrawal</strong>
                <span className="text-[11px] text-slate">Agrawal Steel &bull; Pandri, Raipur</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-slate/15 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate leading-relaxed italic">
                  &ldquo;As a practicing doctor, my consulting income documentation was complex. Fintara pooled our co-applicant file and got SBI sanction in 5 days.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate/10 text-xs">
                <strong className="text-midnight block">Dr. Sneha Dewangan</strong>
                <span className="text-[11px] text-slate">Consultant Radiologist &bull; Shankar Nagar</span>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-slate/15 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate leading-relaxed italic">
                  &ldquo;Arranged ₹65 Lakhs unsecured business loan within 48 hours for our festive inventory orders. Transparent, dignified, and fast service.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate/10 text-xs">
                <strong className="text-midnight block">Vikram Singhania</strong>
                <span className="text-[11px] text-slate">Singhania Logistics &bull; Bhilai / Raipur</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Institutional Partner Banks Ticker */}
        <section className="max-w-6xl mx-auto px-4 py-2">
          <div className="bg-surface rounded-2xl p-5 border border-slate/15 shadow-2xs space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate block text-center">
              Lending Ecosystem &bull; Active Underwriting Relationships
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {PARTNER_BANKS.map((b, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-paper border border-slate/15 text-midnight font-semibold text-xs shadow-2xs"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FAQs Section (High Information Density) */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald block">
              Borrower FAQs
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-midnight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate">Clear answers to common loan facilitation inquiries</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {faqData.mainEntity.map((q, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 bg-surface rounded-2xl border border-slate/15 space-y-1.5 shadow-2xs"
              >
                <h3 className="text-xs sm:text-sm font-bold text-midnight flex items-start gap-2">
                  <span className="text-emerald font-bold">&bull;</span>
                  <span>{q.name}</span>
                </h3>
                <p className="text-xs text-slate leading-relaxed pl-3">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Final High-Conversion Action Banner */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="bg-midnight rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-xl">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to Secure the Best Loan Structure for Your Profile?
            </h2>
            <p className="text-xs sm:text-sm text-white/75 max-w-xl mx-auto leading-relaxed">
              Submit your enquiry in 60 seconds. Our credit underwriters will evaluate your file across 18+ lenders with zero consultation fees.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact/"
                className="px-6 py-3 bg-emerald text-white rounded-xl text-xs font-bold hover:bg-emerald/90 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <span>Submit Loan Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919826100000?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/20"
              >
                <MessageCircle className="w-4 h-4 text-emerald-light" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Unified Public Footer with Social Media & No Login Link */}
      <PublicFooter />
    </div>
  );
}
