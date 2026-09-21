-- 00009_triggers.sql

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name NOT IN ('audit_log')
    LOOP
        EXECUTE format('CREATE TRIGGER set_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t);
        EXECUTE format('CREATE TRIGGER audit_changes AFTER INSERT OR UPDATE OR DELETE ON %I FOR EACH ROW EXECUTE FUNCTION audit_trigger();', t);
    END LOOP;
END;
$$;

-- Apply sensitive data guard to all tables with text columns
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT DISTINCT table_name FROM information_schema.columns 
        WHERE table_schema = 'public' AND data_type = 'text' 
        AND table_name NOT IN ('audit_log')
    LOOP
        EXECUTE format('CREATE TRIGGER guard_sensitive_data BEFORE INSERT OR UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION sensitive_data_guard();', t);
    END LOOP;
END;
$$;
