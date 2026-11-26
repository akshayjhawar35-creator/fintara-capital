"use client";

import React, { useState, useMemo } from "react";
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
  ChevronRight,
  TrendingDown,
  Globe2,
  Star,
  Percent,
  Check,
  MessageCircle,
  Calculator,
  ArrowUpRight,
  CheckCircle,
  XCircle,
  BadgePercent,
  Layers,
  Banknote,
  Award,
} from "lucide-react";

type LoanCategory = "hl" | "lap" | "bl" | "pl" | "bt";

interface LoanTypeConfig {
  id: LoanCategory;
  name: string;
  tagline: string;
  type: "Secured" | "Unsecured" | "Refinance";
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  defaultTenureYears: number;
  maxTenureYears: number;
  benchmarkRate: number; // e.g. 8.5
  marketRate: number; // e.g. 9.25
  benefits: string[];
  bestFor: string;
  link: string;
}

const LOAN_TYPES: Record<LoanCategory, LoanTypeConfig> = {
  hl: {
    id: "hl",
    name: "Home Loan",
    tagline: "Purchase, Plot + Construction & Resale Mortgages",
    type: "Secured",
    defaultAmount: 5000000,
    minAmount: 1000000,
    maxAmount: 50000000,
    stepAmount: 500000,
    defaultTenureYears: 20,
    maxTenureYears: 30,
    benchmarkRate: 8.5,
    marketRate: 9.3,
    benefits: [
      "Tenures up to 30 years for manageable monthly cash flow",
      "Financing up to 80–90% of registered agreement value",
      "Co-applicant pooling for maximum borrowing eligibility",
      "Income tax deductions under Section 80C & Section 24(b)",
    ],
    bestFor: "Apartment purchase, plot + construction, independent bungalow, or resale",
    link: "/loans/home-loan/",
  },
  lap: {
    id: "lap",
    name: "Loan Against Property",
    tagline: "Commercial & Residential High-Liquidity Equity",
    type: "Secured",
    defaultAmount: 10000000,
    minAmount: 2000000,
    maxAmount: 150000000,
    stepAmount: 1000000,
    defaultTenureYears: 15,
    maxTenureYears: 20,
    benchmarkRate: 9.25,
    marketRate: 10.45,
    benefits: [
      "High-ticket sanctions up to ₹15+ Crore based on property valuation",
      "Substantially lower cost of capital than unsecured business debt",
      "Tenures up to 15–20 years protecting operating liquidity",
      "Accepted on self-occupied residential, commercial, or industrial units",
    ],
    bestFor: "Business expansion, long-term working capital, or high-cost debt consolidation",
    link: "/loans/loan-against-property/",
  },
  bl: {
    id: "bl",
    name: "Business Loan",
    tagline: "100% Collateral-Free SME Working Capital",
    type: "Unsecured",
    defaultAmount: 2500000,
    minAmount: 500000,
    maxAmount: 7500000,
    stepAmount: 250000,
    defaultTenureYears: 3,
    maxTenureYears: 5,
    benchmarkRate: 13.5,
    marketRate: 15.5,
    benefits: [
      "Zero asset pledging; evaluated purely on GST and bank turnover",
      "Fast 48-hour sanctions with minimal digital paperwork",
      "Flexible overdraft or EMI term credit structures",
      "No mortgage, lien, or third-party guarantor required",
    ],
    bestFor: "Seasonal inventory stocking, vendor bill clearing, and cash-flow smoothing",
    link: "/loans/business-loan/",
  },
  pl: {
    id: "pl",
    name: "Personal Loan",
    tagline: "Instant Capital for Salaried & Corporate Professionals",
    type: "Unsecured",
    defaultAmount: 1000000,
    minAmount: 100000,
    maxAmount: 4000000,
    stepAmount: 100000,
    defaultTenureYears: 4,
    maxTenureYears: 5,
    benchmarkRate: 10.75,
    marketRate: 12.5,
    benefits: [
      "Swift 24-hour disbursal with paperless e-KYC",
      "Zero collateral or co-signer requirements",
      "Flexible repayment tenures from 12 to 60 months",
      "Full flexibility: home renovation, higher education, medical, or life milestones",
    ],
    bestFor: "Salaried executives, corporate staff, doctors, and chartered accountants",
    link: "/loans/personal-loan/",
  },
  bt: {
    id: "bt",
    name: "Balance Transfer & Top-Up",
    tagline: "Rate Compression Desk & Extra Capital Refinance",
    type: "Refinance",
    defaultAmount: 6000000,
    minAmount: 1500000,
    maxAmount: 100000000,
    stepAmount: 500000,
    defaultTenureYears: 15,
    maxTenureYears: 25,
    benchmarkRate: 8.6,
    marketRate: 9.85,
    benefits: [
      "Compress your existing rate by migrating to a competitive national lender",
      "Unlock massive additional top-up funds at primary mortgage rates",
      "Save lakhs of rupees in cumulative lifetime interest",
      "End-to-end documentation & foreclosure coordination executed by Fintara",
    ],
    bestFor: "Borrowers with active loans older than 6 months paying above-market rates",
    link: "/balance-transfer/",
  },
};

