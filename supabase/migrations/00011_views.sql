-- 00011_views.sql

CREATE OR REPLACE VIEW v_leads WITH (security_invoker=true) AS 
SELECT l.* 
FROM leads l;

CREATE OR REPLACE VIEW v_clients WITH (security_invoker=true) AS 
SELECT c.* 
FROM clients c;

CREATE OR REPLACE VIEW v_submissions WITH (security_invoker=true) AS 
SELECT cs.* 
FROM case_submissions cs;

CREATE OR REPLACE VIEW v_cases WITH (security_invoker=true) AS 
SELECT c.* 
FROM cases c;

CREATE OR REPLACE VIEW v_loans_staff WITH (security_invoker=true) AS 
SELECT l.* 
FROM loans l;

CREATE OR REPLACE VIEW v_loans_admin WITH (security_invoker=true) AS 
SELECT l.* 
FROM loans l;

CREATE OR REPLACE VIEW v_my_day WITH (security_invoker=true) AS 
SELECT id, title FROM tasks;

CREATE OR REPLACE VIEW v_dashboard_admin WITH (security_invoker=true) AS 
SELECT 1 as count;

CREATE OR REPLACE VIEW v_dashboard_staff WITH (security_invoker=true) AS 
SELECT 1 as count;
