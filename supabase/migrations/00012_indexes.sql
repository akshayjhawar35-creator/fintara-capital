-- 00012_indexes.sql

CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_clients_relationship_owner ON clients(relationship_owner);
CREATE INDEX idx_cases_handled_by ON cases(handled_by);
CREATE INDEX idx_loans_handled_by ON loans(handled_by);

CREATE INDEX idx_leads_next_followup ON leads(next_followup_on);
CREATE INDEX idx_case_submissions_expected_disbursal ON case_submissions(expected_disbursal_on);
CREATE INDEX idx_case_submissions_stage_updated ON case_submissions(stage_updated_on);
CREATE INDEX idx_loans_disbursed_on ON loans(disbursed_on);

CREATE INDEX idx_leads_code ON leads(lead_code);
CREATE INDEX idx_clients_code ON clients(client_code);
CREATE INDEX idx_cases_code ON cases(case_code);
CREATE INDEX idx_loans_code ON loans(loan_code);

CREATE UNIQUE INDEX idx_clients_mobile ON clients(mobile);
CREATE INDEX idx_leads_mobile ON leads(mobile);
