-- 00010_rls_policies.sql

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', t);
        EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY;', t);
    END LOOP;
END;
$$;

-- Admin full access to everything
CREATE POLICY admin_all ON profiles FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON lenders FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON products FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON market_roi_history FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON bankers FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON stages FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON lookup_values FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON settings FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON referrers FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON leads FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON clients FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON consent_log FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON cases FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON case_submissions FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON submission_stage_history FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON co_applicants FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON doc_templates FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON case_documents FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON loans FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON payout_grid FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON payouts FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON payout_receipts FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON contact_log FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON tasks FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON notifications FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON whatsapp_templates FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON message_events FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON targets FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON lender_fit_rules FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );
CREATE POLICY admin_all ON audit_log FOR ALL USING ( (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin' );

-- Staff policies
CREATE POLICY staff_leads ON leads FOR ALL USING ( assigned_to = auth.uid() );
CREATE POLICY staff_clients ON clients FOR ALL USING ( 
    relationship_owner = auth.uid() 
    OR id IN (SELECT client_id FROM cases WHERE handled_by = auth.uid())
    OR id IN (SELECT client_id FROM loans WHERE handled_by = auth.uid())
);
CREATE POLICY staff_cases ON cases FOR ALL USING ( handled_by = auth.uid() );
CREATE POLICY staff_case_submissions ON case_submissions FOR ALL USING ( case_id IN (SELECT id FROM cases WHERE handled_by = auth.uid()) );
CREATE POLICY staff_loans ON loans FOR ALL USING ( handled_by = auth.uid() );
CREATE POLICY staff_contact_log ON contact_log FOR ALL USING ( client_id IN (SELECT id FROM clients WHERE relationship_owner = auth.uid() OR id IN (SELECT client_id FROM cases WHERE handled_by = auth.uid()) OR id IN (SELECT client_id FROM loans WHERE handled_by = auth.uid())) );
CREATE POLICY staff_case_documents ON case_documents FOR ALL USING ( case_id IN (SELECT id FROM cases WHERE handled_by = auth.uid()) );
CREATE POLICY staff_co_applicants ON co_applicants FOR ALL USING ( case_id IN (SELECT id FROM cases WHERE handled_by = auth.uid()) );

CREATE POLICY staff_profiles_read ON profiles FOR SELECT USING ( is_active = true );
CREATE POLICY staff_profiles_update ON profiles FOR UPDATE USING ( id = auth.uid() ) WITH CHECK ( role = (SELECT role FROM profiles WHERE id = auth.uid()) );

CREATE POLICY staff_lenders_read ON lenders FOR SELECT USING (true);
CREATE POLICY staff_products_read ON products FOR SELECT USING (true);
CREATE POLICY staff_stages_read ON stages FOR SELECT USING (true);
CREATE POLICY staff_bankers_read ON bankers FOR SELECT USING (true);
CREATE POLICY staff_settings_read ON settings FOR SELECT USING (true);
CREATE POLICY staff_lookup_read ON lookup_values FOR SELECT USING (true);
CREATE POLICY staff_whatsapp_templates_read ON whatsapp_templates FOR SELECT USING (true);

CREATE POLICY staff_consent_log ON consent_log FOR ALL USING ( subject IN (SELECT id FROM clients WHERE relationship_owner = auth.uid() OR id IN (SELECT client_id FROM cases WHERE handled_by = auth.uid()) OR id IN (SELECT client_id FROM loans WHERE handled_by = auth.uid())) );
CREATE POLICY staff_notifications ON notifications FOR ALL USING ( user_id = auth.uid() );
CREATE POLICY staff_tasks ON tasks FOR ALL USING ( assigned_to = auth.uid() );
