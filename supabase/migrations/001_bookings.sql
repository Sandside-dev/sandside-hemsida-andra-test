create table if not exists public.bookings (
  starts_at timestamptz primary key,
  duration_minutes integer not null check (duration_minutes > 0),
  name text not null,
  company text not null,
  email text not null,
  needs text,
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed', 'not_configured')),
  created_at timestamptz not null default now()
);

create table if not exists public.blocked_slots (
  starts_at timestamptz primary key,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.blocked_dates (
  blocked_date date primary key,
  reason text,
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;
alter table public.blocked_slots enable row level security;
alter table public.blocked_dates enable row level security;

-- No public policies are created. The website connects only from server code.
-- The primary key on bookings.starts_at prevents simultaneous double bookings.
