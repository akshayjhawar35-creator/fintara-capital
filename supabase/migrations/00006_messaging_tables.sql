-- 00006_messaging_tables.sql

CREATE TABLE contact_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    contacted_on date,
    client_id uuid REFERENCES clients(id),
    lead_id uuid REFERENCES leads(id),
    contact_type text,
    done_by uuid REFERENCES profiles(id),
    related_code text,
    summary text,
    next_action text,
    next_action_on date,
    action_done bool DEFAULT false,
    done_on date
);

CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    title text NOT NULL,
    due_on date,
    assigned_to uuid REFERENCES profiles(id),
    related_code text,
    done bool DEFAULT false
);

CREATE TABLE notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    user_id uuid REFERENCES profiles(id),
    kind text,
    title text,
    body text,
    link text,
    dedupe_key text,
    read_at timestamptz
);

CREATE TABLE whatsapp_templates (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    key text UNIQUE NOT NULL,
    title text NOT NULL,
    category text,
    body text NOT NULL,
    requires_consent bool DEFAULT true
);

CREATE TABLE message_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    client_id uuid REFERENCES clients(id),
    template_key text REFERENCES whatsapp_templates(key),
    prepared_by uuid REFERENCES profiles(id),
    prepared_at timestamptz DEFAULT now(),
    marked_sent bool DEFAULT false
);

CREATE TABLE targets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    created_by uuid,
    updated_by uuid,
    deleted_at timestamptz,
    is_demo bool DEFAULT false,
    user_id uuid REFERENCES profiles(id),
    month date NOT NULL,
    disbursal_target numeric(14,2)
);
