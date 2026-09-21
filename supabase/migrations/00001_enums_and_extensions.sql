-- 00001_enums_and_extensions.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- CREATE EXTENSION IF NOT EXISTS "pg_cron";
-- CREATE EXTENSION IF NOT EXISTS "pg_net";

-- Create enums
CREATE TYPE user_role AS ENUM ('admin', 'staff');
CREATE TYPE lender_type AS ENUM ('Bank', 'NBFC', 'HFC', 'Other');
CREATE TYPE stage_kind AS ENUM ('progress', 'hold', 'won', 'lost');
CREATE TYPE consent_channel AS ENUM ('website_form', 'verbal', 'whatsapp', 'paper');
CREATE TYPE co_applicant_role AS ENUM ('Co-applicant', 'Guarantor');
CREATE TYPE doc_party AS ENUM ('Applicant', 'Co-applicant', 'Property', 'Business');
CREATE TYPE doc_status AS ENUM ('Pending', 'Requested', 'Received', 'Verified', 'Query', 'Not applicable');
