-- 00005_portfolio_tables.sql

CREATE TABLE loans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    loan_code text UNIQUE,
    client_id uuid REFERENCES clients(id) NOT NULL,
    source_case_id uuid REFERENCES cases(id),
    source_submission_id uuid REFERENCES case_submissions(id),
    product_id uuid REFERENCES products(id),
    lender_id uuid REFERENCES lenders(id),
    banker_id uuid REFERENCES bankers(id),
    handled_by uuid REFERENCES profiles(id),
    loan_ac_last4 text CHECK (loan_ac_last4 IS NULL OR loan_ac_last4 ~ '^\d{4}$'),
    disbursed_amount numeric(14,2) CHECK (disbursed_amount > 0),
    disbursed_on date,
    current_roi numeric(6,4),
    tenure_months integer,
    loan_status text,
    last_review_on date,
    closed_on date,
    remarks text
);

ALTER TABLE cases ADD CONSTRAINT fk_source_loan FOREIGN KEY (source_loan_id) REFERENCES loans(id);

CREATE TABLE payout_grid (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    lender_id uuid REFERENCES lenders(id),
    product_id uuid REFERENCES products(id),
    case_type text,
    payout_pct numeric(6,4),
    valid_from date,
    notes text
);

CREATE TABLE payouts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    loan_id uuid REFERENCES loans(id) UNIQUE,
    payout_pct_snapshot numeric(6,4),
    expected_amount numeric(14,2),
    status text,
    claimed_on date,
    invoice_no text,
    invoice_date date,
    dispute_note text,
    followup_on date
);

CREATE TABLE payout_receipts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    payout_id uuid REFERENCES payouts(id),
    received_on date,
    gross_amount numeric(14,2),
    tds_amount numeric(14,2),
    gst_amount numeric(14,2),
    net_amount numeric(14,2),
    reference text
);
