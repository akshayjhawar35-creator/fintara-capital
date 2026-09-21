import Link from "next/link";
import Image from "next/image";
import {
  UserCheck,
  Zap,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Clock,
  Sparkles,
  FileText,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Personal Loans in India | Fast Disbursal & Zero Collateral | Fintara Capital",
  description:
    "Apply for instant personal loans across India. Up to ₹40 Lakhs with flexible tenures up to 5 years. Zero collateral, minimal paperwork, and multi-bank comparison with Fintara.",
};

export default function PersonalLoanPage() {
  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Who is eligible for a personal loan through Fintara Capital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Salaried employees in private or public sector companies, self-employed professionals (Doctors, CAs, Architects), and business owners with a stable banking track record and a minimum CIBIL score of 680+ are eligible.",
        },
      },
      {
        "@type": "Question",
        name: "How much loan amount can I avail under a personal loan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Personal loan sanctions range from ₹1,00,000 up to ₹40,00,000 depending on your net take-home salary, employer category, existing EMI commitments, and credit repayment history.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use a personal loan for debt consolidation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Many borrowers use personal loans to consolidate multiple high-interest credit card dues or short-term borrowings into a single, manageable monthly EMI at a lower overall interest burden.",
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
            <Link href="/loans/secured-loans/" className="hover:text-emerald transition-colors">Secured</Link>
            <Link href="/loans/unsecured-loans/" className="hover:text-emerald transition-colors">Unsecured</Link>
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
            <UserCheck className="w-3.5 h-3.5" />
            Fast Personal Financing Across India
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight">
            Personal Loans: Zero Collateral, Maximum Flexibility
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Borrow from ₹1 Lakh to ₹40 Lakhs for personal milestones, medical requirements, or debt consolidation. We compare underwriting criteria across 18+ national lenders for rapid approval.
          </p>
          <div className="pt-2">
            <Link
              href="/apply/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-midnight text-xs sm:text-sm font-semibold rounded-xl hover:bg-gold/90 transition-all shadow-sm"
            >
              Apply for Personal Loan
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-midnight">
            Key Personal Loan Advantages
          </h2>
          <p className="text-xs sm:text-sm text-slate">
            Tailored repayment solutions designed around your monthly income and cash flow.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-midnight text-base">Swift 24-Hour Sanction</h3>
            <p className="text-xs text-slate leading-relaxed">
              Paperless digital verification enables select partner banks to issue approval letters and disburse funds within 24 to 48 hours.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-midnight text-base">No Security Required</h3>
            <p className="text-xs text-slate leading-relaxed">
              100% unsecured borrowing. You do not need to pledge property, fixed deposits, gold, or arrange third-party guarantors.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-midnight/5 text-midnight flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-midnight text-base">Flexible Tenures (1 to 5 Years)</h3>
            <p className="text-xs text-slate leading-relaxed">
              Choose your repayment timeline from 12 to 60 months with convenient auto-debit (NACH/e-Mandate) facilities.
            </p>
          </div>
        </div>

        {/* Standard Checklist */}
        <div className="bg-surface rounded-2xl border border-slate/15 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-midnight text-gold flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-midnight">Standard Personal Loan Checklist</h3>
              <p className="text-xs text-slate">Simple requirements to begin processing</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 text-xs text-slate">
            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">1. Basic KYC</span>
              <ul className="space-y-1">
                <li>&bull; PAN Card copy</li>
                <li>&bull; Aadhaar / Passport address verification</li>
                <li>&bull; Passport photograph</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">2. Proof of Income</span>
              <ul className="space-y-1">
                <li>&bull; Last 3 months salary slips (Salaried)</li>
                <li>&bull; Last 2 years ITR with computation (Self-employed)</li>
                <li>&bull; Form 16 / Company appointment letter</li>
              </ul>
            </div>

            <div className="p-4 bg-paper rounded-xl border border-slate/10 space-y-2">
              <span className="font-semibold text-midnight text-sm block">3. Banking &amp; Credit</span>
              <ul className="space-y-1">
                <li>&bull; Last 6 months salary / operative bank statement</li>
                <li>&bull; Active CIBIL report (680+ preferred)</li>
                <li>&bull; Proof of existing loan EMIs (if any)</li>
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
            Check Your Personal Loan Eligibility
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