const PARTNER_BANKS = [
  "State Bank of India",
  "HDFC Bank",
  "ICICI Bank",
  "Kotak Mahindra Bank",
  "Axis Bank",
  "Bank of Baroda",
  "Bajaj Finance",
  "Tata Capital",
  "IDFC First Bank",
  "PNB Housing Finance",
  "Aditya Birla Capital",
  "Godrej Capital",
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

  // Live EMI & Arbitrage Savings Calculations
  const simulation = useMemo(() => {
    const P = amount;
    const n = tenureYears * 12;
    
    // Benchmark (Fintara optimized) EMI
    const rBench = currentConfig.benchmarkRate / 12 / 100;
    const emiBench = Math.round(
      (P * rBench * Math.pow(1 + rBench, n)) / (Math.pow(1 + rBench, n) - 1)
    );
    const totalBench = emiBench * n;

    // Market Walk-in Bank EMI
    const rMkt = currentConfig.marketRate / 12 / 100;
    const emiMkt = Math.round(
      (P * rMkt * Math.pow(1 + rMkt, n)) / (Math.pow(1 + rMkt, n) - 1)
    );
    const totalMkt = emiMkt * n;

    // Total Savings Over Tenure
    const totalSavings = Math.max(0, totalMkt - totalBench);
    const monthlySavings = Math.max(0, emiMkt - emiBench);

    return {
      monthlyEMI: emiBench,
      monthlySavings,
      totalSavings,
      rateArbitrage: (currentConfig.marketRate - currentConfig.benchmarkRate).toFixed(2),
    };
  }, [amount, tenureYears, currentConfig]);

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
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between selection:bg-mint selection:text-midnight">
      <JsonLd data={faqData} type="FAQPage" />

      {/* Unified Public Header (NO LOGIN BUTTON) */}
      <PublicHeader />

      <main className="flex-1 space-y-12 md:space-y-16">
        {/* 1. Hero Section with Top 1% Funded Startup Aesthetics & 3D Interactive Arbitrage Card */}
        <section className="fintech-gradient-hero text-white py-14 md:py-20 px-4 relative overflow-hidden bg-grid-dark">
          {/* Ambient Lighting Cones */}
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-mint/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
            {/* Left Column: Venture Hero Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-mint text-xs font-semibold border border-white/15 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
                <span>Pan-India Debt Advisory Desk &bull; Raipur HQ</span>
              </div>

              <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-[3.25rem] leading-[1.12] tracking-tight text-white">
                Institutional Debt.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-mint via-teal-300 to-white">
                  Curated Across 18+ Lenders.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed font-normal">
                We eliminate lending friction and bank walk-in markups. Our underwriters benchmark your profile across India&apos;s leading national banks and AAA-rated NBFCs to unlock maximum eligibility, the lowest possible rate, and 48-hour in-principle sanctions &mdash; <strong className="text-white font-semibold">with zero borrower fees.</strong>
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/contact/"
                  className="group relative px-6 py-3.5 bg-mint hover:bg-emerald-400 text-midnight font-bold rounded-xl transition-all text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-mint/25 active:scale-98"
                >
                  <span>Check Loan Eligibility</span>
                  <ArrowRight className="w-4 h-4 text-midnight group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <a
                  href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan%20requirement."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-colors text-xs sm:text-sm flex items-center gap-2 border border-white/20 backdrop-blur-md"
                >
                  <MessageCircle className="w-4 h-4 text-mint" />
                  <span>WhatsApp Loan Desk</span>
                </a>
              </div>

              {/* Fast Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-xs text-white/75">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-mint shrink-0" />
                  <span className="font-medium">100% Free Advisory</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-mint shrink-0" />
                  <span className="font-medium">18+ National Lenders</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-mint shrink-0" />
                  <span className="font-medium">Doorstep Liaisoning</span>
                </div>
              </div>
            </div>

            {/* Right Column: 3D Interactive Arbitrage Calculator Widget */}
            <div className="lg:col-span-5 relative perspective-1200">
              {/* Floating Live Arbitrage Pill */}
              <div className="absolute -top-4 -right-2 z-20 floating-3d hidden sm:flex items-center gap-2 bg-midnight/95 text-white px-4 py-2 rounded-full border border-mint/40 shadow-2xl text-xs font-bold backdrop-blur-md">
                <BadgePercent className="w-4 h-4 text-mint" />
                <span>Rate Arbitrage Engine Active</span>
              </div>

              {/* 3D Glass Hero Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 text-midnight shadow-2xl border border-slate-100 space-y-5 hero-3d-card">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-extrabold text-emerald uppercase tracking-wider">
                      Interactive Loan Simulator
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {currentConfig.type} Facility
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-midnight tracking-tight">
                    Simulate Your Loan &amp; Savings
                  </h2>
                </div>

                {/* Product Selector Pills */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1 p-1 bg-slate-100/80 rounded-xl border border-slate-200/80">
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
                            : "text-slate-600 hover:text-midnight hover:bg-white"
                        }`}
                      >
                        {item.name.replace(" Loan", "")}
                      </button>
                    );
                  })}
                </div>

                {/* Amount Slider */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-semibold">Desired Loan Amount</span>
                    <span className="font-mono text-base font-extrabold text-emerald">
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
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>Min: {formatINR(currentConfig.minAmount)}</span>
                    <span>Max: {formatINR(currentConfig.maxAmount)}</span>
                  </div>
                </div>

                {/* Tenure Selector */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-600 font-semibold">Tenure (Years):</span>
                  <div className="flex items-center gap-1.5">
                    {[3, 5, 10, 15, 20, 25]
                      .filter((y) => y <= currentConfig.maxTenureYears)
                      .slice(0, 4)
                      .map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => setTenureYears(yr)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                            tenureYears === yr
                              ? "bg-emerald text-white"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {yr}Y
                        </button>
                      ))}
                  </div>
                </div>

                {/* Arbitrage Savings Results Box */}
                <div className="p-4 rounded-2xl bg-midnight text-white space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Estimated Monthly EMI</span>
                    <span className="font-mono text-base font-extrabold text-mint">
                      {formatINR(simulation.monthlyEMI)}/mo
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                    <span className="text-slate-400">Total Savings vs Walk-in Rates</span>
                    <span className="font-mono text-sm font-bold text-amber-300">
                      ~{formatINR(simulation.totalSavings)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>Rate Compression:</span>
                    <span className="text-mint font-semibold">
                      {simulation.rateArbitrage}% lower than typical bank counters
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-1">
                  <Link
                    href={`/contact/?product=${encodeURIComponent(currentConfig.name)}&amount=${amount}`}
                    className="w-full py-3 px-4 bg-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Check Eligibility for {currentConfig.name}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Institutional Performance Metrics (Zero Fluff, High Legibility) */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="font-extrabold text-2xl sm:text-3xl text-midnight block tracking-tight">
                18+ Lenders
              </span>
              <p className="text-xs text-slate-600 font-medium leading-snug">
                Direct institutional agreements with PSU, private commercial banks &amp; top NBFCs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="font-extrabold text-2xl sm:text-3xl text-emerald block tracking-tight">
                ₹250+ Crore
              </span>
              <p className="text-xs text-slate-600 font-medium leading-snug">
                Cumulative mortgage, commercial debt, and working capital volume arranged.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="font-extrabold text-2xl sm:text-3xl text-midnight block tracking-tight">
                48h Fast TAT
              </span>
              <p className="text-xs text-slate-600 font-medium leading-snug">
                Rapid in-principle approvals with dedicated doorstep documentation and liaisoning.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="font-extrabold text-2xl sm:text-3xl text-emerald block tracking-tight">
                Zero Fees
              </span>
              <p className="text-xs text-slate-600 font-medium leading-snug">
                100% free loan advisory, underwriting benchmarking, and bank coordination.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Competitive Comparison Matrix: Fintara vs Direct Bank Walk-in vs Traditional DSA */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald block">
              The Borrowing Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
              Why Borrowers Choose Fintara Capital
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              How our institutional loan desk compares against walking into a single bank or working with traditional local brokers.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-4 px-5 font-bold text-slate-700 w-1/4">Evaluation Parameter</th>
                    <th className="py-4 px-4 font-semibold text-slate-500 w-1/4">Direct Bank Walk-In</th>
                    <th className="py-4 px-4 font-semibold text-slate-500 w-1/4">Traditional Local DSA</th>
                    <th className="py-4 px-5 font-extrabold text-emerald bg-emerald-50/50 w-1/4">
                      Fintara Capital Desk
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-midnight">Lender Options</td>
                    <td className="py-3.5 px-4 text-slate-500">Only 1 single bank&apos;s internal rulebook</td>
                    <td className="py-3.5 px-4 text-slate-500">2–3 informal local relationships</td>
                    <td className="py-3.5 px-5 font-bold text-midnight bg-emerald-50/30">
                      18+ National Banks, NBFCs &amp; HFCs
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-midnight">Rate Optimization</td>
                    <td className="py-3.5 px-4 text-slate-500">Standard card rate; minimal bargaining</td>
                    <td className="py-3.5 px-4 text-slate-500">Often steers file to highest commission bank</td>
                    <td className="py-3.5 px-5 font-bold text-emerald bg-emerald-50/30">
                      Algorithmic rate arbitrage &amp; fee waivers
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-midnight">CIBIL Protection</td>
                    <td className="py-3.5 px-4 text-slate-500">Hard credit inquiry hit upon inquiry</td>
                    <td className="py-3.5 px-4 text-slate-500">Multiple informal applications harm score</td>
                    <td className="py-3.5 px-5 font-bold text-midnight bg-emerald-50/30">
                      Zero hard inquiry during pre-screening
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-midnight">Liaisoning &amp; Doorstep</td>
                    <td className="py-3.5 px-4 text-slate-500">Borrower must visit branch repeatedly</td>
                    <td className="py-3.5 px-4 text-slate-500">Unorganized document handling</td>
                    <td className="py-3.5 px-5 font-bold text-midnight bg-emerald-50/30">
                      Dedicated advisor; doorstep document pickup
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-midnight">Advisory Fee to Borrower</td>
                    <td className="py-3.5 px-4 text-slate-500">₹0 (but higher loan interest rate)</td>
                    <td className="py-3.5 px-4 text-slate-500">Often demands upfront &ldquo;file charge&rdquo;</td>
                    <td className="py-3.5 px-5 font-extrabold text-emerald bg-emerald-50/30">
                      100% Free; zero upfront consultation charges
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-semibold text-midnight">Post-Disbursal Rate Review</td>
                    <td className="py-3.5 px-4 text-slate-500">Never; bank keeps you on existing rates</td>
                    <td className="py-3.5 px-4 text-slate-500">Relationship ends after payout</td>
                    <td className="py-3.5 px-5 font-bold text-midnight bg-emerald-50/30">
                      Automated 6-month rate compression review
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 4. Comprehensive Loan Products Suite (3D Tilt Cards) */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald block mb-1">
                Structured Institutional Portfolio
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
                Curated Loan Products
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
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 tilt-card-3d flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-midnight">Home Loans</h3>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Purchase, Plot + Construction &amp; Resale
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Financing up to 85% of registered property value with tenures up to 30 years and co-applicant pooling for maximum eligibility.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-midnight">Up to ₹5 Cr</span>
                <Link href="/loans/home-loan/" className="font-bold text-emerald hover:underline">
                  Details &rarr;
                </Link>
              </div>
            </div>

            {/* Loan Against Property (LAP) Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 tilt-card-3d flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-midnight/10 text-midnight flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-midnight">Loan Against Property</h3>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Residential &amp; Commercial Mortgages
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Unlock high liquidity against registered property with 15–20 year tenures at substantially lower rates than unsecured debt.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-midnight">Up to ₹15 Cr</span>
                <Link href="/loans/loan-against-property/" className="font-bold text-emerald hover:underline">
                  Details &rarr;
                </Link>
              </div>
            </div>

            {/* Business Loan Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 tilt-card-3d flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-midnight">Business Loans</h3>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    100% Collateral-Free SME Credit
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fast 48-hour sanctions based on banking cash flow and GST turnover multipliers without encumbering business assets.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-midnight">Up to ₹75 Lakhs</span>
                <Link href="/loans/business-loan/" className="font-bold text-emerald hover:underline">
                  Details &rarr;
                </Link>
              </div>
            </div>

            {/* Personal Loan Card */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-4 tilt-card-3d flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-midnight">Personal Loans</h3>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Salaried &amp; Professional Credit
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Rapid 24-hour disbursal with minimal digital paperwork for corporate professionals, doctors, and chartered accountants.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-midnight">Up to ₹40 Lakhs</span>
                <Link href="/loans/personal-loan/" className="font-bold text-emerald hover:underline">
                  Details &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 5. The 4-Stage Loan Facilitation Lifecycle Timeline */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald block">
              Transparent Advisory Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
              From Diagnostic Audit to Disbursal in 4 Steps
            </h2>
            <p className="text-xs text-slate-600">
              How our institutional desk liaisons with national institutions on your behalf.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-midnight text-white flex items-center justify-center font-bold text-xs font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-midnight">
                Profile &amp; Eligibility Audit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We review your ITR, bank statements, existing obligations, and credit history to diagnose your true borrowing headroom.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center font-bold text-xs font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-midnight">
                Multi-Lender Matching
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We benchmark your profile across Banks, NBFCs, and HFCs to identify the lowest rate, highest LTV, and minimal fees.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-midnight text-white flex items-center justify-center font-bold text-xs font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-midnight">
                In-Principle Sanction
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our underwriters structure your application file to clear credit committee queries swiftly without multiple rejections.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-3 relative">
              <div className="w-8 h-8 rounded-full bg-emerald text-white flex items-center justify-center font-bold text-xs font-mono">
                04
              </div>
              <h3 className="text-base font-bold text-midnight">
                Disbursal &amp; 6M Review
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We manage legal title clearance, banker coordination, and subsequent 6-month portfolio reviews for rate reduction.
              </p>
            </div>
          </div>
        </section>

        {/* 6. Real Client Success Stories & Verified Testimonials */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald block mb-1">
                Verified Client Testimonials
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
                Real Client Borrowing Stories
              </h2>
            </div>
            <Link
              href="/reviews/"
              className="text-xs font-bold text-emerald hover:underline flex items-center gap-1"
            >
              <span>View All Client Reviews</span> &rarr;
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;Transferred our LAP from 11.25% to HDFC at 9.20% and unlocked ₹40L extra working capital. Fintara handled everything without disrupting our business.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs">
                <strong className="text-midnight block font-bold">Rajesh Agrawal</strong>
                <span className="text-[11px] text-slate-500">Agrawal Steel &bull; Pandri, Raipur</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;As a practicing doctor, my consulting income documentation was complex. Fintara pooled our co-applicant file and secured an SBI sanction in 5 days.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs">
                <strong className="text-midnight block font-bold">Dr. Sneha Dewangan</strong>
                <span className="text-[11px] text-slate-500">Consultant Radiologist &bull; Shankar Nagar</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed italic">
                  &ldquo;Arranged ₹65 Lakhs unsecured business loan within 48 hours for our festive inventory orders. Transparent, dignified, and exceptionally fast service.&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-xs">
                <strong className="text-midnight block font-bold">Vikram Singhania</strong>
                <span className="text-[11px] text-slate-500">Singhania Logistics &bull; Bhilai / Raipur</span>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Institutional Partner Banks Ticker */}
        <section className="max-w-6xl mx-auto px-4 py-2">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block text-center">
              Active Institutional Underwriting Ecosystem
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {PARTNER_BANKS.map((b, i) => (
                <span
                  key={i}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-midnight font-bold text-xs shadow-2xs"
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
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald block">
              Borrower FAQs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-600">Clear answers to institutional loan facilitation inquiries</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {faqData.mainEntity.map((q, idx) => (
              <div
                key={idx}
                className="p-5 bg-white rounded-2xl border border-slate-200/80 space-y-2 shadow-2xs"
              >
                <h3 className="text-xs sm:text-sm font-bold text-midnight flex items-start gap-2">
                  <span className="text-emerald font-bold">&bull;</span>
                  <span>{q.name}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed pl-3">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9. Final High-Conversion Action Banner with Official Contacts */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="bg-midnight rounded-3xl p-8 sm:p-12 text-white text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-mint/10 rounded-full blur-3xl pointer-events-none" />

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Secure Your Ideal Loan Structure?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Submit your requirement in 60 seconds. Our credit underwriters will evaluate your file across 18+ lenders with zero consultation fees.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact/"
                className="px-6 py-3.5 bg-mint hover:bg-emerald-400 text-midnight rounded-xl text-xs sm:text-sm font-bold transition-colors flex items-center gap-2 shadow-md"
              >
                <span>Submit Loan Enquiry</span>
                <ArrowRight className="w-4 h-4 text-midnight" />
              </Link>
              <a
                href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan%20for%20my%20requirement."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-2 border border-white/20"
              >
                <MessageCircle className="w-4 h-4 text-mint" />
                <span>WhatsApp (+91 95893 52662)</span>
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
