import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: submissions, error: submissionsError } = await supabase
    .from('user_submissions')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (submissionsError) {
    console.error('[API /api/me] user_submissions fetch error:', submissionsError);
  }

  const { data: statsRow, error: statsError } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (statsError) {
    console.error('[API /api/me] users fetch error:', statsError);
  }

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: displayName,
      avatar: displayName.charAt(0).toUpperCase(),
      total_xp: statsRow?.total_xp ?? 0,
      problems_solved: statsRow?.problems_solved ?? 0,
      streak: statsRow?.streak ?? 0,
      created_at: user.created_at,
    },
    submissions: submissions || [],
  });
}
