import Link from "next/link";
import Image from "next/image";
import {
  Home,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Calculator,
  FileCheck,
  Building,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Home Loans in India | Multi-Bank Housing Finance | Fintara Capital",
  description:
    "Compare and apply for home loans across 18+ leading national banks and HFCs. Purchase, construction, resale, and plot loans with tenures up to 30 years.",
};

export default function HomeLoanPage() {
  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of home loan facilities does Fintara Capital arrange?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We arrange home loans for purchasing under-construction or ready-to-move builder flats, independent house purchases, plot purchase plus home construction, home extension/renovation, and Home Loan Balance Transfer with top-up.",
        },
      },
      {
        "@type": "Question",
        name: "How much financing can I receive towards my home purchase?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Under RBI housing finance guidelines, banks typically finance between 75% and 90% of the property's registered agreement value, depending on loan ticket size and borrower repayment eligibility.",
        },
      },
      {
        "@type": "Question",
        name: "Can co-applicants be added to enhance home loan eligibility?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Adding an earning spouse, parents, or children as co-applicants pools income together, significantly increasing your maximum loan sanction while allowing both co-owners to claim income tax deductions under Section 80C and Section 24(b).",
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
            <Link href="/balance-transfer/" className="hover:text-emerald transition-colors">Balance Transfer</Link>
            <Link href="/calculators/emi/" className="hover:text-emerald transition-colors">EMI Calculator</Link>
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
            <Home className="w-3.5 h-3.5" />
            Retail Housing Finance &bull; Pan-India
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight">
            Home Loans: Structured for Maximum Eligibility
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Buying, constructing, or transferring your home loan? We compare credit criteria across 18+ national banks and HFCs to secure optimal loan-to-value, low processing costs, and seamless sanctioning.
          </p>
          <div className="pt-2">
            <Link
              href="/apply/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-midnight text-xs sm:text-sm font-semibold rounded-xl hover:bg-gold/90 transition-all shadow-sm"
            >
              Check Home Loan Eligibility
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Core Advantages */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-midnight">
            Why Facilitate Your Home Loan with Fintara?
          </h2>
          <p className="text-xs sm:text-sm text-slate">
            We handle the complexities of banking policies, legal searches, and builder approvals so your home purchase stays stress-free.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-semibold text-midnight text-base">Longest Tenures (Up to 30 Yrs)</h3>
            <p className="text-xs text-slate leading-relaxed">
              We structure your file for the longest allowable tenure based on retirement age, minimizing your monthly installment impact.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-semibold text-midnight text-base">Higher Eligibility Structuring</h3>
            <p className="text-xs text-slate leading-relaxed">
              We guide you on factoring rental income, co-applicant addition, and incentive averaging to maximize total borrowing capacity.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-midnight/5 text-midnight flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-semibold text-midnight text-base">Zero Upfront Advisory Fee</h3>
            <p className="text-xs text-slate leading-relaxed">
              Borrowers never pay Fintara an advisory fee. We are compensated directly by partner institutions upon successful disbursal.
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
              <h3 className="font-serif text-xl font-semibold text-midnight">Standard Home Loan Checklist</h3>
              <p className="text-xs text-slate">Key documents required for initial pre-sanction assessment</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-6 text-xs text-slate">
            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">1. KYC Details</span>
              <ul className="space-y-1">
                <li>&bull; PAN Card (Borrower &amp; Co-applicant)</li>
                <li>&bull; Aadhaar / Passport address verification</li>
                <li>&bull; Passport photographs</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">2. Income Documents</span>
              <ul className="space-y-1">
                <li>&bull; Last 3 months salary slips (Salaried)</li>
                <li>&bull; Last 2–3 years ITR &amp; Computation (Self-employed)</li>
                <li>&bull; Form 16 / Audited P&amp;L</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">3. Bank Statements</span>
              <ul className="space-y-1">
                <li>&bull; Last 6 months salary / business bank statement</li>
                <li>&bull; Existing loan track records</li>
                <li>&bull; Proof of down-payment contribution</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">4. Property Details</span>
              <ul className="space-y-1">
                <li>&bull; Copy of Allotment Letter / Agreement to Sell</li>
                <li>&bull; Approved building layout / RERA registration</li>
                <li>&bull; Payment receipts issued by builder / seller</li>
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
            Apply for Your Home Loan
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
