"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { calculateBTDetailed, calculateEMI } from "@/lib/finance";
import { formatINR } from "@/lib/format";

export default function BalanceTransferPage() {
  const [outstanding, setOutstanding] = useState(5000000);
  const [existingRoi, setExistingRoi] = useState(10.25);
  const [proposedRoi, setProposedRoi] = useState(8.60);
  const [remainingTenureYears, setRemainingTenureYears] = useState(15);
  const [processingFee, setProcessingFee] = useState(15000);

  const btResult = calculateBTDetailed(
    outstanding,
    existingRoi / 100,
    proposedRoi / 100,
    processingFee,
    0
  );

  const existingEmi = calculateEMI(outstanding, existingRoi / 100, remainingTenureYears * 12);
  const proposedEmi = calculateEMI(outstanding, proposedRoi / 100, remainingTenureYears * 12);
  const monthlySaving = Math.max(0, existingEmi - proposedEmi);

  return (
    <main className="min-h-dvh bg-paper">
      {/* Public Header */}
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
            <Link href="/apply/" className="hover:text-teal">Apply</Link>
            <Link href="/auth/login/" className="bg-midnight text-white px-3.5 py-1.5 rounded-md font-medium">
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero & Intro */}
      <section className="py-12 px-4 max-w-5xl mx-auto space-y-8">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gold/10 text-gold-dark text-xs font-semibold uppercase tracking-wider mb-2">
            Smart Debt Restructuring
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-midnight">
            Loan Balance Transfer & Takeover
          </h1>
          <p className="text-sm md:text-base text-slate mt-2 max-w-2xl leading-relaxed">
            Switch your existing Home Loan or Loan Against Property to competitive market rates.
            Fintara Capital negotiates with 30+ leading banks and HFCs across Raipur and Chhattisgarh to reduce your monthly EMI and secure top-up capital.
          </p>
        </div>

        {/* Interactive BT Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-surface p-6 md:p-8 rounded-2xl border border-slate/15 shadow-xs">
          <div className="lg:col-span-7 space-y-6 text-xs">
            <h2 className="font-serif text-lg font-bold text-midnight pb-2 border-b border-slate/10">
              Calculate Your Balance Transfer Savings
            </h2>

            <div>
              <div className="flex justify-between font-semibold text-midnight mb-1.5">
                <span>Existing Outstanding Loan</span>
                <span className="font-mono text-sm">{formatINR(outstanding)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="50000000"
                step="500000"
                value={outstanding}
                onChange={(e) => setOutstanding(Number(e.target.value))}
                className="w-full accent-teal cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-slate/70 mt-1">
                <span>₹10 Lakhs</span>
                <span>₹5 Crores</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-midnight mb-1">
                  Current ROI (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="6.0"
                  max="20.0"
                  value={existingRoi}
                  onChange={(e) => setExistingRoi(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate/20 text-sm font-medium focus:outline-teal"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">
                  Proposed New ROI (% p.a.)
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="6.0"
                  max="20.0"
                  value={proposedRoi}
                  onChange={(e) => setProposedRoi(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate/20 text-sm font-medium focus:outline-teal"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-midnight mb-1">
                  Remaining Tenure ({remainingTenureYears} Years)
                </label>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={remainingTenureYears}
                  onChange={(e) => setRemainingTenureYears(Number(e.target.value))}
                  className="w-full accent-teal cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">
                  Est. Switch / Legal Charges
                </label>
                <input
                  type="number"
                  step="1000"
                  min="0"
                  max="200000"
                  value={processingFee}
                  onChange={(e) => setProcessingFee(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate/20 text-sm font-medium focus:outline-teal"
                />
              </div>
            </div>

            <div className="bg-paper p-4 rounded-xl border border-slate/10 text-xs text-slate space-y-1">
              <p className="font-semibold text-midnight">Why Balance Transfer with Fintara?</p>
              <p>• Zero prepayment penalty on floating-rate individual home loans (RBI guidelines).</p>
              <p>• Consolidated doorstep document pickup and lender coordination in Raipur.</p>
              <p>• Opportunity to unlock additional Top-up funds at home loan interest rates.</p>
            </div>
          </div>

          {/* Results Card */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-paper p-6 rounded-xl border border-slate/15 space-y-6">
            <div className="space-y-4 text-center">
              <div className="p-4 bg-teal/5 border border-teal/20 rounded-xl">
                <span className="text-xs text-teal font-semibold uppercase tracking-wider block">
                  Est. Annual Interest Saved
                </span>
                <span className="text-3xl font-serif font-bold text-teal tabular-nums block mt-1">
                  {formatINR(btResult.annualSaving)}
                </span>
                <span className="text-xs text-slate mt-1 block">
                  ROI reduction of {(existingRoi - proposedRoi).toFixed(2)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-left pt-2 border-t border-slate/15 text-xs">
                <div className="bg-surface p-3 rounded-lg border border-slate/10">
                  <span className="text-slate block">Current EMI</span>
                  <span className="font-bold text-midnight text-sm tabular-nums">
                    {formatINR(existingEmi)}
                  </span>
                </div>
                <div className="bg-surface p-3 rounded-lg border border-slate/10">
                  <span className="text-slate block">New Monthly EMI</span>
                  <span className="font-bold text-teal text-sm tabular-nums">
                    {formatINR(proposedEmi)}
                  </span>
                </div>
              </div>

              <div className="bg-surface p-3 rounded-lg border border-slate/10 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate">Monthly Cashflow Gain:</span>
                  <span className="font-semibold text-midnight tabular-nums">{formatINR(monthlySaving)}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate">Net Year 1 Saving:</span>
                  <span className="font-semibold text-teal tabular-nums">{formatINR(btResult.netFirstYearSaving)}</span>
                </div>
                {btResult.breakEvenMonths && (
                  <div className="flex justify-between">
                    <span className="text-slate">Break-even Period:</span>
                    <span className="font-semibold text-midnight">{btResult.breakEvenMonths} months</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Link
                href="/apply/"
                className="w-full py-3 bg-midnight text-white text-sm font-semibold rounded-lg hover:bg-midnight/90 text-center block shadow-xs transition-colors"
              >
                Initiate Balance Transfer &rarr;
              </Link>
              <p className="text-[11px] text-center text-slate">
                No upfront consultation fee. Advisory backed by accredited Raipur banking partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate/15 bg-white py-8 px-4 text-xs text-slate mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Fintara Capital, Raipur (C.G.). All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy/" className="hover:text-teal">Privacy Policy</Link>
            <Link href="/terms/" className="hover:text-teal">Terms of Service</Link>
            <Link href="/disclosures/" className="hover:text-teal">Regulatory Disclosures</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
