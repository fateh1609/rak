
-- RAK OASIS - DATABASE SCHEMA V1.0
-- Based on Technical Specification PDF

-- 1. PROFILES (Unified Agents/Clients/Admins)
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  email text unique,
  mobile text,
  role text check (role in ('client', 'agent', 'admin')),
  agent_code text unique, -- Auto-generated for agents
  sponsor_id uuid references profiles(id), -- Genealogy linkage
  rank int default 1,
  wallet_balance numeric default 0,
  kyc_verified boolean default false,
  wallet_address_trc20 text,
  wallet_address_erc20 text,
  created_at timestamptz default now()
);

-- 2. PLOTS (Inventory)
create table plots (
  id uuid default uuid_generate_v4() primary key,
  plot_number text unique not null,
  block text not null,
  type text not null, -- Standard, Garden, Corner
  size_sqft numeric default 1000,
  price_aed numeric not null,
  price_inr numeric not null,
  status text default 'AVAILABLE' check (status in ('AVAILABLE', 'RESERVED', 'SOLD', 'FORFEITED')),
  owner_id uuid references profiles(id)
);

-- 3. PAYMENTS (Inbound)
create table payments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id),
  amount numeric not null,
  currency text default 'INR',
  method text, -- Razorpay, Crypto, Bank
  status text default 'pending',
  transaction_ref text, -- Razorpay ID or Hash
  verified_by uuid references profiles(id),
  created_at timestamptz default now()
);

-- 4. COMMISSIONS (The Ledger)
create table commissions (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references profiles(id),
  source_payment_id uuid references payments(id),
  amount numeric not null,
  type text check (type in ('UNILEVEL', 'INFINITY', 'LEADERBOARD')),
  level int, -- 1-5 for unilevel
  status text default 'calculated_pending_approval',
  created_at timestamptz default now()
);

-- 5. PAYOUTS (Outbound USDT)
create table payout_requests (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references profiles(id),
  amount_inr numeric not null,
  amount_usdt numeric not null,
  network text default 'TRC20',
  wallet_address text not null,
  status text default 'pending_approval',
  tx_hash text,
  created_at timestamptz default now()
);

-- RLS POLICIES (Section 7.2)

alter table profiles enable row level security;
alter table commissions enable row level security;

-- Agents can see their own profile
create policy "Agents can see own profile" on profiles
  for select using (auth.uid() = id);

-- Agents can see their own commissions
create policy "Agents see own commissions" on commissions
  for select using (auth.uid() = agent_id);

-- Admins can see everything (Simplified)
-- In production, use a secure function to check admin role
