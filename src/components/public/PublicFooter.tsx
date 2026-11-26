"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  MessageCircle,
  FileText,
  Sparkles,
} from "lucide-react";

export function PublicFooter() {
  return (
    <footer className="bg-midnight text-white/70 py-14 px-4 text-xs border-t border-white/10 relative overflow-hidden">
      {/* Subtle Ambient Background Mesh */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-mint/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand & Address Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/brand/mark.svg"
                alt="Fintara Capital"
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl shadow-xs"
              />
              <div>
                <span className="font-extrabold text-lg text-white tracking-tight block">
                  Fintara <span className="font-normal text-slate-400">Capital</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-mint font-bold block">
                  Institutional Debt &amp; Loan Desk
                </span>
              </div>
            </Link>

            <p className="max-w-sm text-xs leading-relaxed text-white/60">
              India&apos;s premier loan advisory platform connecting prime and mid-market borrowers to 18+ national banks and AAA-rated NBFCs. Delivering algorithmic rate arbitrage and rapid doorstep disbursals.
            </p>

            {/* Official Contact Coordinates */}
            <div className="text-[11px] text-white/75 space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-mint shrink-0 mt-0.5" />
                <span>
                  <strong>National HQ:</strong> Civil Lines &amp; Pandri Commercial Hub, Raipur, Chhattisgarh &ndash; 492001 (Serving All India)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-mint shrink-0" />
                <a href="tel:+919589352662" className="hover:text-mint transition-colors font-mono">
                  +91 95893 52662
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-mint shrink-0" />
                <a href="mailto:fintaracapital@gmail.com" className="hover:text-mint transition-colors font-mono">
                  fintaracapital@gmail.com
                </a>
              </div>
            </div>

            {/* Verified Social Media Channels */}
            <div className="pt-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-2.5">
                Official Social Profiles
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://linkedin.com/company/fintara-capital"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Fintara Capital on LinkedIn"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 hover:bg-emerald hover:border-emerald hover:text-white transition-all flex items-center justify-center text-white/80"
                  title="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                <a
                  href="https://x.com/fintaracapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Fintara Capital on X (Twitter)"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 hover:bg-emerald hover:border-emerald hover:text-white transition-all flex items-center justify-center text-white/80"
                  title="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                <a
                  href="https://instagram.com/fintara.capital"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Fintara Capital on Instagram"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 hover:bg-emerald hover:border-emerald hover:text-white transition-all flex items-center justify-center text-white/80"
                  title="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                <a
                  href="https://youtube.com/@fintaracapital"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Fintara Capital on YouTube"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/15 hover:bg-emerald hover:border-emerald hover:text-white transition-all flex items-center justify-center text-white/80"
                  title="YouTube"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>

                <a
                  href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp Loan Desk"
                  className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-mint hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center"
                  title="WhatsApp (+91 95893 52662)"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Secured Products Column */}
          <div className="space-y-2.5">
            <p className="text-white font-bold text-xs uppercase tracking-wider">Secured Loans</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/loans/home-loan/" className="hover:text-mint transition-colors">
                  Home Loans
                </Link>
              </li>
              <li>
                <Link href="/loans/loan-against-property/" className="hover:text-mint transition-colors">
                  Loan Against Property (LAP)
                </Link>
              </li>
              <li>
                <Link href="/loans/secured-loans/" className="hover:text-mint transition-colors">
                  Commercial Property Mortgages
                </Link>
              </li>
              <li>
                <Link href="/balance-transfer/" className="hover:text-mint transition-colors">
                  Balance Transfer &amp; Top-up
                </Link>
              </li>
              <li>
                <Link href="/calculators/emi/" className="hover:text-mint transition-colors">
                  EMI Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Unsecured Products Column */}
          <div className="space-y-2.5">
            <p className="text-white font-bold text-xs uppercase tracking-wider">Unsecured Loans</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/loans/business-loan/" className="hover:text-mint transition-colors">
                  Business Loans &amp; MSME
                </Link>
              </li>
              <li>
                <Link href="/loans/personal-loan/" className="hover:text-mint transition-colors">
                  Personal Loans (Prime Salaried)
                </Link>
              </li>
              <li>
                <Link href="/loans/unsecured-loans/" className="hover:text-mint transition-colors">
                  Professional Loans (Doctors/CAs)
                </Link>
              </li>
              <li>
                <Link href="/calculators/eligibility/" className="hover:text-mint transition-colors">
                  Eligibility Calculator
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-mint transition-colors">
                  Instant Loan Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Content Marketing Column */}
          <div className="space-y-2.5">
            <p className="text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <span>Resources &amp; Guides</span>
              <span className="bg-mint/20 text-mint text-[9px] px-1.5 py-0.2 rounded font-mono">NEW</span>
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/resources/" className="hover:text-mint transition-colors font-semibold text-white/90">
                  Loan Cheat Sheets &amp; Hub
                </Link>
              </li>
              <li>
                <Link href="/resources/#home-loan-checklist" className="hover:text-mint transition-colors">
                  Home Loan Document Checklist
                </Link>
              </li>
              <li>
                <Link href="/resources/#lap-guide" className="hover:text-mint transition-colors">
                  LAP Valuation &amp; LTV Guide
                </Link>
              </li>
              <li>
                <Link href="/resources/#cibil-hacks" className="hover:text-mint transition-colors">
                  CIBIL 750+ Optimization Guide
                </Link>
              </li>
              <li>
                <Link href="/articles/" className="hover:text-mint transition-colors">
                  Borrower Insights &amp; Market Rate
                </Link>
              </li>
            </ul>
          </div>

          {/* Firm & Compliance Column (NO LOGIN BUTTON) */}
          <div className="space-y-2.5">
            <p className="text-white font-bold text-xs uppercase tracking-wider">Firm &amp; Legal</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/about/" className="hover:text-mint transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/team/" className="hover:text-mint transition-colors">
                  Executive Advisory Team
                </Link>
              </li>
              <li>
                <Link href="/reviews/" className="hover:text-mint transition-colors">
                  Client Reviews &amp; Case Studies
                </Link>
              </li>
              <li>
                <Link href="/privacy/" className="hover:text-mint transition-colors">
                  Privacy Policy (DPDP Act)
                </Link>
              </li>
              <li>
                <Link href="/terms/" className="hover:text-mint transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclosures/" className="hover:text-mint transition-colors">
                  Statutory Disclosures
                </Link>
              </li>
              <li>
                <Link href="/grievance/" className="hover:text-mint transition-colors">
                  Grievance Redressal Officer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory Disclaimers & Copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/40">
          <p>&copy; {new Date().getFullYear()} Fintara Capital (fintara.capital). All rights reserved.</p>
          <p className="text-center sm:text-right max-w-xl leading-relaxed">
            Fintara Capital is an institutional credit intermediary and loan advisory desk. All loan sanctions, interest rates, valuations, processing charges, and disbursals are strictly governed by partner banks and NBFCs under Reserve Bank of India (RBI) guidelines. Zero raw identity documents are permanently archived.
          </p>
        </div>
      </div>
    </footer>
  );
}
