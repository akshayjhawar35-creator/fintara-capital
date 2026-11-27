import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import {
  Briefcase,
  ShieldCheck,
  Zap,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Layers,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Working Capital Limits (Secured & Unsecured CC/OD) | Fintara Capital",
  description:
    "Cash Credit (CC), Overdraft (OD), Drop-line OD, Bank Guarantee, LC, and unsecured working capital credit lines across 18+ banks and NBFCs.",
};

export default function WorkingCapitalPage() {
  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the difference between Secured and Unsecured Working Capital?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Secured Working Capital (CC/OD) is backed by property, stock/book debts, or fixed deposits, unlocking large multi-crore limits at prime bank rates. Unsecured Working Capital requires zero property collateral and is sanctioned on GST turnover and banking cash flow.",
        },
      },
      {
        "@type": "Question",
        name: "How does Cash Credit / Overdraft (CC/OD) save interest?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Unlike a term loan where you pay interest on the full sanctioned amount, a CC or OD limit charges interest strictly on the daily utilized balance. Idle cash parked in the account immediately lowers interest cost.",
        },
      },
      {
        "@type": "Question",
        name: "Can I transfer or enhance my existing CC/OD limit?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. If your annual turnover has grown or your current bank has capped your limit, we facilitate both limit enhancements and bank takeovers at lower interest spreads.",
        },
      },
    ],
  };

  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <JsonLd data={faqData} type="FAQPage" />
      <PublicHeader />

      {/* Hero */}
      <section className="fintech-gradient-hero text-white py-14 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Layers className="w-3.5 h-3.5" />
            Secured &amp; Unsecured Credit Lines
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Working Capital Limits: Secured &amp; Unsecured
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Pay interest only on what you use. We structure Cash Credit (CC), Overdraft (OD), Drop-line OD, Bank Guarantees, and collateral-free revolving lines.
          </p>
          <div className="pt-2">
            <Link
              href="/contact/?product=Working%20Capital%20(OD/CC)"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              <span>Check Working Capital Eligibility</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 px-4 max-w-6xl mx-auto space-y-12">
        {/* Two Core Tracks */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Secured Working Capital */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-midnight text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-midnight">Secured Working Capital Limits</h2>
                  <span className="text-[11px] text-slate-500">Collateral-Backed CC / OD / Non-Fund</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Backed by residential, commercial, or industrial property, stock &amp; debtors, or fixed deposits for high limits and lowest banking spreads.
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                <span><strong>Cash Credit (CC) &amp; Overdraft (OD):</strong> Revolving credit linked to inventory &amp; receivables.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                <span><strong>Drop-Line Overdraft (DLOD):</strong> Long-term property-backed OD without annual stock statements.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                <span><strong>Non-Fund Limits:</strong> Bank Guarantee (BG), Letter of Credit (LC), and Export Credit.</span>
              </li>
            </ul>
          </div>

          {/* Unsecured Working Capital */}
          <div className="bg-white rounded-2xl border border-slate-200 p-7 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-midnight">Unsecured Working Capital Limits</h2>
                  <span className="text-[11px] text-slate-500">100% Collateral-Free Revolving Credit</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Designed for trading, distribution, and service firms needing rapid liquidity without mortgaging real estate or assets.
            </p>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                <span><strong>Collateral-Free Overdraft:</strong> Hybrid OD/Flexi lines evaluated on banking turnover and GST.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                <span><strong>Invoice &amp; Supply Chain Finance:</strong> Quick discounting of anchor corporate bills.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                <span><strong>Short-Term Business Lines:</strong> Fast 48–72 hour sanction for seasonal inventory peaks.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-3.5 px-5 font-bold text-slate-700">Parameter</th>
                  <th className="py-3.5 px-5 font-bold text-midnight">Secured CC / OD / DLOD</th>
                  <th className="py-3.5 px-5 font-bold text-emerald">Unsecured Working Capital</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="py-3 px-5 font-semibold text-midnight">Collateral</td>
                  <td className="py-3 px-5">Property, Industrial Asset, or Stock/FD</td>
                  <td className="py-3 px-5">Zero collateral required</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold text-midnight">Typical Limit Size</td>
                  <td className="py-3 px-5">₹25 Lakhs to ₹25+ Crore</td>
                  <td className="py-3 px-5">₹5 Lakhs to ₹75 Lakhs</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold text-midnight">Interest Calculation</td>
                  <td className="py-3 px-5">Only on daily utilized amount</td>
                  <td className="py-3 px-5">Flexi-line usage or fixed EMI tenure</td>
                </tr>
                <tr>
                  <td className="py-3 px-5 font-semibold text-midnight">Sanction Speed</td>
                  <td className="py-3 px-5">7–14 days (post legal &amp; valuation)</td>
                  <td className="py-3 px-5">48–72 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-midnight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald" />
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {faqData.mainEntity.map((q, idx) => (
              <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200 space-y-2">
                <h3 className="text-xs font-bold text-midnight">{q.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{q.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/contact/?product=Working%20Capital%20(OD/CC)"
            className="inline-flex items-center gap-2 px-6 py-3 bg-midnight text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-midnight-light transition-colors"
          >
            <span>Request Limit Assessment</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
