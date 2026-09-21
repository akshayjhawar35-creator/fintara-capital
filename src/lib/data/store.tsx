"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Lead,
  Client,
  Banker,
  ContactLogEntry,
  Product,
  CaseItem,
  CaseSubmission,
  StageDefinition,
  StageName,
  LoanItem,
  PayoutItem,
  PayoutGridItem,
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  BANKERS as INITIAL_BANKERS,
  INITIAL_CONTACT_LOGS,
  INITIAL_CASES,
  INITIAL_LOANS,
  INITIAL_PAYOUTS,
  INITIAL_PAYOUT_GRID,
  STAGE_DEFINITIONS,
  PRODUCTS,
  LENDERS,
} from "./mock-data";
import { calculateEMI, calculateOutstanding } from "@/lib/finance";

export type FollowupAlert = "OVERDUE" | "DUE TODAY" | "DUE SOON" | "OK" | "NO FOLLOW-UP SET";

export interface CaseAlertInfo {
  followupAlert: FollowupAlert;
  followupDaysDiff: number;
  isStuck: boolean;
  daysInStage: number;
  isDisbursalSoon: boolean;
  daysToDisbursal?: number;
  btSaving?: number; // Annual saving (R6)
}

export interface LoanMathResult {
  monthsElapsed: number;
  emi: number;
  estOutstanding: number;
  isMatured: boolean;
  takeover: {
    isCandidate: boolean;
    marketRoi: number | null;
    roiGap: number;
    estAnnualSaving: number;
  };
  topup: {
    isOpen: boolean;
    opensDateStr: string;
  };
  review: {
    status: "OVERDUE" | "DUE TODAY" | "DUE SOON" | "OK";
    daysDiff: number;
    nextReviewDue: string;
  };
  payout?: PayoutItem;
  payoutAgeingDays: number;
  isPayoutOverdue: boolean;
}

export interface DataContextType {
  leads: Lead[];
  clients: Client[];
  cases: CaseItem[];
  loans: LoanItem[];
  payouts: PayoutItem[];
  payoutGrid: PayoutGridItem[];
  bankers: Banker[];
  contactLogs: ContactLogEntry[];
  products: Product[];
  lenders: typeof LENDERS;
  stages: StageDefinition[];
  today: string; // ISO date YYYY-MM-DD
  reminderWindowDays: number;
  addLead: (lead: Omit<Lead, "id" | "lead_code" | "created_at" | "is_demo">) => Lead;
  updateLeadStatus: (leadId: string, status: Lead["status"]) => void;
  updateLeadFollowup: (leadId: string, nextDate: string | null) => void;
  checkDuplicateMobile: (mobile: string, excludeId?: string) => { isDuplicate: boolean; ownerName?: string };
  addClient: (client: Omit<Client, "id" | "client_code" | "created_at" | "is_demo" | "active_loans_count" | "open_cases_count">) => Client;
  revokeConsent: (clientId: string) => void;
  addContactLog: (entry: Omit<ContactLogEntry, "id">) => void;
  getFollowupAlert: (nextFollowupOn: string | null) => { alert: FollowupAlert; daysDiff: number };
  // Case Actions (Phase 3)
  addCase: (caseData: Omit<CaseItem, "id" | "case_code" | "created_at" | "is_demo">) => CaseItem;
  updateCaseStage: (
    caseId: string,
    newStage: StageName,
    options?: {
      loginDate?: string;
      sanctionedAmount?: number;
      sanctionDate?: string;
      rejectionReason?: string;
      notes?: string;
    }
  ) => { success: boolean; error?: string };
  updateCaseFollowup: (caseId: string, nextDate: string | null) => void;
  getCaseAlerts: (caseItem: CaseItem) => CaseAlertInfo;
  // Portfolio & Money Actions (Phase 4)
  getLoanMath: (loan: LoanItem) => LoanMathResult;
  addLoan: (loan: Omit<LoanItem, "id" | "loan_code" | "is_demo">) => LoanItem;
  updateLoanReview: (loanId: string, reviewDate?: string) => void;
  updatePayout: (payoutId: string, updates: Partial<PayoutItem>) => void;
  createBTCaseFromLoan: (loanId: string) => CaseItem;
  // Reassignment & Quick Edit Actions (Owner / Supervision)
  reassignLead: (leadId: string, newAssignee: string) => void;
  reassignCase: (caseId: string, newAssignee: string) => void;
  reassignClient: (clientId: string, newAssignee: string) => void;
  reassignLoan: (loanId: string, newAssignee: string) => void;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  updateCase: (caseId: string, updates: Partial<CaseItem>) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  // Settings & Configuration
  settings: DeskSettings;
  updateSettings: (updates: Partial<DeskSettings>) => void;
  // Admin & Migration Actions (Phase 7)
  purgeDemoData: () => { purgedLeads: number; purgedClients: number; purgedCases: number; purgedLoans: number; purgedPayouts: number };
  restoreDemoData: () => void;
  importBatch: (payload: {
    leads?: Array<Omit<Lead, "id" | "lead_code" | "created_at" | "is_demo">>;
    clients?: Array<Omit<Client, "id" | "client_code" | "created_at" | "is_demo" | "active_loans_count" | "open_cases_count">>;
  }) => { importedLeads: number; importedClients: number; errors: string[] };
}

