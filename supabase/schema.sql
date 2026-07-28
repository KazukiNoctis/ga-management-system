-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Branches Table
create table public.branches (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  location text not null,
  created_at timestamptz default now()
);

-- 2. Profiles Table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  branch_id uuid references public.branches,
  role text check (role in ('staff', 'admin')) default 'staff',
  created_at timestamptz default now()
);

-- 3. Checking Forms Table
create table public.checking_forms (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  branch_id uuid references public.branches not null,
  title text not null,
  image_url text,
  note text,
  created_at timestamptz default now()
);

-- 4. Expenses Table
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  branch_id uuid references public.branches not null,
  title text not null,
  amount numeric(12,2) not null,
  image_url text,
  description text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.branches enable row level security;
alter table public.profiles enable row level security;
alter table public.checking_forms enable row level security;
alter table public.expenses enable row level security;

-- RLS for branches
create policy "Allow SELECT for all authenticated users"
  on public.branches for select to authenticated using (true);

create policy "Allow INSERT/UPDATE/DELETE for admin only"
  on public.branches for all to authenticated 
  using (
    exists (
      select 1 from public.profiles 
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS for profiles
create policy "Staff can SELECT own profile, admin can see same branch"
  on public.profiles for select to authenticated 
  using (
    id = auth.uid() or 
    exists (
      select 1 from public.profiles admin_profile
      where admin_profile.id = auth.uid() 
      and admin_profile.role = 'admin' 
      and admin_profile.branch_id = profiles.branch_id
    )
  );

create policy "Allow INSERT for authenticated"
  on public.profiles for insert to authenticated with check (id = auth.uid());

create policy "Allow UPDATE own profile"
  on public.profiles for update to authenticated using (id = auth.uid());

-- RLS for checking_forms
create policy "Staff can CRUD own checking_forms, admin read branch"
  on public.checking_forms for all to authenticated
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() 
      and p.role = 'admin' 
      and p.branch_id = checking_forms.branch_id
    )
  );

-- RLS for expenses
create policy "Staff can CRUD own expenses, admin read branch"
  on public.expenses for all to authenticated
  using (
    user_id = auth.uid() or
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() 
      and p.role = 'admin' 
      and p.branch_id = expenses.branch_id
    )
  );

-- Storage Buckets (Comments)
-- insert into storage.buckets (id, name, public) values ('checking-forms', 'checking-forms', true);
-- insert into storage.buckets (id, name, public) values ('receipts', 'receipts', true);

-- Seed Data
insert into public.branches (name, location) values
  ('Head Office', 'Jakarta'),
  ('Branch Surabaya', 'Surabaya'),
  ('Branch Bandung', 'Bandung');
