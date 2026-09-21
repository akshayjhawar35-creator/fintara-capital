# Fintara Capital — Fintara Loan Desk Specification

> **This file is the single source of truth for the entire project. It was saved verbatim from the master prompt pack per operating rule A0.1.**

---

# PART A — MASTER SPEC

## A0. Your role and operating rules

You are a senior full-stack engineer and product designer. Build **Fintara Loan Desk**: a secure internal CRM and case-tracking system for a small DSA (Direct Selling Agent) loan-facilitation firm, **Fintara Capital**, **plus** the firm's public marketing website with enquiry form and calculators. It replaces an Excel workbook called "DSA Client & Loan Tracker" and must preserve every rule in that workbook (all captured below), then improve on it.

**Operating rules — follow these strictly:**

1. **First action:** save this entire specification (Part A + Appendix) verbatim to `docs/SPEC.md` in the repo.
2. **Second action:** produce an **Implementation Plan artifact** containing: architecture diagram, folder structure, full database schema, security/RLS approach, the design plan described in A4 (tokens + ASCII wireframes for the 5 key screens), phase-by-phase task list, risks, and any open questions. **Do not write application code until I approve the plan.**
3. Work **one phase at a time** (Part B). At the end of each phase: run migrations, run unit tests, launch the app in the browser, execute every acceptance test for that phase, attach screenshots or a recording as artifacts, update `docs/PROGRESS.md`, then **stop and wait for my go-ahead**.
4. **Never invent** financial, legal or regulatory facts. Where a real-world fact is needed (registered address, grievance officer, lender payout %, market ROI, empanelment wording) use a clearly marked placeholder such as `[OWNER TO FILL]`. Values given in this spec marked "placeholder" must be labelled as placeholders in the UI.
5. **Never store** Aadhaar numbers, PAN numbers, full bank-account numbers, passwords or OTPs anywhere in the database, notes, logs or code. Enforce this with the "sensitive-data guard" in A9.
6. Secrets go in environment variables only. Never commit secrets. Provide `.env.example`. The Supabase **service-role key must never reach the browser**.
7. Only ask me a question if you are truly blocked. Otherwise pick the sensible default, and record the decision with a one-line reason in `docs/DECISIONS.md`.
8. Code quality: TypeScript `strict`, ESLint + Prettier, small focused modules, meaningful names, comments only where the "why" is not obvious. Every business rule in A7 must have unit tests using the test vectors in the Appendix.
9. **Single source of truth for derived values:** alerts, EMI, outstanding balance, flags and dashboard numbers are computed in **Postgres views/functions** (so filtering and sorting happen server-side and RLS applies). The public calculators use the same formulas in `lib/finance.ts`. Both implementations must pass the same shared test vectors.
10. Write all user-facing text in plain English (see "Voice" in A4). English only, but keep all strings in one place so translation is possible later.

## A1. Business context

- **Fintara Capital** is a single-firm DSA / loan-facilitation business in **Raipur, Chhattisgarh, India**. Team: the Owner plus up to 3 staff. It sources loans from many banks and NBFCs (list in Appendix) and earns **payouts** — a % of the disbursed amount, set by each lender per product.
- **Products:** Home Loan, Loan Against Property (LAP), Business Loan, Working Capital (OD/CC), Personal Loan, Car Loan, Education Loan, Gold Loan, Machinery/Equipment Loan, plus Credit Card and Insurance (tracked, no ROI benchmark).
- **Case types:** Fresh, Balance Transfer (takeover), Top-up, Enhancement / Renewal.
- **Lifecycle the system must support (from the workbook):**
  1. **Enquiry** — add to Leads; set Assigned To and a Next Follow-up **within 24 hours**.
  2. **Qualify** — call, check income / ITR / GST / CIBIL, choose the right lender(s); update Lead Status.
  3. **Convert** — create the Client (new Client ID), then create a Case; set stage Enquiry Qualified or Docs Collection.
  4. **Track** — every stage change updates Stage and "Stage Updated On"; always keep a Next Follow-up Date; Expected Disbursal Date drives the disbursal alert.
  5. **Sanction** — record Sanctioned Amount and Sanction Date; pipeline value switches from requested to sanctioned amount automatically.
  6. **Disburse** — stage = Disbursed → create the Loan in the Portfolio (amount, date, ROI, tenure) → payout tracked (Not Claimed → Claimed → Received / Disputed).
  7. **Retain** — Portfolio raises review reminders, takeover alerts, top-up windows; every touchpoint is logged in the Contact Log.
- **Routines the software must make effortless:** *Every morning (10 min):* see everything OVERDUE / DUE TODAY / due soon and clear it. *Every week:* review STUCK cases, chase bankers, see portfolio reviews due in 30 days. *Every month:* update market ROI benchmarks, call TAKEOVER CANDIDATE and TOP-UP WINDOW OPEN clients, chase unpaid payouts.
- **Success criteria:** (a) the Owner clears the morning list in under 10 minutes; (b) no case sits stuck unnoticed; (c) no payout slips through; (d) every disbursed client is re-approached at the right time; (e) a new enquiry from the website reaches the right person within a minute.

## A2. Users, roles and login

There are **two roles** in v1: `admin` (the Owner) and `staff`. A client portal exists only as an optional, feature-flagged Phase 8 (off by default).

