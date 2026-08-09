import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, total_xp, streak')
    .order('total_xp', { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = (data || []).map((u, i) => ({
    rank: i + 1,
    id: u.id,
    name: u.name || u.email?.split('@')[0] || 'User',
    avatar: (u.name || u.email?.split('@')[0] || 'U').charAt(0).toUpperCase(),
    xp: u.total_xp,
    streak: u.streak,
    isCurrentUser: !authError && user ? user.id === u.id : false,
  }));

  return NextResponse.json({ data: rows });
}
