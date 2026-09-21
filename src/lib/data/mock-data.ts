/**
 * mock-data.ts — Seed and demo data for Fintara Capital (Raipur, Chhattisgarh).
 * Mirrors supabase/seed.sql and docs/SPEC.md.
 */

export interface Product {
  id: string;
  name: string;
  code: string;
  market_roi: number | null; // e.g. 0.0850 = 8.50%
  is_secured: boolean;
}

export interface Lender {
  id: string;
  name: string;
  type: "Bank" | "NBFC" | "HFC";
  is_active: boolean;
}

export interface Banker {
  id: string;
  name: string;
  lender_id: string;
  lender_name: string;
  designation: string;
  branch_city: string;
  mobile: string;
  email: string;
  products_handled: string[];
  escalation_contact: string;
  tat_days_min: number;
  tat_days_max: number;
  is_active: boolean;
}

export interface Lead {
  id: string;
  lead_code: string; // e.g. LD-0001
  created_at: string;
  name: string;
  mobile: string;
  location_area: string;
  product_id: string;
  product_name: string;
  amount: number;
  source: string;
  status: "New" | "Contacted" | "Interested" | "Docs Awaited" | "Converted" | "Not Interested" | "Lost";
  assigned_to: string; // "Owner" | "Staff 1"
  assigned_to_id: string;
  last_contact_on: string | null;
  next_followup_on: string | null;
  notes: string;
  is_demo: boolean;
}

export interface Client {
  id: string;
  client_code: string; // e.g. CL-0001
  created_at: string;
  name: string;
  contact_person: string;
  mobile: string;
  email: string;
  city_area: string;
  address: string;
  client_type: "Salaried" | "Business Owner" | "Self-employed Professional" | "Trader" | "Company / LLP";
  business_name?: string;
  turnover?: number;
  annual_income?: number;
  incorporated_on?: string;
  dob?: string;
  client_since: string;
  relationship_owner: string; // "Owner" | "Staff 1"
  source: string;
  consent_status: "Yes" | "Revoked" | "Pending";
  consent_channel?: "Verbal" | "WhatsApp" | "Physical Form";
  consent_date?: string;
  notes: string;
  active_loans_count: number;
  open_cases_count: number;
  is_demo: boolean;
}

export interface ContactLogEntry {
  id: string;
  date: string;
  client_id: string;
  client_name: string;
  contact_type: "Call" | "WhatsApp" | "Visit" | "Meeting" | "Portfolio Review" | "Rate Update Sent" | "Greeting";
  handled_by: string;
  linked_case_code?: string;
  linked_loan_code?: string;
  summary: string;
  next_action: string;
  next_action_date: string;
}

export const PRODUCTS: Product[] = [
  { id: "p-hl", name: "Home Loan", code: "HL", market_roi: 0.0850, is_secured: true },
  { id: "p-lap", name: "Loan Against Property", code: "LAP", market_roi: 0.0975, is_secured: true },
  { id: "p-bl", name: "Business Loan", code: "BL", market_roi: 0.1400, is_secured: false },
  { id: "p-wc", name: "Working Capital (OD/CC)", code: "WC", market_roi: 0.1050, is_secured: false },
  { id: "p-pl", name: "Personal Loan", code: "PL", market_roi: 0.1250, is_secured: false },
  { id: "p-cl", name: "Car Loan", code: "CL", market_roi: 0.0900, is_secured: false },
  { id: "p-el", name: "Education Loan", code: "EL", market_roi: 0.1000, is_secured: false },
  { id: "p-gl", name: "Gold Loan", code: "GL", market_roi: 0.0950, is_secured: false },
  { id: "p-ml", name: "Machinery / Equipment Loan", code: "ML", market_roi: 0.1100, is_secured: false },
  { id: "p-cc", name: "Credit Card", code: "CC", market_roi: null, is_secured: false },
  { id: "p-ins", name: "Insurance", code: "INS", market_roi: null, is_secured: false },
];

