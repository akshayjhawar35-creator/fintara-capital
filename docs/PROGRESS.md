# Fintara Loan Desk — Progress

## Phase 1: Foundation (In Progress)

### Completed
- ✅ **Scaffold**: Next.js 16 (App Router), TypeScript strict, Tailwind CSS v4, static export
- ✅ **Design tokens**: Full colour palette (Midnight Ink, Star Gold, Lake Teal, Paper, Slate), alert colours, spacing, typography
- ✅ **Fonts**: IBM Plex Sans (UI) + Newsreader (public headings), self-hosted via next/font/google
- ✅ **Logo**: SVG set — mark (rounded-square tile with geometric F and gold star), horizontal lockup, stacked lockup, mono version
- ✅ **Core libraries**:
  - `lib/format.ts` — formatINR (Indian grouping), formatINRCompact, formatDate (IST), formatMobile, formatROI, formatPPGap, monthsElapsed
  - `lib/finance.ts` — calculateEMI, calculateOutstanding, calculateBTSaving, calculateBTDetailed, analyzeTakeover, analyzeTopup, calculateEligibility
  - `lib/sensitive-guard.ts` — PAN/Aadhaar pattern detection
  - `lib/utils.ts` — cn() class merge utility
- ✅ **Unit tests**: 65 tests passing (format, finance, sensitive-guard), all spec test vectors matched
- ✅ **Database**: 12 migration files covering all 31+ tables, enums, constraints, triggers, functions, RLS policies, views, indexes
- ✅ **Seed data**: All lookups, stages, lenders, products, settings, WhatsApp templates, document templates, demo data (Raipur, CG)
- ✅ **Auth**: Login page, AuthProvider, useAuth hook, role-based guards
- ✅ **App shell**: Desktop sidebar (Midnight Ink, collapsed on smaller screens), top bar (search, bell, avatar), mobile bottom nav, ⌘K command palette
- ✅ **Public home page**: Hero with BT calculator, how it works, products, alphabetical lender list, footer
- ✅ **Build**: Static export builds successfully (4 routes)

### Remaining
- ⬜ Admin-create-user Edge Function
- ⬜ Deactivate-staff-with-reassign dialog
- ⬜ Vercel deployment for demo preview
- ⬜ Final acceptance test screenshots

### Test Results
```
65 tests passing:
- format.test.ts: 30 tests (INR formatting, compact, mobile, ROI, dates)
- finance.test.ts: 24 tests (EMI, outstanding, BT saving, takeover, top-up, eligibility)
- sensitive-guard.test.ts: 11 tests (PAN, Aadhaar detection)
```

### Key Decisions Made
See [docs/DECISIONS.md](../docs/DECISIONS.md) for full list.

### Location
Firm: Raipur, Chhattisgarh, India (changed from Bhopal per owner's correction).
Demo data areas: Shankar Nagar, Pandri, Telibandha, Devendra Nagar, Civil Lines.
