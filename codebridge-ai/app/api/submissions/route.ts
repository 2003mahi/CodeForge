import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';

type SubmissionPayload = {
  problemId: string;
  problemTitle?: string;
  language: string;
  code: string;
  status?: 'attempted' | 'solved';
  output?: string;
  xp?: number;
};

const localDateStr = (d: Date) => {
  const offset = d.getTimezoneOffset() * 60 * 1000;
  return new Date(d.getTime() - offset).toISOString().split('T')[0];
};

async function refreshUserStats(supabase: SupabaseClient, userId: string, name: string, email?: string) {
  console.log(`[refreshUserStats] Refreshing stats for user ${userId} (${name})...`);

  // Try RPC first for security definer context (bypasses RLS issues)
  const { error: rpcError } = await supabase.rpc('upsert_user_stats', {
    p_user_id: userId,
    p_email: email ?? null,
    p_name: name
  });

  if (!rpcError) {
    console.log('[refreshUserStats] RPC upsert_user_stats completed successfully.');
    return;
  }

  console.warn('[refreshUserStats] RPC upsert_user_stats failed or doesn\'t exist, falling back to manual calculation. Error:', rpcError);

  // Distinct solved problems -> problems_solved + total_xp
  const { data: solved, error: solvedError } = await supabase
    .from('user_submissions')
    .select('problem_id, xp')
    .eq('user_id', userId)
    .eq('status', 'solved');

  if (solvedError) {
    console.error('[refreshUserStats] Error fetching solved submissions for stats:', solvedError);
  }

  const byProblem: Record<string, number> = {};
  (solved || []).forEach((r) => {
    if (!(r.problem_id in byProblem)) byProblem[r.problem_id] = r.xp || 0;
  });
  const problems_solved = Object.keys(byProblem).length;
  const total_xp = Object.values(byProblem).reduce((a, b) => a + b, 0);

  // Streak from consecutive days with a solved submission
  // Use updated_at (not created_at) because on upsert only updated_at changes
  const { data: solvedDates, error: solvedDatesError } = await supabase
    .from('user_submissions')
    .select('updated_at')
    .eq('user_id', userId)
    .eq('status', 'solved')
    .order('updated_at', { ascending: false })
    .limit(500);

  if (solvedDatesError) {
    console.error('[refreshUserStats] Error fetching solved dates for stats:', solvedDatesError);
  }

  const daySet = new Set((solvedDates || []).map((r) => localDateStr(new Date(r.updated_at))));
  let streak = 0;
  let d = new Date();
  // Allow streak if user solved today OR yesterday (grace period for timezones)
  const todayStr = localDateStr(d);
  const yesterdayDate = new Date(d);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayStr = localDateStr(yesterdayDate);
  if (!daySet.has(todayStr)) {
    if (daySet.has(yesterdayStr)) {
      d = yesterdayDate;
    } else {
      d.setDate(d.getDate() - 1); // will fail the while check, streak = 0
    }
  }
  while (daySet.has(localDateStr(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  console.log(`[refreshUserStats] Calculated manual stats - solved: ${problems_solved}, total_xp: ${total_xp}, streak: ${streak}. Performing manual upsert...`);

  const { error: upsertError } = await supabase.from('users').upsert(
    {
      id: userId,
      email: email ?? null,
      name,
      total_xp,
      problems_solved,
      streak,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (upsertError) {
    console.error('[refreshUserStats] Manual upsert to users table failed:', upsertError);
  } else {
    console.log('[refreshUserStats] Manual upsert to users table completed successfully.');
  }
}

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('user_submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: SubmissionPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.problemId || !body.language || !body.code) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const status = body.status === 'solved' ? 'solved' : 'attempted';
  const xp = Math.max(0, Number(body.xp) || 0);

  // Never downgrade a solved submission to attempted (race-safe)
  const { data: existing } = await supabase
    .from('user_submissions')
    .select('status')
    .eq('user_id', user.id)
    .eq('problem_id', body.problemId)
    .eq('language', body.language)
    .maybeSingle();

  const finalStatus = existing?.status === 'solved' ? 'solved' : status;

  const { data, error } = await supabase
    .from('user_submissions')
    .upsert(
      {
        user_id: user.id,
        problem_id: body.problemId,
        problem_title: body.problemTitle ?? null,
        language: body.language,
        code: body.code,
        status: finalStatus,
        output: body.output ?? null,
        xp,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,problem_id,language' }
    )
    .select()
    .single();

  if (error) {
    console.error('[API /api/submissions POST] user_submissions upsert failed:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Always refresh stats so the users row is always created and up-to-date
  const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  await refreshUserStats(supabase, user.id, name, user.email ?? undefined);

  return NextResponse.json({ data }, { status: 200 });
}
