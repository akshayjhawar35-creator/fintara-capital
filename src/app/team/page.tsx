import Link from "next/link";
import Image from "next/image";
import {
  Users,
  Briefcase,
  Shield,
  Phone,
  Mail,
  ArrowRight,
  CheckCircle2,
  Building,
} from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = {
  title: "Our Team & Leadership | Fintara Capital",
  description:
    "Meet the experienced credit underwriters, mortgage strategists, and banking desk officers at Fintara Capital serving borrowers across India.",
};

interface TeamMember {
  name: string;
  role: string;
  focusArea: string;
  experience: string;
  bio: string;
  initials: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Akshay Jhawar",
    role: "Managing Director & Principal Advisor",
    focusArea: "Strategic Lenders, High-Ticket LAP & Corporate BT",
    experience: "12+ Years Financial Advisory",
    bio: "Leads institutional lender tie-ups and complex debt structuring across commercial, industrial, and high-net-worth borrowing files nationwide.",
    initials: "AJ",
  },
  {
    name: "Senior Credit Underwriting Desk",
    role: "Head of Credit Evaluation & Risk",
    focusArea: "Balance Sheet Assessment & Banking Eligibility",
    experience: "10+ Years Banking Credit",
    bio: "Analyzes borrower financials, GST credit ratios, and debt servicing metrics to pre-qualify cases before submission to partner banks.",
    initials: "CU",
  },
  {
    name: "National Mortgage & Home Loan Desk",
    role: "Lead — Retail & Housing Finance",
    focusArea: "Home Loans, Resale Purchases, Construction & Plot Loans",
    experience: "8+ Years Retail Mortgage",
    bio: "Coordinates legal scrutiny, property title clearance, and banker relationship management across 18+ national housing finance institutions.",
    initials: "HL",
  },
  {
    name: "SME & Commercial Loans Lead",
    role: "Desk Officer — Business & Working Capital",
    focusArea: "Secured & Unsecured Business Loans, Machinery Finance",
    experience: "9+ Years Commercial Lending",
    bio: "Specializes in tailor-made cash credit (CC), overdraft (OD), and fast-track unsecured business funding for manufacturers, traders, and service providers.",
    initials: "BL",
  },
];

export default function TeamPage() {
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
            <Link href="/about/" className="hover:text-emerald transition-colors">About Us</Link>
            <Link href="/loans/secured-loans/" className="hover:text-emerald transition-colors">Secured Loans</Link>
            <Link href="/loans/unsecured-loans/" className="hover:text-emerald transition-colors">Unsecured Loans</Link>
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
      <section className="fintech-gradient-hero text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
            <Users className="w-3.5 h-3.5" />
            Credit Experts &bull; Banking Veterans &bull; Client Advocates
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-semibold leading-tight">
            Meet the Advisory Team
          </h1>
          <p className="text-white/80 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Our team brings decades of combined experience across national retail banks, credit rating desks, and mortgage institutions to get your loan structured and sanctioned.
          </p>
        </div>
      </section>

      {/* Team Cards Grid */}
      <section className="py-16 px-4 max-w-6xl mx-auto space-y-12">
        <div className="grid sm:grid-cols-2 gap-8">
          {TEAM_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="fintech-card p-6 rounded-2xl space-y-4 relative overflow-hidden flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-midnight text-gold flex items-center justify-center font-serif text-xl font-bold border border-gold/30 shadow-xs shrink-0">
                    {member.initials}
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-midnight">{member.name}</h2>
                    <p className="text-xs font-medium text-emerald">{member.role}</p>
                    <p className="text-[11px] text-slate">{member.experience}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate/10">
                  <div className="text-[11px] font-semibold text-slate uppercase tracking-wider mb-1">
                    Specialization
                  </div>
                  <p className="text-xs font-medium text-midnight bg-paper px-3 py-1.5 rounded-lg border border-slate/15 inline-block">
                    {member.focusArea}
                  </p>
                </div>

                <p className="text-xs text-slate leading-relaxed pt-1">
                  {member.bio}
                </p>
              </div>

              <div className="pt-4 border-t border-slate/10 flex items-center justify-between text-xs text-slate">
                <span className="flex items-center gap-1.5 text-emerald font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald" />
                  Active Pan-India Advisory
                </span>
                <Link
                  href="/apply/"
                  className="font-semibold text-midnight hover:text-emerald transition-colors flex items-center gap-1"
                >
                  Consult Desk &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Our Code of Conduct */}
        <div className="bg-surface rounded-2xl border border-slate/15 p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-midnight text-gold flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-semibold text-midnight">Our Ethical Advisory Charter</h3>
              <p className="text-xs text-slate">How our advisory team works with every client</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 text-xs text-slate leading-relaxed">
            <div className="space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">1. Transparent Evaluation</span>
              <p>We present genuine eligibility realities. If a loan structure has risk, we tell you up front before filing formal applications.</p>
            </div>
            <div className="space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">2. Single-File Protection</span>
              <p>We do not scatter your CIBIL score with simultaneous multiple logins. We shortlist the top 1-2 matching lenders first.</p>
            </div>
            <div className="space-y-1.5">
              <span className="font-semibold text-midnight text-sm block">3. Complete End-to-End Delivery</span>
              <p>From pre-sanction query clearing to final document execution and check handover, our desk stays engaged until funds hit your account.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4 space-y-3">
          <h3 className="font-serif text-2xl font-semibold text-midnight">Have a Loan Requirement to Discuss?</h3>
          <p className="text-xs sm:text-sm text-slate max-w-md mx-auto">
            Speak directly with an advisor on our desk. Zero fee, neutral guidance across 18+ lenders.
          </p>
          <div className="pt-2">
            <Link
              href="/apply/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-midnight text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-midnight/90 shadow-sm transition-all"
            >
              Get Expert Advisory
              <ArrowRight className="w-4 h-4 text-gold" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
