"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { calculateEligibility, calculateEMI } from "@/lib/finance";
import { formatINR } from "@/lib/format";

export default function EligibilityCalculatorPage() {
  const [monthlyIncome, setMonthlyIncome] = useState(150000);
  const [existingEmis, setExistingEmis] = useState(25000);
  const [roi, setRoi] = useState(8.75);
  const [tenureYears, setTenureYears] = useState(20);
  const [foirPercent, setFoirPercent] = useState(55); // Standard 55% for tier-1 & 2 cities

  const eligibleAmount = calculateEligibility(
    monthlyIncome,
    existingEmis,
    foirPercent / 100,
    roi / 100,
    tenureYears * 12
  );

  const eligibleEmi = calculateEMI(eligibleAmount, roi / 100, tenureYears * 12);
  const maxAllowableEmi = Math.max(0, (monthlyIncome * (foirPercent / 100)) - existingEmis);

  return (
    <main className="min-h-dvh bg-paper">
      {/* Header */}
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

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal/10 text-teal text-xs font-semibold uppercase tracking-wider mb-2">
              Borrowing Capacity Tool
            </div>
            <h1 className="font-serif text-3xl font-semibold text-midnight">
              Loan Eligibility Calculator
            </h1>
            <p className="text-sm text-slate mt-1 max-w-2xl leading-relaxed">
              Estimate the maximum loan sanction you can qualify for based on your net in-hand monthly salary or business income and existing obligations (FOIR).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-surface p-6 md:p-8 rounded-2xl border border-slate/15 shadow-xs">
            <div className="space-y-5 text-xs">
              {/* Monthly Income */}
              <div>
                <div className="flex justify-between font-semibold text-midnight mb-1.5">
                  <span>Net Monthly Income</span>
                  <span className="font-mono text-sm">{formatINR(monthlyIncome)}</span>
                </div>
                <input
                  type="range"
                  min="25000"
                  max="1000000"
                  step="5000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full accent-teal cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate/70 mt-1">
                  <span>₹25,000</span>
                  <span>₹10,00,000</span>
                </div>
              </div>

              {/* Existing EMIs */}
              <div>
                <div className="flex justify-between font-semibold text-midnight mb-1.5">
                  <span>Existing Monthly Obligations (EMIs)</span>
                  <span className="font-mono text-sm">{formatINR(existingEmis)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400000"
                  step="2500"
                  value={existingEmis}
                  onChange={(e) => setExistingEmis(Number(e.target.value))}
                  className="w-full accent-teal cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate/70 mt-1">
                  <span>₹0</span>
                  <span>₹4,00,000</span>
                </div>
              </div>

              {/* Expected ROI */}
              <div>
                <div className="flex justify-between font-semibold text-midnight mb-1.5">
                  <span>Expected Interest Rate</span>
                  <span className="font-mono text-sm">{roi.toFixed(2)}% p.a.</span>
                </div>
                <input
                  type="range"
                  min="7.5"
                  max="16.0"
                  step="0.1"
                  value={roi}
                  onChange={(e) => setRoi(Number(e.target.value))}
                  className="w-full accent-teal cursor-pointer"
                />
              </div>

              {/* Tenure */}
              <div>
                <div className="flex justify-between font-semibold text-midnight mb-1.5">
                  <span>Tenure</span>
                  <span className="font-mono text-sm">{tenureYears} Years ({tenureYears * 12} Months)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-teal cursor-pointer"
                />
              </div>

              {/* Bank FOIR standard */}
              <div>
                <label className="block font-semibold text-midnight mb-1">
                  Lender FOIR Threshold: {foirPercent}% of Net Income
                </label>
                <div className="flex gap-2">
                  {[50, 55, 60, 65].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setFoirPercent(val)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                        foirPercent === val
                          ? "bg-midnight text-white border-midnight"
                          : "bg-paper text-slate border-slate/20 hover:border-slate/40"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-slate block mt-1">
                  Banks typically cap total obligations between 50% to 65% depending on gross income tier.
                </span>
              </div>
            </div>

            {/* Results Output */}
            <div className="flex flex-col justify-between bg-paper p-6 rounded-xl border border-slate/15 space-y-6">
              <div className="space-y-4 text-center">
                <div>
                  <span className="text-xs text-slate uppercase tracking-wider block">
                    Estimated Eligible Loan Amount
                  </span>
                  <span className="text-3xl md:text-4xl font-serif font-bold text-midnight tabular-nums block mt-1">
                    {formatINR(eligibleAmount)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-left pt-3 border-t border-slate/15 text-xs">
                  <div className="bg-surface p-3 rounded-lg border border-slate/10">
                    <span className="text-slate block">Max New EMI</span>
                    <span className="font-bold text-teal text-sm tabular-nums">
                      {formatINR(maxAllowableEmi)}/mo
                    </span>
                  </div>
                  <div className="bg-surface p-3 rounded-lg border border-slate/10">
                    <span className="text-slate block">Calculated EMI</span>
                    <span className="font-bold text-midnight text-sm tabular-nums">
                      {formatINR(eligibleEmi)}/mo
                    </span>
                  </div>
                </div>

                <div className="bg-surface p-4 rounded-xl border border-slate/10 text-left text-xs space-y-1.5 text-slate">
                  <p className="font-semibold text-midnight">Boost Your Eligibility:</p>
                  <p>• Add a co-borrower (spouse or business partner) with income.</p>
                  <p>• Foreclose small credit card or personal loans before applying.</p>
                  <p>• Choose a longer tenure to reduce monthly obligation ratio.</p>
                </div>
              </div>

              <div className="space-y-2">
                <Link
                  href="/apply/"
                  className="w-full py-3 bg-midnight text-white text-sm font-semibold rounded-lg hover:bg-midnight/90 text-center block shadow-xs transition-colors"
                >
                  Apply for {formatINR(eligibleAmount)} &rarr;
                </Link>
                <p className="text-[11px] text-center text-slate">
                  Subject to lender underwriting, CIBIL score, and valuation norms.
                </p>
              </div>
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
