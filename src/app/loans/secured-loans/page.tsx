import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Building,
  Home,
  Briefcase,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingDown,
  Layers,
  FileCheck,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Secured Loans in India | Home Loan, LAP, Commercial Property | Fintara Capital",
  description:
    "Explore secured loans in India. Understand how pledging residential, commercial, or industrial property unlocks higher loan amounts, longer tenures, and competitive terms across 18+ lenders.",
};

const SECURED_PRODUCTS = [
  {
    title: "Home Loans",
    href: "/loans/home-loan/",
    desc: "For purchasing a new apartment, constructing your dream house, buying a plot, or balance transferring an existing loan.",
    tenure: "Up to 30 Years",
    purpose: "Residential Purchase & Construction",
  },
  {
    title: "Loan Against Property (LAP)",
    href: "/loans/loan-against-property/",
    desc: "Unlock the equity stored in your residential, commercial, or industrial property for business growth, debt consolidation, or capital needs.",
    tenure: "Up to 15–20 Years",
    purpose: "Business Expansion & Personal Capital",
  },
  {
    title: "Commercial Property Purchase",
    href: "/apply/",
    desc: "Financing for buying commercial offices, retail shops, showrooms, or industrial warehouses across urban and industrial zones.",
    tenure: "Up to 15 Years",
    purpose: "Business Premises & Commercial Investment",
  },
  {
    title: "Balance Transfer & Top-Up",
    href: "/balance-transfer/",
    desc: "Move your high-cost existing secured loan to a partner bank offering reduced interest rates and additional top-up funds.",
    tenure: "Match or Extend Existing Tenure",
    purpose: "Interest Reduction & Liquidity",
  },
];

export default function SecuredLoansPage() {
  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is a secured loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A secured loan is a borrowing facility backed by a tangible asset pledged as collateral, such as residential property, commercial premises, industrial plots, or machinery. Because the lender holds a legal charge on the property, secured loans feature substantially lower borrowing costs, higher sanction amounts, and longer repayment tenures compared to unsecured loans.",
        },
      },
      {
        "@type": "Question",
        name: "What property types can be pledged for a secured loan in India?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most banks and NBFCs accept self-occupied residential houses/apartments, rented residential properties, commercial offices, retail shops, and industrial units with clear, marketable title deeds and approved building maps.",
        },
      },
      {
        "@type": "Question",
        name: "How does Fintara Capital help me secure the best deal on a secured loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Fintara compares your property valuation, income documentation, and CIBIL profile across 18+ national banks and housing finance companies. We structure your file to maximize your Loan-to-Value (LTV), eliminate unnecessary lender queries, and negotiate favorable sanction terms without charging you any upfront advisory fee.",
        },
      },
    ],
  };

  return (
    <main className="min-h-dvh bg-paper text-midnight">
      <JsonLd data={faqData} type="FAQPage" />

      {/* Top Header */}
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
            <Link href="/loans/unsecured-loans/" className="hover:text-emerald transition-colors">Unsecured Loans</Link>
            <Link href="/about/" className="hover:text-emerald transition-colors">About Us</Link>
            <Link href="/articles/" className="hover:text-emerald transition-colors">Articles</Link>
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
            <ShieldCheck className="w-3.5 h-3.5" />
            Asset-Backed Financing Across India
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight">
            Secured Loans: Maximum Capital, Lowest Cost of Borrowing
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pledging real estate collateral allows lenders to extend multi-crore ticket sizes with repayment tenures up to 30 years. We guide you through valuation, legal title scrutiny, and multi-bank sanctioning.
          </p>
          <div className="pt-2">
            <Link
              href="/apply/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-midnight text-xs sm:text-sm font-semibold rounded-xl hover:bg-gold/90 transition-all shadow-sm"
            >
              Check Secured Loan Eligibility
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Advantages of Secured Lending */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-midnight">
            Why Choose a Secured Loan?
          </h2>
          <p className="text-xs sm:text-sm text-slate">
            When you need large capital with comfortable monthly cash flow, secured lending offers distinct institutional advantages over unsecured alternatives.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-semibold text-midnight text-base">Lowest Interest Rates</h3>
            <p className="text-xs text-slate leading-relaxed">
              Because loans are backed by hard collateral, banks face minimal credit risk and offer their lowest benchmark rates.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-semibold text-midnight text-base">Long Tenures (Up to 30 Yrs)</h3>
            <p className="text-xs text-slate leading-relaxed">
              Stretching payments over 15 to 30 years keeps monthly EMIs manageable, preserving your operating cash flow for business and family goals.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-midnight/5 text-midnight flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-semibold text-midnight text-base">High Ticket Sizes (Up to ₹15+ Cr)</h3>
            <p className="text-xs text-slate leading-relaxed">
              Sanctions scale with your property&apos;s market value and income profile, enabling substantial financing for major expansion or property acquisition.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-semibold text-midnight">
            Secured Products Facilitated by Fintara
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {SECURED_PRODUCTS.map((prod, i) => (
              <div key={i} className="fintech-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-semibold text-midnight">{prod.title}</h3>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-paper border border-slate/15 text-slate">
                      {prod.tenure}
                    </span>
                  </div>
                  <p className="text-xs text-slate leading-relaxed">{prod.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate font-medium">{prod.purpose}</span>
                  <Link
                    href={prod.href}
                    className="text-xs font-semibold text-emerald hover:underline flex items-center gap-1"
                  >
                    View Details &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Standard Checklist */}
        <div className="bg-surface rounded-2xl border border-slate/15 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-midnight text-gold flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-midnight">Standard Borrower Checklist</h3>
              <p className="text-xs text-slate">Straightforward documents required for initial file appraisal</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-6 text-xs text-slate">
            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">1. Identity &amp; KYC</span>
              <ul className="space-y-1">
                <li>&bull; PAN Card (Borrower &amp; Co-applicant)</li>
                <li>&bull; Aadhaar / Passport for address proof</li>
                <li>&bull; Recent passport-size photographs</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">2. Income Documents</span>
              <ul className="space-y-1">
                <li>&bull; Last 2–3 years ITR with computation</li>
                <li>&bull; Audited financials &amp; P&amp;L (for business)</li>
                <li>&bull; Last 3–6 months salary slips (for salaried)</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">3. Banking Records</span>
              <ul className="space-y-1">
                <li>&bull; Last 6–12 months primary bank statement</li>
                <li>&bull; GST returns (for commercial / SME files)</li>
                <li>&bull; Sanction letters of existing active loans</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">4. Property Documents</span>
              <ul className="space-y-1">
                <li>&bull; Title Deed / Sale Deed copy</li>
                <li>&bull; Approved building plan / layout</li>
                <li>&bull; Tax receipts &amp; allotment letter</li>
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
            Apply for a Secured Loan
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
