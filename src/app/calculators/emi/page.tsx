"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { calculateEMI } from "@/lib/finance";
import { formatINR } from "@/lib/format";

export default function EMICalculatorPage() {
  const [amount, setAmount] = useState(4000000);
  const [roi, setRoi] = useState(8.75);
  const [tenureYears, setTenureYears] = useState(20);

  const emi = calculateEMI(amount, roi / 100, tenureYears * 12);
  const totalPayment = emi * tenureYears * 12;
  const totalInterest = totalPayment - amount;

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
            <Link href="/apply/" className="hover:text-teal">Apply</Link>
            <Link href="/auth/login/" className="bg-midnight text-white px-3.5 py-1.5 rounded-md font-medium">Sign in</Link>
          </nav>
        </div>
      </header>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-midnight">Loan EMI Calculator</h1>
            <p className="text-sm text-slate mt-1">Calculate your monthly loan repayment and total interest outflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface p-8 rounded-2xl border border-slate/15 shadow-xs">
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-midnight mb-1">Loan Amount: {formatINR(amount)}</label>
                <input
                  type="range"
                  min="500000"
                  max="30000000"
                  step="250000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full accent-teal cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Interest Rate: {roi.toFixed(2)}% p.a.</label>
                <input
                  type="range"
                  min="7.5"
                  max="16"
                  step="0.05"
                  value={roi}
                  onChange={(e) => setRoi(Number(e.target.value))}
                  className="w-full accent-teal cursor-pointer"
                />
              </div>

              <div>
                <label className="block font-semibold text-midnight mb-1">Tenure: {tenureYears} Years ({tenureYears * 12} Months)</label>
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
            </div>

            <div className="flex flex-col justify-center bg-paper p-6 rounded-xl border border-slate/15 text-center space-y-4">
              <div>
                <span className="text-xs text-slate uppercase tracking-wider block">Monthly EMI</span>
                <span className="text-3xl font-serif font-bold text-midnight tabular-nums block mt-1">
                  {formatINR(emi)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate/15 text-xs">
                <div>
                  <span className="text-slate block">Principal</span>
                  <span className="font-semibold text-midnight tabular-nums">{formatINR(amount)}</span>
                </div>
                <div>
                  <span className="text-slate block">Total Interest</span>
                  <span className="font-semibold text-midnight tabular-nums">{formatINR(totalInterest)}</span>
                </div>
              </div>

              <Link
                href="/apply/"
                className="w-full py-2 bg-midnight text-white text-xs font-semibold rounded-md hover:bg-midnight/90 block"
              >
                Apply for this Loan &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
