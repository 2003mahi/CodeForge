-- User code submissions table (for Playground)
-- Stores the last successfully-run / submitted code per user, problem and language.
create table if not exists public.user_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  problem_id text not null,
  problem_title text,
  language text not null default 'python',
  code text not null,
  status text not null default 'attempted', -- 'attempted' | 'solved'
  output text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique (user_id, problem_id, language)
);

alter table public.user_submissions enable row level security;

create policy "Users can select own submissions" on public.user_submissions
  for select using (auth.uid() = user_id);

create policy "Users can insert own submissions" on public.user_submissions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own submissions" on public.user_submissions
  for update using (auth.uid() = user_id);

create index if not exists idx_user_submissions_user on public.user_submissions(user_id);
