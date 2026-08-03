import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/app/lib/supabase';

type Question = {
  id: string;
  title: string;
  description?: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tags?: string[];
  source_url?: string;
  created_at?: string;
  updated_at?: string;
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') ?? undefined;
  const category = url.searchParams.get('category') ?? undefined;
  const difficulty = url.searchParams.get('difficulty') ?? undefined;
  const limit = Number(url.searchParams.get('limit') ?? '20');
  const offset = Number(url.searchParams.get('offset') ?? '0');

  let query = supabaseAdmin()
    .from('coding_questions')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) query = query.ilike('title', `%${search}%`);
  if (category) query = query.eq('category', category);
  if (difficulty) query = query.eq('difficulty', difficulty);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data, count });
}

export async function POST(request: Request) {
  const adminToken = process.env.NEXT_ADMIN_TOKEN;
  const authHeader = request.headers.get('authorization');
  if (!adminToken || authHeader !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body: Partial<Question> = await request.json();
  const { data, error } = await supabaseAdmin()
    .from('coding_questions')
    .insert([body])
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
