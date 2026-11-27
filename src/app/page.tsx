import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { LoanSimulator } from "@/components/public/LoanSimulator";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  Building2,
  Home,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Factory,
  Layers,
  RefreshCw,
} from "lucide-react";

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
      <JsonLd />
      <JsonLd data={faqData} type="FAQPage" />

      <PublicHeader />

      <main className="flex-1 space-y-14 pb-14">
        {/* 1. Hero Section — Clean, Modern & Normal */}
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

            {/* Right Card: Client Interactive Estimator */}
            <div className="lg:col-span-5">
              <LoanSimulator />
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
