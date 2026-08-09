-- User stats for real-time dashboard / leaderboard

-- Track XP earned per solved submission
alter table public.user_submissions add column if not exists xp integer not null default 0;

-- Users stats table (real-time XP / streak / problems solved)
create table if not exists public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  name text,
  avatar text,
  total_xp integer not null default 0,
  problems_solved integer not null default 0,
  streak integer not null default 0,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

alter table public.users enable row level security;

-- Users can read/update their own stats row
create policy "Users can read own row" on public.users
  for select using (auth.uid() = id);

create policy "Users can update own row" on public.users
  for update using (auth.uid() = id);

-- Public read access for the leaderboard (name / xp / streak only)
create policy "Leaderboard read access" on public.users
  for select using (true);

-- Auto-create a user stats row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.users (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create index if not exists idx_user_submissions_problem on public.user_submissions(user_id, problem_id);
