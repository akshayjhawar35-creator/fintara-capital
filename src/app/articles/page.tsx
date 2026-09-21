import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Borrower Guides & Financial Insights | Fintara Capital",
  description:
    "Evergreen financial guides, loan structuring strategies, and mortgage advisory insights for home buyers, commercial property owners, and business leaders across India.",
};

const ARTICLES = [
  {
    id: "lap-ltv-guide",
    title: "Loan Against Property (LAP): How to Maximize Your Loan-to-Value (LTV)",
    category: "Mortgage Advisory",
    readTime: "6 min read",
    summary:
      "Understand how banks evaluate residential, commercial, and industrial property. Learn how clear title deeds, approved building plans, and strong debt-service coverage allow you to unlock 60%+ LTV without unnecessary lender cuts.",
    keyTakeaway: "Clear building sanctions and unencumbered title deeds unlock the highest valuation multipliers.",
  },
  {
    id: "balance-transfer-timing",
    title: "Home Loan Balance Transfer: When Does Switching Lenders Make Financial Sense?",
    category: "Refinancing",
    readTime: "5 min read",
    summary:
      "A balance transfer is beneficial when the interest rate differential exceeds 0.50% and you have at least 7–10 years remaining on your loan. Discover how to calculate net savings after accounting for processing fees and stamp duty.",
    keyTakeaway: "Focus on remaining tenure: the earlier in the loan life cycle you transfer, the greater the compounding interest saved.",
  },
  {
    id: "secured-vs-unsecured-capital",
    title: "Secured vs. Unsecured Debt: Choosing the Right Capital Structure for Your Enterprise",
    category: "Business Finance",
    readTime: "7 min read",
    summary:
      "Unsecured loans provide fast 48-hour liquidity for inventory spikes, but carry higher monthly EMI burdens. Secured loans provide multi-crore ticket sizes with 15-year tenures that protect operating cash flows.",
    keyTakeaway: "Match the debt tenure with the asset life: never finance long-term equipment or plant expansion with short-term unsecured debt.",
  },
  {
    id: "property-title-essentials",
    title: "The Standard Property Title Documents Every Borrower Needs for Mortgage Sanction",
    category: "Documentation",
    readTime: "5 min read",
    summary:
      "A clean review of primary real estate papers required by institutional lenders across Indian states: registered sale deed, chain documents, approved master plan, latest tax receipts, and encumbrance certificates.",
    keyTakeaway: "Having a clean prior chain of title documents saves 2 to 3 weeks during bank legal verification.",
  },
  {
    id: "cibil-score-optimization",
    title: "CIBIL Score Essentials: How to Stay Above 750 and Command Premier Loan Terms",
    category: "Credit Strategy",
    readTime: "4 min read",
    summary:
      "Your CIBIL score is your financial passport. Learn why multiple simultaneous loan logins damage your score, how credit utilization ratios affect ratings, and the simple habits that keep your profile institutional-ready.",
    keyTakeaway: "Keep revolving credit card utilization below 30% of your limit and avoid submitting multiple concurrent loan applications.",
  },
  {
    id: "dpdp-act-data-protection",
    title: "Digital Personal Data Protection (DPDP Act 2023): How Fintara Safeguards Borrower Privacy",
    category: "Privacy & Ethics",
    readTime: "4 min read",
    summary:
      "Financial data is deeply personal. Learn how India's DPDP Act mandates explicit borrower consent, bans unauthorized data sharing with lead aggregators, and how Fintara strictly shields your PAN, Aadhaar, and banking information.",
    keyTakeaway: "Fintara operates on strict, affirmative consent: your documents are shared solely with the specific banks you approve.",
  },
];

export default function ArticlesPage() {
  return (
    <main className="min-h-dvh bg-paper text-midnight">
      <JsonLd />

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
            <Link href="/about/" className="hover:text-emerald transition-colors">About Us</Link>
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
      <section className="fintech-gradient-hero text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            Evergreen Financial Insights &bull; Borrower Education
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight">
            Financial Insights &amp; Loan Strategies
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Transparent, institutional guidance on loan structuring, mortgage eligibility, debt consolidation, and credit optimization across India.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <div
              key={article.id}
              className="fintech-card p-6 rounded-2xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200 text-[10px]">
                    {article.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate/70" />
                    {article.readTime}
                  </span>
                </div>

                <h2 className="font-serif text-base font-semibold text-midnight leading-snug">
                  {article.title}
                </h2>

                <p className="text-xs text-slate leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-slate/10 space-y-2">
                <div className="p-2.5 bg-paper rounded-lg border border-slate/10 text-[11px] text-midnight">
                  <span className="font-semibold text-emerald block mb-0.5">Key Insight:</span>
                  {article.keyTakeaway}
                </div>
                <Link
                  href="/apply/"
                  className="text-xs font-semibold text-midnight hover:text-emerald transition-colors flex items-center justify-between pt-1"
                >
                  <span>Discuss Your Profile With an Advisor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Advisory Help Banner */}
        <div className="p-8 bg-surface rounded-2xl border border-slate/15 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-semibold text-midnight">Have a Unique Loan Situation?</h3>
            <p className="text-xs text-slate max-w-md">
              Whether it&apos;s complex property ownership, business turnover assessment, or existing high-cost loans, our desk will structure the right solution across 18+ lenders.
            </p>
          </div>
          <Link
            href="/apply/"
            className="px-6 py-3 bg-midnight text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-midnight/90 transition-all shadow-sm shrink-0"
          >
            Request Free Case Review &rarr;
          </Link>
        </div>
      </section>
    </main>
  );
}
