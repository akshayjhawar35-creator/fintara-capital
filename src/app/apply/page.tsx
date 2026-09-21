"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatINR, formatINRCompact } from "@/lib/format";
import { CheckCircle2 } from "lucide-react";

export default function ApplyPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    amount: "3000000",
    product: "Home Loan",
    city: "Raipur",
    consent: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-dvh bg-paper">
      <header className="bg-white border-b border-slate/10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/brand/mark.svg" alt="Fintara Capital" width={36} height={36} />
            <span className="font-semibold text-midnight text-lg tracking-tight">
              Fintara<span className="font-normal text-slate ml-1">Capital</span>
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-slate">
            <Link href="/" className="hover:text-teal">Home</Link>
            <Link href="/auth/login/" className="bg-midnight text-white px-3.5 py-1.5 rounded-md font-medium">Sign in</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-xl mx-auto bg-surface p-8 rounded-2xl border border-slate/15 shadow-xs">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-semibold text-midnight">Thank you, {formData.name}!</h2>
              <p className="text-xs text-slate max-w-md mx-auto leading-relaxed">
                Your loan inquiry for {formData.product} has been received. Our loan advisor in Raipur will contact you on {formData.mobile} within 24 hours.
              </p>
              <Link href="/" className="inline-block text-xs font-semibold text-teal hover:underline pt-2">
                &larr; Back to Home
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h1 className="font-serif text-2xl font-semibold text-midnight">Check Loan Eligibility</h1>
                <p className="text-xs text-slate">Free, neutral loan comparison across 18+ lenders.</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-midnight mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alok Verma"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-midnight mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  value={formData.mobile}
                  onChange={(e) => setFormData((p) => ({ ...p, mobile: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-midnight mb-1">Loan Type</label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData((p) => ({ ...p, product: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate/20 rounded-md focus:ring-2 focus:ring-teal bg-surface"
                >
                  <option value="Home Loan">Home Loan</option>
                  <option value="Loan Against Property">Loan Against Property (LAP)</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Working Capital (OD/CC)">Working Capital (OD/CC)</option>
                  <option value="Balance Transfer">Balance Transfer (Takeover)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-midnight mb-1">
                  Required Loan Amount: {formatINR(parseFloat(formData.amount) || 0)} ({formatINRCompact(parseFloat(formData.amount) || 0)})
                </label>
                <input
                  type="range"
                  min="500000"
                  max="30000000"
                  step="500000"
                  value={formData.amount}
                  onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
                  className="w-full accent-teal cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-start gap-2 text-[11px] text-slate cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consent}
                    onChange={(e) => setFormData((p) => ({ ...p, consent: e.target.checked }))}
                    className="mt-0.5 accent-teal"
                  />
                  <span>
                    I consent to Fintara Capital contacting me regarding loan options per DPDP Act guidelines. No KYC or personal ID numbers are requested online.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-midnight text-white text-sm font-semibold rounded-md hover:bg-midnight/90 transition-colors mt-4"
              >
                Submit Loan Enquiry
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
