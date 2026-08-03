// scripts/seedTemplates.ts
import { createClient } from '@supabase/supabase-js';
import { mockInterviews } from '../lib/mockData';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Supabase URL or Anon Key not set in environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function seedTemplates() {
  console.log('Seeding templates...');
  // Clear existing templates (optional)
  await supabase.from('templates').delete().neq('id', '');

  const { data, error } = await supabase.from('templates').upsert(
    mockInterviews.map((interview) => ({
      id: interview.id,
      company: interview.company,
      type: interview.type,
      difficulty: interview.difficulty,
      duration: interview.duration,
      questions: interview.questions,
    }))
  );

  if (error) {
    console.error('Error seeding templates:', error);
    process.exit(1);
  }
  console.log('Seeded', (data as any)?.length ?? 0, 'templates');
}

seedTemplates().then(() => process.exit(0));
