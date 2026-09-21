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
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  BANKERS as INITIAL_BANKERS,
  INITIAL_CONTACT_LOGS,
  INITIAL_CASES,
  STAGE_DEFINITIONS,
  PRODUCTS,
  LENDERS,
} from "./mock-data";

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

export interface DataContextType {
  leads: Lead[];
  clients: Client[];
  cases: CaseItem[];
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = "fintara_crm_data_v1";

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Test date default 2026-09-20 per spec App6 / App7
  const [today] = useState("2026-09-20");
  const reminderWindowDays = 7;
  const stuckDaysThreshold = 10; // Rule R3

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

  return (
    <DataContext.Provider
      value={{
        leads,
        clients,
        cases,
        bankers,
        contactLogs,
        products: PRODUCTS,
        lenders: LENDERS,
        stages: STAGE_DEFINITIONS,
        today,
        reminderWindowDays,
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
