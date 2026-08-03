import { supabase } from '@/app/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  const { data, error } = await supabase.from('templates').select('*');
  if (error) {
    console.error('Supabase fetch error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