export interface DeskSettings {
  today: string;
  leadSlaHours: number;
  reminderWindowDays: number;
  stuckDaysThreshold: number;
  disbursalWindowDays: number;
  payoutAgeingSlaDays: number;
  // CIBIL & Underwriting Cutoffs
  cibilHomeLoan: number;
  cibilLap: number;
  cibilBusinessLoan: number;
  cibilPersonalLoan: number;
  maxFoirPercent: number;
  // Refinancing & BT Matrix
  takeoverMinVintageMonths: number;
  takeoverMinRoiDiffBps: number;
  topupMinVintageMonths: number;
  // Lender Commission Defaults (%)
  commHomeLoan: number;
  commLap: number;
  commBusinessLoan: number;
  commPersonalLoan: number;
  // DPDP & Privacy
  consentValidityDays: number;
  sensitiveGuardEnabled: boolean;
  auditLoggingEnabled: boolean;
}

export const DEFAULT_SETTINGS: DeskSettings = {
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
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = "fintara_crm_data_v1";

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<DeskSettings>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${STORAGE_KEY}_settings`);
      if (saved) {
        try {
          return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_SETTINGS;
  });

  const today = settings.today;
  const reminderWindowDays = settings.reminderWindowDays;
  const stuckDaysThreshold = settings.stuckDaysThreshold;

  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${STORAGE_KEY}_leads`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return INITIAL_LEADS;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${STORAGE_KEY}_clients`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return INITIAL_CLIENTS;
  });

  const [cases, setCases] = useState<CaseItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${STORAGE_KEY}_cases`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return INITIAL_CASES;
  });

  const [loans, setLoans] = useState<LoanItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${STORAGE_KEY}_loans`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return INITIAL_LOANS;
  });

  const [payouts, setPayouts] = useState<PayoutItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${STORAGE_KEY}_payouts`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* fallback */ }
      }
    }
    return INITIAL_PAYOUTS;
  });

  const [payoutGrid] = useState<PayoutGridItem[]>(INITIAL_PAYOUT_GRID);
  const [bankers, setBankers] = useState<Banker[]>(INITIAL_BANKERS);
  const [contactLogs, setContactLogs] = useState<ContactLogEntry[]>(INITIAL_CONTACT_LOGS);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${STORAGE_KEY}_leads`, JSON.stringify(leads));
    }
  }, [leads]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${STORAGE_KEY}_clients`, JSON.stringify(clients));
    }
  }, [clients]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${STORAGE_KEY}_cases`, JSON.stringify(cases));
    }
  }, [cases]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${STORAGE_KEY}_loans`, JSON.stringify(loans));
    }
  }, [loans]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${STORAGE_KEY}_payouts`, JSON.stringify(payouts));
    }
  }, [payouts]);

  // Calculate SLA Alert: R1 rule
  const getFollowupAlert = (nextFollowupOn: string | null): { alert: FollowupAlert; daysDiff: number } => {
    if (!nextFollowupOn) {
      return { alert: "NO FOLLOW-UP SET", daysDiff: 0 };
    }
    const target = new Date(nextFollowupOn);
    const curr = new Date(today);
    const diffTime = target.getTime() - curr.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { alert: "OVERDUE", daysDiff: Math.abs(diffDays) };
    }
    if (diffDays === 0) {
      return { alert: "DUE TODAY", daysDiff: 0 };
    }
    if (diffDays <= reminderWindowDays) {
      return { alert: "DUE SOON", daysDiff: diffDays };
    }
    return { alert: "OK", daysDiff: diffDays };
  };

  // Case Health & Alert Rules (R3, R4, R6)
  const getCaseAlerts = (c: CaseItem): CaseAlertInfo => {
    const { alert, daysDiff } = getFollowupAlert(c.next_followup_on);

    // Rule R3: Stuck in stage > 10 days
    const stageUpdated = new Date(c.primary_submission.stage_updated_on);
    const currDate = new Date(today);
    const daysInStage = Math.max(
      0,
      Math.round((currDate.getTime() - stageUpdated.getTime()) / (1000 * 60 * 60 * 24))
    );
    const isStuck = daysInStage > stuckDaysThreshold && c.primary_submission.stage !== "Disbursed" && c.primary_submission.stage !== "Rejected" && c.primary_submission.stage !== "Dropped / Lost";

    // Rule R4: Disbursal due soon (within 30 days)
    let isDisbursalSoon = false;
    let daysToDisbursal: number | undefined;
    if (c.primary_submission.expected_disbursal_date) {
      const disbursalDate = new Date(c.primary_submission.expected_disbursal_date);
      daysToDisbursal = Math.round(
        (disbursalDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysToDisbursal >= 0 && daysToDisbursal <= 30) {
        isDisbursalSoon = true;
      }
    }

    // Rule R6: BT Saving = requested_amount * (existing_roi - proposed_roi)
    let btSaving: number | undefined;
    if (c.case_type === "Balance Transfer (Takeover)" && c.existing_roi && c.proposed_roi) {
      btSaving = Math.round(c.requested_amount * (c.existing_roi - c.proposed_roi));
    }

    return {
      followupAlert: alert,
      followupDaysDiff: daysDiff,
      isStuck,
      daysInStage,
      isDisbursalSoon,
      daysToDisbursal,
      btSaving,
    };
  };

  // Duplicate mobile check across Leads and Clients
  const checkDuplicateMobile = (mobile: string, excludeId?: string) => {
    const clean = mobile.replace(/\D/g, "");
    if (!clean) return { isDuplicate: false };

    const matchLead = leads.find((l) => l.mobile.replace(/\D/g, "") === clean && l.id !== excludeId);
    if (matchLead) {
      return { isDuplicate: true, ownerName: matchLead.assigned_to };
    }

    const matchClient = clients.find((c) => c.mobile.replace(/\D/g, "") === clean && c.id !== excludeId);
    if (matchClient) {
      return { isDuplicate: true, ownerName: matchClient.relationship_owner };
    }

    return { isDuplicate: false };
  };

  const addLead = (newLeadData: Omit<Lead, "id" | "lead_code" | "created_at" | "is_demo">): Lead => {
    const nextNum = leads.length + 1;
    const lead_code = `LD-${String(nextNum).padStart(4, "0")}`;
    const newLead: Lead = {
      ...newLeadData,
      id: `ld-${Date.now()}`,
      lead_code,
      created_at: new Date().toISOString(),
      is_demo: false,
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  };

  const updateLeadStatus = (leadId: string, status: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status, last_contact_on: today } : l))
    );
  };

  const updateLeadFollowup = (leadId: string, nextDate: string | null) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, next_followup_on: nextDate } : l))
    );
  };

  const addClient = (
    newClientData: Omit<Client, "id" | "client_code" | "created_at" | "is_demo" | "active_loans_count" | "open_cases_count">
  ): Client => {
    const nextNum = clients.length + 1;
    const client_code = `CL-${String(nextNum).padStart(4, "0")}`;
    const newClient: Client = {
      ...newClientData,
      id: `cl-${Date.now()}`,
      client_code,
      created_at: new Date().toISOString(),
      active_loans_count: 0,
      open_cases_count: 0,
      is_demo: false,
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const revokeConsent = (clientId: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, consent_status: "Revoked", notes: `${c.notes} [Consent revoked on ${today}]` }
          : c
      )
    );
  };

  const addContactLog = (entry: Omit<ContactLogEntry, "id">) => {
    const newEntry: ContactLogEntry = {
      ...entry,
      id: `con-${Date.now()}`,
    };
    setContactLogs((prev) => [newEntry, ...prev]);
  };

  // Phase 3 Case Actions
  const addCase = (caseData: Omit<CaseItem, "id" | "case_code" | "created_at" | "is_demo">): CaseItem => {
    const nextNum = cases.length + 1;
    const case_code = `CS-${String(nextNum).padStart(4, "0")}`;
    const newCase: CaseItem = {
      ...caseData,
      id: `cs-${Date.now()}`,
      case_code,
      created_at: new Date().toISOString(),
      is_demo: false,
    };
    setCases((prev) => [newCase, ...prev]);
    return newCase;
  };

  const updateCaseStage = (
    caseId: string,
    newStage: StageName,
    options?: {
      loginDate?: string;
      sanctionedAmount?: number;
      sanctionDate?: string;
      rejectionReason?: string;
      notes?: string;
    }
  ): { success: boolean; error?: string } => {
    // Validation Rule R13: Logged In requires login_date
    if (newStage === "Logged In (Filed)" && !options?.loginDate) {
      return { success: false, error: "Advancing to 'Logged In (Filed)' requires a login date." };
    }

    // Validation Rule R13: Sanctioned requires amount & date
    if (newStage === "Sanctioned" && (!options?.sanctionedAmount || !options?.sanctionDate)) {
      return { success: false, error: "Advancing to 'Sanctioned' requires a sanctioned amount and sanction date." };
    }

    // Validation Rule R13: Rejected or Dropped requires reason
    if ((newStage === "Rejected" || newStage === "Dropped / Lost") && !options?.rejectionReason) {
      return { success: false, error: "Recording a rejection requires specifying a loss reason." };
    }

    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId || c.case_code === caseId) {
          const updatedSub: CaseSubmission = {
            ...c.primary_submission,
            stage: newStage,
            stage_updated_on: today,
            login_date: options?.loginDate || c.primary_submission.login_date,
            sanctioned_amount: options?.sanctionedAmount || c.primary_submission.sanctioned_amount,
            sanction_date: options?.sanctionDate || c.primary_submission.sanction_date,
            rejection_reason: options?.rejectionReason || c.primary_submission.rejection_reason,
            notes: options?.notes ? `${c.primary_submission.notes}\n[${today}]: ${options.notes}` : c.primary_submission.notes,
          };

          return {
            ...c,
            sanctioned_amount: options?.sanctionedAmount || c.sanctioned_amount,
            primary_submission: updatedSub,
          };
        }
        return c;
      })
    );

    return { success: true };
  };

  const updateCaseFollowup = (caseId: string, nextDate: string | null) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId || c.case_code === caseId ? { ...c, next_followup_on: nextDate } : c))
    );
  };

  // Phase 4: Portfolio & Money Functions
  const getLoanMath = (loan: LoanItem): LoanMathResult => {
    // Completed months between disbursal and today
    const start = new Date(loan.disbursed_date);
    const curr = new Date(today);
    let monthsElapsed = (curr.getFullYear() - start.getFullYear()) * 12 + (curr.getMonth() - start.getMonth());
    if (curr.getDate() < start.getDate()) {
      monthsElapsed--;
    }
    monthsElapsed = Math.max(0, monthsElapsed);

    const emi = calculateEMI(loan.disbursed_amount, loan.roi, loan.tenure_months);
    const estOutstanding = calculateOutstanding(
      loan.disbursed_amount,
      loan.roi,
      loan.tenure_months,
      monthsElapsed
    );
    const isMatured = monthsElapsed >= loan.tenure_months;

    // R8: Takeover Radar
    const prod = PRODUCTS.find(
      (p) => p.id === loan.product_id || p.name.toLowerCase() === loan.product_name.toLowerCase()
    );
    const marketRoi = prod?.market_roi ?? null;
    const roiGap = marketRoi !== null ? Math.max(0, loan.roi - marketRoi) : 0;
    const isTakeoverCandidate =
      loan.status === "Active" &&
      monthsElapsed >= 6 &&
      marketRoi !== null &&
      roiGap >= 0.005; // 0.50 pp
    const estAnnualSaving = isTakeoverCandidate ? Math.round(estOutstanding * roiGap) : 0;

    // R9: Top-up Window
    const topupDate = new Date(loan.disbursed_date);
    topupDate.setMonth(topupDate.getMonth() + 12);
    const isTopupOpen = loan.status === "Active" && curr >= topupDate;
    const opensDateStr = topupDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" });

    // R10: Routine Review Due
    const lastRev = loan.last_review_on || loan.disbursed_date;
    const nextRev = new Date(lastRev);
    nextRev.setMonth(nextRev.getMonth() + 6);
    const nextRevStr = nextRev.toISOString().split("T")[0];
    const diffTime = new Date(nextRevStr).getTime() - curr.getTime();
    const daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let reviewStatus: "OVERDUE" | "DUE TODAY" | "DUE SOON" | "OK" = "OK";
    if (daysDiff < 0) {
      reviewStatus = "OVERDUE";
    } else if (daysDiff === 0) {
      reviewStatus = "DUE TODAY";
    } else if (daysDiff <= 30) {
      reviewStatus = "DUE SOON";
    }

    // Payout details
    const payout = payouts.find((p) => p.loan_id === loan.id || p.loan_code === loan.loan_code);
    const disbDate = new Date(loan.disbursed_date);
    const payoutAgeingDays = Math.max(0, Math.floor((curr.getTime() - disbDate.getTime()) / (1000 * 60 * 60 * 24)));
    const isPayoutOverdue = !!payout && payout.status !== "Received" && payoutAgeingDays > 30;

    return {
      monthsElapsed,
      emi,
      estOutstanding,
      isMatured,
      takeover: {
        isCandidate: isTakeoverCandidate,
        marketRoi,
        roiGap,
        estAnnualSaving,
      },
      topup: {
        isOpen: isTopupOpen,
        opensDateStr,
      },
      review: {
        status: reviewStatus,
        daysDiff,
        nextReviewDue: nextRevStr,
      },
      payout,
      payoutAgeingDays,
      isPayoutOverdue,
    };
  };

  const addLoan = (loanData: Omit<LoanItem, "id" | "loan_code" | "is_demo">): LoanItem => {
    const nextCode = `LN-${String(loans.length + 1).padStart(4, "0")}`;
    const newLoan: LoanItem = {
      ...loanData,
      id: `ln-${Date.now()}`,
      loan_code: nextCode,
      is_demo: false,
    };
    setLoans((prev) => [newLoan, ...prev]);
    return newLoan;
  };

  const updateLoanReview = (loanId: string, reviewDate: string = today) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId || l.loan_code === loanId ? { ...l, last_review_on: reviewDate } : l))
    );
  };

  const updatePayout = (payoutId: string, updates: Partial<PayoutItem>) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, ...updates } : p))
    );
  };

  const createBTCaseFromLoan = (loanId: string): CaseItem => {
    const loan = loans.find((l) => l.id === loanId || l.loan_code === loanId);
    if (!loan) throw new Error("Loan not found");
    const math = getLoanMath(loan);

    return addCase({
      client_id: loan.client_id,
      client_code: loan.client_code,
      client_name: loan.client_name,
      case_type: "Balance Transfer (Takeover)",
      product_id: loan.product_id,
      product_name: loan.product_name,
      requested_amount: math.estOutstanding,
      existing_lender: loan.lender_name,
      existing_roi: loan.roi,
      proposed_roi: math.takeover.marketRoi || 0.0840,
      handled_by: loan.handled_by || "Owner",
      next_followup_on: today,
      primary_submission: {
        id: `sub-${Date.now()}`,
        submission_code: `CS-${String(cases.length + 1).padStart(4, "0")}-A`,
        lender_id: "len-bajaj",
        lender_name: "Bajaj Finance",
        stage: "Enquiry Qualified",
        stage_updated_on: today,
        is_primary: true,
        notes: `Balance transfer created from existing portfolio loan ${loan.loan_code} (${loan.lender_name}). Existing rate: ${(loan.roi * 100).toFixed(2)}%, Market Benchmark: ${((math.takeover.marketRoi || 0.084) * 100).toFixed(2)}%. Est annual saving: ₹${math.takeover.estAnnualSaving.toLocaleString("en-IN")}.`,
      },
    });
  };

  const purgeDemoData = () => {
    const demoLeads = leads.filter((l) => l.is_demo).length;
    const demoClients = clients.filter((c) => c.is_demo).length;
    const demoCases = cases.filter((c) => c.is_demo).length;
    const demoLoans = loans.filter((l) => l.is_demo).length;
    const demoPayouts = payouts.filter((p) => p.is_demo).length;

    setLeads((prev) => prev.filter((l) => !l.is_demo));
    setClients((prev) => prev.filter((c) => !c.is_demo));
    setCases((prev) => prev.filter((c) => !c.is_demo));
    setLoans((prev) => prev.filter((l) => !l.is_demo));
    setPayouts((prev) => prev.filter((p) => !p.is_demo));

    return {
      purgedLeads: demoLeads,
      purgedClients: demoClients,
      purgedCases: demoCases,
      purgedLoans: demoLoans,
      purgedPayouts: demoPayouts,
    };
  };

  const restoreDemoData = () => {
    setLeads(INITIAL_LEADS);
    setClients(INITIAL_CLIENTS);
    setCases(INITIAL_CASES);
    setLoans(INITIAL_LOANS);
    setPayouts(INITIAL_PAYOUTS);
  };

  const importBatch = (payload: {
    leads?: Array<Omit<Lead, "id" | "lead_code" | "created_at" | "is_demo">>;
    clients?: Array<Omit<Client, "id" | "client_code" | "created_at" | "is_demo" | "active_loans_count" | "open_cases_count">>;
  }) => {
    let importedLeads = 0;
    let importedClients = 0;
    const errors: string[] = [];

    if (payload.leads && payload.leads.length > 0) {
      payload.leads.forEach((l) => {
        try {
          addLead(l);
          importedLeads++;
        } catch (err: unknown) {
          errors.push(`Lead ${l.name}: ${err instanceof Error ? err.message : String(err)}`);
        }
      });
    }

    if (payload.clients && payload.clients.length > 0) {
      payload.clients.forEach((c) => {
        try {
          addClient(c);
          importedClients++;
        } catch (err: unknown) {
          errors.push(`Client ${c.name}: ${err instanceof Error ? err.message : String(err)}`);
        }
      });
    }

    return { importedLeads, importedClients, errors };
  };

  const updateSettings = (updates: Partial<DeskSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      if (typeof window !== "undefined") {
        localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(next));
      }
      return next;
    });
  };

  const reassignLead = (leadId: string, newAssignee: string) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId
          ? {
              ...l,
              assigned_to: newAssignee,
              assigned_to_id: newAssignee === "Owner" ? "usr-owner" : "usr-staff1",
            }
          : l
      )
    );
  };

  const reassignCase = (caseId: string, newAssignee: string) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, handled_by: newAssignee } : c))
    );
  };

  const reassignClient = (clientId: string, newAssignee: string) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId ? { ...c, relationship_owner: newAssignee } : c
      )
    );
  };

  const reassignLoan = (loanId: string, newAssignee: string) => {
    setLoans((prev) =>
      prev.map((ln) => (ln.id === loanId ? { ...ln, handled_by: newAssignee } : ln))
    );
  };

  const updateLead = (leadId: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, ...updates } : l))
    );
  };

  const updateCase = (caseId: string, updates: Partial<CaseItem>) => {
    setCases((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, ...updates } : c))
    );
  };

  const updateClient = (clientId: string, updates: Partial<Client>) => {
    setClients((prev) =>
      prev.map((c) => (c.id === clientId ? { ...c, ...updates } : c))
    );
  };

  return (
    <DataContext.Provider
      value={{
        leads,
        clients,
        cases,
        loans,
        payouts,
        payoutGrid,
        bankers,
        contactLogs,
        products: PRODUCTS,
        lenders: LENDERS,
        stages: STAGE_DEFINITIONS,
        today,
        reminderWindowDays,
        settings,
        updateSettings,
        reassignLead,
        reassignCase,
        reassignClient,
        reassignLoan,
        updateLead,
        updateCase,
        updateClient,
        addLead,
        updateLeadStatus,
        updateLeadFollowup,
        checkDuplicateMobile,
        addClient,
        revokeConsent,
        addContactLog,
        getFollowupAlert,
        addCase,
        updateCaseStage,
        updateCaseFollowup,
        getCaseAlerts,
        getLoanMath,
        addLoan,
        updateLoanReview,
        updatePayout,
        createBTCaseFromLoan,
        purgeDemoData,
        restoreDemoData,
        importBatch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextType {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
