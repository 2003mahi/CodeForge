-- ============================================================
-- FIX: Add missing INSERT policy on users table
-- Without this, upsert (which does INSERT for new rows) was
-- silently blocked by RLS, causing streak/problems_solved = 0
-- ============================================================

-- 1. Add the missing INSERT policy (the root cause of the bug)
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'Users can insert own row'
  ) then
    execute 'create policy "Users can insert own row" on public.users
      for insert with check (auth.uid() = id)';
  end if;
end$$;

-- 2. Create a SECURITY DEFINER function so the server can always
--    upsert user stats regardless of RLS (bypasses RLS safely).
--    This is the correct pattern for server-side stat writes.
create or replace function public.upsert_user_stats(
  p_user_id   uuid,
  p_email     text,
  p_name      text
)
returns void
language plpgsql
security definer   -- runs as the DB owner, bypasses RLS
set search_path = public
as $$
declare
  v_problems_solved integer := 0;
  v_total_xp        integer := 0;
  v_streak          integer := 0;
  v_day             date;
  v_today           date := current_date;
  v_yesterday       date := current_date - interval '1 day';
  v_day_set         text[];
begin
  -- Count distinct solved problems and sum XP
  select
    count(distinct problem_id),
    coalesce(sum(xp), 0)
  into v_problems_solved, v_total_xp
  from user_submissions
  where user_id = p_user_id
    and status = 'solved';

  -- Build set of days that had a solved submission (use updated_at)
  select array_agg(distinct (updated_at at time zone 'Asia/Kolkata')::date::text)
  into v_day_set
  from user_submissions
  where user_id = p_user_id
    and status = 'solved';

  v_day_set := coalesce(v_day_set, array[]::text[]);

  -- Compute streak: walk backwards from today (or yesterday)
  if v_today::text = any(v_day_set) then
    v_day := v_today;
  elsif v_yesterday::text = any(v_day_set) then
    v_day := v_yesterday;
  else
    v_day := null; -- no recent activity, streak = 0
  end if;

  if v_day is not null then
    loop
      exit when not (v_day::text = any(v_day_set));
      v_streak := v_streak + 1;
      v_day := v_day - interval '1 day';
    end loop;
  end if;

  -- Upsert the users row (security definer bypasses RLS)
  insert into public.users (id, email, name, total_xp, problems_solved, streak, updated_at)
  values (p_user_id, p_email, p_name, v_total_xp, v_problems_solved, v_streak, now())
  on conflict (id) do update set
    email          = excluded.email,
    name           = excluded.name,
    total_xp       = excluded.total_xp,
    problems_solved = excluded.problems_solved,
    streak         = excluded.streak,
    updated_at     = excluded.updated_at;
end;
$$;

-- Grant execute to authenticated users so the API can call it
grant execute on function public.upsert_user_stats(uuid, text, text) to authenticated;
