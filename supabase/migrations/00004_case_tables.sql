-- 00004_case_tables.sql

CREATE TABLE cases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    case_code text UNIQUE,
    client_id uuid REFERENCES clients(id) NOT NULL,
    case_type text,
    product_id uuid REFERENCES products(id),
    amount_requested numeric(14,2) CHECK (amount_requested > 0),
    purpose text,
    handled_by uuid REFERENCES profiles(id),
    existing_lender text,
    existing_roi numeric(6,4),
    existing_outstanding numeric(14,2),
    source_loan_id uuid,
    lost_reason text,
    closed_on date,
    remarks text
);

CREATE TABLE case_submissions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    case_id uuid REFERENCES cases(id) NOT NULL,
    suffix text,
    lender_id uuid REFERENCES lenders(id),
    banker_id uuid REFERENCES bankers(id),
    stage_id uuid REFERENCES stages(id),
    stage_updated_on date,
    lender_file_no text,
    login_on date,
    sanctioned_amount numeric(14,2) CHECK (sanctioned_amount IS NULL OR sanctioned_amount > 0),
    sanction_on date,
    sanctioned_roi numeric(6,4),
    proposed_roi numeric(6,4),
    expected_disbursal_on date,
    next_followup_on date,
    reject_reason text,
    competitor_name text,
    remarks text
);

CREATE TABLE submission_stage_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    submission_id uuid REFERENCES case_submissions(id),
    from_stage uuid REFERENCES stages(id),
    to_stage uuid REFERENCES stages(id),
    changed_by uuid REFERENCES profiles(id),
    changed_at timestamptz DEFAULT now(),
    note text,
    days_in_previous_stage integer
);

CREATE TABLE co_applicants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    case_id uuid REFERENCES cases(id) NOT NULL,
    name text NOT NULL,
    mobile text CHECK (mobile IS NULL OR mobile ~ '^[6-9][0-9]{9}$'),
    relation text,
    role co_applicant_role,
    annual_income numeric(14,2),
    client_id uuid REFERENCES clients(id)
);

CREATE TABLE doc_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    product_id uuid REFERENCES products(id),
    client_type text,
    party doc_party,
    doc_name text NOT NULL,
    is_mandatory bool DEFAULT false,
    sort integer
);

CREATE TABLE case_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    case_id uuid REFERENCES cases(id) NOT NULL,
    template_id uuid REFERENCES doc_templates(id),
    doc_name text NOT NULL,
    party doc_party,
    status doc_status,
    requested_on date,
    received_on date,
    link_url text,
    remarks text
);
