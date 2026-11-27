import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import {
  Factory,
  Building2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  FileCheck,
  TrendingUp,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "New Project Loans & Capex Finance in India | Fintara Capital",
  description:
    "Term loans and project finance for greenfield plants, commercial infrastructure, hospitals, hotels, and machinery expansion across 18+ national banks and institutions.",
};

export default function ProjectLoansPage() {
  const faqData = {
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What types of projects qualify for New Project Loans?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Manufacturing units, cold storages, warehouses, hospitals, hotels, educational institutions, commercial complexes, and plant expansion or modernization capex.",
        },
      },
      {
        "@type": "Question",
        name: "What is the typical promoter margin and tenure?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Banks typically require a promoter contribution (margin) of 25% to 35% of total project cost, with term loan tenures ranging from 5 to 12 years including an initial moratorium period during construction.",
        },
      },
      {
        "@type": "Question",
        name: "What key documents are needed for project finance appraisal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A Detailed Project Report (DPR) with CMA data, 3 years audited financials of existing entity/promoters, land/building documents, machinery quotations, and statutory approvals.",
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
            <Factory className="w-3.5 h-3.5" />
            Project Finance &amp; Capital Expenditure
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            New Project Loans &amp; Term Finance
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Structured funding for greenfield facilities, brownfield expansions, machinery upgrades, and commercial infrastructure across India.
          </p>
          <div className="pt-2">
            <Link
              href="/contact/?product=Project%20Loan"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald hover:bg-emerald-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              <span>Discuss Your Project Proposal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 px-4 max-w-6xl mx-auto space-y-12">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald/10 text-emerald flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-midnight text-base">Greenfield &amp; Expansion</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Funding for land acquisition, civil construction, plant &amp; machinery installation, and commercial real estate builds.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-midnight/10 text-midnight flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-midnight text-base">Moratorium Alignment</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Principal repayment schedules aligned with your project commissioning timeline so early cash flows remain protected.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-midnight text-base">DPR &amp; CMA Structuring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We coordinate Debt-Service Coverage Ratio (DSCR) assumptions and viability presentations to fit PSU &amp; private bank norms.
            </p>
          </div>
        </div>

        {/* Sectors & Checklist */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <Building2 className="w-5 h-5 text-emerald" />
              <h2 className="text-lg font-extrabold text-midnight">Sectors Covered</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                <span>Manufacturing units, rice mills, steel &amp; agro-processing plants</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                <span>Warehousing, cold storage, and industrial logistics parks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                <span>Hospitals, diagnostic centers, schools, and hospitality projects</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                <span>Commercial complexes, showrooms &amp; heavy machinery procurement</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <FileCheck className="w-5 h-5 text-emerald" />
              <h2 className="text-lg font-extrabold text-midnight">Standard Appraisal Checklist</h2>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                <span>Detailed Project Report (DPR) &amp; CMA financial projections</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                <span>3 years audited financials &amp; KYC of company/promoters</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                <span>Land title papers, layout approval &amp; civil cost estimates</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald shrink-0" />
                <span>Proforma invoices for plant, machinery, or medical equipment</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-midnight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald" />
            Common Questions
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
            href="/contact/?product=Project%20Loan"
            className="inline-flex items-center gap-2 px-6 py-3 bg-midnight text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-midnight-light transition-colors"
          >
            <span>Submit Project Enquiry</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
