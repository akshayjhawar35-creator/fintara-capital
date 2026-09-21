"use client";

import React, { useState } from "react";
import { useData } from "@/lib/data/store";
import { Settings, Shield, Clock, Sliders } from "lucide-react";

export default function AdminSettingsPage() {
  const { today, reminderWindowDays, products } = useData();
  const [testDate, setTestDate] = useState(today);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-midnight">System Settings &amp; Configuration</h1>
        <p className="text-sm text-slate">
          Admin configuration for alerts, market ROI benchmarks, and date overrides.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-6">
        {/* Test Date Override */}
        <div className="border-b border-slate/15 pb-6 space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal" />
            <h2 className="text-sm font-semibold text-midnight">System Test-Date Override (Rule R23)</h2>
          </div>
          <p className="text-xs text-slate">
            Used to simulate any date for acceptance testing and historical audit reconciliation.
          </p>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="px-3 py-1.5 border border-slate/20 rounded-md text-xs font-mono"
            />
            <span className="text-xs text-slate font-medium">
              Current simulation date: <strong className="text-midnight">{testDate}</strong>
            </span>
          </div>
        </div>

        {/* SLA & Alert Windows */}
        <div className="border-b border-slate/15 pb-6 space-y-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-gold" />
            <h2 className="text-sm font-semibold text-midnight">Alert Thresholds (from Workbook)</h2>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-paper rounded-lg border border-slate/10">
              <span className="text-slate block mb-1 font-medium">Reminder Window</span>
              <span className="font-semibold text-midnight text-sm">{reminderWindowDays} days</span>
            </div>
            <div className="p-3 bg-paper rounded-lg border border-slate/10">
              <span className="text-slate block mb-1 font-medium">Stuck Case Threshold</span>
              <span className="font-semibold text-midnight text-sm">10 days</span>
            </div>
            <div className="p-3 bg-paper rounded-lg border border-slate/10">
              <span className="text-slate block mb-1 font-medium">Takeover Minimum Age</span>
              <span className="font-semibold text-midnight text-sm">6 months</span>
            </div>
            <div className="p-3 bg-paper rounded-lg border border-slate/10">
              <span className="text-slate block mb-1 font-medium">Takeover Gap Threshold</span>
              <span className="font-semibold text-midnight text-sm">0.50 pp (0.005)</span>
            </div>
          </div>
        </div>

        {/* Products & Market ROI Benchmarks */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-midnight">Market ROI Benchmarks (Updated Monthly)</h2>
          <div className="border border-slate/15 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-paper text-slate uppercase text-[10px] tracking-wider border-b border-slate/15">
                <tr>
                  <th className="py-2.5 px-4">Product</th>
                  <th className="py-2.5 px-4">Benchmark ROI</th>
                  <th className="py-2.5 px-4">Secured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/10">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-paper/40">
                    <td className="py-2.5 px-4 font-semibold text-midnight">{p.name}</td>
                    <td className="py-2.5 px-4 font-mono font-medium text-teal tabular-nums">
                      {p.market_roi ? `${(p.market_roi * 100).toFixed(2)}%` : "None"}
                    </td>
                    <td className="py-2.5 px-4 text-slate">{p.is_secured ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
