-- Phase 1 foundation: user profiles, business profiles, memberships, and tenant isolation.
-- Run once in the Supabase SQL editor or using the project's migration workflow.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 120),
  business_type text check (business_type is null or length(business_type) <= 80),
  contact_email text,
  phone text,
  address text,
  gstin text check (gstin is null or length(gstin) <= 20),
  logo_url text,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  unique (business_id, user_id)
);

create index if not exists businesses_created_by_idx on public.businesses(created_by);
create index if not exists business_members_user_business_idx on public.business_members(user_id, business_id);
create index if not exists business_members_business_role_idx on public.business_members(business_id, role);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Security-definer helpers prevent recursive RLS policy evaluation through business_members.
create or replace function public.has_business_access(p_business_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = p_business_id
      and bm.user_id = (select auth.uid())
  );
$$;

create or replace function public.has_business_role(p_business_id uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.business_members bm
    where bm.business_id = p_business_id
      and bm.user_id = (select auth.uid())
      and bm.role = any(p_roles)
  );
$$;

revoke all on function public.has_business_access(uuid) from public;
revoke all on function public.has_business_role(uuid, text[]) from public;
grant execute on function public.has_business_access(uuid) to authenticated;
grant execute on function public.has_business_role(uuid, text[]) to authenticated;

-- Enforce the three-created-business limit even when simultaneous requests race.
create or replace function public.enforce_business_creation_limit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_count integer;
begin
  perform pg_advisory_xact_lock(hashtext(new.created_by::text));

  select count(*)::integer
    into current_count
    from public.businesses b
   where b.created_by = new.created_by;

  if current_count >= 3 then
    raise exception 'business_limit_reached' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

drop trigger if exists businesses_limit_before_insert on public.businesses;
create trigger businesses_limit_before_insert
before insert on public.businesses
for each row execute function public.enforce_business_creation_limit();

-- The creator cannot be changed after creation to avoid silently changing ownership or bypassing the limit.
create or replace function public.prevent_business_creator_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.created_by is distinct from old.created_by then
    raise exception 'business_creator_immutable' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists businesses_creator_immutable on public.businesses;
create trigger businesses_creator_immutable
before update of created_by on public.businesses
for each row execute function public.prevent_business_creator_change();

-- Every created business starts with its creator as the owner membership.
create or replace function public.add_business_creator_membership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.business_members (business_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict (business_id, user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists businesses_add_creator_membership on public.businesses;
create trigger businesses_add_creator_membership
after insert on public.businesses
for each row execute function public.add_business_creator_membership();

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.business_members enable row level security;

drop policy if exists profiles_read_self on public.profiles;
create policy profiles_read_self on public.profiles
for select to authenticated
using (id = (select auth.uid()));

drop policy if exists profiles_insert_self on public.profiles;
create policy profiles_insert_self on public.profiles
for insert to authenticated
with check (id = (select auth.uid()));

drop policy if exists profiles_update_self on public.profiles;
create policy profiles_update_self on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists businesses_read_members on public.businesses;
create policy businesses_read_members on public.businesses
for select to authenticated
using (public.has_business_access(id));

drop policy if exists businesses_create_self on public.businesses;
create policy businesses_create_self on public.businesses
for insert to authenticated
with check (created_by = (select auth.uid()));

drop policy if exists businesses_update_owners on public.businesses;
create policy businesses_update_owners on public.businesses
for update to authenticated
using (public.has_business_role(id, array['owner', 'admin']::text[]))
with check (public.has_business_role(id, array['owner', 'admin']::text[]));

drop policy if exists businesses_delete_owners on public.businesses;
create policy businesses_delete_owners on public.businesses
for delete to authenticated
using (public.has_business_role(id, array['owner']::text[]));

drop policy if exists business_members_read_authorized on public.business_members;
create policy business_members_read_authorized on public.business_members
for select to authenticated
using (
  user_id = (select auth.uid())
  or public.has_business_role(business_id, array['owner', 'admin']::text[])
);

-- Membership mutations are deliberately not exposed in Phase 1.
-- The business creator's owner membership is written only by the security-definer trigger above.
-- Future team/invitation features should add carefully validated server-side membership actions.
drop policy if exists business_members_insert_managers on public.business_members;
drop policy if exists business_members_update_managers on public.business_members;
drop policy if exists business_members_delete_managers on public.business_members;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.businesses to authenticated;
grant select on public.business_members to authenticated;
