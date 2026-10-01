"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, ShieldCheck, Sparkles, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Secured Loans", href: "/loans/secured-loans/" },
  { label: "Unsecured Loans", href: "/loans/unsecured-loans/" },
  { label: "Personal Loans", href: "/loans/personal-loan/" },
  { label: "About Us", href: "/about/" },
  { label: "Team", href: "/team/" },
  { label: "Client Reviews", href: "/reviews/" },
  { label: "Contact & Enquiry", href: "/contact/" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate/15 sticky top-0 z-50">
      {/* Top Notice Bar */}
      <div className="bg-midnight text-white text-[11px] py-1.5 px-4 hidden sm:block border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-semibold text-gold">
              <Sparkles className="w-3 h-3 text-gold" />
              Pan-India Loan Advisory
            </span>
            <span className="text-white/40">&bull;</span>
            <span className="text-white/80">Headquartered in Raipur (C.G.)</span>
            <span className="text-white/40">&bull;</span>
            <span className="text-white/70">Partnered with 18+ Leading National Banks &amp; NBFCs</span>
          </div>

          <div className="flex items-center gap-4 text-white/80">
            <a
              href="https://wa.me/919826100000?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-light transition-colors flex items-center gap-1"
            >
              <span>💬</span> WhatsApp Loan Desk
            </a>
            <span className="text-white/40">&bull;</span>
            <a href="tel:+919826100000" className="hover:text-emerald-light transition-colors flex items-center gap-1">
              <Phone className="w-3 h-3" /> +91 98261 00000
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <Image
            src="/brand/mark.svg"
            alt="Fintara Capital"
            width={38}
            height={38}
            priority
            className="h-9 w-9 rounded-xl shadow-2xs group-hover:scale-105 transition-transform"
          />
          <div>
            <span className="font-bold text-midnight text-lg tracking-tight block leading-tight">
              Fintara<span className="font-medium text-slate ml-1">Capital</span>
            </span>
            <span className="text-[10px] font-bold text-emerald uppercase tracking-widest block">
              Loan Advisory Desk
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
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Button (NO LOGIN BUTTON ON PUBLIC SITE) */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/contact/"
            className="bg-emerald text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-emerald/90 transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 active:scale-95"
          >
            <span>Check Eligibility</span>
            <ArrowRight className="w-3.5 h-3.5 text-white/90" />
          </Link>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-slate hover:text-midnight hover:bg-paper transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-midnight" /> : <Menu className="w-5 h-5 text-midnight" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-surface border-t border-slate/15 px-4 py-4 space-y-3 shadow-lg animate-fadeIn">
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
                      ? "bg-emerald/10 text-emerald"
                      : "text-slate hover:bg-paper hover:text-midnight"
                  )}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate/15 space-y-2">
            <Link
              href="/contact/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 bg-emerald text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <span>Instant Loan Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <a
              href="https://wa.me/919826100000?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
