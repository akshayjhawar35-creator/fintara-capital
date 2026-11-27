"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Secured Loans", href: "/loans/secured-loans/" },
  { label: "Unsecured Loans", href: "/loans/unsecured-loans/" },
  { label: "Project Loans", href: "/loans/project-loans/" },
  { label: "Working Capital", href: "/loans/working-capital/" },
  { label: "Resources", href: "/resources/" },
  { label: "About", href: "/about/" },
  { label: "Contact", href: "/contact/" },
];

export function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
      {/* Slim Top Info Bar */}
      <div className="bg-midnight text-white text-[11px] py-1.5 px-4 hidden sm:block">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-emerald-400">Pan-India Loan Advisory</span>
            <span className="text-white/25">&bull;</span>
            <span>Office No. 421, Walfort Omega, Raipur (C.G.)</span>
          </div>

          <div className="flex items-center gap-4 text-slate-200">
            <a
              href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>WhatsApp Desk</span>
            </a>
            <span className="text-white/25">&bull;</span>
            <a href="tel:+919589352662" className="hover:text-emerald-400 transition-colors flex items-center gap-1 font-mono">
              <Phone className="w-3 h-3 text-emerald-400" /> +91 95893 52662
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <Image
            src="/brand/mark.svg"
            alt="Fintara Capital"
            width={36}
            height={36}
            priority
            className="h-9 w-9 rounded-xl shadow-xs"
          />
          <div>
            <span className="font-extrabold text-midnight text-lg tracking-tight block leading-tight">
              Fintara<span className="font-medium text-slate-500 ml-1">Capital</span>
            </span>
            <span className="text-[9.5px] font-bold text-emerald uppercase tracking-widest block">
              Loan Advisory
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-600">
          {NAV_LINKS.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-1 transition-colors hover:text-emerald relative whitespace-nowrap",
                  isActive ? "text-emerald font-bold" : "text-slate-600"
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

        {/* Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/contact/"
            className="inline-flex items-center gap-1.5 bg-midnight hover:bg-midnight-light text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors shadow-xs"
          >
            <span>Check Eligibility</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-midnight hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-3 shadow-lg">
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
                      : "text-slate-600 hover:bg-slate-50 hover:text-midnight"
                  )}
                >
                  <span>{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-200 space-y-2">
            <Link
              href="/contact/"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 bg-midnight text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Instant Loan Enquiry</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </Link>

            <a
              href="https://wa.me/919589352662?text=Hi%20Fintara%20Capital,%20I%20would%20like%20to%20enquire%20about%20a%20loan"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald" />
              <span>WhatsApp (+91 95893 52662)</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
