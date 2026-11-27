"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { formatINR } from "@/lib/format";
import { ArrowRight } from "lucide-react";

type LoanCategory = "hl" | "lap" | "pl_proj" | "wc" | "bl" | "pl" | "bt";

interface LoanTypeConfig {
  id: LoanCategory;
  shortName: string;
  name: string;
  type: "Secured" | "Unsecured" | "Secured / Unsecured" | "Refinance";
  defaultAmount: number;
  minAmount: number;
  maxAmount: number;
  stepAmount: number;
  defaultTenureYears: number;
  maxTenureYears: number;
  indicativeRate: number;
  link: string;
}

const LOAN_TYPES: Record<LoanCategory, LoanTypeConfig> = {
  hl: {
    id: "hl",
    shortName: "Home",
    name: "Home Loan",
    type: "Secured",
    defaultAmount: 5000000,
    minAmount: 1000000,
    maxAmount: 50000000,
    stepAmount: 500000,
    defaultTenureYears: 20,
    maxTenureYears: 30,
    indicativeRate: 8.5,
    link: "/loans/home-loan/",
  },
  lap: {
    id: "lap",
    shortName: "LAP",
    name: "Loan Against Property",
    type: "Secured",
    defaultAmount: 10000000,
    minAmount: 2000000,
    maxAmount: 150000000,
    stepAmount: 1000000,
    defaultTenureYears: 15,
    maxTenureYears: 20,
    indicativeRate: 9.25,
    link: "/loans/loan-against-property/",
  },
  pl_proj: {
    id: "pl_proj",
    shortName: "Project",
    name: "New Project Loan",
    type: "Secured",
    defaultAmount: 25000000,
    minAmount: 5000000,
    maxAmount: 250000000,
    stepAmount: 2500000,
    defaultTenureYears: 10,
    maxTenureYears: 12,
    indicativeRate: 9.75,
    link: "/loans/project-loans/",
  },
  wc: {
    id: "wc",
    shortName: "CC / OD",
    name: "Working Capital Limit",
    type: "Secured / Unsecured",
    defaultAmount: 10000000,
    minAmount: 1000000,
    maxAmount: 100000000,
    stepAmount: 1000000,
    defaultTenureYears: 1,
    maxTenureYears: 5,
    indicativeRate: 9.5,
    link: "/loans/working-capital/",
  },
  bl: {
    id: "bl",
    shortName: "Business",
    name: "Business Loan",
    type: "Unsecured",
    defaultAmount: 2500000,
    minAmount: 500000,
    maxAmount: 7500000,
    stepAmount: 250000,
    defaultTenureYears: 3,
    maxTenureYears: 5,
    indicativeRate: 13.5,
    link: "/loans/business-loan/",
  },
  pl: {
    id: "pl",
    shortName: "Personal",
    name: "Personal Loan",
    type: "Unsecured",
    defaultAmount: 1000000,
    minAmount: 100000,
    maxAmount: 4000000,
    stepAmount: 100000,
    defaultTenureYears: 4,
    maxTenureYears: 5,
    indicativeRate: 10.75,
    link: "/loans/personal-loan/",
  },
  bt: {
    id: "bt",
    shortName: "Transfer",
    name: "Balance Transfer",
    type: "Refinance",
    defaultAmount: 6000000,
    minAmount: 1500000,
    maxAmount: 100000000,
    stepAmount: 500000,
    defaultTenureYears: 15,
    maxTenureYears: 25,
    indicativeRate: 8.6,
    link: "/balance-transfer/",
  },
};

export function LoanSimulator() {
  const [selectedProduct, setSelectedProduct] = useState<LoanCategory>("hl");
  const [amount, setAmount] = useState<number>(LOAN_TYPES.hl.defaultAmount);
  const [tenureYears, setTenureYears] = useState<number>(LOAN_TYPES.hl.defaultTenureYears);

  const currentConfig = LOAN_TYPES[selectedProduct];

  const handleProductChange = (newProd: LoanCategory) => {
    setSelectedProduct(newProd);
    setAmount(LOAN_TYPES[newProd].defaultAmount);
    setTenureYears(LOAN_TYPES[newProd].defaultTenureYears);
  };

  const monthlyCost = useMemo(() => {
    if (selectedProduct === "wc") {
      return Math.round((amount * (currentConfig.indicativeRate / 100)) / 12);
    }
    const r = currentConfig.indicativeRate / 12 / 100;
    const n = tenureYears * 12;
    return Math.round((amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }, [amount, tenureYears, currentConfig, selectedProduct]);

  return (
    <div className="bg-white rounded-2xl p-6 text-midnight shadow-xl border border-slate-200 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-emerald uppercase tracking-wider block">
            Quick Estimator
          </span>
          <h2 className="text-lg font-extrabold text-midnight">Explore Loan Options</h2>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
          {currentConfig.type}
        </span>
      </div>

      {/* Product Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {(Object.keys(LOAN_TYPES) as LoanCategory[]).map((key) => {
          const item = LOAN_TYPES[key];
          const isSelected = selectedProduct === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleProductChange(key)}
              className={`py-1.5 px-2.5 rounded-lg text-[11px] font-bold transition-colors ${
                isSelected
                  ? "bg-midnight text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-midnight"
              }`}
            >
              {item.shortName}
            </button>
          );
        })}
      </div>

      {/* Amount Slider */}
      <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-600 font-semibold">Requirement</span>
          <span className="font-mono text-base font-extrabold text-emerald">
            {formatINR(amount)}
          </span>
        </div>
        <input
          type="range"
          min={currentConfig.minAmount}
          max={currentConfig.maxAmount}
          step={currentConfig.stepAmount}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-medium">
          <span>{formatINR(currentConfig.minAmount)}</span>
          <span>{formatINR(currentConfig.maxAmount)}</span>
        </div>
      </div>

      {/* Tenure Pills */}
      {selectedProduct !== "wc" && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 font-semibold">Tenure:</span>
          <div className="flex items-center gap-1.5">
            {[3, 5, 10, 15, 20]
              .filter((y) => y <= currentConfig.maxTenureYears)
              .slice(0, 4)
              .map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setTenureYears(yr)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    tenureYears === yr
                      ? "bg-emerald text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {yr}Y
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Output Summary */}
      <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-400 block">
            {selectedProduct === "wc" ? "Est. Monthly Interest (at full use)" : "Estimated Monthly EMI"}
          </span>
          <span className="text-[10px] text-slate-400">
            Benchmark ~{currentConfig.indicativeRate}% p.a.*
          </span>
        </div>
        <span className="font-mono text-lg font-extrabold text-emerald-400">
          {formatINR(monthlyCost)}/mo
        </span>
      </div>

      <Link
        href={`/contact/?product=${encodeURIComponent(currentConfig.name)}&amount=${amount}`}
        className="w-full py-3 px-4 bg-emerald hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
      >
        <span>Enquire for {currentConfig.name}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
