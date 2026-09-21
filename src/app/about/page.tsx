import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Building2,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Globe2,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "About Us | Pan-India Loan Advisory & Facilitation",
  description:
    "Learn about Fintara Capital — India's premier loan facilitation desk headquartered in Raipur. Partnering with 18+ national banks & NBFCs to deliver unbiased credit advisory.",
};

export default function AboutPage() {
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
            <Link href="/team/" className="hover:text-emerald transition-colors">Our Team</Link>
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

      {/* Hero Section */}
      <section className="fintech-gradient-hero text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Globe2 className="w-3.5 h-3.5" />
            Headquartered in Raipur &bull; Serving Borrowers Across India
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight">
            Institutional Credit Advisory for Modern Borrowers
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Fintara Capital acts as your dedicated advocate across 18+ leading national banks and housing finance institutions. We eliminate banking friction, structure loans for maximum eligibility, and handle every step from login through disbursal.
          </p>
        </div>
      </section>

      {/* Key Numbers / Trust Bar */}
      <section className="bg-white border-b border-slate/15 py-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="block text-2xl md:text-3xl font-bold text-midnight font-mono">18+</span>
            <span className="text-xs text-slate font-medium">Partner Banks &amp; NBFCs</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-bold text-emerald font-mono">₹150+ Cr</span>
            <span className="text-xs text-slate font-medium">Cumulative Loan Facilitation</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-bold text-midnight font-mono">Pan-India</span>
            <span className="text-xs text-slate font-medium">Digital Service Reach</span>
          </div>
          <div>
            <span className="block text-2xl md:text-3xl font-bold text-gold font-mono">₹0</span>
            <span className="text-xs text-slate font-medium">Zero Upfront Fee Guarantee</span>
          </div>
        </div>
      </section>

      {/* Main Narrative */}
      <section className="py-16 px-4 max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-midnight">
            Our Mission &amp; Foundation
          </h2>
          <p className="text-slate text-sm sm:text-base leading-relaxed">
            Borrowing in India should not be a maze of conflicting sales pitches, hidden clauses, and endless branch visits. Fintara Capital was founded with a single core principle: to bring transparent, institutional-grade mortgage and business loan advisory to borrowers nationwide.
          </p>
          <p className="text-slate text-sm sm:text-base leading-relaxed">
            Headquartered in the thriving commercial corridor of Raipur, Chhattisgarh, we blend localized underwriting insight with deep relationships across premier national lenders including HDFC Bank, State Bank of India, ICICI Bank, Bajaj Finance, Axis Bank, Kotak Mahindra, and Tata Capital.
          </p>
        </div>

        {/* 4 Core Pillars */}
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-midnight text-base">Unbiased Multi-Lender Advocacy</h3>
            <p className="text-xs text-slate leading-relaxed">
              We are not tied to any single lender. When you approach Fintara, we assess your profile across multiple credit policies to secure the highest loan-to-value, optimal tenure, and smoothest approval path.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-midnight text-base">Zero Upfront Advisory Fee</h3>
            <p className="text-xs text-slate leading-relaxed">
              Borrowers never pay Fintara an advisory fee. We are compensated directly by our lending partners upon successful loan disbursal, ensuring our incentives align 100% with getting your file approved.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-midnight text-base">Doorstep &amp; Digital Liaisoning</h3>
            <p className="text-xs text-slate leading-relaxed">
              From picking up initial documents to coordinating legal search, technical valuation, and banker queries, we handle the friction so you can focus on your home or enterprise.
            </p>
          </div>

          <div className="fintech-card p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-midnight/5 flex items-center justify-center text-midnight">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-midnight text-base">DPDP Act Compliance &amp; Security</h3>
            <p className="text-xs text-slate leading-relaxed">
              We adhere strictly to India&apos;s Digital Personal Data Protection (DPDP) Act 2023. We never sell your contact details to spam aggregators, and all records are safeguarded under strict privacy protocols.
            </p>
          </div>
        </div>

        {/* Regulatory & Institutional Notice */}
        <div className="p-6 bg-surface rounded-2xl border border-slate/15 space-y-2 text-xs text-slate">
          <div className="font-semibold text-midnight text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-emerald" />
            Statutory &amp; Regulatory Disclosures
          </div>
          <p className="leading-relaxed">
            Fintara Capital is an authorized Direct Selling Agent (DSA) and credit facilitator. We do not accept deposits, nor do we directly lend funds. All credit evaluations, underwriting decisions, interest rate determinations, and disbursals are solely at the statutory discretion of the respective financing institutions.
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-4">
          <Link
            href="/apply/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-midnight text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-midnight/90 shadow-sm transition-all"
          >
            Start Your Loan Enquiry
            <ArrowRight className="w-4 h-4 text-gold" />
          </Link>
        </div>
      </section>
    </main>
  );
}