export const LENDERS: Lender[] = [
  { id: "len-hdfc", name: "HDFC Bank", type: "Bank", is_active: true },
  { id: "len-bajaj", name: "Bajaj Finance", type: "NBFC", is_active: true },
  { id: "len-sbi", name: "State Bank of India", type: "Bank", is_active: true },
  { id: "len-axis", name: "Axis Bank", type: "Bank", is_active: true },
  { id: "len-icici", name: "ICICI Bank", type: "Bank", is_active: true },
  { id: "len-kotak", name: "Kotak Mahindra Bank", type: "Bank", is_active: true },
  { id: "len-idfc", name: "IDFC First Bank", type: "Bank", is_active: true },
  { id: "len-tata", name: "Tata Capital", type: "NBFC", is_active: true },
  { id: "len-bob", name: "Bank of Baroda", type: "Bank", is_active: true },
  { id: "len-pnb", name: "Punjab National Bank", type: "Bank", is_active: true },
];

export const LEAD_SOURCES = [
  "Google Business Profile",
  "Website / Google Search",
  "Instagram / Facebook",
  "WhatsApp",
  "Referral - Client",
  "Referral - Builder/Broker",
  "Referral - Sub-agent",
  "Walk-in",
  "CA Practice Client",
  "Existing Portfolio (Takeover / Top-up)",
  "Other",
];

export const BANKERS: Banker[] = [
  {
    id: "b-1",
    name: "SAMPLE Banker A",
    lender_id: "len-hdfc",
    lender_name: "HDFC Bank",
    designation: "Relationship Manager",
    branch_city: "Raipur - Pandri",
    mobile: "9800000101",
    email: "banker.a@example.com",
    products_handled: ["Loan Against Property", "Business Loan", "Home Loan"],
    escalation_contact: "SAMPLE Regional Head",
    tat_days_min: 7,
    tat_days_max: 10,
    is_active: true,
  },
  {
    id: "b-2",
    name: "SAMPLE Banker B",
    lender_id: "len-bajaj",
    lender_name: "Bajaj Finance",
    designation: "Sales Manager",
    branch_city: "Raipur",
    mobile: "9800000102",
    email: "banker.b@example.com",
    products_handled: ["Home Loan Balance Transfer", "Business Loan"],
    escalation_contact: "SAMPLE Area Manager",
    tat_days_min: 5,
    tat_days_max: 7,
    is_active: true,
  },
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: "ld-1",
    lead_code: "LD-0001",
    created_at: "2026-09-14T10:00:00Z",
    name: "SAMPLE - Rakesh Jain",
    mobile: "9800000011",
    location_area: "Shankar Nagar",
    product_id: "p-bl",
    product_name: "Business Loan",
    amount: 2500000,
    source: "Google Business Profile",
    status: "Interested",
    assigned_to: "Staff 1",
    assigned_to_id: "staff-1",
    last_contact_on: "2026-09-17",
    next_followup_on: "2026-09-19", // Overdue relative to test date 20 Sep 2026
    notes: "Requires business expansion loan. 3 yrs ITR filed, GST turnover around 1.2 Cr.",
    is_demo: true,
  },
  {
    id: "ld-2",
    lead_code: "LD-0002",
    created_at: "2026-09-18T14:30:00Z",
    name: "SAMPLE - Neha Gupta",
    mobile: "9800000012",
    location_area: "Pandri",
    product_id: "p-hl",
    product_name: "Home Loan",
    amount: 4500000,
    source: "Referral - Client",
    status: "Docs Awaited",
    assigned_to: "Owner",
    assigned_to_id: "owner",
    last_contact_on: "2026-09-19",
    next_followup_on: "2026-09-22", // Due in 2 days
    notes: "Purchasing apartment in Shankar Nagar. Waiting for salary slips and Form 16.",
    is_demo: true,
  },
];

