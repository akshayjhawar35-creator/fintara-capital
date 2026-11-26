"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, Sparkles, Phone, MessageSquare, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Secured Loans", href: "/loans/secured-loans/" },
  { label: "Unsecured Loans", href: "/loans/unsecured-loans/" },
  { label: "Personal Loans", href: "/loans/personal-loan/" },
  { label: "Resources & Guides", href: "/resources/" },
  { label: "Client Reviews", href: "/reviews/" },
  { label: "About Us", href: "/about/" },
  { label: "Team", href: "/team/" },
  { label: "Contact & Enquiry", href: "/contact/" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/85 backdrop-blur-xl border-b border-slate-200/70 sticky top-0 z-50 transition-all">
      {/* Top Venture Trust Bar */}
      <div className="bg-midnight text-white text-[11px] py-1.5 px-4 hidden sm:block border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-mint">
              <Sparkles className="w-3 h-3 text-mint animate-pulse" />
              Pan-India Loan Advisory
            </span>
            <span className="text-white/30">&bull;</span>
            <span className="text-white/80">National HQ in Raipur (C.G.)</span>
            <span className="text-white/30">&bull;</span>
            <span className="text-white/70">Partnered with 18+ National Banks &amp; NBFCs</span>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <a
              href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-mint transition-colors flex items-center gap-1"
            >
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping mr-0.5" />
              <span>WhatsApp Desk</span>
            </a>
            <span className="text-white/30">&bull;</span>
            <a href="tel:+919589352662" className="hover:text-mint transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3 text-mint" /> +91 95893 52662
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="relative">
            <Image
              src="/brand/mark.svg"
              alt="Fintara Capital"
              width={38}
              height={38}
              priority
              className="h-9 w-9 rounded-xl shadow-xs group-hover:scale-105 transition-transform"
            />
            <div className="absolute -inset-0.5 bg-mint/20 rounded-xl blur-xs -z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <span className="font-extrabold text-midnight text-lg tracking-tight block leading-tight">
              Fintara<span className="font-medium text-slate-500 ml-1">Capital</span>
            </span>
            <span className="text-[9.5px] font-bold text-emerald uppercase tracking-widest block">
              Institutional Debt Desk
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-semibold text-slate">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-1 transition-colors hover:text-emerald relative",
                  isActive ? "text-emerald font-bold" : "text-slate"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button (NO LOGIN BUTTON ON PUBLIC SITE) */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/contact/"
            className="group relative inline-flex items-center gap-1.5 bg-midnight hover:bg-midnight-light text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 border border-white/10"
          >
            <span>Check Eligibility</span>
            <ArrowRight className="w-3.5 h-3.5 text-mint group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate hover:text-midnight hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-midnight" /> : <Menu className="w-5 h-5 text-midnight" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 px-4 py-4 space-y-3 shadow-xl animate-fadeIn">
          <div className="grid grid-cols-1 gap-1">
            {NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors",
                    isActive
                      ? "bg-emerald/10 text-emerald font-bold"
                      : "text-slate hover:bg-slate-50 hover:text-midnight"
                  )}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200/80 space-y-2">
            <Link
              href="/contact/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 bg-midnight text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Instant Loan Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5 text-mint" />
            </Link>

            <a
              href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald" />
              <span>Chat on WhatsApp (+91 95893 52662)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
