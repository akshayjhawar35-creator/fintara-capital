"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/public/PublicHeader";
import { PublicFooter } from "@/components/public/PublicFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  FileText,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building2,
  TrendingUp,
  Bookmark,
  Copy,
  Check,
  MessageCircle,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface ResourceGuide {
  id: string;
  category: "Home Loans" | "LAP" | "Credit Score" | "Business Debt" | "Refinance";
  title: string;
  readTime: string;
  summary: string;
  keyTakeaways: string[];
  shareText: string;
}

const GUIDES: ResourceGuide[] = [
  {
    id: "home-loan-checklist",
    category: "Home Loans",
    title: "The Ultimate Home Loan Sanction Checklist (Pan-India Guide)",
    readTime: "4 min read",
    summary:
      "A complete breakdown of KYC, income proof, bank statement analysis, and legal property chain documents required by PSU and private banks to issue in-principle sanction letters in under 72 hours.",
    keyTakeaways: [
      "Latest 3 years ITR with computation sheets and CA-certified balance sheets.",
      "Consecutive 6 months bank statement showing salary credits or operational turnover.",
      "30-year property title chain, registered sale agreement, and municipal sanction plan.",
      "Clear CIBIL score above 750 with zero 30+ DPD (days past due) over the past 24 months.",
    ],
    shareText:
      "Check out this complete Home Loan Document & Approval Checklist by Fintara Capital: https://fintara.capital/resources/#home-loan-checklist",
  },
  {
    id: "lap-guide",
    category: "LAP",
    title: "Loan Against Property (LAP): Valuation, LTV & Title Clearance Rules",
    readTime: "5 min read",
    summary:
      "How banks value self-occupied residential, commercial, and industrial property, determine maximum Loan-to-Value (up to 75%), and navigate complex title questions without rejection.",
    keyTakeaways: [
      "Residential properties unlock the highest LTV (up to 70–75%) and the longest tenures (up to 20 years).",
      "Commercial offices and industrial sheds are evaluated on technical valuation and rental yields.",
      "Encumbrance certificate (EC) for 15–30 years is required to prove clear and marketable title.",
      "Co-ownership rules: All title deed holders must be co-applicants on the loan facility.",
    ],
    shareText:
      "Master the rules of Loan Against Property (LAP) before applying: https://fintara.capital/resources/#lap-guide",
  },
  {
    id: "cibil-hacks",
    category: "Credit Score",
    title: "6 Structural Rules to Elevate Your CIBIL Score Above 775",
    readTime: "3 min read",
    summary:
      "A strategic playbook for salaried individuals and entrepreneurs looking to optimize credit utilization ratios, eliminate bureau reporting errors, and qualify for prime bank interest slabs.",
    keyTakeaways: [
      "Maintain credit card utilization under 30% of total credit limit across all active cards.",
      "Avoid applying directly to multiple banks simultaneously to prevent hard inquiry hits.",
      "Ensure a healthy mix between secured credit (Home/Auto) and unsecured credit (Personal/Cards).",
      "Audit your CIBIL report quarterly for erroneously reported overdue status or outdated write-offs.",
    ],
    shareText:
      "6 proven steps to boost your CIBIL score for prime loan rates: https://fintara.capital/resources/#cibil-hacks",
  },
  {
    id: "msme-business-loan",
    category: "Business Debt",
    title: "Collateral-Free MSME Business Loans: How Banks Calculate Turnover Multipliers",
    readTime: "4 min read",
    summary:
      "Demystifying banking credit velocity, GST returns reconciliation, and gross profit multipliers used by NBFCs and fintech lenders to disburse ₹10L to ₹75L within 48 hours without collateral.",
    keyTakeaways: [
      "GST returns (GSTR-3B) must reconcile within 10% variance with bank statement inflows.",
      "Minimum 2 years of active business operations with positive net worth and audited financials.",
      "Cheque bounces (inward or outward) must be zero in the trailing 6 months.",
      "Sanctioned limits range between 10% to 25% of annual banking turnover depending on margin profile.",
    ],
    shareText:
      "How banks calculate collateral-free business loan limits: https://fintara.capital/resources/#msme-business-loan",
  },
  {
    id: "balance-transfer-rulebook",
    category: "Refinance",
    title: "The Loan Balance Transfer Rulebook: When & How to Compress Your Interest Rate",
    readTime: "4 min read",
    summary:
      "An analytical guide showing how migrating an active mortgage older than 6 months can save ₹5L to ₹25L in cumulative lifetime interest and unlock substantial additional top-up capital.",
    keyTakeaways: [
      "A rate differential of just 0.50% to 0.75% can generate massive savings over remaining tenure.",
      "RBI prohibits foreclosure/prepayment charges on floating-rate individual home loans.",
      "Combine rate compression with a top-up loan to fund business expansion or family milestones.",
      "Fintara manages the entire handover: list of documents (LOD), foreclosure letter, and title movement.",
    ],
    shareText:
      "Learn when a Balance Transfer saves you maximum interest: https://fintara.capital/resources/#balance-transfer-rulebook",
  },
  {
    id: "working-capital-project-finance",
    category: "Business Debt",
    title: "Working Capital Limits (CC / OD) & New Project Finance Guide",
    readTime: "4 min read",
    summary:
      "How businesses structure secured Cash Credit (CC), Overdraft (OD), Drop-line OD, and unsecured working capital limits alongside term loans for new industrial or commercial projects.",
    keyTakeaways: [
      "CC / OD limits charge interest strictly on daily utilized balance rather than full sanctioned limit.",
      "New Project Loans require a Detailed Project Report (DPR) with CMA projections and promoter margin.",
      "Unsecured working capital limits rely on GST returns and 12-month banking credits without property pledge.",
      "Non-fund limits (Bank Guarantees & LCs) lower upfront capital lock-up for contractors and traders.",
    ],
    shareText:
      "Guide to Working Capital (CC/OD) & Project Loans by Fintara Capital: https://fintara.capital/resources/#working-capital-project-finance",
  },
];

