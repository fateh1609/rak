# RAK Oasis — VPS Deployment Runbook

Full-stack deployment: PostgreSQL + Express API + nginx-served React SPA, all via Docker Compose.

## Architecture

```
Internet ──► nginx (:80/:443)
              ├── /            → React SPA (static build)
              └── /api/*       → Express API (:4000) ──► PostgreSQL (:5432, internal)
```

## 1. Provision a VPS

- Ubuntu 22.04 LTS (or newer), 1 vCPU / 2 GB RAM minimum
- Point your domain's A record at the VPS IP (optional but needed for TLS)

## 2. Install Docker

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # log out & back in
```

## 3. Clone & configure

```bash
git clone https://github.com/fateh1609/RAKOasis.git
cd RAKOasis
cp .env.example .env
nano .env
```

Set in `.env`:

| Variable | Required | Notes |
|---|---|---|
| `POSTGRES_PASSWORD` | ✅ | Strong random password |
| `JWT_SECRET` | ✅ | `openssl rand -hex 32` |
| `GEMINI_API_KEY` | optional | AI advisor; degrades gracefully without it |
| `USDT_INR_RATE` | optional | Default 92 |
| `SEED_PASSWORD` | optional | Password for seeded demo accounts |
| `WEB_PORT` | optional | Default 80 |

## 4. Launch

```bash
docker compose up -d --build
```

On first boot the API container automatically:
1. Applies SQL migrations (`server/migrations/*.sql`)
2. Runs the idempotent seed (admin/agent/client accounts, 24 plots, demo booking + commission chain)
3. Starts the API on the internal network

Check status:

```bash
docker compose ps
docker compose logs -f api
curl http://localhost/api/health     # → {"ok":true}
```

## 5. Log in

Open `http://YOUR_SERVER_IP/`. Seeded accounts (password = `SEED_PASSWORD`, default `RakOasis@2026`):

| Role | Email |
|---|---|
| Admin | `admin@rakoasis.com` |
| Agent | `agent@rakoasis.com` (code `AGT-10523`, 3-level upline seeded) |
| Client | `client@rakoasis.com` (sponsored by the agent) |

> **Change these passwords immediately in production** — or set a strong `SEED_PASSWORD` before first boot.

## 6. TLS (recommended)

Simplest path — host-level Caddy or certbot in front of the compose stack:

```bash
# Option A: certbot + nginx on the host proxying to WEB_PORT=8080
sudo apt install certbot python3-certbot-nginx
# set WEB_PORT=8080 in .env, docker compose up -d, then configure host nginx
# with server_name yourdomain.com proxying to 127.0.0.1:8080 and run:
sudo certbot --nginx -d yourdomain.com
```

## 7. Operations

```bash
# Update to latest code
git pull && docker compose up -d --build

# Database backup
docker compose exec db pg_dump -U rakoasis rakoasis > backup_$(date +%F).sql

# Restore
cat backup_YYYY-MM-DD.sql | docker compose exec -T db psql -U rakoasis rakoasis

# Logs
docker compose logs -f api
docker compose logs -f web
```

## Local development (no Docker for app code)

```bash
# 1. Database only
docker compose up -d db          # or any local Postgres

# 2. API (terminal 1)
cd server && npm install && npm run dev
#    env: DATABASE_URL=postgres://rakoasis:<pw>@localhost:5432/rakoasis JWT_SECRET=dev

# 3. Frontend (terminal 2) — vite dev server proxies /api → localhost:4000
npm install && npm run dev
```

## Environment reference

Backend (`server/.env.example`): `DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`, `PORT`, `USDT_INR_RATE`, `SEED_PASSWORD`.
Frontend build: `VITE_API_URL` (defaults to `/api`, correct for the compose/nginx setup).
