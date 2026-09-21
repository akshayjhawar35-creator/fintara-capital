# Decisions Log

> Decisions made during development. Each entry records the choice and the reason.

| # | Date | Decision | Reason |
|---|---|---|---|
| D1 | 2026-09-21 | Use Vercel for demo/testing, Cloudflare Pages for production | Owner wants demo testing on Vercel first; Vercel Hobby is non-commercial so production goes to Cloudflare Pages |
| D2 | 2026-09-21 | Local Supabase development via Docker/CLI first | Owner will create cloud project later; local dev gives faster iteration |
| D3 | 2026-09-21 | Use `@supabase/supabase-js` (client-side) not `@supabase/ssr` | Static export has no middleware/server; auth tokens in localStorage; RLS is the real security gate |
| D4 | 2026-09-21 | Use `next/font/google` for self-hosted fonts | Automatically downloads and bundles fonts at build time — zero Google requests at runtime |
| D5 | 2026-09-21 | Wrap all `useSearchParams()` in Suspense | Required for static export to avoid build crashes |
| D6 | 2026-09-21 | Use `@marsidev/react-turnstile` for Turnstile integration | Lightweight modern wrapper; Supabase has native Turnstile support for auth |
| D7 | 2026-09-21 | Use `shadcn@latest` (unified CLI) not deprecated `shadcn-ui` | Old package deprecated; new CLI auto-detects Tailwind v4 |
| D8 | 2026-09-21 | Store `takeover_gap_pp` as 0.005 (0.5 percentage points) | Consistent with ROI storage as decimal fractions |
