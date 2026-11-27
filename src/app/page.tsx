"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { formatINR } from "@/lib/format";
import {
  Building2,
  Home,
  Briefcase,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Factory,
  Layers,
  RefreshCw,
} from "lucide-react";

type LoanCategory = "hl" | "lap" | "pl_proj" | "wc" | "bl" | "pl" | "bt";

interface LoanTypeConfig {
  id: LoanCategory;
  shortName: string;
  name: string;
  type: "Secured" | "Unsecured" | "Secured / Unsecured" | "Refinance";
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  defaultTenureYears: number;
  maxTenureYears: number;
  indicativeRate: number;
  link: string;
}

const LOAN_TYPES: Record<LoanCategory, LoanTypeConfig> = {
  hl: {
    id: "hl",
    shortName: "Home",
    name: "Home Loan",
    type: "Secured",
    defaultAmount: 5000000,
    minAmount: 1000000,
    maxAmount: 50000000,
    stepAmount: 500000,
    defaultTenureYears: 20,
    maxTenureYears: 30,
    indicativeRate: 8.5,
    link: "/loans/home-loan/",
  },
  lap: {
    id: "lap",
    shortName: "LAP",
    name: "Loan Against Property",
    type: "Secured",
    defaultAmount: 10000000,
    minAmount: 2000000,
    maxAmount: 150000000,
    stepAmount: 1000000,
    defaultTenureYears: 15,
    maxTenureYears: 20,
    indicativeRate: 9.25,
    link: "/loans/loan-against-property/",
  },
  pl_proj: {
    id: "pl_proj",
    shortName: "Project",
    name: "New Project Loan",
    type: "Secured",
    defaultAmount: 25000000,
    minAmount: 5000000,
    maxAmount: 250000000,
    stepAmount: 2500000,
    defaultTenureYears: 10,
    maxTenureYears: 12,
    indicativeRate: 9.75,
    link: "/loans/project-loans/",
  },
  wc: {
    id: "wc",
    shortName: "CC / OD",
    name: "Working Capital Limit",
    type: "Secured / Unsecured",
    defaultAmount: 10000000,
    minAmount: 1000000,
    maxAmount: 100000000,
    stepAmount: 1000000,
    defaultTenureYears: 1,
    maxTenureYears: 5,
    indicativeRate: 9.5,
    link: "/loans/working-capital/",
  },
  bl: {
    id: "bl",
    shortName: "Business",
    name: "Business Loan",
    type: "Unsecured",
    defaultAmount: 2500000,
    minAmount: 500000,
    maxAmount: 7500000,
    stepAmount: 250000,
    defaultTenureYears: 3,
    maxTenureYears: 5,
    indicativeRate: 13.5,
    link: "/loans/business-loan/",
  },
  pl: {
    id: "pl",
    shortName: "Personal",
    name: "Personal Loan",
    type: "Unsecured",
    defaultAmount: 1000000,
    minAmount: 100000,
    maxAmount: 4000000,
    stepAmount: 100000,
    defaultTenureYears: 4,
    maxTenureYears: 5,
    indicativeRate: 10.75,
    link: "/loans/personal-loan/",
  },
  bt: {
    id: "bt",
    shortName: "Transfer",
    name: "Balance Transfer",
    type: "Refinance",
    defaultAmount: 6000000,
    minAmount: 1500000,
    maxAmount: 100000000,
    stepAmount: 500000,
    defaultTenureYears: 15,
    maxTenureYears: 25,
    indicativeRate: 8.6,
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
  "PNB Housing",
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

  const monthlyCost = useMemo(() => {
    if (selectedProduct === "wc") {
      // Working capital CC/OD pays interest on utilized amount (~monthly interest cost estimate)
      return Math.round((amount * (currentConfig.indicativeRate / 100)) / 12);
    }
    const r = currentConfig.indicativeRate / 12 / 100;
    const n = tenureYears * 12;
    return Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }, [amount, tenureYears, currentConfig, selectedProduct]);

  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What does Fintara Capital do?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fintara Capital is an institutional loan advisory desk partnering with 18+ banks and NBFCs across India. We match borrower profiles with the best-fit lender for Home Loans, LAP, Project Loans, Working Capital Limits, Business Loans, and Balance Transfers.",
        },
      },
      {
        "@type": "Question",
        name: "Do borrowers pay any fee to Fintara Capital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Borrowers pay zero upfront or advisory fees. We are compensated directly by partner lending institutions upon successful loan disbursal.",
        },
      },
      {
        "@type": "Question",
        name: "Does Fintara handle both secured and unsecured working capital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. We arrange secured Cash Credit (CC), Overdraft (OD), Drop-line OD, Bank Guarantees, and LCs against collateral, as well as unsecured working capital limits based on GST and banking turnover.",
        },
      },
      {
        "@type": "Question",
        name: "Does Fintara Capital serve borrowers outside Raipur?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. While our office is located at Office No. 421, Walfort Omega, Raipur (C.G.), we serve retail and enterprise borrowers across India.",
        },
      },
    ],
  };

  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <JsonLd data={faqData} type="FAQPage" />

      <PublicHeader />

      <main className="flex-1 space-y-14 pb-14">
        {/* 1. Hero Section — Clean, Modern & Normal (No 3D Skew) */}
        <section className="fintech-gradient-hero text-white py-14 md:py-20 px-4 bg-grid-dark">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Pan-India Debt Advisory &bull; 18+ Banking Partners</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold leading-[1.12] tracking-tight text-white">
                Smart Loan Structuring Across 18+ Banks &amp; NBFCs.
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                From Home Loans and LAP to New Project Finance and Working Capital Limits (Secured &amp; Unsecured) — we benchmark offers across top lenders so you secure faster approvals at zero advisory fee.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  href="/contact/"
                  className="px-6 py-3 bg-emerald hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors text-xs sm:text-sm flex items-center gap-2 shadow-sm"
                >
                  <span>Check Loan Eligibility</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl transition-colors text-xs sm:text-sm flex items-center gap-2 border border-white/20"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Desk</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-3 border-t border-white/10 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Zero Borrower Fee
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> No Unsolicited Spam
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Doorstep Coordination
                </span>
              </div>
            </div>

            {/* Right Card: Clean Normal Interactive Estimator (No 3D Rotation) */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-2xl p-6 text-midnight shadow-xl border border-slate-200 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald uppercase tracking-wider block">
                      Quick Estimator
                    </span>
                    <h2 className="text-lg font-extrabold text-midnight">
                      Explore Loan Options
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
                    {currentConfig.type}
                  </span>
                </div>

                {/* Product Tabs */}
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(LOAN_TYPES) as LoanCategory[]).map((key) => {
                    const item = LOAN_TYPES[key];
                    const isSelected = selectedProduct === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleProductChange(key)}
                        className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-colors ${
                          isSelected
                            ? "bg-midnight text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-midnight"
                        }`}
                      >
                        {item.shortName}
                      </button>
                    );
                  })}
                </div>

                {/* Amount Slider */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-600 font-semibold">Requirement</span>
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
                    className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                    <span>{formatINR(currentConfig.minAmount)}</span>
                    <span>{formatINR(currentConfig.maxAmount)}</span>
                  </div>
                </div>

                {/* Tenure Pills (Hidden for CC/OD since working capital is revolving) */}
                {selectedProduct !== "wc" && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-semibold">Tenure:</span>
                    <div className="flex items-center gap-1.5">
                      {[3, 5, 10, 15, 20]
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
                )}

                {/* Output Summary */}
                <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">
                      {selectedProduct === "wc" ? "Est. Monthly Interest (at full use)" : "Estimated Monthly EMI"}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Benchmark ~{currentConfig.indicativeRate}% p.a.*
                    </span>
                  </div>
                  <span className="font-mono text-lg font-extrabold text-emerald-400">
                    {formatINR(monthlyCost)}/mo
                  </span>
                </div>

                <Link
                  href={`/contact/?product=${encodeURIComponent(currentConfig.name)}&amount=${amount}`}
                  className="w-full py-3 px-4 bg-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <span>Enquire for {currentConfig.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Core Loan Products Grid (6 Crisp Solutions Including Project Loans & Working Capital) */}
        <section className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald block mb-1">
                Loan Portfolio
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
                Retail, Commercial &amp; Corporate Credit
              </h2>
            </div>
            <Link href="/contact/" className="text-xs font-bold text-emerald hover:underline">
              Submit Requirement &rarr;
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* 1. Home Loans */}
            <div className="fintech-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-midnight">Home Loans</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Purchase, self-construction, resale, and plot financing up to 85% LTV with 30-year tenures.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-700">Secured &bull; Up to ₹5 Cr+</span>
                <Link href="/loans/home-loan/" className="font-bold text-emerald hover:underline">
                  Explore &rarr;
                </Link>
              </div>
            </div>

            {/* 2. Loan Against Property */}
            <div className="fintech-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-midnight/10 text-midnight flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-midnight">Loan Against Property (LAP)</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Unlock long-term growth capital against residential, commercial, or industrial properties.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-700">Secured &bull; Up to ₹15 Cr</span>
                <Link href="/loans/loan-against-property/" className="font-bold text-emerald hover:underline">
                  Explore &rarr;
                </Link>
              </div>
            </div>

            {/* 3. New Project Loans */}
            <div className="fintech-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Factory className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-midnight">New Project Loans</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Term finance for new manufacturing units, hospitals, warehouses, commercial builds, and capex.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-700">Capex &amp; Term Finance</span>
                <Link href="/loans/project-loans/" className="font-bold text-emerald hover:underline">
                  Explore &rarr;
                </Link>
              </div>
            </div>

            {/* 4. Working Capital Limits (Secured & Unsecured) */}
            <div className="fintech-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-midnight">Working Capital (CC / OD)</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Secured Cash Credit, Overdraft, Drop-line OD, Bank Guarantee &amp; collateral-free business lines.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-700">Secured &amp; Unsecured</span>
                <Link href="/loans/working-capital/" className="font-bold text-emerald hover:underline">
                  Explore &rarr;
                </Link>
              </div>
            </div>

            {/* 5. Unsecured Business Loans */}
            <div className="fintech-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-midnight">Unsecured Business Loans</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Collateral-free funding evaluated on GST returns and banking cash flows within 48–72 hours.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-700">Up to ₹75 Lakhs</span>
                <Link href="/loans/business-loan/" className="font-bold text-emerald hover:underline">
                  Explore &rarr;
                </Link>
              </div>
            </div>

            {/* 6. Personal Loans & Balance Transfer */}
            <div className="fintech-card rounded-2xl p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-midnight">Personal Loans &amp; Balance Transfer</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Quick salaried/professional credit up to ₹40L, plus active loan takeovers to cut monthly EMIs.
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-700">Refinance &amp; Personal</span>
                <Link href="/balance-transfer/" className="font-bold text-emerald hover:underline">
                  Explore &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Concise Why Fintara + 3-Step Flow */}
        <section className="max-w-6xl mx-auto px-4 grid lg:grid-cols-12 gap-8 items-start">
          {/* Why Fintara Table (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-extrabold text-midnight">Why Route Your Loan Through Fintara?</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="py-3 px-4 font-bold text-slate-700">Feature</th>
                    <th className="py-3 px-4 font-semibold text-slate-500">Single Bank Walk-In</th>
                    <th className="py-3 px-4 font-bold text-emerald bg-emerald-50/40">Fintara Capital</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="py-3 px-4 font-semibold text-midnight">Lender Choices</td>
                    <td className="py-3 px-4">1 bank&apos;s fixed policy</td>
                    <td className="py-3 px-4 font-semibold text-midnight bg-emerald-50/20">18+ Banks &amp; NBFCs compared</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-midnight">CIBIL Impact</td>
                    <td className="py-3 px-4">Hard bureau hit per inquiry</td>
                    <td className="py-3 px-4 font-semibold text-midnight bg-emerald-50/20">Zero hard hit during pre-screening</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-midnight">File Coordination</td>
                    <td className="py-3 px-4">Repeated branch follow-ups</td>
                    <td className="py-3 px-4 font-semibold text-midnight bg-emerald-50/20">End-to-end doorstep handling</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold text-midnight">Advisory Cost</td>
                    <td className="py-3 px-4">Standard counter card rate</td>
                    <td className="py-3 px-4 font-bold text-emerald bg-emerald-50/20">₹0 fee to borrower</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3-Step Process (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-2xs">
            <h2 className="text-lg font-extrabold text-midnight border-b border-slate-100 pb-3">
              How It Works in 3 Steps
            </h2>
            <div className="space-y-4 text-xs">
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-midnight text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  1
                </span>
                <div>
                  <strong className="text-midnight block">Share Requirement</strong>
                  <p className="text-slate-600 mt-0.5">Submit a quick enquiry online or via WhatsApp with your loan purpose and profile.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  2
                </span>
                <div>
                  <strong className="text-midnight block">Policy &amp; Rate Benchmarking</strong>
                  <p className="text-slate-600 mt-0.5">We match your ITR, GST, or property papers to the 2–3 best lenders before filing.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-midnight text-white font-bold flex items-center justify-center shrink-0 text-[11px]">
                  3
                </span>
                <div>
                  <strong className="text-midnight block">Sanction &amp; Disbursal</strong>
                  <p className="text-slate-600 mt-0.5">We coordinate legal, technical valuation, and bank liaisoning through disbursal.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Lending Ecosystem Strip */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 text-center space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
              Empaneled Institutional Partners
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PARTNER_BANKS.map((b, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-midnight font-semibold text-xs"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 5. Concise FAQs */}
        <section className="max-w-6xl mx-auto px-4 space-y-5">
          <h2 className="text-2xl font-extrabold text-midnight tracking-tight text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {faqData.mainEntity.map((q, idx) => (
              <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
                <h3 className="text-xs sm:text-sm font-bold text-midnight">{q.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Direct CTA Banner */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="bg-midnight rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Need a Sanction or Working Capital Review?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Speak directly with our advisory desk at Office No. 421, Walfort Omega, Raipur or enquire online.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <Link
                href="/contact/"
                className="px-5 py-3 bg-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Submit Enquiry</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan."
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 border border-white/20"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>+91 95893 52662</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
