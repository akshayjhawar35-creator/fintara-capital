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
  Save,
  RotateCcw,
  Sparkles,
  Percent,
  Lock,
  Building2,
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
    settings,
    updateSettings,
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

  // Local copy of settings for editing
  const [formSettings, setFormSettings] = useState(settings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

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

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formSettings);
    setSaveSuccessMsg("System settings updated & active across all desk sessions!");
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

  // Reset to Defaults
  const handleResetSettings = () => {
    updateSettings({
      today: "2026-09-20",
      leadSlaHours: 24,
      reminderWindowDays: 7,
      stuckDaysThreshold: 10,
      disbursalWindowDays: 5,
      payoutAgeingSlaDays: 45,
      cibilHomeLoan: 700,
      cibilLap: 680,
      cibilBusinessLoan: 700,
      cibilPersonalLoan: 720,
      maxFoirPercent: 65,
      takeoverMinVintageMonths: 6,
      takeoverMinRoiDiffBps: 50,
      topupMinVintageMonths: 12,
      commHomeLoan: 0.50,
      commLap: 0.85,
      commBusinessLoan: 1.75,
      commPersonalLoan: 1.50,
      consentValidityDays: 365,
      sensitiveGuardEnabled: true,
      auditLoggingEnabled: true,
    });
    setFormSettings((prev) => ({
      ...prev,
      today: "2026-09-20",
      leadSlaHours: 24,
      reminderWindowDays: 7,
      stuckDaysThreshold: 10,
      disbursalWindowDays: 5,
      payoutAgeingSlaDays: 45,
      cibilHomeLoan: 700,
      cibilLap: 680,
      cibilBusinessLoan: 700,
      cibilPersonalLoan: 720,
      maxFoirPercent: 65,
      takeoverMinVintageMonths: 6,
      takeoverMinRoiDiffBps: 50,
      topupMinVintageMonths: 12,
      commHomeLoan: 0.50,
      commLap: 0.85,
      commBusinessLoan: 1.75,
      commPersonalLoan: 1.50,
      consentValidityDays: 365,
      sensitiveGuardEnabled: true,
      auditLoggingEnabled: true,
    }));
    setSaveSuccessMsg("Settings restored to factory defaults.");
    setTimeout(() => setSaveSuccessMsg(null), 4000);
  };

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

      if (!name) errors.push("Name is required");
      if (!mobile || mobile.length !== 10) errors.push("Mobile must be a 10-digit Indian number");

      const sensitiveInNotes = detectSensitiveData(line);
      if (sensitiveInNotes) {
        sensitiveViolation = `${sensitiveInNotes} pattern detected. ${SENSITIVE_DATA_MESSAGE}`;
        errors.push(sensitiveViolation);
      }

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
        assigned_to_id: "usr-owner",
        last_contact_on: null,
        next_followup_on: formSettings.today,
        notes: r.notes || "Imported via bulk CSV wizard.",
      }));

      const res = importBatch({ leads: leadsPayload });
      setImportResult({ imported: res.importedLeads, errors: res.errors });
    } else {
      const clientsPayload = validRows.map((r) => ({
        name: r.name,
        contact_person: r.name,
        mobile: r.mobile,
        email: `${r.name.toLowerCase().replace(/[^a-z0-9]/g, "")}@import.sample`,
        city_area: r.area || "Raipur",
        address: `${r.area || "Raipur"}, Chhattisgarh`,
        client_type: "Salaried" as const,
        client_since: formSettings.today,
        relationship_owner: "Owner",
        source: "Excel / CSV Import",
        consent_status: "Yes" as const,
        consent_channel: "Physical Form" as const,
        consent_date: formSettings.today,
        notes: r.notes || "Imported via bulk CSV wizard.",
      }));

      const res = importBatch({ clients: clientsPayload });
      setImportResult({ imported: res.importedClients, errors: res.errors });
    }

    setCsvContent("");
    setParsedRows([]);
    setIsSimulated(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-6 h-6 text-midnight" />
            <h1 className="text-2xl font-serif font-semibold text-midnight">
              System Settings &amp; Operations
            </h1>
          </div>
          <p className="text-xs text-slate mt-1">
            Configure SLA alert rules, credit cut-offs, lender commissions, DPDP privacy guards &amp; simulation controls.
          </p>
        </div>

        {/* Global Save Action */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetSettings}
            className="px-3 py-2 text-xs font-semibold rounded-xl border border-slate/20 hover:bg-slate/10 text-slate hover:text-midnight transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Defaults
          </button>
          <button
            type="button"
            onClick={handleSaveSettings}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-teal hover:bg-teal/90 text-white transition-all shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-gold" />
            Save All Settings
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-semibold flex items-center gap-2 animate-fadeIn shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* SECTION 1: Operational SLA & TAT Alert Controls */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate/15 pb-3">
          <Clock className="w-4 h-4 text-teal" />
          <h2 className="text-sm font-bold text-midnight uppercase tracking-wider">
            1. Operational Turn-Around Time (TAT) &amp; Alert Windows
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          {/* Lead First Response SLA */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Lead 1st Response SLA
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="72"
                value={formSettings.leadSlaHours}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    leadSlaHours: Number(e.target.value) || 24,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">Hours</span>
            </div>
            <p className="text-[10px] text-slate">Maximum time before a new inquiry is flagged.</p>
          </div>

          {/* Follow-up Reminder Window */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Follow-up Reminder
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="30"
                value={formSettings.reminderWindowDays}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    reminderWindowDays: Number(e.target.value) || 7,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">Days</span>
            </div>
            <p className="text-[10px] text-slate">Days before next touchpoint becomes Due Soon.</p>
          </div>

          {/* Stuck Case Threshold */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Stuck Case Threshold
            </label>
            <div className="relative">
              <input
                type="number"
                min="3"
                max="45"
                value={formSettings.stuckDaysThreshold}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    stuckDaysThreshold: Number(e.target.value) || 10,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">Days</span>
            </div>
            <p className="text-[10px] text-slate">Triggers STUCK alert on pipeline cases (Rule R3).</p>
          </div>

          {/* Expected Disbursal Horizon */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Disbursal Horizon
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="30"
                value={formSettings.disbursalWindowDays}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    disbursalWindowDays: Number(e.target.value) || 5,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">Days</span>
            </div>
            <p className="text-[10px] text-slate">Days to highlight Disbursal Pending cases.</p>
          </div>

          {/* Payout Aging SLA */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Payout Overdue SLA
            </label>
            <div className="relative">
              <input
                type="number"
                min="15"
                max="90"
                value={formSettings.payoutAgeingSlaDays}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    payoutAgeingSlaDays: Number(e.target.value) || 45,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">Days</span>
            </div>
            <p className="text-[10px] text-slate">Flags lender commissions aged beyond threshold.</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: Underwriting Rules & CIBIL Cut-offs */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate/15 pb-3">
          <Shield className="w-4 h-4 text-emerald" />
          <h2 className="text-sm font-bold text-midnight uppercase tracking-wider">
            2. Underwriting Rules &amp; Minimum CIBIL Score Thresholds
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Home Loan CIBIL Min
            </label>
            <input
              type="number"
              min="500"
              max="900"
              value={formSettings.cibilHomeLoan}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  cibilHomeLoan: Number(e.target.value) || 700,
                })
              }
              className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
            />
            <p className="text-[10px] text-slate">Standard cutoff across retail housing lenders.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              LAP CIBIL Min
            </label>
            <input
              type="number"
              min="500"
              max="900"
              value={formSettings.cibilLap}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  cibilLap: Number(e.target.value) || 680,
                })
              }
              className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
            />
            <p className="text-[10px] text-slate">Secured mortgage minimum threshold.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Business Loan CIBIL Min
            </label>
            <input
              type="number"
              min="500"
              max="900"
              value={formSettings.cibilBusinessLoan}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  cibilBusinessLoan: Number(e.target.value) || 700,
                })
              }
              className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
            />
            <p className="text-[10px] text-slate">Unsecured SME banking qualification limit.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Personal Loan CIBIL Min
            </label>
            <input
              type="number"
              min="500"
              max="900"
              value={formSettings.cibilPersonalLoan}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  cibilPersonalLoan: Number(e.target.value) || 720,
                })
              }
              className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
            />
            <p className="text-[10px] text-slate">Salaried digital instant processing cut-off.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Max FOIR / Debt Ceiling
            </label>
            <div className="relative">
              <input
                type="number"
                min="30"
                max="85"
                value={formSettings.maxFoirPercent}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    maxFoirPercent: Number(e.target.value) || 65,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">%</span>
            </div>
            <p className="text-[10px] text-slate">Maximum allowed fixed obligations vs income.</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: Refinancing & Balance Transfer (Takeover) Matrix */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate/15 pb-3">
          <Sliders className="w-4 h-4 text-gold" />
          <h2 className="text-sm font-bold text-midnight uppercase tracking-wider">
            3. Refinancing &amp; Balance Transfer Takeover Matrix
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Min Vintage for Takeover
            </label>
            <div className="relative">
              <input
                type="number"
                min="3"
                max="24"
                value={formSettings.takeoverMinVintageMonths}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    takeoverMinVintageMonths: Number(e.target.value) || 6,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">Months</span>
            </div>
            <p className="text-[10px] text-slate">Rule R8: Minimum active repayment months before BT.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Takeover Trigger Rate Gap
            </label>
            <div className="relative">
              <input
                type="number"
                min="10"
                max="200"
                value={formSettings.takeoverMinRoiDiffBps}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    takeoverMinRoiDiffBps: Number(e.target.value) || 50,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">bps (0.50%)</span>
            </div>
            <p className="text-[10px] text-slate">Minimum interest rate differential triggering Radar alert.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Top-Up Window Vintage
            </label>
            <div className="relative">
              <input
                type="number"
                min="6"
                max="36"
                value={formSettings.topupMinVintageMonths}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    topupMinVintageMonths: Number(e.target.value) || 12,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">Months</span>
            </div>
            <p className="text-[10px] text-slate">Rule R9: Months required before top-up window unlocks.</p>
          </div>
        </div>
      </div>

      {/* SECTION 4: Partner Lender Default Commissions Grid */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate/15 pb-3">
          <Percent className="w-4 h-4 text-emerald" />
          <h2 className="text-sm font-bold text-midnight uppercase tracking-wider">
            4. Institutional Commission Defaults (% of Disbursal Amount)
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Home Loans Commission
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="2.0"
                value={formSettings.commHomeLoan}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    commHomeLoan: parseFloat(e.target.value) || 0.50,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">%</span>
            </div>
            <p className="text-[10px] text-slate">Standard bank payout rate on residential housing.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              LAP Commission
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.05"
                min="0.2"
                max="3.0"
                value={formSettings.commLap}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    commLap: parseFloat(e.target.value) || 0.85,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">%</span>
            </div>
            <p className="text-[10px] text-slate">Mortgage loan against property commission.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Business Loan Commission
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="5.0"
                value={formSettings.commBusinessLoan}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    commBusinessLoan: parseFloat(e.target.value) || 1.75,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">%</span>
            </div>
            <p className="text-[10px] text-slate">Unsecured SME working capital commission.</p>
          </div>

          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Personal Loan Commission
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.5"
                max="4.0"
                value={formSettings.commPersonalLoan}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    commPersonalLoan: parseFloat(e.target.value) || 1.50,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">%</span>
            </div>
            <p className="text-[10px] text-slate">Salaried consumer unsecured loan commission.</p>
          </div>
        </div>
      </div>

      {/* SECTION 5: DPDP 2023 Compliance & Data Protection Shield */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate/15 pb-3">
          <Lock className="w-4 h-4 text-midnight" />
          <h2 className="text-sm font-bold text-midnight uppercase tracking-wider">
            5. Digital Personal Data Protection (DPDP Act 2023) Controls
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div className="space-y-1.5">
            <label className="block font-semibold text-midnight">
              Affirmative Consent Validity
            </label>
            <div className="relative">
              <input
                type="number"
                min="30"
                max="730"
                value={formSettings.consentValidityDays}
                onChange={(e) =>
                  setFormSettings({
                    ...formSettings,
                    consentValidityDays: Number(e.target.value) || 365,
                  })
                }
                className="w-full px-3 py-2 bg-paper/50 border border-slate/20 rounded-xl font-mono text-xs font-bold text-midnight focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal/30"
              />
              <span className="absolute right-3 top-2 text-slate text-[11px]">Days</span>
            </div>
            <p className="text-[10px] text-slate">Annual re-affirmation required after expiration.</p>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-paper rounded-xl border border-slate/15">
            <div>
              <span className="font-semibold text-midnight block">Sensitive Data Regex Shield</span>
              <span className="text-[10px] text-slate">
                Blocks storing raw PAN / Aadhaar in notes &amp; free text.
              </span>
            </div>
            <input
              type="checkbox"
              checked={formSettings.sensitiveGuardEnabled}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  sensitiveGuardEnabled: e.target.checked,
                })
              }
              className="h-4 w-4 rounded text-teal focus:ring-teal cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 bg-paper rounded-xl border border-slate/15">
            <div>
              <span className="font-semibold text-midnight block">Immutable Audit Trail</span>
              <span className="text-[10px] text-slate">
                Logs all stage progressions, reassignments &amp; logins.
              </span>
            </div>
            <input
              type="checkbox"
              checked={formSettings.auditLoggingEnabled}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  auditLoggingEnabled: e.target.checked,
                })
              }
              className="h-4 w-4 rounded text-teal focus:ring-teal cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: System Test-Date Override (Rule R23) */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate/15 pb-3">
          <Clock className="w-4 h-4 text-teal" />
          <h2 className="text-sm font-bold text-midnight uppercase tracking-wider">
            6. System Simulation Date (Rule R23)
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="text-slate leading-relaxed">
              Allows management to simulate any date for portfolio aging verification, SLA testing, and audit validation without altering database records.
            </p>
            <p className="text-[11px] text-slate font-medium mt-1">
              Active Date: <strong className="text-midnight font-mono">{formSettings.today}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="date"
              value={formSettings.today}
              onChange={(e) =>
                setFormSettings({
                  ...formSettings,
                  today: e.target.value,
                })
              }
              className="px-3 py-2 border border-slate/20 rounded-xl text-xs font-mono bg-paper/50 focus:bg-white text-midnight font-bold"
            />
            <button
              type="button"
              onClick={() => {
                const now = new Date().toISOString().split("T")[0];
                setFormSettings({ ...formSettings, today: now });
              }}
              className="px-3 py-2 bg-paper border border-slate/20 rounded-xl text-xs font-semibold hover:bg-slate/10 text-midnight"
            >
              Set Current Real Date
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 7: Excel / CSV Bulk Data Importer */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-teal" />
              <h2 className="text-base font-semibold text-midnight">
                7. Excel &amp; CSV Bulk Data Importer
              </h2>
            </div>
            <p className="text-xs text-slate mt-1">
              Bulk import borrower files from Excel with pre-validation dry-run and automatic DPDP sensitive data scrubbing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadTemplate("lead")}
              className="px-3 py-1.5 bg-paper hover:bg-slate/10 text-midnight text-xs font-semibold rounded-lg border border-slate/20 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal" />
              Leads Template
            </button>
            <button
              onClick={() => handleDownloadTemplate("client")}
              className="px-3 py-1.5 bg-paper hover:bg-slate/10 text-midnight text-xs font-semibold rounded-lg border border-slate/20 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-teal" />
              Clients Template
            </button>
          </div>
        </div>

        {importResult && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Import successful! Added {importResult.imported} records.</span>
            </div>
            {importResult.errors.length > 0 && (
              <ul className="list-disc pl-5 text-amber-900 space-y-0.5 pt-1">
                {importResult.errors.map((err, idx) => (
                  <li key={idx}>{err}</li>
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

      {/* SECTION 8: Demo Data Management & Hardening */}
      <div className="bg-surface rounded-2xl border border-slate/15 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-rose-600" />
              <h2 className="text-base font-semibold text-midnight">
                8. Demo Data Lifecycle &amp; Purge
              </h2>
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

        {purgeStatusMessage && (
          <div className="p-3 bg-paper border border-slate/20 rounded-xl text-xs text-midnight font-medium">
            {purgeStatusMessage}
          </div>
        )}

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
    </div>
  );
}
