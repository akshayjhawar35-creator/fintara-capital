import Link from "next/link";
import Image from "next/image";
import {
  Zap,
  Briefcase,
  UserCheck,
  Building2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Unsecured Loans in India | Business & Personal Loans | Fintara Capital",
  description:
    "Explore collateral-free unsecured loans in India. Fast-track approval for Business Loans, Working Capital, and Personal Loans based on cash flow and CIBIL score.",
};

const UNSECURED_PRODUCTS = [
  {
    title: "Unsecured Business Loans",
    href: "/loans/business-loan/",
    desc: "Collateral-free working capital and term loans up to ₹50–75 Lakhs evaluated on GST turnover, banking credits, and business vintage.",
    speed: "Disbursal in 48–72 Hours",
    target: "Proprietors, LLPs, Private Limited Firms",
  },
  {
    title: "Personal Loans",
    href: "/loans/personal-loan/",
    desc: "High-ticket unsecured financing up to ₹40 Lakhs for salaried executives and self-employed professionals with minimal paperwork.",
    speed: "Digital Approval in 24 Hours",
    target: "Salaried Employees & Professionals",
  },
  {
    title: "Professional Loans (Doctors & CAs)",
    href: "/apply/",
    desc: "Specialized credit lines for practicing Chartered Accountants, Doctors, and Architects with preferential underwriting terms.",
    speed: "Streamlined Sanction",
    target: "Licensed Medical & Financial Professionals",
  },
  {
    title: "GST-Based Working Capital",
    href: "/apply/",
    desc: "Credit limits structured directly against monthly GSTR-3B filings, ideal for fast-growing manufacturers and wholesalers.",
    speed: "Fast Assessment",
    target: "GST-Registered Enterprises",
  },
];

export default function UnsecuredLoansPage() {
  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is an unsecured loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An unsecured loan is a credit facility that does not require you to pledge any real estate, gold, or equipment as collateral. Approval is determined primarily by your cash flow, banking turnover, business stability, and credit (CIBIL) repayment track record.",
        },
      },
      {
        "@type": "Question",
        name: "How fast can an unsecured loan be sanctioned and disbursed?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Because unsecured loans do not require property title investigation, physical legal searches, or architectural valuation, sanctions typically occur within 24 to 72 hours of digital document verification.",
        },
      },
      {
        "@type": "Question",
        name: "What CIBIL score is recommended for an unsecured business or personal loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A CIBIL score of 700 or higher is generally required for competitive terms, with scores above 750 unlocking the lowest processing fees and highest sanction multipliers across leading national banks.",
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
            <Link href="/loans/secured-loans/" className="hover:text-emerald transition-colors">Secured Loans</Link>
            <Link href="/loans/personal-loan/" className="hover:text-emerald transition-colors">Personal Loans</Link>
            <Link href="/about/" className="hover:text-emerald transition-colors">About Us</Link>
            <Link
              href="/auth/login/"
              className="bg-midnight text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-midnight/90 transition-colors"
            >
              Staff Portal
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="fintech-gradient-hero text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5" />
            100% Collateral-Free Financing
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight">
            Unsecured Loans: Fast Capital Without Asset Pledging
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Need quick business liquidity or personal funds without touching your real estate? Our desk facilitates unsecured credit lines up to ₹75 Lakhs across 18+ national lending partners.
          </p>
          <div className="pt-2">
            <Link
              href="/apply/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-midnight text-xs sm:text-sm font-semibold rounded-xl hover:bg-gold/90 transition-all shadow-sm"
            >
              Check Unsecured Eligibility
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-midnight">
            Why Borrow Unsecured with Fintara?
          </h2>
          <p className="text-xs sm:text-sm text-slate">
            When operational speed, confidentiality, and asset protection are your top priorities, unsecured facilities offer the fastest bridge to working capital.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-semibold text-midnight text-base">Zero Asset Risk</h3>
            <p className="text-xs text-slate leading-relaxed">
              No mortgage, no lien on real estate, and no collateral inspection. Your property remains entirely unencumbered.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-semibold text-midnight text-base">Rapid 48–72h Sanction</h3>
            <p className="text-xs text-slate leading-relaxed">
              With automated bank statement analyzers and GST reconciliation, approvals move straight from application to disbursement.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-midnight/5 text-midnight flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-semibold text-midnight text-base">Multi-Lender Optimization</h3>
            <p className="text-xs text-slate leading-relaxed">
              We match your banking profile against the specific lender whose current policy awards the highest credit multiplier.
            </p>
          </div>
        </div>

        {/* Product Cards */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-semibold text-midnight">
            Unsecured Loan Offerings
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {UNSECURED_PRODUCTS.map((prod, i) => (
              <div key={i} className="fintech-card p-6 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-lg font-semibold text-midnight">{prod.title}</h3>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {prod.speed}
                    </span>
                  </div>
                  <p className="text-xs text-slate leading-relaxed">{prod.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate/10 flex items-center justify-between">
                  <span className="text-[11px] text-slate font-medium">{prod.target}</span>
                  <Link
                    href={prod.href}
                    className="text-xs font-semibold text-emerald hover:underline flex items-center gap-1"
                  >
                    Explore &rarr;
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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-midnight">Standard Document Checklist</h3>
              <p className="text-xs text-slate">Clean document bundle for rapid verification</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 text-xs text-slate">
            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">1. Identity &amp; Residence</span>
              <ul className="space-y-1">
                <li>&bull; PAN Card of applicant &amp; enterprise</li>
                <li>&bull; Aadhaar / Passport address verification</li>
                <li>&bull; Business registration certificate (MSME/GST)</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">2. Income &amp; Tax Filings</span>
              <ul className="space-y-1">
                <li>&bull; Last 2 years ITR with computation</li>
                <li>&bull; GSTR-3B filings for the last 12 months</li>
                <li>&bull; Salary slips (for salaried applicants)</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">3. Operational Banking</span>
              <ul className="space-y-1">
                <li>&bull; 6 to 12 months primary bank statement</li>
                <li>&bull; Details of existing EMIs or loan repayments</li>
                <li>&bull; Live CIBIL track record (700+ preferred)</li>
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
            Apply for Unsecured Loan
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
