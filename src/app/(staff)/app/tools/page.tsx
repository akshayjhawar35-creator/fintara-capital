"use client";

import React, { useState } from "react";
import { calculateEMI, calculateBTSaving, calculateEligibility } from "@/lib/finance";
import { formatINR } from "@/lib/format";
import { Calculator } from "lucide-react";

export default function ToolsPage() {
  // Quick EMI Tool State
  const [amount, setAmount] = useState(2500000);
  const [roi, setRoi] = useState(9.5);
  const [tenureYears, setTenureYears] = useState(15);

  const emi = calculateEMI(amount, roi / 100, tenureYears * 12);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-midnight">Loan Advisory Tools</h1>
        <p className="text-sm text-slate">
          Instant client-side calculators for EMI, balance transfers, and borrowing eligibility.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick EMI Calculator */}
        <div className="bg-surface p-6 rounded-2xl border border-slate/15 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate/10 pb-3">
            <Calculator className="w-5 h-5 text-teal" />
            <h2 className="font-serif text-base font-semibold text-midnight">EMI Calculator</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate mb-1">Loan Principal: {formatINR(amount)}</label>
              <input
                type="range"
                min="500000"
                max="20000000"
                step="100000"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full accent-teal cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate mb-1">Annual Interest Rate: {roi.toFixed(2)}%</label>
              <input
                type="range"
                min="7.5"
                max="18"
                step="0.1"
                value={roi}
                onChange={(e) => setRoi(Number(e.target.value))}
                className="w-full accent-teal cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate mb-1">Tenure: {tenureYears} Years ({tenureYears * 12} Months)</label>
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

            <div className="p-4 bg-paper rounded-xl border border-slate/15 mt-4 text-center">
              <span className="text-xs text-slate uppercase tracking-wider block">Estimated Monthly EMI</span>
              <span className="text-2xl font-serif font-bold text-midnight tabular-nums block mt-1">
                {formatINR(emi)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Balance Transfer Calculator */}
        <div className="bg-surface p-6 rounded-2xl border border-slate/15 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate/10 pb-3">
            <Calculator className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-base font-semibold text-midnight">Balance Transfer Saving Quick Check</h2>
          </div>

          <div className="p-4 bg-paper rounded-xl border border-slate/15 space-y-2 text-xs">
            <p className="text-slate">
              Rule R6 calculates immediate annual interest savings when transferring a loan to a lower-interest lender:
            </p>
            <div className="p-3 bg-surface rounded border border-slate/10 font-mono text-xs text-midnight">
              Saving = Outstanding &times; (Existing ROI &minus; Proposed ROI)
            </div>
            <p className="text-slate">
              For example, transferring ₹55,00,000 from 9.35% to 8.40% yields an annual interest reduction of <strong>₹52,250</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
