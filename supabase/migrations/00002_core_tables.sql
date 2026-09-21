-- 00002_core_tables.sql

CREATE TABLE profiles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    full_name text,
    email text,
    mobile text CHECK (mobile ~ '^[6-9][0-9]{9}$'),
    role user_role,
    team_label text,
    is_active bool DEFAULT true,
    monthly_disbursal_target numeric(14,2),
    telegram_chat_id text,
    notif_prefs jsonb,
    calendar_token text,
    last_login_at timestamptz
);

CREATE TABLE lenders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    name text UNIQUE NOT NULL,
    type lender_type,
    is_active bool DEFAULT true,
    notes text
);

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    name text UNIQUE NOT NULL,
    is_secured bool DEFAULT false,
    has_roi_benchmark bool DEFAULT false,
    sort integer
);

CREATE TABLE market_roi_history (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    product_id uuid REFERENCES products(id),
    roi numeric(6,4) CHECK (roi >= 0 AND roi <= 0.5),
    effective_from date,
    set_by uuid REFERENCES profiles(id)
);

CREATE TABLE bankers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    lender_id uuid REFERENCES lenders(id),
    name text NOT NULL,
    designation text,
    branch_city text,
    mobile text CHECK (mobile ~ '^[6-9][0-9]{9}$'),
    email text,
    products_handled text,
    escalation_name text,
    escalation_mobile text CHECK (escalation_mobile IS NULL OR escalation_mobile ~ '^[6-9][0-9]{9}$'),
    tat_days_min integer,
    tat_days_max integer,
    remarks text,
    is_active bool DEFAULT true
);

CREATE TABLE stages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    name text NOT NULL,
    sort integer,
    win_probability numeric(5,4),
    is_open bool DEFAULT true,
    kind stage_kind,
    stuck_days integer,
    only_for_secured bool DEFAULT false,
    color text
);

CREATE TABLE lookup_values (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    list_key text NOT NULL,
    value text NOT NULL,
    sort integer,
    is_active bool DEFAULT true,
    meta jsonb
);

CREATE TABLE settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    today_override date,
    reminder_window_days integer DEFAULT 7,
    lookahead_days integer DEFAULT 30,
    takeover_gap_pp numeric(6,4) DEFAULT 0.005,
    takeover_min_months integer DEFAULT 6,
    review_interval_months integer DEFAULT 6,
    checkin_interval_days integer DEFAULT 90,
    topup_after_months integer DEFAULT 12,
    stuck_days_default integer DEFAULT 10,
    unpaid_payout_days integer DEFAULT 30,
    docs_pending_days integer DEFAULT 5,
    sanction_validity_days integer DEFAULT 90,
    session_idle_hours integer DEFAULT 8,
    auto_assign_website_leads text,
    feature_flags jsonb
);

ALTER TABLE settings ADD CONSTRAINT settings_single_row CHECK (id = '00000000-0000-0000-0000-000000000001');

CREATE TABLE referrers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    name text NOT NULL,
    type text,
    mobile text CHECK (mobile ~ '^[6-9][0-9]{9}$'),
    notes text
);