export default function ResourcesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (guide: ResourceGuide) => {
    const url = `https://fintara.capital/resources/#${guide.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(guide.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleWhatsAppShare = (guide: ResourceGuide) => {
    const url = `https://wa.me/?text=${encodeURIComponent(guide.shareText)}`;
    window.open(url, "_blank");
  };

  const handleLinkedInShare = (guide: ResourceGuide) => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      `https://fintara.capital/resources/#${guide.id}`
    )}`;
    window.open(url, "_blank");
  };

  const handleXShare = (guide: ResourceGuide) => {
    const text = `${guide.title} - Essential borrower guide by Fintara Capital:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(`https://fintara.capital/resources/#${guide.id}`)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-dvh bg-paper flex flex-col justify-between selection:bg-mint selection:text-midnight">
      <JsonLd
        type="Article"
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Fintara Capital - Borrower Resources, Checklists & Guides Hub",
          description:
            "Free downloadable loan checklists, CIBIL score optimization blueprints, and institutional loan guides for Indian borrowers.",
          publisher: {
            "@type": "Organization",
            name: "Fintara Capital",
            url: "https://fintara.capital",
          },
        }}
      />

      <PublicHeader />

      <main className="flex-1 py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80">
              <Sparkles className="w-3.5 h-3.5 text-emerald" />
              <span>Borrower Knowledge &amp; Content Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-midnight tracking-tight">
              Loan Checklists &amp; Advisory Guides
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto">
              Master the underwriting rules of Indian banks and NBFCs. Free checklists, valuation blueprints, and CIBIL optimization cheat sheets designed to give you unfair leverage before submitting your loan file.
            </p>
          </div>

          {/* Social Media Follow Cards Banner */}
          <div className="bg-midnight rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-80 h-80 bg-mint/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-1.5 max-w-lg">
                <span className="text-[10px] uppercase tracking-wider text-mint font-extrabold block">
                  Official Channels
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Follow Fintara Capital for Real-Time Debt Intelligence
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Daily repo rate updates, banking policy shifts, and loan arbitrage tips posted across our verified channels.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="https://linkedin.com/company/fintara-capital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-emerald text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/15"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://x.com/fintaracapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-emerald text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/15"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  <span>X (Twitter)</span>
                </a>

                <a
                  href="https://instagram.com/fintara.capital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-emerald text-white text-xs font-bold transition-all flex items-center gap-2 border border-white/15"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </a>

                <a
                  href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20subscribe%20to%20loan%20updates"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-mint text-midnight text-xs font-bold transition-all flex items-center gap-2 hover:bg-emerald-400"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Updates</span>
                </a>
              </div>
            </div>
          </div>

          {/* Guides Cards List */}
          <div className="space-y-8">
            {GUIDES.map((guide, idx) => (
              <article
                key={guide.id}
                id={guide.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs hover:border-emerald/40 transition-all space-y-5 scroll-mt-24"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold">
                      {guide.category}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="text-xs text-slate-500 font-medium">{guide.readTime}</span>
                  </div>

                  {/* 1-Click Viral Sharing Actions */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 font-semibold hidden sm:inline">
                      Share Guide:
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => handleWhatsAppShare(guide)}
                      className="p-2 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
                      title="Share on WhatsApp"
                      aria-label="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLinkedInShare(guide)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-midnight hover:text-white transition-colors"
                      title="Share on LinkedIn"
                      aria-label="Share on LinkedIn"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleXShare(guide)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-midnight hover:text-white transition-colors"
                      title="Share on X"
                      aria-label="Share on X"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(guide)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1"
                      title="Copy Link to Clipboard"
                    >
                      {copiedId === guide.id ? (
                        <Check className="w-4 h-4 text-emerald" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-midnight tracking-tight">
                    {guide.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                {/* Key Takeaways Box */}
                <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-midnight block">
                    Essential Underwriting Rules &amp; Checklist:
                  </span>
                  <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
                    {guide.keyTakeaways.map((point, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Direct Action Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-500">
                    <ShieldCheck className="w-4 h-4 text-emerald" />
                    <span>Compliant with RBI Fair Practices &amp; DPDP Act</span>
                  </div>

                  <Link
                    href={`/contact/?resource=${encodeURIComponent(guide.title)}`}
                    className="inline-flex items-center gap-1.5 font-bold text-emerald hover:text-emerald-700 hover:underline"
                  >
                    <span>Request File Pre-Assessment Based on This Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Bottom Callout */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center space-y-4 shadow-sm">
            <h2 className="text-2xl font-extrabold text-midnight">
              Need Personalized Guidance on Your Credit Profile?
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              Our advisory desk at Office No. 421, Walfort Omega, Raipur reviews your requirements across 18+ banks before submitting your file. Zero credit score impact, zero borrower fees.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact/"
                className="px-6 py-3 bg-midnight text-white text-xs font-bold rounded-xl hover:bg-midnight-light transition-colors flex items-center gap-2 shadow-sm"
              >
                <span>Submit Loan Enquiry</span>
                <ArrowRight className="w-4 h-4 text-mint" />
              </Link>
              <a
                href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20have%20read%20your%20resources%20and%20would%20like%20to%20discuss%20a%20loan%20file."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors flex items-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Advisor (+91 95893 52662)</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
