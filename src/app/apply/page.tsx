"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { DataProvider, useData } from "@/lib/data/store";
import { formatINR, formatINRCompact } from "@/lib/format";
import { isSafeText } from "@/lib/sensitive-guard";
import { CheckCircle2, Shield, AlertTriangle, ArrowRight } from "lucide-react";

function ApplyFormContent() {
  const { addLead, checkDuplicateMobile, today } = useData();

  const [submittedLeadCode, setSubmittedLeadCode] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    amount: "3500000",
    product: "Home Loan",
    locality: "Pandri",
    notes: "",
    consent: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate 10-digit mobile
    const cleanMobile = formData.mobile.replace(/[\s\-\+]/g, "");
    if (!/^\d{10}$/.test(cleanMobile.slice(-10))) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    // Sensitive data guard (No PAN/Aadhaar in notes)
    if (formData.notes && !isSafeText(formData.notes)) {
      setErrorMsg(
        "This looks like a PAN or Aadhaar number. Please don't store it here — our advisor will collect document copies directly."
      );
      return;
    }

    try {
      // Calculate 24-hour follow-up date
      const d = new Date(today);
      d.setDate(d.getDate() + 1);
      const nextFollowup = d.toISOString().split("T")[0];

      const newLead = addLead({
        name: formData.name.trim(),
        mobile: cleanMobile.slice(-10),
        location_area: formData.locality,
        product_id: "p-hl",
        product_name: formData.product,
        amount: Number(formData.amount),
        source: "Website / Online Application",
        status: "New",
        assigned_to: "Staff 1",
        assigned_to_id: "usr-staff1",
        last_contact_on: null,
        next_followup_on: nextFollowup,
        notes: formData.notes
          ? `[Online Enquiry]: ${formData.notes.trim()}`
          : `[Online Enquiry]: Inquired via fintara.capital for ${formData.product}.`,
      });

      setSubmittedLeadCode(newLead.lead_code);
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg("An error occurred while submitting your enquiry. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-surface p-6 sm:p-8 rounded-2xl border border-slate/15 shadow-xs">
      {submittedLeadCode ? (
        <div className="text-center py-8 space-y-4 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-teal/10 text-teal flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="inline-block px-3 py-1 rounded-full bg-paper border border-slate/15 font-mono text-xs font-bold text-midnight">
            Ref: {submittedLeadCode}
          </div>
          <h2 className="font-serif text-2xl font-bold text-midnight">
            Thank you, {formData.name}!
          </h2>
          <p className="text-xs sm:text-sm text-slate max-w-md mx-auto leading-relaxed">
            Your loan enquiry for <strong className="text-midnight">{formData.product}</strong> ({formatINR(Number(formData.amount))}) has been logged in our Raipur desk. A loan officer will call you on <strong className="text-midnight">+91 {formData.mobile}</strong> within 24 hours.
          </p>

          <div className="p-3.5 bg-paper rounded-xl border border-slate/10 text-xs text-slate text-left space-y-1">
            <span className="font-semibold text-midnight block">What happens next?</span>
            <p>1. We verify your credit eligibility and loan requirements.</p>
            <p>2. We compare sanction offers across 18+ partner banks and NBFCs.</p>
            <p>3. Zero consultation fees or upfront processing charges.</p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-midnight text-white text-xs font-semibold rounded-lg hover:bg-midnight/90 transition-colors"
            >
              <span>Back to Home</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal/10 text-teal text-[10px] font-semibold uppercase tracking-wider mb-1.5">
              Rapid Sanction Facilitation
            </div>
            <h1 className="font-serif text-2xl font-bold text-midnight">
              Apply for Loan Assistance
            </h1>
            <p className="text-xs text-slate mt-0.5">
              Doorstep loan processing across Raipur, Shankar Nagar, Pandri &amp; Bhilai.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-crimson/10 border border-crimson/20 text-crimson text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block font-semibold text-midnight mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Alok Verma"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate/20 rounded-lg bg-paper focus:outline-teal font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-midnight mb-1">Mobile Number *</label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={(e) => setFormData((p) => ({ ...p, mobile: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate/20 rounded-lg bg-paper focus:outline-teal font-mono font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-midnight mb-1">Raipur Locality / Area</label>
              <select
                value={formData.locality}
                onChange={(e) => setFormData((p) => ({ ...p, locality: e.target.value }))}
                className="w-full px-3 py-2 text-xs border border-slate/20 rounded-lg bg-paper focus:outline-teal font-medium"
              >
                <option value="Pandri">Pandri</option>
                <option value="Shankar Nagar">Shankar Nagar</option>
                <option value="Telibandha">Telibandha</option>
                <option value="Devendra Nagar">Devendra Nagar</option>
                <option value="Civil Lines">Civil Lines</option>
                <option value="Tatibandh">Tatibandh</option>
                <option value="Bhilai / Durg">Bhilai / Durg</option>
                <option value="Other C.G.">Other Chhattisgarh</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-midnight mb-1">Loan Requirement</label>
            <select
              value={formData.product}
              onChange={(e) => setFormData((p) => ({ ...p, product: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate/20 rounded-lg bg-paper focus:outline-teal font-medium"
            >
              <option value="Home Loan">Home Loan</option>
              <option value="Loan Against Property">Loan Against Property (LAP)</option>
              <option value="Business Loan">Business Loan</option>
              <option value="Working Capital (OD/CC)">Working Capital (OD/CC)</option>
              <option value="Balance Transfer (Takeover)">Balance Transfer (Takeover)</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between font-semibold text-midnight mb-1">
              <span>Required Loan Amount</span>
              <span className="font-mono text-sm">{formatINR(Number(formData.amount))}</span>
            </div>
            <input
              type="range"
              min="500000"
              max="50000000"
              step="500000"
              value={formData.amount}
              onChange={(e) => setFormData((p) => ({ ...p, amount: e.target.value }))}
              className="w-full accent-teal cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate/70 mt-1">
              <span>₹5 Lakhs</span>
              <span>₹5 Crores</span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-midnight mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Existing bank, property details, turnover..."
              value={formData.notes}
              onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
              className="w-full px-3 py-2 text-xs border border-slate/20 rounded-lg bg-paper focus:outline-teal"
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
                I consent to Fintara Capital contacting me regarding loan options under DPDP Act norms. No KYC, Aadhaar or PAN numbers are requested online.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-midnight text-white text-xs font-semibold rounded-lg hover:bg-midnight/90 transition-colors mt-4 shadow-xs"
          >
            Submit Loan Enquiry &rarr;
          </button>
        </form>
      )}
    </div>
  );
}

export default function ApplyPage() {
  return (
    <DataProvider>
      <main className="min-h-dvh bg-paper">
        <header className="bg-white border-b border-slate/10 sticky top-0 z-30">
          <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/brand/mark.svg" alt="Fintara Capital" width={36} height={36} />
              <span className="font-semibold text-midnight text-lg tracking-tight">
                Fintara<span className="font-normal text-slate ml-1">Capital</span>
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm text-slate">
              <Link href="/" className="hover:text-teal">Home</Link>
              <Link href="/calculators/emi/" className="hover:text-teal">EMI Calculator</Link>
              <Link href="/balance-transfer/" className="hover:text-teal">Balance Transfer</Link>
              <Link href="/auth/login/" className="bg-midnight text-white px-3.5 py-1.5 rounded-md font-medium">
                Sign in
              </Link>
            </nav>
          </div>
        </header>

        <section className="py-12 px-4">
          <ApplyFormContent />
        </section>

        <footer className="border-t border-slate/15 bg-white py-8 px-4 text-xs text-slate mt-12">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>&copy; {new Date().getFullYear()} Fintara Capital, Raipur (C.G.). All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy/" className="hover:text-teal">Privacy Policy</Link>
              <Link href="/terms/" className="hover:text-teal">Terms of Service</Link>
              <Link href="/disclosures/" className="hover:text-teal">Disclosures</Link>
            </div>
          </div>
        </footer>
      </main>
    </DataProvider>
  );
}
