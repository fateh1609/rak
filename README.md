<div align="center">
<img width="1200" height="475" alt="RAK Oasis Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# RAK Oasis Estate

**A self-hosted investor portal, sales-agent MLM platform, and AI-assisted marketing site for a 406-acre real estate development in Ras Al Khaimah, UAE.**

React SPA + Express API + PostgreSQL, deployed as a single Docker Compose stack.

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Quick Start (Docker)](#quick-start-docker)
- [Local Development](#local-development)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Core Domain: The MLM Commission Engine](#core-domain-the-mlm-commission-engine)
- [Data Model](#data-model)
- [Pricing & Payment Plans](#pricing--payment-plans)
- [Seeded Accounts](#seeded-accounts)
- [Deployment](#deployment)
- [Known Limitations](#known-limitations)

---

## Overview

RAK Oasis Estate serves several audiences from one codebase:

1. **Prospective investors** — a marketing landing page with an investment calculator and an AI investment advisor (Gemini, proxied server-side).
2. **Clients** — purchase plots (wizard: buyer → KYC → plan → payment proof → signature), track EMI payments, download documents, read project updates, raise support tickets.
3. **Sales agents** — MLM workspace: genealogy tree, client registration, sales tracking, commission ledger, USDT payout requests, leaderboard, training center.
4. **Administrators** — back-office console: client/agent management (KYC, approvals, ranks), plot inventory CRUD, payment verification (triggers commission calculation), commission approval, USDT payout processing, announcements, support tickets.

The property: **Phase 1 (84.67 acres) of a 406-acre development**, priced at **131 AED/sq.ft**, sold as 1,000 sq.ft plots on a **10% booking + 90% over 5 years (0% interest)** plan.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript, Vite 5, Tailwind CSS 3, React Router 6 (HashRouter), Recharts, lucide-react |
| Backend | Node 20, Express 4, TypeScript, `pg` (raw SQL), bcryptjs, jsonwebtoken |
| Database | PostgreSQL 16 |
| AI | Google Gemini via server-side proxy (`POST /api/advisor`) |
| PDF | `@react-pdf/renderer` |
| Deployment | Docker Compose (postgres + api + nginx), see [DEPLOY.md](DEPLOY.md) |

---

## Quick Start (Docker)

```bash
cp .env.example .env      # set POSTGRES_PASSWORD and JWT_SECRET
docker compose up -d --build
```

Open `http://localhost` (or `WEB_PORT`). Migrations and an idempotent demo seed run automatically. Log in with the [seeded accounts](#seeded-accounts).

---

## Local Development

```bash
# 1. Database
docker compose up -d db            # or any local Postgres 16

# 2. API (terminal 1)
cd server
npm install
DATABASE_URL=postgres://rakoasis:<pw>@localhost:5432/rakoasis JWT_SECRET=dev npm run dev
npm run seed                       # once, to seed demo data

# 3. Frontend (terminal 2) — vite proxies /api → localhost:4000
npm install
npm run dev
```

| Command | Where | Description |
|---|---|---|
| `npm run dev` | root | Vite dev server (proxy `/api` → :4000) |
| `npm run build` | root | Type-check + production build |
| `npm run dev` | server/ | API with hot reload |
| `npm run build` / `start` | server/ | Compile / run API |
| `npm run migrate` / `seed` | server/ | Apply migrations / seed demo data |

---

## Project Structure

```
.
├── App.tsx                  # Root: routing, JWT auth boot, inactivity logout
├── lib/
│   ├── api.ts               # Fetch wrapper: JWT bearer, ApiError, 401 broadcast
│   └── session.ts           # Token+profile store, 3h inactivity timeout
├── components/
│   ├── LandingPage.tsx      # Public marketing page
│   ├── AuthModal.tsx        # Real login + client signup (agent referral code)
│   ├── GeminiAdvisor.tsx    # AI chat (server-proxied)
│   ├── client/              # Client portal (wizard, payments, docs, updates)
│   ├── agent/               # Agent MLM portal (network, sales, earnings, training)
│   ├── admin/               # Admin console (all entities + verification flows)
│   └── pdf/                 # React-PDF documents
├── contexts/                # Currency rates, page access control
│
├── server/                  # Express API
│   ├── src/
│   │   ├── index.ts         # Bootstrap (auto-migrate on boot)
│   │   ├── db.ts            # pg pool
│   │   ├── middleware/auth.ts  # JWT sign/verify, role guards
│   │   ├── mlm.ts           # Unilevel engine + payout eligibility
│   │   ├── routes/          # auth, plots, bookings, payments, commissions,
│   │   │                    # payouts, network, admin, content, advisor
│   │   ├── migrate.ts       # SQL migration runner
│   │   └── seed.ts          # Idempotent demo seed
│   └── migrations/001_init.sql
│
├── docker-compose.yml       # db + api + web (nginx)
├── Dockerfile.web           # Vite build → nginx
├── server/Dockerfile        # API image
├── deploy/nginx.conf        # SPA + /api reverse proxy
└── DEPLOY.md                # VPS runbook
```

---

## Architecture

```
Browser (React SPA)
   │  Authorization: Bearer <JWT>
   ▼
nginx ──► /       static SPA build
      └─► /api/*  Express API ──► PostgreSQL
```

**Auth:** email + password → bcrypt check → 24h JWT (`{sub, role, email}`). Frontend stores the token, boots via `GET /api/auth/me`, auto-logs-out after 3h inactivity, and broadcasts a logout on any 401. Role-gated routes: `/client/*`, `/agent/*`, `/admin/*` — enforced again server-side by `requireRole` middleware on every endpoint.

**Registration paths:**
- Public client signup (optional agent referral code links the sponsor)
- Agents register clients under their own code
- Agents recruit downline agents (created `pending` until admin approval)

---

## API Reference

All endpoints under `/api`. 🔒 = JWT required, 👑 = admin only, 🧑‍💼 = agent.

| Method & Path | Description |
|---|---|
| `POST /auth/register` | Client signup (optional `agent_code`) |
| `POST /auth/login` · `GET /auth/me` · `PATCH /auth/me` | Session + profile |
| `POST /auth/register-agent` 🧑‍💼 | Recruit downline agent (pending approval) |
| `GET /plots` 🔒 · `POST/PATCH/DELETE /admin/plots` 👑 | Inventory |
| `POST /bookings` 🔒 · `GET /bookings/my` | Reserve plot, 10% booking due |
| `GET/PATCH /admin/bookings` 👑 | Confirm / cancel (releases plot) |
| `POST /payments` 🔒 · `GET /payments/my` | Submit payment proof |
| `PATCH /admin/payments/:id/verify` 👑 | Verify → updates booking, **runs MLM engine** |
| `GET /commissions/my` 🧑‍💼 · `PATCH /admin/commissions/:id/approve` 👑 | Ledger; approval credits wallet |
| `POST /payouts` 🧑‍💼 · `PATCH /admin/payouts/:id` 👑 | USDT payout request / complete / reject(refund) |
| `GET /network/tree` · `/network/stats` · `/network/clients` 🧑‍💼 | Genealogy + aggregates |
| `GET /leaderboard` 🔒 | Top agents by approved earnings |
| `GET /admin/stats` · `/admin/clients` · `/admin/agents` · `PATCH /admin/users/:id` 👑 | Back office |
| `GET /updates` 🔒 · `POST /admin/updates` 👑 | Announcements |
| `POST /tickets` 🔒 · `GET/PATCH /admin/tickets` 👑 | Support |
| `POST /advisor` | Gemini investment advisor (key stays server-side) |

---

## Core Domain: The MLM Commission Engine

Server-side in [`server/src/mlm.ts`](server/src/mlm.ts), executed inside payment verification:

```
Unilevel rates:  L1 = 8%,  L2 = 3%,  L3 = 2%,  L4 = 1%,  L5 = 1%
Payout: USDT (TRC20), min ₹10,000, KYC + verified wallet required
```

On each **verified** payment the engine walks the client's sponsor chain up to 5 levels, crediting each *active, KYC-verified* agent a pending commission. Admin approval credits the agent's wallet; payout requests debit it (refunded on rejection). Ranks 1–5 (Agent → President) are managed by admins from the agent roster.

---

## Data Model

[`server/migrations/001_init.sql`](server/migrations/001_init.sql):

| Table | Purpose |
|---|---|
| `profiles` | Unified users; `sponsor_id` genealogy, `rank`, `wallet_balance`, KYC, `status` (pending/active/suspended), bcrypt `password_hash` |
| `plots` | Inventory: number, block, type, sizes, AED/INR price, status |
| `bookings` | Plot purchases: totals, paid amount, next EMI date, 3-strike counter |
| `payments` | Inbound payments with verification workflow |
| `commissions` | UNILEVEL/INFINITY/LEADERBOARD ledger with approval status |
| `payout_requests` | Outbound USDT with tx hash |
| `updates` | Announcements (audience: all/client/agent) |
| `tickets` | Support tickets with admin replies |

Authorization is enforced in the API layer (single trusted backend); no client-side DB access exists.

---

## Pricing & Payment Plans

| Parameter | Value |
|---|---|
| Base price | **131 AED/sq.ft** (≈ ₹3,275/sq.ft) |
| Plot size | 1,000 sq.ft |
| Premium plots | +5% Garden-facing / Corner |
| Plan | 10% booking + 60 monthly EMIs at **0% interest** |

---

## Seeded Accounts

Password: `SEED_PASSWORD` (default `RakOasis@2026` — **change in production**).

| Role | Email | Notes |
|---|---|---|
| Admin | `admin@rakoasis.com` | Full console |
| Agent | `agent@rakoasis.com` | `AGT-10523`, Rank 3, 3-level upline seeded |
| Client | `client@rakoasis.com` | Sponsored by the agent, has a confirmed booking |

Seed also creates 24 plots (blocks A–C), a verified demo payment with its full commission cascade, and sample announcements.

---

## Deployment

See **[DEPLOY.md](DEPLOY.md)** for the complete VPS runbook (Docker install, TLS via certbot, backups, updates). Short version:

```bash
cp .env.example .env && nano .env   # POSTGRES_PASSWORD, JWT_SECRET
docker compose up -d --build
```

---

## Known Limitations

- **Payment verification is manual** — clients submit transaction references; admins verify. No live Razorpay/Stripe integration.
- **No email/OTP service** — registration is immediate; password resets require admin action.
- **KYC is a flag** — no document upload/storage pipeline yet.
- **Infinity & Leaderboard bonuses** are schema-supported but admin-manual; only unilevel is automated.
- **In-memory admin settings** — currency rates and page-access toggles reset on reload.
- **USDT payouts are recorded, not executed** — admins send USDT externally and paste the tx hash.

---

<div align="center">
<sub>React · Express · PostgreSQL · Docker — self-hosted, no third-party BaaS.</sub>
</div>
