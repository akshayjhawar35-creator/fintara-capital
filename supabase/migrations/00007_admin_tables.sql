-- 00007_admin_tables.sql

CREATE TABLE lender_fit_rules (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    lender_id uuid REFERENCES lenders(id),
    product_id uuid REFERENCES products(id),
    min_cibil integer,
    min_business_vintage_months integer,
    min_income_annual numeric(14,2),
    max_foir numeric(5,2),
    max_ltv numeric(5,2),
    accepted_property_types text[],
    min_amount numeric(14,2),
    max_amount numeric(14,2),
    notes text
);

CREATE TABLE audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    at timestamptz DEFAULT now(),
    user_id uuid,
    action text,
    table_name text,
    record_id uuid,
    old jsonb,
    new jsonb
);

CREATE TABLE data_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    client_id uuid REFERENCES clients(id),
    request_type text,
    status text,
    resolved_on timestamptz,
    notes text
);

CREATE TABLE import_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    status text,
    result_summary jsonb
);

CREATE TABLE rate_limits (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ip_address text,
    action text,
    last_request_at timestamptz,
    request_count integer
);
