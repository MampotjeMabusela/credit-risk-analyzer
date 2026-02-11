-- Core schema for AI Credit Risk Analyzer (Supabase Postgres)

-- Clients / applicants
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  external_id text,
  name text not null,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

-- Credit applications
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  product_type text,
  requested_amount numeric,
  currency text default 'ZAR',
  status text default 'pending',
  created_at timestamptz not null default now()
);

-- Raw / semi-structured financial inputs (bank statements, etc.)
create table if not exists financial_data (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  source_type text, -- csv, excel, api, bureau, etc.
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Model outputs for each scoring run
create table if not exists model_runs (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  model_name text not null, -- e.g. pd_xgb_v1
  pd numeric,
  lgd numeric,
  ead numeric,
  score jsonb, -- any additional outputs or calibration info
  created_at timestamptz not null default now()
);

-- Final decision and pricing per application
create table if not exists decisions (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references applications(id) on delete cascade,
  decision text not null, -- approve, review, decline
  credit_limit numeric,
  interest_rate numeric,
  reasons text[], -- reason codes / messages
  created_at timestamptz not null default now()
);

-- Model monitoring snapshots (for drift / performance)
create table if not exists monitoring_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null,
  model_name text not null,
  metric jsonb not null, -- e.g. {psi: 0.12, auc: 0.79}
  created_at timestamptz not null default now()
);

-- Audit log for compliance
create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid, -- supabase auth user id
  action text not null,
  entity_type text,
  entity_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);

