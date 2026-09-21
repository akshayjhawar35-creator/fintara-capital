-- 00003_crm_tables.sql

CREATE TABLE leads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    lead_code text UNIQUE,
    date_received date,
    source text,
    name text NOT NULL,
    mobile text CHECK (mobile ~ '^[6-9][0-9]{9}$'),
    city_area text,
    product_id uuid REFERENCES products(id),
    amount_needed numeric(14,2) CHECK (amount_needed > 0),
    assigned_to uuid REFERENCES profiles(id),
    status text,
    last_contact_on date,
    next_followup_on date,
    converted_client_id uuid,
    referrer_id uuid REFERENCES referrers(id),
    utm jsonb,
    remarks text
);

CREATE TABLE clients (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    client_code text UNIQUE,
    name text NOT NULL,
    client_type text,
    contact_person text,
    mobile text UNIQUE CHECK (mobile ~ '^[6-9][0-9]{9}$'),
    email text,
    city_area text,
    occupation text,
    annual_income_or_turnover numeric(14,2),
    dob_or_incorporation date,
    client_since date,
    referral_source text,
    referrer_id uuid REFERENCES referrers(id),
    relationship_owner uuid REFERENCES profiles(id),
    consent_updates bool DEFAULT false,
    documents_folder_link text,
    notes text
);

ALTER TABLE leads ADD CONSTRAINT fk_converted_client FOREIGN KEY (converted_client_id) REFERENCES clients(id);

CREATE TABLE consent_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    subject uuid,
    purpose text,
    channel consent_channel,
    given bool NOT NULL,
    captured_by uuid REFERENCES profiles(id),
    captured_at timestamptz DEFAULT now(),
    text_version text,
    page_url text
);
