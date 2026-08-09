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
  // Distinct solved problems -> problems_solved + total_xp
  const { data: solved } = await supabase
    .from('user_submissions')
    .select('problem_id, xp')
    .eq('user_id', userId)
    .eq('status', 'solved');

  const byProblem: Record<string, number> = {};
  (solved || []).forEach((r) => {
    if (!(r.problem_id in byProblem)) byProblem[r.problem_id] = r.xp || 0;
  });
  const problems_solved = Object.keys(byProblem).length;
  const total_xp = Object.values(byProblem).reduce((a, b) => a + b, 0);

  // Streak from consecutive days with a solved submission
  const { data: solvedDates } = await supabase
    .from('user_submissions')
    .select('created_at')
    .eq('user_id', userId)
    .eq('status', 'solved')
    .order('created_at', { ascending: false })
    .limit(500);

  const daySet = new Set((solvedDates || []).map((r) => localDateStr(new Date(r.created_at))));
  let streak = 0;
  let d = new Date();
  if (!daySet.has(localDateStr(d))) d.setDate(d.getDate() - 1);
  while (daySet.has(localDateStr(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }

  await supabase.from('users').upsert(
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

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (finalStatus === 'solved') {
    const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
    await refreshUserStats(supabase, user.id, name, user.email ?? undefined);
  }

  return NextResponse.json({ data }, { status: 200 });
}
