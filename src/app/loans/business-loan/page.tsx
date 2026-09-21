import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Building2,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Business Loans & Working Capital in India | Fintara Capital",
  description:
    "Empower your business with tailored debt solutions. Secured and unsecured business loans, CC/OD limits, and machinery finance across 18+ national lenders.",
};

export default function BusinessLoanPage() {
  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What business loan structures can Fintara Capital arrange?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We arrange secured business loans (LAP/commercial mortgage), unsecured business term loans up to ₹75 Lakhs, Cash Credit / Overdraft (CC/OD) working capital limits, machinery and equipment finance, and Letter of Credit / Bank Guarantee facilities.",
        },
      },
      {
        "@type": "Question",
        name: "Can businesses apply for unsecured loans based purely on GST turnover?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Many of our partner banks and NBFCs evaluate enterprises on monthly GSTR-3B filings and 12-month banking credits, sanctioning credit lines without collateral if the enterprise demonstrates consistent turnover and healthy cash flow.",
        },
      },
      {
        "@type": "Question",
        name: "What vintage and minimum turnover are typically expected?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A minimum operating business vintage of 2–3 years with annual turnover starting from ₹40–50 Lakhs is standard for unsecured facilities. For secured facilities with collateral backing, requirements are significantly more flexible.",
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
            <Link href="/loans/unsecured-loans/" className="hover:text-emerald transition-colors">Unsecured Loans</Link>
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
            <Briefcase className="w-3.5 h-3.5" />
            Commercial &amp; Enterprise Debt Advisory &bull; Pan-India
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight">
            Business Loans: Fueling Growth &amp; Working Capital
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From fast-track unsecured business limits to multi-crore working capital lines, we match your balance sheet and GST turnover with the optimal lender across our 18+ national network.
          </p>
          <div className="pt-2">
            <Link
              href="/apply/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-midnight text-xs sm:text-sm font-semibold rounded-xl hover:bg-gold/90 transition-all shadow-sm"
            >
              Check Business Loan Eligibility
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-midnight">
            Why Structure Your Business Loan with Fintara?
          </h2>
          <p className="text-xs sm:text-sm text-slate">
            We evaluate your enterprise from an institutional credit perspective to eliminate unnecessary covenants and maximize your borrowing line.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-semibold text-midnight text-base">Secured &amp; Unsecured Options</h3>
            <p className="text-xs text-slate leading-relaxed">
              Choose quick unsecured loans up to ₹75 Lakhs without collateral, or pledge property for multi-crore long-term capital.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-semibold text-midnight text-base">Turnover-Linked Multipliers</h3>
            <p className="text-xs text-slate leading-relaxed">
              We leverage banking turnover models, GST analytics, and gross profit metrics to structure higher sanction amounts.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-midnight/5 text-midnight flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-semibold text-midnight text-base">Working Capital &amp; CC/OD</h3>
            <p className="text-xs text-slate leading-relaxed">
              Access flexible cash credit limits and overdraft lines to manage inventory cycles, raw materials, and vendor accounts.
            </p>
          </div>
        </div>

        {/* Standard Checklist */}
        <div className="bg-surface rounded-2xl border border-slate/15 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-midnight text-gold flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-midnight">Standard Business Loan Checklist</h3>
              <p className="text-xs text-slate">Key documents required for initial pre-sanction evaluation</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-6 text-xs text-slate">
            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">1. Business Entity KYC</span>
              <ul className="space-y-1">
                <li>&bull; PAN Card of Promoters &amp; Enterprise</li>
                <li>&bull; GST Certificate &amp; MSME / Udyam</li>
                <li>&bull; Partnership Deed / MOA &amp; AOA</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">2. Financials &amp; ITR</span>
              <ul className="space-y-1">
                <li>&bull; Last 2–3 years ITR with computation</li>
                <li>&bull; Audited Balance Sheet &amp; P&amp;L</li>
                <li>&bull; Tax Audit reports with schedules</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">3. Banking &amp; GST</span>
              <ul className="space-y-1">
                <li>&bull; Last 12 months primary operative account</li>
                <li>&bull; Last 12 months GSTR-3B filings</li>
                <li>&bull; Sanction letters of existing borrowings</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">4. Collateral (If Secured)</span>
              <ul className="space-y-1">
                <li>&bull; Title Deed / Sale Deed copy</li>
                <li>&bull; Approved layout / industrial clearance</li>
                <li>&bull; Property tax receipt</li>
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
            Apply for Business Loan
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
