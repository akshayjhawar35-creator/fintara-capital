"use client";

import React, { useState } from "react";
import { useData } from "@/lib/data/store";
import {
  Settings,
  Shield,
  Clock,
  Sliders,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Download,
  Database,
  FileText,
  XCircle,
} from "lucide-react";
import { detectSensitiveData, SENSITIVE_DATA_MESSAGE } from "@/lib/sensitive-guard";
import { formatINR } from "@/lib/format";

interface ParsedRow {
  rowNum: number;
  type: "lead" | "client";
  name: string;
  mobile: string;
  amountOrTurnover: number;
  area: string;
  notes: string;
  isValid: boolean;
  errors: string[];
  warnings: string[];
  sensitiveViolation: string | null;
}

export default function AdminSettingsPage() {
  const {
    today,
    reminderWindowDays,
    products,
    leads,
    clients,
    cases,
    loans,
    payouts,
    purgeDemoData,
    restoreDemoData,
    importBatch,
    checkDuplicateMobile,
  } = useData();

  const [testDate, setTestDate] = useState(today);

  // Demo Data state
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeStatusMessage, setPurgeStatusMessage] = useState<string | null>(null);

  // Import Wizard state
  const [importType, setImportType] = useState<"lead" | "client">("lead");
  const [csvContent, setCsvContent] = useState<string>("");
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isSimulated, setIsSimulated] = useState(false);
  const [importResult, setImportResult] = useState<{ imported: number; errors: string[] } | null>(null);

  // Count demo records
  const demoLeadsCount = leads.filter((l) => l.is_demo).length;
  const demoClientsCount = clients.filter((c) => c.is_demo).length;
  const demoCasesCount = cases.filter((c) => c.is_demo).length;
  const demoLoansCount = loans.filter((l) => l.is_demo).length;
  const demoPayoutsCount = payouts.filter((p) => p.is_demo).length;
  const totalDemoRecords =
    demoLeadsCount + demoClientsCount + demoCasesCount + demoLoansCount + demoPayoutsCount;

  // Handle Purge
  const handleConfirmPurge = () => {
    const res = purgeDemoData();
    setShowPurgeModal(false);
    setPurgeStatusMessage(
      `Purge complete! Removed ${res.purgedLeads} leads, ${res.purgedClients} clients, ${res.purgedCases} cases, ${res.purgedLoans} loans, and ${res.purgedPayouts} payouts.`
    );
  };

  const handleConfirmRestore = () => {
    restoreDemoData();
    setPurgeStatusMessage("Demo seed records successfully restored to workspace.");
  };

  // Sample CSV generator & download
  const handleDownloadTemplate = (type: "lead" | "client") => {
    let header = "";
    let sample = "";
    if (type === "lead") {
      header = "Name,Mobile,Amount,LocationArea,ProductName,Source,Notes";
      sample = "Sunil Verma,9826199999,3500000,Shankar Nagar,Home Loan,Direct Referral,Looking for best floating interest rate";
    } else {
      header = "Name,Mobile,ClientType,CityArea,TurnoverOrIncome,Source,Notes";
      sample = "M/s Raipur Agro Tech,9826188888,Company / LLP,Bhanpuri,45000000,Bank Branch Lead,Audited financials available";
    }
    const csvData = `${header}\n${sample}\n`;
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `fintara_${type}_import_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Dry-run simulation of CSV text
  const handleRunSimulation = () => {
    setImportResult(null);
    if (!csvContent.trim()) {
      setParsedRows([]);
      setIsSimulated(false);
      return;
    }

    const lines = csvContent.trim().split(/\r?\n/);
    if (lines.length <= 1) {
      alert("CSV must contain at least a header row and one data row.");
      return;
    }

    const rows: ParsedRow[] = [];

    // Skip header line 0
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(",").map((p) => p.trim());
      const rowNum = i + 1;
      const errors: string[] = [];
      const warnings: string[] = [];
      let sensitiveViolation: string | null = null;

      const name = parts[0] || "";
      const mobile = (parts[1] || "").replace(/\D/g, "");
      const amountStr = parts[2] || "0";
      const area = parts[3] || "";
      const notes = parts.slice(6).join(", ") || parts[5] || "";

      // 1. Mandatory validation
      if (!name) errors.push("Name is required");
      if (!mobile || mobile.length !== 10) errors.push("Mobile must be a 10-digit Indian number");

      // 2. Sensitive data check on free-text notes
      const sensitiveInNotes = detectSensitiveData(line);
      if (sensitiveInNotes) {
        sensitiveViolation = `${sensitiveInNotes} pattern detected. ${SENSITIVE_DATA_MESSAGE}`;
        errors.push(sensitiveViolation);
      }

      // 3. Duplicate check
      if (mobile && mobile.length === 10) {
        const dup = checkDuplicateMobile(mobile);
        if (dup.isDuplicate) {
          warnings.push(`Duplicate mobile: already associated with ${dup.ownerName || "an existing record"}`);
        }
      }

      const numVal = parseFloat(amountStr) || 0;

      rows.push({
        rowNum,
        type: importType,
        name,
        mobile,
        amountOrTurnover: numVal,
        area,
        notes,
        isValid: errors.length === 0,
        errors,
        warnings,
        sensitiveViolation,
      });
    }

    setParsedRows(rows);
    setIsSimulated(true);
  };

  // Commit valid rows
  const handleCommitImport = () => {
    const validRows = parsedRows.filter((r) => r.isValid);
    if (validRows.length === 0) return;

    if (importType === "lead") {
      const leadsPayload = validRows.map((r) => ({
        name: r.name,
        mobile: r.mobile,
        location_area: r.area || "Raipur",
        product_id: "prod-hl",
        product_name: "Home Loan",
        amount: r.amountOrTurnover || 2500000,
        source: "Excel / CSV Import",
        status: "New" as const,
        assigned_to: "Owner",
        assigned_to_id: "usr-owner-001",
        last_contact_on: null,
        next_followup_on: today,
        notes: r.notes || "Imported via Admin Wizard",
      }));

      const res = importBatch({ leads: leadsPayload });
      setImportResult({ imported: res.importedLeads, errors: res.errors });
    } else {
      const clientsPayload = validRows.map((r) => ({
        name: r.name,
        contact_person: r.name,
        mobile: r.mobile,
        email: `${r.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@example.com`,
        city_area: r.area || "Raipur",
        address: `${r.area || "Raipur"}, Chhattisgarh`,
        client_type: "Business Owner" as const,
        turnover: r.amountOrTurnover || 10000000,
        client_since: today,
        relationship_owner: "Owner",
        source: "Excel / CSV Import",
        consent_status: "Pending" as const,
        notes: r.notes || "Imported via Admin Wizard",
      }));

      const res = importBatch({ clients: clientsPayload });
      setImportResult({ imported: res.importedClients, errors: res.errors });
    }

    // Reset wizard input
    setCsvContent("");
    setParsedRows([]);
    setIsSimulated(false);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-serif font-semibold text-midnight">System Settings &amp; Data Hub</h1>
        <p className="text-sm text-slate">
          Admin controls for alerts, Excel import validation, test dates, and data lifecycle management.
        </p>
      </div>

      {purgeStatusMessage && (
        <div className="p-4 bg-teal/10 border border-teal/30 rounded-xl flex items-center justify-between text-teal-800 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-teal" />
            <span>{purgeStatusMessage}</span>
          </div>
          <button
            onClick={() => setPurgeStatusMessage(null)}
            className="text-xs font-semibold hover:underline text-teal"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Excel / CSV Import Wizard Section */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-6">
        <div className="flex items-start justify-between border-b border-slate/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal" />
              <h2 className="text-base font-semibold text-midnight">Excel / CSV Bulk Import Wizard</h2>
            </div>
            <p className="text-xs text-slate mt-1">
              Import leads or clients in bulk with real-time sensitive data defense (blocking raw PAN / Aadhaar numbers) and mobile duplicate inspection.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleDownloadTemplate("lead")}
              className="px-3 py-1.5 bg-paper hover:bg-slate/10 text-midnight text-xs font-medium rounded-lg border border-slate/20 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate" />
              Lead Template
            </button>
            <button
              onClick={() => handleDownloadTemplate("client")}
              className="px-3 py-1.5 bg-paper hover:bg-slate/10 text-midnight text-xs font-medium rounded-lg border border-slate/20 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate" />
              Client Template
            </button>
          </div>
        </div>

        {importResult && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Successfully committed {importResult.imported} records to CRM database!
            </div>
            {importResult.errors.length > 0 && (
              <ul className="list-disc list-inside text-rose-700 mt-2 space-y-0.5">
                {importResult.errors.map((e, idx) => (
                  <li key={idx}>{e}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-midnight">Target Entity:</span>
            <label className="flex items-center gap-1.5 text-xs text-midnight cursor-pointer">
              <input
                type="radio"
                name="importType"
                value="lead"
                checked={importType === "lead"}
                onChange={() => setImportType("lead")}
                className="text-teal focus:ring-teal"
              />
              Leads (New Pipeline Inquiries)
            </label>
            <label className="flex items-center gap-1.5 text-xs text-midnight cursor-pointer">
              <input
                type="radio"
                name="importType"
                value="client"
                checked={importType === "client"}
                onChange={() => setImportType("client")}
                className="text-teal focus:ring-teal"
              />
              Clients (Borrowers / Directory)
            </label>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate mb-1">
              Paste CSV / Tab-separated Data (or type sample records):
            </label>
            <textarea
              rows={4}
              value={csvContent}
              onChange={(e) => {
                setCsvContent(e.target.value);
                setIsSimulated(false);
              }}
              placeholder={
                importType === "lead"
                  ? "Name,Mobile,Amount,LocationArea,ProductName,Source,Notes\nRamesh Agrawal,9826112345,5000000,Civil Lines,Home Loan,Direct,Client looking for fast sanction"
                  : "Name,Mobile,ClientType,CityArea,TurnoverOrIncome,Source,Notes\nShreeji Steels,9826154321,Company / LLP,Urla Industrial,60000000,Referrer,Working capital limits"
              }
              className="w-full font-mono text-xs p-3 border border-slate/20 rounded-xl bg-paper/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={handleRunSimulation}
              disabled={!csvContent.trim()}
              className="px-4 py-2 bg-midnight text-white text-xs font-semibold rounded-xl hover:bg-midnight/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs"
            >
              <UploadCloud className="w-4 h-4 text-gold" />
              Simulate Dry-Run Validation
            </button>

            {isSimulated && (
              <span className="text-xs text-slate">
                Simulated <strong>{parsedRows.length}</strong> rows:{" "}
                <strong className="text-emerald-700 font-semibold">
                  {parsedRows.filter((r) => r.isValid).length} Valid
                </strong>
                ,{" "}
                <strong className="text-rose-600 font-semibold">
                  {parsedRows.filter((r) => !r.isValid).length} Blocked
                </strong>
              </span>
            )}
          </div>
        </div>

        {/* Simulation Report Table */}
        {isSimulated && parsedRows.length > 0 && (
          <div className="space-y-4 border-t border-slate/15 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-midnight uppercase tracking-wider">
                Pre-Import Dry-Run Report
              </h3>
              {parsedRows.some((r) => r.isValid) && (
                <button
                  onClick={handleCommitImport}
                  className="px-4 py-1.5 bg-teal text-white text-xs font-semibold rounded-lg hover:bg-teal/90 transition-colors shadow-xs"
                >
                  Commit {parsedRows.filter((r) => r.isValid).length} Valid Records
                </button>
              )}
            </div>

            <div className="border border-slate/15 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-paper text-slate uppercase text-[10px] tracking-wider border-b border-slate/15">
                  <tr>
                    <th className="py-2.5 px-3">Row</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Mobile</th>
                    <th className="py-2.5 px-3">Value</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Validation &amp; Sensitive Guard Diagnostics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate/10">
                  {parsedRows.map((r) => (
                    <tr
                      key={r.rowNum}
                      className={r.isValid ? "hover:bg-paper/40" : "bg-rose-50/40 hover:bg-rose-50/70"}
                    >
                      <td className="py-2.5 px-3 font-mono text-slate">{r.rowNum}</td>
                      <td className="py-2.5 px-3 font-semibold text-midnight">{r.name}</td>
                      <td className="py-2.5 px-3 font-mono">{r.mobile}</td>
                      <td className="py-2.5 px-3 font-mono">{formatINR(r.amountOrTurnover)}</td>
                      <td className="py-2.5 px-3">
                        {r.isValid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Valid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-semibold">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Blocked
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        {r.errors.length > 0 && (
                          <div className="text-rose-700 text-[11px] font-medium space-y-0.5">
                            {r.errors.map((err, i) => (
                              <div key={i} className="flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span>{err}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {r.warnings.length > 0 && (
                          <div className="text-amber-700 text-[11px] font-medium mt-0.5">
                            {r.warnings.map((warn, i) => (
                              <div key={i}>⚠️ {warn}</div>
                            ))}
                          </div>
                        )}
                        {r.isValid && r.warnings.length === 0 && (
                          <span className="text-slate text-[11px]">Ready for database commit</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Demo Data Management & Hardening Section */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-semibold text-midnight">Demo Data Lifecycle &amp; Purge</h2>
            </div>
            <p className="text-xs text-slate mt-1">
              Safely purge mock/seed test records (`is_demo = true`) when transitioning this installation to live client operations.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPurgeModal(true)}
              disabled={totalDemoRecords === 0}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Purge Demo Data ({totalDemoRecords})
            </button>
            <button
              onClick={handleConfirmRestore}
              className="px-3 py-1.5 bg-paper hover:bg-slate/10 text-midnight text-xs font-semibold rounded-lg border border-slate/20 flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate" />
              Restore Seed Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-paper rounded-xl border border-slate/10">
            <span className="text-slate block text-[11px]">Demo Leads</span>
            <span className="text-base font-semibold text-midnight font-mono">{demoLeadsCount}</span>
          </div>
          <div className="p-3 bg-paper rounded-xl border border-slate/10">
            <span className="text-slate block text-[11px]">Demo Clients</span>
            <span className="text-base font-semibold text-midnight font-mono">{demoClientsCount}</span>
          </div>
          <div className="p-3 bg-paper rounded-xl border border-slate/10">
            <span className="text-slate block text-[11px]">Demo Cases</span>
            <span className="text-base font-semibold text-midnight font-mono">{demoCasesCount}</span>
          </div>
          <div className="p-3 bg-paper rounded-xl border border-slate/10">
            <span className="text-slate block text-[11px]">Demo Loans</span>
            <span className="text-base font-semibold text-midnight font-mono">{demoLoansCount}</span>
          </div>
          <div className="p-3 bg-paper rounded-xl border border-slate/10">
            <span className="text-slate block text-[11px]">Demo Payouts</span>
            <span className="text-base font-semibold text-midnight font-mono">{demoPayoutsCount}</span>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Purge */}
      {showPurgeModal && (
        <div className="fixed inset-0 bg-midnight/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-surface rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate/15 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-midnight">Confirm Demo Data Purge</h3>
                <p className="text-xs text-slate">This action removes all pre-loaded seed records.</p>
              </div>
            </div>

            <p className="text-xs text-slate leading-relaxed">
              Are you sure you want to purge <strong>{totalDemoRecords} sample records</strong> from your active CRM storage? All newly created leads, clients, and cases entered by staff will remain safe and untouched.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPurgeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate hover:text-midnight transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurge}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                Yes, Purge Demo Records
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Core System Configuration */}
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