export const INITIAL_CLIENTS: Client[] = [
  {
    id: "cl-1",
    client_code: "CL-0001",
    created_at: "2025-08-16T11:00:00Z",
    name: "SAMPLE - Raipur Traders",
    contact_person: "Mr. Sharma",
    mobile: "9800000001",
    email: "sharma@raipurtraders.sample",
    city_area: "Telibandha",
    address: "Plot 14, Industrial Estate, Telibandha, Raipur, Chhattisgarh",
    client_type: "Business Owner",
    business_name: "Raipur Traders & Logistics",
    turnover: 18000000,
    incorporated_on: "2012-04-01",
    client_since: "2025-08-16",
    relationship_owner: "Owner",
    source: "Referral - Client",
    consent_status: "Yes",
    consent_channel: "Physical Form",
    consent_date: "2025-08-16",
    notes: "Long term wholesale trading client. Excellent bank conduct.",
    active_loans_count: 1,
    open_cases_count: 1,
    is_demo: true,
  },
  {
    id: "cl-2",
    client_code: "CL-0002",
    created_at: "2026-08-21T09:30:00Z",
    name: "SAMPLE - Anil Verma",
    contact_person: "Anil Verma",
    mobile: "9800000002",
    email: "anil.verma@sample.test",
    city_area: "Devendra Nagar",
    address: "A-42, Sector 2, Devendra Nagar, Raipur, Chhattisgarh",
    client_type: "Salaried",
    annual_income: 1800000,
    dob: "1985-11-03",
    client_since: "2026-08-21",
    relationship_owner: "Staff 1",
    source: "Google Business Profile",
    consent_status: "Yes",
    consent_channel: "WhatsApp",
    consent_date: "2026-08-21",
    notes: "Senior Manager at local private firm. Looking to balance transfer existing home loan from SBI.",
    active_loans_count: 0,
    open_cases_count: 1,
    is_demo: true,
  },
  {
    id: "cl-3",
    client_code: "CL-0003",
    created_at: "2026-01-13T16:00:00Z",
    name: "SAMPLE - Dr. Meera Clinic",
    contact_person: "Dr. Meera",
    mobile: "9800000003",
    email: "dr.meera@sample.test",
    city_area: "Civil Lines",
    address: "Medical Enclave, Civil Lines, Raipur, Chhattisgarh",
    client_type: "Self-employed Professional",
    business_name: "Dr. Meera Wellness & Maternity",
    turnover: 4200000,
    dob: "1980-02-14",
    client_since: "2026-01-13",
    relationship_owner: "Owner",
    source: "Referral - Builder/Broker",
    consent_status: "Yes",
    consent_channel: "Physical Form",
    consent_date: "2026-01-13",
    notes: "Established pediatrician clinic in Civil Lines. Active home loan, LAP sanctioned.",
    active_loans_count: 1,
    open_cases_count: 1,
    is_demo: true,
  },
];

export const INITIAL_CONTACT_LOGS: ContactLogEntry[] = [
  {
    id: "con-1",
    date: "2026-09-17",
    client_id: "cl-1",
    client_name: "SAMPLE - Raipur Traders",
    contact_type: "Call",
    handled_by: "Owner",
    linked_case_code: "CS-0001",
    summary: "SAMPLE - Confirmed bank visit scheduled; documents complete.",
    next_action: "Ask for GST returns copy",
    next_action_date: "2026-09-21",
  },
  {
    id: "con-2",
    date: "2026-06-17",
    client_id: "cl-3",
    client_name: "SAMPLE - Dr. Meera Clinic",
    contact_type: "Rate Update Sent",
    handled_by: "Staff 1",
    linked_loan_code: "LN-0002",
    summary: "SAMPLE - Shared quarterly rate update on WhatsApp.",
    next_action: "Portfolio review call",
    next_action_date: "2026-09-20",
  },
];
