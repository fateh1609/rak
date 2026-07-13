# VPS Backend Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove Supabase; ship self-hosted Express+PostgreSQL backend, fully wired dashboards, and Docker-based VPS deployment.

**Architecture:** Single Express API (JWT auth, role guards) over PostgreSQL; React SPA calls it through `lib/api.ts`; nginx serves SPA and proxies `/api`. Gemini proxied server-side.

**Tech Stack:** Node 20, Express 4, pg 8, bcryptjs, jsonwebtoken, TypeScript, Vite/React 18, Docker Compose, nginx, PostgreSQL 16.

**Verification mode:** Build-gate (`tsc` both sides) + seeded end-to-end browser flow. Unit tests intentionally deferred (documented in spec out-of-scope; user requested full-feature completion pass).

---

### Task 1: Backend scaffold + DB layer
**Files:** Create `server/package.json`, `server/tsconfig.json`, `server/src/db.ts`, `server/src/index.ts`, `server/migrations/001_init.sql`, `server/.env.example`
- [ ] Schema: profiles(+password_hash,+status), plots, bookings, payments, commissions, payout_requests, updates, tickets
- [ ] pg Pool from `DATABASE_URL`; migration runner (`node dist/migrate.js` applies `migrations/*.sql` once, tracked in `_migrations` table)
- [ ] Express app: json body, cors (dev), `/api/health`
- [ ] Verify: `npm run build && npm start` responds `{ok:true}` on `/api/health`

### Task 2: Auth
**Files:** Create `server/src/routes/auth.ts`, `server/src/middleware/auth.ts`
- [ ] `POST /api/auth/register` — client signup {full_name,email,mobile,password,agent_code?}; resolves sponsor by agent_code; bcrypt hash; returns {token,profile}
- [ ] `POST /api/auth/login` — {email,password} → {token,profile}; 401 on mismatch; suspended → 403
- [ ] `GET /api/auth/me` — profile from JWT
- [ ] Middleware: `requireAuth` (verify JWT, attach req.user), `requireRole(...roles)`
- [ ] Verify: curl register→login→me round-trip

### Task 3: Domain routes
**Files:** Create `server/src/routes/{plots,bookings,payments,commissions,payouts,network,admin,content,advisor}.ts`, `server/src/mlm.ts`
- [ ] plots: `GET /api/plots` (auth); admin `POST/PATCH/DELETE /api/admin/plots/:id?`
- [ ] bookings: `POST /api/bookings` {plot_id} → RESERVED plot + PENDING_VERIFICATION booking (10% booking amount); `GET /api/bookings/my`; admin `GET /api/admin/bookings`, `PATCH …/:id` confirm/cancel
- [ ] payments: `POST /api/payments` {booking_id,amount,method,transaction_ref}; `GET /api/payments/my`; admin `GET /api/admin/payments`, `PATCH …/:id/verify` → marks verified, updates booking paid_amount, plot SOLD when fully-booked-confirmed, **runs mlm.calculateUnilevel** (port of lib/mlmEngine.ts: L1 8%,L2 3%,L3 2%,L4 1%,L5 1%, KYC-verified active agents only)
- [ ] commissions: `GET /api/commissions/my`; admin list + `PATCH …/:id/approve` (credits wallet_balance)
- [ ] payouts: `POST /api/payouts` (eligibility: ≥₹10,000, KYC, TRC20 wallet set, ≤ balance; debits wallet); `GET /api/payouts/my`; admin queue + `PATCH …/:id` complete(tx_hash)/reject(refund)
- [ ] network: `GET /api/network/tree` (recursive downline), `GET /api/network/stats` (direct count, team size, month earnings), `GET /api/leaderboard` (top agents by approved commissions)
- [ ] admin: `GET /api/admin/stats` (counts + volume), `GET /api/admin/clients?filter=kyc_pending|defaulters`, `GET /api/admin/agents?filter=pending`, `PATCH /api/admin/users/:id` (kyc_verified/status/rank)
- [ ] content: `GET /api/updates`, admin `POST /api/updates`; `POST /api/tickets`, `GET /api/tickets/my`, admin `GET/PATCH /api/admin/tickets/:id?`
- [ ] advisor: `POST /api/advisor` {question} → Gemini (server-side key), same system instruction as services/geminiService.ts

