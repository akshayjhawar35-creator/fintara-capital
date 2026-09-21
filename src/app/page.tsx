"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatINR } from "@/lib/format";

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
    <main className="min-h-dvh bg-paper text-midnight">
      <JsonLd data={faqData} type="FAQPage" />

      {/* Top Header Navigation */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate/10 sticky top-0 z-40">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/mark.svg"
              alt="Fintara Capital"
              width={38}
              height={38}
              priority
              className="h-9 w-9 rounded-xl"
            />
            <span className="font-semibold text-midnight text-lg tracking-tight">
              Fintara<span className="font-normal text-slate ml-1">Capital</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-slate">
            <Link href="/loans/secured-loans/" className="hover:text-emerald transition-colors">
              Secured Loans
            </Link>
            <Link href="/loans/unsecured-loans/" className="hover:text-emerald transition-colors">
              Unsecured Loans
            </Link>
            <Link href="/loans/personal-loan/" className="hover:text-emerald transition-colors">
              Personal Loans
            </Link>
            <Link href="/about/" className="hover:text-emerald transition-colors">
              About Us
            </Link>
            <Link href="/team/" className="hover:text-emerald transition-colors">
              Team
            </Link>
            <Link href="/articles/" className="hover:text-emerald transition-colors">
              Insights
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/apply/"
              className="bg-emerald text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-emerald/90 transition-colors shadow-2xs flex items-center gap-1"
            >
              Check Eligibility
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/auth/login/"
              className="border border-slate/20 text-midnight hover:bg-midnight hover:text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="fintech-gradient-hero text-white py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Mission & Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Globe2 className="w-3.5 h-3.5" />
              Serving Borrowers Across India &bull; Headquartered in Raipur
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.15] tracking-tight">
              Loans, Arranged Across 18+ National Lenders.
            </h1>

            <p className="text-white/80 text-sm sm:text-base max-w-xl leading-relaxed">
              We eliminate banking confusion. Our credit advisory desk compares underwriting criteria across India&apos;s leading banks to secure the highest eligibility, maximum LTV, and smoothest approval path for your profile.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/apply/"
                className="px-6 py-3 bg-gold text-midnight font-semibold rounded-xl hover:bg-gold/90 transition-all text-xs sm:text-sm flex items-center gap-2 shadow-sm"
              >
                Start Free Loan Assessment
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/loans/secured-loans/"
                className="px-5 py-3 border border-white/20 hover:bg-white/10 text-white font-medium rounded-xl transition-colors text-xs sm:text-sm"
              >
                Explore Secured Lending &rarr;
              </Link>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-white/70">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Upfront Fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Multi-Lender Advocacy</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>End-to-End Liaisoning</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Loan Need Finder Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 md:p-8 text-midnight shadow-2xl border border-white/20 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-emerald uppercase tracking-wider">
                    Interactive Loan Finder
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-paper text-slate border border-slate/15">
                    {currentConfig.type} Facility
                  </span>
                </div>
                <h2 className="font-serif text-xl font-semibold text-midnight">
                  Find the Right Loan Structure
                </h2>
              </div>

              {/* Product Selector Pills */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 p-1 bg-paper rounded-xl border border-slate/15">
                {(Object.keys(LOAN_TYPES) as LoanCategory[]).map((key) => {
                  const item = LOAN_TYPES[key];
                  const isSelected = selectedProduct === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleProductChange(key)}
                      className={`py-1.5 px-1 text-[11px] font-semibold rounded-lg transition-all truncate text-center ${
                        isSelected
                          ? "bg-midnight text-white shadow-xs"
                          : "text-slate hover:text-midnight"
                      }`}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>

              {/* Amount Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate font-medium">Requirement Amount</span>
                  <span className="text-base font-bold text-midnight font-mono tabular-nums">
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
                <div className="flex justify-between text-[10px] text-slate/70 font-mono">
                  <span>{formatINR(currentConfig.minAmount)}</span>
                  <span>{formatINR(currentConfig.maxAmount)}</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate font-medium">Repayment Tenure</span>
                  <span className="text-base font-bold text-midnight font-mono tabular-nums">
                    {tenureYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={currentConfig.maxTenureYears}
                  step={1}
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-emerald cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate/70 font-mono">
                  <span>1 Year</span>
                  <span>{currentConfig.maxTenureYears} Years</span>
                </div>
              </div>

              {/* Benefits Box */}
              <div className="p-4 bg-paper rounded-2xl border border-slate/10 space-y-2">
                <span className="text-[11px] font-semibold text-midnight uppercase tracking-wider block">
                  Tailored Benefits for {currentConfig.name}:
                </span>
                <ul className="space-y-1.5 text-xs text-slate">
                  {currentConfig.benefits.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Action */}
              <Link
                href="/apply/"
                className="w-full py-3 bg-midnight text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-midnight/90 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                Apply for {currentConfig.name} Structure
                <ArrowRight className="w-4 h-4 text-gold" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Partner Lenders Showcase */}
      <section className="bg-white border-b border-slate/15 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-3">
          <p className="text-center text-xs font-semibold text-slate uppercase tracking-wider">
            Loan Solutions Facilitated Across 18+ Premier National Financial Institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2">
            {PARTNER_BANKS.map((bank, i) => (
              <span
                key={i}
                className="px-3.5 py-1.5 bg-paper rounded-xl text-xs font-medium text-midnight border border-slate/15 shadow-2xs hover:border-emerald/30 transition-colors"
              >
                {bank}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Secured vs. Unsecured Comparison Section */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-emerald uppercase tracking-wider">
            Borrower Decision Guide
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-midnight">
            Secured vs. Unsecured: Which Fits Your Needs?
          </h2>
          <p className="text-xs sm:text-sm text-slate">
            Understanding the structural differences helps you protect business equity and optimize monthly cash flow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Secured Card */}
          <div className="fintech-card p-8 rounded-3xl space-y-6 relative overflow-hidden border-t-4 border-t-emerald">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-emerald uppercase tracking-wider">
                Asset-Backed Facilities
              </span>
              <h3 className="font-serif text-2xl font-semibold text-midnight">Secured Lending</h3>
              <p className="text-xs text-slate leading-relaxed">
                Backed by real estate collateral (Home Loan, Loan Against Property, Commercial Purchase).
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate divide-y divide-slate/10">
              <div className="pt-2 flex justify-between">
                <span className="font-medium text-midnight">Sanction Ticket Size:</span>
                <span className="font-bold text-midnight font-mono">Up to ₹15+ Crore</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="font-medium text-midnight">Repayment Tenures:</span>
                <span className="font-bold text-midnight font-mono">Up to 30 Years</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="font-medium text-midnight">Cost of Borrowing:</span>
                <span className="font-bold text-emerald font-mono">Lowest Benchmark Rates</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="font-medium text-midnight">Collateral Requirement:</span>
                <span className="font-semibold text-midnight">Residential / Commercial Property</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/loans/secured-loans/"
                className="w-full py-2.5 bg-paper hover:bg-emerald hover:text-white text-midnight font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-slate/15"
              >
                Learn More About Secured Loans &rarr;
              </Link>
            </div>
          </div>

          {/* Unsecured Card */}
          <div className="fintech-card p-8 rounded-3xl space-y-6 relative overflow-hidden border-t-4 border-t-midnight">
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate uppercase tracking-wider">
                Cashflow-Based Facilities
              </span>
              <h3 className="font-serif text-2xl font-semibold text-midnight">Unsecured Lending</h3>
              <p className="text-xs text-slate leading-relaxed">
                Backed by cash flows, banking credits, and credit track record (Business &amp; Personal Loans).
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate divide-y divide-slate/10">
              <div className="pt-2 flex justify-between">
                <span className="font-medium text-midnight">Sanction Ticket Size:</span>
                <span className="font-bold text-midnight font-mono">Up to ₹75 Lakhs</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="font-medium text-midnight">Repayment Tenures:</span>
                <span className="font-bold text-midnight font-mono">1 to 5 Years</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="font-medium text-midnight">Speed of Sanction:</span>
                <span className="font-bold text-midnight font-mono">Fast 24 to 72 Hours</span>
              </div>
              <div className="pt-2 flex justify-between">
                <span className="font-medium text-midnight">Collateral Requirement:</span>
                <span className="font-semibold text-emerald">100% Zero Collateral</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/loans/unsecured-loans/"
                className="w-full py-2.5 bg-paper hover:bg-midnight hover:text-white text-midnight font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all border border-slate/15"
              >
                Learn More About Unsecured Loans &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Checklist Banner */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="bg-surface rounded-3xl border border-slate/15 p-8 md:p-10 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-midnight text-gold flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-midnight">
                Standard Borrower Document Checklist
              </h3>
              <p className="text-xs text-slate">
                All lenders require a clean 4-pillar document bundle for appraisal
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-6 text-xs text-slate">
            <div className="p-4 bg-paper rounded-2xl border border-slate/10 space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">1. Borrower KYC</span>
              <p>PAN Card, Aadhaar / Passport for address verification, and photograph.</p>
            </div>
            <div className="p-4 bg-paper rounded-2xl border border-slate/10 space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">2. Income Verification</span>
              <p>Last 2–3 years ITR with computation, audited P&amp;L, or 3 months salary slips.</p>
            </div>
            <div className="p-4 bg-paper rounded-2xl border border-slate/10 space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">3. Bank Statements</span>
              <p>Last 6 to 12 months primary operative account and existing loan tracks.</p>
            </div>
            <div className="p-4 bg-paper rounded-2xl border border-slate/10 space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">4. Asset Deeds (If Secured)</span>
              <p>Title deed copy, sanctioned plan, and latest municipal tax receipts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Articles & Insights Preview */}
      <section className="py-12 px-4 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-midnight">
              Borrower Guides &amp; Financial Insights
            </h2>
            <p className="text-xs text-slate">Practical strategies for structuring and managing debt</p>
          </div>
          <Link
            href="/articles/"
            className="text-xs font-semibold text-emerald hover:underline flex items-center gap-1"
          >
            All Articles &rarr;
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
              Mortgage Advisory
            </span>
            <h3 className="font-serif text-base font-semibold text-midnight">
              Loan Against Property: How to Maximize LTV
            </h3>
            <p className="text-xs text-slate">
              Learn how clear title deeds and debt servicing ratios unlock 60%+ LTV without unnecessary bank cuts.
            </p>
            <Link href="/articles/" className="text-xs font-semibold text-midnight hover:text-emerald block pt-1">
              Read Guide &rarr;
            </Link>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800">
              Refinancing
            </span>
            <h3 className="font-serif text-base font-semibold text-midnight">
              Balance Transfer: The Exact Timing Formula
            </h3>
            <p className="text-xs text-slate">
              When does switching lenders save you money after accounting for processing fees and stamp duty?
            </p>
            <Link href="/articles/" className="text-xs font-semibold text-midnight hover:text-emerald block pt-1">
              Read Guide &rarr;
            </Link>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800">
              Credit Strategy
            </span>
            <h3 className="font-serif text-base font-semibold text-midnight">
              CIBIL Score: How to Maintain 750+
            </h3>
            <p className="text-xs text-slate">
              Avoid damaging multiple logins and learn how credit utilization ratios command premier loan terms.
            </p>
            <Link href="/articles/" className="text-xs font-semibold text-midnight hover:text-emerald block pt-1">
              Read Guide &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 px-4 max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-midnight flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald" />
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate">Clear answers to common loan facilitation questions</p>
        </div>

        <div className="space-y-3">
          {faqData.mainEntity.map((q, idx) => (
            <div key={idx} className="p-5 bg-surface rounded-2xl border border-slate/15 space-y-1.5 shadow-2xs">
              <h3 className="text-sm font-semibold text-midnight">{q.name}</h3>
              <p className="text-xs text-slate leading-relaxed">{q.acceptedAnswer.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-midnight text-white/70 py-16 px-4 text-xs border-t border-white/10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <Image src="/brand/mark.svg" alt="Fintara Capital" width={36} height={36} />
                <span className="font-serif text-lg font-semibold text-white">Fintara Capital</span>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-white/60">
                Authorized loan facilitation desk and mortgage advisor. Partnering with 18+ leading national banks and NBFCs across India.
              </p>
              <div className="pt-1 text-[11px] text-white/50 space-y-0.5">
                <p>📍 National Headquarters: Raipur, Chhattisgarh, India</p>
                <p>🌐 Pan-India Digital Advisory &amp; Doorstep Liaisoning</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-white font-semibold text-xs uppercase tracking-wider">Secured Loans</p>
              <ul className="space-y-1.5">
                <li><Link href="/loans/home-loan/" className="hover:text-emerald transition-colors">Home Loans</Link></li>
                <li><Link href="/loans/loan-against-property/" className="hover:text-emerald transition-colors">Loan Against Property</Link></li>
                <li><Link href="/loans/secured-loans/" className="hover:text-emerald transition-colors">Commercial Mortgages</Link></li>
                <li><Link href="/balance-transfer/" className="hover:text-emerald transition-colors">Balance Transfer</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-white font-semibold text-xs uppercase tracking-wider">Unsecured Loans</p>
              <ul className="space-y-1.5">
                <li><Link href="/loans/business-loan/" className="hover:text-emerald transition-colors">Business Loans</Link></li>
                <li><Link href="/loans/personal-loan/" className="hover:text-emerald transition-colors">Personal Loans</Link></li>
                <li><Link href="/loans/unsecured-loans/" className="hover:text-emerald transition-colors">Professional Loans</Link></li>
                <li><Link href="/calculators/emi/" className="hover:text-emerald transition-colors">EMI Calculator</Link></li>
              </ul>
            </div>

            <div className="space-y-2">
              <p className="text-white font-semibold text-xs uppercase tracking-wider">Firm &amp; Legal</p>
              <ul className="space-y-1.5">
                <li><Link href="/about/" className="hover:text-emerald transition-colors">About Us</Link></li>
                <li><Link href="/team/" className="hover:text-emerald transition-colors">Advisory Team</Link></li>
                <li><Link href="/articles/" className="hover:text-emerald transition-colors">Financial Articles</Link></li>
                <li><Link href="/privacy/" className="hover:text-emerald transition-colors">Privacy Policy (DPDP)</Link></li>
                <li><Link href="/terms/" className="hover:text-emerald transition-colors">Terms of Service</Link></li>
                <li><Link href="/auth/login/" className="text-gold hover:underline font-semibold">Portal Login &rarr;</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
            <p>&copy; {new Date().getFullYear()} Fintara Capital. All rights reserved.</p>
            <p className="text-center sm:text-right max-w-xl">
              Fintara Capital is a loan facilitator and credit advisory intermediary (Direct Selling Agent), not a bank or lender. All loan sanctions, terms, and disbursals are solely at the statutory discretion of partner financing institutions.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
