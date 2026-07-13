<div align="center">
<img width="1200" height="475" alt="RAK Oasis Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# RAK Oasis Estate

**An investor portal, sales-agent MLM platform, and AI-assisted marketing site for a 406-acre real estate development in Ras Al Khaimah, UAE.**

</div>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Application Architecture](#application-architecture)
  - [Routing & the Three Portals](#routing--the-three-portals)
  - [Authentication & Sessions](#authentication--sessions)
  - [Global State (Contexts)](#global-state-contexts)
- [Core Domain: The MLM Commission Engine](#core-domain-the-mlm-commission-engine)
- [Data Model](#data-model)
- [Pricing & Payment Plans](#pricing--payment-plans)
- [AI Investment Advisor](#ai-investment-advisor)
- [PDF Generation](#pdf-generation)
- [Deployment](#deployment)
- [Project Status & Known Limitations](#project-status--known-limitations)

---

## Overview

RAK Oasis Estate is a single-page React application that serves several audiences from one codebase:

1. **Prospective investors** — a marketing landing page with an investment calculator and an AI-powered investment advisor.
2. **Clients** — a portal to purchase plots (KYC → plot selection → deposit), track their properties, make EMI payments, and download documents.
3. **Sales agents** — a full multi-level-marketing (MLM) workspace: genealogy/network tree, sales tracking, rank progression, commission earnings, leaderboards, recruiting, and training.
4. **Administrators** — a back-office console to manage clients, agents, plot inventory, inbound payments, the commission ledger, and USDT payouts.

The property being sold: **Phase 1 (84.67 acres) of a 406-acre development** in Ras Al Khaimah, priced at **131 AED/sq.ft**, sold as 1,000 sq.ft plots on a **10% booking + 90%-over-5-years** payment plan.

> This project originated from Google AI Studio. It currently combines a **mock/demo authentication layer** with a **real Supabase backend** — see [Project Status & Known Limitations](#project-status--known-limitations).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 5 |
| Routing | React Router 6 (`HashRouter`) |
| Styling | Tailwind CSS 3 + PostCSS |
| Icons | lucide-react |
| Charts | Recharts |
| Backend / Auth / DB | Supabase (PostgreSQL) |
| AI | Google Gemini (`@google/genai`) |
| PDF generation | `@react-pdf/renderer` |
| Analytics | Vercel Analytics + Speed Insights |

---

## Getting Started

**Prerequisites:** Node.js (18+ recommended)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (see below)
#    Create a .env.local file with your Gemini API key

# 3. Start the dev server
npm run dev
```

**Available scripts:**

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check (`tsc`) and build for production |
| `npm run preview` | Preview the production build locally |

---

## Environment Variables

Create a `.env.local` file in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
```

The key is read at build time in [`vite.config.ts`](vite.config.ts) and injected as `process.env.API_KEY`, consumed by [`services/geminiService.ts`](services/geminiService.ts).

> **Note:** The Supabase URL and publishable (anon) key are currently hardcoded in [`lib/supabaseClient.ts`](lib/supabaseClient.ts). For production they should be moved to environment variables.

---

## Project Structure

```
.
├── App.tsx                  # Root component: routing, auth orchestration, loaders
├── index.tsx                # React entry point
├── index.html / index.css   # HTML shell + global styles
├── types.ts                 # Shared TypeScript types & enums (single source of truth)
│
├── lib/
│   ├── supabaseClient.ts    # Supabase client initialization
│   ├── session.ts           # SessionManager: mock JWT create/verify, inactivity timeout
│   ├── mlmEngine.ts         # Core MLM business logic (commissions, ranks, payouts)
│   └── schema.sql           # PostgreSQL schema + RLS policies
│
├── services/
│   └── geminiService.ts     # Google Gemini investment-advisor integration
│
├── contexts/
│   ├── CurrencyContext.tsx     # AED/INR/USDT conversion & formatting
│   └── PageAccessContext.tsx   # Admin-controlled page enable/disable/hide
│
├── components/
│   ├── LandingPage.tsx      # Public marketing page
│   ├── Calculator.tsx       # Investment calculator (pricing/EMI)
│   ├── GeminiAdvisor.tsx    # AI chat advisor UI
│   ├── AuthModal.tsx, BookingModal.tsx, Preloader.tsx, ...  # Shared UI
│   │
│   ├── client/              # Client portal (dashboard, purchase wizard, plots, payments, docs)
│   ├── agent/               # Agent MLM portal (network, sales, earnings, recruit, training)
│   ├── admin/               # Admin console (clients, agents, plots, commissions, payouts)
│   └── pdf/                 # React-PDF document templates (booking slip, EMI slip, etc.)
│
├── vite.config.ts           # Vite config + env injection
├── tailwind.config.js       # Theme (deepblue / gold brand palette)
└── tsconfig*.json           # TypeScript config
```

---

## Application Architecture

### Routing & the Three Portals

[`App.tsx`](App.tsx) wraps the app in `HashRouter` and two context providers, then renders role-gated routes:

| Route | Guard | Portal |
|---|---|---|
| `/` | Public | `LandingPage` (redirects logged-in users to their portal) |
| `/client/*` | `role === 'client'` | `components/client/Dashboard.tsx` |
| `/agent/*` | `role === 'agent'` | `components/agent/Dashboard.tsx` |
| `/admin/*` | `role === 'admin'` | `components/admin/Dashboard.tsx` |
| `*` | — | Redirect to `/` |

Each portal is a **sidebar-shell layout with nested routes**:

- **Client** — Dashboard, My Plot(s), Payments, Documents, Updates, Support, Profile, plus a multi-step **Purchase Wizard** (Buyer → KYC → Intent → Plot → Plan → Proof → Consultant → Signature).
- **Agent** — Dashboard, Network (genealogy tree), Sales, Earnings, Leaderboard, Recruit, Marketing, Training, Profile, Support.
- **Admin** — Dashboard, Clients, Agents, Plots, Payments, Commissions, USDT Payouts, Page Control, Content, Reports, Tickets, Settings.

### Authentication & Sessions

Auth resolves on load in priority order (in [`App.tsx`](App.tsx) `checkAuth`):

1. **URL token** — a `?token=` query param is verified via `SessionManager.verifyToken`.
2. **Supabase session** — real auth via `supabase.auth.getSession()`.
3. **Persisted mock session** — a token stored in `localStorage`.

[`lib/session.ts`](lib/session.ts) implements a `SessionManager` that:
- Creates a JWT-shaped token (header.payload.signature) with the user profile encoded in the payload.
- Enforces a **3-hour inactivity timeout** — `App.tsx` listens to mouse/keyboard/scroll/click events and auto-logs-out idle users (checked every 60s).
- Handles online/offline transitions with a re-link + Supabase session refresh.

There is also a **mock login** path (`handleMockLogin`) that fabricates client/agent/admin profiles for demo purposes without going through real authentication.

### Global State (Contexts)

- **`CurrencyContext`** — holds AED↔INR↔USDT rates (defaults: 1 AED = ₹25, 1 USDT = ₹92) and exposes `formatAED`, `formatUSDT`, `convertToAED` helpers used across portals.
- **`PageAccessContext`** — lets admins toggle each client/agent page between `ENABLED`, `DISABLED` (shows a maintenance overlay), or `HIDDEN` (removed from nav). State is in-memory.

---

## Core Domain: The MLM Commission Engine

The heart of the business logic lives in [`lib/mlmEngine.ts`](lib/mlmEngine.ts). It runs per verified payment and drives agent compensation.

### Distribution constants

```
Pool percentage:   20% of inflow
Unilevel rates:    L1 = 8%,  L2 = 3%,  L3 = 2%,  L4 = 1%,  L5 = 1%
Infinity rates:    Rank 3 = 2%,  Rank 4 = 3%,  Rank 5 = 4%
TDS:               10%
```

### Unilevel commissions

`calculateUnilevelCommission()` starts at the client's direct sponsor and **walks the genealogy tree upward up to 5 levels**, crediting each active, KYC-verified agent their level's percentage. Commissions are inserted into the ledger with status `calculated_pending_approval` (they require admin approval before payout).

### Ranks & Infinity bonuses

Agents progress through 5 ranks (defined in [`types.ts`](types.ts) `UserRank`):

| Rank | Title | Unlocks |
|---|---|---|
| 1 | Agent | — |
| 2 | Senior Agent | — |
| 3 | Area Manager | 2% Infinity bonus |
| 4 | Zonal Head | 3% Infinity bonus |
| 5 | President | 4% Infinity bonus |

`checkRankAdvancement()` promotes agents based on quest completion (personal sales, active recruits, team volume thresholds).

### Payouts

`checkPayoutEligibility()` gates withdrawals on:
- Minimum wallet balance of **₹10,000**
- A verified **TRC20 (USDT)** wallet address
- Completed **KYC**
- Sufficient funds

Payouts are settled in **USDT (TRC20)** and tracked in the `payout_requests` table.

---

## Data Model

Defined in [`lib/schema.sql`](lib/schema.sql) (PostgreSQL / Supabase):

| Table | Purpose |
|---|---|
| `profiles` | Unified users (client / agent / admin). Holds `sponsor_id` for genealogy linkage, `rank`, `wallet_balance`, KYC status, and crypto wallet addresses. |
| `plots` | Inventory — plot number, block, type (Standard / Garden / Corner), size, AED & INR price, status (`AVAILABLE` / `RESERVED` / `SOLD` / `FORFEITED`). |
| `payments` | Inbound payments (Razorpay / crypto / bank), with verification tracking. |
| `commissions` | The commission ledger — `UNILEVEL` / `INFINITY` / `LEADERBOARD`, with level and approval status. |
| `payout_requests` | Outbound USDT payout requests with tx hash tracking. |

Row-Level Security (RLS) policies restrict agents to their own profile and commissions. Admin-wide access is currently simplified (see limitations).

---

## Pricing & Payment Plans

Implemented in [`components/Calculator.tsx`](components/Calculator.tsx):

| Parameter | Value |
|---|---|
| Base price | **131 AED/sq.ft** (≈ ₹3,275/sq.ft) |
| Plot size | 1,000 sq.ft (standard) |
| Premium plots | +5% for Garden-facing or Corner |
| Booking amount | 10% down (configurable 10–50%) |
| Balance | Over up to 5 years, **0% interest** EMI |

---

## AI Investment Advisor

[`services/geminiService.ts`](services/geminiService.ts) integrates **Google Gemini** as a real-estate investment consultant. It's primed with a system instruction covering project facts (acreage, pricing, payment plan, RAK location context) and constrained to concise, professional responses that encourage booking a call. Surfaced through the `GeminiAdvisor` component.

---

## PDF Generation

The [`components/pdf/`](components/pdf/) directory uses `@react-pdf/renderer` to produce downloadable documents:

- `BookingSlipPDF.tsx` — plot booking confirmation
- `EMISlipPDF.tsx` — installment receipts
- `GenericDocumentPDF.tsx` — reusable document template

---

## Deployment

The app is a static SPA and is configured for **Vercel** (Analytics + Speed Insights are wired in via `App.tsx`). Any static host works:

```bash
npm run build      # outputs to dist/
```

Because routing uses `HashRouter`, no server-side rewrite rules are required. Remember to configure `GEMINI_API_KEY` in your host's environment.

---

## Project Status & Known Limitations

This is an **early-stage / prototype** application. Before production use, note:

- **Mock auth layer.** Alongside real Supabase auth, a mock-login flow can fabricate any role client-side. The custom session tokens in [`lib/session.ts`](lib/session.ts) use a hardcoded XOR key and are not cryptographically secure — they should not be relied on for real authorization.
- **Hardcoded credentials.** The Supabase URL/key live in source; the Gemini key is bundled into client JS at build time. Move secrets to environment variables and rely on Supabase RLS for data protection.
- **Simplified RLS.** The schema notes that admin-wide access checks are simplified and should use a secure role-checking function in production.
- **In-memory admin settings.** `CurrencyContext` rates and `PageAccessContext` page settings are React state only and do not persist across reloads.
- **Mock inventory / data.** Several flows (e.g. the Purchase Wizard's plot inventory, dashboard notifications) use hardcoded mock data.
- **Dead code.** The top-level `components/ClientDashboard.tsx`, `AgentDashboard.tsx`, and `AdminDashboard.tsx` are superseded by the versions under `components/{role}/` and are no longer imported.

---

<div align="center">
<sub>Built with React, Vite, Supabase, and Google Gemini.</sub>
</div>
