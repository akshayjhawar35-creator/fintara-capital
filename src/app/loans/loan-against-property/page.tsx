import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Globe2,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Loan Against Property (LAP) in India | Mortgage Advisory | Fintara Capital",
  description:
    "Unlock equity from your residential, commercial, or industrial property across India. Long tenures up to 20 years, high-ticket sanctions up to ₹15+ Crore, and tailored multi-bank structuring.",
};

export default function LAPPage() {
  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a Loan Against Property (LAP)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Loan Against Property (LAP), also known as a mortgage loan, is a secured borrowing facility where you pledge an unencumbered residential, commercial, or industrial property to obtain substantial capital. The funds can be utilized for business expansion, debt consolidation, machinery purchase, or major personal expenditures.",
        },
      },
      {
        "@type": "Question",
        name: "How much loan amount can I get against my property?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sanctions typically range from 50% to 65% of your property's fair market valuation (Loan-to-Value or LTV), combined with your business income and debt servicing ability. Ticket sizes range from ₹25 Lakhs to ₹15+ Crore across our 18+ partner banks.",
        },
      },
      {
        "@type": "Question",
        name: "What property documents are required for a standard LAP application?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Lenders typically require a clean copy of the Title Deed / Sale Deed, sanctioned municipal layout or building plan, latest property tax receipt, and prior chain documents verifying ownership.",
        },
      },
    ],
  };

  return (
    <main className="min-h-dvh bg-paper text-midnight">
      <JsonLd data={faqData} type="FAQPage" />

      {/* Header */}
      <header className="bg-white border-b border-slate/10 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/mark.svg" alt="Fintara Capital" width={38} height={38} />
            <span className="font-semibold text-midnight text-lg tracking-tight">
              Fintara<span className="font-normal text-slate ml-1">Capital</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-xs sm:text-sm font-medium text-slate">
            <Link href="/" className="hover:text-emerald transition-colors">Home</Link>
            <Link href="/loans/secured-loans/" className="hover:text-emerald transition-colors">Secured Loans</Link>
            <Link href="/loans/home-loan/" className="hover:text-emerald transition-colors">Home Loans</Link>
            <Link href="/balance-transfer/" className="hover:text-emerald transition-colors">Balance Transfer</Link>
            <Link
              href="/auth/login/"
              className="bg-midnight text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-midnight/90 transition-colors"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="fintech-gradient-hero text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Building2 className="w-3.5 h-3.5" />
            Pan-India Mortgage Loan Advisory
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight">
            Loan Against Property: Unlock Your Real Estate Equity
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Turn residential, commercial, or industrial real estate into low-cost growth capital. We structure high-ticket sanctions with comfortable repayment tenures across 18+ national banks.
          </p>
          <div className="pt-2">
            <Link
              href="/apply/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-midnight text-xs sm:text-sm font-semibold rounded-xl hover:bg-gold/90 transition-all shadow-sm"
            >
              Request LAP Evaluation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-midnight">
            Why Opt for a Mortgage Loan (LAP)?
          </h2>
          <p className="text-xs sm:text-sm text-slate">
            Unlike short-term business loans that strain monthly liquidity, LAP distributes capital repayment over a long horizon at substantially lower borrowing costs.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-semibold text-midnight text-base">High-Ticket Financing</h3>
            <p className="text-xs text-slate leading-relaxed">
              Borrow from ₹25 Lakhs up to ₹15+ Crore based on property valuation and debt-service coverage ratio.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-semibold text-midnight text-base">Extended Tenures (15–20 Years)</h3>
            <p className="text-xs text-slate leading-relaxed">
              Longer repayment schedules keep your monthly EMI commitments low and manageable compared to 3-year unsecured debt.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-midnight/5 text-midnight flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-semibold text-midnight text-base">Flexible End-Use</h3>
            <p className="text-xs text-slate leading-relaxed">
              Funds can be deployed for business expansion, purchasing commercial equipment, vendor payments, or personal family needs.
            </p>
          </div>
        </div>

        {/* Accepted Property Types */}
        <div className="fintech-card p-8 rounded-2xl space-y-6">
          <h3 className="font-serif text-xl font-semibold text-midnight">Eligible Property Categories</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-xs text-slate">
            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">Residential Properties</span>
              <p>Self-occupied houses, independent villas, or rented apartments in recognized municipal development zones.</p>
            </div>
            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">Commercial Real Estate</span>
              <p>Approved office spaces, retail shops, business showrooms, and commercial shopping complexes.</p>
            </div>
            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">Industrial Units &amp; Warehouses</span>
              <p>Manufacturing sheds, industrial plots, and warehousing premises with proper industrial development board clearances.</p>
            </div>
          </div>
        </div>

        {/* Standard Checklist */}
        <div className="bg-surface rounded-2xl border border-slate/15 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-midnight text-gold flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-midnight">Standard LAP Document Checklist</h3>
              <p className="text-xs text-slate">Simplified documentation bundle for file evaluation</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-6 text-xs text-slate">
            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">1. Borrower KYC</span>
              <ul className="space-y-1">
                <li>&bull; PAN Card (Applicant &amp; Co-applicant)</li>
                <li>&bull; Aadhaar / Passport address proof</li>
                <li>&bull; Photographs</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">2. Income Verification</span>
              <ul className="space-y-1">
                <li>&bull; Last 3 years ITR &amp; Computation</li>
                <li>&bull; Audited Financials with schedules (Business)</li>
                <li>&bull; Salary slips &amp; Form 16 (Salaried)</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">3. Bank Statements</span>
              <ul className="space-y-1">
                <li>&bull; Last 12 months primary operative account</li>
                <li>&bull; Sanction letters of existing debts</li>
                <li>&bull; GSTR filings for business files</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">4. Property Title</span>
              <ul className="space-y-1">
                <li>&bull; Copy of Registered Sale Deed / Title Deed</li>
                <li>&bull; Approved building plan / layout</li>
                <li>&bull; Latest property tax receipt</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-semibold text-midnight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqData.mainEntity.map((q, idx) => (
              <div key={idx} className="p-5 bg-surface rounded-xl border border-slate/15 space-y-1.5">
                <h3 className="text-sm font-semibold text-midnight">{q.name}</h3>
                <p className="text-xs text-slate leading-relaxed">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href="/apply/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-midnight text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-midnight/90 shadow-sm transition-all"
          >
            Apply for Loan Against Property
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
