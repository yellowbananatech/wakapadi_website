-- Wakapadi initial schema (tables + RLS + triggers)
-- Apply in Supabase SQL Editor, or via `supabase db push` if you later adopt the CLI workflow.

-- =========================
-- Helpers
-- =========================

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.is_admin = true
  );
$$;

-- =========================
-- Profiles (1:1 with auth.users)
-- =========================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (id = auth.uid() or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (id = auth.uid() or public.is_admin())
with check (id = auth.uid() or public.is_admin());

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- =========================
-- Bookings
-- =========================

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  service text not null,
  status text not null default 'pending',
  progress integer not null default 0,
  next_step text,
  booked_for date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_bookings_updated_at on public.bookings;
create trigger set_bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

alter table public.bookings enable row level security;

drop policy if exists "bookings_select_own_or_admin" on public.bookings;
create policy "bookings_select_own_or_admin"
on public.bookings
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own"
on public.bookings
for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "bookings_update_own_or_admin" on public.bookings;
create policy "bookings_update_own_or_admin"
on public.bookings
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "bookings_delete_own_or_admin" on public.bookings;
create policy "bookings_delete_own_or_admin"
on public.bookings
for delete
using (user_id = auth.uid() or public.is_admin());

-- =========================
-- Documents (metadata; file bytes can live in Storage)
-- =========================

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  name text not null,
  status text not null default 'pending_review',
  uploaded_on date not null default (now()::date),
  storage_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
before update on public.documents
for each row execute function public.set_updated_at();

alter table public.documents enable row level security;

drop policy if exists "documents_select_own_or_admin" on public.documents;
create policy "documents_select_own_or_admin"
on public.documents
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "documents_insert_own" on public.documents;
create policy "documents_insert_own"
on public.documents
for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "documents_update_own_or_admin" on public.documents;
create policy "documents_update_own_or_admin"
on public.documents
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "documents_delete_own_or_admin" on public.documents;
create policy "documents_delete_own_or_admin"
on public.documents
for delete
using (user_id = auth.uid() or public.is_admin());

-- =========================
-- Payments
-- =========================

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  service text not null,
  amount numeric not null default 0,
  currency text not null default 'USD',
  status text not null default 'pending',
  paid_at timestamptz,
  due_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at
before update on public.payments
for each row execute function public.set_updated_at();

alter table public.payments enable row level security;

drop policy if exists "payments_select_own_or_admin" on public.payments;
create policy "payments_select_own_or_admin"
on public.payments
for select
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own"
on public.payments
for insert
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "payments_update_own_or_admin" on public.payments;
create policy "payments_update_own_or_admin"
on public.payments
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "payments_delete_own_or_admin" on public.payments;
create policy "payments_delete_own_or_admin"
on public.payments
for delete
using (user_id = auth.uid() or public.is_admin());

-- =========================
-- Blog posts (admin-managed)
-- =========================

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  category text,
  read_time text,
  author text,
  author_role text,
  image_url text,
  content_html text not null default '',
  is_published boolean not null default true,
  published_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_blog_posts_updated_at on public.blog_posts;
create trigger set_blog_posts_updated_at
before update on public.blog_posts
for each row execute function public.set_updated_at();

alter table public.blog_posts enable row level security;

drop policy if exists "blog_posts_select_published_or_admin" on public.blog_posts;
create policy "blog_posts_select_published_or_admin"
on public.blog_posts
for select
using (is_published = true or public.is_admin());

drop policy if exists "blog_posts_insert_admin" on public.blog_posts;
create policy "blog_posts_insert_admin"
on public.blog_posts
for insert
with check (public.is_admin());

drop policy if exists "blog_posts_update_admin" on public.blog_posts;
create policy "blog_posts_update_admin"
on public.blog_posts
for update
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "blog_posts_delete_admin" on public.blog_posts;
create policy "blog_posts_delete_admin"
on public.blog_posts
for delete
using (public.is_admin());

-- =========================
-- Comments + Replies
-- =========================

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null default auth.uid(),
  content text not null,
  likes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_comments_updated_at on public.comments;
create trigger set_comments_updated_at
before update on public.comments
for each row execute function public.set_updated_at();

alter table public.comments enable row level security;

drop policy if exists "comments_select_published_posts" on public.comments;
create policy "comments_select_published_posts"
on public.comments
for select
using (
  exists (
    select 1 from public.blog_posts p
    where p.id = post_id
      and (p.is_published = true or public.is_admin())
  )
);

drop policy if exists "comments_insert_authed" on public.comments;
create policy "comments_insert_authed"
on public.comments
for insert
with check (auth.uid() is not null);

drop policy if exists "comments_update_own_or_admin" on public.comments;
create policy "comments_update_own_or_admin"
on public.comments
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "comments_delete_own_or_admin" on public.comments;
create policy "comments_delete_own_or_admin"
on public.comments
for delete
using (user_id = auth.uid() or public.is_admin());

create table if not exists public.comment_replies (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null default auth.uid(),
  content text not null,
  is_official boolean not null default false,
  likes integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_comment_replies_updated_at on public.comment_replies;
create trigger set_comment_replies_updated_at
before update on public.comment_replies
for each row execute function public.set_updated_at();

alter table public.comment_replies enable row level security;

drop policy if exists "replies_select_via_comment" on public.comment_replies;
create policy "replies_select_via_comment"
on public.comment_replies
for select
using (
  exists (
    select 1
    from public.comments c
    join public.blog_posts p on p.id = c.post_id
    where c.id = comment_id
      and (p.is_published = true or public.is_admin())
  )
);

drop policy if exists "replies_insert_authed" on public.comment_replies;
create policy "replies_insert_authed"
on public.comment_replies
for insert
with check (auth.uid() is not null);

drop policy if exists "replies_update_own_or_admin" on public.comment_replies;
create policy "replies_update_own_or_admin"
on public.comment_replies
for update
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "replies_delete_own_or_admin" on public.comment_replies;
create policy "replies_delete_own_or_admin"
on public.comment_replies
for delete
using (user_id = auth.uid() or public.is_admin());

