-- 00008_functions.sql

CREATE OR REPLACE FUNCTION app_today() RETURNS date AS $$
DECLARE
    td date;
BEGIN
    SELECT today_override INTO td FROM settings WHERE id = '00000000-0000-0000-0000-000000000001';
    IF td IS NOT NULL THEN
        RETURN td;
    END IF;
    RETURN (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata')::date;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION next_code(prefix text) RETURNS text AS $$
DECLARE
    next_val integer;
    tbl text;
    col text;
    res text;
BEGIN
    IF prefix = 'LD' THEN tbl := 'leads'; col := 'lead_code';
    ELSIF prefix = 'CL' THEN tbl := 'clients'; col := 'client_code';
    ELSIF prefix = 'CS' THEN tbl := 'cases'; col := 'case_code';
    ELSIF prefix = 'LN' THEN tbl := 'loans'; col := 'loan_code';
    ELSE RAISE EXCEPTION 'Unknown prefix %', prefix;
    END IF;
    
    EXECUTE format('SELECT COALESCE(MAX(NULLIF(regexp_replace(%I, ''^%s-'', ''''), '''')), ''0'')::int + 1 FROM %I', col, prefix, tbl) INTO next_val;
    
    res := prefix || '-' || lpad(next_val::text, 4, '0');
    RETURN res;
END;
$$ LANGUAGE plpgsql VOLATILE;

CREATE OR REPLACE FUNCTION check_duplicate_mobile(p_mobile text, p_owner_id uuid) RETURNS boolean AS $$
DECLARE
    found_dup boolean;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM clients WHERE mobile = p_mobile AND relationship_owner != p_owner_id AND deleted_at IS NULL
    ) INTO found_dup;
    RETURN found_dup;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION sensitive_data_guard() RETURNS trigger AS $$
DECLARE
    col RECORD;
    val text;
BEGIN
    FOR col IN SELECT column_name FROM information_schema.columns WHERE table_name = TG_TABLE_NAME AND data_type = 'text' LOOP
        EXECUTE format('SELECT $1.%I', col.column_name) INTO val USING NEW;
        IF val IS NOT NULL THEN
            IF val ~ '[A-Z]{5}[0-9]{4}[A-Z]' OR val ~ '\b\d{4}\s?\d{4}\s?\d{4}\b' THEN
                RAISE EXCEPTION 'This looks like a PAN or Aadhaar number. Please don''t store it here — paste the documents folder link instead.';
            END IF;
        END IF;
    END LOOP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION audit_trigger() RETURNS trigger AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log(user_id, action, table_name, record_id, old)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, OLD.id, row_to_json(OLD)::jsonb);
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log(user_id, action, table_name, record_id, old, new)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log(user_id, action, table_name, record_id, new)
        VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW)::jsonb);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION change_stage(p_submission_id uuid, p_new_stage_id uuid, p_note text, p_next_followup_on date, p_login_on date, p_sanctioned_amount numeric, p_sanction_on date, p_reject_reason text, p_competitor text) RETURNS void AS $$
DECLARE
    v_sub case_submissions%ROWTYPE;
    v_old_stage stages%ROWTYPE;
    v_new_stage stages%ROWTYPE;
    v_days int;
BEGIN
    SELECT * INTO v_sub FROM case_submissions WHERE id = p_submission_id;
    SELECT * INTO v_old_stage FROM stages WHERE id = v_sub.stage_id;
    SELECT * INTO v_new_stage FROM stages WHERE id = p_new_stage_id;
    
    v_days := COALESCE(app_today() - v_sub.stage_updated_on, 0);
    
    IF v_new_stage.is_open AND p_next_followup_on IS NULL THEN RAISE EXCEPTION 'Open stage requires next_followup_on'; END IF;
    IF v_new_stage.name = 'Logged In (Filed)' AND p_login_on IS NULL THEN RAISE EXCEPTION 'Logged In requires login_on'; END IF;
    IF v_new_stage.name = 'Sanctioned' AND (p_sanctioned_amount IS NULL OR p_sanction_on IS NULL) THEN RAISE EXCEPTION 'Sanctioned requires amount and date'; END IF;
    IF v_new_stage.kind = 'lost' AND p_reject_reason IS NULL THEN RAISE EXCEPTION 'Lost/Rejected requires reason'; END IF;
    
    UPDATE case_submissions SET 
        stage_id = p_new_stage_id, 
        stage_updated_on = app_today(),
        next_followup_on = COALESCE(p_next_followup_on, next_followup_on),
        login_on = COALESCE(p_login_on, login_on),
        sanctioned_amount = COALESCE(p_sanctioned_amount, sanctioned_amount),
        sanction_on = COALESCE(p_sanction_on, sanction_on),
        reject_reason = COALESCE(p_reject_reason, reject_reason),
        competitor_name = COALESCE(p_competitor, competitor_name)
    WHERE id = p_submission_id;
    
    INSERT INTO submission_stage_history(submission_id, from_stage, to_stage, changed_by, note, days_in_previous_stage)
    VALUES (p_submission_id, v_old_stage.id, p_new_stage_id, auth.uid(), p_note, v_days);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION convert_lead(p_lead_id uuid) RETURNS uuid AS $$
DECLARE
    v_lead leads%ROWTYPE;
    v_client_id uuid;
BEGIN
    SELECT * INTO v_lead FROM leads WHERE id = p_lead_id;
    
    SELECT id INTO v_client_id FROM clients WHERE mobile = v_lead.mobile;
    
    IF v_client_id IS NULL THEN
        INSERT INTO clients(client_code, name, mobile, city_area, referral_source, referrer_id, relationship_owner, client_since)
        VALUES (next_code('CL'), v_lead.name, v_lead.mobile, v_lead.city_area, v_lead.source, v_lead.referrer_id, v_lead.assigned_to, app_today())
        RETURNING id INTO v_client_id;
    END IF;
    
    UPDATE leads SET status = 'Converted', converted_client_id = v_client_id WHERE id = p_lead_id;
    
    RETURN v_client_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_loan_from_submission(p_submission_id uuid, p_disbursed_amount numeric, p_disbursed_on date, p_roi numeric, p_tenure int, p_loan_ac_last4 text) RETURNS uuid AS $$
DECLARE
    v_sub case_submissions%ROWTYPE;
    v_case cases%ROWTYPE;
    v_loan_id uuid;
BEGIN
    SELECT * INTO v_sub FROM case_submissions WHERE id = p_submission_id;
    SELECT * INTO v_case FROM cases WHERE id = v_sub.case_id;
    
    INSERT INTO loans(loan_code, client_id, source_case_id, source_submission_id, product_id, lender_id, banker_id, handled_by, loan_ac_last4, disbursed_amount, disbursed_on, current_roi, tenure_months, loan_status)
    VALUES (next_code('LN'), v_case.client_id, v_case.id, v_sub.id, v_case.product_id, v_sub.lender_id, v_sub.banker_id, v_case.handled_by, p_loan_ac_last4, p_disbursed_amount, p_disbursed_on, p_roi, p_tenure, 'Active')
    RETURNING id INTO v_loan_id;
    
    INSERT INTO payouts(loan_id, status) VALUES (v_loan_id, 'Not Claimed');
    
    RETURN v_loan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION anonymize_client(p_client_id uuid) RETURNS void AS $$
BEGIN
    UPDATE clients SET 
        name = 'ANONYMIZED', 
        mobile = '0000000000', 
        email = NULL, 
        contact_person = NULL, 
        dob_or_incorporation = NULL,
        documents_folder_link = NULL,
        notes = 'Data scrubbed on request'
    WHERE id = p_client_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
