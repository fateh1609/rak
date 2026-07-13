-- RAK OASIS - SELF-HOSTED SCHEMA V2.0
-- Replaces Supabase schema (lib/schema.sql). Authorization enforced in API layer.

create extension if not exists pgcrypto;

-- 1. PROFILES (Unified Agents/Clients/Admins)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text unique not null,
  password_hash text not null,
  mobile text,
  role text not null check (role in ('client', 'agent', 'admin')),
  agent_code text unique,          -- Auto-generated for agents
  sponsor_id uuid references profiles(id), -- Genealogy linkage
  rank int not null default 1,
  wallet_balance numeric not null default 0,
  kyc_verified boolean not null default false,
  status text not null default 'active' check (status in ('pending', 'active', 'suspended')),
  wallet_address_trc20 text,
  wallet_address_erc20 text,
  created_at timestamptz not null default now()
);

-- 2. PLOTS (Inventory)
create table if not exists plots (
  id uuid primary key default gen_random_uuid(),
  plot_number text unique not null,
  block text not null,
  type text not null check (type in ('Standard', 'Garden Facing', 'Corner Plot')),
  size_sqft numeric not null default 1000,
  price_aed numeric not null,
  price_inr numeric not null,
  status text not null default 'AVAILABLE' check (status in ('AVAILABLE', 'RESERVED', 'SOLD', 'FORFEITED')),
  owner_id uuid references profiles(id)
);

-- 3. BOOKINGS (Client purchases; frontend already models this)
create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  plot_id uuid not null references plots(id),
  status text not null default 'PENDING_VERIFICATION'
    check (status in ('PENDING_VERIFICATION', 'CONFIRMED', 'CANCELLED')),
  booking_date timestamptz not null default now(),
  total_amount numeric not null,       -- INR
  paid_amount numeric not null default 0,
  next_emi_date date,
  strike_count int not null default 0  -- 3-Strike rule
);

-- 4. PAYMENTS (Inbound)
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  booking_id uuid references bookings(id),
  amount numeric not null,             -- INR
  currency text not null default 'INR',
  method text,                          -- RAZORPAY | USDT_TRC20 | BANK_TRANSFER
  status text not null default 'pending' check (status in ('pending', 'verified', 'rejected')),
  transaction_ref text,
  verified_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- 5. COMMISSIONS (Ledger)
create table if not exists commissions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references profiles(id),
  source_payment_id uuid references payments(id),
  amount numeric not null,
  type text not null check (type in ('UNILEVEL', 'INFINITY', 'LEADERBOARD')),
  level int,
  status text not null default 'calculated_pending_approval'
    check (status in ('calculated_pending_approval', 'approved', 'paid')),
  created_at timestamptz not null default now()
);

-- 6. PAYOUTS (Outbound USDT)
create table if not exists payout_requests (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references profiles(id),
  amount_inr numeric not null,
  amount_usdt numeric not null,
  network text not null default 'TRC20' check (network in ('TRC20', 'ERC20')),
  wallet_address text not null,
  status text not null default 'pending_approval'
    check (status in ('pending_approval', 'processing', 'completed', 'rejected')),
  tx_hash text,
  created_at timestamptz not null default now()
);

-- 7. UPDATES (Announcements shown on client/agent portals)
create table if not exists updates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text not null default 'all' check (audience in ('all', 'client', 'agent')),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- 8. TICKETS (Support)
create table if not exists tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id),
  subject text not null,
  message text not null,
  status text not null default 'open' check (status in ('open', 'in_progress', 'closed')),
  admin_reply text,
  created_at timestamptz not null default now()
);

create index if not exists idx_profiles_sponsor on profiles(sponsor_id);
create index if not exists idx_bookings_user on bookings(user_id);
create index if not exists idx_payments_booking on payments(booking_id);
create index if not exists idx_commissions_agent on commissions(agent_id);
create index if not exists idx_payouts_agent on payout_requests(agent_id);