### Task 4: Seed
**Files:** Create `server/src/seed.ts`
- [ ] Idempotent: admin/agent/client users (password `RakOasis@2026`), agent chain (3 levels for MLM demo), 24 plots across blocks A–C (Standard/Garden/Corner, schema pricing), 1 demo booking+verified payment+commissions, 2 updates
- [ ] Verify: run twice, no dupes

### Task 5: Frontend API client + auth swap
**Files:** Create `lib/api.ts`; rewrite `lib/session.ts`; modify `App.tsx`, `components/AuthModal.tsx`, `components/LandingPage.tsx`; delete `lib/supabaseClient.ts`, `components/ClientDashboard.tsx`, `components/AgentDashboard.tsx`, `components/AdminDashboard.tsx`
- [ ] api.ts: `api.get/post/patch/del`, JWT header, `ApiError`, base `import.meta.env.VITE_API_URL ?? '/api'`
- [ ] session.ts → thin store: token+profile in localStorage, 3h inactivity check (no XOR)
- [ ] App.tsx: boot = stored token → `GET /me`; login/logout handlers; drop `?token=` flow, supabase listener, mock login
- [ ] AuthModal: password login + client signup (calls register); remove OTP theater & role-guessing
- [ ] LandingPage: hook to new AuthModal contract; remove demo-role login buttons
- [ ] Remove `@supabase/supabase-js` from package.json

### Task 6: Wire dashboards (all links live)
**Files:** Modify `components/client/*`, `components/agent/*`, `components/admin/*`, `contexts/PageAccessContext.tsx`
- [ ] Client: Dashboard fetch `/bookings/my`; PurchaseWizard inventory `/plots` + submit booking & payment; Payments view real; Updates view `/updates`; add `UPDATES` key to PageAccess defaults
- [ ] Agent: add **Training route + sidebar link** (`training`, key TRAINING in PageAccess); Network from `/network/tree`; Home/side stats from `/network/stats`; Earnings from `/commissions/my` + payout request form → `/payouts`; Leaderboard from `/leaderboard`; Recruit → registers downline agent via admin-less `POST /api/auth/register-agent` (sponsor = current agent, status pending)
- [ ] Admin: Home stats `/admin/stats` + working quick-links; Clients/Agents tables live (+APPROVE/KYC buttons PATCH); Plots CRUD; Payments verify button; Commissions approve; Payouts process; sidebar sub-items navigate with `?filter=` respected by views
- [ ] GeminiAdvisor → `POST /api/advisor`; delete `services/geminiService.ts` client key usage

### Task 7: Deployment
**Files:** Create `docker-compose.yml`, `server/Dockerfile`, `Dockerfile.web`, `deploy/nginx.conf`, `.env.example`, `DEPLOY.md`; modify root `package.json` scripts, `README.md`
- [ ] compose: db(postgres:16,healthcheck,volume) → api(migrate+seed+serve) → web(nginx:80)
- [ ] nginx: `try_files … /index.html`, `location /api { proxy_pass http://api:4000; }`
- [ ] DEPLOY.md: Ubuntu VPS runbook (docker install, clone, .env, `docker compose up -d --build`, certbot/TLS, pg_dump backup)
- [ ] Verify: `docker compose up` locally if docker available; else stage-verify via local node+postgres

### Task 8: E2E verification
- [ ] `tsc` clean: server + root build
- [ ] Browser: login 3 roles; click every sidebar link on all 3 dashboards; client books plot + submits payment; admin verifies payment; agent sees commission; agent requests payout; admin processes; leaderboard/network reflect seed
- [ ] Fix everything found; then present for approval (no push until approved)
