-- Enable UUID extension
create extension if not exists "uuid-ossp";
-- Enable UUID extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- Supabase Migration: Create core tables for interview platform
-- Run with: supabase db push or from Supabase dashboard

create schema if not exists public;

-- Profiles table (basic user info)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  full_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Templates table (interview templates)
create table if not exists public.templates (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  questions jsonb not null, -- array of question objects
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Interviews table (instances of a template used by a profile)
create table if not exists public.interviews (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null,
  status text default 'pending',
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Interview Questions table (individual answers linked to an interview)
create table if not exists public.interview_questions (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid references public.interviews(id) on delete cascade,
  question_text text not null,
  answer_text text,
  "order" integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for fast lookup
create index if not exists idx_interviews_profile on public.interviews(profile_id);
create index if not exists idx_interview_questions_interview on public.interview_questions(interview_id);

-- Trigger to update `updated_at` on row change
create or replace function public.update_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.update_timestamp();
create trigger trg_templates_updated before update on public.templates for each row execute function public.update_timestamp();
create trigger trg_interviews_updated before update on public.interviews for each row execute function public.update_timestamp();
create trigger trg_interview_questions_updated before update on public.interview_questions for each row execute function public.update_timestamp();

-- Run with: supabase db push or from Supabase dashboard

create schema if not exists public;

-- Profiles table (basic user info)
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  full_name text,
  avatar_url text,
  role text default 'user',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Templates table (interview templates)
create table if not exists public.templates (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  questions jsonb not null, -- array of question objects
  created_by uuid references public.profiles(id),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Interviews table (instances of a template used by a profile)
create table if not exists public.interviews (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references public.profiles(id) on delete cascade,
  template_id uuid references public.templates(id) on delete set null,
  status text default 'pending',
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Interview Questions table (individual answers linked to an interview)
create table if not exists public.interview_questions (
  id uuid primary key default uuid_generate_v4(),
  interview_id uuid references public.interviews(id) on delete cascade,
  question_text text not null,
  answer_text text,
  "order" integer,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Indexes for fast lookup
create index if not exists idx_interviews_profile on public.interviews(profile_id);
create index if not exists idx_interview_questions_interview on public.interview_questions(interview_id);

-- Trigger to update `updated_at` on row change
create or replace function public.update_timestamp()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated before update on public.profiles for each row execute function public.update_timestamp();
create trigger trg_templates_updated before update on public.templates for each row execute function public.update_timestamp();
create trigger trg_interviews_updated before update on public.interviews for each row execute function public.update_timestamp();
create trigger trg_interview_questions_updated before update on public.interview_questions for each row execute function public.update_timestamp();