**Authentication**
- Email + password for everyone. **No OTP or 2-step for admin** (owner's decision). Password minimum 10 characters. No public sign-up.
- Admin creates staff accounts (invite by email, or set a temporary password with forced change on first login). Password reset by email.
- Sessions: idle timeout default 8 hours (configurable in Settings); "Sign out of all devices" button in profile.
- Brute-force protection: rely on Supabase Auth rate limits and show Cloudflare Turnstile on the login form after 3 failed attempts.
- Staff are **deactivated, never deleted**; deactivating opens a "Reassign their open leads/cases/loans" dialog.
- Keep a feature flag `enable_admin_totp` (default **off**) so authenticator-app 2-step can be switched on later without code changes.

**What "own" means for staff**
- **Leads:** assigned_to = me.
- **Cases / submissions:** handled_by = me.
- **Loans:** handled_by = me.
- **Clients:** relationship_owner = me OR the client has a case or loan handled by me.
- **Contact-log rows and documents:** visible if the client is visible to me.

**Permission matrix**

| Capability | Admin (Owner) | Staff |
|---|---|---|
| See all leads / clients / cases / loans | ✅ | Own only |
| Create/edit leads, clients, cases, contact logs | ✅ | Own only |
| Change stage, add documents, co-applicants | ✅ | Own only |
| Reassign records to another person | ✅ | ❌ |
| Payouts, payout grid, commission %, expected payout | ✅ | ❌ (columns and screens hidden **and** blocked at database level) |
| Firm-wide dashboard and reports | ✅ | Own-numbers dashboard only |
| Bankers / lenders directory | ✅ edit | Read |
| Calculators, WhatsApp templates (use) | ✅ | ✅ |
| Settings, stages, lists, market ROI, doc checklists | ✅ | ❌ |
| Users, targets, audit log, consent registry | ✅ | ❌ |
| Import / export / backup / delete demo data | ✅ | ❌ |
| Delete records | Soft-delete only, audited | ❌ |

**Duplicate-mobile privacy:** when staff enter a mobile number that already exists under another person's ownership, show "This mobile already exists with another team member — ask the Owner" without revealing any details. Implement with a `SECURITY DEFINER` function that returns only a boolean.

## A3. Tech stack and architecture (free-first)

The owner wants **free options**. Design for the free tiers, keep everything host-agnostic, and document upgrade paths.

| Layer | Choice | Notes |
|---|---|---|
| Frontend | **Next.js (App Router) + TypeScript**, built as a **static export** (`output: "export"`) | No server runtime needed → hosts free anywhere |
| UI | Tailwind CSS, shadcn/ui (Radix), Lucide icons, Sonner toasts, cmdk (⌘K search) | |
| Data/forms | TanStack Query, TanStack Table, React Hook Form + Zod, date-fns (Asia/Kolkata), Recharts, dnd-kit (Kanban) | |
| PWA | Serwist (or next-pwa) — installable on phone, app-shell cache, Web Push | No offline writes in v1 |
| Backend | **Supabase**: Postgres 15+, Auth, Row-Level Security, Edge Functions (Deno), `pg_cron`, `pg_net` | Free plan; **DB region: Mumbai (ap-south-1)** — verify availability at project creation, so data stays in India |
| Hosting | **Cloudflare Pages** (free) with domain `fintara.capital` on Cloudflare DNS | **Do NOT use Vercel Hobby — its free plan is non-commercial only.** Netlify free is an acceptable alternative; verify current terms before launch |
| Email | **Resend** or **Brevo** free tier via an Edge Function | Needs SPF/DKIM DNS records on fintara.capital. Supabase's built-in email is too rate-limited for digests |
| Bot protection | Cloudflare **Turnstile** (free) + honeypot field + per-IP rate limit | On the public enquiry form and login after 3 failures |
| WhatsApp | **Free `wa.me` click-to-chat links** with pre-filled text (no paid API) | Staff tap "Open in WhatsApp"; app logs it |
| Push alerts | In-app bell + **Web Push (PWA)** + optional **Telegram bot** + optional personal **calendar (.ics) feed** | All free |
| Analytics | Cloudflare Web Analytics on the public site only (cookie-free) | |
| Backups | Admin "Download full backup" (ZIP of CSVs) + optional nightly **encrypted `pg_dump` via GitHub Actions** (private repo, use Supabase's **session-pooler** connection string because GitHub runners are IPv4-only) | Free Supabase has **no daily backups** — this matters |
| Keep-alive | A daily `pg_cron` job that touches the database | Free Supabase projects **pause after 7 days of inactivity** |

**Static-export rules the agent must respect**
- No Next.js API routes, middleware, server actions or SSR-only features. All server-side work runs in **Supabase Edge Functions** or **Postgres RPC functions**.
- Detail pages use query strings (e.g. `/app/cases/detail?id=CS-0001`) — not dynamic path segments — so static export works.
- Auth gating is client-side for UX, but **real security is Row-Level Security in Postgres** (A9).
- If static export proves too limiting, do not silently switch. Flag it in the Implementation Plan with the proposed alternative (Next.js on Cloudflare Workers via OpenNext) and wait for my approval.

**Repository layout (proposed)**
```
/app                     Next.js routes (public site + /app staff area)
/components  /lib        UI components, hooks, finance.ts, format.ts (INR, dates), supabase client
/supabase
  /migrations            versioned SQL (tables, enums, RLS, views, functions, cron)
  /functions             submit-enquiry, daily-digest, send-email, calendar-feed, admin-create-user, export-backup, import-workbook
  seed.sql               lookups + demo data (flagged is_demo)
/tests                   vitest unit tests, SQL tests, playwright e2e
/docs                    SPEC.md, PROGRESS.md, DECISIONS.md, OPERATIONS.md, USER_GUIDE.md
/public/brand            SVG logo set, favicons, OG image
.env.example
```

**Environment variables:** `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (browser-safe); `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SECRET`, `RESEND_API_KEY` (or Brevo), `TELEGRAM_BOT_TOKEN`, `VAPID_PRIVATE_KEY` (Edge Function secrets only).

## A4. Brand and design system

**Brand:** Fintara Capital. *Fintara* = "fin" + *tara* (star) — a guiding star for a client's borrowing journey. Tone: calm, precise, trustworthy, plain-spoken. Default tagline (owner can change): **"Loans, arranged across lenders."** Avoid promises like "best rate" or "guaranteed approval".

**Logo (the agent creates it — no logo exists yet).** Deliver an SVG set in `/public/brand`: mark, horizontal lockup, stacked lockup, one-colour (mono) version, favicon (32/192/512 PNG), Open Graph image (1200×630).
- *Mark:* a rounded-square tile in Midnight Ink. Inside, a geometric **"F"** whose two horizontal bars step upward left-to-right; a **four-point gold star (the *tara*)** sits at the tip of the upper bar.
- *Wordmark:* "Fintara" in a semibold humanist sans, with "Capital" in a lighter weight on the same baseline. Title case — no tracked-out all-caps.

**Palette (named tokens; define as CSS variables, light theme first)**

| Token | Hex | Use |
|---|---|---|
| Midnight Ink | `#101A3D` | Primary: nav, headings, primary buttons |
| Star Gold | `#E2A62B` | The single accent — the star, key highlights, CTA on dark. Use sparingly |
| Lake Teal | `#1B7F8E` | Links, info, secondary actions |
| Paper | `#F7F8FB` | App background |
| White | `#FFFFFF` | Surfaces |
| Slate | `#475069` | Secondary text |

**Alert colours — keep the workbook's meanings so muscle memory carries over.** Always pair colour with a text label and icon (never colour alone):
Red = OVERDUE · Orange = DUE TODAY · Yellow = due within reminder window · Green = OK · Blue = takeover / within 30 days · Purple = top-up window. Verify every pairing meets **WCAG AA** contrast (yellow needs dark text).

**Typography:** two clearly different families. **App UI:** *IBM Plex Sans* (excellent tabular numerals; use `tabular-nums` for all money). **Public-site headlines:** *Newsreader* (serif). Base 16px on public site, 14px in dense tables. Line length under 80 characters. Self-host the fonts (no third-party font requests).

**Number and date formats (build shared utilities and use them everywhere)**
- Indian grouping: `₹12,45,000`. Compact: `₹12.5 L`, `₹1.25 Cr`. ROI as `9.35%`. Percent-point gaps as `0.60 pp`.
- Dates as `20 Sep 2026`; all logic in **IST (Asia/Kolkata)**. Mobile: 10 digits starting 6–9, displayed `98000 00011`.

**Design principles**
- **Spend boldness in one place: the gold star.** Everything else is quiet and disciplined.
- Do **not** produce the generic AI-fintech look: no identical rounded-card grids for every section, no gradient washes, no one-shadow-on-everything, no tracked-out ALL-CAPS eyebrow labels above headings, no single-word accent colour inside headlines, no "→" on every button, no numbered markers unless the content is truly a sequence.
- Motion only in response to a user action (open, expand, confirm), plus **one** orchestrated moment on the public hero. Respect `prefers-reduced-motion`.
- **Public hero = the most characteristic thing in this business:** a live **"What could you save?" balance-transfer calculator** (existing loan amount, current ROI, remaining tenure → estimated yearly saving at an indicative market ROI, with caveats), next to a short enquiry action. No stock photos of handshakes or houses.
- **Staff app = dense, table-first, fast.** Sticky filters, saved views, quick-add button, ⌘K/`/` global search, split-pane detail drawers, Kanban for the pipeline, alert pills with text, helpful empty states that name the next action. Mobile: bottom navigation with a big "Log interaction" button.
- Visible keyboard focus, labels on every input, touch targets ≥ 44px, responsive from **360px** width.
- **Voice:** plain English, sentence case, active verbs ("Save changes", "Log call", "Create loan"). A button and the toast it produces use the same verb. Errors say what went wrong **and how to fix it**; they never apologise or stay vague.

**Design plan (do this before building UI).** In the Implementation Plan, write a compact design plan — colour, type, layout concept, principles — plus ASCII wireframes for: (1) public home hero, (2) My Day, (3) Pipeline Kanban, (4) Case detail, (5) Portfolio radar. Then critique it: if any part looks like a generic template rather than a choice made for Fintara, revise it and say what you changed.

## A5. Site map and screens

### Public website (`fintara.capital`)
`/` Home (hero calculator, how it works — a true sequence so numbered steps are fine, products, lenders we work with listed **alphabetically with no ranking and no logos**, FAQ, contact) · `/loans/{home-loan, loan-against-property, business-loan, working-capital, personal-loan, car-loan, education-loan, gold-loan, machinery-loan}` (who it's for, typical documents, process, indicative rate range `[OWNER TO FILL]`, FAQs, enquiry form) · `/balance-transfer` · `/calculators/emi` · `/calculators/eligibility` · `/apply` · `/about` · `/contact` (with WhatsApp button, map link, Google Business Profile link) · `/privacy` · `/terms` · `/disclosures` (states that Fintara Capital is a loan facilitator/DSA, not a lender; lender list; grievance officer `[OWNER TO FILL]`) · `/grievance`.
- Technical: `sitemap.xml`, `robots.txt`, JSON-LD (`FinancialService` / `LocalBusiness`), Open Graph tags, floating WhatsApp button, cookie-free analytics, Lighthouse ≥ 90.
- **Enquiry form** fields: name, mobile, city/area, product, amount needed, employment type, optional message, and an **unticked consent checkbox** with plain purpose text and a privacy-policy link. Submitting calls Edge Function `submit-enquiry`, which verifies Turnstile, applies a per-IP rate limit, creates a **Lead** (source from UTM → "Website / Google Search" or "Instagram / Facebook"; else "Website / Google Search"), writes a **consent_log** row (text version, timestamp, page URL), assigns per the setting `auto_assign_website_leads` (default: Owner), and notifies the assignee instantly (in-app + email + Telegram if linked). Show a clear confirmation. Never auto-send WhatsApp.
- Every rate or saving figure on the public site is labelled **"Indicative. Subject to lender approval, eligibility and charges."**

### Staff app (`/app`)
- **My Day** (home): one unified list of everything needing action — overdue / due today / due soon follow-ups (leads, cases, contact-log actions), stuck cases, expected disbursals, docs overdue, birthdays this week; one-tap **Call**, **WhatsApp**, **Log**, **Snooze**, **Done**. Admin sees firm-wide with a staff filter.
- **Leads** (table + Kanban by status, quick-add, 24-hour follow-up SLA flag) · **Clients** (list; **Client 360** detail with tabs: Overview, Cases, Loans, Timeline of contacts, Documents link, Consent) · **Pipeline** (Kanban by stage + table toggle; filters by lender, banker, owner, product, case type, alert) · **Case detail** (see A7) · **Portfolio** (table with quick filters: Takeover candidates, Top-up window open, Reviews due, Payout unpaid) · **Loan detail** · **Contact Log** (plus a global "Log interaction" button reachable from anywhere in under 10 seconds) · **Bankers** · **Tools** (EMI, eligibility, balance-transfer saving, later Lender Fit) · **Profile** (password, notification preferences, link Telegram, calendar feed URL).
- Global shortcuts: `n` new lead, `l` log interaction, `/` search.

### Admin-only (`/app/admin`)
Firm dashboard · **Payouts** (claim, invoice, receipts, TDS, ageing, disputes) · **Payout Grid** · **Reports** · **Team** (users, targets) · **Settings** (thresholds, stages, lists, market ROI + history, document checklists, WhatsApp templates, lender-fit rules, test-date override) · **Audit log** · **Consent registry** · **Data requests** · **Import** (Excel workbook) · **Export / Backup** · **Delete demo data**.

## A6. Data model (Postgres)

**Conventions:** snake_case; every business table has `id uuid pk`, `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at` (soft delete) and `is_demo bool default false`. **Business codes** are text, unique, generated by `next_code('LD')` → `LD-0001` (4-digit padding, grows past 9999), for **LD** (lead), **CL** (client), **CS** (case), **LN** (loan). Codes are **never reused or renumbered**; soft delete guarantees this. Money is `numeric(14,2)`; ROI is stored as a decimal fraction (`0.0935` = 9.35%).

**Tables**

1. `profiles` — id (→ auth.users), full_name, email, mobile, role (`admin|staff`), team_label (Owner, Staff 1…), is_active, monthly_disbursal_target, telegram_chat_id, notif_prefs jsonb, calendar_token, last_login_at.
2. `lenders` — name (unique), type (`Bank|NBFC|HFC|Other`), is_active, notes. Seed from Appendix.
3. `products` — name (unique), is_secured (drives whether the Legal / Valuation stage is offered), has_roi_benchmark, sort. Seed from Appendix.
4. `market_roi_history` — product_id, roi, effective_from, set_by. *Current market ROI = latest row with effective_from ≤ today.* Keeps history so monthly updates are traceable.
5. `bankers` — lender_id, name, designation, branch_city, mobile, email, products_handled, escalation_name, escalation_mobile, tat_days_min, tat_days_max, remarks, is_active.
6. `stages` — name, sort, win_probability, is_open, kind (`progress|hold|won|lost`), stuck_days (nullable → falls back to the global default), only_for_secured bool, color. Seed from Appendix.
7. `lookup_values` — list_key, value, sort, is_active, meta jsonb. Lists: lead_source, lead_status, contact_type, case_type, loan_status, payout_status, client_type, loss_reason, referrer_type, yes_no.
8. `settings` — single row: today_override (date, testing only), reminder_window_days, lookahead_days, takeover_gap_pp, takeover_min_months, review_interval_months, checkin_interval_days, topup_after_months, stuck_days_default, unpaid_payout_days, docs_pending_days, sanction_validity_days, session_idle_hours, auto_assign_website_leads, feature flags (`enable_admin_totp`, `enable_client_portal`, `enable_lender_fit`). Seed defaults from Appendix; all are **placeholders the owner can change**.
9. `referrers` — name, type (Client / Builder-Broker / CA / Sub-agent / Other), mobile, notes.
10. `leads` — lead_code, date_received, source, name, mobile, city_area, product_id, amount_needed, assigned_to, status, last_contact_on, next_followup_on, converted_client_id, referrer_id, utm jsonb, remarks.
11. `clients` — client_code, name, client_type, contact_person, mobile (**unique**), email, city_area, occupation, annual_income_or_turnover, dob_or_incorporation, client_since, referral_source, referrer_id, relationship_owner, consent_updates (bool), documents_folder_link, notes.
12. `consent_log` — subject (client_id or lead_id), purpose, channel (`website_form|verbal|whatsapp|paper`), given (bool), captured_by, captured_at, text_version, page_url. Append-only. `clients.consent_updates` always reflects the latest row.
13. `cases` — case_code, client_id, case_type, product_id, amount_requested, purpose, handled_by, existing_lender, existing_roi, existing_outstanding, source_loan_id (for BT/top-up from Portfolio), lost_reason, closed_on, remarks. *A case = one client requirement.*
14. `case_submissions` — case_id, suffix (A, B, C…), lender_id, banker_id, stage_id, stage_updated_on, lender_file_no, login_on, sanctioned_amount, sanction_on, sanctioned_roi, proposed_roi, expected_disbursal_on, next_followup_on, reject_reason, competitor_name, remarks. *One row per lender the case is submitted to — this is the multi-lender improvement over the workbook, where one case meant one lender.*
15. `submission_stage_history` — submission_id, from_stage, to_stage, changed_by, changed_at, note, days_in_previous_stage.
16. `co_applicants` — case_id, name, mobile, relation, role (`Co-applicant|Guarantor`), annual_income, client_id (nullable).
17. `doc_templates` — product_id (nullable = all), client_type (nullable = all), party (`Applicant|Co-applicant|Property|Business`), doc_name, is_mandatory, sort. Seed from Appendix (owner edits).
18. `case_documents` — case_id, template_id, doc_name, party, status (`Pending|Requested|Received|Verified|Query|Not applicable`), requested_on, received_on, link_url, remarks. **Links only — no file uploads in v1.**
19. `loans` — loan_code, client_id, source_case_id, source_submission_id, product_id, lender_id, banker_id, handled_by, loan_ac_last4 (**check `^\d{4}$`**), disbursed_amount, disbursed_on, current_roi, tenure_months, loan_status, last_review_on, closed_on, remarks.
20. `payout_grid` — lender_id, product_id, case_type (nullable = all), payout_pct, valid_from, notes.
21. `payouts` — loan_id (unique), payout_pct_snapshot, expected_amount, status, claimed_on, invoice_no, invoice_date, dispute_note, followup_on.
22. `payout_receipts` — payout_id, received_on, gross_amount, tds_amount, gst_amount, net_amount, reference. *Many receipts per payout (part-payments, trail).* Status stays manual as in the workbook, but the UI suggests "Received" when receipts cover the expected amount.
23. `contact_log` — contacted_on, client_id, lead_id (nullable), contact_type, done_by, related_code, summary, next_action, next_action_on, action_done, done_on.
24. `tasks` — manual tasks: title, due_on, assigned_to, related_code, done.
25. `notifications` — user_id, kind, title, body, link, dedupe_key, created_at, read_at.
26. `whatsapp_templates` — key, title, category, body, requires_consent. Seed from Appendix.
27. `message_events` — client_id, template_key, prepared_by, prepared_at, marked_sent. Marking sent also writes a `contact_log` row.
28. `targets` — user_id (null = firm), month, disbursal_target.
29. `lender_fit_rules` (Phase 7) — lender_id, product_id, min_cibil, min_business_vintage_months, min_income_annual, max_foir, max_ltv, accepted_property_types text[], min_amount, max_amount, notes. **Seed empty — the owner enters real values; the agent must not invent any.**
30. `audit_log` — at, user_id, action, table_name, record_id, old jsonb, new jsonb. Written by triggers on every business table. **Append-only** (no update/delete policy for anyone).
31. `data_requests`, `import_jobs`, `rate_limits` — supporting tables.

**Constraints and guards**
- Mobile matches `^[6-9][0-9]{9}$`. Amounts > 0. ROI between 0 and 0.5. Lookup values validated against lists.
- **Sensitive-data guard:** a trigger on every free-text column (remarks, notes, summary, message, etc.) rejects text matching a PAN pattern (`[A-Z]{5}[0-9]{4}[A-Z]`) or a 12-digit Aadhaar-like pattern (`\b\d{4}\s?\d{4}\s?\d{4}\b`). Error text: *"This looks like a PAN or Aadhaar number. Please don't store it here — paste the documents folder link instead."* Mirror the same check in the UI as a live warning.
- Document links: warn (don't block) if the host is not Google Drive, OneDrive or Dropbox.
- Stage changes, lead conversion and loan creation go through **RPC functions** (`change_stage`, `convert_lead`, `create_loan_from_submission`), never raw updates, so the rules in A7 cannot be bypassed.

**Derived views (`security_invoker = true` so RLS applies).** `v_leads`, `v_clients`, `v_submissions` (the pipeline), `v_cases`, `v_loans_staff` (no payout columns) and `v_loans_admin` (with payouts), `v_my_day`, `v_dashboard_admin`, `v_dashboard_staff`. All use `app_today()` = `settings.today_override` if set, else today in IST. Add indexes on all foreign keys and on every date column used by an alert.

## A7. Business rules (the exact logic from the workbook, plus improvements)

Let **today** = `app_today()`. Let **window** = `reminder_window_days` (default 7) and **lookahead** = `lookahead_days` (default 30).

**R1 — Follow-up alert** (open leads, open submissions, and contact-log actions not yet done): date < today → `OVERDUE {n}d`; = today → `DUE TODAY`; ≤ today + window → `Due in {n}d`; else `OK`. Blank when the record is closed or the action is done.

**R2 — Active lead:** status not in (Converted, Not Interested, Lost). A lead with no next follow-up after 24 hours → flag `NO FOLLOW-UP SET`.

**R3 — Days in stage and STUCK:** `days_in_stage = today − stage_updated_on`. If the stage is open and `days_in_stage > stuck threshold` (stage-specific, else the global default of 10) → `STUCK`.

**R4 — Disbursal alert** (open submissions with an expected disbursal date): date < today → `PASSED {n}d`; ≤ window → `Due in {n}d`; ≤ lookahead → `Within 30d`; else blank.

**R5 — Case value:** value = `sanctioned_amount` if set, else `amount_requested`. Weighted value = value × stage win probability. **A case with several submissions counts once** in pipeline totals: use its most advanced open submission (highest win probability; ties → most recently updated). Lender-wise views still show each submission.

**R6 — Balance-transfer saving:** `est_annual_saving = base_amount × (existing_roi − proposed_roi)`, where base = existing outstanding if given, else amount requested. (Workbook example: ₹55,00,000 × (9.35% − 8.40%) = **₹52,250**.) In the BT calculator also accept **processing fee** and **foreclosure charges** and show *net first-year saving* and *months to break even*. Label it an estimate.

**R7 — Loan maths (fixed-ROI, equal-EMI estimate):**
- `r = ROI / 12`; `EMI = P·r·(1+r)^n / ((1+r)^n − 1)`.
- `months_elapsed` = whole completed months from disbursal date to today.
- `est_outstanding = P·((1+r)^n − (1+r)^m) / ((1+r)^n − 1)`, clamped to 0…P; if `m ≥ n` show 0 and flag `MATURED — confirm closure`.
- Always show: *"Estimate. Floating rates, part-payments and moratoriums will differ — check the lender statement before quoting a saving."*

**R8 — Takeover radar:** market ROI = product's current benchmark. `roi_gap = current_roi − market_roi`. Flag `TAKEOVER CANDIDATE` when loan is Active **and** `months_elapsed ≥ takeover_min_months` (6) **and** `roi_gap ≥ takeover_gap_pp` (0.5 pp). `est_annual_saving = est_outstanding × roi_gap`. Products without a benchmark are never flagged.

**R9 — Top-up window:** Active loans only. Opens at `disbursed_on + topup_after_months` (12). If today ≥ that date → `TOP-UP WINDOW OPEN`; else `Opens {Mon YYYY}`.

**R10 — Portfolio review:** `next_review_due = (last_review_on or disbursed_on) + review_interval_months` (6). Alert: past → `OVERDUE {n}d`; today → `DUE TODAY`; ≤ lookahead → `Due in {n}d`; else `OK`. Logging a contact of type "Portfolio Review" prompts to update `last_review_on` on the chosen loan.

**R11 — Client check-in:** last contact = latest contact-log date for the client. No contact → `NO CONTACT YET`; days since > `checkin_interval_days` (90) → `CHECK-IN DUE`; else `OK`. Also show active-loan count and open-case count.

**R12 — Payouts:** payout % = grid lookup by lender + product (+ case type if a specific row exists) using the **latest `valid_from` ≤ disbursal date**; if none qualifies, fall back to the earliest row and show the warning *"Grid starts after disbursal date — verify."* `expected = disbursed_amount × payout %`; snapshot the % onto the payout at loan creation (editable by admin, audited) so later grid edits never rewrite history. `ageing_days = today − disbursed_on` while status is Not Claimed, Claimed or Disputed; flag `UNPAID` when ageing > `unpaid_payout_days` (30). Track invoice no./date and per-receipt gross, TDS, GST, net.

**R13 — Stage transitions (`change_stage` RPC):**
- Sets `stage_updated_on = today` and writes a history row.
- Every **open** stage requires a `next_followup_on`.
- *Logged In* requires `login_on`. *Sanctioned* requires `sanctioned_amount` and `sanction_on`.
- *Legal / Valuation* is offered only for products flagged `is_secured`.
- *Disbursed* opens the **Create loan** wizard (disbursed amount defaults to sanctioned; date; ROI defaults to sanctioned/proposed; tenure; last 4 digits of loan a/c). It creates the loan and a payout (Not Claimed), schedules "Thank the client" (+3 days) and "30-day check-in" tasks, and asks whether to close the case's other open submissions as *Client went with another lender*.
- *Rejected* and *Dropped / Lost* require a reason from the loss-reason list (plus competitor name if "Lost to competitor").
- Moving backwards is allowed with a note (e.g. Sanctioned → Query / Deficiency). Only admin can reopen a terminal case.
- After each move, offer a consent-gated "Send update to client" WhatsApp action.

**R14 — Lead conversion (`convert_lead` RPC):** match an existing client by mobile, else create one with the next CL code (copy name, mobile, city, source, consent). Set lead status Converted and `converted_client_id`. Optionally create a pre-filled case (product, amount, handled_by, type Fresh) with a first submission at *Enquiry Qualified* or *Docs Collection*.

**R15 — Consent gate:** any outbound message action (WhatsApp, email, greeting, rate update) is disabled with an explanation when the client's consent is No or missing. Logging your own calls and visits is always allowed. Every consent change writes a `consent_log` row.

**R16 — Uniqueness:** block duplicate client mobiles; warn on duplicate lead mobiles; codes are unique and never reused.

**R17 — Loan statuses:** Active, Closed – Repaid, Closed – Moved by Us (BT), Lost to Competitor. Only Active loans count in the book, outstanding and radar. "Lost to Competitor" is counted (number and ₹) on the dashboard.

**Improvements beyond the workbook (build these):**
- **R18 Banker TAT tracker:** open submission where `today − login_on > banker.tat_days_max` → `BEYOND BANKER TAT`, with a one-tap **Escalate** showing the escalation contact.
- **R19 Documents overdue:** any document Pending/Requested for more than `docs_pending_days` (5) → `DOCS OVERDUE`; "Send documents reminder" auto-fills the pending list into the WhatsApp template.
- **R20 Sanction expiring:** if `sanction_validity_days` is set (placeholder default 90; owner sets per lender), flag `SANCTION EXPIRING` in the last 7 days.
- **R21 Case health chips** on Kanban cards: Overdue · Stuck · Beyond TAT · Docs overdue · Sanction expiring.
- **R22 Birthdays and anniversaries:** clients whose DOB / incorporation date falls in the next 7 days appear in My Day with a consent-gated greeting template.
- **R23 Referral thank-you:** after a disbursal on a case with a referrer, auto-create a task "Thank {referrer}" due in 7 days; reports show referrer → leads → disbursals → payout.
- **R24 Rate-update queue (monthly):** after market ROI is updated, list Active loans with a gap ≥ threshold, ordered by estimated saving; a queue prepares consent-gated WhatsApp messages **one at a time** (never bulk auto-send).
- **R25 Create BT / top-up case from a Portfolio loan** in one click, pre-filling existing lender, existing ROI, outstanding, and proposed ROI = market ROI.
- **R26 Targets:** monthly disbursal targets per person and firm, with progress bars on dashboards.

## A8. Alerts, notifications and messaging (all free channels)

- **Alerts are computed live from views, never stored**, so they are always current.
- **Daily digest — 08:30 IST** (`pg_cron` → `pg_net` → Edge Function `daily-digest`; store the service key in Supabase Vault). Per user: overdue and due-today counts, stuck cases, disbursals expected this week, docs overdue, birthdays; for admin also unpaid payouts and new website leads. Deliver via in-app notification, email, Telegram (if linked) and Web Push (if subscribed). Dedupe with `dedupe_key = user + kind + date`.
- **Weekly digest — Monday 09:00 IST:** stuck cases, banker-TAT breaches, portfolio reviews due in the next 30 days.
- **Monthly — 1st of the month 09:00 IST:** "Update market ROI benchmarks" reminder, takeover and top-up radar, unpaid payouts.
- **Instant notifications:** new website lead, lead assigned to you, case reassigned to you.
- **WhatsApp (free):** a template library (Appendix). Tapping **Open in WhatsApp** builds `https://wa.me/91{mobile}?text={url-encoded message}`. On return the app asks **"Mark as sent?"**; confirming writes a Contact Log entry (type WhatsApp) and a `message_events` row. Templates auto-fill placeholders (client name, case code, stage, pending documents, expected date, estimated saving…). Blocked by the consent gate (R15). Every template ends with a plain opt-out line.
- **Calendar (free push):** an **Add to Google Calendar** link on every follow-up, and an optional per-user **`.ics` calendar feed** URL (secret token) served by Edge Function `calendar-feed`, so follow-ups and reviews appear in the person's own calendar. Note in the UI that calendar apps refresh subscribed feeds only every few hours.
- **Telegram bot (optional, free):** each user links their Telegram from Profile with a one-time code; digests and instant alerts are pushed there.
- Each user controls their channels and quiet hours in Profile.

## A9. Security, privacy and compliance

- **Row-Level Security on every table, default deny.** Write policies per role exactly as in the permission matrix. Staff cannot read `payouts`, `payout_receipts`, `payout_grid`, `audit_log`, `settings` (write), `consent_log` of others, etc. Payout data lives in separate tables so a staff query can never return it.
- **Security tests (required, automated):** as Staff 1, attempting to read another person's leads, cases, loans, or any payout table must return zero rows or an error; attempting to update `role` on own profile must fail; a forged request that omits the UI must still fail.
- **Audit trail:** every insert/update/delete on business tables and every login is logged; the table is append-only; admin has a searchable audit screen (who, what, when, before → after).
- **Consent:** captured on the website form and in-app (verbal / WhatsApp / paper), with text version and timestamp; can be revoked; exported on request.
- **Data minimisation and residency:** store only the fields in A6; no KYC files; documents by link only; database in an India region; publish a privacy policy that lists what is collected, why, retention period, and how to request correction or deletion.
- **Data requests:** admin screen to log correction/deletion requests; `anonymize_client` RPC scrubs personal fields while keeping the financial history needed for payouts and accounts (owner to confirm the retention rules with their CA or lawyer).
- **Web security:** HTTPS only; response headers via Cloudflare `_headers` (strict CSP, HSTS, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`); Zod validation on the client **and** validation inside Edge Functions/RPCs; parameterised queries only; escape all rendered text; Turnstile + honeypot + rate limit on the public endpoint; verify the JWT and role inside every Edge Function.
- **Regulatory notes (build support, don't assert compliance):** RBI's Digital Lending Directions 2025 stress explicit prior consent with audit trails, minimal data, storage in India, clear privacy policies, grievance officers, and — for intermediaries working with several lenders — fair, unbiased presentation of offers. Build the consent log, India-region data, public grievance page and neutral, alphabetical lender listing accordingly. Whether these rules apply to Fintara Capital depends on its lender agreements, so the owner must confirm with a professional. Put `[OWNER TO REVIEW]` beside any legal statement on the public site.
- No dark patterns: no pre-ticked consent, no fake urgency, no misleading "guaranteed" claims.

## A10. Non-functional requirements

- **Performance:** interactive in < 2 s on a mid-range Android over 4G; server-side pagination, sorting and filtering (use views); virtualise lists over 500 rows.
- **Responsive and installable:** mobile-first from 360 px; PWA installable; graceful read-only message when offline (no offline writes in v1).
- **Accessibility:** WCAG 2.1 AA; full keyboard use; colour never the only signal.
- **Testing:** Vitest unit tests for `finance.ts` and rule functions using the Appendix test vectors; SQL tests that the views return the same numbers; Playwright e2e for the critical paths — login as each role, lead → client → case → disbursal → loan → payout, RLS negative tests, consent gate, sensitive-data guard, Excel import dry-run.
- **Demo data:** seed the sample rows from the Appendix, all flagged `is_demo`. Admin gets a one-click **Delete all demo data** (with confirmation). Add a **test-date override** in Settings (as the workbook has) — required so the acceptance numbers below are reproducible.
- **Excel import wizard (admin):** upload the existing workbook; map sheets Leads → leads, Clients → clients, Pipeline → cases + one submission each, Portfolio → loans + payouts, Contact Log → contact_log, Bankers → bankers, Payout Grid → payout_grid, Settings → lookups. Preserve existing IDs (LD-/CL-/CS-/LN-), convert Excel serial dates, convert percentage cells, skip rows whose name, remarks or notes start with "SAMPLE", run a **dry-run** with a per-row error report before committing, and never import Aadhaar/PAN-like values (the guard applies).
- **Docs:** `README.md` (plain-language setup in ≤ 10 steps), `docs/OPERATIONS.md` (add staff, update market ROI monthly, backup and restore, upgrade Supabase), `docs/USER_GUIDE.md` (the daily/weekly/monthly routine with screenshots).

## A11. Delivery phases

1. **Foundation** — scaffold, design tokens, logo, database, RLS, auth, app shell, seeds.
2. **Core CRM** — leads, clients, contact log, bankers/lenders, settings, search, guards.
3. **Pipeline** — cases, submissions, stage engine, Kanban, documents, co-applicants, conversion.
4. **Portfolio and money** — loans, radar, payouts, grid, receipts.
5. **Dashboards, My Day and notifications** — alerts, digests, WhatsApp, calendar, Telegram.
6. **Public website and calculators** — pages, enquiry function, SEO.
7. **Admin, reports, import/export, hardening** — reports, audit UI, backups, lender fit, targets, performance, accessibility.
8. **Optional client status link/portal** — feature-flagged, off by default.

---

# APPENDIX — Reference data

## App1. Stages (from your Settings sheet)

| # | Stage | Win probability | Open? | Kind | Notes |
|---|---|---|---|---|---|
| 1 | Enquiry Qualified | 10% | Yes | progress | |
| 2 | Docs Collection | 20% | Yes | progress | |
| 3 | Logged In (Filed) | 35% | Yes | progress | requires login date |
| 4 | Credit Processing | 50% | Yes | progress | |
| 5 | Query / Deficiency | 40% | Yes | hold | can return to any earlier stage |
| 6 | Sanctioned | 85% | Yes | progress | requires sanctioned amount + date |
| 7 | Legal / Valuation | 90% | Yes | progress | only for secured products |
| 8 | Disbursement Pending | 95% | Yes | progress | |
| 9 | Disbursed | 100% | **No** | won | opens Create-loan wizard |
| 10 | Rejected | 0% | **No** | lost | requires reason |
| 11 | Dropped / Lost | 0% | **No** | lost | requires reason |

*Probabilities are placeholders used only for weighted pipeline; the owner should set them from real conversion history.*

## App2. Lenders (seed; alphabetical on the public site)
HDFC Bank, ICICI Bank, State Bank of India, Axis Bank, Kotak Mahindra Bank, Bank of Baroda, Punjab National Bank, Union Bank of India, IDFC First Bank, Bajaj Finance, Tata Capital, Aditya Birla Capital, L&T Finance, Piramal Finance, Cholamandalam Finance, Poonawalla Fincorp, Aadhar Housing Finance, Aavas Financiers, Other. (Owner marks each as Bank / NBFC / HFC.)

## App3. Products and market-ROI benchmarks (**all placeholders — owner updates monthly**)

| Product | Market ROI (placeholder) | Secured (Legal/Valuation stage)? |
|---|---|---|
| Home Loan | 8.50% | Yes |
| Loan Against Property (LAP) | 9.75% | Yes |
| Business Loan | 14.00% | No |
| Working Capital (OD/CC) | 10.50% | No (admin can switch on — OD/CC is often property-backed) |
| Personal Loan | 12.50% | No |
| Car Loan | 9.00% | No |
| Education Loan | 10.00% | No |
| Gold Loan | 9.50% | No |
| Machinery / Equipment Loan | 11.00% | No |
| Credit Card | none | No |
| Insurance | none | No |
| Other | none | No |

## App4. Lists (from your Settings sheet, plus additions marked *new*)
- **Lead source:** Google Business Profile, Website / Google Search, Instagram / Facebook, WhatsApp, Referral - Client, Referral - Builder/Broker, Referral - Sub-agent, Walk-in, CA Practice Client (with consent), Existing Portfolio (takeover / top-up), Event / Seminar, Other.
- **Lead status:** New, Contacted, Interested, Docs Awaited, Converted, Not Interested, Lost.
- **Contact type:** Call, WhatsApp, Visit, Email, Meeting, Portfolio Review, Rate Update Sent, Greeting (Birthday / Festival).
- **Case type:** Fresh, Balance Transfer (Takeover), Top-up, Enhancement / Renewal.
- **Loan status:** Active, Closed - Repaid, Closed - Moved by Us (BT), Lost to Competitor.
- **Payout status:** Not Claimed, Claimed, Received, Disputed, Not Applicable.
- **Client type:** Salaried, Self-employed Professional, Business Owner, Trader, Company / LLP, Other.
- **Team:** Owner, Staff 1, Staff 2, Staff 3.
- **Loss reason (*new*):** Low credit score, Insufficient income / cash flow, Property issue (title / valuation), Documents not available, Rate or terms not acceptable, Lender policy mismatch, Lost to competitor, Client not responding, Requirement cancelled, Other.
- **Referrer type (*new*):** Client, Builder / Broker, CA, Sub-agent, Other.

## App5. Settings defaults (all **placeholders**, editable)
reminder_window_days **7** · lookahead_days **30** · takeover_gap_pp **0.5** (0.005) · takeover_min_months **6** · review_interval_months **6** · checkin_interval_days **90** · topup_after_months **12** · stuck_days_default **10** · unpaid_payout_days **30** · docs_pending_days **5** *(new)* · sanction_validity_days **90** *(new placeholder)* · session_idle_hours **8** · auto_assign_website_leads **Owner**.

## App6. Demo data (seed, flagged `is_demo`; names keep the "SAMPLE" prefix)

**Dev logins (local/dev only — never in production):** `owner@fintara.test` (admin, team label Owner), `staff1@fintara.test` (staff, Staff 1).

**Leads**
- LD-0001 · 14 Sep 2026 · Google Business Profile · SAMPLE - Rakesh Jain · 9800000011 · Shankar Nagar · Business Loan · ₹25,00,000 · Staff 1 · Interested · last contact 17 Sep 2026 · next follow-up 19 Sep 2026.
- LD-0002 · 18 Sep 2026 · Referral - Client · SAMPLE - Neha Gupta · 9800000012 · Pandri · Home Loan · ₹45,00,000 · Owner · Docs Awaited · last contact 19 Sep 2026 · next follow-up 22 Sep 2026.

**Clients**
- CL-0001 · SAMPLE - Raipur Traders · Business Owner · Mr. Sharma · 9800000001 · Telibandha · Wholesale trading · turnover ₹1,80,00,000 · incorporated 1 Apr 2012 · client since 16 Aug 2025 · Referral - Client · Owner · consent Yes.
- CL-0002 · SAMPLE - Anil Verma · Salaried · 9800000002 · Devendra Nagar · Manager, private firm · ₹18,00,000 · DOB 3 Nov 1985 · since 21 Aug 2026 · Google Business Profile · Staff 1 · consent Yes.
- CL-0003 · SAMPLE - Dr. Meera Clinic · Self-employed Professional · Dr. Meera · 9800000003 · Civil Lines · Medical practice · ₹42,00,000 · DOB 14 Feb 1980 · since 13 Jan 2026 · Referral - Builder/Broker · Owner · consent Yes.

**Cases / submissions**
- CS-0001 · CL-0001 · Fresh · Working Capital (OD/CC) · ₹40,00,000 · HDFC Bank · SAMPLE Banker A · Staff 1 · **Credit Processing** · stage updated 16 Sep 2026 · login 14 Sep 2026 · expected disbursal 25 Sep 2026 · next follow-up 22 Sep 2026.
- CS-0002 · CL-0002 · Balance Transfer (Takeover) · Home Loan · ₹55,00,000 · Bajaj Finance · SAMPLE Banker B · Owner · **Docs Collection** · updated 8 Sep 2026 · expected disbursal 15 Oct 2026 · next follow-up 18 Sep 2026 · existing lender State Bank of India · existing ROI 9.35% · proposed ROI 8.40%.
- CS-0003 · CL-0003 · Fresh · Loan Against Property · requested ₹1,20,00,000 · HDFC Bank · SAMPLE Banker A · Owner · **Sanctioned** · updated 17 Sep 2026 · login 31 Aug 2026 · sanctioned ₹1,10,00,000 on 17 Sep 2026 · expected disbursal 8 Oct 2026 · next follow-up 24 Sep 2026.

**Loans and payouts**
- LN-0001 · CL-0001 · Business Loan · Bajaj Finance · SAMPLE Banker B · Owner · a/c last-4 1234 · ₹25,00,000 · disbursed 17 Jun 2025 · ROI 15.5% · 48 months · Active · payout 1.5% = ₹37,500 · **Received** on 7 Jul 2025 (₹37,500).
- LN-0002 · CL-0003 · Home Loan · HDFC Bank · SAMPLE Banker A · Owner · a/c last-4 5678 · ₹60,00,000 · disbursed 13 Jan 2026 · ROI 9.1% · 240 months · Active · payout 0.4% = ₹24,000 · **Claimed**.

**Contact log**
- 17 Sep 2026 · CL-0001 · Call · Owner · CS-0001 · "SAMPLE - Confirmed bank visit scheduled; documents complete." · next action "Ask for GST returns copy" on 21 Sep 2026.
- 17 Jun 2026 · CL-0003 · Rate Update Sent · Staff 1 · LN-0002 · "SAMPLE - Shared quarterly rate update on WhatsApp." · next action "Portfolio review call" on 20 Sep 2026.

**Bankers**
- HDFC Bank · SAMPLE Banker A · Relationship Manager · Raipur - Pandri · 9800000101 · banker.a@example.com · LAP, Business Loan, Home Loan · escalation SAMPLE Regional Head · TAT 7–10 days.
- Bajaj Finance · SAMPLE Banker B · Sales Manager · Raipur · 9800000102 · banker.b@example.com · Home Loan BT, Business Loan · TAT 5–7 days.

**Payout grid (all valid from 1 Apr 2026, SAMPLE placeholders)**
HDFC Bank / LAP 0.60% · HDFC Bank / Home Loan 0.40% · Bajaj Finance / Business Loan 1.50% · HDFC Bank / Working Capital (OD/CC) 1.00%.

## App7. Loan-maths test vectors (test date 20 Sep 2026)
| Loan | Principal | ROI | Tenure | Months elapsed | EMI | Est. outstanding |
|---|---|---|---|---|---|---|
| LN-0001 | ₹25,00,000 | 15.5% | 48 | 15 | **₹70,212** | **₹18,76,770** |
| LN-0002 | ₹60,00,000 | 9.1% | 240 | 8 | **₹54,370** | **₹59,27,127** |
| Total outstanding | | | | | | **₹78,03,897** |

Allow ±₹2 rounding tolerance. BT saving example: ₹55,00,000 × (9.35% − 8.40%) = **₹52,250**.

## App8. WhatsApp templates (seed; owner edits; all sent only to clients with consent)
Placeholders: `{client_name}` `{staff_name}` `{firm}` (= Fintara Capital) `{product}` `{case_code}` `{stage_plain}` `{pending_docs}` `{expected_date}` `{current_roi}` `{est_saving}`.
Every message ends with: *"Reply STOP to stop these updates."*

1. **Documents reminder** — "Hello {client_name}, this is {staff_name} from {firm}. For your {product} application we still need: {pending_docs}. Please send them when convenient so we can keep things moving."
2. **Status update** — "Hello {client_name}, a quick update on your {product} application ({case_code}): it is now at '{stage_plain}'. We expect the next step by {expected_date}. Call me if you have questions."
3. **Sanction news** — "Good news, {client_name}! Your {product} has been sanctioned by the lender. I'll call you to explain the next steps."
4. **Disbursal thank-you** — "Hello {client_name}, your {product} has been disbursed. Thank you for trusting {firm}. I'll check in with you in a few weeks."
5. **Rate update** — "Hello {client_name}, market rates for {product} have changed. If you'd like, I can check what applies to your loan."
6. **Takeover opportunity** — "Hello {client_name}, your {product} runs at {current_roi}. Based on today's market rate, you may be able to save around {est_saving} a year. This is only an estimate and depends on lender approval, eligibility and charges. Shall we check?"
7. **Review call** — "Hello {client_name}, it's time for a routine review of your {product}. When is a good time to talk?"
8. **Top-up opportunity** — "Hello {client_name}, you may now be eligible to explore a top-up on your {product}, subject to the lender's assessment. Would you like me to check?"
9. **Birthday / festival greeting** — "Warm wishes from all of us at {firm}, {client_name}!"
10. **Gentle follow-up** — "Hello {client_name}, just following up on your {product} enquiry. Is now a good time to continue?"

## App9. Default document checklists (starting point only — lender requirements vary; the owner edits)
**Do not collect or type ID numbers in the app; track only status and a link.**

- **All applicants:** identity proof · address proof (as accepted by the lender) · passport-size photograph · PAN card copy (received via a secure channel; number is never stored in the app) · latest 6 months' bank statement.
- **Salaried (adds):** last 3 months' salary slips · last 2 years' Form 16 or ITR · employment / office ID · existing-loan statements (if any).
- **Self-employed professional and business owner (adds):** last 2–3 years' ITR with computation · CA-certified balance sheet and P&L · GST registration and last 12 months' GST returns · 12 months' current-account statement · business-existence proof (Udyam / shop licence / partnership deed / MOA-AOA as applicable) · office address proof · existing-loan statements.
- **Home Loan and LAP (adds, property):** title-document chain / sale deed · agreement to sell or allotment letter (purchase) · property-tax receipt · approved plan / map · society or builder NOC (as applicable).
- **Balance transfer / top-up (adds):** existing loan sanction letter · latest loan statement of account · foreclosure or loan-closure statement request · list of original documents held by the existing lender.
- **Car Loan:** dealer quotation / proforma invoice. **Education Loan:** admission letter, fee structure, previous marks. **Machinery Loan:** supplier quotation, business plan.
- **Co-applicant / guarantor:** the same identity, address, income and bank-statement set as the applicant.
