"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Lead,
  Client,
  Banker,
  ContactLogEntry,
  Product,
  INITIAL_LEADS,
  INITIAL_CLIENTS,
  BANKERS as INITIAL_BANKERS,
  INITIAL_CONTACT_LOGS,
  PRODUCTS,
  LENDERS,
} from "./mock-data";

export type FollowupAlert = "OVERDUE" | "DUE TODAY" | "DUE SOON" | "OK" | "NO FOLLOW-UP SET";

export interface DataContextType {
  leads: Lead[];
  clients: Client[];
  bankers: Banker[];
  contactLogs: ContactLogEntry[];
  products: Product[];
  lenders: typeof LENDERS;
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
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = "fintara_crm_data_v1";

export function DataProvider({ children }: { children: React.ReactNode }) {
  // Test date default 2026-09-20 per spec App6 / App7
  const [today] = useState("2026-09-20");
  const reminderWindowDays = 7;

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

  // Duplicate mobile check across Leads and Clients
  const checkDuplicateMobile = (mobile: string, excludeId?: string) => {
    const clean = mobile.replace(/\D/g, "");
    if (!clean) return { isDuplicate: false };

    // Check leads
    const matchLead = leads.find((l) => l.mobile.replace(/\D/g, "") === clean && l.id !== excludeId);
    if (matchLead) {
      return { isDuplicate: true, ownerName: matchLead.assigned_to };
    }

    // Check clients
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

  return (
    <DataContext.Provider
      value={{
        leads,
        clients,
        bankers,
        contactLogs,
        products: PRODUCTS,
        lenders: LENDERS,
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
