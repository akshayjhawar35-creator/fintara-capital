import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import {
  ShieldCheck,
  Building2,
  Compass,
  Clock,
  Award,
  ArrowRight,
  Globe2,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "About Us | Pan-India Loan Advisory & Facilitation",
  description:
    "Fintara Capital is an institutional loan advisory desk at Office No. 421, Walfort Omega, Raipur (C.G.), partnering with 18+ banks and NBFCs across India.",
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-paper text-midnight flex flex-col justify-between">
      <JsonLd />
      <PublicHeader />

      {/* Hero Section */}
      <section className="fintech-gradient-hero text-white py-14 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Globe2 className="w-3.5 h-3.5" />
            Office No. 421, Walfort Omega, Raipur (C.G.) &bull; Pan-India Reach
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Institutional Credit Advisory Without Friction
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Fintara Capital acts as a dedicated intermediary across 18+ national banks and NBFCs, helping retail and commercial borrowers secure the right loan structure from login to disbursal.
          </p>
        </div>
      </section>

      {/* Factual Trust Strip */}
      <section className="bg-white border-b border-slate-200 py-7 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="block text-2xl font-extrabold text-midnight font-mono">18+</span>
            <span className="text-xs text-slate-600 font-medium">Banks &amp; NBFC Partners</span>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-emerald font-mono">Pan-India</span>
            <span className="text-xs text-slate-600 font-medium">Digital &amp; Doorstep Support</span>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-midnight font-mono">All Debt</span>
            <span className="text-xs text-slate-600 font-medium">Retail, Project &amp; CC/OD</span>
          </div>
          <div>
            <span className="block text-2xl font-extrabold text-emerald font-mono">₹0</span>
            <span className="text-xs text-slate-600 font-medium">Zero Advisory Fee</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-14 px-4 max-w-4xl mx-auto space-y-10">
        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-midnight tracking-tight">
            Our Mission &amp; Focus
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Arranging capital should not mean navigating opaque bank policies, repeated branch visits, or hard CIBIL inquiry hits. Fintara Capital benchmarks your profile across public sector banks, private banks, and NBFCs before your file is submitted—matching your exact financials, property title, or project report to the lender with the cleanest approval path.
          </p>
          <p className="text-slate-600 text-sm leading-relaxed">
            Operating from Office No. 421, Walfort Omega, Raipur (C.G.), we serve homebuyers, professionals, MSMEs, and industrial promoters across Chhattisgarh and major Indian commercial hubs.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="fintech-card p-6 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-midnight text-base">Unbiased Multi-Lender Matching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We compare credit policies across 18+ institutions to optimize loan-to-value (LTV), tenure, and overall borrowing cost.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-midnight text-base">Zero Borrower Advisory Fee</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Borrowers pay zero consultation or upfront file charges. We are remunerated directly by partner lenders upon successful disbursal.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-midnight text-base">End-to-End File Coordination</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              From pre-assessment and document compilation to legal search, technical valuation, and disbursement coordination, we manage the workflow.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-midnight">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-midnight text-base">DPDP Act Data Privacy</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict affirmative consent under the DPDP Act 2023. Your financials are shared only with the lenders you authorize—never sold to aggregators.
            </p>
          </div>
        </div>

        {/* Statutory Notice */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-600">
          <div className="font-bold text-midnight text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald" />
            <span>Regulatory Status</span>
          </div>
          <p className="leading-relaxed">
            Fintara Capital operates as an authorized Direct Selling Agent (DSA) and loan intermediary. We do not accept public deposits or lend directly. All sanctions, interest rates, and terms are issued solely by partner banks and NBFCs under RBI regulations.
          </p>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/contact/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-midnight text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-midnight-light transition-colors"
          >
            <span>Start Your Loan Enquiry</span>
            <ArrowRight className="w-4 h-4 text-emerald-400" />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
