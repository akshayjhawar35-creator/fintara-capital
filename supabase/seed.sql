-- seed.sql

INSERT INTO settings(id, reminder_window_days, lookahead_days, takeover_gap_pp, takeover_min_months, review_interval_months, checkin_interval_days, topup_after_months, stuck_days_default, unpaid_payout_days, docs_pending_days, sanction_validity_days, session_idle_hours, auto_assign_website_leads, is_demo) 
VALUES ('00000000-0000-0000-0000-000000000001', 7, 30, 0.005, 6, 6, 90, 12, 10, 30, 5, 90, 8, 'Owner', true) ON CONFLICT DO NOTHING;

-- Lookups (App4)
INSERT INTO lookup_values(list_key, value, is_demo) VALUES
('lead_source', 'Google Business Profile', true),
('lead_source', 'Website / Google Search', true),
('lead_source', 'Instagram / Facebook', true),
('lead_source', 'WhatsApp', true),
('lead_source', 'Referral - Client', true),
('lead_source', 'Referral - Builder/Broker', true),
('lead_source', 'Referral - Sub-agent', true),
('lead_source', 'Walk-in', true),
('lead_source', 'CA Practice Client', true),
('lead_source', 'Existing Portfolio', true),
('lead_source', 'Event / Seminar', true),
('lead_source', 'Other', true);

-- Stages (App1)
INSERT INTO stages(id, name, sort, win_probability, is_open, kind, only_for_secured, is_demo) VALUES
(gen_random_uuid(), 'Enquiry Qualified', 1, 0.10, true, 'progress', false, true),
(gen_random_uuid(), 'Docs Collection', 2, 0.20, true, 'progress', false, true),
(gen_random_uuid(), 'Logged In (Filed)', 3, 0.35, true, 'progress', false, true),
(gen_random_uuid(), 'Credit Processing', 4, 0.50, true, 'progress', false, true),
(gen_random_uuid(), 'Query / Deficiency', 5, 0.40, true, 'hold', false, true),
(gen_random_uuid(), 'Sanctioned', 6, 0.85, true, 'progress', false, true),
(gen_random_uuid(), 'Legal / Valuation', 7, 0.90, true, 'progress', true, true),
(gen_random_uuid(), 'Disbursement Pending', 8, 0.95, true, 'progress', false, true),
(gen_random_uuid(), 'Disbursed', 9, 1.00, false, 'won', false, true),
(gen_random_uuid(), 'Rejected', 10, 0.00, false, 'lost', false, true),
(gen_random_uuid(), 'Dropped / Lost', 11, 0.00, false, 'lost', false, true);

-- Lenders (App2)
INSERT INTO lenders(id, name, type, is_demo) VALUES
(gen_random_uuid(), 'HDFC Bank', 'Bank', true),
(gen_random_uuid(), 'ICICI Bank', 'Bank', true),
(gen_random_uuid(), 'State Bank of India', 'Bank', true),
(gen_random_uuid(), 'Bajaj Finance', 'NBFC', true);

-- Products (App3)
INSERT INTO products(id, name, is_secured, has_roi_benchmark, is_demo) VALUES
(gen_random_uuid(), 'Home Loan', true, true, true),
(gen_random_uuid(), 'Loan Against Property (LAP)', true, true, true),
(gen_random_uuid(), 'Business Loan', false, true, true),
(gen_random_uuid(), 'Working Capital (OD/CC)', false, true, true);

-- Dev Users
INSERT INTO auth.users (id, email, encrypted_password)
VALUES 
('00000000-0000-0000-0000-000000000002', 'owner@fintara.test', crypt('password123', gen_salt('bf'))),
('00000000-0000-0000-0000-000000000003', 'staff1@fintara.test', crypt('password123', gen_salt('bf')));

INSERT INTO profiles (id, email, full_name, role, team_label, is_demo)
VALUES 
('00000000-0000-0000-0000-000000000002', 'owner@fintara.test', 'Owner', 'admin', 'Owner', true),
('00000000-0000-0000-0000-000000000003', 'staff1@fintara.test', 'Staff 1', 'staff', 'Staff 1', true);

-- Demo Clients
INSERT INTO clients(id, client_code, name, client_type, contact_person, mobile, city_area, occupation, annual_income_or_turnover, is_demo, relationship_owner) VALUES
(gen_random_uuid(), 'CL-0001', 'SAMPLE - Raipur Traders', 'Business Owner', 'Mr. Sharma', '9800000001', 'Telibandha', 'Wholesale trading', 18000000, true, '00000000-0000-0000-0000-000000000002'),
(gen_random_uuid(), 'CL-0002', 'SAMPLE - Anil Verma', 'Salaried', NULL, '9800000002', 'Devendra Nagar', 'Manager', 1800000, true, '00000000-0000-0000-0000-000000000003'),
(gen_random_uuid(), 'CL-0003', 'SAMPLE - Dr. Meera Clinic', 'Self-employed Professional', 'Dr. Meera', '9800000003', 'Civil Lines', 'Medical practice', 4200000, true, '00000000-0000-0000-0000-000000000002');

