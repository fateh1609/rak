# RAK Oasis — Supabase Removal, Self-Hosted Backend & VPS Deployment

**Date:** 2026-07-13
**Status:** Approved for autonomous execution (user pre-authorized: "finish all only then ask for approval")

## Goal

Remove Supabase entirely. Replace with a self-hosted Node.js backend + PostgreSQL running on a VPS. Make every dashboard link functional and back core views with real data. Ship a complete, reproducible VPS deployment setup.

## Decisions (defaults chosen, user pre-authorized autonomy)

| Decision | Choice | Why |
|---|---|---|
| Backend | Node 20 + Express + TypeScript | Matches frontend language; small team surface |
| DB access | `pg` (node-postgres), raw SQL | Schema already exists as SQL; no ORM overhead |
| Auth | Email + password, bcrypt, JWT (24h), role claim | Replaces fake OTP + XOR tokens |
| Gemini | Proxied through backend `/api/advisor` | Keeps API key off the client bundle |
| Deployment | Docker Compose: postgres + api + nginx (SPA + `/api` proxy) | One-command VPS bring-up |
| Payments | Manual proof submission → admin verification | No live Razorpay keys exist; matches existing UI flow |
| Frontend env | `VITE_API_URL` via `import.meta.env` | Standard Vite pattern |

## Architecture

```
Browser (React SPA)
   │  /api/* (JWT bearer)
   ▼
nginx ──► Express API (server/) ──► PostgreSQL
   └── serves built SPA (dist/)
```

### Backend layout (`server/`)

```
server/
├── src/
│   ├── index.ts          # Express bootstrap
│   ├── db.ts             # pg pool
│   ├── middleware/auth.ts # JWT verify + role guard
│   ├── mlm.ts            # ported MLM engine (unilevel, rank, payout rules)
│   ├── routes/
│   │   ├── auth.ts       # register, login, me
│   │   ├── plots.ts      # list; admin CRUD
│   │   ├── bookings.ts   # create (client), mine, admin list/confirm
│   │   ├── payments.ts   # submit, mine, admin verify → MLM trigger
│   │   ├── commissions.ts# mine, admin approve
│   │   ├── payouts.ts    # request (eligibility), mine, admin process
│   │   ├── network.ts    # downline tree, agent stats, leaderboard
│   │   ├── admin.ts      # dashboard stats, clients, agents, kyc
│   │   ├── content.ts    # updates/announcements, tickets
│   │   └── advisor.ts    # Gemini proxy
│   └── seed.ts           # admin user + demo agents/clients/plots
├── migrations/001_init.sql  # extended schema (adds password_hash, bookings, updates, tickets)
├── package.json / tsconfig.json / Dockerfile
```

### Schema changes vs old `lib/schema.sql`

- `profiles`: + `password_hash`, `status` (pending/active/suspended); id `uuid default gen_random_uuid()` (no auth.users FK)
- New `bookings` table (frontend already expects it): plot_id, user_id, status, total_amount, paid_amount, next_emi_date, strike_count
- New `updates` (announcements) and `tickets` tables
- RLS dropped — authorization enforced in API layer (single trusted backend)

### API auth model

- `Authorization: Bearer <jwt>`; payload `{ sub, role, email }`
- Role guards: `requireAuth`, `requireRole('admin')`, etc.
- Client keeps 3h inactivity logout (frontend timer) + 24h token expiry

## Frontend changes

1. **`lib/api.ts`** — fetch wrapper: base URL, JWT from localStorage, JSON, 401 → logout event.
2. **Delete:** `lib/supabaseClient.ts`, XOR logic in `lib/session.ts` (file replaced by thin token store), dead `components/{Client,Agent,Admin}Dashboard.tsx`, `?token=` URL flow.
3. **`App.tsx`** — auth = stored JWT → `GET /api/auth/me`; remove mock login; keep preloader/offline UX.
4. **`AuthModal`** — real login (email+password) and client signup (name, email, mobile, password, optional agent code). Landing page demo-role buttons removed.
5. **Dashboards wired to API:**
   - *Client:* bookings/plots/payments/documents from API; PurchaseWizard inventory from `/api/plots`, submits booking + payment proof; Updates page reads `/api/updates`; add missing `UPDATES` PageAccess key.
   - *Agent:* Training route added to sidebar + routes (missing link); network tree, stats, earnings/commissions, leaderboard, payout request from API; sidebar quick-stats live.
   - *Admin:* every view backed by API (clients, agents+approve/kyc, plots CRUD, payments verify, commissions approve, payouts process, dashboard stats); sidebar sub-links get real query params (e.g. `clients?filter=kyc_pending`) that the views honor.
6. **GeminiAdvisor** calls `/api/advisor` (no client-side key).

## Deployment (`deploy/`)

- `docker-compose.yml`: `db` (postgres:16, volume, healthcheck) → `api` (server Dockerfile, migrations+seed on boot) → `web` (multi-stage vite build → nginx)
- `nginx.conf`: SPA fallback, `/api` → api:4000, gzip
- `.env.example`: `POSTGRES_PASSWORD, JWT_SECRET, GEMINI_API_KEY, VITE_API_URL`
- `DEPLOY.md`: VPS runbook — Ubuntu 22.04, install Docker, clone, `.env`, `docker compose up -d`, optional certbot/TLS, backup note
- Local dev unchanged: `npm run dev` (vite) + `npm run dev` in `server/` + local postgres or `docker compose up db`

## Error handling

- API: central error middleware → `{ error: string }` + proper status codes; zod-free manual validation (keep deps light)
- Frontend: api.ts throws typed `ApiError`; views show inline error states (existing patterns)

## Testing / verification

- `tsc` clean both sides; vite build clean
- Seeded E2E in browser: login admin/agent/client, click every sidebar link, book plot, submit payment, verify payment as admin, see commission appear for agent, request payout, process payout
- Seed credentials: `admin@rakoasis.com`, `agent@rakoasis.com`, `client@rakoasis.com` (password `RakOasis@2026` — change in production)

## Out of scope (documented, not built)

- Live payment gateways (Razorpay/Stripe), real OTP/email service, KYC document storage (S3-style), Infinity/Leaderboard commission automation (unilevel is automated; others admin-manual), TLS automation beyond certbot instructions
